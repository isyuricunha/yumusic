package com.cappielloantonio.tempo.subsonic.models

import androidx.annotation.Keep

@Keep
class SubsonicResponse {
    var error: Error? = null
    var scanStatus: ScanStatus? = null
    var topSongs: TopSongs? = null
    var similarSongs2: SimilarSongs2? = null
    var similarSongs: SimilarSongs? = null
    var artistInfo2: ArtistInfo2? = null
    var artistInfo: ArtistInfo? = null
    var albumInfo: AlbumInfo? = null
    var starred2: Starred2? = null
    var starred: Starred? = null
    var shares: Shares? = null
    var playQueue: PlayQueue? = null
    var bookmarks: Bookmarks? = null
    var internetRadioStations: InternetRadioStations? = null
    var newestPodcasts: NewestPodcasts? = null
    var podcasts: Podcasts? = null
    var lyrics: Lyrics? = null
    var songsByGenre: Songs? = null
    var randomSongs: Songs? = null
    var albumList2: AlbumList2? = null
    var albumList: AlbumList? = null
    var chatMessages: ChatMessages? = null
    var user: User? = null
    var users: Users? = null
    var license: License? = null
    var jukeboxPlaylist: JukeboxPlaylist? = null
    var jukeboxStatus: JukeboxStatus? = null
    var playlist: PlaylistWithSongs? = null
    var playlists: Playlists? = null
    var searchResult3: SearchResult3? = null
    var searchResult2: SearchResult2? = null
    var searchResult: SearchResult? = null
    var nowPlaying: NowPlaying? = null
    var videoInfo: VideoInfo? = null
    var videos: Videos? = null
    var song: Child? = null
    var album: AlbumWithSongsID3? = null
    var artist: ArtistWithAlbumsID3? = null
    var artists: ArtistsID3? = null
    var genres: Genres? = null
    var directory: Directory? = null
    var indexes: Indexes? = null
    var musicFolders: MusicFolders? = null
    var status: String? = null
    var version: String? = null
    var type: String? = null
    var serverVersion: String? = null
    var openSubsonic: Boolean? = null
    var openSubsonicExtensions: List<OpenSubsonicExtension>? = null
    var lyricsList: LyricsList? = null
}