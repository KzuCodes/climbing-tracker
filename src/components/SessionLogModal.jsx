import React, { useState, useEffect } from 'react';
import { getBlocksForSession, getDayPlan } from '../lib/plan.js';

export default function SessionLogModal({ open, dayId, date, existing, onClose, onSave }) {
  const day = getDayPlan(dayId);
  const [variant, setVariant] = useState(existing?.variant || (day?.alt ? 'rocodromo' : null));
  const [duration, setDuration] = useState(existing?.duration ?? 60);
  const [rpe, setRpe] = useState(existing?.perceivedEffort ?? 6);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [maxGrade, setMaxGrade] = useState(existing?.maxGrade ?? '');
  const [completedBlocks, setCompletedBlocks] = useState(new Set(existing?.completedBlocks ?? []));

  useEffect(() => {
    if (open) {
      setVariant(existing?.variant || (day?.alt ? 'rocodromo' : null));
      setDuration(existing?.duration ?? 60);
      setRpe(existing?.perceivedEffort ?? 6);
      setNotes(existing?.notes ?? '');
      setMaxGrade(existing?.maxGrade ?? '');
      setCompletedBlocks(new Set(existing?.completedBlocks ?? []));
    }
  }, [open, existing, day]);

  if (!open || !day) return null;

  const blocks = getBlocksForSession(dayId, variant);

  const toggleBlock = (blockId) => {
    setCompletedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  };

  const handleSave = () => {
    const session = {
      date,
      dayType: dayId,
      variant: day.alt ? variant : null,
      completed: true,
      duration: Number(duration),
      perceivedEffort: Number(rpe),
      notes: notes.trim(),
      maxGrade: maxGrade.trim() || null,
      completedBlocks: Array.from(completedBlocks),
    };
    onSave(session);
  };

  const showGradeField = variant === 'rocodromo' || (!day.alt && (dayId === 'sabado'));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          width: '100%',
          maxHeight: '92vh',
          borderTop: '1px solid var(--border-strong)',
          borderRadius: '12px 12px 0 0',
          overflow: 'auto',
          padding: '20px 20px calc(20px + var(--safe-bottom))',
          animation: 'slideUp 0.2s ease-out',
        }}>
        <div style={{
          width: 40, height: 4, background: 'var(--border-strong)',
          borderRadius: 2, margin: '0 auto 16px',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text-dim)', marginBottom: 4 }}>
              REGISTRAR SESIÓN
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
              {day.label} · {date}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            fontSize: 24, padding: 4,
          }}>×</button>
        </div>

        {/* Variant selector */}
        {day.alt && (
          <Section title="¿Qué tipo de sesión?">
            <div style={{ display: 'flex', gap: 8 }}>
              {day.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v.id)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    background: variant === v.id ? `${day.tagColor}22` : 'var(--bg-card)',
                    color: variant === v.id ? day.tagColor : 'var(--text-soft)',
                    border: `1px solid ${variant === v.id ? day.tagColor : 'var(--border-strong)'}`,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                  {v.label}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Duration */}
        <Section title={`Duración — ${duration} min`}>
          <input
            type="range"
            min="15" max="180" step="5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
            <span>15</span><span>90</span><span>180 min</span>
          </div>
        </Section>

        {/* RPE */}
        <Section title={`Esfuerzo percibido — ${rpe}/10`}>
          <input
            type="range" min="1" max="10" step="1"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
            <span>1 fácil</span><span>5 medio</span><span>10 máx</span>
          </div>
        </Section>

        {/* Max grade (only for rocodromo / sabado) */}
        {showGradeField && (
          <Section title="Grado máximo encadenado (opcional)">
            <input
              type="text"
              value={maxGrade}
              onChange={(e) => setMaxGrade(e.target.value)}
              placeholder="6a, 6a+, 6b..."
            />
          </Section>
        )}

        {/* Blocks checklist */}
        <Section title="Bloques completados">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {blocks.map((b) => (
              <label key={b.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: `1px solid ${completedBlocks.has(b.id) ? b.color + '88' : 'var(--border)'}`,
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                <input
                  type="checkbox"
                  checked={completedBlocks.has(b.id)}
                  onChange={() => toggleBlock(b.id)}
                  style={{ width: 18, height: 18, accentColor: b.color }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>{b.title}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-dim)' }}>{b.duration}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Notes */}
        <Section title="Notas">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Cómo te sentiste? ¿Algún problema encadenado?"
          />
        </Section>

        {/* Save button */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: 8,
            background: 'var(--accent)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: 6,
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 2,
          }}>
          GUARDAR SESIÓN
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, letterSpacing: 2, color: 'var(--text-dim)',
        marginBottom: 8, textTransform: 'uppercase', fontWeight: 700,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
