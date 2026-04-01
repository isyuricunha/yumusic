import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSubsonic } from '@/services/apiClient';
export { fetchSubsonic };
import { useConfigStore } from '@/store/configStore';
import { useCallback } from 'react';

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
  type?: string; // For distinguishing Podcasts/Radio
  streamUrl?: string; // For external sources (RSS, Direct Links)
}

export interface SubsonicPodcast {
  id: string;
  title: string;
  description?: string;
  coverArt?: string;
  episode?: SubsonicSong[];
  isLocal?: boolean;
}

export interface SubsonicRadioStation {
  id: string;
  name: string;
  streamUrl: string;
}

export interface SubsonicPlaylist {
  id: string;
  name: string;
  songCount: number;
  duration: number;
  created: string;
  changed: string;
  owner: string;
  public: boolean;
  coverArt?: string;
  entry?: SubsonicSong[];
}

export interface SubsonicArtistInfo {
  biography?: string;
  musicBrainzId?: string;
  lastFmUrl?: string;
  smallImageUrl?: string;
  mediumImageUrl?: string;
  largeImageUrl?: string;
  similarArtist?: { id: string; name: string }[];
}

export interface SubsonicAlbumInfo {
  notes?: string;
  musicBrainzId?: string;
  lastFmUrl?: string;
  smallImageUrl?: string;
  mediumImageUrl?: string;
  largeImageUrl?: string;
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
        const artists = index.artist;
        if (Array.isArray(artists)) {
          allArtists.push(...artists);
        } else if (artists) {
          allArtists.push(artists);
        }
      });
      return allArtists.sort((a, b) => a.name.localeCompare(b.name));
    },
    enabled: !!config,
  });
}

export function useAlbumList(type: 'newest' | 'frequent' | 'recent' | 'random' = 'newest', size = 50) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['albumList', type, size, config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      // Using getAlbumList2 for better compatibility with Navidrome/Gonic
      const res = await fetchSubsonic('getAlbumList2', config, { type, size: size.toString() });
      return (res?.albumList2?.album || []) as SubsonicAlbum[];
    },
    enabled: !!config,
  });
}

export function useAlbums() {
  return useAlbumList('newest', 50);
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
    enabled: !!config && query.length > 0,
  });
}

export function useRandomSongs(size = 20) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['randomSongs', size, config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('getRandomSongs', config, { size: size.toString() });
      return (res?.randomSongs?.song || []) as SubsonicSong[];
    },
    enabled: !!config,
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

export function useCoverArtUrl() {
  const config = useConfigStore((state) => state.config);
  
  return useCallback((id?: string) => {
    if (!config || !id) return undefined;
    
    // If it's already a URL, return it as is
    if (id.startsWith('http')) return id;
    
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
  }, [config]);
}

export function useStreamUrl() {
  const config = useConfigStore((state) => state.config);
  
  return useCallback((song: SubsonicSong) => {
    if (!config || !song.id) return undefined;
    
    const query = new URLSearchParams({
      u: config.username,
      t: config.token,
      s: config.salt,
      v: '1.16.1',
      c: 'Yumusic',
      id: song.id
    });
    
    const baseUrl = config.serverUrl.endsWith('/') ? config.serverUrl : `${config.serverUrl}/`;
    const streamUrl = song.streamUrl || `${baseUrl}rest/stream?${query.toString()}`;
    return streamUrl;
  }, [config]);
}

export function useArtist(id?: string) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['artist', id, config?.serverUrl],
    queryFn: async () => {
      if (!config || !id) throw new Error('No config or id');
      const res = await fetchSubsonic('getArtist', config, { id });
      return res?.artist as SubsonicArtist & { album: SubsonicAlbum[] };
    },
    enabled: !!config && !!id,
  });
}

export function useAlbum(id?: string) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['album', id, config?.serverUrl],
    queryFn: async () => {
      if (!config || !id) throw new Error('No config or id');
      const res = await fetchSubsonic('getAlbum', config, { id });
      return res?.album as SubsonicAlbum & { song: SubsonicSong[] };
    },
    enabled: !!config && !!id,
  });
}

export function useArtistInfo(id?: string) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['artistInfo', id, config?.serverUrl],
    queryFn: async () => {
      if (!config || !id) throw new Error('No config or id');
      try {
        const res = await fetchSubsonic('getArtistInfo2', config, { id });
        return (res?.artistInfo2 || null) as SubsonicArtistInfo;
      } catch (e) {
        console.warn('ArtistInfo not supported or failed', e);
        return null;
      }
    },
    enabled: !!config && !!id,
    retry: false,
  });
}

export function useAlbumInfo(id?: string) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['albumInfo', id, config?.serverUrl],
    queryFn: async () => {
      if (!config || !id) throw new Error('No config or id');
      try {
        const res = await fetchSubsonic('getAlbumInfo2', config, { id });
        return (res?.albumInfo2 || null) as SubsonicAlbumInfo;
      } catch (e) {
        console.warn('AlbumInfo not supported or failed', e);
        return null;
      }
    },
    enabled: !!config && !!id,
    retry: false,
  });
}

export function useTopSongs(artistName?: string, count: number = 10) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['topSongs', artistName, count, config?.serverUrl],
    queryFn: async () => {
      if (!config || !artistName) throw new Error('No config or artist name');
      try {
        const res = await fetchSubsonic('getTopSongs', config, { artist: artistName, count: count.toString() });
        return (res?.topSongs?.song || []) as SubsonicSong[];
      } catch (e) {
        console.warn('TopSongs not supported or failed', e);
        return [];
      }
    },
    enabled: !!config && !!artistName,
    retry: false,
  });
}

export function useSearchSongs(query?: string, count: number = 20) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['searchSongs', query, count, config?.serverUrl],
    queryFn: async () => {
      if (!config || !query) return [];
      try {
        const res = await fetchSubsonic('search3', config, { query, songCount: count.toString() });
        return (res?.searchResult3?.song || []) as SubsonicSong[];
      } catch (e) {
        console.warn('SearchSongs failed', e);
        return [];
      }
    },
    enabled: !!config && !!query,
  });
}

export function useArtistSongs(artistId?: string, artistName?: string) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['artistSongs', artistId, artistName, config?.serverUrl],
    queryFn: async () => {
      if (!config || !artistId) throw new Error('No config or artistId');
      
      const [artistRes, searchRes] = await Promise.all([
        fetchSubsonic('getArtist', config, { id: artistId }),
        artistName ? fetchSubsonic('search3', config, { query: artistName, songCount: '50' }) : Promise.resolve(null)
      ]);

      const albums = artistRes?.artist?.album || [];
      const searchSongs = (searchRes?.searchResult3?.song || []) as SubsonicSong[];
      
      const albumSongsPromises = albums.slice(0, 20).map((album: SubsonicAlbum) => 
        fetchSubsonic('getAlbum', config, { id: album.id })
      );
      
      const albumResults = await Promise.all(albumSongsPromises);
      const albumSongs = albumResults.flatMap(res => res?.album?.song || []) as SubsonicSong[];
      
      // Combine and deduplicate
      const allSongsMap = new Map<string, SubsonicSong>();
      [...albumSongs, ...searchSongs].forEach(song => {
        if (song.id) allSongsMap.set(song.id, song);
      });
      
      return Array.from(allSongsMap.values());
    },
    enabled: !!config && !!artistId,
  });
}

export function usePodcasts(options?: { enabled?: boolean }) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['podcasts', config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('getPodcasts', config);
      return (res?.podcasts?.channel || []) as SubsonicPodcast[];
    },
    enabled: !!config && options?.enabled !== false,
  });
}

export function useRadioStations() {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['radiostations', config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('getInternetRadioStations', config);
      return (res?.internetRadioStations?.internetRadioStation || []) as SubsonicRadioStation[];
    },
    enabled: !!config,
  });
}

export function usePlaylists() {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['playlists', config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('getPlaylists', config);
      return (res?.playlists?.playlist || []) as SubsonicPlaylist[];
    },
    enabled: !!config,
  });
}

export function usePlaylist(id?: string) {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['playlist', id, config?.serverUrl],
    queryFn: async () => {
      if (!config || !id) throw new Error('No config or id');
      const res = await fetchSubsonic('getPlaylist', config, { id });
      return res?.playlist as SubsonicPlaylist;
    },
    enabled: !!config && !!id,
  });
}

export function usePlaylistMutations() {
  const config = useConfigStore((state) => state.config);
  const queryClient = useQueryClient();

  const createPlaylist = useMutation({
    mutationFn: async ({ name, songIds }: { name: string; songIds?: string[] }) => {
      if (!config) throw new Error('No config');
      const params: any = { name };
      if (songIds) songIds.forEach((id, i) => (params[`songId[${i}]`] = id));
      return await fetchSubsonic('createPlaylist', config, params);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
  });

  const deletePlaylist = useMutation({
    mutationFn: async (id: string) => {
      if (!config) throw new Error('No config');
      return await fetchSubsonic('deletePlaylist', config, { id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
  });

  const addTracksToPlaylist = useMutation({
    mutationFn: async ({ playlistId, songIds }: { playlistId: string; songIds: string[] }) => {
      if (!config) throw new Error('No config');
      const params: any = { playlistId };
      songIds.forEach((id, i) => (params[`songIdToAdd[${i}]`] = id));
      return await fetchSubsonic('updatePlaylist', config, params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const removeTracksFromPlaylist = useMutation({
    mutationFn: async ({ playlistId, indices }: { playlistId: string; indices: number[] }) => {
      if (!config) throw new Error('No config');
      const params: any = { playlistId };
      indices.forEach((index, i) => (params[`indexToRemove[${i}]`] = index.toString()));
      return await fetchSubsonic('updatePlaylist', config, params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  return { createPlaylist, deletePlaylist, addTracksToPlaylist, removeTracksFromPlaylist };
}

export function useStarMutation() {
  const config = useConfigStore((state) => state.config);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type, star }: { id: string; type: 'album' | 'song' | 'artist'; star: boolean }) => {
      if (!config) throw new Error('No config');
      const endpoint = star ? 'star' : 'unstar';
      const params: any = {};
      if (type === 'album') params.albumId = id;
      else if (type === 'artist') params.artistId = id;
      else params.id = id;
      
      return await fetchSubsonic(endpoint, config, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['album'] });
      queryClient.invalidateQueries({ queryKey: ['artist'] });
    },
  });
}
