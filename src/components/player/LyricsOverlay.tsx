import { useEffect, useRef } from 'react';
import { X, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLyrics, useCoverArtUrl } from '@/hooks/useSubsonic';
import { useImageColor } from '@/hooks/useImageColor';
import { useTranslation } from 'react-i18next';
import { SubsonicSong } from '@/hooks/useSubsonic';
import { cn } from '@/lib/utils';

interface LyricsOverlayProps {
  song: SubsonicSong | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LyricsOverlay({ song, isOpen, onClose }: LyricsOverlayProps) {
  const { t } = useTranslation();
  const getCoverArt = useCoverArtUrl();
  const { data: lyrics, isLoading } = useLyrics(song?.artist, song?.title);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const coverUrl = song ? getCoverArt(song.coverArt || song.albumId) : '';
  const bgColor = useImageColor(coverUrl, '#121212');

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !song) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex flex-col transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-8",
        !isOpen && "animate-out fade-out slide-out-to-bottom-8"
      )}
      style={{ 
        background: `linear-gradient(to bottom, ${bgColor}ee, #000000ff)`,
        backdropFilter: 'blur(40px) saturate(150%)'
      }}
    >
      {/* Background Subtle Artwork */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex items-center justify-center">
         <img 
            src={coverUrl} 
            alt="" 
            className="w-[100vw] h-[100vw] object-cover blur-[120px] scale-150 rotate-12"
         />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 px-10 relative z-10">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/10">
            <img src={coverUrl} alt={song.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white tracking-tight">{song.title}</h2>
            <p className="text-white/60 font-medium">{song.artist}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:rotate-90"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Lyrics Content */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-y-auto px-10 pb-32 pt-10 relative z-10 scrollbar-hide flex flex-col items-center"
      >
        <div className="max-w-3xl w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
              <Mic2 className="h-12 w-12 text-white/20 animate-pulse" />
              <p className="text-white/40 font-medium animate-pulse">{t('player.lyrics_loading')}</p>
            </div>
          ) : lyrics?.value ? (
            <div className="whitespace-pre-wrap text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.3] tracking-tighter opacity-90 hover:opacity-100 transition-opacity">
              {lyrics.value}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
                 <Mic2 className="h-10 w-10 text-white/20" />
               </div>
               <p className="text-white/40 text-xl font-bold">{t('player.lyrics_not_found')}</p>
               <Button 
                 variant="outline" 
                 className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-full px-8"
                 onClick={onClose}
               >
                 {t('common.back')}
               </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 inset-x-0 p-8 flex justify-center pointer-events-none">
         <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            {t('player.immersive_experience')}
         </p>
      </div>
    </div>
  );
}
