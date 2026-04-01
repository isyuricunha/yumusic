import { usePodcasts, useCoverArtUrl, SubsonicPodcast } from '@/hooks/useSubsonic';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AddPodcastDialog } from '@/components/modals/AddPodcastDialog';
import { usePodcastStore } from '@/store/podcastStore';
import { useEffect, useMemo } from 'react';
import { Radio } from 'lucide-react';

export default function Podcasts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: serverPodcasts, isLoading, isError, error } = usePodcasts();
  const { localPodcasts, initializePodcasts } = usePodcastStore();
  const getCoverUrl = useCoverArtUrl();

  useEffect(() => {
    initializePodcasts();
  }, [initializePodcasts]);

  const isNotImplemented = error instanceof Error && error.message.includes('[501]');

  const allPodcasts = useMemo(() => {
    const combined: (SubsonicPodcast | (SubsonicPodcast & { isLocal: boolean }))[] = [];
    if (serverPodcasts) combined.push(...serverPodcasts);
    if (localPodcasts) {
      localPodcasts.forEach(lp => {
        combined.push({
          id: lp.id,
          title: lp.title,
          description: lp.description,
          coverArt: lp.coverArt,
          isLocal: true
        } as any);
      });
    }
    return combined;
  }, [serverPodcasts, localPodcasts]);

  return (
    <div className="w-full space-y-8 pb-8 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.podcasts')}</h1>
          {isNotImplemented && (
            <p className="text-sm text-muted-foreground mt-1">{t('podcasts.unsupported_server')}</p>
          )}
        </div>
        <AddPodcastDialog />
      </div>

      {isError && isNotImplemented && allPodcasts.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/20 rounded-2xl border border-border/40">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Radio className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl font-bold text-primary">{t('common.not_supported')}</h2>
            <p className="text-muted-foreground">{t('common.feature_not_implemented')}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {allPodcasts.map((podcast) => (
            <div 
              key={podcast.id} 
              className="group cursor-pointer flex flex-col space-y-3"
              onClick={() => navigate(`/podcast/${encodeURIComponent(podcast.id)}`)}
            >
              <div className="overflow-hidden rounded-lg shadow-md bg-muted aspect-square relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <img 
                  src={podcast.isLocal ? (podcast.coverArt || '') : getCoverUrl(podcast.coverArt || podcast.id)} 
                  alt={podcast.title} 
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                  loading="lazy"
                />
                {podcast.isLocal && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {t('podcasts.rss_tag')}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm line-clamp-1" title={podcast.title}>{podcast.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1 truncate block">
                  {podcast.description || (podcast.isLocal ? t('podcasts.local_rss_feed') : t('podcasts.podcast_channel'))}
                </span>
              </div>
            </div>
          ))}
          {allPodcasts.length === 0 && !isLoading && !isError && (
            <p className="text-muted-foreground col-span-full py-12 text-center italic">{t('podcasts.no_podcasts')}</p>
          )}
        </div>
      )}
    </div>
  );
}
