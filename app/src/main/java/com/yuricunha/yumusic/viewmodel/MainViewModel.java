package com.yuricunha.yumusic.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.yuricunha.yumusic.github.models.LatestRelease;
import com.yuricunha.yumusic.repository.QueueRepository;
import com.yuricunha.yumusic.repository.SystemRepository;
import com.yuricunha.yumusic.subsonic.models.OpenSubsonicExtension;
import com.yuricunha.yumusic.subsonic.models.SubsonicResponse;

import java.util.List;

public class MainViewModel extends AndroidViewModel {
    private static final String TAG = "SearchViewModel";

    private final SystemRepository systemRepository;

    public MainViewModel(@NonNull Application application) {
        super(application);

        systemRepository = new SystemRepository();
    }

    public boolean isQueueLoaded() {
        QueueRepository queueRepository = new QueueRepository();
        return queueRepository.count() != 0;
    }

    public LiveData<SubsonicResponse> ping() {
        return systemRepository.ping();
    }

    public LiveData<List<OpenSubsonicExtension>> getOpenSubsonicExtensions() {
        return systemRepository.getOpenSubsonicExtensions();
    }

    public LiveData<LatestRelease> checkTempoUpdate() {
        return systemRepository.checkTempoUpdate();
    }
}
