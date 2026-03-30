import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { useRadioStore } from '@/store/radioStore';
import { useTranslation } from 'react-i18next';

export function AddRadioDialog() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const addRadio = useRadioStore((state) => state.addRadio);
  const [open, setOpen] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    
    setLoading(true);

    try {
      await addRadio({
        id: `local-radio-${Date.now()}`,
        name: name,
        streamUrl: url,
        isLocal: true,
      });

      setName('');
      setUrl('');
      setOpen(false);
    } catch (err: any) {
      console.error('Failed to add local radio', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="flex items-center space-x-2 rounded-full px-6">
            <Plus className="h-4 w-4" />
            <span>{t('radio.add_station')}</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
           <DialogTitle className="text-xl font-bold text-primary">{t('radio.add_station_title')}</DialogTitle>
          <DialogDescription>{t('radio.add_station_desc')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAdd} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="radio-name" className="text-sm font-medium text-muted-foreground">{t('radio.name_label')}</label>
            <Input
              id="radio-name"
              placeholder={t('radio.name_placeholder')}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              disabled={loading}
              className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="radio-url" className="text-sm font-medium text-muted-foreground">{t('radio.url_label')}</label>
            <Input
              id="radio-url"
              placeholder={t('radio.url_placeholder')}
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
              disabled={loading}
              className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.creating')}
                </>
              ) : (
                t('common.create')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
