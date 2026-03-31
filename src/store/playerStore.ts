import { create } from 'zustand';
import { SubsonicSong } from '@/hooks/useSubsonic';
import { SubsonicConfig, scrobbleSubsonic } from '@/services/apiClient';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useDownloadStore } from './downloadStore';

interface PlayerState {
  currentSong: SubsonicSong | null;
  queue: SubsonicSong[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  audio: HTMLAudioElement | null;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  hasScrobbled: boolean;
  
  // Actions
  setSong: (song: SubsonicSong, config: SubsonicConfig) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  next: (config: SubsonicConfig) => void;
  previous: (config: SubsonicConfig) => void;
  addToQueue: (song: SubsonicSong) => void;
  setQueue: (queue: SubsonicSong[]) => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  audio: null,
  isShuffle: false,
  repeatMode: 'none',
  hasScrobbled: false,

  setSong: (song, config) => {
    const { audio } = get();
    if (audio) {
      audio.pause();
    }

    const query = new URLSearchParams({
      u: config.username,
      t: config.token,
      s: config.salt,
      v: '1.16.1',
      c: 'Yumusic',
      id: song.id,
    });

    const baseUrl = config.serverUrl.endsWith('/') ? config.serverUrl : `${config.serverUrl}/`;

    // Always attempt online streaming first; fall back to local file on error.
    const onlineUrl = song.streamUrl || `${baseUrl}rest/stream?${query.toString()}`;
    const newAudio = new Audio(onlineUrl);
    newAudio.volume = get().volume;

    newAudio.addEventListener('play', () => {
      set({ isPlaying: true });
      // Notify server "Now Playing" (submission = false)
      if (song.id) {
        scrobbleSubsonic(song.id, config, false).catch((err) => console.error('Now Playing notify error:', err));
      }
    });

    newAudio.addEventListener('pause', () => set({ isPlaying: false }));

    newAudio.addEventListener('timeupdate', () => {
      const { hasScrobbled, currentSong, duration } = get();
      const currentTime = newAudio.currentTime;
      set({ progress: currentTime, duration: newAudio.duration || 0 });

      // Auto-scrobble at 50% duration (standard practice)
      if (!hasScrobbled && currentSong && duration > 0 && currentTime > duration / 2) {
        set({ hasScrobbled: true });
        scrobbleSubsonic(currentSong.id, config, true, Date.now()).catch((err) => console.error('Scrobble submission error:', err));
      }
    });

    newAudio.addEventListener('ended', () => {
      const { hasScrobbled, currentSong, repeatMode, setSong } = get();

      // Scrobble as a fallback if not already scrobbled
      if (!hasScrobbled && currentSong?.id) {
        set({ hasScrobbled: true });
        scrobbleSubsonic(currentSong.id, config, true, Date.now()).catch((err) => console.error('Scrobble fallback error:', err));
      }

      if (repeatMode === 'one' && currentSong) {
        setSong(currentSong, config);
      } else {
        get().next(config);
      }
    });

    // Offline fallback: if the online stream fails, try the local downloaded file.
    newAudio.addEventListener('error', () => {
      const { downloadedIds } = useDownloadStore.getState();
      const localPath = downloadedIds[song.id];

      if (localPath && newAudio.src !== convertFileSrc(localPath)) {
        console.warn('[Player] Online stream failed, falling back to local file:', localPath);
        newAudio.src = convertFileSrc(localPath);
        newAudio.load();
        newAudio.play().catch((err) => console.error('[Player] Local file playback also failed:', err));
      } else {
        console.error('[Player] Playback failed and no local file is available for song:', song.id);
      }
    });

    set({ currentSong: song, audio: newAudio, isPlaying: true, hasScrobbled: false });
    newAudio.play();
  },


  play: () => {
    const { audio } = get();
    if (audio) {
      audio.play();
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      set({ isPlaying: false });
    }
  },

  togglePlay: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },

  setVolume: (volume) => {
    const { audio } = get();
    if (audio) {
      audio.volume = volume;
    }
    set({ volume });
  },

  setProgress: (progress) => {
    const { audio } = get();
    if (audio) {
      audio.currentTime = progress;
    }
    set({ progress });
  },

  next: (config) => {
    const { queue, currentSong, setSong, isShuffle, repeatMode } = get();
    if (queue.length === 0 || !currentSong) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setSong(queue[randomIndex], config);
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const isLast = currentIndex === queue.length - 1;

    if (isLast && repeatMode === 'none') {
      set({ isPlaying: false });
      return;
    }

    const nextIndex = (currentIndex + 1) % queue.length;
    setSong(queue[nextIndex], config);
  },

  previous: (config) => {
    const { queue, currentSong, setSong, isShuffle } = get();
    if (queue.length === 0 || !currentSong) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setSong(queue[randomIndex], config);
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setSong(queue[prevIndex], config);
  },

  addToQueue: (song) => {
    set((state) => ({ queue: [...state.queue, song] }));
  },

  setQueue: (queue) => {
    set({ queue });
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  setRepeatMode: (mode) => {
    set({ repeatMode: mode });
  },
}));
