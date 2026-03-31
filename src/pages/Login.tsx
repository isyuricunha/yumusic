import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useConfigStore } from '@/store/configStore';
import { generateSubsonicAuth, pingSubsonic } from '@/services/apiClient';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/logo.png';

export default function Login() {
  const { t } = useTranslation();
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setConfig = useConfigStore((state) => state.setConfig);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, salt } = generateSubsonicAuth(username, password);
      // Validate connection
      const isOk = await pingSubsonic({ serverUrl, username, token, salt });
      
      if (isOk && isOk.status === "ok") {
        await setConfig({ serverUrl, username, token, salt });
        navigate('/');
      } else {
        setError('Ping failed or invalid response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-sm rounded-[var(--radius-xl)] shadow-lg">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center mb-2">
            <img src={logo} alt="YuMusic Logo" className="w-16 h-16 object-contain" />
          </div>
          <CardTitle className="text-2xl text-center font-bold tracking-tighter text-primary">
            {t('login.app_title', { defaultValue: 'YuMusic Player' })}
          </CardTitle>
          <CardDescription className="text-center">{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="serverUrl" className="text-sm font-medium">{t('login.server_url')}</label>
              <Input
                id="serverUrl"
                name="serverUrl"
                type="url"
                placeholder={t('login.server_url_placeholder', { defaultValue: 'https://music.example.com' })}
                value={serverUrl}
                onChange={(e) => setServerUrl(e.currentTarget.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">{t('login.username')}</label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder={t('login.username_placeholder', { defaultValue: 'admin' })}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">{t('login.password')}</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-destructive font-medium">{error}</div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button form="login-form" type="submit" className="w-full" disabled={loading}>
            {loading ? t('login.connecting') : t('login.connect')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
