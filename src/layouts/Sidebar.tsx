import { NavLink } from 'react-router';
import { Home, Library, Settings, Search, ListMusic, Mic2, Disc, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePlaylists, usePlaylistMutations, useCoverArtUrl, useAlbumList } from '@/hooks/useSubsonic';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useDownloadStore } from '@/store/downloadStore';

export function Sidebar() {
  const { t } = useTranslation();
  const { data: playlists, isLoading: loadingPlaylists } = usePlaylists();
  const { data: recentAlbums } = useAlbumList('newest', 20);
  const { createPlaylist } = usePlaylistMutations();
  const getCoverArt = useCoverArtUrl();
  
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'playlists' | 'podcasts' | 'albums'>('all');

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
  ];

  const categories = [
    { id: 'playlists', label: t('sidebar.playlists'), icon: ListMusic },
    { id: 'podcasts', label: t('sidebar.podcasts'), icon: Mic2 },
    { id: 'albums', label: t('sidebar.albums'), icon: Disc },
  ];

  return (
    <div className="w-72 hidden md:flex flex-col h-full gap-2 transition-all duration-300 select-none overflow-hidden">
      
      {/* Top Segment: Home/Search */}
      <div className="flex-shrink-0 bg-card rounded-xl p-2 space-y-1 shadow-md">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                'flex items-center space-x-5 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-6 w-6" />
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Segment: Your Library */}
      <div className="flex-1 bg-card rounded-xl flex flex-col min-h-0 shadow-md overflow-hidden">
        <div className="flex-shrink-0 p-4 flex items-center justify-between sticky top-0 bg-card z-10 rounded-t-xl">
          <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
            <Library className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-base">{t('sidebar.your_library')}</span>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50">
                  <Plus className="h-5 w-5" />
                </Button>
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

        {/* Category Chips */}
        <div className="flex-shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(filter === cat.id ? 'all' : cat.id as any)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200",
                filter === cat.id 
                  ? "bg-foreground text-background shadow-lg" 
                  : "bg-muted/40 text-foreground hover:bg-muted/60"
              )}
            >
              <cat.icon className={cn(
                "h-3.5 w-3.5",
                filter === cat.id ? "text-background" : "text-muted-foreground"
              )} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Library Scroll Container */}
        <div className="flex-1 overflow-y-auto px-2 mt-2 custom-scrollbar">
          <div className="space-y-1 pb-4">
            
            {/* Download Progress if active */}
            <DownloadProgress />

            {/* Playlists */}
            {(filter === 'all' || filter === 'playlists') && (
              <>
                {loadingPlaylists ? (
                  <div className="px-3 py-2 space-y-4">
                     {[...Array(5)].map((_, i) => (
                       <div key={i} className="flex items-center space-x-3">
                         <div className="h-12 w-12 bg-muted animate-pulse rounded" />
                         <div className="flex-1 space-y-2">
                            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                            <div className="h-2 bg-muted animate-pulse rounded w-1/4" />
                         </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  playlists?.map(playlist => (
                    <NavLink 
                      key={playlist.id} 
                      to={`/playlist/${playlist.id}`}
                      className={({ isActive }: { isActive: boolean }) => cn(
                        "flex items-center space-x-3 p-2 rounded-lg text-sm transition-all group",
                        isActive 
                          ? "bg-muted/40 text-foreground" 
                          : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                      )}
                    >
                      <div className="h-12 w-12 bg-muted rounded shadow-sm overflow-hidden flex-shrink-0 relative">
                         {playlist.coverArt ? (
                           <img src={getCoverArt(playlist.coverArt)} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center">
                             <ListMusic className="h-6 w-6 opacity-40" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Plus className="h-4 w-4 text-white" />
                         </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate leading-tight transition-colors group-hover:text-primary">{playlist.name}</span>
                        <span className="text-xs opacity-70">Playlist • {playlist.owner || 'YuMusic'}</span>
                      </div>
                    </NavLink>
                  ))
                )}
              </>
            )}

            {/* Recently Added Albums (Placeholder for 'Your Library' feel) */}
            {(filter === 'all' || filter === 'albums') && (
               recentAlbums?.slice(0, 15).map(album => (
                <NavLink 
                  key={album.id} 
                  to={`/album/${album.id}`}
                  className={({ isActive }: { isActive: boolean }) => cn(
                    "flex items-center space-x-3 p-2 rounded-lg text-sm transition-all group",
                    isActive 
                      ? "bg-muted/40 text-foreground" 
                      : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  )}
                >
                  <div className="h-12 w-12 bg-muted rounded shadow-sm overflow-hidden flex-shrink-0">
                     <img src={getCoverArt(album.coverArt || album.id)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate leading-tight transition-colors group-hover:text-primary">{album.name}</span>
                    <span className="text-xs opacity-70">Álbum • {album.artist}</span>
                  </div>
                </NavLink>
              ))
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 p-4 mt-auto">
           <NavLink 
              to="/settings"
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center space-x-4 px-4 py-2 rounded-lg text-sm font-bold transition-all',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Settings className="h-5 w-5" />
              <span>{t('common.settings')}</span>
            </NavLink>
        </div>
      </div>
    </div>
  );
}

function DownloadProgress() {
  const { batchCompleted, batchTotal } = useDownloadStore();
  
  if (batchTotal === 0) return null;

  const progress = Math.round((batchCompleted / batchTotal) * 100);

  return (
    <div className="m-2 p-3 rounded-lg bg-primary/10 border border-primary/20 space-y-2 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
        <span>Baixando...</span>
        <span>{batchCompleted} / {batchTotal}</span>
      </div>
      <Progress value={progress} className="h-1 bg-primary/20" />
    </div>
  );
}
