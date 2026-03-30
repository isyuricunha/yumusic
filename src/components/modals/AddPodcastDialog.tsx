import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { fetchRSS } from '@/services/rssService';
import { usePodcastStore } from '@/store/podcastStore';
import { useTranslation } from 'react-i18next';

export function AddPodcastDialog() {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addPodcast = usePodcastStore((state) => state.addPodcast);
  const [open, setOpen] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);

    try {
      const feedData = await fetchRSS(url);
      
      await addPodcast({
        id: url,
        url: url,
        title: feedData.title,
        author: feedData.author,
        description: feedData.description,
        coverArt: feedData.image,
        isLocal: true
      });

      setUrl('');
      setOpen(false);
    } catch (err: any) {
      console.error('Failed to add podcast RSS', err);
      setError(err.message || 'Failed to parse RSS feed. Make sure it is a valid XML URL.');
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
            <span>{t('podcasts.add_rss')}</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">{t('podcasts.add_rss_title')}</DialogTitle>
          <DialogDescription>{t('podcasts.add_rss_desc')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAdd} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="rss-url" className="text-sm font-medium text-muted-foreground">RSS Feed URL</label>
            <Input
              id="rss-url"
              placeholder="https://example.com/podcast.xml"
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
              disabled={loading}
              className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
