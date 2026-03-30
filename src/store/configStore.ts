import { create } from 'zustand';
import { load } from '@tauri-apps/plugin-store';

export interface AppConfig {
  serverUrl: string;
  username: string;
  token: string; // md5(password + salt)
  salt: string;
}

interface ConfigStore {
  config: AppConfig | null;
  isLoading: boolean;
  setConfig: (newConfig: AppConfig) => Promise<void>;
  clearConfig: () => Promise<void>;
  initializeConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: null,
  isLoading: true,
  
  setConfig: async (newConfig: AppConfig) => {
    try {
      if (window.__TAURI__) {
        const store = await load('config.json');
        await store.set('appConfig', newConfig);
        await store.save();
      } else {
        localStorage.setItem('yumusic-config', JSON.stringify(newConfig));
      }
      set({ config: newConfig });
    } catch (e) {
      console.error('Failed to save config', e);
    }
  },

  clearConfig: async () => {
    try {
      if (window.__TAURI__) {
        const store = await load('config.json');
        await store.delete('appConfig');
        await store.save();
      } else {
        localStorage.removeItem('yumusic-config');
      }
      set({ config: null });
    } catch (e) {
      console.error('Failed to clear config', e);
    }
  },

  initializeConfig: async () => {
    set({ isLoading: true });
    try {
      let savedConfig: AppConfig | null = null;
      if (window.__TAURI__) {
        const store = await load('config.json');
        savedConfig = (await store.get<AppConfig>('appConfig')) ?? null;
      } else {
        const local = localStorage.getItem('yumusic-config');
        if (local) savedConfig = JSON.parse(local);
      }

      if (savedConfig) {
        set({ config: savedConfig, isLoading: false });
      } else {
        set({ config: null, isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load config', e);
      set({ config: null, isLoading: false });
    }
  }
}));
