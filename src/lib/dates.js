// dates.js — utilidades de fecha (ISO week, día de semana, formato)

export const DAY_KEYS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
export const ACTIVE_DAYS = ['lunes', 'miercoles', 'viernes', 'sabado', 'domingo'];

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function parseISO(str) {
  // YYYY-MM-DD → Date a las 12:00 UTC para evitar problemas de zona
  const [y, m, d] = str.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function dayKeyFromDate(dateOrStr) {
  const d = typeof dateOrStr === 'string' ? parseISO(dateOrStr) : dateOrStr;
  return DAY_KEYS[d.getUTCDay()];
}

// ISO week number (semana del año, lunes=1)
export function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNum };
}

export function weekKey(date) {
  const { year, week } = isoWeek(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function daysBetween(a, b) {
  const da = typeof a === 'string' ? parseISO(a) : a;
  const db = typeof b === 'string' ? parseISO(b) : b;
  return Math.floor((db - da) / 86400000);
}

export function addDays(dateStr, days) {
  const d = parseISO(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export function formatDateShort(dateStr) {
  const d = parseISO(dateStr);
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatDateLong(dateStr) {
  const d = parseISO(dateStr);
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// Obtener los 7 días de la semana actual (lunes a domingo)
export function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay() || 7; // domingo = 7
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toISODate(d);
  });
}

export function getLastNDates(n) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return toISODate(d);
  });
}
