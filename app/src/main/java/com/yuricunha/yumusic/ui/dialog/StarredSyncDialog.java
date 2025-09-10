package com.yuricunha.yumusic.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.OptIn;
import androidx.fragment.app.DialogFragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.util.UnstableApi;

import com.yuricunha.yumusic.R;
import com.yuricunha.yumusic.databinding.DialogStarredSyncBinding;
import com.yuricunha.yumusic.model.Download;
import com.yuricunha.yumusic.util.DownloadUtil;
import com.yuricunha.yumusic.util.MappingUtil;
import com.yuricunha.yumusic.util.Preferences;
import com.yuricunha.yumusic.viewmodel.StarredSyncViewModel;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.stream.Collectors;

@OptIn(markerClass = UnstableApi.class)
public class StarredSyncDialog extends DialogFragment {
    private StarredSyncViewModel starredSyncViewModel;

    private Runnable onCancel;

    public StarredSyncDialog(Runnable onCancel) {
        this.onCancel = onCancel;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        DialogStarredSyncBinding bind = DialogStarredSyncBinding.inflate(getLayoutInflater());

        starredSyncViewModel = new ViewModelProvider(requireActivity()).get(StarredSyncViewModel.class);

        return new MaterialAlertDialogBuilder(getActivity())
                .setView(bind.getRoot())
                .setTitle(R.string.starred_sync_dialog_title)
                .setPositiveButton(R.string.starred_sync_dialog_positive_button, null)
                .setNeutralButton(R.string.starred_sync_dialog_neutral_button, null)
                .setNegativeButton(R.string.starred_sync_dialog_negative_button, null)
                .create();
    }

    @Override
    public void onResume() {
        super.onResume();
        setButtonAction(requireContext());
    }

    private void setButtonAction(Context context) {
        androidx.appcompat.app.AlertDialog dialog = (androidx.appcompat.app.AlertDialog) getDialog();

        if (dialog != null) {
            Button positiveButton = dialog.getButton(Dialog.BUTTON_POSITIVE);
            positiveButton.setOnClickListener(v -> {
                starredSyncViewModel.getStarredTracks(requireActivity()).observe(requireActivity(), songs -> {
                    if (songs != null) {
                        DownloadUtil.getDownloadTracker(context).download(
                                MappingUtil.mapDownloads(songs),
                                songs.stream().map(Download::new).collect(Collectors.toList())
                        );
                    }

                    dialog.dismiss();
                });
            });

            Button neutralButton = dialog.getButton(Dialog.BUTTON_NEUTRAL);
            neutralButton.setOnClickListener(v -> {
                Preferences.setStarredSyncEnabled(true);
                dialog.dismiss();
            });

            Button negativeButton = dialog.getButton(Dialog.BUTTON_NEGATIVE);
            negativeButton.setOnClickListener(v -> {
                Preferences.setStarredSyncEnabled(false);
                if (onCancel != null) onCancel.run();
                dialog.dismiss();
            });
        }
    }
}
