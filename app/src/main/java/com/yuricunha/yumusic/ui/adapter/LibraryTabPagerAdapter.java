package com.yuricunha.yumusic.ui.adapter;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.yuricunha.yumusic.ui.fragment.library.LibraryAlbumsTabFragment;
import com.yuricunha.yumusic.ui.fragment.library.LibraryPlaylistsTabFragment;
import com.yuricunha.yumusic.ui.fragment.library.LibraryPodcastsTabFragment;

public class LibraryTabPagerAdapter extends FragmentStateAdapter {
    
    public static final int TAB_PLAYLISTS = 0;
    public static final int TAB_PODCASTS = 1;
    public static final int TAB_ALBUMS = 2;
    public static final int TAB_COUNT = 3;

    public LibraryTabPagerAdapter(@NonNull Fragment fragment) {
        super(fragment);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case TAB_PLAYLISTS:
                return new LibraryPlaylistsTabFragment();
            case TAB_PODCASTS:
                return new LibraryPodcastsTabFragment();
            case TAB_ALBUMS:
                return new LibraryAlbumsTabFragment();
            default:
                return new LibraryPlaylistsTabFragment();
        }
    }

    @Override
    public int getItemCount() {
        return TAB_COUNT;
    }
}
