import { create } from 'zustand';

export type Theme = 'dark' | 'theme-catppuccin' | 'theme-nord' | 'theme-spotify';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark', // default theme
  
  setTheme: (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('theme-catppuccin', 'theme-nord', 'theme-spotify');
    
    if (theme !== 'dark') {
      root.classList.add(theme);
    }
    
    root.classList.add('dark');
    
    localStorage.setItem('yumusic-ui-theme', theme);
    set({ theme });
  },
  
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('yumusic-ui-theme') as Theme | null;
    if (savedTheme) {
      get().setTheme(savedTheme);
    } else {
      get().setTheme('dark');
    }
  }
}));
