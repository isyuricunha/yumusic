package com.yuricunha.yumusic.ui.fragment;

import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.util.UnstableApi;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.yuricunha.yumusic.R;
import com.yuricunha.yumusic.databinding.FragmentPlaylistBinding;
import com.yuricunha.yumusic.interfaces.ClickCallback;
import com.yuricunha.yumusic.interfaces.PlaylistCallback;
import com.yuricunha.yumusic.ui.activity.MainActivity;
import com.yuricunha.yumusic.ui.adapter.PlaylistHorizontalAdapter;
import com.yuricunha.yumusic.ui.dialog.PlaylistEditorDialog;
import com.yuricunha.yumusic.util.Constants;
import com.yuricunha.yumusic.viewmodel.LibraryViewModel;
import com.google.android.material.appbar.MaterialToolbar;

import java.util.Objects;

@UnstableApi
public class PlaylistFragment extends Fragment implements ClickCallback {
    private static final String TAG = "PlaylistFragment";

    private FragmentPlaylistBinding bind;
    private MainActivity activity;
    private LibraryViewModel libraryViewModel;

    private PlaylistHorizontalAdapter playlistHorizontalAdapter;

    private MaterialToolbar materialToolbar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        activity = (MainActivity) getActivity();

        bind = FragmentPlaylistBinding.inflate(inflater, container, false);
        View view = bind.getRoot();
        libraryViewModel = new ViewModelProvider(requireActivity()).get(LibraryViewModel.class);

        init();

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        initAppBar();
        initPlaylistView();
    }

    @Override
    public void onStart() {
        super.onStart();
        activity.setBottomNavigationBarVisibility(true);
    }

    @Override
    public void onResume() {
        super.onResume();
        refreshPlaylistView();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        bind = null;
    }

    private void init() {
        bind.fabAddPlaylist.setOnClickListener(v -> {
            PlaylistEditorDialog dialog = new PlaylistEditorDialog(new PlaylistCallback() {
                @Override
                public void onDismiss() {
                    refreshPlaylistView();
                }
            });
            dialog.show(activity.getSupportFragmentManager(), null);
        });
    }

    private void initAppBar() {
        materialToolbar = bind.getRoot().findViewById(R.id.toolbar);

        activity.setSupportActionBar(materialToolbar);
        Objects.requireNonNull(materialToolbar.getOverflowIcon()).setTint(requireContext().getResources().getColor(R.color.titleTextColor, null));
    }

    private void initPlaylistView() {
        bind.playlistRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        bind.playlistRecyclerView.setHasFixedSize(true);

        playlistHorizontalAdapter = new PlaylistHorizontalAdapter(this);
        bind.playlistRecyclerView.setAdapter(playlistHorizontalAdapter);
        
        libraryViewModel.getPlaylistSample(getViewLifecycleOwner()).observe(getViewLifecycleOwner(), playlists -> {
            if (playlists == null || playlists.isEmpty()) {
                if (bind != null) {
                    bind.playlistSector.setVisibility(View.GONE);
                    bind.emptyPlaylistLayout.setVisibility(View.VISIBLE);
                }
            } else {
                if (bind != null) {
                    bind.playlistSector.setVisibility(View.VISIBLE);
                    bind.emptyPlaylistLayout.setVisibility(View.GONE);
                }
                playlistHorizontalAdapter.setItems(playlists);
            }
        });
    }

    private void refreshPlaylistView() {
        final Handler handler = new Handler();

        final Runnable runnable = () -> {
            if (getView() != null && bind != null && libraryViewModel != null)
                libraryViewModel.refreshPlaylistSample(getViewLifecycleOwner());
        };

        handler.postDelayed(runnable, 100);
    }

    @Override
    public void onPlaylistClick(Bundle bundle) {
        Navigation.findNavController(requireView()).navigate(R.id.playlistPageFragment, bundle);
    }

    @Override
    public void onPlaylistLongClick(Bundle bundle) {
        PlaylistEditorDialog dialog = new PlaylistEditorDialog(new PlaylistCallback() {
            @Override
            public void onDismiss() {
                refreshPlaylistView();
            }
        });

        dialog.setArguments(bundle);
        dialog.show(activity.getSupportFragmentManager(), null);
    }
}
