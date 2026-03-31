import { fetch } from '@tauri-apps/plugin-http';
import { writeFile, mkdir, readDir, stat } from '@tauri-apps/plugin-fs';
import { join, downloadDir } from '@tauri-apps/api/path';
import { openPath } from '@tauri-apps/plugin-opener';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { useDownloadStore } from '@/store/downloadStore';
import { SubsonicSong } from '@/hooks/useSubsonic';
import { useConfigStore } from '@/store/configStore';

export async function downloadSong(song: SubsonicSong) {
  const { settings } = useAppSettingsStore.getState();
  const config = useConfigStore.getState().config;
  const { addDownloaded, setDownloading } = useDownloadStore.getState();

  if (!config) return;

  setDownloading(song.id, true);

  try {
    // 1. Determine target directory
    let targetDir = settings.downloadFolder;
    if (!targetDir) {
      targetDir = await downloadDir();
      targetDir = await join(targetDir, 'YuMusic');
    }
    console.log('[Download] Target directory:', targetDir);

    // Ensure the folder exists
    try {
      await mkdir(targetDir, { recursive: true });
    } catch (e) {
      // In case it already exists or fail
    }

    // 2. Build filename
    const ext = settings.downloadFormat === 'flac' ? 'flac' : settings.downloadFormat === 'ogg' ? 'ogg' : 'mp3';
    const safeTitle = song.title.replace(/[<>:"/\\|?*]/g, '');
    const safeArtist = song.artist.replace(/[<>:"/\\|?*]/g, '');
    const fileName = `${safeArtist} - ${safeTitle}.${ext}`;
    const filePath = await join(targetDir, fileName);
    console.log('[Download] Starting download for:', fileName, 'to', filePath);

    // 3. Build Stream/Download URL
    const query = new URLSearchParams({
      u: config.username,
      t: config.token,
      s: config.salt,
      v: '1.16.1',
      c: 'Yumusic',
      id: song.id,
    });

    if (settings.downloadQuality === 'low') query.set('maxBitRate', '96');
    else if (settings.downloadQuality === 'normal') query.set('maxBitRate', '160');
    else if (settings.downloadQuality === 'high') query.set('maxBitRate', '256');
    // very_high = default or 320

    if (settings.downloadFormat !== 'mp3') {
       query.set('format', settings.downloadFormat);
    }

    const baseUrl = config.serverUrl.endsWith('/') ? config.serverUrl : `${config.serverUrl}/`;
    const downloadUrl = `${baseUrl}rest/download?${query.toString()}`;

    // 4. Perform Download
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
    
    const buffer = await response.arrayBuffer();
    
    // 5. Save File
    console.log('[Download] Writing file to disk...');
    await writeFile(filePath, new Uint8Array(buffer));

    // Verify file exists and has size
    try {
      const info = await stat(filePath);
      console.log('[Download] File written successfully. Size:', info.size, 'bytes');
      
      // 6. Track state
      await addDownloaded(song.id, filePath);
    } catch (err) {
      console.error('[Download] Verification failed after write:', err);
      throw new Error('File verification failed');
    }
  } catch (error) {
    console.error('Download error for song', song.id, error);
  } finally {
    setDownloading(song.id, false);
  }
}

export async function downloadPodcastEpisodes(_: string, episodes: SubsonicSong[], limit: number = 5) {
  const episodesToDownload = episodes.slice(0, limit);
  // Download in sequence to avoid network/server overwhelm
  for (const ep of episodesToDownload) {
    await downloadSong(ep);
  }
}

export async function getDownloadPath() {
  const { settings } = useAppSettingsStore.getState();
  let targetDir = settings.downloadFolder;
  if (!targetDir) {
    targetDir = await downloadDir();
    targetDir = await join(targetDir, 'YuMusic');
  }
  return targetDir;
}

export async function openDownloadFolder() {
  const path = await getDownloadPath();
  await openPath(path);
}

export async function calculateTotalDownloadSize(): Promise<number> {
  const path = await getDownloadPath();
  let total = 0;

  async function walk(dir: string) {
    try {
      const entries = await readDir(dir);
      for (const entry of entries) {
        const fullPath = await join(dir, entry.name);
        if (entry.isDirectory) {
          await walk(fullPath);
        } else {
          const s = await stat(fullPath);
          total += s.size;
        }
      }
    } catch (e) {
      // Folder might not exist yet
    }
  }

  await walk(path);
  return total;
}

