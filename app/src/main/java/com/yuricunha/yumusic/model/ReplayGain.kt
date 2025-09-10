package com.yuricunha.yumusic.model

import androidx.annotation.Keep

@Keep
data class ReplayGain(
    var trackGain: Float = 0f,
    var albumGain: Float = 0f,
)
