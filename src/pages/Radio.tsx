import { useRadioStations } from '@/hooks/useSubsonic';
import { Button } from '@/components/ui/button';
import { Radio as RadioIcon, Play, Trash2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useConfigStore } from '@/store/configStore';
import { useTranslation } from 'react-i18next';
import { useRadioStore } from '@/store/radioStore';
import { AddRadioDialog } from '@/components/modals/AddRadioDialog';
import { useEffect } from 'react';

export default function Radio() {
  const { t } = useTranslation();
  const { data: serverStations, isLoading: loadingServer, isError } = useRadioStations();
  const { setSong, setQueue } = usePlayerStore();
  const config = useConfigStore((state) => state.config);
  const { localRadios, isLoading: loadingLocal, removeRadio, initializeRadios } = useRadioStore();

  useEffect(() => {
    initializeRadios();
  }, [initializeRadios]);

  const handlePlayStation = (station: any) => {
    const radioSong: any = {
      id: station.id,
      title: station.name,
      artist: station.isLocal ? 'Local Web Radio' : 'Internet Radio',
      album: 'Live Stream',
      duration: 0,
      type: 'radio',
      streamUrl: station.isLocal ? station.streamUrl : undefined,
    };
    
    if (config || station.isLocal) {
      setQueue([radioSong]);
      setSong(radioSong, config!); // Exclamation is okay, store checks internally if needed
    }
  };

  const handleDeleteLocal = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('common.confirm_delete') || 'Are you sure you want to delete this radio station?')) {
      await removeRadio(id);
    }
  };

  const isLoading = loadingServer || loadingLocal;

  return (
    <div className="w-full space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.radio')}</h1>
        <AddRadioDialog />
      </div>
      
      {isLoading ? (
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}...</div>
      ) : (
        <div className="space-y-8">
          {localRadios.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b border-border/40 pb-2 text-foreground">
                {t('radio.local_stations')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localRadios.map((station) => (
                  <div 
                    key={station.id} 
                    className="flex flex-col p-4 bg-card border border-border rounded-xl hover:bg-muted/50 cursor-pointer transition group"
                    onClick={() => handlePlayStation(station)}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 self-start">
                        Local
                      </span>
                       <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => handleDeleteLocal(station.id, e)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition shrink-0">
                        <RadioIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold truncate">{station.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{station.streamUrl}</div>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition">
                        <Play className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {localRadios.length > 0 && (
              <h2 className="text-xl font-bold border-b border-border/40 pb-2 text-foreground">
                {t('radio.server_stations')}
              </h2>
            )}
            
            {isError ? (
               <div className="p-8 border border-border/50 border-dashed rounded-xl bg-muted/20 text-center">
                  <p className="text-muted-foreground">{t('common.feature_not_implemented')}</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {serverStations?.map((station) => (
                  <div 
                    key={station.id} 
                    className="flex items-center p-4 bg-card border border-border rounded-xl hover:bg-muted/50 cursor-pointer transition group"
                    onClick={() => handlePlayStation(station)}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition shrink-0">
                      <RadioIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold truncate">{station.name}</div>
                      <div className="text-xs text-muted-foreground">Live Stream</div>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition">
                      <Play className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                ))}
                {serverStations?.length === 0 && (
                  <p className="text-muted-foreground">No radio stations found on your server.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
