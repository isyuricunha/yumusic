import { HashRouter, Routes, Route } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';
import Login from '@/pages/Login';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';
import { Titlebar } from '@/components/layout/Titlebar';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { useDownloadStore } from '@/store/downloadStore';

import Library from '@/pages/Library';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Favorites from '@/pages/Favorites';
import AlbumDetail from '@/pages/AlbumDetail';
import Podcasts from '@/pages/Podcasts';
import Radio from '@/pages/Radio';
import Settings from '@/pages/Settings';
import PlaylistDetail from '@/pages/PlaylistDetail';
import PodcastDetail from '@/pages/PodcastDetail';
import ArtistDetail from '@/pages/ArtistDetail';
import ArtistSongs from '@/pages/ArtistSongs';
import { usePlayerStore } from '@/store/playerStore';

export default function App() {
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
    useDownloadStore.getState().init();

    // Prevent F5 and Ctrl+R Refresh
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F5' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R'))
      ) {
        e.preventDefault();
        console.log('[App] Refresh blocked to prevent music interruption.');
      }
    };

    // Warn before closing/refreshing if music is playing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isPlaying = usePlayerStore.getState().isPlaying;
      
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = ''; 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [initializeTheme]);

  const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;

  return (
    <>
      <Titlebar />
      <ConfirmDialog />
      <div className={cn(
        "h-screen w-full overflow-hidden flex flex-col bg-background transition-colors duration-300",
        isTauri ? "pt-8" : "pt-0"
      )}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/artist/:id" element={<ArtistDetail />} />
              <Route path="/artist/:id/songs" element={<ArtistSongs />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/podcast/:id" element={<PodcastDetail />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </HashRouter>
      </div>
    </>
  );
}
