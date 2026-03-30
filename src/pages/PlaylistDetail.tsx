import { useParams, useNavigate } from 'react-router';
import { usePlaylist, useCoverArtUrl, SubsonicSong, usePlaylistMutations } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Clock, Trash2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function PlaylistDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: playlist, isLoading } = usePlaylist(id);
  const { deletePlaylist, removeTracksFromPlaylist } = usePlaylistMutations();
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (song: SubsonicSong) => {
    if (config && playlist?.entry) {
      setQueue(playlist.entry);
      setSong(song, config);
    }
  };

  const handlePlayPlaylist = () => {
    if (config && playlist?.entry && playlist.entry.length > 0) {
      setQueue(playlist.entry);
      setSong(playlist.entry[0], config);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    if (confirm(t('playlists.delete_confirm'))) {
      await deletePlaylist.mutateAsync(id);
      navigate('/');
    }
  };

  const handleRemoveTrack = async (index: number) => {
    if (!id) return;
    await removeTracksFromPlaylist.mutateAsync({ playlistId: id, indices: [index] });
  };

  if (isLoading) return <div className="animate-pulse text-muted-foreground p-8">{t('common.loading')}...</div>;
  if (!playlist) return <div className="p-8">{t('common.not_found')}</div>;

  return (
    <div className="flex flex-col space-y-8 pb-12">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      <div className="flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-48 h-48 md:w-64 md:h-64 shadow-2xl rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {playlist.coverArt ? (
            <img 
              src={getCoverUrl(playlist.coverArt)} 
              alt={playlist.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Play className="h-20 w-20 text-primary/40" />
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Playlist</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{playlist.name}</h1>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className="text-primary">{playlist.owner}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{playlist.songCount} {t('search.songs')}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{formatDuration(playlist.duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform" 
          onClick={handlePlayPlaylist}
          disabled={!playlist.entry || playlist.entry.length === 0}
        >
          <Play className="h-6 w-6 fill-current ml-1" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-destructive transition-colors"
          onClick={handleDeletePlaylist}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_2fr_1fr_1fr_auto_auto] gap-4 px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <span className="hidden md:inline w-8 text-center">#</span>
          <span>Title</span>
          <span className="hidden md:inline">Artist</span>
          <span className="hidden md:inline">Album</span>
          <Clock className="h-4 w-4" />
          <span className="w-8"></span>
        </div>

        <div className="flex flex-col">
          {playlist.entry?.map((song, index) => (
            <div 
              key={`${song.id}-${index}`} 
              className={cn(
                "grid grid-cols-[1fr_auto] md:grid-cols-[auto_2fr_1fr_1fr_auto_auto] gap-4 px-4 py-3 rounded-md hover:bg-muted/50 cursor-pointer group transition items-center",
                currentSong?.id === song.id && "bg-muted/40"
              )}
              onClick={() => handlePlaySong(song)}
            >
              <div className="hidden md:flex w-8 justify-center items-center">
                {currentSong?.id === song.id ? (
                   <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                ) : (
                  <span className="text-sm text-muted-foreground group-hover:hidden">{index + 1}</span>
                )}
                <Play className={cn(
                  "h-3 w-3 fill-current hidden",
                  currentSong?.id !== song.id && "group-hover:block"
                )} />
              </div>
              <div className="flex flex-col truncate">
                <span 
                  className={cn(
                    "text-sm font-medium truncate hover:underline",
                    currentSong?.id === song.id ? "text-primary" : "text-foreground"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/album/${song.albumId}`);
                  }}
                >
                  {song.title}
                </span>
                <span 
                  className="text-xs text-muted-foreground truncate md:hidden hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artist/${song.artistId}`);
                  }}
                >
                  {song.artist}
                </span>
              </div>
              <span 
                className="hidden md:block text-sm text-muted-foreground truncate hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/artist/${song.artistId}`);
                }}
              >
                {song.artist}
              </span>
              <span 
                className="hidden md:block text-sm text-muted-foreground truncate hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/album/${song.albumId}`);
                }}
              >
                {song.album}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums min-w-[40px]">
                {formatDuration(song.duration)}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:text-destructive transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTrack(index);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          {(!playlist.entry || playlist.entry.length === 0) && (
            <div className="py-12 text-center text-muted-foreground">
              {t('playlists.empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
