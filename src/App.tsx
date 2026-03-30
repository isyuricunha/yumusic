import { HashRouter, Routes, Route } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';

// Temporary stubs for pages
const Home = () => <div>Welcome to Yumusic Library</div>;
const Search = () => <div>Search for Music</div>;
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
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          {/* Add Library, Artist, Favorites, Podcasts later */}
        </Route>
      </Routes>
    </HashRouter>
  );
}
