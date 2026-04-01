import { useAlbum, useCoverArtUrl, SubsonicAlbum, SubsonicSong } from '@/hooks/useSubsonic';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useTranslation } from 'react-i18next';
import { Play, MoreHorizontal, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DiscographyAlbumRowProps {
  album: SubsonicAlbum;
  index: number;
}

export function DiscographyAlbumRow({ album }: DiscographyAlbumRowProps) {
  const { t } = useTranslation();
  const { data: fullAlbum, isLoading } = useAlbum(album.id);
  const getCoverUrl = useCoverArtUrl();
  const { setSong, setQueue, currentSong, isPlaying } = usePlayerStore();
  const config = useConfigStore((state) => state.config);

  const songs = fullAlbum?.song || [];
  const albumArt = getCoverUrl(album.coverArt || album.id);

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (song: SubsonicSong) => {
    if (config) {
      setQueue(songs);
      setSong(song, config);
    }
  };

  const handlePlayAlbum = () => {
    if (config && songs.length > 0) {
      setQueue(songs);
      setSong(songs[0], config);
    }
  };

  // If simplified album info, try to show something
  if (isLoading) {
    return (
      <div className="flex gap-8 py-8 animate-pulse border-b border-white/5">
        <div className="w-48 h-48 bg-muted rounded-lg shadow-xl shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-2 pt-4">
             {[1, 2, 3].map(i => <div key={i} className="h-10 bg-muted/50 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 py-10 group/row border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      {/* Left Column: Album Identity */}
      <div className="w-full md:w-56 shrink-0 flex flex-col space-y-4">
        <div className="relative aspect-square w-full rounded-lg shadow-2xl overflow-hidden group/art cursor-pointer" onClick={handlePlayAlbum}>
          <img 
            src={albumArt} 
            alt={album.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover/art:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-2xl text-black">
              <Play className="h-6 w-6 fill-current ml-1" />
            </div>
          </div>
        </div>
        <div className="flex flex-col px-1">
          <h3 className="text-xl font-black text-white leading-tight mb-1 group-hover/row:text-primary transition-colors cursor-pointer" onClick={handlePlayAlbum}>
            {album.name}
          </h3>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span>{album.year || t('common.album')}</span>
            <span>•</span>
            <span>{songs.length} {t('common.songs')}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Tracklist */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2 border-b border-white/5 mb-2">
            <span className="w-8">#</span>
            <span className="flex-1 px-4">{t('common.title')}</span>
            <Clock3 className="h-3 w-3" />
        </div>
        <div className="flex flex-col">
          {songs.map((song, i) => (
            <div 
              key={song.id}
              className={cn(
                "group flex items-center px-4 py-3 rounded-md hover:bg-white/10 transition-all cursor-pointer",
                currentSong?.id === song.id && "bg-white/5"
              )}
              onClick={() => handlePlaySong(song)}
            >
              <div className="w-8 flex justify-center items-center">
                {currentSong?.id === song.id && isPlaying ? (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground group-hover:hidden tabular-nums">
                    {i + 1}
                  </span>
                )}
                <Play className={cn(
                  "h-3 w-3 fill-current hidden",
                  currentSong?.id !== song.id && "group-hover:block text-white"
                )} />
              </div>
              <div className="flex-1 px-4 min-w-0">
                <span className={cn(
                  "text-sm font-bold truncate block",
                  currentSong?.id === song.id ? "text-primary" : "text-white"
                )}>
                  {song.title}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground tabular-nums font-mono opacity-60 group-hover:opacity-100">
                  {formatDuration(song.duration)}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
