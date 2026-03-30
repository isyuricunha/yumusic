import { useFavorites, useGetCoverArtUrl } from '@/hooks/useSubsonic';

export default function Favorites() {
  const { data: favorites, isLoading } = useFavorites();
  const getCoverUrl = useGetCoverArtUrl;

  return (
    <div className="w-full space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Favorites</h1>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="text-muted-foreground animate-pulse">Loading favorites...</div>
        ) : (
          <div className="space-y-8">
            {/* Starred Songs */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Starred Songs</h2>
              {!favorites?.song || favorites.song.length === 0 ? (
                <p className="text-sm text-muted-foreground">No starred songs.</p>
              ) : (
                <div className="flex flex-col space-y-2">
                  {favorites.song.map((song: any) => (
                    <div key={song.id} className="flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer group">
                      <div className="w-10 h-10 bg-muted rounded shrink-0 mr-4">
                        <img 
                          src={getCoverUrl(song.coverArt || song.albumId)} 
                          alt={song.title} 
                          className="w-full h-full object-cover rounded" 
                          loading="lazy" 
                        />
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        <span className="text-sm font-medium truncate">{song.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{song.artist} - {song.album}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Starred Albums */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Starred Albums</h2>
              {!favorites?.album || favorites.album.length === 0 ? (
                 <p className="text-sm text-muted-foreground">No starred albums.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {favorites.album.map((album: any) => (
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
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
