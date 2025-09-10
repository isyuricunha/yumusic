package com.yuricunha.yumusic.repository;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.yuricunha.yumusic.App;
import com.yuricunha.yumusic.subsonic.base.ApiResponse;
import com.yuricunha.yumusic.subsonic.models.LyricsList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OpenRepository {
    public MutableLiveData<LyricsList> getLyricsBySongId(String id) {
        MutableLiveData<LyricsList> lyricsList = new MutableLiveData<>();

        App.getSubsonicClientInstance(false)
                .getOpenClient()
                .getLyricsBySongId(id)
                .enqueue(new Callback<ApiResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<ApiResponse> call, @NonNull Response<ApiResponse> response) {
                        if (response.isSuccessful() && response.body() != null && response.body().getSubsonicResponse().getLyricsList() != null) {
                            lyricsList.setValue(response.body().getSubsonicResponse().getLyricsList());
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<ApiResponse> call, @NonNull Throwable t) {

                    }
                });

        return lyricsList;
    }
}
