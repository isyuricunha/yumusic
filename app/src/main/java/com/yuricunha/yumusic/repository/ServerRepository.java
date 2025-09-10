package com.yuricunha.yumusic.repository;

import androidx.lifecycle.LiveData;

import com.yuricunha.yumusic.database.AppDatabase;
import com.yuricunha.yumusic.database.dao.ServerDao;
import com.yuricunha.yumusic.model.Server;

import java.util.List;

public class ServerRepository {
    private static final String TAG = "QueueRepository";

    private final ServerDao serverDao = AppDatabase.getInstance().serverDao();

    public LiveData<List<Server>> getLiveServer() {
        return serverDao.getAll();
    }

    public void insert(Server server) {
        InsertThreadSafe insert = new InsertThreadSafe(serverDao, server);
        Thread thread = new Thread(insert);
        thread.start();
    }

    public void delete(Server server) {
        DeleteThreadSafe delete = new DeleteThreadSafe(serverDao, server);
        Thread thread = new Thread(delete);
        thread.start();
    }

    private static class InsertThreadSafe implements Runnable {
        private final ServerDao serverDao;
        private final Server server;

        public InsertThreadSafe(ServerDao serverDao, Server server) {
            this.serverDao = serverDao;
            this.server = server;
        }

        @Override
        public void run() {
            serverDao.insert(server);
        }
    }

    private static class DeleteThreadSafe implements Runnable {
        private final ServerDao serverDao;
        private final Server server;

        public DeleteThreadSafe(ServerDao serverDao, Server server) {
            this.serverDao = serverDao;
            this.server = server;
        }

        @Override
        public void run() {
            serverDao.delete(server);
        }
    }
}
