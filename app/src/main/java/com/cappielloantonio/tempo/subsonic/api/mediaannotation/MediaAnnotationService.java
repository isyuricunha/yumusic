package com.cappielloantonio.tempo.subsonic.api.mediaannotation;

import com.cappielloantonio.tempo.subsonic.base.ApiResponse;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;

public interface MediaAnnotationService {
    @GET("star")
    Call<ApiResponse> star(@QueryMap Map<String, String> params, @Query("id") String id, @Query("albumId") String albumId, @Query("artistId") String artistId);

    @GET("unstar")
    Call<ApiResponse> unstar(@QueryMap Map<String, String> params, @Query("id") String id, @Query("albumId") String albumId, @Query("artistId") String artistId);

    @GET("setRating")
    Call<ApiResponse> setRating(@QueryMap Map<String, String> params, @Query("id") String id, @Query("rating") int rating);

    @GET("scrobble")
    Call<ApiResponse> scrobble(@QueryMap Map<String, String> params, @Query("id") String id, @Query("submission") Boolean submission);
}
