package com.yuricunha.yumusic.ui.fragment;

import android.content.ComponentName;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupMenu;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.session.MediaBrowser;
import androidx.media3.session.SessionToken;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.yuricunha.yumusic.R;
import com.yuricunha.yumusic.databinding.FragmentPodcastChannelPageBinding;
import com.yuricunha.yumusic.interfaces.ClickCallback;
import com.yuricunha.yumusic.service.MediaManager;
import com.yuricunha.yumusic.service.MediaService;
import com.yuricunha.yumusic.subsonic.models.PodcastEpisode;
import com.yuricunha.yumusic.ui.activity.MainActivity;
import com.yuricunha.yumusic.ui.adapter.PodcastEpisodeAdapter;
import com.yuricunha.yumusic.util.Constants;
import com.yuricunha.yumusic.util.MusicUtil;
import com.yuricunha.yumusic.util.UIUtil;
import com.yuricunha.yumusic.viewmodel.PodcastChannelPageViewModel;
import com.google.android.material.snackbar.Snackbar;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.List;

@UnstableApi
public class PodcastChannelPageFragment extends Fragment implements ClickCallback {
    private FragmentPodcastChannelPageBinding bind;
    private MainActivity activity;
    private PodcastChannelPageViewModel podcastChannelPageViewModel;

    private PodcastEpisodeAdapter podcastEpisodeAdapter;

    private ListenableFuture<MediaBrowser> mediaBrowserListenableFuture;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        activity = (MainActivity) getActivity();

        bind = FragmentPodcastChannelPageBinding.inflate(inflater, container, false);
        View view = bind.getRoot();
        podcastChannelPageViewModel = new ViewModelProvider(requireActivity()).get(PodcastChannelPageViewModel.class);

        init();
        initAppBar();
        initPodcastChannelInfo();
        initPodcastChannelEpisodesView();

        return view;
    }

    @Override
    public void onStart() {
        super.onStart();

        initializeMediaBrowser();
    }

    @Override
    public void onStop() {
        releaseMediaBrowser();
        super.onStop();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        bind = null;
    }

    private void init() {
        podcastChannelPageViewModel.setPodcastChannel(requireArguments().getParcelable(Constants.PODCAST_CHANNEL_OBJECT));
    }

    private void initAppBar() {
        activity.setSupportActionBar(bind.toolbar);

        if (activity.getSupportActionBar() != null) {
            activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            activity.getSupportActionBar().setDisplayShowHomeEnabled(true);
        }

        bind.toolbar.setTitle(podcastChannelPageViewModel.getPodcastChannel().getTitle());
        bind.toolbar.setNavigationOnClickListener(v -> activity.navController.navigateUp());
        bind.toolbar.setTitle(podcastChannelPageViewModel.getPodcastChannel().getTitle());
    }

    private void initPodcastChannelInfo() {
        String normalizePodcastChannelDescription = MusicUtil.forceReadableString(podcastChannelPageViewModel.getPodcastChannel().getDescription());

        if (bind != null) {
            bind.podcastChannelDescriptionTextView.setVisibility(!normalizePodcastChannelDescription.trim().isEmpty() ? View.VISIBLE : View.GONE);
            bind.podcastChannelDescriptionTextView.setText(normalizePodcastChannelDescription);
            bind.podcastEpisodesFilterImageView.setOnClickListener(view -> showPopupMenu(view, R.menu.filter_podcast_episode_popup_menu));
        }
    }

    private void initPodcastChannelEpisodesView() {
        bind.podcastEpisodesRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        bind.podcastEpisodesRecyclerView.addItemDecoration(UIUtil.getDividerItemDecoration(requireContext()));

        podcastEpisodeAdapter = new PodcastEpisodeAdapter(this);
        bind.podcastEpisodesRecyclerView.setAdapter(podcastEpisodeAdapter);
        podcastChannelPageViewModel.getPodcastChannelEpisodes().observe(getViewLifecycleOwner(), channels -> {
            if (channels == null) {
                if (bind != null) {
                    bind.podcastEpisodesRecyclerView.setVisibility(View.GONE);
                }
            } else {
                if (bind != null) {
                    bind.podcastEpisodesRecyclerView.setVisibility(View.VISIBLE);
                }

                if (!channels.isEmpty() && channels.get(0) != null && channels.get(0).getEpisodes() != null) {
                    List<PodcastEpisode> availableEpisode = channels.get(0).getEpisodes();

                    if (bind != null && availableEpisode != null) {
                        bind.podcastEpisodesRecyclerView.setVisibility(availableEpisode.isEmpty() ? View.GONE : View.VISIBLE);
                        podcastEpisodeAdapter.setItems(availableEpisode);
                    }
                }
            }
        });
    }

    private void initializeMediaBrowser() {
        mediaBrowserListenableFuture = new MediaBrowser.Builder(requireContext(), new SessionToken(requireContext(), new ComponentName(requireContext(), MediaService.class))).buildAsync();
    }

    private void releaseMediaBrowser() {
        MediaBrowser.releaseFuture(mediaBrowserListenableFuture);
    }

    private void showPopupMenu(View view, int menuResource) {
        PopupMenu popup = new PopupMenu(requireContext(), view);
        popup.getMenuInflater().inflate(menuResource, popup.getMenu());

        popup.setOnMenuItemClickListener(menuItem -> {
            if (menuItem.getItemId() == R.id.menu_podcast_filter_download) {
                podcastEpisodeAdapter.sort(Constants.PODCAST_FILTER_BY_DOWNLOAD);
                return true;
            } else if (menuItem.getItemId() == R.id.menu_podcast_filter_all) {
                podcastEpisodeAdapter.sort(Constants.PODCAST_FILTER_BY_ALL);
                return true;
            }

            return false;
        });

        popup.show();
    }

    @Override
    public void onPodcastEpisodeClick(Bundle bundle) {
        MediaManager.startPodcast(mediaBrowserListenableFuture, bundle.getParcelable(Constants.PODCAST_OBJECT));
        activity.setBottomSheetInPeek(true);
    }

    @Override
    public void onPodcastEpisodeLongClick(Bundle bundle) {
        Navigation.findNavController(requireView()).navigate(R.id.podcastEpisodeBottomSheetDialog, bundle);
    }

    @Override
    public void onPodcastEpisodeAltClick(Bundle bundle) {
        PodcastEpisode episode = bundle.getParcelable(Constants.PODCAST_OBJECT);
        podcastChannelPageViewModel.requestPodcastEpisodeDownload(episode);

        Snackbar.make(requireView(), R.string.podcast_episode_download_request_snackbar, Snackbar.LENGTH_SHORT)
                .setAnchorView(activity.bind.bottomNavigation)
                .show();
    }
}
