import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Repeat, Shuffle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useGetCoverArtUrl } from '@/hooks/useSubsonic';
import { useTranslation } from 'react-i18next';

export function PlayerBar() {
  const { t } = useTranslation();
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume, 
    progress, 
    duration, 
    setProgress,
    next,
    previous 
  } = usePlayerStore();
  const config = useConfigStore((state) => state.config);
  const getCoverArt = useGetCoverArtUrl;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number | readonly number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    setProgress(val as number);
  };

  const handleVolume = (value: number | readonly number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    setVolume((val as number) / 100);
  };

  if (!config) return null;

  return (
    <div className="h-24 bg-card border-t border-border flex items-center justify-between px-4 z-50 fixed bottom-0 left-0 right-0">
      
      {/* Current Track Info */}
      <div className="flex items-center w-1/4 min-w-[200px]">
        <div className="w-14 h-14 bg-muted rounded-md shadow flex-shrink-0">
          {currentSong && (
            <img 
              src={getCoverArt(currentSong.coverArt || currentSong.albumId)} 
              alt={currentSong.title} 
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        <div className="ml-4 flex flex-col justify-center overflow-hidden">
          <div className="font-semibold text-sm hover:underline cursor-pointer truncate">
            {currentSong ? currentSong.title : t('player.not_playing')}
          </div>
          <div className="text-xs text-muted-foreground hover:underline cursor-pointer truncate">
            {currentSong ? currentSong.artist : 'Yumusic Player'}
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center justify-center w-2/4 max-w-[722px]">
        <div className="flex items-center space-x-4 mb-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => previous(config)}
            disabled={!currentSong}
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={togglePlay}
            disabled={!currentSong}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 ml-1 fill-current" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => next(config)}
            disabled={!currentSong}
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-full flex items-center space-x-2 text-xs text-muted-foreground font-medium">
          <span className="w-10 text-right">{formatTime(progress)}</span>
          <Slider 
            value={[progress]} 
            max={duration || 100} 
            step={1} 
            className="w-full flex-grow hover:cursor-pointer" 
            onValueChange={handleSeek}
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Side Controls */}
      <div className="flex items-center justify-end w-1/4 space-x-2 pr-2">
        <Volume2 className="h-5 w-5 text-muted-foreground" />
        <div className="w-24">
          <Slider 
            value={[volume * 100]} 
            max={100} 
            step={1} 
            className="w-full hover:cursor-pointer" 
            onValueChange={handleVolume}
          />
        </div>
        <MaxmizeIcon />
      </div>

    </div>
  );
}

function MaxmizeIcon() {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground ml-2">
      <Maximize className="h-4 w-4" />
    </Button>
  );
}
