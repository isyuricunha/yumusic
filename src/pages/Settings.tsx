import { useThemeStore, Theme } from '@/store/themeStore';
import { useConfigStore } from '@/store/configStore';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Palette, Server, User } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const config = useConfigStore((state) => state.config);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="w-full max-w-4xl space-y-8 pb-12">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{t('common.settings')}</h1>

      <div className="grid gap-6">
        {/* Appearance Settings */}
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
                <SelectTrigger className="w-40 bg-muted/50 border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">True Dark</SelectItem>
                  <SelectItem value="catppuccin">Catppuccin</SelectItem>
                  <SelectItem value="nord">Nord</SelectItem>
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

        {/* Account & Server info */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle>{t('settings.server')}</CardTitle>
            </div>
            <CardDescription>{t('settings.server_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('login.server_url')}</span>
              </div>
              <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{config?.serverUrl}</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('login.username')}</span>
              </div>
              <span className="text-sm font-semibold">{config?.username}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
