import { useFavorites, useGetCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Favorites() {
  const { t } = useTranslation();
  const { data: favorites, isLoading } = useFavorites();
  const getCoverUrl = useGetCoverArtUrl;
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();
  const navigate = useNavigate();

  const handlePlaySong = (song: SubsonicSong, allSongs: SubsonicSong[]) => {
    if (config) {
      setQueue(allSongs);
      setSong(song, config);
    }
  };

  return (
    <div className="w-full space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.favorites')}</h1>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Starred Songs */}
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('search.songs')}</h2>
              {!favorites?.song || favorites.song.length === 0 ? (
                <p className="text-sm text-muted-foreground">No starred songs.</p>
              ) : (
                <div className="flex flex-col space-y-2">
                  {favorites.song.map((song: SubsonicSong, _: number, all: SubsonicSong[]) => (
                    <div 
                      key={song.id} 
                      className={cn(
                        "flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer group transition",
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
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Starred Albums */}
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('search.albums')}</h2>
              {!favorites?.album || favorites.album.length === 0 ? (
                 <p className="text-sm text-muted-foreground">No starred albums.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {favorites.album.map((album: any) => (
                    <div 
                      key={album.id} 
                      className="group cursor-pointer flex flex-col space-y-3"
                      onClick={() => navigate(`/album/${album.id}`)}
                    >
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
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
