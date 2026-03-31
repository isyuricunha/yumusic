import { useParams, useNavigate } from 'react-router';
import { useArtist, useArtistInfo, useTopSongs, useCoverArtUrl, useSearchSongs, fetchSubsonic } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, MoreHorizontal, Check, UserPlus } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from '@/store/playerStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useImageColor } from '@/hooks/useImageColor';
import { useStarMutation, useFavorites } from '@/hooks/useSubsonic';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function ArtistDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artist, isLoading } = useArtist(id);
  const { data: artistInfo } = useArtistInfo(id);
  const { data: topSongs, isSuccess: topSongsSucceeded } = useTopSongs(artist?.name);
  const { data: searchSongs } = useSearchSongs(
    (!topSongs || topSongs.length === 0) && topSongsSucceeded ? artist?.name : undefined, 
    10
  );
  
  const displaySongs = (topSongs && topSongs.length > 0) ? topSongs : (searchSongs || []);
  
  const displayAlbums = useMemo(() => {
    if (!artist) return [];
    
    // Start with albums from getArtist (primary albums)
    const albumsMap = new Map<string, any>();
    (artist.album || []).forEach(album => albumsMap.set(album.id, album));
    
    // Add albums found in the songs list (features, guest appearances, etc.)
    displaySongs.forEach(song => {
      if (!albumsMap.has(song.albumId)) {
        albumsMap.set(song.albumId, {
          id: song.albumId,
          name: song.album,
          coverArt: song.coverArt || song.albumId,
          year: song.year || ''
        });
      }
    });

    return Array.from(albumsMap.values());
  }, [artist, displaySongs]);

  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong, isPlaying } = usePlayerStore();
  const [showFullBio, setShowFullBio] = useState(false);
  const [showFullTracks, setShowFullTracks] = useState(false);

  const artistImageUrl = artist ? getCoverUrl(artist.coverArt) : undefined;
  const dominantColor = useImageColor(artistImageUrl, 'rgba(29, 185, 84, 0.5)');
  
  const { data: favorites } = useFavorites();
  const starMutation = useStarMutation();
  const isStarred = favorites?.artist?.some((a: any) => a.id === id);

  const handleToggleStar = () => {
    if (id) {
      starMutation.mutate({ id, type: 'artist', star: !isStarred });
    }
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">{t('common.loading')}...</div>;
  if (!artist) return <div className="p-8 text-muted-foreground">{t('common.not_found')}</div>;

  const handlePlayArtist = async () => {
    if (!config) return;
    
    if (displaySongs.length > 0) {
      setQueue(displaySongs);
      setSong(displaySongs[0], config);
      return;
    }

    await handlePlayFirstAlbum();
  };

  const handlePlayFirstAlbum = async () => {
    if (!artist?.album || artist.album.length === 0 || !config) return;
    const firstAlbumId = artist.album[0].id;
    try {
      const res = await fetchSubsonic('getAlbum', config, { id: firstAlbumId });
      const songs = res?.album?.song;
      if (songs && songs.length > 0) {
        setQueue(songs);
        setSong(songs[0], config);
      }
    } catch (e) {
      console.error('Play first album failed', e);
    }
  };

  return (
    <div className="w-full -mx-6 pb-24 relative">
      {/* 1. Spotify Hero Banner */}
      <div className="relative h-[40vh] min-h-[340px] md:h-[50vh] flex items-end px-8 pb-8 overflow-hidden group">
        {/* Background Image with Blur & Mask */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ 
            backgroundImage: `url(${artistImageUrl})`,
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        />
        <div 
            className="absolute inset-0 z-1" 
            style={{ 
                background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 50%, ${dominantColor.replace(')', ', 0.8)')} 100%)` 
            }} 
        />
        
        <div className="relative z-10 flex flex-col space-y-4 max-w-full">
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-blue-500 rounded-full p-1 shadow-lg">
                <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white drop-shadow-md">
                {t('common.artist')} {t('common.verified')}
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {artist.name}
          </h1>
        </div>
      </div>

      {/* 2. Action Bar Section */}
      <div 
        className="sticky top-16 z-30 px-8 py-6 flex items-center gap-6 transition-all duration-300"
        style={{ background: `linear-gradient(to bottom, ${dominantColor.replace(')', ', 0.3)')} 0%, transparent 100%)` }}
      >
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full bg-primary shadow-xl hover:scale-105 active:scale-95 transition-all text-black"
          onClick={handlePlayArtist}
        >
          {isPlaying && (displaySongs.some(s => s.id === currentSong?.id)) ? (
             <div className="flex items-center justify-center gap-1">
                <div className="w-1 h-4 bg-black animate-pulse" />
                <div className="w-1 h-4 bg-black animate-pulse delay-75" />
             </div>
          ) : (
             <Play className="h-7 w-7 fill-current ml-1" />
          )}
        </Button>

        <Button 
            variant="outline" 
            className={cn(
                "rounded-full px-6 font-black uppercase tracking-widest text-xs h-9 border-white/20 hover:border-white transition-all",
                isStarred && "bg-white text-black border-white"
            )}
            onClick={handleToggleStar}
        >
            {isStarred ? (
                <> <Check className="h-4 w-4 mr-2" /> {t('artist.following')} </>
            ) : (
                <> <UserPlus className="h-4 w-4 mr-2" /> {t('artist.follow')} </>
            )}
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger 
                render={
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white">
                        <MoreHorizontal className="h-6 w-6" />
                    </Button>
                }
            />
            <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white w-48">
                <DropdownMenuItem className="hover:bg-white/10 transition-colors cursor-pointer font-bold">
                    {t('common.report_issue')}
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 transition-colors cursor-pointer font-bold">
                    {t('common.go_to_artist')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 3. Content Body */}
      <div className="px-8 space-y-12 mt-4 relative z-10">
        
        {/* Popular Songs Section */}
        {displaySongs && displaySongs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight text-white mb-4">
              {t('common.popular')}
            </h2>
            <div className="flex flex-col max-w-5xl">
              {displaySongs.slice(0, showFullTracks ? 10 : 5).map((song, index) => (
                <div 
                  key={song.id} 
                  className={cn(
                    "grid grid-cols-[40px_1fr_auto] gap-4 px-4 py-2 rounded-lg hover:bg-white/10 cursor-pointer group transition-all items-center",
                    currentSong?.id === song.id && "bg-white/5"
                  )}
                  onClick={() => {
                    if (config) {
                      setQueue(displaySongs);
                      setSong(song, config);
                    }
                  }}
                >
                  <div className="flex justify-center items-center">
                    {currentSong?.id === song.id && isPlaying ? (
                       <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground group-hover:hidden tabular-nums">{index + 1}</span>
                    )}
                    <Play className={cn(
                      "h-3 w-3 fill-current hidden",
                      currentSong?.id !== song.id && "group-hover:block text-white"
                    )} />
                  </div>
                  
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-10 h-10 bg-muted rounded shadow-md overflow-hidden flex-shrink-0">
                      <img 
                        src={getCoverUrl(song.coverArt || song.albumId)} 
                        alt={song.title} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={cn(
                        "text-sm font-bold truncate transition-colors",
                        currentSong?.id === song.id ? "text-primary" : "text-white"
                      )}>{song.title}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                     <span className="text-xs text-muted-foreground tabular-nums font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                        {formatDuration(song.duration)}
                     </span>
                  </div>
                </div>
              ))}
            </div>
            {displaySongs.length > 5 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-white font-black uppercase tracking-widest text-[10px] pl-4"
                onClick={() => setShowFullTracks(!showFullTracks)}
              >
                {showFullTracks ? t('common.show_less') : t('common.show_more')}
              </Button>
            )}
          </section>
        )}

        {/* Discography Section */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight text-white">{t('common.albums')}</h2>
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors cursor-pointer">
                {t('artist.full_discography')}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {displayAlbums.slice(0, 14).map((album) => (
              <div 
                key={album.id} 
                className="group cursor-pointer flex flex-col space-y-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 shadow-lg border border-white/5"
                onClick={() => navigate(`/album/${album.id}`)}
              >
                <div className="overflow-hidden rounded-lg shadow-2xl bg-muted aspect-square relative transition-all duration-500 group-hover:scale-105">
                  <img
                    src={getCoverUrl(album.coverArt || album.id)}
                    alt={album.name}
                    className="object-cover w-full h-full transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Play className="h-5 w-5 text-black fill-current" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col px-1">
                  <span className="font-bold text-sm truncate text-white" title={album.name}>{album.name}</span>
                  <span className="text-[11px] text-muted-foreground truncate uppercase font-black tracking-widest pt-1">
                    {album.year || t('common.album')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Card Section (Spotify style) */}
        {artistInfo?.biography && (
          <section className="pt-12 max-w-4xl">
            <h2 className="text-2xl font-black tracking-tight text-white mb-6">
                {t('artist.about')}
            </h2>
            <div 
                className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/5"
                onClick={() => setShowFullBio(!showFullBio)}
            >
                {/* Background Image of the About Card */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${artistImageUrl})` }}
                />
                <div className="absolute inset-0 z-1 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 z-2 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10 z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                {t('artist.similar_artists')}
                            </span>
                        </div>
                    </div>
                    <div 
                        className={cn(
                            "text-base leading-relaxed text-white/90 font-medium line-clamp-3 transition-opacity",
                            showFullBio && "line-clamp-none opacity-0"
                        )}
                        dangerouslySetInnerHTML={{ __html: artistInfo.biography.slice(0, 300) + '...' }}
                    />
                    <div className="pt-2">
                        <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:underline">
                            {t('common.show_more')}
                        </span>
                    </div>
                </div>

                {/* Expanded View Modal (Fake) or just using the Card */}
                {showFullBio && (
                    <div 
                        className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-10 overflow-y-auto animate-in fade-in duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFullBio(false);
                        }}
                    >
                         <h3 className="text-3xl font-black tracking-tight text-white mb-8">{artist.name}</h3>
                         <div 
                            className="text-lg leading-relaxed text-white prose prose-invert prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: artistInfo.biography }}
                         />
                         <Button className="mt-8 rounded-full font-bold px-8" onClick={() => setShowFullBio(false)}>
                            {t('common.close')}
                         </Button>
                    </div>
                )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
