import { Outlet, Navigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { PlayerBar } from '@/components/player/PlayerBar';
import { useConfigStore } from '@/store/configStore';
import { useEffect } from 'react';
import { Settings as SettingsIcon, ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export function MainLayout() {
  const { t } = useTranslation();
  const { config, isLoading, initializeConfig } = useConfigStore();
  const navigate = useNavigate();

  useEffect(() => {
    initializeConfig();
  }, [initializeConfig]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground tracking-tight">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-full shadow-[0_0_20px_rgba(29,185,84,0.4)]" />
          <span className="text-sm font-bold opacity-75">YuMusic...</span>
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
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="w-full bg-muted/40 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                  onFocus={() => navigate('/search')}
                />
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
    </div>
  );
}
