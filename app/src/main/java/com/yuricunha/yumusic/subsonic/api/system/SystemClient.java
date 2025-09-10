package com.yuricunha.yumusic.subsonic.api.system;

import android.util.Log;

import com.yuricunha.yumusic.subsonic.RetrofitClient;
import com.yuricunha.yumusic.subsonic.Subsonic;
import com.yuricunha.yumusic.subsonic.base.ApiResponse;

import retrofit2.Call;

public class SystemClient {
    private static final String TAG = "SystemClient";

    private final Subsonic subsonic;
    private final SystemService systemService;

    public SystemClient(Subsonic subsonic) {
        this.subsonic = subsonic;
        this.systemService = new RetrofitClient(subsonic).getRetrofit().create(SystemService.class);
    }

    public Call<ApiResponse> ping() {
        Log.d(TAG, "ping()");
        return systemService.ping(subsonic.getParams());
    }

    public Call<ApiResponse> getLicense() {
        Log.d(TAG, "getLicense()");
        return systemService.getLicense(subsonic.getParams());
    }

    public Call<ApiResponse> getOpenSubsonicExtensions() {
        Log.d(TAG, "getOpenSubsonicExtensions()");
        return systemService.getOpenSubsonicExtensions(subsonic.getParams());
    }
}
