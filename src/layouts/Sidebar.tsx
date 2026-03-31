import { NavLink } from 'react-router';
import { Home, Library, Heart, Radio, Settings, Search, Podcast, Plus, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { usePlaylists, usePlaylistMutations } from '@/hooks/useSubsonic';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useDownloadStore } from '@/store/downloadStore';
import logo from '@/assets/logo.png';

export function Sidebar() {
  const { t } = useTranslation();
  const { data: playlists, isLoading } = usePlaylists();
  const { createPlaylist } = usePlaylistMutations();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    await createPlaylist.mutateAsync({ name: newPlaylistName });
    setNewPlaylistName('');
    setIsDialogOpen(false);
  };
  
  const navItems = [
    { label: t('common.home'), icon: Home, to: '/' },
    { label: t('common.search'), icon: Search, to: '/search' },
    { label: t('common.library'), icon: Library, to: '/library' },
    { label: t('common.favorites'), icon: Heart, to: '/favorites' },
    { label: t('common.podcasts'), icon: Podcast, to: '/podcasts' },
    { label: t('common.radio'), icon: Radio, to: '/radio' },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col h-full">
      <div className="p-6 flex items-center space-x-3">
        <img src={logo} alt="YuMusic Logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-xl tracking-tight text-sidebar-foreground">YuMusic</span>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1 pb-4">
          <h2 className="px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            {t('sidebar.menu')}
          </h2>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Separator className="my-4" />
        
        <nav className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              {t('sidebar.playlists')}
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
              render={
                <button className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              }
            />
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>{t('playlists.create_new')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePlaylist} className="space-y-4 pt-4">
                  <Input 
                    placeholder={t('playlists.name_placeholder')}
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    autoFocus
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={createPlaylist.isPending}>
                      {createPlaylist.isPending ? t('common.creating') : t('common.create')}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
             <div className="px-3 py-1.5 text-xs text-muted-foreground animate-pulse">Loading...</div>
          ) : (
            playlists?.map(playlist => (
              <NavLink 
                key={playlist.id} 
                to={`/playlist/${playlist.id}`}
                className={({ isActive }: { isActive: boolean }) => cn(
                  "flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm transition-colors truncate",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                )}
              >
                <Music className="h-3.5 w-3.5 shrink-0 opacity-70" />
                <span className="truncate">{playlist.name}</span>
              </NavLink>
            ))
          )}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border mt-auto mb-20 space-y-4">
        {/* Global Download Progress */}
        <DownloadProgress />

        <NavLink 
          to="/settings"
          className={({ isActive }: { isActive: boolean }) =>
            cn(
              'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )
          }
        >
          <Settings className="h-4 w-4" />
          <span>{t('common.settings')}</span>
        </NavLink>
      </div>
    </div>
  );
}
function DownloadProgress() {
  const { batchCompleted, batchTotal } = useDownloadStore();
  
  if (batchTotal === 0) return null;

  const progress = Math.round((batchCompleted / batchTotal) * 100);

  return (
    <div className="px-3 py-2 rounded-lg bg-sidebar-accent/20 border border-sidebar-accent/10 space-y-2 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
        <span>Baixando...</span>
        <span>{batchCompleted} de {batchTotal}</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}
