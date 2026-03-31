import { useParams, useNavigate } from 'react-router';
import { useAlbum, useAlbumInfo, useCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, Clock } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AddToPlaylistDropdown } from '@/components/player/AddToPlaylistDropdown';
import { useState, useMemo, useEffect } from 'react';
import { Check, Loader2, ArrowDownToLine } from 'lucide-react';
import { useDownloadStore } from '@/store/downloadStore';
import { downloadSong } from '@/services/downloadService';

export default function AlbumDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: album, isLoading } = useAlbum(id);
  const { data: albumInfo } = useAlbumInfo(id);
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();
  const { downloadedIds, downloadingIds } = useDownloadStore();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

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

  const onScroll = (e: any) => {
    // Check if the scroll container (parent) has scrolled
    setIsHeaderSticky(e.target.scrollTop > 350);
  };

  // Attach scroll listener to the main content area after mount
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
      
      {/* Sticky Top Bar (Spotify style) */}
      <div className={cn(
        "sticky top-0 z-50 -mx-6 px-10 h-16 flex items-center bg-background/80 backdrop-blur-xl border-b border-white/5 transition-all duration-500",
        isHeaderSticky ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
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
        className="absolute inset-0 h-[500px] pointer-events-none opacity-40 transition-all duration-1000 z-0"
        style={{
          background: `linear-gradient(to bottom, var(--primary) -20%, transparent 100%)`
        }}
      />

      {/* Header Segment */}
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
          <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-none py-2">
             {album.name}
          </h1>
          <div className="flex items-center space-x-2 text-sm font-bold flex-wrap gap-y-2">
            <span 
              className="hover:underline cursor-pointer flex items-center gap-2"
              onClick={() => navigate(`/artist/${album.artistId}`)}
            >
              <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                <img src={getCoverUrl(album.artistId || album.id)} className="w-full h-full object-cover" />
              </div>
              {album.artist}
            </span>
            <span className="text-foreground/60">•</span>
            <span className="text-foreground/90">{album.year}</span>
            <span className="text-foreground/40">•</span>
            <span className="text-foreground/90">{album.songCount} {t('common.songs')}</span>
            <span className="text-foreground/40 font-normal">,</span>
            <span className="text-foreground/40 font-normal">
              {Math.floor(album.song?.reduce((acc, s) => acc + s.duration, 0) / 60)} min
            </span>
          </div>
        </div>
      </div>

      {/* Main Content & Actions */}
      <div className="relative z-10 bg-black/20 backdrop-blur-3xl -mx-6 px-6 pt-6 flex flex-col flex-1 pb-16">
        
        {/* Actions Bar */}
        <div className="flex items-center space-x-8 mb-8">
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-2xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all" 
            onClick={handlePlayAlbum}
          >
            <Play className="h-6 w-6 fill-current ml-1" />
          </Button>

          <Button 
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-10 w-10 transition-all duration-300",
              isAlbumDownloaded 
                ? "text-[var(--success)] shadow-[0_0_15px_rgba(29,185,84,0.2)]" 
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
               <Check className="h-6 w-6 stroke-[3px]" />
            ) : (
               <ArrowDownToLine className="h-6 w-6" />
            )}
          </Button>

          <Button 
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground transition-all"
          >
            <Play className="h-6 w-6 rotate-90" /> {/* Placeholder for 'More' ellipsis or similar context button */}
          </Button>
        </div>

        {/* Songs List */}
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

          {/* Release Info */}
          <div className="mt-12 px-4 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-xs font-bold">{album.year}</p>
            <p className="text-[10px] mt-1 uppercase tracking-tighter">© {album.artist} • Distributed by YuMusic</p>
          </div>

          {/* Review section if exists */}
          {albumInfo?.notes && (
            <div className="mt-16 px-4 max-w-3xl">
              <h2 className="text-lg font-bold mb-4">About</h2>
              <div 
                className="text-sm leading-relaxed text-muted-foreground prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: albumInfo.notes }}
              />
            </div>
          )}

          {/* More by Artist (Spotify style detail) */}
          <div className="mt-24 px-4">
             <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-black group cursor-pointer">
                  {t('common.more_by')} {album.artist}
                  <span className="ml-2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Show all
                  </span>
                </h2>
             </div>
             {/* Simple placeholder for actual cards since we need to fetch artist albums */}
             <div className="text-sm text-muted-foreground italic opacity-50">
                Explore more tracks from {album.artist} in their profile.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
