import { useParams, useNavigate } from 'react-router';
import { usePlaylist, useCoverArtUrl, SubsonicSong, usePlaylistMutations } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Play, Clock, Trash2, Check, Loader2, ArrowDownToLine } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useDownloadStore } from '@/store/downloadStore';
import { downloadSong } from '@/services/downloadService';
import { useDialogStore } from '@/store/dialogStore';
import { useImageColor } from '@/hooks/useImageColor';
import { ArtistLinks } from '@/components/ArtistLinks';

export default function PlaylistDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: playlist, isLoading } = usePlaylist(id);
  const { deletePlaylist, removeTracksFromPlaylist } = usePlaylistMutations();
  const getCoverUrl = useCoverArtUrl();
  const config = useConfigStore((state) => state.config);
  const { setSong, setQueue, currentSong } = usePlayerStore();
  const { downloadedIds, downloadingIds } = useDownloadStore();
  const { settings } = useAppSettingsStore();
  const openDialog = useDialogStore((state) => state.openDialog);

  const playlistCoverUrl = playlist?.coverArt ? getCoverUrl(playlist.coverArt) : undefined;
  const dominantColor = useImageColor(playlistCoverUrl, 'rgba(29, 185, 84, 0.5)');

  const isPlaylistDownloaded = useMemo(() => {
    if (!playlist?.entry) return false;
    return playlist.entry.every(s => !!downloadedIds[s.id]);
  }, [playlist?.entry, downloadedIds]);

  const isPlaylistDownloading = useMemo(() => {
    if (!playlist?.entry) return false;
    return playlist.entry.some(s => downloadingIds.has(s.id));
  }, [playlist?.entry, downloadingIds]);

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (song: SubsonicSong) => {
    if (config && playlist?.entry) {
      setQueue(playlist.entry);
      setSong(song, config);

      // Auto-download if enabled
      if (settings.downloadPlaylists) {
        const songsToDownload = playlist.entry.filter(s => !downloadedIds[s.id]);
        if (songsToDownload.length > 0) {
          songsToDownload.forEach(s => downloadSong(s));
        }
      }
    }
  };

  const handlePlayPlaylist = () => {
    if (config && playlist?.entry && playlist.entry.length > 0) {
      setQueue(playlist.entry);
      setSong(playlist.entry[0], config);

      // Auto-download if enabled
      if (settings.downloadPlaylists) {
        const songsToDownload = playlist.entry.filter(s => !downloadedIds[s.id]);
        if (songsToDownload.length > 0) {
          songsToDownload.forEach(s => downloadSong(s));
        }
      }
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    const confirmed = await openDialog({
      title: t('playlists.delete_confirm_title'),
      description: t('playlists.delete_confirm'),
      destructive: true,
      confirmText: t('common.delete')
    });
    if (confirmed) {
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
    <div className="w-full -mx-6 pb-24 relative">
      {/* 1. Immersive Hero Header */}
      <div 
        className="relative h-[30vh] min-h-[300px] md:h-[40vh] flex items-end px-8 pb-8 transition-colors duration-1000"
        style={{ 
          background: `linear-gradient(to bottom, ${dominantColor.replace(')', ', 0.6)')} 0%, ${dominantColor.replace(')', ', 0.4)')} 50%, #121212 100%)` 
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end gap-x-8 gap-y-6 w-full relative z-10">
          <div className="w-48 h-48 md:w-60 md:h-60 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden shrink-0 bg-zinc-800 transition-transform duration-500 hover:scale-[1.02]">
            {playlist.coverArt ? (
              <img 
                src={playlistCoverUrl} 
                alt={playlist.name} 
                className="w-full h-full object-cover shadow-2xl"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <Play className="h-20 w-20 text-primary/40" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90 drop-shadow-md">
                {t('common.public_playlist')}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl py-2">
                {playlist.name}
            </h1>
            <div className="flex items-center flex-wrap gap-x-2 text-sm font-bold text-white/90 drop-shadow-md">
                <span className="text-white hover:underline cursor-pointer">{playlist.owner}</span>
                <span className="opacity-60">•</span>
                <span>{playlist.songCount} {t('common.songs')}</span>
                <span className="opacity-60">•</span>
                <span className="opacity-80 font-normal">{formatDuration(playlist.duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Action Bar Section */}
      <div className="px-8 py-6 flex items-center gap-6">
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full bg-primary shadow-xl hover:scale-105 active:scale-95 transition-all text-black"
          onClick={handlePlayPlaylist}
          disabled={!playlist.entry || playlist.entry.length === 0}
        >
          <Play className="h-7 w-7 fill-current ml-1" />
        </Button>

        <Button 
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full h-10 w-10 border-white/10 hover:border-white text-muted-foreground hover:text-white transition-all shadow-md",
            isPlaylistDownloaded && "text-primary border-primary/20"
          )}
          onClick={async (e) => {
            e.stopPropagation();
            if (playlist?.entry) {
              const songsToDownload = playlist.entry.filter(s => !downloadedIds[s.id]);
              if (songsToDownload.length > 0) {
                useDownloadStore.getState().setBatchProgress(0, songsToDownload.length);
                for (const song of songsToDownload) {
                  await downloadSong(song);
                }
              }
            }
          }}
          disabled={isPlaylistDownloading}
        >
          {isPlaylistDownloading ? (
             <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaylistDownloaded ? (
             <Check className="h-5 w-5 stroke-[3px]" />
          ) : (
             <ArrowDownToLine className="h-5 w-5" />
          )}
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10 text-muted-foreground hover:text-destructive transition-colors"
          onClick={handleDeletePlaylist}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* 3. Track List Section */}
      <div className="px-8 space-y-2">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_4fr_3fr_2fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-white/5 text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4 items-center">
          <span className="text-center font-bold">#</span>
          <span>{t('common.title')}</span>
          <span className="hidden md:inline">{t('common.album')}</span>
          <span className="hidden lg:inline">{t('playlist.added_at')}</span>
          <div className="flex justify-end pr-8">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        {/* Tracks */}
        <div className="flex flex-col">
          {playlist.entry?.map((song, index) => (
            <div 
              key={`${song.id}-${index}`} 
              className={cn(
                "grid grid-cols-[16px_4fr_3fr_2fr_minmax(120px,1fr)] gap-4 px-4 py-2 rounded-lg hover:bg-white/10 cursor-pointer group transition-all duration-200 items-center",
                currentSong?.id === song.id && "bg-white/5"
              )}
              onClick={() => handlePlaySong(song)}
            >
              {/* Number/Play */}
              <div className="flex justify-center items-center">
                {currentSong?.id === song.id ? (
                   <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground group-hover:hidden tabular-nums">{index + 1}</span>
                )}
                <Play className={cn(
                  "h-3 w-3 fill-current hidden",
                  currentSong?.id !== song.id && "group-hover:block text-white"
                )} />
              </div>
              
              {/* Title & Artist */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-muted rounded shadow-md overflow-hidden shrink-0">
                  <img 
                    src={getCoverUrl(song.coverArt || song.albumId)} 
                    alt={song.title} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col truncate pr-2">
                  <span className={cn(
                    "text-sm font-bold truncate transition-colors",
                    currentSong?.id === song.id ? "text-primary" : "text-white"
                  )}>{song.title}</span>
                  <ArtistLinks 
                    artist={song.artist} 
                    artistId={song.artistId} 
                    className="text-xs"
                    linkClassName="text-muted-foreground hover:text-white no-underline hover:underline font-medium"
                  />
                </div>
              </div>

              {/* Album */}
              <span className="hidden md:block text-xs text-muted-foreground truncate hover:text-white transition-colors"
                    onClick={(e) => { e.stopPropagation(); navigate(`/album/${song.albumId}`); }}>
                {song.album}
              </span>

              {/* Date (Simulated as we don't have per-track add date easily in basic Subsonic, using playlist creation as proxy if available or just empty) */}
              <span className="hidden lg:block text-xs text-muted-foreground truncate">
                {playlist.created ? new Date(playlist.created).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
              </span>

              {/* Duration & Actions */}
              <div className="flex items-center justify-end gap-4 pr-4">
                {downloadingIds.has(song.id) ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : downloadedIds[song.id] ? (
                   <div className="bg-primary/20 rounded-full p-0.5">
                     <Check className="h-2.5 w-2.5 text-primary stroke-[4px]" />
                   </div>
                ) : (
                   <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-white transition-opacity"
                      onClick={(e) => { e.stopPropagation(); downloadSong(song); }}
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                    </Button>
                )}
                
                <span className="text-xs text-muted-foreground tabular-nums font-medium w-10 text-right">
                  {formatDuration(song.duration)}
                </span>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  onClick={(e) => { e.stopPropagation(); handleRemoveTrack(index); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {(!playlist.entry || playlist.entry.length === 0) && (
            <div className="py-20 text-center text-muted-foreground font-medium">
              {t('playlists.empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
