package com.cappielloantonio.tempo.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.cappielloantonio.tempo.App;
import com.cappielloantonio.tempo.subsonic.base.ApiResponse;
import com.cappielloantonio.tempo.subsonic.models.ArtistID3;
import com.cappielloantonio.tempo.subsonic.models.IndexID3;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;

public class ArtistCatalogueViewModel extends AndroidViewModel {
    private final MutableLiveData<List<ArtistID3>> artistList = new MutableLiveData<>(new ArrayList<>());

    public ArtistCatalogueViewModel(@NonNull Application application) {
        super(application);
    }

    public LiveData<List<ArtistID3>> getArtistList() {
        return artistList;
    }

    public void loadArtists() {
        App.getSubsonicClientInstance(false)
                .getBrowsingClient()
                .getArtists()
                .enqueue(new Callback<ApiResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<ApiResponse> call, @NonNull retrofit2.Response<ApiResponse> response) {
                        if (response.isSuccessful() && response.body() != null && response.body().getSubsonicResponse().getArtists() != null) {
                            List<ArtistID3> artists = new ArrayList<>();

                            for (IndexID3 index : response.body().getSubsonicResponse().getArtists().getIndices()) {
                                artists.addAll(index.getArtists());
                            }

                            artistList.setValue(artists);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<ApiResponse> call, @NonNull Throwable t) {

                    }
                });
    }
}
