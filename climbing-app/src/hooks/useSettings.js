// useSettings.js — hook para ajustes

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage.js';

const DEFAULTS = {
  defaultRocodromoDay: 'miercoles', // o 'lunes'
  reminderTime: '17:30',
  showOnboarding: true,
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await storage.get('settings');
      if (saved) setSettings({ ...DEFAULTS, ...saved });
      setLoading(false);
    })();
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await storage.set('settings', next);
  }, [settings]);

  return { settings, updateSetting, loading };
}
