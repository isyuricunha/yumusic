import { Play, SkipBack, SkipForward, Volume2, Maximize, Repeat, Shuffle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export function PlayerBar() {
  return (
    <div className="h-24 bg-card border-t border-border flex items-center justify-between px-4 z-50 fixed bottom-0 left-0 right-0">
      
      {/* Current Track Info */}
      <div className="flex items-center w-1/4 min-w-[200px]">
        <div className="w-14 h-14 bg-muted rounded-md shadow flex-shrink-0 animate-pulse" />
        <div className="ml-4 flex flex-col justify-center">
          <div className="font-semibold text-sm hover:underline cursor-pointer truncate max-w-[150px] lg:max-w-[250px]">
            No Track Playing
          </div>
          <div className="text-xs text-muted-foreground hover:underline cursor-pointer truncate">
            Yumusic Player
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center justify-center w-2/4 max-w-[722px]">
        <div className="flex items-center space-x-4 mb-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <SkipBack className="h-5 w-5 fill-current" />
          </Button>
          
          <Button variant="default" size="icon" className="h-8 w-8 rounded-full">
            <Play className="h-4 w-4 ml-0.5 fill-current" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-full flex items-center space-x-2 text-xs text-muted-foreground font-medium">
          <span className="w-8 text-right">0:00</span>
          <Slider 
            defaultValue={[0]} 
            max={100} 
            step={1} 
            className="w-full flex-grow hover:cursor-pointer" 
          />
          <span className="w-8">0:00</span>
        </div>
      </div>

      {/* Side Controls */}
      <div className="flex items-center justify-end w-1/4 space-x-2 pr-2">
        <Volume2 className="h-5 w-5 text-muted-foreground" />
        <div className="w-24">
          <Slider defaultValue={[100]} max={100} step={1} className="w-full hover:cursor-pointer" />
        </div>
        <MaxmizeIcon />
      </div>

    </div>
  );
}

function MaxmizeIcon() {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground ml-2">
      <Maximize className="h-4 w-4" />
    </Button>
  );
}
