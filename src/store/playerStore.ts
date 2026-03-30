import { create } from 'zustand';
import { SubsonicSong } from '@/hooks/useSubsonic';
import { SubsonicConfig, scrobbleSubsonic } from '@/services/apiClient';

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
    const streamUrl = `${baseUrl}rest/stream?${query.toString()}`;

    const newAudio = new Audio(streamUrl);
    newAudio.volume = get().volume;

    newAudio.addEventListener('play', () => set({ isPlaying: true }));
    newAudio.addEventListener('pause', () => set({ isPlaying: false }));
    newAudio.addEventListener('timeupdate', () => {
      const { hasScrobbled, currentSong, duration } = get();
      const currentTime = newAudio.currentTime;
      set({ progress: currentTime, duration: newAudio.duration || 0 });
      
      // Auto-scrobble at 50% duration (standard practice)
      if (!hasScrobbled && currentSong && duration > 0 && currentTime > duration / 2) {
        set({ hasScrobbled: true });
        scrobbleSubsonic(currentSong.id, config).catch((err) => console.error('Scrobble error:', err));
      }
    });

    newAudio.addEventListener('ended', () => {
      const { hasScrobbled, currentSong, repeatMode, setSong } = get();
      
      // Scrobble as a fallback if not already scrobbled
      if (!hasScrobbled && currentSong?.id) {
        set({ hasScrobbled: true });
        scrobbleSubsonic(currentSong.id, config).catch((err) => console.error('Scrobble error:', err));
      }
      
      if (repeatMode === 'one' && currentSong) {
        setSong(currentSong, config);
      } else {
        get().next(config);
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
