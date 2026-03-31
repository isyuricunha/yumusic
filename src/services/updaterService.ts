import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

/** Returns an update object if one is available, or null if already up-to-date. */
export async function checkForUpdate(): Promise<Update | null> {
  try {
    const update = await check();
    return update ?? null;
  } catch (err) {
    console.warn('[updater] check failed:', err);
    return null;
  }
}

/**
 * Downloads the update and installs it, then relaunches the app.
 * The `onProgress` callback receives bytes downloaded and total bytes.
 */
export async function downloadAndInstall(
  update: Update,
  onProgress?: (downloaded: number, total: number | null) => void,
): Promise<void> {
  let downloaded = 0;
  await update.downloadAndInstall((event) => {
    if (event.event === 'Started') {
      downloaded = 0;
      onProgress?.(0, event.data.contentLength ?? null);
    } else if (event.event === 'Progress') {
      downloaded += event.data.chunkLength;
      onProgress?.(downloaded, null);
    }
  });
  await relaunch();
}
