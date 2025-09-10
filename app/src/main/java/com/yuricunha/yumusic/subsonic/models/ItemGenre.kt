package com.yuricunha.yumusic.subsonic.models

import android.os.Parcelable
import androidx.annotation.Keep
import kotlinx.parcelize.Parcelize

@Keep
@Parcelize
open class ItemGenre : Parcelable {
    var name: String? = null
}
