import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';

interface ArtistLinksProps {
  artists?: { id: string; name: string }[];
  artist?: string;
  artistId?: string;
  className?: string;
  linkClassName?: string;
}

export function ArtistLinks({ artists, artist, artistId, className, linkClassName }: ArtistLinksProps) {
  const navigate = useNavigate();
  
  // 1. If we have the direct artists array (OpenSubsonic extension / Navidrome split)
  if (artists && artists.length > 0) {
    return (
      <div className={cn("inline-flex flex-wrap items-center gap-0 min-w-0 truncate", className)}>
        {artists.map((a, index) => (
          <span key={a.id || index} className="inline-flex items-center">
            <span
              className={cn(
                "hover:underline cursor-pointer truncate transition-colors hover:text-foreground",
                linkClassName
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (a.id) {
                  navigate(`/artist/${a.id}`);
                } else {
                  navigate(`/search?q=${encodeURIComponent(a.name.trim())}`);
                }
              }}
            >
              {a.name}
            </span>
            {index < artists.length - 1 && (
              <span className="text-muted-foreground/60 whitespace-pre">
                {" • "}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  }

  // 2. Fallback to regex splitting for legacy Subsonic servers
  if (!artist) return null;

  // Regex to split by common artist separators, keeping the separators in the resulting array
  // Separators: •, &, /, feat., feat, ft., ft, ;
  const separatorsRegex = /( • | & | \/ | feat\. | feat | ft\. | ft | ; )/g;
  const parts = artist.split(separatorsRegex);

  return (
    <div className={cn("inline-flex flex-wrap items-center gap-0 min-w-0 truncate", className)}>
      {parts.map((part, index) => {
        const isSeparator = separatorsRegex.test(part);
        
        if (isSeparator) {
          return (
            <span key={index} className="text-muted-foreground/60 whitespace-pre">
              {part}
            </span>
          );
        }

        const isPrimaryArtist = index === 0 && artistId;
        
        return (
          <span
            key={index}
            className={cn(
              "hover:underline cursor-pointer truncate transition-colors hover:text-foreground",
              linkClassName
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (isPrimaryArtist) {
                navigate(`/artist/${artistId}`);
              } else {
                // Fallback to search for the specific artist name
                navigate(`/search?q=${encodeURIComponent(part.trim())}`);
              }
            }}
          >
            {part}
          </span>
        );
      })}
    </div>
  );
}
