package com.yuricunha.yumusic.subsonic.models

import androidx.annotation.Keep

@Keep
class Starred {
    var artists: List<Artist>? = null
    var albums: List<Child>? = null
    var songs: List<Child>? = null
}
