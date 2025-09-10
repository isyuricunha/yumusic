package com.yuricunha.yumusic.ui.adapter;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.yuricunha.yumusic.databinding.ItemHorizontalPodcastChannelBinding;
import com.yuricunha.yumusic.glide.CustomGlideRequest;
import com.yuricunha.yumusic.interfaces.ClickCallback;
import com.yuricunha.yumusic.subsonic.models.PodcastChannel;
import com.yuricunha.yumusic.util.Constants;
import com.yuricunha.yumusic.util.MusicUtil;

import java.util.Collections;
import java.util.List;

public class PodcastChannelHorizontalAdapter extends RecyclerView.Adapter<PodcastChannelHorizontalAdapter.ViewHolder> {
    private final ClickCallback click;

    private List<PodcastChannel> podcastChannels;

    public PodcastChannelHorizontalAdapter(ClickCallback click) {
        this.click = click;
        this.podcastChannels = Collections.emptyList();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemHorizontalPodcastChannelBinding view = ItemHorizontalPodcastChannelBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        PodcastChannel podcastChannel = podcastChannels.get(position);

        holder.item.podcastChannelTitleTextView.setText(podcastChannel.getTitle());
        holder.item.podcastChannelDescriptionTextView.setText(MusicUtil.getReadableString(podcastChannel.getDescription()));

        CustomGlideRequest.Builder
                .from(holder.itemView.getContext(), podcastChannel.getCoverArtId(), CustomGlideRequest.ResourceType.Podcast)
                .build()
                .into(holder.item.podcastChannelCoverImageView);
    }

    @Override
    public int getItemCount() {
        return podcastChannels.size();
    }

    public void setItems(List<PodcastChannel> podcastChannels) {
        this.podcastChannels = podcastChannels;
        notifyDataSetChanged();
    }

    public PodcastChannel getItem(int id) {
        return podcastChannels.get(id);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ItemHorizontalPodcastChannelBinding item;

        ViewHolder(ItemHorizontalPodcastChannelBinding item) {
            super(item.getRoot());

            this.item = item;

            item.podcastChannelTitleTextView.setSelected(true);
            item.podcastChannelDescriptionTextView.setSelected(true);

            itemView.setOnClickListener(v -> onClick());
            itemView.setOnLongClickListener(v -> onLongClick());

            item.podcastChannelMoreButton.setOnClickListener(v -> onLongClick());
        }

        private void onClick() {
            Bundle bundle = new Bundle();
            bundle.putParcelable(Constants.PODCAST_CHANNEL_OBJECT, podcastChannels.get(getBindingAdapterPosition()));

            click.onPodcastChannelClick(bundle);
        }

        private boolean onLongClick() {
            Bundle bundle = new Bundle();
            bundle.putParcelable(Constants.PODCAST_CHANNEL_OBJECT, podcastChannels.get(getBindingAdapterPosition()));

            click.onPodcastChannelLongClick(bundle);

            return true;
        }
    }
}
