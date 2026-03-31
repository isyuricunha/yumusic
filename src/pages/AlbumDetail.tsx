import { useParams, useNavigate } from 'react-router';
import { useAlbum, useAlbumInfo, useCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AddToPlaylistDropdown } from '@/components/player/AddToPlaylistDropdown';
import { useState, useMemo } from 'react';
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
  const [showFullReview, setShowFullReview] = useState(false);
  const { downloadedIds, downloadingIds } = useDownloadStore();

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

  if (isLoading) return <div className="animate-pulse text-muted-foreground p-8">{t('common.loading')}...</div>;
  if (!album) return <div className="p-8">{t('common.not_found')}</div>;

  return (
    <div className="flex flex-col space-y-8 pb-12">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      <div className="flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-32 h-32 md:w-48 md:h-48 shadow-2xl rounded-lg overflow-hidden shrink-0 bg-muted">
          <img 
            src={getCoverUrl(album.coverArt || album.id)} 
            alt={album.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Album</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{album.name}</h1>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span 
              className="hover:underline cursor-pointer text-primary"
              onClick={() => navigate(`/artist/${album.artistId}`)}
            >
              {album.artist}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{album.year}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{album.songCount} {t('search.songs')}</span>
          </div>
        </div>
      </div>

      {albumInfo?.notes && (
        <section className="bg-muted/30 rounded-xl p-6 border border-border/50 max-w-4xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Review</h2>
          <div className="relative">
            <div 
              className={`text-sm leading-relaxed text-muted-foreground prose prose-invert max-w-none transition-all duration-500 overflow-hidden ${showFullReview ? 'max-h-[2000px]' : 'max-h-24'}`}
              dangerouslySetInnerHTML={{ __html: albumInfo.notes }}
            />
            {!showFullReview && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 text-primary hover:text-primary/80 p-0 h-auto font-semibold flex items-center"
            onClick={() => setShowFullReview(!showFullReview)}
          >
            {showFullReview ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Read More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </section>
      )}

      <div className="flex items-center space-x-4">
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform" 
          onClick={handlePlayAlbum}
        >
          <Play className="h-6 w-6 fill-current ml-1" />
        </Button>

        <Button 
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full h-11 w-11 border-2 transition-all duration-300 shadow-md",
            isAlbumDownloaded 
              ? "bg-[var(--success)] border-[var(--success)] text-[var(--success-foreground)] hover:scale-105" 
              : "text-muted-foreground border-muted-foreground/30 hover:border-primary/50 hover:text-primary"
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
             <Loader2 className="h-5 w-5 animate-spin" />
          ) : isAlbumDownloaded ? (
             <Check className="h-6 w-6 stroke-[3px]" />
          ) : (
             <ArrowDownToLine className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <span className="hidden md:inline w-8 text-center">#</span>
          <span>Title</span>
          <Clock className="h-4 w-4" />
        </div>

        <div className="flex flex-col">
          {album.song?.map((song, index) => (
            <div 
              key={song.id} 
              className={cn(
                "grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 rounded-md hover:bg-muted/50 cursor-pointer group transition items-center",
                currentSong?.id === song.id && "bg-muted/40"
              )}
              onClick={() => handlePlaySong(song)}
            >
              <div className="hidden md:flex w-8 justify-center items-center">
                {currentSong?.id === song.id ? (
                   <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                ) : (
                  <span className="text-sm text-muted-foreground group-hover:hidden">{index + 1}</span>
                )}
                <Play className={cn(
                  "h-3 w-3 fill-current hidden",
                  currentSong?.id !== song.id && "group-hover:block"
                )} />
              </div>
              <div className="flex flex-col truncate">
                <span className={cn(
                  "text-sm font-medium truncate flex items-center gap-2",
                  currentSong?.id === song.id ? "text-primary" : "text-foreground"
                )}>
                  {song.title}
                  {downloadedIds[song.id] && !downloadingIds.has(song.id) && (
                    <div className="bg-[var(--success)] rounded-full p-[2px] shrink-0">
                      <Check className="h-2.5 w-2.5 text-white stroke-[4px]" />
                    </div>
                  )}
                </span>
                <span 
                  className="text-xs text-muted-foreground truncate hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artist/${song.artistId}`);
                  }}
                >
                  {song.artist}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatDuration(song.duration)}
                </span>
                
                {downloadingIds.has(song.id) ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : !downloadedIds[song.id] && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSong(song);
                    }}
                  >
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                  </Button>
                )}

                <AddToPlaylistDropdown songId={song.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
