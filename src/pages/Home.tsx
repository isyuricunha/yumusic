import { useAlbumList, useArtists, useCoverArtUrl, fetchSubsonic, SubsonicArtist } from '@/hooks/useSubsonic';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
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
  const featuredArtists = useMemo(() => {
    if (!allArtists || allArtists.length === 0) return [];
    return [...allArtists].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [allArtists]);

  const handleQuickPlay = async (albumId: string) => {
    if (!config) return;
    try {
      const res = await fetchSubsonic('getAlbum', config, { id: albumId });
      const songs = res?.album?.song;
      if (songs && songs.length > 0) {
        setQueue(songs);
        setSong(songs[0], config);
      }
    } catch (e) {
      console.error('Quick play failed', e);
    }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.good_morning');
    if (hour < 18) return t('home.good_afternoon');
    return t('home.good_evening');
  }, [t]);

  return (
    <div className="w-full space-y-8 pb-12 pt-4">
      
      {/* Greeting & Quick Play Grid */}
      <section>
        <h1 className="text-3xl font-black tracking-tight mb-6">{greeting}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentAlbums?.slice(0, 6).map((album) => (
            <div 
              key={album.id}
              className="flex items-center bg-white/5 hover:bg-white/10 transition-colors rounded-md overflow-hidden cursor-pointer group relative shadow-md"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 flex-shrink-0 shadow-lg">
                <img 
                  src={getCoverArt(album.coverArt || album.id)} 
                  alt={album.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 px-4 py-2 overflow-hidden">
                <span className="font-bold text-sm sm:text-base line-clamp-2 leading-tight">{album.name}</span>
              </div>
              <button 
                className="absolute right-4 w-12 h-12 bg-primary rounded-full shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickPlay(album.id);
                }}
              >
                <Play className="h-6 w-6 fill-current text-primary-foreground ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

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
            {featuredArtists.map((artist: SubsonicArtist) => (
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3 sm:gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3 sm:gap-4">
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

      {!loadingFrequent && frequentAlbums && frequentAlbums.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.most_played')}</h2>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3 sm:gap-4">
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
        </section>
      )}

      {loadingFrequent && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.most_played')}</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AlbumCard({ album, getCoverArt, navigate, onPlay }: any) {
  return (
    <div className="group flex flex-col p-3 rounded-xl bg-white/0 hover:bg-white/5 transition-all duration-300">
      <div 
        className="overflow-hidden rounded-lg shadow-lg bg-muted aspect-square relative cursor-pointer"
        onClick={() => navigate(`/album/${album.id}`)}
      >
        <img
          src={getCoverArt(album.coverArt || album.id)}
          alt={album.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <button 
          className="absolute bottom-3 right-3 w-12 h-12 bg-primary rounded-full shadow-2xl flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 active:scale-95 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <Play className="h-6 w-6 fill-current text-primary-foreground ml-1" />
        </button>
      </div>
      <div className="flex flex-col mt-4 min-w-0">
        <span 
          className="font-bold text-sm truncate hover:underline cursor-pointer leading-tight text-foreground transition-colors group-hover:text-primary" 
          title={album.name}
          onClick={() => navigate(`/album/${album.id}`)}
        >
          {album.name}
        </span>
        <span 
          className="text-xs text-muted-foreground truncate hover:underline cursor-pointer mt-1 leading-tight hover:text-foreground transition-colors" 
          title={album.artist}
          onClick={() => navigate(`/artist/${album.artistId || ''}`)}
        >
          {album.artist}
        </span>
      </div>
    </div>
  );
}
