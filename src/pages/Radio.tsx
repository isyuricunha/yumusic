import { useRadioStations } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Radio as RadioIcon, Play } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useTranslation } from 'react-i18next';

export default function Radio() {
  const { t } = useTranslation();
  const { data: stations, isLoading } = useRadioStations();
  const { setSong, setQueue } = usePlayerStore();
  const config = useConfigStore((state) => state.config);

  const handlePlayStation = (station: any) => {
    const radioSong: any = {
      id: station.id,
      title: station.name,
      artist: 'Internet Radio',
      album: 'Live Stream',
      duration: 0,
      type: 'radio',
    };
    
    if (config) {
      setQueue([radioSong]);
      setSong(radioSong, config);
    }
  };

  return (
    <div className="w-full space-y-6 pb-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.radio')}</h1>
      
      {isLoading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations?.map((station) => (
            <div 
              key={station.id} 
              className="flex items-center p-4 bg-card border border-border rounded-xl hover:bg-muted/50 cursor-pointer transition group"
              onClick={() => handlePlayStation(station)}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition">
                <RadioIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 truncate">
                <div className="font-semibold truncate">{station.name}</div>
                <div className="text-xs text-muted-foreground">Live Stream</div>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full opacity-0 group-hover:opacity-100 transition">
                <Play className="h-4 w-4 fill-current" />
              </Button>
            </div>
          ))}
          {stations?.length === 0 && (
            <p className="text-muted-foreground">No radio stations found on your server.</p>
          )}
        </div>
      )}
    </div>
  );
}
