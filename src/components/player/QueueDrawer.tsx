import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useCoverArtUrl } from '@/hooks/useSubsonic';
import { cn } from '@/lib/utils';
import { X, Play, Music, Trash2, ListMusic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArtistLinks } from '@/components/ArtistLinks';
import { useTranslation } from 'react-i18next';

export function QueueDrawer() {
  const { t } = useTranslation();
  const { 
    queue, 
    currentSong, 
    isQueueVisible, 
    toggleQueue, 
    setSong, 
    removeFromQueue, 
    clearQueue,
    isPlaying
  } = usePlayerStore();
  const config = useConfigStore((state) => state.config);
  const getCoverArt = useCoverArtUrl();

  if (!isQueueVisible) return null;

  const currentIndex = currentSong ? queue.findIndex(s => s.id === currentSong.id) : -1;
  const nextUp = currentIndex !== -1 ? queue.slice(currentIndex + 1) : [
    ...(queue.length > 0 ? queue : [])
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-[400px] z-[100] bg-zinc-950/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col transition-all duration-500 ease-in-out transform",
        isQueueVisible ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
            <ListMusic className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-black tracking-tight">{t('common.queue')}</h2>
        </div>
        <div className="flex items-center gap-1">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearQueue}
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title={t('player.clear_queue')}
            >
                <Trash2 className="h-5 w-5" />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleQueue}
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            >
                <X className="h-6 w-6" />
            </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="space-y-8">
          {/* Now Playing Section */}
          {currentSong && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground pl-2 px-2">
                {t('player.now_playing')}
              </h3>
              <div className="group relative bg-primary/5 border border-primary/20 rounded-xl overflow-hidden p-3 transition-all hover:bg-primary/10">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-lg shadow-2xl overflow-hidden flex-shrink-0 relative">
                    <img 
                      src={getCoverArt(currentSong.coverArt || currentSong.albumId)} 
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700",
                        isPlaying ? "scale-110" : "scale-100 opacity-80"
                      )}
                    />
                    {isPlaying && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="font-bold text-primary truncate text-lg leading-tight tracking-tight">
                      {currentSong.title}
                    </span>
                    <span className="text-sm text-muted-foreground truncate hover:text-foreground transition-colors cursor-default">
                      {currentSong.artist}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Up Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground pl-2 px-2">
                {t('player.next_up')}
            </h3>
            <div className="space-y-1">
              {nextUp.length > 0 ? (
                nextUp.map((song, idx) => (
                  <div 
                    key={`${song.id}-${idx}`}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5 relative overflow-hidden"
                    onClick={() => config && setSong(song, config)}
                  >
                    <div className="w-6 text-center text-xs font-bold text-muted-foreground group-hover:hidden tabular-nums">
                      {idx + 1}
                    </div>
                    <div className="w-6 hidden group-hover:flex items-center justify-center">
                      <Play className="h-3.5 w-3.5 text-primary fill-current" />
                    </div>
                    
                    <div className="h-10 w-10 bg-muted rounded shadow-md overflow-hidden flex-shrink-0 relative">
                        <img src={getCoverArt(song.coverArt || song.albumId)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-bold truncate group-hover:text-primary transition-colors pr-2">
                        {song.title}
                      </span>
                      <ArtistLinks 
                        artist={song.artist} 
                        artistId={song.artistId} 
                        artists={song.artists}
                        className="text-[11px]"
                        linkClassName="text-muted-foreground hover:text-foreground no-underline hover:underline font-medium"
                      />
                    </div>

                    <div className="items-center gap-2 hidden group-hover:flex pr-1 transition-all">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                         onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(song.id);
                         }}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                    
                    <div className="text-[10px] tabular-nums text-muted-foreground group-hover:hidden font-mono opacity-50 px-1 pt-1 self-start">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 animate-pulse">
                        <Music className="h-10 w-10 text-muted-foreground opacity-20" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            {t('player.queue_empty')}
                        </p>
                        <p className="text-[11px] opacity-40">
                             {t('player.queue_empty_desc')}
                        </p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {nextUp.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-black/40 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                 {t('player.songs_in_queue_other', { count: nextUp.length })}
              </span>
          </div>
      )}
    </div>
  );
}
