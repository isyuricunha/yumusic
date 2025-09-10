package com.yuricunha.yumusic.database;

import androidx.media3.common.util.UnstableApi;
import androidx.room.AutoMigration;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.yuricunha.yumusic.App;
import com.yuricunha.yumusic.database.converter.DateConverters;
import com.yuricunha.yumusic.database.dao.ChronologyDao;
import com.yuricunha.yumusic.database.dao.DownloadDao;
import com.yuricunha.yumusic.database.dao.FavoriteDao;
import com.yuricunha.yumusic.database.dao.PlaylistDao;
import com.yuricunha.yumusic.database.dao.QueueDao;
import com.yuricunha.yumusic.database.dao.RecentSearchDao;
import com.yuricunha.yumusic.database.dao.ServerDao;
import com.yuricunha.yumusic.database.dao.SessionMediaItemDao;
import com.yuricunha.yumusic.model.Chronology;
import com.yuricunha.yumusic.model.Download;
import com.yuricunha.yumusic.model.Favorite;
import com.yuricunha.yumusic.model.Queue;
import com.yuricunha.yumusic.model.RecentSearch;
import com.yuricunha.yumusic.model.Server;
import com.yuricunha.yumusic.model.SessionMediaItem;
import com.yuricunha.yumusic.subsonic.models.Playlist;

@UnstableApi
@Database(
        version = 11,
        entities = {Queue.class, Server.class, RecentSearch.class, Download.class, Chronology.class, Favorite.class, SessionMediaItem.class, Playlist.class},
        autoMigrations = {@AutoMigration(from = 10, to = 11)}
)
@TypeConverters({DateConverters.class})
public abstract class AppDatabase extends RoomDatabase {
    private final static String DB_NAME = "tempo_db";
    private static AppDatabase instance;

    public static synchronized AppDatabase getInstance() {
        if (instance == null) {
            instance = Room.databaseBuilder(App.getContext(), AppDatabase.class, DB_NAME)
                    .fallbackToDestructiveMigration()
                    .build();
        }

        return instance;
    }

    public abstract QueueDao queueDao();

    public abstract ServerDao serverDao();

    public abstract RecentSearchDao recentSearchDao();

    public abstract DownloadDao downloadDao();

    public abstract ChronologyDao chronologyDao();

    public abstract FavoriteDao favoriteDao();

    public abstract SessionMediaItemDao sessionMediaItemDao();

    public abstract PlaylistDao playlistDao();
}
