package com.yuricunha.yumusic.subsonic.api.medialibraryscanning;

import android.util.Log;

import com.yuricunha.yumusic.subsonic.RetrofitClient;
import com.yuricunha.yumusic.subsonic.Subsonic;
import com.yuricunha.yumusic.subsonic.base.ApiResponse;

import retrofit2.Call;

public class MediaLibraryScanningClient {
    private static final String TAG = "MediaLibraryScanningClient";

    private final Subsonic subsonic;
    private final MediaLibraryScanningService mediaLibraryScanningService;

    public MediaLibraryScanningClient(Subsonic subsonic) {
        this.subsonic = subsonic;
        this.mediaLibraryScanningService = new RetrofitClient(subsonic).getRetrofit().create(MediaLibraryScanningService.class);
    }

    public Call<ApiResponse> startScan() {
        Log.d(TAG, "startScan()");
        return mediaLibraryScanningService.startScan(subsonic.getParams());
    }

    public Call<ApiResponse> getScanStatus() {
        Log.d(TAG, "getScanStatus()");
        return mediaLibraryScanningService.getScanStatus(subsonic.getParams());
    }
}
