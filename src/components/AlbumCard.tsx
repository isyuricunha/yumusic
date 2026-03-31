import React from 'react';
import { Play } from 'lucide-react';

interface AlbumCardProps {
  album: {
    id: string;
    name: string;
    artist: string;
    artistId?: string;
    coverArt?: string;
  };
  getCoverArt: (id: string) => string | undefined;
  navigate: (path: string) => void;
  onPlay: () => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, getCoverArt, navigate, onPlay }) => {
  return (
    <div className="group flex flex-col p-3 rounded-xl bg-white/0 hover:bg-white/5 transition-all duration-300">
      <div 
        className="overflow-hidden rounded-lg shadow-lg bg-muted aspect-square relative cursor-pointer"
        onClick={() => navigate(`/album/${album.id}`)}
      >
        <img
          src={getCoverArt(album.coverArt || album.id)}
          alt={album.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <button 
          className="absolute bottom-3 right-3 w-12 h-12 bg-primary rounded-full shadow-2xl flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 active:scale-95 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <Play className="h-6 w-6 fill-current text-primary-foreground ml-1" />
        </button>
      </div>
      <div className="flex flex-col mt-4 min-w-0">
        <span 
          className="font-bold text-sm truncate hover:underline cursor-pointer leading-tight text-foreground transition-colors group-hover:text-primary" 
          title={album.name}
          onClick={() => navigate(`/album/${album.id}`)}
        >
          {album.name}
        </span>
        <span 
          className="text-xs text-muted-foreground truncate hover:underline cursor-pointer mt-1 leading-tight hover:text-foreground transition-colors" 
          title={album.artist}
          onClick={() => navigate(`/artist/${album.artistId || ''}`)}
        >
          {album.artist}
        </span>
      </div>
    </div>
  );
};
