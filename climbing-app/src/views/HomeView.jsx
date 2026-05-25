import React, { useState, useMemo } from 'react';
import { useSessions } from '../hooks/useSessions.js';
import { useSettings } from '../hooks/useSettings.js';
import { todayISO, dayKeyFromDate, getCurrentWeekDates, formatDateLong, DAY_KEYS } from '../lib/dates.js';
import { calculateStreak, weekStats, lifetimeStats } from '../lib/stats.js';
import { getDayPlan } from '../lib/plan.js';
import SessionLogModal from '../components/SessionLogModal.jsx';

const ACTIVE_DAYS = ['lunes', 'miercoles', 'viernes', 'sabado', 'domingo'];

export default function HomeView({ onNavigate }) {
  const { sessions, saveSession, getSession } = useSessions();
  const { settings } = useSettings();
  const [logModalOpen, setLogModalOpen] = useState(false);

  const today = todayISO();
  const todayDayKey = dayKeyFromDate(today);
  const isActiveDay = ACTIVE_DAYS.includes(todayDayKey);
  const todayDay = getDayPlan(todayDayKey);
  const todaySession = getSession(today);

  const streak = useMemo(() => calculateStreak(sessions), [sessions]);
  const weekDates = useMemo(() => getCurrentWeekDates(), []);
  const stats = useMemo(() => weekStats(sessions, weekDates), [sessions, weekDates]);
  const lifetime = useMemo(() => lifetimeStats(sessions), [sessions]);

  const handleSave = async (session) => {
    await saveSession(session);
    setLogModalOpen(false);
  };

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--accent)', marginBottom: 6, textTransform: 'uppercase' }}>
          {formatDateLong(today)}
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: 'var(--text)', lineHeight: 1.1 }}>
          {isActiveDay ? todayDay.label : 'DÍA DE'} <br />
          <span style={{ color: isActiveDay ? todayDay.tagColor : 'var(--text-dim)' }}>
            {isActiveDay ? todayDay.tag.toUpperCase() : 'DESCANSO'}
          </span>
        </h1>
      </div>

      {/* Today CTA */}
      {isActiveDay && (
        <div style={{
          background: todaySession?.completed ? 'var(--bg-card)' : `${todayDay.tagColor}11`,
          border: `1px solid ${todaySession?.completed ? 'var(--success)' : todayDay.tagColor + '44'}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}>
          {todaySession?.completed ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>SESIÓN COMPLETADA</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>
                {todaySession.variant === 'rocodromo' ? '🧗 Rocódromo' : todaySession.variant === 'casa' ? '💪 Casa/Parque' : 'Sesión'} · {todaySession.duration} min · RPE {todaySession.perceivedEffort}
              </div>
              {todaySession.maxGrade && (
                <div style={{ fontSize: 12, color: 'var(--accent)' }}>
                  🎯 Grado máximo: {todaySession.maxGrade}
                </div>
              )}
              <button
                onClick={() => setLogModalOpen(true)}
                style={{
                  marginTop: 12, padding: '8px 14px',
                  background: 'transparent', color: 'var(--text-muted)',
                  border: '1px solid var(--border-strong)', borderRadius: 4,
                  fontSize: 11, letterSpacing: 1,
                }}>
                EDITAR
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 12 }}>
                Hoy toca entrenar. Cuando termines, registra tu sesión.
              </div>
              <button
                onClick={() => setLogModalOpen(true)}
                style={{
                  width: '100%', padding: '14px',
                  background: todayDay.tagColor,
                  color: 'var(--bg)', border: 'none', borderRadius: 6,
                  fontWeight: 800, fontSize: 13, letterSpacing: 2,
                }}>
                + REGISTRAR SESIÓN
              </button>
              <button
                onClick={() => onNavigate('plan')}
                style={{
                  width: '100%', padding: '10px', marginTop: 8,
                  background: 'transparent',
                  color: 'var(--text-muted)', border: '1px solid var(--border-strong)', borderRadius: 6,
                  fontSize: 11, letterSpacing: 1,
                }}>
                VER PLAN DEL DÍA
              </button>
            </>
          )}
        </div>
      )}

      {!isActiveDay && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-strong)',
          borderRadius: 8,
          padding: 20,
          textAlign: 'center',
          marginBottom: 16,
          color: 'var(--text-muted)',
          fontSize: 12,
        }}>
          Hoy no toca entrenar 💤<br />
          Aprovecha para recuperar.
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <StatCard label="RACHA ACTUAL" value={streak.current} unit="días" color="var(--accent)" />
        <StatCard label="ESTA SEMANA" value={`${stats.completed}/${stats.plannedThisWeek}`} unit="sesiones" color="var(--success)" />
        <StatCard label="ROCÓDROMO" value={stats.rocodromoCount} unit="esta semana" color="var(--accent-2)" />
        <StatCard label="TOTAL HORAS" value={lifetime.totalHours} unit="entrenadas" color="var(--purple)" />
      </div>

      {/* Mini week calendar */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase' }}>
          Tu semana
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {weekDates.map((date) => {
            const session = sessions.find((s) => s.date === date);
            const dayKey = dayKeyFromDate(date);
            const isActive = ACTIVE_DAYS.includes(dayKey);
            const isToday = date === today;
            const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
            const dayIdx = new Date(date).getDay();
            const labelIdx = dayIdx === 0 ? 6 : dayIdx - 1;

            return (
              <div key={date} style={{
                background: session?.completed ? 'var(--success)' :
                            isActive ? 'var(--bg-card)' : 'transparent',
                border: isToday ? '2px solid var(--accent)' :
                        `1px solid ${isActive ? 'var(--border-strong)' : 'var(--border)'}`,
                borderRadius: 4,
                padding: '8px 2px',
                textAlign: 'center',
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <div style={{
                  fontSize: 10,
                  color: session?.completed ? 'var(--bg)' : isActive ? 'var(--text-soft)' : 'var(--text-dim)',
                  fontWeight: 700, letterSpacing: 1,
                }}>{labels[labelIdx]}</div>
                <div style={{
                  fontSize: 14, fontWeight: 800,
                  color: session?.completed ? 'var(--bg)' : isActive ? 'var(--text)' : 'var(--text-dim)',
                }}>{new Date(date).getDate()}</div>
                {session?.variant === 'rocodromo' && (
                  <div style={{ fontSize: 8, marginTop: 2 }}>🧗</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isActiveDay && (
        <SessionLogModal
          open={logModalOpen}
          dayId={todayDayKey}
          date={today}
          existing={todaySession}
          onClose={() => setLogModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, unit, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: '14px 12px',
    }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-dim)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{unit}</div>
    </div>
  );
}
