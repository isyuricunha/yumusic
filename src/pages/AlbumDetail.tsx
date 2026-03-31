import { useParams, useNavigate } from 'react-router';
import { useAlbum, useAlbumInfo, useCoverArtUrl, SubsonicSong, useArtist, useStarMutation, useFavorites, SubsonicAlbum } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, Check, Loader2, MoreHorizontal, Shuffle, PlusCircle, ArrowDownCircle, CheckCircle2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AddToPlaylistDropdown } from '@/components/player/AddToPlaylistDropdown';
import { useState, useMemo, useEffect } from 'react';
import { useDownloadStore } from '@/store/downloadStore';
import { downloadSong } from '@/services/downloadService';
import { AlbumCard } from '@/components/AlbumCard';
import { Footer } from '@/components/layout/Footer';
import { useImageColor } from '@/hooks/useImageColor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AlbumDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: album, isLoading } = useAlbum(id);
  const { data: albumInfo } = useAlbumInfo(id);
  const { data: artistAlbums } = useArtist(album?.artistId);
  const getCoverUrl = useCoverArtUrl();
  const coverUrl = useMemo(() => getCoverUrl(album?.coverArt || id), [getCoverUrl, album?.coverArt, id]);
  const ambientColor = useImageColor(coverUrl);
  
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong, addSongsToQueue, toggleShuffle, isShuffle, isPlaying, togglePlay } = usePlayerStore();
  const { downloadedIds, downloadingIds } = useDownloadStore();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [showAddedToQueue, setShowAddedToQueue] = useState(false);
  
  const { data: favorites } = useFavorites();
  const starMutation = useStarMutation();
  const isStarred = useMemo(() => 
    favorites?.album?.some((a: SubsonicAlbum) => a.id === id), 
  [favorites, id]);

  const isAlbumDownloaded = useMemo(() => {
    if (!album?.song) return false;
    return album.song.every(s => !!downloadedIds[s.id]);
  }, [album?.song, downloadedIds]);

  const isAlbumDownloading = useMemo(() => {
    if (!album?.song) return false;
    return album.song.some(s => downloadingIds.has(s.id));
  }, [album?.song, downloadingIds]);

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (song: SubsonicSong) => {
    if (config && album?.song) {
      setQueue(album.song);
      setSong(song, config);
    }
  };

  const handlePlayAlbum = () => {
    if (config && album?.song && album.song.length > 0) {
      setQueue(album.song);
      setSong(album.song[0], config);
    }
  };

  const handleToggleFavorite = () => {
    if (id) {
      starMutation.mutate({ id, type: 'album', star: !isStarred });
    }
  };

  const handleAddAlbumToQueue = () => {
    if (config && album?.song && album.song.length > 0) {
      addSongsToQueue(album.song);
      
      // If nothing is playing, start the first song from the added album
      if (!currentSong) {
        setSong(album.song[0], config);
      }

      // Visual feedback
      setShowAddedToQueue(true);
      setTimeout(() => setShowAddedToQueue(false), 2000);
    }
  };

  const onScroll = (e: any) => {
    setIsHeaderSticky(e.target.scrollTop > 350);
  };

  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', onScroll as any);
      return () => mainContent.removeEventListener('scroll', onScroll as any);
    }
  }, []);

  if (isLoading) return (
    <div className="p-8 flex flex-col space-y-8 animate-pulse">
      <div className="flex space-x-8 items-end">
        <div className="w-52 h-52 bg-muted rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-muted w-24 rounded" />
          <div className="h-20 bg-muted w-3/4 rounded" />
          <div className="h-4 bg-muted w-48 rounded" />
        </div>
      </div>
    </div>
  );
  
  if (!album) return <div className="p-8">{t('common.not_found')}</div>;

  return (
    <div className="-mx-6 px-6 -mt-16 pt-16 flex flex-col min-h-full transition-all duration-700 relative">
      <div className={cn(
        "sticky top-0 z-50 -mx-6 px-10 h-16 flex items-center backdrop-blur-xl border-b border-white/5 transition-all duration-700",
        isHeaderSticky ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
      style={{
        backgroundColor: isHeaderSticky ? `${ambientColor}cc` : 'transparent'
      }}>
        <div className="flex items-center gap-4 w-full">
          <Button 
            size="icon"
            className="rounded-full h-10 w-10 bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all"
            onClick={handlePlayAlbum}
          >
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </Button>
          <span className="font-black text-lg truncate drop-shadow-sm">{album.name}</span>
        </div>
      </div>

      <div 
        className="absolute inset-0 h-[600px] pointer-events-none opacity-100 transition-all duration-1000 z-0"
        style={{
          background: `linear-gradient(to bottom, ${ambientColor} 0%, rgba(0,0,0,0) 100%)`
        }}
      />

      <div className="relative z-10 pt-12 pb-8 flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-48 h-48 md:w-60 md:h-60 shadow-[0_15px_50px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden shrink-0 bg-muted group relative">
          <img 
            src={getCoverUrl(album.coverArt || album.id)} 
            alt={album.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-foreground drop-shadow-md">
            {t('common.album')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-[6rem] font-black tracking-tighter leading-none py-2 mb-2">
             {album.name}
          </h1>
          <div className="flex items-center space-x-1.5 text-sm flex-wrap">
            <span 
              className="hover:underline cursor-pointer flex items-center gap-2 font-bold"
              onClick={() => navigate(`/artist/${album.artistId}`)}
            >
              <div className="w-6 h-6 rounded-full bg-muted overflow-hidden shadow-md">
                <img src={getCoverUrl(album.artistId || album.id)} className="w-full h-full object-cover" />
              </div>
              {album.artist}
            </span>
            <span className="text-white/70 font-black">•</span>
            <span className="text-white/70 font-medium">{album.year}</span>
            <span className="text-white/70 font-black">•</span>
            <span className="text-white/70 font-medium">{album.songCount} {t('common.songs').toLowerCase()},</span>
            <span className="text-white/70 font-medium pl-0.5">
              {Math.floor(album.song?.reduce((acc, s) => acc + s.duration, 0) / 60)} min {Math.floor(album.song?.reduce((acc, s) => acc + s.duration, 0) % 60)} sec
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black/20 backdrop-blur-3xl -mx-6 px-6 pt-6 flex flex-col flex-1 pb-16">
        <div className="flex items-center space-x-8 mb-8 pt-6">
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-2xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all" 
            onClick={() => {
              const isCurrentAlbum = currentSong && album?.song?.some(s => s.id === currentSong.id);
              if (isCurrentAlbum) {
                togglePlay();
              } else {
                handlePlayAlbum();
              }
            }}
          >
            {isPlaying && currentSong && album?.song?.some(s => s.id === currentSong.id) 
              ? <Pause className="h-7 w-7 fill-current" /> 
              : <Play className="h-7 w-7 fill-current ml-1" />
            }
          </Button>

          <Button 
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-10 w-10 transition-all",
              isShuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-7 w-7" />
          </Button>

          <Button 
            variant="ghost"
            size="icon"
            className={cn(
               "rounded-full h-10 w-10 transition-all",
               isStarred ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={handleToggleFavorite}
            disabled={starMutation.isPending}
          >
            {isStarred ? <CheckCircle2 className="h-8 w-8" /> : <PlusCircle className="h-8 w-8" />}
          </Button>

          <Button 
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-10 w-10 transition-all duration-300",
              isAlbumDownloaded 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={async (e) => {
              e.stopPropagation();
              if (album?.song) {
                const songsToDownload = album.song.filter(s => !downloadedIds[s.id]);
                if (songsToDownload.length > 0) {
                  useDownloadStore.getState().setBatchProgress(0, songsToDownload.length);
                  for (const song of songsToDownload) {
                    await downloadSong(song);
                  }
                }
              }
            }}
            disabled={isAlbumDownloading}
          >
            {isAlbumDownloading ? (
               <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : isAlbumDownloaded ? (
               <Check className="h-7 w-7 stroke-[2.5px]" />
            ) : (
               <ArrowDownCircle className="h-7 w-7" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all outline-none"
            >
              <MoreHorizontal className="h-7 w-7" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-zinc-900 border-white/10">
              <DropdownMenuItem onClick={handleAddAlbumToQueue} className="cursor-pointer flex items-center justify-between">
                <span>{t('common.add_to_queue')}</span>
                {showAddedToQueue && <Check className="h-4 w-4 text-primary animate-in zoom-in" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/artist/${album.artistId}`)} className="cursor-pointer">
                {t('common.go_to_artist')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 border-b border-white/10 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            <span className="w-8 text-center ml-2">#</span>
            <span>{t('common.title')}</span>
            <Clock className="h-4 w-4 mr-10" />
          </div>

          <div className="flex flex-col space-y-0.5">
            {album.song?.map((song, index) => (
              <div 
                key={song.id} 
                className={cn(
                  "grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 rounded-md hover:bg-white/10 cursor-pointer group transition-all duration-200 items-center",
                  currentSong?.id === song.id && "bg-white/5"
                )}
                onClick={() => handlePlaySong(song)}
              >
                <div className="w-8 flex justify-center items-center">
                  {currentSong?.id === song.id ? (
                      <div className="flex items-end gap-0.5 h-3">
                         <div className="w-0.5 h-full bg-primary animate-bounce delay-75" />
                         <div className="w-0.5 h-1/2 bg-primary animate-bounce delay-150" />
                         <div className="w-0.5 h-3/4 bg-primary animate-bounce delay-225" />
                      </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-muted-foreground group-hover:hidden transition-opacity">
                        {index + 1}
                      </span>
                      <Play className="h-3 w-3 fill-current hidden group-hover:block transition-all" />
                    </>
                  )}
                </div>

                <div className="flex flex-col truncate pr-4">
                  <span className={cn(
                    "text-sm font-bold truncate tracking-tight transition-colors",
                    currentSong?.id === song.id ? "text-primary shadow-primary/20" : "text-foreground"
                  )}>
                    {song.title}
                  </span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    {downloadedIds[song.id] && (
                        <Check className="h-3 w-3 text-[var(--success)] stroke-[3px]" />
                    )}
                    <span 
                      className="text-xs font-medium text-muted-foreground hover:underline hover:text-foreground truncate transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/artist/${song.artistId}`);
                      }}
                    >
                      {song.artist}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs text-muted-foreground tabular-nums font-medium opacity-60">
                    {formatDuration(song.duration)}
                  </span>
                  <div className="w-10 flex justify-end">
                    <AddToPlaylistDropdown songId={song.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 px-4 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-xs font-bold">{album.year}</p>
            <p className="text-[10px] mt-1 uppercase tracking-tighter">© {album.artist} • {t('common.distributed_by')} YuMusic</p>
          </div>

          {albumInfo?.notes && (
            <div className="mt-16 px-4 max-w-3xl">
              <h2 className="text-lg font-bold mb-4">{t('common.about')}</h2>
              <div 
                className="text-sm leading-relaxed text-muted-foreground prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: albumInfo.notes }}
              />
            </div>
          )}

          <div className="mt-24 px-4 pb-12 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-black group cursor-pointer">
                  {t('common.more_by')} {album.artist}
                  <span className="ml-2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('common.see_all')}
                  </span>
                </h2>
             </div>
             
             {!artistAlbums ? (
               <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
                 ))}
               </div>
             ) : (
               <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 {artistAlbums.album
                   ?.filter((a: any) => a.id !== id)
                   ?.slice(0, 12)
                   ?.map((featuredAlbum: any) => (
                    <AlbumCard 
                      key={featuredAlbum.id} 
                      album={featuredAlbum} 
                      subtitle={featuredAlbum.year?.toString()}
                      getCoverArt={getCoverUrl} 
                      navigate={navigate}
                      onPlay={() => {}} 
                    />
                 ))}
               </div>
             )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
