import AsyncStorage from '@react-native-async-storage/async-storage';
import * as aesjs from 'aes-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';

import type { AuthStorage } from '@/features/auth/sessionStorage.types';

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

function keyName(storageKey: string) {
  return `${storageKey}-encryption-key`;
}

async function encrypt(storageKey: string, value: string) {
  const encryptionKey = crypto.getRandomValues(new Uint8Array(32));
  const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
  const encrypted = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

  await SecureStore.setItemAsync(
    keyName(storageKey),
    aesjs.utils.hex.fromBytes(encryptionKey),
    secureStoreOptions,
  );

  return aesjs.utils.hex.fromBytes(encrypted);
}

async function decrypt(storageKey: string, value: string) {
  const encryptionKeyHex = await SecureStore.getItemAsync(keyName(storageKey), secureStoreOptions);
  if (!encryptionKeyHex) return null;

  const cipher = new aesjs.ModeOfOperation.ctr(
    aesjs.utils.hex.toBytes(encryptionKeyHex),
    new aesjs.Counter(1),
  );
  const decrypted = cipher.decrypt(aesjs.utils.hex.toBytes(value));
  return aesjs.utils.utf8.fromBytes(decrypted);
}

export const sessionStorage: AuthStorage = {
  async getItem(storageKey) {
    const encrypted = await AsyncStorage.getItem(storageKey);
    return encrypted ? decrypt(storageKey, encrypted) : null;
  },
  async removeItem(storageKey) {
    await Promise.all([
      AsyncStorage.removeItem(storageKey),
      SecureStore.deleteItemAsync(keyName(storageKey), secureStoreOptions),
    ]);
  },
  async setItem(storageKey, value) {
    const encrypted = await encrypt(storageKey, value);
    await AsyncStorage.setItem(storageKey, encrypted);
  },
};
