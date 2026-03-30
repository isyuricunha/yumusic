import { create } from 'zustand';
import { load } from '@tauri-apps/plugin-store';
import { SubsonicRadioStation } from '@/hooks/useSubsonic';

export interface LocalRadio extends SubsonicRadioStation {
  isLocal: boolean;
}

interface RadioStore {
  localRadios: LocalRadio[];
  isLoading: boolean;
  addRadio: (radio: LocalRadio) => Promise<void>;
  removeRadio: (id: string) => Promise<void>;
  initializeRadios: () => Promise<void>;
}

export const useRadioStore = create<RadioStore>((set, get) => ({
  localRadios: [],
  isLoading: true,

  addRadio: async (radio: LocalRadio) => {
    try {
      const newList = [...get().localRadios, radio];
      if (window.__TAURI__) {
        const store = await load('radios.json');
        await store.set('localRadios', newList);
        await store.save();
      } else {
        localStorage.setItem('yumusic-local-radios', JSON.stringify(newList));
      }
      set({ localRadios: newList });
    } catch (e) {
      console.error('Failed to add local radio', e);
    }
  },

  removeRadio: async (id: string) => {
    try {
      const newList = get().localRadios.filter((r) => r.id !== id);
      if (window.__TAURI__) {
        const store = await load('radios.json');
        await store.set('localRadios', newList);
        await store.save();
      } else {
        localStorage.setItem('yumusic-local-radios', JSON.stringify(newList));
      }
      set({ localRadios: newList });
    } catch (e) {
      console.error('Failed to remove local radio', e);
    }
  },

  initializeRadios: async () => {
    set({ isLoading: true });
    try {
      let saved: LocalRadio[] = [];
      if (window.__TAURI__) {
        const store = await load('radios.json');
        saved = (await store.get<LocalRadio[]>('localRadios')) ?? [];
      } else {
        const local = localStorage.getItem('yumusic-local-radios');
        if (local) saved = JSON.parse(local);
      }
      set({ localRadios: saved, isLoading: false });
    } catch (e) {
      console.error('Failed to load local radios', e);
      set({ localRadios: [], isLoading: false });
    }
  }
}));
