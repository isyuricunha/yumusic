import { useState } from 'react';
import { useSearch, useCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Play } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AddToPlaylistDropdown } from '@/components/player/AddToPlaylistDropdown';

export default function Search() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useSearch(query);
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();

  const handlePlaySong = (song: SubsonicSong, allSongs: SubsonicSong[]) => {
    if (config) {
      setQueue(allSongs);
      setSong(song, config);
    }
  };

  return (
    <div className="w-full space-y-6 pb-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.search')}</h1>
        <div className="relative max-w-md w-full">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className="pl-10 h-11 bg-muted/50 border-transparent rounded-[var(--radius-lg)] focus-visible:ring-1 focus-visible:ring-primary"
            placeholder={t('search.placeholder')} 
          />
        </div>
      </div>

      <div className="mt-8">
        {query.length > 1 && isLoading && (
          <div className="text-muted-foreground animate-pulse">{t('search.searching')}</div>
        )}

        {results && query.length > 1 && (
          <div className="space-y-8">
            
            {/* Artists */}
            {results.artist && results.artist.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">{t('search.artists')}</h2>
                <div className="flex flex-wrap gap-4">
                  {results.artist.slice(0, 5).map((artist: any) => (
                    <div key={artist.id} className="cursor-pointer bg-muted/40 p-3 flex items-center space-x-4 rounded-full hover:bg-muted/80 pr-6 transition">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                        <img src={getCoverUrl(artist.coverArt || '')} alt={artist.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <span className="font-medium text-sm">{artist.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {results.album && results.album.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">{t('search.albums')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.album.slice(0, 5).map((album: any) => (
                    <div key={album.id} className="group cursor-pointer flex flex-col space-y-3">
                      <div className="overflow-hidden rounded-md shadow-md bg-muted aspect-square relative transition-transform duration-300 group-hover:scale-[1.02]">
                        <img
                          src={getCoverUrl(album.coverArt || album.id)}
                          alt={album.name}
                          className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-75"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm truncate" title={album.name}>{album.name}</span>
                        <span className="text-xs text-muted-foreground truncate" title={album.artist}>{album.artist}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Songs */}
            {results.song && results.song.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">{t('search.songs')}</h2>
                <div className="flex flex-col space-y-2">
                  {results.song.slice(0, 10).map((song: SubsonicSong, _: number, all: SubsonicSong[]) => (
                    <div 
                      key={song.id} 
                      className={cn(
                        "flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer group transition relative",
                        currentSong?.id === song.id && "bg-muted/40"
                      )}
                      onClick={() => handlePlaySong(song, all)}
                    >
                      <div className="w-10 h-10 bg-muted rounded shrink-0 mr-4 relative">
                        <img 
                          src={getCoverUrl(song.coverArt || song.albumId)} 
                          alt={song.title} 
                          className="w-full h-full object-cover rounded" 
                          loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-4 w-4 fill-white text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        <span className={cn(
                          "text-sm font-medium truncate",
                          currentSong?.id === song.id ? "text-primary" : "text-foreground"
                        )}>{song.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{song.artist} - {song.album}</span>
                      </div>
                      <AddToPlaylistDropdown songId={song.id} />
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {results.artist?.length === 0 && results.album?.length === 0 && results.song?.length === 0 && (
              <p className="text-muted-foreground">{t('search.no_results')} "{query}"</p>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
