import { useAlbumList, useCoverArtUrl } from '@/hooks/useSubsonic';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: recentAlbums, isLoading: loadingRecent } = useAlbumList('newest', 10);
  const { data: frequentAlbums, isLoading: loadingFrequent } = useAlbumList('frequent', 10);
  const getCoverArt = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue } = usePlayerStore();

  const handleQuickPlay = async (albumId: string) => {
    if (!config) return;
    // We need to fetch the album details to get the songs
    const res = await fetch(`${config.serverUrl}/rest/getAlbum?u=${config.username}&t=${config.token}&s=${config.salt}&v=1.16.1&c=Yumusic&id=${albumId}&f=json`);
    const data = await res.json();
    const songs = data['subsonic-response']?.album?.song;
    if (songs && songs.length > 0) {
      setQueue(songs);
      setSong(songs[0], config);
    }
  };

  return (
    <div className="w-full space-y-10 pb-12">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.recently_added')}</h2>
          <button 
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate('/library')}
          >
            {t('common.see_all')}
          </button>
        </div>
        
        {loadingRecent ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recentAlbums?.map((album) => (
              <AlbumCard 
                key={album.id} 
                album={album} 
                getCoverArt={getCoverArt} 
                onClick={() => navigate(`/album/${album.id}`)}
                onPlay={() => handleQuickPlay(album.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.most_played')}</h2>
        </div>
        
        {loadingFrequent ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {frequentAlbums?.map((album) => (
              <AlbumCard 
                key={album.id} 
                album={album} 
                getCoverArt={getCoverArt} 
                onClick={() => navigate(`/album/${album.id}`)}
                onPlay={() => handleQuickPlay(album.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AlbumCard({ album, getCoverArt, onClick, onPlay }: any) {
  return (
    <div 
      className="group cursor-pointer flex flex-col space-y-3"
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-lg shadow-md bg-muted aspect-square relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <img
          src={getCoverArt(album.coverArt || album.id)}
          alt={album.name}
          className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-75"
          loading="lazy"
        />
        <button 
          className="absolute bottom-3 right-3 w-10 h-10 bg-primary rounded-full shadow-lg flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <Play className="h-5 w-5 fill-current text-primary-foreground ml-1" />
        </button>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-sm truncate" title={album.name}>{album.name}</span>
        <span className="text-xs text-muted-foreground truncate" title={album.artist}>{album.artist}</span>
      </div>
    </div>
  );
}
