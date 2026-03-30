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
      const store = await load('config.json');
      await store.set('appConfig', newConfig);
      await store.save();
      set({ config: newConfig });
    } catch (e) {
      console.error('Failed to save config to Tauri Store', e);
    }
  },

  clearConfig: async () => {
    try {
      const store = await load('config.json');
      await store.delete('appConfig');
      await store.save();
      set({ config: null });
    } catch (e) {
      console.error('Failed to clear config from Tauri Store', e);
    }
  },

  initializeConfig: async () => {
    set({ isLoading: true });
    try {
      const store = await load('config.json');
      const savedConfig = await store.get<AppConfig>('appConfig');
      if (savedConfig) {
        set({ config: savedConfig, isLoading: false });
      } else {
        set({ config: null, isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load config from Tauri Store', e);
      set({ config: null, isLoading: false });
    }
  }
}));
