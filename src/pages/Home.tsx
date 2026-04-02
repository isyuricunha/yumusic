import { 
  useAlbumList, 
  useArtists, 
  useCoverArtUrl, 
  fetchSubsonic, 
  SubsonicArtist, 
  useRandomSongs, 
  useFavorites 
} from '@/hooks/useSubsonic';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Play, User } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { AlbumCard } from '@/components/AlbumCard';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: recentAlbums, isLoading: loadingRecent } = useAlbumList('newest', 10);
  const { data: frequentAlbums, isLoading: loadingFrequent } = useAlbumList('frequent', 10);
  const { data: allArtists, isLoading: loadingArtists } = useArtists();
  const { data: randomSongs } = useRandomSongs(180);
  const { data: favorites } = useFavorites();
  const getCoverArt = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue } = usePlayerStore();

  // Get a few random artists for the home page
  const featuredArtists = useMemo(() => {
    if (!allArtists || allArtists.length === 0) return [];
    return [...allArtists].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [allArtists]);

  // Mixed Favorites for Jump Back In (Artists + Albums)
  const jumpBackIn = useMemo(() => {
    const artistFavs = (favorites?.artist || []).map((a: SubsonicArtist) => ({ ...a, type: 'artist' as const }));
    const albumFavs = (favorites?.album || []).map((a: any) => ({ ...a, type: 'album' as const }));
    const mixedFavs = [...artistFavs, ...albumFavs];
    
    if (mixedFavs.length > 0) {
      return mixedFavs.sort(() => 0.5 - Math.random()).slice(0, 8);
    }
    
    // Fallback if no favorites: use recent albums
    return (recentAlbums || []).map(a => ({ ...a, type: 'album' as const })).slice(0, 8);
  }, [favorites, recentAlbums]);

  // Simulated Daily Mixes Artwork
  const dailyMixes = useMemo(() => {
    const gradients = [
      'from-emerald-500 to-emerald-900',
      'from-blue-500 to-blue-900',
      'from-rose-500 to-rose-900',
      'from-amber-500 to-amber-900',
      'from-purple-500 to-purple-900',
      'from-cyan-500 to-cyan-900'
    ];
    
    const objectPositions = [
      '0% 0%',   // Top Left
      '50% 0%',  // Top Center
      '100% 0%', // Top Right
      '0% 100%',  // Bottom Left
      '50% 100%', // Bottom Center
      '100% 100%' // Bottom Right
    ];
    
    return [1, 2, 3, 4, 5, 6].map((num, i) => {
      // Give each mix its own pool of ~30 songs from the 180 fetched
      const start = i * 30;
      const end = start + 30;
      const mixSongs = randomSongs?.slice(start, end) || [];
      
      return {
        id: `mix-${num}`,
        name: `Daily Mix ${num}`,
        gradient: gradients[i % gradients.length],
        position: objectPositions[i],
        description: t('home.made_for_you_desc'),
        songs: mixSongs
      };
    });
  }, [t, randomSongs]);

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
              className="flex items-center bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-md overflow-hidden cursor-pointer group relative shadow-md h-12 md:h-16"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 shadow-lg">
                <img 
                  src={getCoverArt(album.coverArt || album.id)} 
                  alt={album.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 px-3 overflow-hidden pr-10">
                <p className="font-bold text-[11px] md:text-xs lg:text-sm line-clamp-2 leading-tight tracking-tight">{album.name}</p>
              </div>
              <button 
                className="absolute right-2 w-8 h-8 bg-primary rounded-full shadow-2xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickPlay(album.id);
                }}
              >
                <Play className="h-4 w-4 fill-current text-primary-foreground ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Made For (Spotify Style) */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="flex items-end justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-muted-foreground leading-none">{t('home.made_for')}</span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-1">{config?.username || 'You'}</h2>
          </div>
          <button className="text-xs font-bold text-muted-foreground hover:text-white transition-colors mb-1">{t('common.show_all')}</button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth -mx-2 px-2">
          {dailyMixes.map((mix) => (
            <div 
              key={mix.id}
              className="group flex flex-col space-y-3 cursor-pointer shrink-0 w-40 md:w-48"
              onClick={() => {
                if (mix.songs.length > 0 && config) {
                  setQueue(mix.songs);
                  setSong(mix.songs[Math.floor(Math.random() * mix.songs.length)], config);
                }
              }}
            >
              <div className={cn(
                "aspect-square rounded-md shadow-2xl relative overflow-hidden bg-muted transition-all duration-500 group-hover:translate-y-[-4px]"
              )}>
                <img 
                  src="/spotify_mix_covers_1775080663126.png" 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                  style={{ objectPosition: mix.position }}
                />
                
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="w-8 h-1 bg-primary rounded-full mb-2" />
                    <h3 className="text-xl font-black text-white leading-none uppercase tracking-tighter">Mix {mix.id.split('-')[1]}</h3>
                </div>

                <div className="absolute bottom-3 right-3 w-10 h-10 bg-primary rounded-full shadow-2xl flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Play className="h-5 w-5 fill-current text-primary-foreground ml-0.5" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white line-clamp-1 truncate uppercase tracking-tighter">{mix.name}</span>
                <span className="text-xs text-muted-foreground line-clamp-2 leading-snug">{t('home.made_for_you_desc')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Jump Back In (Mixed Content) */}
      {jumpBackIn.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">{t('home.jump_back_in')}</h2>
            <button className="text-xs font-bold text-muted-foreground hover:text-white transition-colors">{t('common.show_all')}</button>
          </div>
          <div className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth -mx-2 px-2">
            {jumpBackIn.map((item: any) => (
              <div 
                key={item.id}
                className="group flex flex-col space-y-3 cursor-pointer shrink-0 w-32 md:w-40"
                onClick={() => navigate(item.type === 'artist' ? `/artist/${item.id}` : `/album/${item.id}`)}
              >
                <div className={cn(
                  "aspect-square shadow-2xl relative transition-all duration-500 group-hover:translate-y-[-4px]",
                  item.type === 'artist' ? "rounded-full" : "rounded-lg"
                )}>
                  <img 
                    src={getCoverArt(item.coverArt || item.id)} 
                    alt={item.name} 
                    className={cn(
                        "w-full h-full object-cover shadow-2xl",
                        item.type === 'artist' ? "rounded-full" : "rounded-lg"
                    )}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className={cn(
                         "w-12 h-12 bg-primary rounded-full shadow-2xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300",
                         item.type === 'artist' ? "mr-0" : ""
                     )}>
                        <Play className="h-6 w-6 fill-current text-primary-foreground ml-1" />
                     </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white line-clamp-1 truncate">{item.name}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                    {item.type === 'artist' ? t('common.artist') : t('common.album')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">{t('home.featured_artists')}</h2>
          <button 
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors hover:underline underline-offset-4"
            onClick={() => navigate('/library')}
          >
            {t('common.show_all')}
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
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">{t('home.recently_added')}</h2>
          <button 
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
            onClick={() => navigate('/library?tab=recent')}
          >
            {t('common.show_all')}
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
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">{t('home.most_played')}</h2>
          <button 
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
            onClick={() => navigate('/library?tab=frequent')}
          >
            {t('common.show_all')}
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

