package com.yuricunha.yumusic.ui.dialog;

import android.app.Dialog;
import android.os.Bundle;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.OptIn;
import androidx.fragment.app.DialogFragment;
import androidx.media3.common.util.UnstableApi;

import com.yuricunha.yumusic.R;
import com.yuricunha.yumusic.databinding.DialogDownloadDirectoryBinding;
import com.yuricunha.yumusic.interfaces.DialogClickCallback;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

@OptIn(markerClass = UnstableApi.class)
public class DownloadDirectoryDialog extends DialogFragment {
    private final DialogClickCallback dialogClickCallback;

    public DownloadDirectoryDialog(DialogClickCallback dialogClickCallback) {
        this.dialogClickCallback = dialogClickCallback;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        DialogDownloadDirectoryBinding bind = DialogDownloadDirectoryBinding.inflate(getLayoutInflater());

        return new MaterialAlertDialogBuilder(requireContext())
                .setView(bind.getRoot())
                .setTitle(R.string.download_directory_dialog_title)
                .setPositiveButton(R.string.download_directory_dialog_positive_button, null)
                .setNegativeButton(R.string.download_directory_dialog_negative_button, null)
                .create();
    }

    @Override
    public void onResume() {
        super.onResume();
        setButtonAction();
    }

    private void setButtonAction() {
        androidx.appcompat.app.AlertDialog dialog = (androidx.appcompat.app.AlertDialog) getDialog();

        if (dialog != null) {
            Button positiveButton = dialog.getButton(Dialog.BUTTON_POSITIVE);
            positiveButton.setOnClickListener(v -> {
                dialogClickCallback.onPositiveClick();
                dialog.dismiss();
            });

            Button negativeButton = dialog.getButton(Dialog.BUTTON_NEGATIVE);
            negativeButton.setOnClickListener(v -> {
                dialogClickCallback.onNegativeClick();
                dialog.dismiss();
            });
        }
    }
}
