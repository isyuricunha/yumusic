import { useParams, useNavigate } from 'react-router';
import { useArtist, useCoverArtUrl } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from '@/store/playerStore';

export default function ArtistDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artist, isLoading } = useArtist(id);
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue } = usePlayerStore();

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">{t('common.loading')}...</div>;
  if (!artist) return <div className="p-8 text-muted-foreground">{t('common.not_found')}</div>;

  const handlePlayArtist = async () => {
    if (!config || !artist.album || artist.album.length === 0) return;
    
    // Quick play first album's first song as a placeholder for "Play Artist"
    const firstAlbumId = artist.album[0].id;
    const res = await fetch(`${config.serverUrl}/rest/getAlbum?u=${config.username}&t=${config.token}&s=${config.salt}&v=1.16.1&c=Yumusic&id=${firstAlbumId}&f=json`);
    const data = await res.json();
    const songs = data['subsonic-response']?.album?.song;
    if (songs && songs.length > 0) {
      setQueue(songs);
      setSong(songs[0], config);
    }
  };

  return (
    <div className="w-full space-y-8 pb-12">
      <Button 
        variant="ghost" 
        size="sm" 
        className="-ml-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-2xl overflow-hidden bg-muted flex-shrink-0">
          <img 
            src={getCoverUrl(artist.coverArt)} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">{t('common.artist')}</span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter">{artist.name}</h1>
          <div className="flex items-center space-x-4 pt-2">
            <Button 
              size="lg" 
              className="rounded-full px-8 font-bold h-14"
              onClick={handlePlayArtist}
              disabled={!artist.album || artist.album.length === 0}
            >
              <Play className="h-6 w-6 mr-2 fill-current" />
              {t('common.play')}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{t('common.albums')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {artist.album?.map((album) => (
            <div 
              key={album.id} 
              className="group cursor-pointer flex flex-col space-y-3"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="overflow-hidden rounded-lg shadow-md bg-muted aspect-square relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <img
                  src={getCoverUrl(album.coverArt || album.id)}
                  alt={album.name}
                  className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-75"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm truncate" title={album.name}>{album.name}</span>
                <span className="text-xs text-muted-foreground truncate">{album.year || ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
