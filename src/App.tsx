import { HashRouter, Routes, Route } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';

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

export default function App() {
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/podcast/:id" element={<PodcastDetail />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
