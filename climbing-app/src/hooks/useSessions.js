// useSessions.js — hook para gestionar sesiones

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage.js';

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const all = await storage.getAllWithPrefix('sessions:');
    setSessions(all.sort((a, b) => b.date.localeCompare(a.date)));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveSession = useCallback(async (session) => {
    const enriched = {
      ...session,
      timestamp: new Date().toISOString(),
    };
    await storage.set(`sessions:${session.date}`, enriched);
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.date !== session.date);
      return [enriched, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    return enriched;
  }, []);

  const deleteSession = useCallback(async (date) => {
    await storage.delete(`sessions:${date}`);
    setSessions((prev) => prev.filter((s) => s.date !== date));
  }, []);

  const getSession = useCallback(
    (date) => sessions.find((s) => s.date === date),
    [sessions]
  );

  return { sessions, loading, saveSession, deleteSession, getSession, reload };
}
