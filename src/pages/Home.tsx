import { useAlbumList, useArtists, useCoverArtUrl, fetchSubsonic, SubsonicArtist } from '@/hooks/useSubsonic';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Play, User } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { AlbumCard } from '@/components/AlbumCard';
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
    <div className="w-full space-y-10 pb-12 pt-4">
      
      {/* Greeting & Quick Play Grid (4x2 Spotify-style) */}
      <section>
        <h1 className="text-3xl font-black tracking-tight mb-6">{greeting}, {config?.username}</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-3">
          {recentAlbums?.slice(0, 8).map((album) => (
            <div 
              key={album.id}
              className="flex items-center bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-md overflow-hidden cursor-pointer group relative shadow-md h-16 md:h-20"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 shadow-lg">
                <img 
                  src={getCoverArt(album.coverArt || album.id)} 
                  alt={album.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 px-4 overflow-hidden pr-12">
                <span className="font-bold text-xs md:text-sm lg:text-base line-clamp-2 leading-tight tracking-tight">{album.name}</span>
              </div>
              <button 
                className="absolute right-3 w-10 h-10 bg-primary rounded-full shadow-2xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickPlay(album.id);
                }}
              >
                <Play className="h-5 w-5 fill-current text-primary-foreground ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.featured_artists')}</h2>
          <button 
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors hover:underline underline-offset-4"
            onClick={() => navigate('/library')}
          >
            {t('common.see_all')}
          </button>
        </div>
        
        {loadingArtists ? (
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-muted animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {featuredArtists.map((artist: SubsonicArtist) => (
              <div 
                key={artist.id} 
                className="group flex flex-col items-center space-y-3 cursor-pointer flex-shrink-0 w-24 sm:w-32"
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl bg-muted relative">
                  {artist.coverArt ? (
                    <img 
                      src={getCoverArt(artist.coverArt)} 
                      alt={artist.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/30">
                      <User className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                </div>
                <span className="font-bold text-[11px] sm:text-xs text-center line-clamp-1 w-full px-1">
                  {artist.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recently Added */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.recently_added')}</h2>
          <button 
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors hover:underline underline-offset-4"
            onClick={() => navigate('/library?tab=recent')}
          >
            {t('common.see_all')}
          </button>
        </div>
        
        {loadingRecent ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {recentAlbums?.slice(0, 16).map((album) => (
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

      {/* Most Played */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">{t('home.most_played')}</h2>
          <button 
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors hover:underline underline-offset-4"
            onClick={() => navigate('/library?tab=frequent')}
          >
            {t('common.see_all')}
          </button>
        </div>
        
        {(loadingFrequent || !frequentAlbums) ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {frequentAlbums?.slice(0, 16).map((album) => (
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

