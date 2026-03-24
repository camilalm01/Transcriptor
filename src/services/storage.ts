type Serializable = string | number | boolean | null;

export const storage = {
  get(key: string): string | undefined {
    const value = localStorage.getItem(key);
    return value === null ? undefined : value;
  },

  set(key: string, value: Serializable) {
    localStorage.setItem(key, String(value));
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },

  getJSON<T>(key: string): T | undefined {
    const value = this.get(key);
    if (!value) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch {
      this.remove(key);
      return undefined;
    }
  },

  setJSON<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
