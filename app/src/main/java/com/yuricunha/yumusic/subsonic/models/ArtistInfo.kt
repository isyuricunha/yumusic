package com.yuricunha.yumusic.subsonic.models

import androidx.annotation.Keep

@Keep
class ArtistInfo : ArtistInfoBase() {
    var similarArtists: List<Artist>? = null
}
