import { createMMKV } from "react-native-mmkv";

export const mmkv = createMMKV();

export const StorageKeys = {
  AUTH_TOKEN: "authToken",
  USER: "user",
} as const;

export const Storage = {
  setString: (key: string, value: string): void => {
    mmkv.set(key, value);
  },

  getString: (key: string): string | undefined => {
    return mmkv.getString(key);
  },

  setObject: <T>(key: string, value: T): void => {
    mmkv.set(key, JSON.stringify(value));
  },

  getObject: <T>(key: string): T | undefined => {
    const value = mmkv.getString(key);
    if (!value) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(
        `Failed to parse object from storage for key: ${key}`,
        error
      );
      return undefined;
    }
  },

  remove: (key: string): void => {
    mmkv.remove(key);
  },

  clearAll: (): void => {
    mmkv.clearAll();
  },

  contains: (key: string): boolean => {
    return mmkv.contains(key);
  },
};

export default Storage;
