import { useState } from 'react';
import { useThemeStore, Theme } from '@/store/themeStore';
import { useConfigStore } from '@/store/configStore';
import { useAppSettingsStore, type UpdateMode, type DownloadQuality, type DownloadFormat } from '@/store/appSettingsStore';
import { useDialogStore } from '@/store/dialogStore';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Palette, Server, RefreshCw, BellRing, AppWindow, DownloadCloud, FolderOpen } from 'lucide-react';
import { checkForUpdate, downloadAndInstall } from '@/services/updaterService';
import type { Update } from '@tauri-apps/plugin-updater';
import { open } from '@tauri-apps/plugin-dialog';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const config = useConfigStore((state) => state.config);
  const {
    settings,
    setUpdateMode,
    setCloseToTray,
    setLaunchOnStartup,
    setDownloadQuality,
    setDownloadFormat,
    setDownloadFolder,
    setDownloadAlbums,
    setDownloadPlaylists,
    setDownloadPodcasts,
    setAutoDownloadLiked,
  } = useAppSettingsStore();
  const openDialog = useDialogStore((state) => state.openDialog);

  const [checkStatus, setCheckStatus] = useState<'idle' | 'checking' | 'available' | 'uptodate' | 'error'>('idle');
  const [updateInfo, setUpdateInfo] = useState<string>('');
  const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);
  const [installing, setInstalling] = useState(false);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const handleCheckNow = async () => {
    setCheckStatus('checking');
    setUpdateInfo('');
    setPendingUpdate(null);
    try {
      const update = await checkForUpdate();
      if (update) {
        setCheckStatus('available');
        setUpdateInfo(`Version ${update.version} is available.`);
        setPendingUpdate(update);
      } else {
        setCheckStatus('uptodate');
        setUpdateInfo('You are on the latest version.');
      }
    } catch {
      setCheckStatus('error');
      setUpdateInfo('Failed to check for updates.');
    }
  };

  const handleInstallUpdate = async () => {
    if (!pendingUpdate) return;
    setInstalling(true);
    try {
      await downloadAndInstall(pendingUpdate);
    } catch {
      setInstalling(false);
    }
  };

  const handleLogout = async () => {
    const confirmed = await openDialog({
      title: t('settings.logout_confirm_title', 'Sign out'),
      description: t('settings.logout_confirm', 'Are you sure you want to sign out? Your server settings will be cleared.'),
      confirmText: t('common.logout', 'Sign out'),
      destructive: true,
    });
    if (confirmed) {
      useConfigStore.getState().clearConfig();
    }
  };

  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Download Folder',
      });
      if (typeof selected === 'string') {
        setDownloadFolder(selected);
      }
    } catch (err) {
      console.error('Failed to open directory picker:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8 pb-12">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.settings')}</h1>

      <div className="grid gap-6">
        {/* ── Appearance ─────────────────────────────────────────────────── */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>{t('settings.appearance')}</CardTitle>
            </div>
            <CardDescription>{t('settings.appearance_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{t('settings.theme')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.theme_desc')}</div>
              </div>
              <Select value={theme} onValueChange={(v) => v && setTheme(v as Theme)}>
                <SelectTrigger className="w-40 bg-muted/50 border-transparent text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">True Dark</SelectItem>
                  <SelectItem value="theme-catppuccin">Catppuccin</SelectItem>
                  <SelectItem value="theme-nord">Nord</SelectItem>
                  <SelectItem value="theme-spotify">Spotify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{t('settings.language')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.language_desc')}</div>
              </div>
              <Select value={i18n.language} onValueChange={(v) => v && handleLanguageChange(v)}>
                <SelectTrigger className="w-40 bg-muted/50 border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt-BR">Português (BR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ── Updates ─────────────────────────────────────────────────────── */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BellRing className="h-5 w-5 text-primary" />
              <CardTitle>Updates</CardTitle>
            </div>
            <CardDescription>Control how YuMusic handles new versions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Update behavior</div>
                <div className="text-xs text-muted-foreground">
                  What happens when a new version is available.
                </div>
              </div>
              <Select
                value={settings.updateMode}
                onValueChange={(v) => v && setUpdateMode(v as UpdateMode)}
              >
                <SelectTrigger className="w-44 bg-muted/50 border-transparent text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto install</SelectItem>
                  <SelectItem value="notify">Notify only</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Check for updates</div>
                {checkStatus !== 'idle' && (
                  <div
                    className={`text-xs ${
                      checkStatus === 'available'
                        ? 'text-primary'
                        : checkStatus === 'error'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {updateInfo || (checkStatus === 'checking' ? 'Checking…' : '')}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {checkStatus === 'available' && !installing && (
                  <Button size="sm" onClick={handleInstallUpdate} className="text-xs">
                    Install now
                  </Button>
                )}
                {installing && (
                  <span className="text-xs text-muted-foreground">Installing…</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCheckNow}
                  disabled={checkStatus === 'checking' || installing}
                  className="gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${checkStatus === 'checking' ? 'animate-spin' : ''}`} />
                  Check now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── System ──────────────────────────────────────────────────────── */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AppWindow className="h-5 w-5 text-primary" />
              <CardTitle>System</CardTitle>
            </div>
            <CardDescription>Window and startup behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Minimize to system tray on close</div>
                <div className="text-xs text-muted-foreground">
                  When you close the window, YuMusic stays running in the tray. Use the tray icon to quit.
                </div>
              </div>
              <Switch
                id="close-to-tray"
                checked={settings.closeToTray}
                onCheckedChange={(v: boolean) => setCloseToTray(v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Launch on system startup</div>
                <div className="text-xs text-muted-foreground">
                  Automatically open YuMusic when you log in to your computer.
                </div>
              </div>
              <Switch
                id="launch-on-startup"
                checked={settings.launchOnStartup}
                onCheckedChange={(v: boolean) => setLaunchOnStartup(v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Downloads ──────────────────────────────────────────────────── */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <DownloadCloud className="h-5 w-5 text-primary" />
              <CardTitle>Downloads</CardTitle>
            </div>
            <CardDescription>Manage your offline music preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Audio quality</div>
                <div className="text-xs text-muted-foreground">Higher quality uses more disk space.</div>
              </div>
              <Select
                value={settings.downloadQuality}
                onValueChange={(v) => v && setDownloadQuality(v as DownloadQuality)}
              >
                <SelectTrigger className="w-44 bg-muted/50 border-transparent text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (96kbps)</SelectItem>
                  <SelectItem value="normal">Normal (160kbps)</SelectItem>
                  <SelectItem value="high">High (256kbps)</SelectItem>
                  <SelectItem value="very_high">Very High (320kbps)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Audio format</div>
                <div className="text-xs text-muted-foreground">Preferred file format for downloads.</div>
              </div>
              <Select
                value={settings.downloadFormat}
                onValueChange={(v) => v && setDownloadFormat(v as DownloadFormat)}
              >
                <SelectTrigger className="w-44 bg-muted/50 border-transparent text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="flac">FLAC (Lossless)</SelectItem>
                  <SelectItem value="ogg">OGG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Download location</div>
                <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                  {settings.downloadFolder || "System Default Downloads"}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectFolder} className="gap-2">
                <FolderOpen className="h-3.5 w-3.5" />
                Change
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Auto-Download Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Download Albums</div>
                    <div className="text-xs text-muted-foreground">Automatically download all tracks in an album.</div>
                  </div>
                  <Switch
                    id="download-albums"
                    checked={settings.downloadAlbums}
                    onCheckedChange={(v: boolean) => setDownloadAlbums(v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Download Playlists</div>
                    <div className="text-xs text-muted-foreground">Sync your playlists for offline use.</div>
                  </div>
                  <Switch
                    id="download-playlists"
                    checked={settings.downloadPlaylists}
                    onCheckedChange={(v: boolean) => setDownloadPlaylists(v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Download Podcasts</div>
                    <div className="text-xs text-muted-foreground">Keep your favorite episodes ready.</div>
                  </div>
                  <Switch
                    id="download-podcasts"
                    checked={settings.downloadPodcasts}
                    onCheckedChange={(v: boolean) => setDownloadPodcasts(v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Auto-download Liked songs</div>
                    <div className="text-xs text-muted-foreground">Download songs immediately when you like them.</div>
                  </div>
                  <Switch
                    id="auto-download-liked"
                    checked={settings.autoDownloadLiked}
                    onCheckedChange={(v: boolean) => setAutoDownloadLiked(v)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Session / Logout ─────────────────────────────────────────────── */}
        <Card className="bg-card/50 border-border shadow-sm border-destructive/20 hover:border-destructive/40 transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-2 text-destructive">
              <Server className="h-5 w-5" />
              <CardTitle>{t('settings.session')}</CardTitle>
            </div>
            <CardDescription>{t('settings.server_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/20 rounded-lg gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-semibold">{config?.username}</span>
                <span className="text-xs text-muted-foreground">{config?.serverUrl}</span>
              </div>
              <Button
                variant="destructive"
                size="lg"
                className="font-bold px-8 shadow-sm"
                onClick={handleLogout}
              >
                {t('common.logout')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
