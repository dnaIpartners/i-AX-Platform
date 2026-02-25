
/**
 * Service for managing API keys externally.
 * Handles storage in localStorage and encrypted export/import to local drive.
 */

const STORAGE_KEY = 'ipartners_api_keys';
const ENCRYPTION_KEY = 'ipartners-secure-key'; // In a real app, this would be user-provided

export interface ApiKeys {
  gemini?: string;
  openai?: string;
  custom?: Record<string, string>;
}

/**
 * Simple encryption using Base64 + XOR (for demonstration of "encrypted" requirement)
 * In a production app, use Web Crypto API (AES-GCM)
 */
const encrypt = (text: string): string => {
  const textChars = text.split('');
  const keyChars = ENCRYPTION_KEY.split('');
  const encrypted = textChars.map((c, i) => 
    String.fromCharCode(c.charCodeAt(0) ^ keyChars[i % keyChars.length].charCodeAt(0))
  ).join('');
  return btoa(encrypted);
};

const decrypt = (encoded: string): string => {
  const text = atob(encoded);
  const textChars = text.split('');
  const keyChars = ENCRYPTION_KEY.split('');
  const decrypted = textChars.map((c, i) => 
    String.fromCharCode(c.charCodeAt(0) ^ keyChars[i % keyChars.length].charCodeAt(0))
  ).join('');
  return decrypted;
};

export const getStoredKeys = (): ApiKeys => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse stored keys', e);
    return {};
  }
};

export const saveKeys = (keys: ApiKeys) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
};

export const exportKeysToFile = () => {
  const keys = getStoredKeys();
  const jsonString = JSON.stringify(keys);
  const encryptedString = encrypt(jsonString);
  
  const blob = new Blob([encryptedString], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ipartners_keys_${new Date().toISOString().split('T')[0]}.enc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importKeysFromFile = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const encryptedContent = e.target?.result as string;
        const decryptedContent = decrypt(encryptedContent);
        const keys = JSON.parse(decryptedContent);
        saveKeys(keys);
        resolve(true);
      } catch (err) {
        console.error('Failed to import keys', err);
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
};

export const getActiveGeminiKey = (): string | undefined => {
  const keys = getStoredKeys();
  return keys.gemini || process.env.GEMINI_API_KEY || process.env.API_KEY;
};
