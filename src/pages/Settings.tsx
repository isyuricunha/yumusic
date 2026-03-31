import { useState, useEffect } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { useThemeStore, Theme } from '@/store/themeStore';
import { useConfigStore } from '@/store/configStore';
import { useAppSettingsStore, type UpdateMode, type DownloadQuality, type DownloadFormat } from '@/store/appSettingsStore';
import { useDialogStore } from '@/store/dialogStore';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Palette, Server, RefreshCw, BellRing, AppWindow, DownloadCloud, FolderOpen, ExternalLink, HardDrive } from 'lucide-react';
import { checkForUpdate, downloadAndInstall } from '@/services/updaterService';
import { openDownloadFolder, calculateTotalDownloadSize } from '@/services/downloadService';

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
  const [totalDiskUsage, setTotalDiskUsage] = useState<string>('Calculating...');
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    calculateTotalDownloadSize().then(size => {
      if (size === 0) setTotalDiskUsage('0 MB');
      else if (size < 1024 * 1024 * 1024) setTotalDiskUsage(`${(size / (1024 * 1024)).toFixed(1)} MB`);
      else setTotalDiskUsage(`${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`);
    });
    getVersion().then(v => setAppVersion(v)).catch(() => {});
  }, []);

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
    } catch (err) {
      console.warn('[updater] check failed:', err);
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
                  <SelectItem value="dark">{t('settings.appearance_theme_options.dark')}</SelectItem>
                  <SelectItem value="theme-catppuccin">{t('settings.appearance_theme_options.catppuccin')}</SelectItem>
                  <SelectItem value="theme-nord">{t('settings.appearance_theme_options.nord')}</SelectItem>
                  <SelectItem value="theme-spotify">{t('settings.appearance_theme_options.spotify')}</SelectItem>
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
              <CardTitle>{t('settings.updates.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.updates.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{t('settings.updates.behavior')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('settings.updates.behavior_desc')}
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
                  <SelectItem value="auto">{t('settings.updates.options.auto')}</SelectItem>
                  <SelectItem value="notify">{t('settings.updates.options.notify')}</SelectItem>
                  <SelectItem value="disabled">{t('settings.updates.options.disabled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {appVersion && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{t('settings.updates.current_version')}</div>
                  <div className="text-xs text-muted-foreground">{t('settings.updates.current_version_desc')}</div>
                </div>
                <span className="text-sm font-bold tabular-nums text-primary">v{appVersion}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{t('settings.updates.check_now')}</div>
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
                    {updateInfo || (checkStatus === 'checking' ? t('common.checking') : '')}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {checkStatus === 'available' && !installing && (
                  <Button size="sm" onClick={handleInstallUpdate} className="text-xs">
                    {t('settings.updates.install_now')}
                  </Button>
                )}
                {installing && (
                  <span className="text-xs text-muted-foreground">{t('settings.updates.installing')}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCheckNow}
                  disabled={checkStatus === 'checking' || installing}
                  className="gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${checkStatus === 'checking' ? 'animate-spin' : ''}`} />
                  {t('settings.updates.check_now_btn')}
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
              <CardTitle>{t('settings.system.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.system.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{t('settings.system.minimize_on_close')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('settings.system.minimize_on_close_desc')}
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
                <div className="text-sm font-medium">{t('settings.system.launch_at_startup')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('settings.system.launch_at_startup_desc')}
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
              <CardTitle>{t('settings.downloads.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.downloads.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{t('settings.downloads.audio_quality')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.downloads.audio_quality_desc')}</div>
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
                <div className="text-sm font-medium">{t('settings.downloads.audio_format')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.downloads.audio_format_desc')}</div>
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
                <div className="text-sm font-medium">{t('settings.downloads.location')}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                  {settings.downloadFolder || t('settings.downloads.default_location')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={openDownloadFolder} className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t('settings.downloads.open_folder')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectFolder} className="gap-2">
                  <FolderOpen className="h-3.5 w-3.5" />
                  {t('common.change')}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <HardDrive className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{t('settings.downloads.disk_usage')}</span>
                  <span className="text-xs text-muted-foreground">{t('settings.downloads.disk_usage_desc')}</span>
                </div>
              </div>
              <span className="text-sm font-bold tabular-nums text-primary">{totalDiskUsage}</span>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t('settings.downloads.auto_download_title')}</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{t('settings.downloads.download_albums')}</div>
                    <div className="text-xs text-muted-foreground">{t('settings.downloads.download_albums_desc')}</div>
                  </div>
                  <Switch
                    id="download-albums"
                    checked={settings.downloadAlbums}
                    onCheckedChange={(v: boolean) => setDownloadAlbums(v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{t('settings.downloads.download_playlists')}</div>
                    <div className="text-xs text-muted-foreground">{t('settings.downloads.download_playlists_desc')}</div>
                  </div>
                  <Switch
                    id="download-playlists"
                    checked={settings.downloadPlaylists}
                    onCheckedChange={(v: boolean) => setDownloadPlaylists(v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{t('settings.downloads.download_podcasts')}</div>
                    <div className="text-xs text-muted-foreground">{t('settings.downloads.download_podcasts_desc')}</div>
                  </div>
                  <Switch
                    id="download-podcasts"
                    checked={settings.downloadPodcasts}
                    onCheckedChange={(v: boolean) => setDownloadPodcasts(v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{t('settings.downloads.auto_download_liked')}</div>
                    <div className="text-xs text-muted-foreground">{t('settings.downloads.auto_download_liked_desc')}</div>
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
