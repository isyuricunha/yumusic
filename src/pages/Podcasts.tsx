import { usePodcasts, useGetCoverArtUrl } from '@/hooks/useSubsonic';
import { useTranslation } from 'react-i18next';

export default function Podcasts() {
  const { t } = useTranslation();
  const { data: podcasts, isLoading } = usePodcasts();
  const getCoverUrl = useGetCoverArtUrl;

  return (
    <div className="w-full space-y-6 pb-8 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.podcasts')}</h1>

      {isLoading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {podcasts?.map((podcast) => (
            <div key={podcast.id} className="group cursor-pointer flex flex-col space-y-3">
              <div className="overflow-hidden rounded-xl shadow-lg aspect-square relative bg-card/40 transition-transform group-hover:scale-[1.03]">
                <img 
                  src={getCoverUrl(podcast.coverArt || podcast.id)} 
                  alt={podcast.title} 
                  className="w-full h-full object-cover transition duration-300 group-hover:brightness-90"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm truncate" title={podcast.title}>{podcast.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">{podcast.description || 'Podcast Channel'}</span>
              </div>
            </div>
          ))}
          {podcasts?.length === 0 && (
            <p className="text-muted-foreground">No podcasts found on your server.</p>
          )}
        </div>
      )}
    </div>
  );
}
