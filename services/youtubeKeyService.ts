import CryptoJS from 'crypto-js';

const KEY_NAME = 'itube_api_key';
const SECRET = 'itube_secret_key_123'; // Simple secret for local encryption

export const saveYoutubeKey = (key: string) => {
  const encrypted = CryptoJS.AES.encrypt(key, SECRET).toString();
  localStorage.setItem(KEY_NAME, encrypted);
};

export const getYoutubeKey = (): string | null => {
  const encrypted = localStorage.getItem(KEY_NAME);
  if (!encrypted) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (e) {
    return null;
  }
};

export const removeYoutubeKey = () => {
  localStorage.removeItem(KEY_NAME);
};

export const testYoutubeKey = async (key: string): Promise<boolean> => {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&key=${key}`);
    return res.ok;
  } catch (e) {
    return false;
  }
};
