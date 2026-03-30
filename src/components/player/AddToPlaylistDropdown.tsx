import { usePlaylists, usePlaylistMutations } from '@/hooks/useSubsonic';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface AddToPlaylistDropdownProps {
  songId: string;
}

export function AddToPlaylistDropdown({ songId }: AddToPlaylistDropdownProps) {
  const { t } = useTranslation();
  const { data: playlists } = usePlaylists();
  const { addTracksToPlaylist } = usePlaylistMutations();

  const handleAddTrack = async (playlistId: string) => {
    await addTracksToPlaylist.mutateAsync({ playlistId, songIds: [songId] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('playlists.add_to')}
        </div>
        {!playlists || playlists.length === 0 ? (
           <DropdownMenuItem disabled>{t('common.no_playlists')}</DropdownMenuItem>
        ) : (
          playlists.map((playlist) => (
            <DropdownMenuItem 
              key={playlist.id} 
              onClick={(e) => {
                e.stopPropagation();
                handleAddTrack(playlist.id);
              }}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">{playlist.name}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
