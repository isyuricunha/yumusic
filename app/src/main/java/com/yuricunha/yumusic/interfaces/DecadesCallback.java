package com.yuricunha.yumusic.interfaces;

import androidx.annotation.Keep;

@Keep
public interface DecadesCallback {
    default void onLoadYear(int year) {}
}
