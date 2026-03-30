import { useAlbumList, useArtists, useCoverArtUrl } from '@/hooks/useSubsonic';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Play, User } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: recentAlbums, isLoading: loadingRecent } = useAlbumList('newest', 10);
  const { data: frequentAlbums, isLoading: loadingFrequent } = useAlbumList('frequent', 10);
  const { data: allArtists, isLoading: loadingArtists } = useArtists();
  const getCoverArt = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue } = usePlayerStore();

  // Get a few random artists for the home page
  const featuredArtists = allArtists ? [...allArtists].sort(() => 0.5 - Math.random()).slice(0, 6) : [];

  const handleQuickPlay = async (albumId: string) => {
    if (!config) return;
    const res = await fetch(`${config.serverUrl}/rest/getAlbum?u=${config.username}&t=${config.token}&s=${config.salt}&v=1.16.1&c=Yumusic&id=${albumId}&f=json`);
    const data = await res.json();
    const songs = data['subsonic-response']?.album?.song;
    if (songs && songs.length > 0) {
      setQueue(songs);
      setSong(songs[0], config);
    }
  };

  return (
    <div className="w-full space-y-12 pb-12">
      {/* Featured Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.featured_artists') || 'Featured Artists'}</h2>
          <button 
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate('/library')}
          >
            {t('common.see_all')}
          </button>
        </div>
        
        {loadingArtists ? (
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-muted animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredArtists.map((artist) => (
              <div 
                key={artist.id} 
                className="group flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl bg-muted relative">
                  {artist.coverArt ? (
                    <img 
                      src={getCoverArt(artist.coverArt)} 
                      alt={artist.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <span className="font-semibold text-xs sm:text-sm text-center line-clamp-1 max-w-[100px] sm:max-w-[130px]">
                  {artist.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.recently_added')}</h2>
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
                navigate={navigate}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
            {frequentAlbums?.map((album) => (
              <AlbumCard 
                key={album.id} 
                album={album} 
                getCoverArt={getCoverArt} 
                navigate={navigate}
                onPlay={() => handleQuickPlay(album.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AlbumCard({ album, getCoverArt, navigate, onPlay }: any) {
  return (
    <div className="group flex flex-col space-y-3">
      <div 
        className="overflow-hidden rounded-lg shadow-md bg-muted aspect-square relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 cursor-pointer"
        onClick={() => navigate(`/album/${album.id}`)}
      >
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
        <span 
          className="font-semibold text-sm truncate hover:underline cursor-pointer" 
          title={album.name}
          onClick={() => navigate(`/album/${album.id}`)}
        >
          {album.name}
        </span>
        <span 
          className="text-xs text-muted-foreground truncate hover:underline cursor-pointer" 
          title={album.artist}
          onClick={() => navigate(`/artist/${album.artistId || ''}`)}
        >
          {album.artist}
        </span>
      </div>
    </div>
  );
}
