// stats.js — cálculos de rachas, adherencia, agregados

import { ACTIVE_DAYS, dayKeyFromDate, daysBetween, todayISO, weekKey, parseISO, toISODate } from './dates.js';

/**
 * Racha flexible: cuenta días consecutivos con sesión completada,
 * permitiendo huecos de 1 día. Rompe solo si hay 2+ días seguidos sin sesión.
 *
 * Solo cuentan los días activos del plan (lunes, miércoles, viernes, sábado, domingo).
 */
export function calculateStreak(sessions) {
  if (!sessions || sessions.length === 0) return { current: 0, longest: 0 };

  const completedDates = sessions
    .filter((s) => s.completed)
    .map((s) => s.date)
    .sort();

  if (completedDates.length === 0) return { current: 0, longest: 0 };

  // Calcular racha actual: ir hacia atrás desde hoy permitiendo 1 día de hueco
  const today = todayISO();
  let current = 0;
  const completedSet = new Set(completedDates);

  const lastDate = completedDates[completedDates.length - 1];
  const daysSinceLast = daysBetween(lastDate, today);

  // Si la última sesión fue hace más de 2 días, la racha está rota
  if (daysSinceLast > 2) {
    current = 0;
  } else {
    // Recorrer hacia atrás desde lastDate
    let cursor = lastDate;
    current = 1;
    let consecutiveMisses = 0;

    while (true) {
      // Buscar día anterior con sesión, permitiendo 1 hueco
      const prevDay1 = shiftDate(cursor, -1);
      const prevDay2 = shiftDate(cursor, -2);

      if (completedSet.has(prevDay1)) {
        current++;
        cursor = prevDay1;
      } else if (completedSet.has(prevDay2)) {
        current++;
        cursor = prevDay2;
      } else {
        break;
      }
    }
  }

  // Racha más larga histórica: misma lógica recorriendo todas las completadas
  let longest = 0;
  let temp = 0;
  let prevDate = null;
  for (const date of completedDates) {
    if (prevDate === null) {
      temp = 1;
    } else {
      const gap = daysBetween(prevDate, date);
      if (gap <= 2) temp++;
      else temp = 1;
    }
    if (temp > longest) longest = temp;
    prevDate = date;
  }

  return { current, longest };
}

function shiftDate(dateStr, days) {
  const d = parseISO(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

/**
 * Stats de la semana actual basadas en las sesiones ya completadas.
 */
export function weekStats(sessions, weekDates) {
  const weekSet = new Set(weekDates);
  const weekSessions = sessions.filter((s) => weekSet.has(s.date) && s.completed);

  const plannedThisWeek = weekDates.filter((d) => ACTIVE_DAYS.includes(dayKeyFromDate(d))).length;
  const completed = weekSessions.length;
  const rocodromoCount = weekSessions.filter((s) => s.variant === 'rocodromo' || s.location === 'rocodromo').length;
  const totalMinutes = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgRPE = weekSessions.length
    ? weekSessions.reduce((sum, s) => sum + (s.perceivedEffort || 0), 0) / weekSessions.length
    : 0;

  return {
    plannedThisWeek,
    completed,
    rocodromoCount,
    totalMinutes,
    avgRPE: Number(avgRPE.toFixed(1)),
    adherence: plannedThisWeek ? completed / plannedThisWeek : 0,
  };
}

/**
 * Adherencia por semana en las últimas N semanas.
 */
export function weeklyAdherence(sessions, numWeeks = 8) {
  const byWeek = {};

  // Agrupar sesiones por semana ISO
  for (const s of sessions) {
    if (!s.completed) continue;
    const wk = weekKey(parseISO(s.date));
    if (!byWeek[wk]) byWeek[wk] = { week: wk, sessions: 0, rocodromo: 0, minutes: 0 };
    byWeek[wk].sessions++;
    if (s.variant === 'rocodromo') byWeek[wk].rocodromo++;
    byWeek[wk].minutes += s.duration || 0;
  }

  // Últimas N semanas (incluyendo la actual)
  const today = new Date();
  const result = [];
  for (let i = numWeeks - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 7);
    const wk = weekKey(d);
    result.push(byWeek[wk] || { week: wk, sessions: 0, rocodromo: 0, minutes: 0 });
  }
  return result;
}

/**
 * Distribución rocódromo vs casa en el total.
 */
export function variantDistribution(sessions) {
  const completed = sessions.filter((s) => s.completed);
  const rocodromo = completed.filter((s) => s.variant === 'rocodromo').length;
  const casa = completed.length - rocodromo;
  return { rocodromo, casa, total: completed.length };
}

/**
 * Grado máximo encadenado a lo largo del tiempo.
 */
export function gradeProgress(sessions) {
  return sessions
    .filter((s) => s.completed && s.maxGrade && s.variant === 'rocodromo')
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({ date: s.date, grade: s.maxGrade }));
}

/**
 * Total de sesiones, minutos y media de RPE históricos.
 */
export function lifetimeStats(sessions) {
  const completed = sessions.filter((s) => s.completed);
  const totalMinutes = completed.reduce((sum, s) => sum + (s.duration || 0), 0);
  const rocodromoCount = completed.filter((s) => s.variant === 'rocodromo').length;
  return {
    totalSessions: completed.length,
    totalMinutes,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    rocodromoCount,
    casaCount: completed.length - rocodromoCount,
  };
}
