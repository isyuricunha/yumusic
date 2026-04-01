import { useParams, useNavigate } from 'react-router';
import { useArtist, useTopSongs, useCoverArtUrl, useSearchSongs } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export default function ArtistDiscography() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artist, isLoading } = useArtist(id);
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

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">{t('common.loading')}...</div>;
  if (!artist) return <div className="p-8 text-muted-foreground">{t('common.not_found')}</div>;

  return (
    <div className="w-full space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('common.artist')}</span>
          <h1 className="text-3xl font-black">{artist.name} — {t('artist.full_discography')}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {displayAlbums.map((album) => (
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
  );
}
