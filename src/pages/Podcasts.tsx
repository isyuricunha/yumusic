import { usePodcasts, useCoverArtUrl } from '@/hooks/useSubsonic';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function Podcasts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: podcasts, isLoading, isError, error } = usePodcasts();
  const getCoverUrl = useCoverArtUrl();

  const isNotImplemented = error instanceof Error && error.message.includes('[501]');

  if (isError && isNotImplemented) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl">📻</span>
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-primary">{t('common.not_supported')}</h2>
          <p className="text-muted-foreground">{t('common.feature_not_implemented')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-8 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.podcasts')}</h1>

      {isLoading ? (
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {podcasts?.map((podcast) => (
            <div 
              key={podcast.id} 
              className="group cursor-pointer flex flex-col space-y-3"
              onClick={() => navigate(`/podcast/${podcast.id}`)}
            >
              <div className="overflow-hidden rounded-lg shadow-md bg-muted aspect-square transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <img 
                  src={getCoverUrl(podcast.coverArt || podcast.id)} 
                  alt={podcast.title} 
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm line-clamp-1" title={podcast.title}>{podcast.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1 truncate block">{podcast.description || 'Podcast Channel'}</span>
              </div>
            </div>
          ))}
          {podcasts && podcasts.length === 0 && !isError && (
            <p className="text-muted-foreground">No podcasts found on your server.</p>
          )}
        </div>
      )}
    </div>
  );
}
