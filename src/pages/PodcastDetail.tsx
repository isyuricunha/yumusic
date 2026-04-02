import { useParams, useNavigate } from 'react-router';
import { usePodcasts, useCoverArtUrl, SubsonicSong, SubsonicPodcast } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Clock, Trash2, Loader2, Check } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { usePodcastStore } from '@/store/podcastStore';
import { useDialogStore } from '@/store/dialogStore';
import { fetchRSS } from '@/services/rssService';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useDownloadStore } from '@/store/downloadStore';
import { downloadSong, downloadPodcastEpisodes } from '@/services/downloadService';

export default function PodcastDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Identify if this is a local podcast
  const isLocalId = id?.startsWith('http');
  
  const { data: serverPodcasts, isLoading: loadingServer } = usePodcasts({ enabled: !isLocalId });
  const { removePodcast } = usePodcastStore();
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();
  const { downloadedIds, downloadingIds } = useDownloadStore();
  const { settings } = useAppSettingsStore();

  const [localPodcastData, setLocalPodcastData] = useState<SubsonicPodcast | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50); // Initial 50 items

  useEffect(() => {
    if (isLocalId && id) {
      setLoadingLocal(true);
      fetchRSS(decodeURIComponent(id))
        .then(feed => {
          setLocalPodcastData({
            id: id,
            title: feed.title,
            description: feed.description,
            coverArt: feed.image,
            episode: feed.items,
            isLocal: true
          });
        })
        .catch(err => console.error('Failed to fetch local RSS detail', err))
        .finally(() => setLoadingLocal(false));
    }
  }, [id, isLocalId]);

  const podcast = useMemo(() => {
    if (isLocalId) return localPodcastData;
    return serverPodcasts?.find(p => p.id === id);
  }, [id, isLocalId, serverPodcasts, localPodcastData]);

  const episodes = podcast?.episode || [];
  const visibleEpisodes = useMemo(() => episodes.slice(0, visibleCount), [episodes, visibleCount]);

  const handlePlayEpisode = async (episode: SubsonicSong) => {
    if (config || podcast?.isLocal) {
      setQueue(episodes);
      setSong(episode, config!);

      // Auto-download if enabled
      if (settings.downloadPodcasts && !downloadedIds[episode.id]) {
        downloadSong(episode);
      }
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 100);
  };

  const handleDeleteLocal = async () => {
    if (id) {
      const { openDialog } = useDialogStore.getState();
      const confirmed = await openDialog({
        title: t('podcasts.delete_confirm_title'),
        description: t('podcasts.delete_confirm_desc'),
        destructive: true,
        confirmText: t('common.delete')
      });
      if (confirmed) {
        await removePodcast(id);
        navigate('/podcasts');
      }
    }
  };

  if ((isLocalId ? loadingLocal : loadingServer)) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 animate-pulse text-muted-foreground uppercase tracking-widest font-black text-xs">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        {t('common.loading')}...
      </div>
    );
  }

  if (!podcast && !loadingLocal && !loadingServer) return <div className="p-8 text-muted-foreground">{t('common.not_found')}</div>;
  if (!podcast) return null;

  return (
    <div className="w-full space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        {podcast.isLocal && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={handleDeleteLocal}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg shadow-2xl overflow-hidden bg-muted flex-shrink-0">
          <img 
            src={podcast.isLocal ? (podcast.coverArt || '') : getCoverUrl(podcast.coverArt || podcast.id)} 
            alt={podcast.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t('common.podcast')}</span>
            {podcast.isLocal && (
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{t('podcasts.rss_tag')}</span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{podcast.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <span>{episodes.length} {t('common.episodes')}</span>
          </div>
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

            <Button 
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full h-14 w-14 border-2 transition-all duration-300 shadow-lg",
                episodes.slice(0, 5).every(ep => !!downloadedIds[ep.id]) 
                  ? "bg-[var(--success)] border-[var(--success)] text-[var(--success-foreground)] hover:scale-105" 
                  : "text-muted-foreground border-muted-foreground/30 hover:border-primary/50"
              )}
              onClick={async (e) => {
                e.stopPropagation();
                if (episodes.length > 0) {
                  await downloadPodcastEpisodes(podcast.id, episodes, 5);
                }
              }}
              disabled={episodes.slice(0, 5).some(ep => downloadingIds.has(ep.id))}
            >
              {episodes.slice(0, 5).some(ep => downloadingIds.has(ep.id)) ? (
                 <Loader2 className="h-6 w-6 animate-spin" />
              ) : episodes.slice(0, 5).every(ep => !!downloadedIds[ep.id]) ? (
                 <Check className="h-7 w-7 stroke-[3px]" />
              ) : (
                 <ArrowDownToLine className="h-6 w-6" />
              )}
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
          {visibleEpisodes.map((episode, index) => (
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
                    "font-medium text-sm truncate flex items-center gap-2",
                    currentSong?.id === episode.id ? "text-primary" : "text-foreground"
                  )}>
                    {episode.title}
                    {downloadedIds[episode.id] && !downloadingIds.has(episode.id) && (
                      <div className="bg-[var(--success)] rounded-full p-[2px] shrink-0">
                        <Check className="h-2.5 w-2.5 text-white stroke-[4px]" />
                      </div>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{episode.year || ''}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground tabular-nums opacity-50">
                  {episode.duration >= 3600 
                    ? `${Math.floor(episode.duration / 3600)}:${Math.floor((episode.duration % 3600) / 60).toString().padStart(2, '0')}:${(episode.duration % 60).toString().padStart(2, '0')}`
                    : `${Math.floor(episode.duration / 60)}:${(episode.duration % 60).toString().padStart(2, '0')}`}
                </span>

                {downloadingIds.has(episode.id) ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : !downloadedIds[episode.id] && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSong(episode);
                    }}
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {visibleCount < episodes.length && (
            <div className="pt-8 flex justify-center pb-12">
              <Button 
                variant="outline" 
                onClick={handleShowMore}
                className="rounded-full px-12"
              >
                {t('common.show_more')} ({episodes.length - visibleCount} {t('common.remaining')})
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
