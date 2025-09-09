package com.cappielloantonio.tempo.repository;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.cappielloantonio.tempo.App;
import com.cappielloantonio.tempo.github.models.LatestRelease;
import com.cappielloantonio.tempo.interfaces.SystemCallback;
import com.cappielloantonio.tempo.subsonic.base.ApiResponse;
import com.cappielloantonio.tempo.subsonic.models.OpenSubsonicExtension;
import com.cappielloantonio.tempo.subsonic.models.ResponseStatus;
import com.cappielloantonio.tempo.subsonic.models.SubsonicResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SystemRepository {
    public void checkUserCredential(SystemCallback callback) {
        App.getSubsonicClientInstance(false)
                .getSystemClient()
                .ping()
                .enqueue(new Callback<ApiResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<ApiResponse> call, @NonNull retrofit2.Response<ApiResponse> response) {
                        if (response.body() != null) {
                            if (response.body().getSubsonicResponse().getStatus().equals(ResponseStatus.FAILED)) {
                                callback.onError(new Exception(response.body().getSubsonicResponse().getError().getCode() + " - " + response.body().getSubsonicResponse().getError().getMessage()));
                            } else if (response.body().getSubsonicResponse().getStatus().equals(ResponseStatus.OK)) {
                                String password = response.raw().request().url().queryParameter("p");
                                String token = response.raw().request().url().queryParameter("t");
                                String salt = response.raw().request().url().queryParameter("s");
                                callback.onSuccess(password, token, salt);
                            } else {
                                callback.onError(new Exception("Empty response"));
                            }
                        } else {
                            callback.onError(new Exception(String.valueOf(response.code())));
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<ApiResponse> call, @NonNull Throwable t) {
                        callback.onError(new Exception(t.getMessage()));
                    }
                });
    }

    public MutableLiveData<SubsonicResponse> ping() {
        MutableLiveData<SubsonicResponse> pingResult = new MutableLiveData<>();

        App.getSubsonicClientInstance(false)
                .getSystemClient()
                .ping()
                .enqueue(new Callback<ApiResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<ApiResponse> call, @NonNull Response<ApiResponse> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            pingResult.postValue(response.body().getSubsonicResponse());
                        } else {
                            pingResult.postValue(null);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<ApiResponse> call, @NonNull Throwable t) {
                        pingResult.postValue(null);
                    }
                });

        return pingResult;
    }

    public MutableLiveData<List<OpenSubsonicExtension>> getOpenSubsonicExtensions() {
        MutableLiveData<List<OpenSubsonicExtension>> extensionsResult = new MutableLiveData<>();

        App.getSubsonicClientInstance(false)
                .getSystemClient()
                .getOpenSubsonicExtensions()
                .enqueue(new Callback<ApiResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<ApiResponse> call, @NonNull Response<ApiResponse> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            extensionsResult.postValue(response.body().getSubsonicResponse().getOpenSubsonicExtensions());
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<ApiResponse> call, @NonNull Throwable t) {
                        extensionsResult.postValue(null);
                    }
                });

        return extensionsResult;
    }

    public MutableLiveData<LatestRelease> checkTempoUpdate() {
        MutableLiveData<LatestRelease> latestRelease = new MutableLiveData<>();

        App.getGithubClientInstance()
                .getReleaseClient()
                .getLatestRelease()
                .enqueue(new Callback<LatestRelease>() {
                    @Override
                    public void onResponse(@NonNull Call<LatestRelease> call, @NonNull Response<LatestRelease> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            latestRelease.postValue(response.body());
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<LatestRelease> call, @NonNull Throwable t) {
                        latestRelease.postValue(null);
                    }
                });

        return latestRelease;
    }
}
