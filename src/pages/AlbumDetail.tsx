import { useParams, useNavigate } from 'react-router';
import { useAlbum, useCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Clock } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AddToPlaylistDropdown } from '@/components/player/AddToPlaylistDropdown';

export default function AlbumDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: album, isLoading } = useAlbum(id);
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();

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

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  if (!album) return <div>Not Found</div>;

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
        <div className="w-48 h-48 md:w-64 md:h-64 shadow-2xl rounded-lg overflow-hidden shrink-0">
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
            <span className="hover:underline cursor-pointer text-primary">{album.artist}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{album.year}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{album.songCount} {t('search.songs')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform" 
          onClick={handlePlayAlbum}
        >
          <Play className="h-6 w-6 fill-current ml-1" />
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
                  "text-sm font-medium truncate",
                  currentSong?.id === song.id ? "text-primary" : "text-foreground"
                )}>
                  {song.title}
                </span>
                <span className="text-xs text-muted-foreground truncate">{song.artist}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatDuration(song.duration)}
                </span>
                <AddToPlaylistDropdown songId={song.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
