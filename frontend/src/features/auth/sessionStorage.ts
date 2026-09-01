import type { AuthStorage } from '@/features/auth/sessionStorage.types';

const memory = new Map<string, string>();

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const sessionStorage: AuthStorage = {
  async getItem(key) {
    return hasLocalStorage() ? window.localStorage.getItem(key) : (memory.get(key) ?? null);
  },
  async removeItem(key) {
    if (hasLocalStorage()) {
      window.localStorage.removeItem(key);
      return;
    }
    memory.delete(key);
  },
  async setItem(key, value) {
    if (hasLocalStorage()) {
      window.localStorage.setItem(key, value);
      return;
    }
    memory.set(key, value);
  },
};
