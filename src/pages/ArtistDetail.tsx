import { useParams, useNavigate } from 'react-router';
import { useArtist, useArtistInfo, useTopSongs, useCoverArtUrl } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from '@/store/playerStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ArtistDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artist, isLoading } = useArtist(id);
  const { data: artistInfo } = useArtistInfo(id);
  const { data: topSongs } = useTopSongs(artist?.name);
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();
  const [showFullBio, setShowFullBio] = useState(false);
  const [showFullTracks, setShowFullTracks] = useState(false);

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

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
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full shadow-2xl overflow-hidden bg-muted flex-shrink-0">
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

      {artistInfo?.biography && (
        <section className="bg-muted/30 rounded-xl p-6 border border-border/50 max-w-4xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Biography</h2>
          <div className="relative">
            <div 
              className={`text-sm leading-relaxed text-muted-foreground prose prose-invert max-w-none transition-all duration-500 overflow-hidden ${showFullBio ? 'max-h-[2000px]' : 'max-h-24'}`}
              dangerouslySetInnerHTML={{ __html: artistInfo.biography }}
            />
            {!showFullBio && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 text-primary hover:text-primary/80 p-0 h-auto font-semibold flex items-center"
            onClick={() => setShowFullBio(!showFullBio)}
          >
            {showFullBio ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Read More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </section>
      )}

      {topSongs && topSongs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-primary">{t('common.popular')}</h2>
            <button 
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
              onClick={() => navigate(`/artist/${id}/songs`)}
            >
              {t('common.see_all')}
            </button>
          </div>
          <div className="flex flex-col">
            {topSongs.slice(0, showFullTracks ? 10 : 5).map((song, index) => (
              <div 
                key={song.id} 
                className={cn(
                  "grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 rounded-md hover:bg-muted/50 cursor-pointer group transition items-center",
                  currentSong?.id === song.id && "bg-muted/40"
                )}
                onClick={() => {
                  if (config) {
                    setQueue(topSongs);
                    setSong(song, config);
                  }
                }}
              >
                <div className="flex w-6 justify-center items-center">
                  {currentSong?.id === song.id ? (
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                  ) : (
                    <span className="text-xs text-muted-foreground group-hover:hidden">{index + 1}</span>
                  )}
                  <Play className={cn(
                    "h-3 w-3 fill-current hidden",
                    currentSong?.id !== song.id && "group-hover:block"
                  )} />
                </div>
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={getCoverUrl(song.coverArt || song.albumId)} 
                      alt={song.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className={cn(
                      "text-sm font-medium truncate",
                      currentSong?.id === song.id ? "text-primary" : "text-foreground"
                    )}>{song.title}</span>
                    <span className="text-xs text-muted-foreground truncate">{song.album}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatDuration(song.duration)}
                </span>
              </div>
            ))}
          </div>
          {topSongs.length > 5 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground font-bold"
              onClick={() => setShowFullTracks(!showFullTracks)}
            >
              {showFullTracks ? t('common.show_less') : t('common.show_more')}
            </Button>
          )}
        </section>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{t('common.albums')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
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
