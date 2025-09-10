package com.yuricunha.yumusic.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.yuricunha.yumusic.repository.PlaylistRepository;
import com.yuricunha.yumusic.subsonic.models.Playlist;

import java.util.List;

public class PlaylistCatalogueViewModel extends AndroidViewModel {
    private final PlaylistRepository playlistRepository;

    private String type;

    private final MutableLiveData<List<Playlist>> playlistList = new MutableLiveData<>(null);

    public PlaylistCatalogueViewModel(@NonNull Application application) {
        super(application);

        playlistRepository = new PlaylistRepository();
    }

    public LiveData<List<Playlist>> getPlaylistList(LifecycleOwner owner) {
        if (playlistList.getValue() == null) {
            playlistRepository.getPlaylists(false, -1).observe(owner, playlistList::postValue);
        }

        return playlistList;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
