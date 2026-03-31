import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Repeat, Shuffle, Music, Heart, ListMusic } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useCoverArtUrl } from '@/hooks/useSubsonic';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

import { useNavigate } from 'react-router';

export function PlayerBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    previous,
    isShuffle,
    repeatMode,
    toggleShuffle,
    setRepeatMode
  } = usePlayerStore();
  const config = useConfigStore((state) => state.config);
  const getCoverArt = useCoverArtUrl();

  const handleRepeatToggle = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

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
    <div className="h-[96px] bg-black border-t border-white/5 flex items-center justify-between px-4 z-50 fixed bottom-0 left-0 right-0 select-none">
      
      {/* 1. Left: Current Track Info */}
      <div className="flex items-center w-[30%] min-w-[180px]">
        <div className="w-14 h-14 bg-muted rounded shadow-lg flex-shrink-0 group relative overflow-hidden">
          {currentSong ? (
            <img 
              src={getCoverArt(currentSong.coverArt || currentSong.albumId)} 
              alt={currentSong.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <Music className="h-6 w-6 opacity-20" />
             </div>
          )}
        </div>
        <div className="ml-4 flex flex-col justify-center overflow-hidden mr-4">
          <div 
            className="font-bold text-sm text-foreground hover:underline cursor-pointer truncate leading-tight"
            onClick={() => currentSong && navigate(`/album/${currentSong.albumId}`)}
          >
            {currentSong ? currentSong.title : t('player.not_playing')}
          </div>
          <div 
            className="text-[11px] text-muted-foreground hover:underline hover:text-foreground cursor-pointer truncate mt-0.5 transition-colors"
            onClick={() => currentSong && navigate(`/artist/${currentSong.artistId || ''}`)}
          >
            {currentSong ? currentSong.artist : 'YuMusic Player'}
          </div>
        </div>
        {currentSong && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 2. Center: Main Player Controls */}
      <div className="flex flex-col items-center justify-center w-[40%] max-w-[722px] px-4">
        <div className="flex items-center space-x-6 mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 transition-all hover:scale-110 active:scale-95"
            onClick={toggleShuffle}
          >
            <Shuffle className={cn(
              "h-4 w-4",
              isShuffle ? "text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]" : "text-muted-foreground"
            )} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-90"
            onClick={() => previous(config)}
            disabled={!currentSong}
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-md"
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
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-90"
            onClick={() => next(config)}
            disabled={!currentSong}
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 transition-all hover:scale-110 active:scale-95"
            onClick={handleRepeatToggle}
          >
            <div className="relative">
              <Repeat className={cn(
                "h-4 w-4",
                repeatMode !== 'none' ? "text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]" : "text-muted-foreground"
              )} />
              {repeatMode === 'one' && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black text-primary">1</span>
              )}
            </div>
          </Button>
        </div>
        
        <div className="w-full flex items-center space-x-2 text-[11px] text-muted-foreground font-medium">
          <span className="min-w-[40px] text-right tabular-nums opacity-60 font-mono">{formatTime(progress)}</span>
          <Slider 
            value={[progress]} 
            max={duration || 100} 
            step={0.1} 
            className="w-full flex-grow hover:cursor-pointer group" 
            onValueChange={handleSeek}
          />
          <span className="min-w-[40px] opacity-60 font-mono tracking-tighter">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Right: Device & Volume Controls */}
      <div className="flex items-center justify-end w-[30%] min-w-[180px] space-x-3 pr-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100">
           <ListMusic className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2 group">
          <Volume2 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <div className="w-24">
            <Slider 
              value={[volume * 100]} 
              max={100} 
              step={1} 
              className="w-full hover:cursor-pointer" 
              onValueChange={handleVolume}
            />
          </div>
        </div>
        <MaxmizeIcon />
      </div>

    </div>
  );
}

function MaxmizeIcon() {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 ml-1">
      <Maximize className="h-4 w-4" />
    </Button>
  );
}
