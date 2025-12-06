package com.yuricunha.yumusic.ui.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.media3.common.util.UnstableApi;
import androidx.navigation.Navigation;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.yuricunha.yumusic.R;
import com.yuricunha.yumusic.databinding.FragmentLibraryBinding;
import com.yuricunha.yumusic.ui.activity.MainActivity;
import com.yuricunha.yumusic.ui.adapter.LibraryTabPagerAdapter;

@UnstableApi
public class LibraryFragment extends Fragment {
    private static final String TAG = "LibraryFragment";

    private FragmentLibraryBinding bind;
    private MainActivity activity;
    private LibraryTabPagerAdapter pagerAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        activity = (MainActivity) getActivity();

        bind = FragmentLibraryBinding.inflate(inflater, container, false);
        View view = bind.getRoot();

        setupHeader();
        setupTabsAndViewPager();

        return view;
    }

    @Override
    public void onStart() {
        super.onStart();
        activity.setBottomNavigationBarVisibility(true);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        bind = null;
    }

    private void setupHeader() {
        // Search button click
        bind.libraryHeader.librarySearchButton.setOnClickListener(v -> {
            Navigation.findNavController(requireView()).navigate(R.id.searchFragment);
        });

        // Add button click (can open menu for creating playlist/adding podcast)
        bind.libraryHeader.libraryAddButton.setOnClickListener(v -> {
            // TODO: Show menu with options (Create Playlist, Add Podcast, etc.)
            // For now, navigate to playlist catalogue
            Navigation.findNavController(requireView()).navigate(R.id.action_libraryFragment_to_playlistCatalogueFragment);
        });
    }

    private void setupTabsAndViewPager() {
        // Setup ViewPager2
        pagerAdapter = new LibraryTabPagerAdapter(this);
        bind.libraryViewpager.setAdapter(pagerAdapter);

        // Setup TabLayout with ViewPager2
        new TabLayoutMediator(bind.libraryTabs, bind.libraryViewpager,
                (tab, position) -> {
                    switch (position) {
                        case LibraryTabPagerAdapter.TAB_PLAYLISTS:
                            tab.setText(R.string.library_tab_playlists);
                            break;
                        case LibraryTabPagerAdapter.TAB_PODCASTS:
                            tab.setText(R.string.library_tab_podcasts);
                            break;
                        case LibraryTabPagerAdapter.TAB_ALBUMS:
                            tab.setText(R.string.library_tab_albums);
                            break;
                    }
                }
        ).attach();
    }
}
