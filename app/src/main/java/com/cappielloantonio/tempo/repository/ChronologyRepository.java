package com.cappielloantonio.tempo.repository;

import androidx.lifecycle.LiveData;

import com.cappielloantonio.tempo.database.AppDatabase;
import com.cappielloantonio.tempo.database.dao.ChronologyDao;
import com.cappielloantonio.tempo.model.Chronology;

import java.util.Calendar;
import java.util.List;

public class ChronologyRepository {
    private final ChronologyDao chronologyDao = AppDatabase.getInstance().chronologyDao();

    public LiveData<List<Chronology>> getChronology(String server, long start, long end) {
        return chronologyDao.getAllFrom(start, end, server);
    }

    public void insert(Chronology item) {
        InsertThreadSafe insert = new InsertThreadSafe(chronologyDao, item);
        Thread thread = new Thread(insert);
        thread.start();
    }

    private static class InsertThreadSafe implements Runnable {
        private final ChronologyDao chronologyDao;
        private final Chronology item;

        public InsertThreadSafe(ChronologyDao chronologyDao, Chronology item) {
            this.chronologyDao = chronologyDao;
            this.item = item;
        }

        @Override
        public void run() {
            chronologyDao.insert(item);
        }
    }
}
