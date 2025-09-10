package com.yuricunha.yumusic.interfaces;

import androidx.annotation.Keep;

@Keep
public interface PlaylistCallback {
    default void onDismiss() {}
}
