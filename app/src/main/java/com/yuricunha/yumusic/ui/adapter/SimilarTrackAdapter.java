package com.yuricunha.yumusic.ui.adapter;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.yuricunha.yumusic.databinding.ItemHomeSimilarTrackBinding;
import com.yuricunha.yumusic.glide.CustomGlideRequest;
import com.yuricunha.yumusic.interfaces.ClickCallback;
import com.yuricunha.yumusic.subsonic.models.Child;
import com.yuricunha.yumusic.util.Constants;
import com.yuricunha.yumusic.util.MusicUtil;

import java.util.Collections;
import java.util.List;

public class SimilarTrackAdapter extends RecyclerView.Adapter<SimilarTrackAdapter.ViewHolder> {
    private final ClickCallback click;

    private List<Child> songs;

    public SimilarTrackAdapter(ClickCallback click) {
        this.click = click;
        this.songs = Collections.emptyList();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemHomeSimilarTrackBinding view = ItemHomeSimilarTrackBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Child song = songs.get(position);

        holder.item.titleTrackLabel.setText(song.getTitle());

        CustomGlideRequest.Builder
                .from(holder.itemView.getContext(), song.getCoverArtId(), CustomGlideRequest.ResourceType.Song)
                .build()
                .into(holder.item.trackCoverImageView);
    }

    @Override
    public int getItemCount() {
        return songs.size();
    }

    public Child getItem(int position) {
        return songs.get(position);
    }

    public void setItems(List<Child> songs) {
        this.songs = songs;
        notifyDataSetChanged();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ItemHomeSimilarTrackBinding item;

        ViewHolder(ItemHomeSimilarTrackBinding item) {
            super(item.getRoot());

            this.item = item;

            itemView.setOnClickListener(v -> onClick());
            itemView.setOnLongClickListener(v -> onLongClick());
        }

        public void onClick() {
            Bundle bundle = new Bundle();
            bundle.putParcelable(Constants.TRACK_OBJECT, songs.get(getBindingAdapterPosition()));
            bundle.putBoolean(Constants.MEDIA_MIX, true);

            click.onMediaClick(bundle);
        }

        public boolean onLongClick() {
            Bundle bundle = new Bundle();
            bundle.putParcelable(Constants.TRACK_OBJECT, songs.get(getBindingAdapterPosition()));

            click.onMediaLongClick(bundle);

            return true;
        }
    }
}
