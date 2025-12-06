package com.yuricunha.yumusic.ui.fragment.library;

import android.os.Bundle;
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
import com.yuricunha.yumusic.databinding.FragmentLibraryTabBinding;
import com.yuricunha.yumusic.interfaces.ClickCallback;
import com.yuricunha.yumusic.ui.activity.MainActivity;
import com.yuricunha.yumusic.ui.adapter.PlaylistHorizontalAdapter;
import com.yuricunha.yumusic.viewmodel.LibraryViewModel;

@UnstableApi
public class LibraryPlaylistsTabFragment extends Fragment implements ClickCallback {
    private FragmentLibraryTabBinding bind;
    private MainActivity activity;
    private LibraryViewModel libraryViewModel;
    private PlaylistHorizontalAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        activity = (MainActivity) getActivity();
        bind = FragmentLibraryTabBinding.inflate(inflater, container, false);
        libraryViewModel = new ViewModelProvider(requireActivity()).get(LibraryViewModel.class);

        initViews();
        return bind.getRoot();
    }

    private void initViews() {
        // Setup RecyclerView
        bind.tabRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        bind.tabRecyclerView.setHasFixedSize(true);

        adapter = new PlaylistHorizontalAdapter(this);
        bind.tabRecyclerView.setAdapter(adapter);

        // Load playlists
        libraryViewModel.getPlaylistSample(getViewLifecycleOwner()).observe(getViewLifecycleOwner(), playlists -> {
            if (playlists != null && !playlists.isEmpty()) {
                adapter.setItems(playlists);
            }
        });

        // Setup sort/filter controls
        bind.tabSortLabel.setText(R.string.library_recents);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        bind = null;
    }

    @Override
    public void onPlaylistClick(Bundle bundle) {
        Navigation.findNavController(requireView()).navigate(R.id.playlistPageFragment, bundle);
    }

    @Override
    public void onPlaylistLongClick(Bundle bundle) {
        // Handle long click if needed
    }
}
