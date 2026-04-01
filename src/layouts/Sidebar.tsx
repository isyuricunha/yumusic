import { NavLink } from 'react-router';
import { Home, Library, Settings, Search, ListMusic, Mic2, Disc, Plus, ArrowDownToLine, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePlaylists, usePlaylistMutations, useCoverArtUrl, useAlbumList } from '@/hooks/useSubsonic';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useDownloadStore, DownloadItem } from '@/store/downloadStore';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { SubsonicSong } from '@/hooks/useSubsonic';

export function Sidebar() {
  const { t } = useTranslation();
  const { data: playlists, isLoading: loadingPlaylists } = usePlaylists();
  const { data: recentAlbums } = useAlbumList('newest', 20);
  const { createPlaylist } = usePlaylistMutations();
  const getCoverArt = useCoverArtUrl();
  const { downloadedIds } = useDownloadStore();
  
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'playlists' | 'podcasts' | 'albums' | 'downloads'>('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { setSong, setQueue } = usePlayerStore();
  const config = useConfigStore(state => state.config);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    await createPlaylist.mutateAsync({ name: newPlaylistName });
    setNewPlaylistName('');
    setIsDialogOpen(false);
  };

  const handleClearAllDownloads = async () => {
    const { deleteDownloadedSong } = await import('@/services/downloadService');
    const ids = Object.keys(downloadedIds);
    for (const id of ids) {
      await deleteDownloadedSong(id);
    }
  };

  const handlePlayDownloadedSong = (item: DownloadItem) => {
    if (!config) return;

    // Convert DownloadItem back to (at least partial) SubsonicSong
    const song: SubsonicSong = {
      id: item.id,
      title: item.title,
      artist: item.artist,
      artistId: item.artistId || 'local',
      album: item.album || t('common.downloaded'),
      albumId: item.albumId || 'local',
      duration: 0, // Not stored currently, but player can handle 0/metadata load
      track: 0,
      coverArt: item.coverArt,
      year: item.year
    };

    setQueue([song]);
    setSong(song, config);
  };
  
  const navItems = [
    { label: t('common.home'), icon: Home, to: '/' },
    { label: t('common.search'), icon: Search, to: '/search' },
  ];

  const categories = [
    { id: 'playlists', label: t('sidebar.playlists'), icon: ListMusic },
    { id: 'podcasts', label: t('sidebar.podcasts'), icon: Mic2 },
    { id: 'albums', label: t('sidebar.albums'), icon: Disc },
    { id: 'downloads', label: t('sidebar.downloads'), icon: ArrowDownToLine },
  ];

  return (
    <div className={cn(
      "hidden md:flex flex-col h-full gap-2 transition-all duration-300 select-none overflow-hidden flex-shrink-0",
      isCollapsed ? "w-[84px]" : "w-72"
    )}>
      
      {/* Top Segment: Home/Search */}
      <div className="flex-shrink-0 bg-card rounded-xl p-2 space-y-1 shadow-md">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                'flex items-center rounded-lg text-sm font-bold transition-all duration-200',
                isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-5',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="h-6 w-6 flex-shrink-0" />
            {!isCollapsed && <span className="text-base">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Bottom Segment: Your Library */}
      <div className="flex-1 bg-card rounded-xl flex flex-col min-h-0 shadow-md overflow-hidden">
        <div className={cn(
          "flex-shrink-0 flex items-center sticky top-0 bg-card z-10 rounded-t-xl transition-all",
          isCollapsed ? "flex-col p-2 space-y-4" : "p-4 justify-between"
        )}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Library className={cn(
              "h-6 w-6 transition-transform",
              !isCollapsed && "group-hover:scale-110"
            )} />
            {!isCollapsed && <span className="font-bold text-base">{t('sidebar.your_library')}</span>}
          </button>
          
          {!isCollapsed && (
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
          )}

          {isCollapsed && (
            <Button 
               variant="ghost" 
               size="icon" 
               className="h-10 w-10 rounded-full text-muted-foreground"
               onClick={() => setIsCollapsed(false)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Category Chips */}
        {!isCollapsed && (
          <div 
            className="flex-shrink-0 px-4 pb-2 flex flex-row flex-nowrap gap-2 overflow-x-auto no-scrollbar scroll-smooth pr-6"
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
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
        )}

        {/* Library Scroll Container */}
        <div className={cn(
          "flex-1 overflow-y-auto mt-2 custom-scrollbar transition-all",
          isCollapsed ? "px-1" : "px-2"
        )}>
          <div className="space-y-1 pb-4">
            
            {/* Download Progress if active */}
            {!isCollapsed && <DownloadProgress />}

            {filter === 'downloads' && !isCollapsed && Object.keys(downloadedIds).length > 0 && (
               <div className="px-3 pb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {Object.keys(downloadedIds).length} {t('common.offline')}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] font-black uppercase tracking-widest text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                    onClick={handleClearAllDownloads}
                  >
                    {t('common.clear_all')}
                  </Button>
               </div>
            )}

            {/* Downloads List */}
            {filter === 'downloads' && (
               Object.values(downloadedIds).map(item => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center rounded-lg text-sm transition-all group cursor-pointer",
                    isCollapsed ? "justify-center p-2" : "space-x-3 p-2 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  )}
                  onClick={() => handlePlayDownloadedSong(item)}
                >
                  <div className={cn(
                    "bg-muted rounded shadow-sm overflow-hidden flex-shrink-0 relative",
                    isCollapsed ? "h-12 w-12" : "h-12 w-12"
                  )}>
                     {item.coverArt ? (
                       <img src={getCoverArt(item.coverArt)} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <Disc className="h-6 w-6 opacity-40" />
                       </div>
                     )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="font-semibold truncate leading-tight transition-colors group-hover:text-primary">{item.title}</span>
                      <span className="text-xs opacity-70 truncate">{item.artist}</span>
                    </div>
                  )}
                  {!isCollapsed && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { deleteDownloadedSong } = await import('@/services/downloadService');
                        await deleteDownloadedSong(item.id);
                      }}
                      title={t('common.delete_download')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}

            {/* Playlists */}
            {(isCollapsed || filter === 'all' || filter === 'playlists') && filter !== 'downloads' && (
              <>
                {loadingPlaylists ? (
                  !isCollapsed && (
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
                  )
                ) : (
                  playlists?.map(playlist => (
                    <NavLink 
                      key={playlist.id} 
                      to={`/playlist/${playlist.id}`}
                      className={({ isActive }: { isActive: boolean }) => cn(
                        "flex items-center rounded-lg text-sm transition-all group",
                        isCollapsed ? "justify-center p-2" : "space-x-3 p-2",
                        isActive 
                          ? "bg-muted/40 text-foreground" 
                          : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                      )}
                      title={isCollapsed ? playlist.name : undefined}
                    >
                      <div className="h-12 w-12 bg-muted rounded shadow-sm overflow-hidden flex-shrink-0 relative">
                         {playlist.coverArt ? (
                           <img src={getCoverArt(playlist.coverArt)} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center">
                             <ListMusic className="h-6 w-6 opacity-40" />
                           </div>
                         )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold truncate leading-tight transition-colors group-hover:text-primary">{playlist.name}</span>
                          <span className="text-xs opacity-70">{t('common.playlist_label')} • {playlist.owner || t('login.app_title')}</span>
                        </div>
                      )}
                    </NavLink>
                  ))
                )}
              </>
            )}

            {/* Recently Added Albums */}
            {(isCollapsed || filter === 'all' || filter === 'albums') && filter !== 'downloads' && (
               recentAlbums?.slice(0, 15).map(album => (
                <NavLink 
                  key={album.id} 
                  to={`/album/${album.id}`}
                  className={({ isActive }: { isActive: boolean }) => cn(
                    "flex items-center rounded-lg text-sm transition-all group",
                    isCollapsed ? "justify-center p-2" : "space-x-3 p-2",
                    isActive 
                      ? "bg-muted/40 text-foreground" 
                      : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  )}
                  title={isCollapsed ? album.name : undefined}
                >
                  <div className="h-12 w-12 bg-muted rounded shadow-sm overflow-hidden flex-shrink-0">
                     <img src={getCoverArt(album.coverArt || album.id)} alt="" className="w-full h-full object-cover" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate leading-tight transition-colors group-hover:text-primary">{album.name}</span>
                      <span className="text-xs opacity-70">{t('common.album_label')} • {album.artist}</span>
                    </div>
                  )}
                </NavLink>
              ))
            )}
          </div>
        </div>
        
        <div className={cn(
          "flex-shrink-0 mt-auto transition-all",
          isCollapsed ? "p-3 flex justify-center" : "p-4"
        )}>
           <NavLink 
              to="/settings"
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center rounded-lg text-sm font-bold transition-all',
                  isCollapsed ? 'p-3' : 'px-4 py-2 space-x-4',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
              title={isCollapsed ? t('common.settings') : undefined}
            >
              <Settings className="h-5 w-5" />
              {!isCollapsed && <span>{t('common.settings')}</span>}
            </NavLink>
        </div>
      </div>
    </div>
  );
}

function DownloadProgress() {
  const { t } = useTranslation();
  const { batchCompleted, batchTotal } = useDownloadStore();
  
  if (batchTotal === 0) return null;

  const progress = Math.round((batchCompleted / batchTotal) * 100);

  return (
    <div className="m-2 p-3 rounded-lg bg-primary/10 border border-primary/20 space-y-2 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
        <span>{t('common.downloading')}</span>
        <span>{batchCompleted} / {batchTotal}</span>
      </div>
      <Progress value={progress} className="h-1 bg-primary/20" />
    </div>
  );
}
