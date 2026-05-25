// storage.js — capa de abstracción sobre localStorage
// Compatible con window.storage del artefacto de Claude si se ejecuta ahí

const isArtifact = typeof window !== 'undefined' && window.storage;

export const storage = {
  async get(key) {
    try {
      if (isArtifact) {
        const result = await window.storage.get(key);
        return result?.value ? JSON.parse(result.value) : null;
      }
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('storage.get error', key, e);
      return null;
    }
  },

  async set(key, value) {
    try {
      const stringified = JSON.stringify(value);
      if (isArtifact) {
        await window.storage.set(key, stringified);
      } else {
        localStorage.setItem(key, stringified);
      }
      return true;
    } catch (e) {
      console.error('storage.set error', key, e);
      return false;
    }
  },

  async delete(key) {
    try {
      if (isArtifact) {
        await window.storage.delete(key);
      } else {
        localStorage.removeItem(key);
      }
      return true;
    } catch (e) {
      console.error('storage.delete error', key, e);
      return false;
    }
  },

  async list(prefix = '') {
    try {
      if (isArtifact) {
        const result = await window.storage.list(prefix);
        return result?.keys || [];
      }
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      return keys;
    } catch (e) {
      console.error('storage.list error', prefix, e);
      return [];
    }
  },

  // Bulk: get all items with a given prefix
  async getAllWithPrefix(prefix) {
    const keys = await this.list(prefix);
    const items = await Promise.all(keys.map((k) => this.get(k)));
    return items.filter(Boolean);
  },

  // Wipe (for reset functionality)
  async wipe() {
    if (isArtifact) {
      const keys = await this.list('');
      await Promise.all(keys.map((k) => this.delete(k)));
    } else {
      localStorage.clear();
    }
  },
};
