import { useQuery } from '@tanstack/react-query';
import { fetchSubsonic } from '@/services/apiClient';
import { useConfigStore } from '@/store/configStore';

// === Typings ===
export interface SubsonicArtist {
  id: string;
  name: string;
  coverArt?: string;
  albumCount: number;
}

export interface SubsonicAlbum {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverArt?: string;
  songCount: number;
  duration: number;
  year?: number;
}

export interface SubsonicSong {
  id: string;
  title: string;
  album: string;
  artist: string;
  track: number;
  year?: number;
  genre?: string;
  coverArt?: string;
  duration: number;
  albumId: string;
  artistId: string;
}

// === Hooks ===
export function useArtists() {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['artists', config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('getArtists', config);
      // getArtists returns { index: [{ artist: [...] }] }
      const indices = res?.artists?.index || [];
      const allArtists: SubsonicArtist[] = [];
      indices.forEach((index: any) => {
        if (index.artist) allArtists.push(...index.artist);
      });
      return allArtists;
    },
    enabled: !!config,
  });
}

export function useAlbums() {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['albums', config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      // getAlbumList with type=newest as default library view
      const res = await fetchSubsonic('getAlbumList', config, { type: 'newest', size: '50' });
      return (res?.albumList?.album || []) as SubsonicAlbum[];
    },
    enabled: !!config,
  });
}

export function useSearch(query: string) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['search', query, config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('search3', config, { query, songCount: '20', albumCount: '10', artistCount: '10' });
      return res?.searchResult3 || { song: [], album: [], artist: [] };
    },
    enabled: !!config && query.length > 1,
  });
}

export function useFavorites() {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['favorites', config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('getStarred', config);
      return res?.starred || { song: [], album: [], artist: [] };
    },
    enabled: !!config,
  });
}

export function useGetCoverArtUrl(id?: string) {
  const config = useConfigStore((state) => state.config);
  if (!config || !id) return undefined;
  
  const query = new URLSearchParams({
    u: config.username,
    t: config.token,
    s: config.salt,
    v: '1.16.1',
    c: 'Yumusic',
    id
  });
  
  const baseUrl = config.serverUrl.endsWith('/') ? config.serverUrl : `${config.serverUrl}/`;
  return `${baseUrl}rest/getCoverArt?${query.toString()}`;
}
