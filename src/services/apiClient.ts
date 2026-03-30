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
    throw new Error(`[${response.status}] Subsonic API error: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', text.substring(0, 200));
    throw new Error(`Server returned ${contentType || 'text'} instead of JSON. Ensure the server URL is correct.`);
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

export const scrobbleSubsonic = async (id: string, config: SubsonicConfig, submission: boolean = true, time?: number) => {
  const params: Record<string, string> = { id, submission: submission.toString() };
  if (time) params.time = time.toString();
  return await fetchSubsonic('scrobble', config, params);
};
