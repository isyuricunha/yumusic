package com.yuricunha.yumusic.github.api.release;

import android.util.Log;

import com.yuricunha.yumusic.github.Github;
import com.yuricunha.yumusic.github.GithubRetrofitClient;
import com.yuricunha.yumusic.github.models.LatestRelease;

import retrofit2.Call;

public class ReleaseClient {
    private static final String TAG = "ReleaseClient";

    private final ReleaseService releaseService;

    public ReleaseClient(Github github) {
        this.releaseService = new GithubRetrofitClient(github).getRetrofit().create(ReleaseService.class);
    }

    public Call<LatestRelease> getLatestRelease() {
        Log.d(TAG, "getLatestRelease()");
        return releaseService.getLatestRelease(Github.getOwner(), Github.getRepo());
    }
}
