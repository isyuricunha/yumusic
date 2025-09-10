package com.yuricunha.yumusic.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;

import com.yuricunha.yumusic.interfaces.ScanCallback;
import com.yuricunha.yumusic.repository.ScanRepository;

public class SettingViewModel extends AndroidViewModel {
    private static final String TAG = "SettingViewModel";

    private final ScanRepository scanRepository;

    public SettingViewModel(@NonNull Application application) {
        super(application);

        scanRepository = new ScanRepository();
    }

    public void launchScan(ScanCallback callback) {
        scanRepository.startScan(new ScanCallback() {
            @Override
            public void onError(Exception exception) {
                callback.onError(exception);
            }

            @Override
            public void onSuccess(boolean isScanning, long count) {
                callback.onSuccess(isScanning, count);
            }
        });
    }

    public void getScanStatus(ScanCallback callback) {
        scanRepository.getScanStatus(new ScanCallback() {
            @Override
            public void onError(Exception exception) {
                callback.onError(exception);
            }

            @Override
            public void onSuccess(boolean isScanning, long count) {
                callback.onSuccess(isScanning, count);
            }
        });
    }
}
