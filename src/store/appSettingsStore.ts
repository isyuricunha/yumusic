import { create } from 'zustand';
import { LazyStore } from '@tauri-apps/plugin-store';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

export type UpdateMode = 'auto' | 'notify' | 'disabled';
export type DownloadQuality = 'low' | 'normal' | 'high' | 'very_high';
export type DownloadFormat = 'mp3' | 'flac' | 'ogg';

interface AppSettings {
  updateMode: UpdateMode;
  closeToTray: boolean;
  launchOnStartup: boolean;
  // ── Download ──────────────────────────────────────────────────────────────
  downloadQuality: DownloadQuality;
  downloadFormat: DownloadFormat;
  /** Absolute path chosen by the user. Empty string = OS default downloads. */
  downloadFolder: string;
  /** Allow downloading full albums. */
  downloadAlbums: boolean;
  /** Allow downloading full playlists. */
  downloadPlaylists: boolean;
  /** Allow downloading podcast episodes. */
  downloadPodcasts: boolean;
  /** Auto-download songs as you add them to Liked. */
  autoDownloadLiked: boolean;
}

interface AppSettingsStore {
  settings: AppSettings;
  initialized: boolean;
  init: () => Promise<void>;
  setUpdateMode: (mode: UpdateMode) => Promise<void>;
  setCloseToTray: (enabled: boolean) => Promise<void>;
  setLaunchOnStartup: (enabled: boolean) => Promise<void>;
  setDownloadQuality: (q: DownloadQuality) => Promise<void>;
  setDownloadFormat: (f: DownloadFormat) => Promise<void>;
  setDownloadFolder: (path: string) => Promise<void>;
  setDownloadAlbums: (v: boolean) => Promise<void>;
  setDownloadPlaylists: (v: boolean) => Promise<void>;
  setDownloadPodcasts: (v: boolean) => Promise<void>;
  setAutoDownloadLiked: (v: boolean) => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  updateMode: 'notify',
  closeToTray: true,
  launchOnStartup: false,
  downloadQuality: 'high',
  downloadFormat: 'mp3',
  downloadFolder: '',
  downloadAlbums: true,
  downloadPlaylists: true,
  downloadPodcasts: true,
  autoDownloadLiked: false,
};

import { isTauri } from '@tauri-apps/api/core';

// ... (DEFAULT_SETTINGS remains the same) ...

// Persisted via tauri-plugin-store so settings survive reinstalls.
let store: LazyStore | null = null;
if (isTauri()) {
  store = new LazyStore('app-settings.json');
}

async function get<T>(key: string, fallback: T): Promise<T> {
  if (!isTauri() || !store) return fallback;
  return (await store.get<T>(key)) ?? fallback;
}

async function save<T>(key: string, value: T): Promise<void> {
  if (isTauri() && store) {
    await store.set(key, value);
    await store.save();
  } else {
    // Optionally persist to localStorage in browser
    const local = localStorage.getItem('yumusic-settings') || '{}';
    const settings = JSON.parse(local);
    settings[key] = value;
    localStorage.setItem('yumusic-settings', JSON.stringify(settings));
  }
}

export const useAppSettingsStore = create<AppSettingsStore>((set, getStore) => ({
  settings: { ...DEFAULT_SETTINGS },
  initialized: false,

  init: async () => {
    if (getStore().initialized) return;
    try {
      const d = DEFAULT_SETTINGS;
      const settings: AppSettings = {
        updateMode: await get('updateMode', d.updateMode),
        closeToTray: await get('closeToTray', d.closeToTray),
        launchOnStartup: await get('launchOnStartup', d.launchOnStartup),
        downloadQuality: await get('downloadQuality', d.downloadQuality),
        downloadFormat: await get('downloadFormat', d.downloadFormat),
        downloadFolder: await get('downloadFolder', d.downloadFolder),
        downloadAlbums: await get('downloadAlbums', d.downloadAlbums),
        downloadPlaylists: await get('downloadPlaylists', d.downloadPlaylists),
        downloadPodcasts: await get('downloadPodcasts', d.downloadPodcasts),
        autoDownloadLiked: await get('autoDownloadLiked', d.autoDownloadLiked),
      };
      set({ settings, initialized: true });
    } catch {
      // Running in browser dev mode — use defaults.
      set({ settings: { ...DEFAULT_SETTINGS }, initialized: true });
    }
  },

  setUpdateMode: async (mode) => {
    await save('updateMode', mode);
    set((s) => ({ settings: { ...s.settings, updateMode: mode } }));
  },

  setCloseToTray: async (enabled) => {
    await save('closeToTray', enabled);
    set((s) => ({ settings: { ...s.settings, closeToTray: enabled } }));
  },

  setLaunchOnStartup: async (enabled) => {
    try {
      if (enabled) await enable();
      else await disable();
    } catch {
      // best-effort — may fail in dev mode
    }
    await save('launchOnStartup', enabled);
    set((s) => ({ settings: { ...s.settings, launchOnStartup: enabled } }));
  },

  setDownloadQuality: async (q) => {
    await save('downloadQuality', q);
    set((s) => ({ settings: { ...s.settings, downloadQuality: q } }));
  },

  setDownloadFormat: async (f) => {
    await save('downloadFormat', f);
    set((s) => ({ settings: { ...s.settings, downloadFormat: f } }));
  },

  setDownloadFolder: async (path) => {
    await save('downloadFolder', path);
    set((s) => ({ settings: { ...s.settings, downloadFolder: path } }));
  },

  setDownloadAlbums: async (v) => {
    await save('downloadAlbums', v);
    set((s) => ({ settings: { ...s.settings, downloadAlbums: v } }));
  },

  setDownloadPlaylists: async (v) => {
    await save('downloadPlaylists', v);
    set((s) => ({ settings: { ...s.settings, downloadPlaylists: v } }));
  },

  setDownloadPodcasts: async (v) => {
    await save('downloadPodcasts', v);
    set((s) => ({ settings: { ...s.settings, downloadPodcasts: v } }));
  },

  setAutoDownloadLiked: async (v) => {
    await save('autoDownloadLiked', v);
    set((s) => ({ settings: { ...s.settings, autoDownloadLiked: v } }));
  },
}));

/** Sync the actual autostart state (OS may differ from stored pref). */
export async function syncAutostart(): Promise<boolean> {
  try {
    return await isEnabled();
  } catch {
    return false;
  }
}
