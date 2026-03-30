import { useParams, useNavigate } from 'react-router';
import { useArtist, useCoverArtUrl, useTopSongs, useSearchSongs } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Clock } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function ArtistSongs() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artist, isLoading: loadingArtist } = useArtist(id);
  const { data: topSongs, isLoading: loadingTopSongs, isSuccess: topSuccess } = useTopSongs(artist?.name, 50);
  const { data: searchSongs, isLoading: loadingSearch } = useSearchSongs(
    (!topSongs || topSongs.length === 0) && topSuccess ? artist?.name : undefined, 
    50
  );

  const songs = (topSongs && topSongs.length > 0) ? topSongs : (searchSongs || []);
  const isLoading = loadingArtist || (loadingTopSongs && !topSuccess) || (loadingSearch && (!topSongs || topSongs.length === 0));
  
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">{t('common.loading')}...</div>;
  if (!artist) return <div className="p-8 text-muted-foreground">{t('common.not_found')}</div>;

  return (
    <div className="w-full space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('common.artist')}</span>
          <h1 className="text-3xl font-black">{artist.name} — {t('common.all_songs')}</h1>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-white/5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <div className="flex justify-center">#</div>
          <div>{t('common.title')}</div>
          <div className="hidden md:block">{t('common.album')}</div>
          <div className="flex justify-end"><Clock className="h-4 w-4" /></div>
        </div>

        {songs?.map((song, index) => (
          <div 
            key={song.id} 
            className={cn(
              "grid grid-cols-[40px_1fr_1fr_auto] gap-4 px-4 py-3 rounded-md hover:bg-muted/50 cursor-pointer group transition items-center",
              currentSong?.id === song.id && "bg-muted/40"
            )}
            onClick={() => {
              if (config && songs) {
                setQueue(songs);
                setSong(song, config);
              }
            }}
          >
            <div className="flex justify-center items-center">
              {currentSong?.id === song.id ? (
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
              ) : (
                <span className="text-sm text-muted-foreground group-hover:hidden">{index + 1}</span>
              )}
              <Play className={cn(
                "h-3 w-3 fill-current hidden",
                currentSong?.id !== song.id && "group-hover:block text-primary"
              )} />
            </div>
            
            <div className="flex items-center space-x-3 truncate">
              <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                <img 
                  src={getCoverUrl(song.coverArt || song.albumId)} 
                  alt={song.title} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col truncate">
                <span className={cn(
                  "text-sm font-medium truncate",
                  currentSong?.id === song.id ? "text-primary" : "text-foreground"
                )}>{song.title}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center text-sm text-muted-foreground truncate">
              <span className="truncate hover:underline cursor-pointer" onClick={(e) => {
                e.stopPropagation();
                navigate(`/album/${song.albumId}`);
              }}>{song.album}</span>
            </div>

            <div className="flex justify-end text-sm text-muted-foreground tabular-nums">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
