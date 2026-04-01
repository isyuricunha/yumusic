import { useParams, useNavigate } from 'react-router';
import { useArtist, useTopSongs, useCoverArtUrl, useSearchSongs } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { DiscographyAlbumRow } from '@/components/artist/DiscographyAlbumRow';
import { cn } from '@/lib/utils';

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
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">{t('common.loading')}...</div>;
  if (!artist) return <div className="p-8 text-muted-foreground">{t('common.not_found')}</div>;

  return (
    <div className="w-full space-y-8 pb-32 max-w-7xl mx-auto">
      {/* Header Sticky Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sticky top-0 z-50 bg-background/80 backdrop-blur-xl py-6 border-b border-white/5 -mx-6 px-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/40 hover:bg-black/60 shadow-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('common.artist')}</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              {artist.name} <span className="text-muted-foreground/40 font-normal ml-2">/</span> <span className="text-muted-foreground font-medium text-2xl md:text-3xl ml-2">{t('artist.full_discography')}</span>
            </h1>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/5 shadow-2xl">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
                "rounded-full h-8 px-4 font-bold text-xs gap-2 transition-all",
                viewType === 'list' ? "bg-white text-black hover:bg-white" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4" />
            {t('common.list')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
                "rounded-full h-8 px-4 font-bold text-xs gap-2 transition-all",
                viewType === 'grid' ? "bg-white text-black hover:bg-white" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => setViewType('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
            {t('common.grid')}
          </Button>
        </div>
      </div>

      {/* Main Content Sections */}
      {viewType === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-4">
          {displayAlbums.map((album) => (
            <div 
              key={album.id} 
              className="group cursor-pointer flex flex-col space-y-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 shadow-xl border border-white/5 active:scale-95"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="overflow-hidden rounded-lg shadow-2xl bg-muted aspect-square relative transition-all duration-500 group-hover:shadow-primary/20">
                <img
                  src={getCoverUrl(album.coverArt || album.id)}
                  alt={album.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Play className="h-5 w-5 text-black fill-current ml-1" />
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
      ) : (
        <div className="flex flex-col max-w-6xl pb-20">
            {displayAlbums.map((album, index) => (
                <DiscographyAlbumRow key={album.id} album={album} index={index} />
            ))}
        </div>
      )}
    </div>
  );
}
