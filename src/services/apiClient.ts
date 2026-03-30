import md5 from 'md5';

export const generateSubsonicAuth = (username: string, password: string) => {
  const salt = Math.random().toString(36).substring(2, 15);
  const token = md5(password + salt);
  return { username, token, salt };
};

export interface SubsonicConfig {
  serverUrl: string;
  username: string;
  token: string;
  salt: string;
}

export const fetchSubsonic = async (
  endpoint: string,
  config: SubsonicConfig,
  params: Record<string, string> = {}
) => {
  const { serverUrl, username, token, salt } = config;
  
  const query = new URLSearchParams({
    u: username,
    t: token,
    s: salt,
    v: '1.16.1',
    c: 'Yumusic',
    f: 'json',
    ...params,
  });

  const baseUrl = serverUrl.endsWith('/') ? serverUrl : `${serverUrl}/`;
  const restUrl = `${baseUrl}rest/${endpoint}?${query.toString()}`;

  const response = await fetch(restUrl);
  if (!response.ok) {
    throw new Error(`Subsonic API error: ${response.statusText}`);
  }

  const data = await response.json();
  const res = data['subsonic-response'];
  if (res && res.status === 'failed') {
    throw new Error(res.error?.message || 'Unknown Subsonic API Error');
  }

  return res;
};

export const pingSubsonic = async (config: SubsonicConfig) => {
  return await fetchSubsonic('ping', config);
};
