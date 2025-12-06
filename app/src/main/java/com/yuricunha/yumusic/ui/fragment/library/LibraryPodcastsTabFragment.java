package com.yuricunha.yumusic.ui.fragment.library;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.media3.common.util.UnstableApi;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.yuricunha.yumusic.R;
import com.yuricunha.yumusic.databinding.FragmentLibraryTabBinding;
import com.yuricunha.yumusic.ui.activity.MainActivity;

@UnstableApi
public class LibraryPodcastsTabFragment extends Fragment {
    private FragmentLibraryTabBinding bind;
    private MainActivity activity;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        activity = (MainActivity) getActivity();
        bind = FragmentLibraryTabBinding.inflate(inflater, container, false);

        initViews();
        return bind.getRoot();
    }

    private void initViews() {
        // Setup RecyclerView
        bind.tabRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        bind.tabRecyclerView.setHasFixedSize(true);

        // TODO: Load podcasts when podcast feature is ready
        bind.tabSortLabel.setText(R.string.library_recents);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        bind = null;
    }
}
