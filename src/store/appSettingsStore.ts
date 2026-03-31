import { create } from 'zustand';
import { LazyStore } from '@tauri-apps/plugin-store';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

export type UpdateMode = 'auto' | 'notify' | 'disabled';

interface AppSettings {
  updateMode: UpdateMode;
  closeToTray: boolean;
  launchOnStartup: boolean;
}

interface AppSettingsStore {
  settings: AppSettings;
  initialized: boolean;
  init: () => Promise<void>;
  setUpdateMode: (mode: UpdateMode) => Promise<void>;
  setCloseToTray: (enabled: boolean) => Promise<void>;
  setLaunchOnStartup: (enabled: boolean) => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  updateMode: 'notify',
  closeToTray: true,
  launchOnStartup: false,
};

// Persisted via tauri-plugin-store so settings survive reinstalls.
const store = new LazyStore('app-settings.json');

export const useAppSettingsStore = create<AppSettingsStore>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    try {
      const updateMode = (await store.get<UpdateMode>('updateMode')) ?? DEFAULT_SETTINGS.updateMode;
      const closeToTray = (await store.get<boolean>('closeToTray')) ?? DEFAULT_SETTINGS.closeToTray;
      const launchOnStartup =
        (await store.get<boolean>('launchOnStartup')) ?? DEFAULT_SETTINGS.launchOnStartup;
      set({ settings: { updateMode, closeToTray, launchOnStartup }, initialized: true });
    } catch {
      // Running in browser dev mode — use defaults.
      set({ settings: { ...DEFAULT_SETTINGS }, initialized: true });
    }
  },

  setUpdateMode: async (mode) => {
    await store.set('updateMode', mode);
    await store.save();
    set((s) => ({ settings: { ...s.settings, updateMode: mode } }));
  },

  setCloseToTray: async (enabled) => {
    await store.set('closeToTray', enabled);
    await store.save();
    set((s) => ({ settings: { ...s.settings, closeToTray: enabled } }));
  },

  setLaunchOnStartup: async (enabled) => {
    try {
      if (enabled) {
        await enable();
      } else {
        await disable();
      }
    } catch {
      // Best-effort — may fail in dev mode.
    }
    await store.set('launchOnStartup', enabled);
    await store.save();
    set((s) => ({ settings: { ...s.settings, launchOnStartup: enabled } }));
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
