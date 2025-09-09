package com.cappielloantonio.tempo.ui.dialog;

import android.app.Dialog;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.DialogFragment;
import androidx.media3.common.MediaMetadata;

import com.cappielloantonio.tempo.R;
import com.cappielloantonio.tempo.databinding.DialogTrackInfoBinding;
import com.cappielloantonio.tempo.glide.CustomGlideRequest;
import com.cappielloantonio.tempo.util.Constants;
import com.cappielloantonio.tempo.util.MusicUtil;
import com.cappielloantonio.tempo.util.Preferences;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.Objects;

public class TrackInfoDialog extends DialogFragment {
    private DialogTrackInfoBinding bind;

    private final MediaMetadata mediaMetadata;

    public TrackInfoDialog(MediaMetadata mediaMetadata) {
        this.mediaMetadata = mediaMetadata;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        bind = DialogTrackInfoBinding.inflate(getLayoutInflater());

        return new MaterialAlertDialogBuilder(requireActivity())
                .setView(bind.getRoot())
                .setPositiveButton(R.string.track_info_dialog_positive_button, (dialog, id) -> dialog.cancel())
                .create();
    }

    @Override
    public void onStart() {
        super.onStart();

        setTrackInfo();
        setTrackTranscodingInfo();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        bind = null;
    }

    private void setTrackInfo() {
        bind.trakTitleInfoTextView.setText(mediaMetadata.title);
        bind.trakArtistInfoTextView.setText(
                mediaMetadata.artist != null
                        ? mediaMetadata.artist
                        : mediaMetadata.extras != null && Objects.equals(mediaMetadata.extras.getString("type"), Constants.MEDIA_TYPE_RADIO)
                        ? mediaMetadata.extras.getString("uri", getString(R.string.label_placeholder))
                        : "");

        if (mediaMetadata.extras != null) {
            CustomGlideRequest.Builder
                    .from(requireContext(), mediaMetadata.extras.getString("coverArtId", ""), CustomGlideRequest.ResourceType.Song)
                    .build()
                    .into(bind.trackCoverInfoImageView);

            bind.titleValueSector.setText(mediaMetadata.extras.getString("title", getString(R.string.label_placeholder)));
            bind.albumValueSector.setText(mediaMetadata.extras.getString("album", getString(R.string.label_placeholder)));
            bind.artistValueSector.setText(mediaMetadata.extras.getString("artist", getString(R.string.label_placeholder)));
            bind.trackNumberValueSector.setText(mediaMetadata.extras.getInt("track", 0) != 0 ? String.valueOf(mediaMetadata.extras.getInt("track", 0)) : getString(R.string.label_placeholder));
            bind.yearValueSector.setText(mediaMetadata.extras.getInt("year", 0) != 0 ? String.valueOf(mediaMetadata.extras.getInt("year", 0)) : getString(R.string.label_placeholder));
            bind.genreValueSector.setText(mediaMetadata.extras.getString("genre", getString(R.string.label_placeholder)));
            bind.sizeValueSector.setText(mediaMetadata.extras.getLong("size", 0) != 0 ? MusicUtil.getReadableByteCount(mediaMetadata.extras.getLong("size", 0)) : getString(R.string.label_placeholder));
            bind.contentTypeValueSector.setText(mediaMetadata.extras.getString("contentType", getString(R.string.label_placeholder)));
            bind.suffixValueSector.setText(mediaMetadata.extras.getString("suffix", getString(R.string.label_placeholder)));
            bind.transcodedContentTypeValueSector.setText(mediaMetadata.extras.getString("transcodedContentType", getString(R.string.label_placeholder)));
            bind.transcodedSuffixValueSector.setText(mediaMetadata.extras.getString("transcodedSuffix", getString(R.string.label_placeholder)));
            bind.durationValueSector.setText(mediaMetadata.extras.getInt("duration", 0) != 0 ? MusicUtil.getReadableDurationString(mediaMetadata.extras.getInt("duration", 0), false) : getString(R.string.label_placeholder));
            bind.bitrateValueSector.setText(mediaMetadata.extras.getInt("bitrate", 0) != 0 ? mediaMetadata.extras.getInt("bitrate", 0) + " kbps" : getString(R.string.label_placeholder));
            bind.samplingRateValueSector.setText(mediaMetadata.extras.getInt("samplingRate", 0) != 0 ? mediaMetadata.extras.getInt("samplingRate", 0) + " Hz" : getString(R.string.label_placeholder));
            bind.bitDepthValueSector.setText(mediaMetadata.extras.getInt("bitDepth", 0) != 0 ? mediaMetadata.extras.getInt("bitDepth", 0) + " bits" : getString(R.string.label_placeholder));
            bind.pathValueSector.setText(mediaMetadata.extras.getString("path", getString(R.string.label_placeholder)));
            bind.discNumberValueSector.setText(mediaMetadata.extras.getInt("discNumber", 0) != 0 ? String.valueOf(mediaMetadata.extras.getInt("discNumber", 0)) : getString(R.string.label_placeholder));
        }
    }

    private void setTrackTranscodingInfo() {
        StringBuilder info = new StringBuilder();

        boolean prioritizeServerTranscoding = Preferences.isServerPrioritized();

        String transcodingExtension = MusicUtil.getTranscodingFormatPreference();
        String transcodingBitrate = Integer.parseInt(MusicUtil.getBitratePreference()) != 0 ? Integer.parseInt(MusicUtil.getBitratePreference()) + "kbps" : "Original";

        if (mediaMetadata.extras != null && mediaMetadata.extras.getString("uri", "").contains(Constants.DOWNLOAD_URI)) {
            info.append(getString(R.string.track_info_summary_downloaded_file));

            bind.trakTranscodingInfoTextView.setText(info);
            return;
        }

        if (prioritizeServerTranscoding) {
            info.append(getString(R.string.track_info_summary_server_prioritized));

            bind.trakTranscodingInfoTextView.setText(info);
            return;
        }

        if (!prioritizeServerTranscoding && transcodingExtension.equals("raw") && transcodingBitrate.equals("Original")) {
            info.append(getString(R.string.track_info_summary_original_file));

            bind.trakTranscodingInfoTextView.setText(info);
            return;
        }

        if (!prioritizeServerTranscoding && !transcodingExtension.equals("raw") && transcodingBitrate.equals("Original")) {
            info.append(getString(R.string.track_info_summary_transcoding_codec, transcodingExtension));

            bind.trakTranscodingInfoTextView.setText(info);
            return;
        }

        if (!prioritizeServerTranscoding && transcodingExtension.equals("raw") && !transcodingBitrate.equals("Original")) {
            info.append(getString(R.string.track_info_summary_transcoding_bitrate, transcodingBitrate));

            bind.trakTranscodingInfoTextView.setText(info);
            return;
        }

        if (!prioritizeServerTranscoding && !transcodingExtension.equals("raw") && !transcodingBitrate.equals("Original")) {
            info.append(getString(R.string.track_info_summary_full_transcode, transcodingExtension, transcodingBitrate));

            bind.trakTranscodingInfoTextView.setText(info);
        }
    }
}
