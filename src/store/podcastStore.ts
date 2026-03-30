import { create } from 'zustand';
import { load } from '@tauri-apps/plugin-store';

export interface LocalPodcast {
  id: string; // URL based or unique ID
  url: string;
  title: string;
  author?: string;
  description?: string;
  coverArt?: string;
  isLocal: boolean;
}

interface PodcastStore {
  localPodcasts: LocalPodcast[];
  isLoading: boolean;
  addPodcast: (podcast: LocalPodcast) => Promise<void>;
  removePodcast: (id: string) => Promise<void>;
  initializePodcasts: () => Promise<void>;
}

export const usePodcastStore = create<PodcastStore>((set, get) => ({
  localPodcasts: [],
  isLoading: true,

  addPodcast: async (podcast: LocalPodcast) => {
    try {
      const newList = [...get().localPodcasts, podcast];
      if (window.__TAURI__) {
        const store = await load('podcasts.json');
        await store.set('localPodcasts', newList);
        await store.save();
      } else {
        localStorage.setItem('yumusic-local-podcasts', JSON.stringify(newList));
      }
      set({ localPodcasts: newList });
    } catch (e) {
      console.error('Failed to add local podcast', e);
    }
  },

  removePodcast: async (id: string) => {
    try {
      const newList = get().localPodcasts.filter((p) => p.id !== id);
      if (window.__TAURI__) {
        const store = await load('podcasts.json');
        await store.set('localPodcasts', newList);
        await store.save();
      } else {
        localStorage.setItem('yumusic-local-podcasts', JSON.stringify(newList));
      }
      set({ localPodcasts: newList });
    } catch (e) {
      console.error('Failed to remove local podcast', e);
    }
  },

  initializePodcasts: async () => {
    set({ isLoading: true });
    try {
      let saved: LocalPodcast[] = [];
      if (window.__TAURI__) {
        const store = await load('podcasts.json');
        saved = (await store.get<LocalPodcast[]>('localPodcasts')) ?? [];
      } else {
        const local = localStorage.getItem('yumusic-local-podcasts');
        if (local) saved = JSON.parse(local);
      }
      set({ localPodcasts: saved, isLoading: false });
    } catch (e) {
      console.error('Failed to load local podcasts', e);
      set({ localPodcasts: [], isLoading: false });
    }
  }
}));
