import { useAlbums, useArtists, useCoverArtUrl } from '@/hooks/useSubsonic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Library() {
  const { t } = useTranslation();
  const { data: albums, isLoading: loadingAlbums } = useAlbums();
  const { data: artists, isLoading: loadingArtists } = useArtists();
  const getCoverUrl = useCoverArtUrl();
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.library')}</h1>
      </div>

      <Tabs defaultValue="albums" className="w-full">
        <TabsList className="bg-muted p-1 rounded-md">
          <TabsTrigger value="albums" className="rounded-sm">{t('library.recent_albums')}</TabsTrigger>
          <TabsTrigger value="artists" className="rounded-sm">{t('library.artists')}</TabsTrigger>
        </TabsList>

        <TabsContent value="albums" className="mt-6 outline-none">
          {loadingAlbums ? (
            <div className="text-muted-foreground animate-pulse">{t('common.loading')}...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
              {albums?.map((album) => (
                <div 
                  key={album.id} 
                  className="group cursor-pointer flex flex-col space-y-3"
                  onClick={() => navigate(`/album/${album.id}`)}
                >
                  <div className="overflow-hidden rounded-md shadow-md bg-muted aspect-square relative transition-transform duration-300 group-hover:scale-[1.02]">
                    <img
                      src={getCoverUrl(album.coverArt || album.id)}
                      alt={album.name}
                      className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-75"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm truncate" title={album.name}>{album.name}</span>
                    <span className="text-xs text-muted-foreground truncate" title={album.artist}>{album.artist}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="artists" className="mt-6 outline-none">
          {loadingArtists ? (
            <div className="text-muted-foreground animate-pulse">{t('common.loading')}...</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
              {artists?.map((artist) => (
                <div 
                  key={artist.id} 
                  className="group flex flex-col items-center cursor-pointer space-y-3"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <Avatar className="w-20 h-20 sm:w-28 sm:h-28 shadow-md transition-transform duration-300 group-hover:scale-[1.05]">
                    <AvatarImage src={getCoverUrl(artist.coverArt || '')} className="object-cover" />
                    <AvatarFallback className="bg-muted text-xl font-bold">{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-xs text-center line-clamp-2">{artist.name}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
