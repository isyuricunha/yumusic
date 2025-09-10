package com.yuricunha.yumusic.interfaces;

import androidx.annotation.Keep;

@Keep

public interface RadioCallback {
    default void onDismiss() {}
}
