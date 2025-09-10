package com.yuricunha.yumusic.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.yuricunha.yumusic.model.RecentSearch;
import com.yuricunha.yumusic.repository.SearchingRepository;
import com.yuricunha.yumusic.subsonic.models.SearchResult2;
import com.yuricunha.yumusic.subsonic.models.SearchResult3;

import java.util.ArrayList;
import java.util.List;

public class SearchViewModel extends AndroidViewModel {
    private static final String TAG = "SearchViewModel";

    private String query = "";

    private final SearchingRepository searchingRepository;

    public SearchViewModel(@NonNull Application application) {
        super(application);

        searchingRepository = new SearchingRepository();
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;

        if (!query.isEmpty()) {
            insertNewSearch(query);
        }
    }

    public LiveData<SearchResult2> search2(String title) {
        return searchingRepository.search2(title);
    }

    public LiveData<SearchResult3> search3(String title) {
        return searchingRepository.search3(title);
    }

    public void insertNewSearch(String search) {
        searchingRepository.insert(new RecentSearch(search));
    }

    public void deleteRecentSearch(String search) {
        searchingRepository.delete(new RecentSearch(search));
    }

    public LiveData<List<String>> getSearchSuggestion(String query) {
        return searchingRepository.getSuggestions(query);
    }

    public List<String> getRecentSearchSuggestion() {
        ArrayList<String> suggestions = new ArrayList<>();
        suggestions.addAll(searchingRepository.getRecentSearchSuggestion());

        return suggestions;
    }
}
