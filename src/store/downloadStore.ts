import { create } from 'zustand';
import { LazyStore } from '@tauri-apps/plugin-store';
import { isTauri } from '@tauri-apps/api/core';

export interface DownloadItem {
  id: string;
  path: string;
  title: string;
  artist: string;
  coverArt?: string;
}

interface DownloadState {
  /** Map of song ID to local metadata and status */
  downloadedIds: Record<string, DownloadItem>;
  /** IDs currently being downloaded */
  downloadingIds: Set<string>;
  initialized: boolean;
  batchTotal: number;
  batchCompleted: number;
  init: () => Promise<void>;
  addDownloaded: (item: DownloadItem) => Promise<void>;
  removeDownloaded: (id: string) => Promise<void>;
  setDownloading: (id: string, isDownloading: boolean) => void;
  setBatchProgress: (completed: number, total?: number) => void;
}

// In-memory fallback for non-Tauri environments
let store: LazyStore | null = null;
if (isTauri()) {
  store = new LazyStore('downloads.json');
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloadedIds: {},
  downloadingIds: new Set(),
  initialized: false,
  batchTotal: 0,
  batchCompleted: 0,

  init: async () => {
    if (get().initialized) return;
    if (!isTauri() || !store) {
      set({ initialized: true });
      return;
    }
    
    try {
      const data = (await store.get<Record<string, any>>('downloadedIds')) || {};
      
      // Migration/Fallback: If it is a simple string map, it was an old version.
      // We will handle it by keeping it as-is but providing dummies for now.
      const normalizedData: Record<string, DownloadItem> = {};
      Object.entries(data).forEach(([id, value]) => {
        if (typeof value === 'string') {
          normalizedData[id] = { id, path: value, title: 'Downloaded Song', artist: 'Unknown' };
        } else {
          normalizedData[id] = value;
        }
      });

      console.log('[DownloadStore] Initialized. Found', Object.keys(normalizedData).length, 'downloaded songs.');
      set({ downloadedIds: normalizedData, initialized: true });
    } catch (err) {
      console.error('[DownloadStore] Initialization failed:', err);
      set({ initialized: true });
    }
  },

  addDownloaded: async (item) => {
    const newDownloads = { ...get().downloadedIds, [item.id]: item };
    if (isTauri() && store) {
      await store.set('downloadedIds', newDownloads);
      await store.save();
    }
    set({ downloadedIds: newDownloads });
  },

  removeDownloaded: async (id) => {
    const newDownloads = { ...get().downloadedIds };
    delete newDownloads[id];
    if (isTauri() && store) {
      await store.set('downloadedIds', newDownloads);
      await store.save();
    }
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

  setBatchProgress: (completed, total) => {
    set((state) => ({
      batchCompleted: completed,
      batchTotal: total !== undefined ? total : state.batchTotal,
    }));
  },
}));
