import { create } from 'zustand';

export type Theme = 'dark' | 'theme-catppuccin' | 'theme-nord';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark', // default theme
  
  setTheme: (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-catppuccin', 'theme-nord');
    root.classList.add(theme);
    
    // Save locally for quick load (until full store hydration)
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
