import md5 from 'md5';
import i18next from 'i18next';

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
    throw new Error(`[${response.status}] ${i18next.t('common.errors.api_error')}: ${response.statusText}`);
  }

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    const res = data['subsonic-response'];
    if (res && res.status === 'failed') {
      throw new Error(res.error?.message || i18next.t('common.errors.api_error'));
    }
    return res;
  } catch (e) {
    console.error(`[YuMusic] JSON Parse Error for endpoint "${endpoint}" at URL: ${restUrl}`);
    console.error('Server returned:', text.substring(0, 300));
    throw new Error(i18next.t('common.errors.invalid_response'));
  }
};

export const pingSubsonic = async (config: SubsonicConfig) => {
  return await fetchSubsonic('ping', config);
};

export const scrobbleSubsonic = async (id: string, config: SubsonicConfig, submission: boolean = true, time?: number) => {
  const params: Record<string, string> = { id, submission: submission.toString() };
  if (time) params.time = time.toString();
  return await fetchSubsonic('scrobble', config, params);
};
