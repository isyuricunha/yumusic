import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';

import Library from '@/pages/Library';
import Search from '@/pages/Search';
import Favorites from '@/pages/Favorites';

// Temporary stubs for missing pages
const Settings = () => <div>Settings View</div>;

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
          <Route path="/" element={<Navigate to="/library" replace />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
