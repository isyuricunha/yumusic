import { Outlet, Navigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { PlayerBar } from '@/components/player/PlayerBar';
import { useConfigStore } from '@/store/configStore';
import { useEffect } from 'react';

export function MainLayout() {
  const { config, isLoading, initializeConfig } = useConfigStore();

  useEffect(() => {
    initializeConfig();
  }, [initializeConfig]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Loading Config...
      </div>
    );
  }

  if (!config) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24">
        {/* Top Header - can contain Search and Breadcrumbs later */}
        <header className="h-16 border-b border-border flex items-center px-6">
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
