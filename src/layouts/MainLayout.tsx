import { Outlet, Navigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { PlayerBar } from '@/components/player/PlayerBar';
import { QueueDrawer } from '@/components/player/QueueDrawer';
import { useConfigStore } from '@/store/configStore';
import { useEffect } from 'react';
import { Settings as SettingsIcon, ChevronLeft, ChevronRight, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { checkForUpdate, downloadAndInstall } from '@/services/updaterService';
import { isTauri } from '@tauri-apps/api/core';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { useSearchParams, useLocation } from 'react-router';
import { useDebounce } from '@/hooks/useDebounce';
import { useRef, useState } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { Clock } from 'lucide-react';

export function MainLayout() {
  const { t } = useTranslation();
  const { config, isLoading, initializeConfig } = useConfigStore();
  const { settings, init: initializeSettings } = useAppSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addRecentSearch, removeRecentSearch } = useSearchStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Search State
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Sync searchQuery with URL params when they change externally (e.g. back button)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Update URL when debounced query changes
  useEffect(() => {
    // Only update if the query is different from the current URL,
    // to avoid overwriting external navigations (like ArtistLinks)
    const currentParam = searchParams.get('q') || '';
    
    if (debouncedSearchQuery && debouncedSearchQuery !== currentParam) {
      setSearchParams({ q: debouncedSearchQuery }, { replace: location.pathname === '/search' });
      // Add to recent searches if it's more than a single char and seems like a deliberate search
      if (debouncedSearchQuery.length > 2) {
        addRecentSearch(debouncedSearchQuery);
      }
    } else if (location.pathname === '/search' && !searchQuery && currentParam) {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedSearchQuery, setSearchParams, location.pathname, addRecentSearch, searchParams, searchQuery]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/' or Ctrl+L or Ctrl+K (Spotify/Web standards)
      if (
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'l' || e.key === 'f'))
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeConfig();
      await initializeSettings();
    };
    init();
  }, [initializeConfig, initializeSettings]);

  // Update Check Effect
  useEffect(() => {
    if (!isTauri() || !config || settings.updateMode === 'disabled') return;

    const checkUpdates = async () => {
      try {
        const update = await checkForUpdate();
        if (!update) return;

        if (settings.updateMode === 'auto') {
          console.log('[updater] Auto-installing update:', update.version);
          await downloadAndInstall(update);
        } else if (settings.updateMode === 'notify') {
          console.log('[updater] Update available:', update.version);
          
          let permissionGranted = await isPermissionGranted();
          if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
          }

          if (permissionGranted) {
            sendNotification({
              title: t('settings.updates.title'),
              body: t('settings.updates.version_available', { version: update.version }),
            });
          }
        }
      } catch (err) {
        console.warn('[updater] Background check failed:', err);
      }
    };

    // Check after a short delay to not block initial render
    const timer = setTimeout(checkUpdates, 5000);
    return () => clearTimeout(timer);
  }, [config, settings.updateMode, t]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground tracking-tight">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-full shadow-[0_0_20px_rgba(29,185,84,0.4)]" />
          <span className="text-sm font-bold opacity-75">{t('login.app_title')}...</span>
        </div>
      </div>
    );
  }

  if (!config) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-foreground overflow-hidden p-2 gap-2">
      {/* Top: Sidebar and Main Content Section */}
      <div className="flex flex-1 min-h-0 min-w-0 gap-2 overflow-hidden">
        {/* Sidebar - Left Panel */}
        <Sidebar />
        
        {/* Main Content Area - Right Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-card rounded-xl overflow-hidden relative shadow-lg">
          
          {/* Spotify-style Top Management Bar */}
          <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-40 bg-card/60 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60"
                  onClick={() => navigate(1)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <input 
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                     setSearchQuery(e.target.value);
                     if (location.pathname !== '/search') {
                       navigate('/search');
                     }
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (location.pathname !== '/search') {
                      navigate('/search');
                    }
                  }}
                  onBlur={() => {
                    // Small delay to allow clicking the dropdown items
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                  placeholder={t('search.placeholder')}
                  className="w-full bg-muted/40 border-none rounded-full py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                />
                
                {/* Search History Dropdown */}
                {isSearchFocused && recentSearches.length > 0 && !searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-[#282828] border border-white/5 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">{t('search.recent_searches')}</span>
                    </div>
                    <div className="py-1">
                      {recentSearches.map((term) => (
                        <div 
                          key={term}
                          className="group flex items-center px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => {
                            setSearchQuery(term);
                            searchInputRef.current?.focus();
                          }}
                        >
                          <Clock className="h-4 w-4 text-muted-foreground mr-3" />
                          <span className="flex-1 text-sm font-medium text-white/90">{term}</span>
                          <button 
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-muted-foreground transition-all"
                            onClick={(e) => {
                               e.stopPropagation();
                               removeRecentSearch(term);
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 h-4 px-1.5 rounded border border-white/10 bg-white/5 text-[10px] font-black text-muted-foreground/50 pointer-events-none hidden md:block group-focus-within:hidden">
                  /
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/settings')}
                className="text-muted-foreground hover:text-primary transition-colors h-9 w-9 rounded-full bg-black/20"
              >
                <SettingsIcon className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
          </header>

          {/* Scrollable View */}
          <main className="flex-1 overflow-y-auto w-full px-6 pb-8 scroll-smooth">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Sustainable Bottom Player Bar (now part of document flow) */}
      <PlayerBar />
      
      {/* Global Queue View Overlay */}
      <QueueDrawer />
    </div>
  );
}
