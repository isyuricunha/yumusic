import { fetch } from '@tauri-apps/plugin-http';
import { SubsonicSong } from '@/hooks/useSubsonic';

export interface RSSFeed {
  title: string;
  description: string;
  image?: string;
  author?: string;
  items: SubsonicSong[];
}

export const fetchRSS = async (url: string): Promise<RSSFeed> => {
  // Use Tauri's fetch to bypass CORS, or fallback to standard fetch if not in Tauri
  const isTauri = !!(window as any).__TAURI_INTERNALS__;
  
  let response: Response;
  if (isTauri) {
    response = await fetch(url, {
      method: 'GET',
      connectTimeout: 10000,
    });
  } else {
    // Fallback for browser testing (will likely hit CORS)
    response = await window.fetch(url);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS: ${response.statusText}`);
  }

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // Basic RSS 2.0 parsing
  const channel = xmlDoc.querySelector('channel');
  if (!channel) throw new Error('Invalid RSS feed: No channel found');

  const title = channel.querySelector('title')?.textContent || 'Unknown Podcast';
  const description = channel.querySelector('description')?.textContent || '';
  const image = channel.querySelector('image > url')?.textContent || 
                channel.querySelector('itunes\\:image')?.getAttribute('href') || '';
  const author = channel.querySelector('itunes\\:author')?.textContent || '';

  const items: SubsonicSong[] = [];
  const itemNodes = xmlDoc.querySelectorAll('item');

  itemNodes.forEach((item, index) => {
    const itemTitle = item.querySelector('title')?.textContent || 'Untitled Episode';
    const enclosure = item.querySelector('enclosure');
    const streamUrl = enclosure?.getAttribute('url');
    const durationStr = item.querySelector('itunes\\:duration')?.textContent || '0';
    
    // Parse duration (could be HH:MM:SS or seconds)
    let duration = 0;
    if (durationStr.includes(':')) {
      const parts = durationStr.split(':').map(Number);
      if (parts.length === 3) duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
      else if (parts.length === 2) duration = parts[0] * 60 + parts[1];
    } else {
      duration = parseInt(durationStr) || 0;
    }

    if (streamUrl) {
      items.push({
        id: `rss-${url}-${index}`, // Unique ID for the session
        title: itemTitle,
        album: title,
        artist: author || title,
        track: index + 1,
        duration: duration,
        coverArt: image,
        albumId: url, // Use URL as parent ID
        artistId: url,
        type: 'podcast',
        streamUrl: streamUrl, // NEW FIELD we added
      });
    }
  });

  return {
    title,
    description,
    image,
    author,
    items
  };
};
