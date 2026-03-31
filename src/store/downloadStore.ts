import { create } from 'zustand';
import { LazyStore } from '@tauri-apps/plugin-store';

interface DownloadState {
  /** Map of song ID to local relative path or status */
  downloadedIds: Record<string, string>;
  /** IDs currently being downloaded */
  downloadingIds: Set<string>;
  initialized: boolean;
  init: () => Promise<void>;
  addDownloaded: (id: string, path: string) => Promise<void>;
  removeDownloaded: (id: string) => Promise<void>;
  setDownloading: (id: string, isDownloading: boolean) => void;
}

const store = new LazyStore('downloads.json');

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloadedIds: {},
  downloadingIds: new Set(),
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    try {
      const data = (await store.get<Record<string, string>>('downloadedIds')) || {};
      console.log('[DownloadStore] Initialized. Found', Object.keys(data).length, 'downloaded songs.');
      set({ downloadedIds: data, initialized: true });
    } catch (err) {
      console.error('[DownloadStore] Initialization failed:', err);
      set({ initialized: true });
    }
  },

  addDownloaded: async (id, path) => {
    const newDownloads = { ...get().downloadedIds, [id]: path };
    await store.set('downloadedIds', newDownloads);
    await store.save();
    set({ downloadedIds: newDownloads });
  },

  removeDownloaded: async (id) => {
    const newDownloads = { ...get().downloadedIds };
    delete newDownloads[id];
    await store.set('downloadedIds', newDownloads);
    await store.save();
    set({ downloadedIds: newDownloads });
  },

  setDownloading: (id, isDownloading) => {
    set((state) => {
      const next = new Set(state.downloadingIds);
      if (isDownloading) next.add(id);
      else next.delete(id);
      return { downloadingIds: next };
    });
  },
}));
