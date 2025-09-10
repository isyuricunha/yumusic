package com.yuricunha.yumusic.subsonic.base

import androidx.annotation.Keep
import com.yuricunha.yumusic.subsonic.models.SubsonicResponse
import com.google.gson.annotations.SerializedName

@Keep
class ApiResponse {
    @SerializedName("subsonic-response")
    lateinit var subsonicResponse: SubsonicResponse
}
