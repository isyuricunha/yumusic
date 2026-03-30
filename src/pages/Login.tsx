import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useConfigStore } from '@/store/configStore';
import { generateSubsonicAuth, pingSubsonic } from '@/services/apiClient';

export default function Login() {
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
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-bold">Yumusic Player</CardTitle>
          <CardDescription>Connect to your Subsonic/Navidrome server</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="serverUrl" className="text-sm font-medium">Server URL</label>
              <Input
                id="serverUrl"
                type="url"
                placeholder="https://music.example.com"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.currentTarget.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
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
            {loading ? 'Connecting...' : 'Connect'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
