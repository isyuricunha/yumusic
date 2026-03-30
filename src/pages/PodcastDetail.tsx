import { useParams, useNavigate } from 'react-router';
import { usePodcasts, useCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Clock } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function PodcastDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: podcasts, isLoading } = usePodcasts();
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();

  const podcast = podcasts?.find(p => p.id === id);
  const episodes = podcast?.episode || [];

  const handlePlayEpisode = (episode: SubsonicSong) => {
    if (config) {
      setQueue(episodes);
      setSong(episode, config);
    }
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">{t('common.loading')}...</div>;
  if (!podcast) return <div className="p-8 text-muted-foreground">{t('common.not_found')}</div>;

  return (
    <div className="w-full space-y-8 pb-12">
      <Button 
        variant="ghost" 
        size="sm" 
        className="-ml-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg shadow-2xl overflow-hidden bg-muted flex-shrink-0">
          <img 
            src={getCoverUrl(podcast.coverArt)} 
            alt={podcast.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">{t('common.podcast')}</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{podcast.title}</h1>
          <p className="text-muted-foreground max-w-2xl text-sm line-clamp-3">
            {podcast.description}
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <Button 
              size="lg" 
              className="rounded-full px-8 font-bold h-14"
              onClick={() => episodes[0] && handlePlayEpisode(episodes[0])}
              disabled={episodes.length === 0}
            >
              <Play className="h-6 w-6 mr-2 fill-current" />
              {t('common.play')}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="border-b border-border/40 pb-4 mb-4 grid grid-cols-[1fr_auto] px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>{t('common.episode')}</span>
          <Clock className="h-4 w-4" />
        </div>
        
        <div className="flex flex-col space-y-1">
          {episodes.map((episode, index) => (
            <div 
              key={episode.id} 
              className={cn(
                "group flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors",
                currentSong?.id === episode.id && "bg-muted/40"
              )}
              onClick={() => handlePlayEpisode(episode)}
            >
              <div className="flex items-center space-x-4 overflow-hidden">
                <span className={cn(
                  "w-4 text-sm text-right tabular-nums opacity-50 group-hover:hidden",
                  currentSong?.id === episode.id && "hidden"
                )}>
                  {index + 1}
                </span>
                <Play className={cn(
                   "h-4 w-4 text-primary fill-current hidden group-hover:block",
                   currentSong?.id === episode.id && "block"
                )} />
                <div className="flex flex-col overflow-hidden">
                  <span className={cn(
                    "font-medium text-sm truncate",
                    currentSong?.id === episode.id ? "text-primary" : "text-foreground"
                  )}>{episode.title}</span>
                  <span className="text-xs text-muted-foreground truncate">{episode.year || ''}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums opacity-50">
                {Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
