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
  type?: string; // For distinguishing Podcasts/Radio
}

export interface SubsonicPodcast {
  id: string;
  title: string;
  description?: string;
  coverArt?: string;
  episode?: SubsonicSong[];
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

export function usePodcasts() {
  const config = useConfigStore((state) => state.config);
  return useQuery({
    queryKey: ['podcasts', config?.serverUrl],
    queryFn: async () => {
      if (!config) throw new Error('No config');
      const res = await fetchSubsonic('getPodcasts', config);
      return (res?.podcasts?.channel || []) as SubsonicPodcast[];
    },
    enabled: !!config,
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

import { useMutation, useQueryClient } from '@tanstack/react-query';

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
