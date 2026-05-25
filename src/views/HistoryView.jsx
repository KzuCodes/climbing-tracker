import React, { useState, useMemo } from 'react';
import { useSessions } from '../hooks/useSessions.js';
import { formatDateShort, formatDateLong } from '../lib/dates.js';
import { getDayPlan } from '../lib/plan.js';
import SessionLogModal from '../components/SessionLogModal.jsx';

export default function HistoryView() {
  const { sessions, saveSession, deleteSession } = useSessions();
  const [filter, setFilter] = useState('all'); // all | rocodromo | casa
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    return sessions
      .filter((s) => s.completed)
      .filter((s) => {
        if (filter === 'all') return true;
        if (filter === 'rocodromo') return s.variant === 'rocodromo';
        if (filter === 'casa') return s.variant !== 'rocodromo';
        return true;
      });
  }, [sessions, filter]);

  // Group by month
  const grouped = useMemo(() => {
    const groups = {};
    for (const s of filtered) {
      const month = s.date.slice(0, 7);
      if (!groups[month]) groups[month] = [];
      groups[month].push(s);
    }
    return Object.entries(groups);
  }, [filtered]);

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--accent)', marginBottom: 6 }}>
          REGISTRO
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>
          HISTORIAL
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[
          { id: 'all', label: 'TODO' },
          { id: 'rocodromo', label: 'ROCÓDROMO' },
          { id: 'casa', label: 'CASA' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              flex: 1,
              padding: '8px 6px',
              background: filter === f.id ? 'var(--accent)' : 'transparent',
              color: filter === f.id ? 'var(--bg)' : 'var(--text-muted)',
              border: `1px solid ${filter === f.id ? 'var(--accent)' : 'var(--border-strong)'}`,
              borderRadius: 2,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.5,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          padding: 40, textAlign: 'center',
          background: 'var(--bg-card)', border: '1px dashed var(--border-strong)',
          borderRadius: 6, color: 'var(--text-muted)', fontSize: 12,
        }}>
          Aún no hay sesiones registradas.<br />
          Cuando completes la primera, aparecerá aquí.
        </div>
      )}

      {/* Grouped sessions */}
      {grouped.map(([month, items]) => (
        <div key={month} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, letterSpacing: 3, color: 'var(--text-dim)',
            marginBottom: 10, textTransform: 'uppercase',
            paddingBottom: 6, borderBottom: '1px solid var(--border)',
          }}>
            {monthLabel(month)} · {items.length} sesiones
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((s) => {
              const day = getDayPlan(s.dayType);
              const isRoco = s.variant === 'rocodromo';
              return (
                <button
                  key={s.date}
                  onClick={() => setEditing(s)}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid var(--border)`,
                    borderLeft: `3px solid ${day?.tagColor || 'var(--accent)'}`,
                    borderRadius: 4,
                    padding: '12px 14px',
                    textAlign: 'left',
                    color: 'var(--text)',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>
                      {formatDateShort(s.date)} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>· {day?.label}</span>
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {s.duration} min
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 10, color: 'var(--text-muted)' }}>
                    <span>{isRoco ? '🧗 Rocódromo' : '💪 Casa'}</span>
                    <span>RPE {s.perceivedEffort}</span>
                    {s.maxGrade && <span style={{ color: 'var(--accent)' }}>🎯 {s.maxGrade}</span>}
                    {s.completedBlocks?.length > 0 && <span>{s.completedBlocks.length} bloques</span>}
                  </div>
                  {s.notes && (
                    <div style={{
                      marginTop: 8, fontSize: 11, color: 'var(--text-soft)',
                      paddingTop: 8, borderTop: '1px solid var(--border)',
                      fontStyle: 'italic',
                      whiteSpace: 'pre-wrap',
                    }}>
                      "{s.notes.length > 120 ? s.notes.slice(0, 120) + '…' : s.notes}"
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <SessionLogModal
        open={!!editing}
        dayId={editing?.dayType}
        date={editing?.date}
        existing={editing}
        onClose={() => setEditing(null)}
        onSave={async (s) => {
          await saveSession(s);
          setEditing(null);
        }}
      />
    </div>
  );
}

function monthLabel(monthStr) {
  const [y, m] = monthStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, 1, 12));
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}
