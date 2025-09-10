package com.yuricunha.yumusic.github.utils;

import com.yuricunha.yumusic.BuildConfig;
import com.yuricunha.yumusic.github.models.LatestRelease;

public class UpdateUtil {

    public static boolean showUpdateDialog(LatestRelease release) {
        if (release.getTagName() == null) return false;

        try {
            String[] local = BuildConfig.VERSION_NAME.split("\\.");
            String[] remote = release.getTagName().split("\\.");

            for (int i = 0; i < local.length; i++) {
                int localPart = Integer.parseInt(local[i]);
                int remotePart = Integer.parseInt(remote[i]);

                if (localPart > remotePart) {
                    return false;
                } else if (localPart < remotePart) {
                    return true;
                }
            }
        } catch (Exception exception) {
            return false;
        }

        return false;
    }
}
