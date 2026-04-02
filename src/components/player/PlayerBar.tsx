import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Repeat, Shuffle, Music, Heart, ListMusic } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { useDownloadStore } from '@/store/downloadStore';
import { downloadSong } from '@/services/downloadService';
import { useCoverArtUrl, useStarMutation, useFavorites } from '@/hooks/useSubsonic';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

import { useNavigate } from 'react-router';
import { ArtistLinks } from '@/components/ArtistLinks';

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
    setRepeatMode,
    isQueueVisible,
    toggleQueue
  } = usePlayerStore();
  const config = useConfigStore((state) => state.config);
  const { settings } = useAppSettingsStore();
  const { downloadedIds } = useDownloadStore();
  const getCoverArt = useCoverArtUrl();
  const { data: favorites } = useFavorites();
  const starMutation = useStarMutation();
  
  const isStarred = currentSong ? favorites?.song?.some((s: any) => s.id === currentSong.id) : false;

  const handleRepeatToggle = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  const handleToggleStar = async () => {
    if (currentSong && config) {
      const newStarred = !isStarred;
      await starMutation.mutateAsync({ id: currentSong.id, type: 'song', star: newStarred });
      
      // Auto-download if enabled and now starred
      if (newStarred && settings.autoDownloadLiked && !downloadedIds[currentSong.id]) {
        downloadSong(currentSong);
      }
    }
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
    <div className="h-[96px] bg-black border-t border-white/5 flex items-center justify-between px-4 select-none">
      
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
          <ArtistLinks 
            artist={currentSong ? currentSong.artist : t('login.app_title')} 
            artistId={currentSong?.artistId} 
            artists={currentSong?.artists}
            className="text-[11px] h-4"
            linkClassName="text-muted-foreground hover:text-foreground no-underline hover:underline truncate"
          />
        </div>
        {currentSong && (
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 transition-all hover:scale-110",
              isStarred ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={handleToggleStar}
            disabled={starMutation.isPending}
            title={isStarred ? t('common.unstar') : t('common.star')}
          >
            <Heart className={cn("h-4 w-4", isStarred && "fill-current")} />
          </Button>
        )}
      </div>

      {/* 2. Center: Main Player Controls */}
      <div className="flex flex-col items-center justify-center w-[40%] max-w-[722px] px-4">
        <div className="flex items-center space-x-6 mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 transition-all hover:scale-110 active:scale-95",
              isShuffle ? "text-primary" : "text-muted-foreground opacity-70"
            )}
            onClick={toggleShuffle}
            title={t('common.shuffle')}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-90"
            onClick={() => previous(config)}
            title={t('common.previous_track')}
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
            className="h-9 w-9 text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-90"
            onClick={() => next(config)}
            title={t('common.next_track')}
            disabled={!currentSong}
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 transition-all hover:scale-110 active:scale-95"
            onClick={handleRepeatToggle}
            title={t('common.repeat')}
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

      <div className="flex items-center justify-end w-[30%] min-w-[180px] space-x-3 pr-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8 transition-all",
            isQueueVisible ? "text-primary" : "text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100"
          )}
          onClick={toggleQueue}
          title={t('common.toggle_queue')}
        >
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
  const { t } = useTranslation();
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 ml-1"
      title={t('common.full_screen')}
    >
      <Maximize className="h-4 w-4" />
    </Button>
  );
}
