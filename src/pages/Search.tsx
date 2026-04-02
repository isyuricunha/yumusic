import { useSearch, useCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { ArtistLinks } from '@/components/ArtistLinks';
import { Play, Music, Disc, User, Search as SearchIcon } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AddToPlaylistDropdown } from '@/components/player/AddToPlaylistDropdown';
import { useNavigate, useSearchParams } from 'react-router';

export default function Search() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: results, isLoading } = useSearch(query);
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();

  const handlePlaySong = (song: SubsonicSong) => {
    if (config && results?.song) {
      setQueue(results.song);
      setSong(song, config);
    }
  };

  return (
    <div className="w-full space-y-6 pb-20 pt-4">
      {/* Header Info */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-white">{t('common.search')}</h1>
        {query && (
          <p className="text-sm text-muted-foreground font-medium">
            {t('search.results_for', { query })}
          </p>
        )}
      </div>

      <div className="mt-8">
        {query.length > 1 && isLoading && (
          <div className="text-muted-foreground animate-pulse">{t('search.searching')}</div>
        )}

        {results && query.length > 1 && (
          <div className="space-y-12">
            
            {/* Artists Section */}
            {results.artist && results.artist.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>{t('search.artists')}</span>
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
                  {results.artist.map((artist: any) => (
                    <div 
                      key={artist.id} 
                      className="group flex flex-col items-center cursor-pointer space-y-3"
                      onClick={() => navigate(`/artist/${artist.id}`)}
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md transition-all duration-300 group-hover:scale-[1.05] bg-muted">
                        <img 
                          src={getCoverUrl(artist.coverArt || '')} 
                          alt={artist.name}
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      </div>
                      <span className="font-semibold text-xs text-center line-clamp-1 hover:underline">{artist.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Songs Section */}
            {results.song && results.song.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Music className="h-5 w-5 text-primary" />
                  <span>{t('search.songs')}</span>
                </h2>
                <div className="flex flex-col space-y-1">
                  {results.song.map((song: SubsonicSong) => (
                    <div 
                      key={song.id} 
                      className={cn(
                        "flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50 cursor-pointer group transition-colors",
                        currentSong?.id === song.id && "bg-muted/40"
                      )}
                      onClick={() => handlePlaySong(song)}
                    >
                      <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0 relative">
                        <img 
                          src={getCoverUrl(song.coverArt || song.albumId)} 
                          alt={song.title} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                        <div className={cn(
                          "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                          currentSong?.id === song.id && "opacity-100"
                        )}>
                          <Play className="h-4 w-4 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        <span className={cn(
                          "text-sm font-medium truncate",
                          currentSong?.id === song.id ? "text-primary" : "text-foreground"
                        )}>{song.title}</span>
                        <div className="text-xs text-muted-foreground truncate space-x-1">
                          <ArtistLinks 
                            artist={song.artist} 
                            artistId={song.artistId} 
                            artists={song.artists}
                            className="inline-flex"
                            linkClassName="hover:underline cursor-pointer"
                          />
                          <span>-</span>
                          <span 
                            className="hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/album/${song.albumId}`);
                            }}
                          >
                            {song.album}
                          </span>
                        </div>
                      </div>
                      <AddToPlaylistDropdown songId={song.id} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Albums Section */}
            {results.album && results.album.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Disc className="h-5 w-5 text-primary" />
                  <span>{t('search.albums')}</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
                  {results.album.map((album: any) => (
                    <div 
                      key={album.id} 
                      className="group cursor-pointer flex flex-col space-y-2"
                      onClick={() => navigate(`/album/${album.id}`)}
                    >
                      <div className="overflow-hidden rounded-lg shadow-md bg-muted aspect-square relative transition-all duration-300 group-hover:scale-[1.02]">
                        <img
                          src={getCoverUrl(album.coverArt || album.id)}
                          alt={album.name}
                          className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-75"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm truncate hover:underline">{album.name}</span>
                        <ArtistLinks 
                          artist={album.artist} 
                          artistId={album.artistId} 
                          artists={album.artists}
                          className="text-xs"
                          linkClassName="text-muted-foreground hover:underline"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {results && !results.song?.length && !results.album?.length && !results.artist?.length && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <SearchIcon className="h-12 w-12 mb-4 opacity-20" />
                <p>{t('search.no_results')} "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
