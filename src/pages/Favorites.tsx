import { useFavorites, useCoverArtUrl, SubsonicSong } from '@/hooks/useSubsonic';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { Play, Check, Loader2, ArrowDownToLine } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AddToPlaylistDropdown } from '@/components/player/AddToPlaylistDropdown';
import { downloadSong } from '@/services/downloadService';
import { useDownloadStore } from '@/store/downloadStore';
import { Button } from '@/components/ui/button';

export default function Favorites() {
  const { t } = useTranslation();
  const { data: favorites, isLoading } = useFavorites();
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();
  const navigate = useNavigate();
  const { downloadedIds, downloadingIds } = useDownloadStore();

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
          <div className="text-muted-foreground animate-pulse">{t('common.loading')}...</div>
        ) : (
          <div className="space-y-8">
            {/* Starred Songs */}
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('search.songs')}</h2>
              {!favorites?.song || favorites.song.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('favorites.no_songs')}</p>
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
                          "text-sm font-medium truncate flex items-center gap-2",
                          currentSong?.id === song.id ? "text-primary" : "text-foreground"
                        )}>
                          {song.title}
                          {downloadedIds[song.id] && !downloadingIds.has(song.id) && (
                            <div className="bg-[var(--success)] rounded-full p-[2px] shrink-0">
                              <Check className="h-2.5 w-2.5 text-white stroke-[4px]" />
                            </div>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{song.artist} - {song.album}</span>
                      </div>

                      {downloadingIds.has(song.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : !downloadedIds[song.id] && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSong(song);
                          }}
                        >
                          <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                      )}

                      <AddToPlaylistDropdown songId={song.id} />
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Starred Albums */}
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('search.albums')}</h2>
              {!favorites?.album || favorites.album.length === 0 ? (
                 <p className="text-sm text-muted-foreground">{t('favorites.no_albums')}</p>
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
