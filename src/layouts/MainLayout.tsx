import { Outlet, Navigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { PlayerBar } from '@/components/player/PlayerBar';
import { useConfigStore } from '@/store/configStore';
import { useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export function MainLayout() {
  const { config, isLoading, initializeConfig } = useConfigStore();
  const navigate = useNavigate();

  useEffect(() => {
    initializeConfig();
  }, [initializeConfig]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-full" />
          <span className="text-sm font-medium">YuMusic...</span>
        </div>
      </div>
    );
  }

  if (!config) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Desktop only */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 h-full relative">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">YuMusic</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/settings')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </header>

        {/* Global Header - Desktop (hidden on mobile) */}
        <header className="h-16 border-b border-border hidden md:flex items-center px-6">
          <div className="text-xl font-bold">Discover</div>
        </header>

        {/* Scrollable Context View */}
        <main className="flex-1 overflow-y-auto w-full p-6">
          <Outlet />
        </main>
      </div>

      {/* Persistent Bottom Player Bar */}
      <PlayerBar />
    </div>
  );
}
