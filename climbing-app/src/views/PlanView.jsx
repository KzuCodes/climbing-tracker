import React, { useState } from 'react';
import { PLAN } from '../lib/plan.js';
import { useSessions } from '../hooks/useSessions.js';
import { todayISO, dayKeyFromDate } from '../lib/dates.js';

export default function PlanView() {
  const { sessions } = useSessions();
  const today = todayISO();
  const todayDayKey = dayKeyFromDate(today);

  const [activeDay, setActiveDay] = useState(
    PLAN.find((d) => d.id === todayDayKey)?.id || 'lunes'
  );
  const [activeVariant, setActiveVariant] = useState({});

  const currentDay = PLAN.find((d) => d.id === activeDay);
  const getVariantIndex = (id) => activeVariant[id] ?? 0;
  const currentBlocks = currentDay.alt
    ? currentDay.variants[getVariantIndex(currentDay.id)].blocks
    : currentDay.blocks;

  const completedDates = new Set(sessions.filter((s) => s.completed).map((s) => s.date));

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '32px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.08) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--accent)', marginBottom: 6 }}>
            PLAN SEMANAL
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, lineHeight: 1.1, color: 'var(--text)' }}>
            ESCALADA<br />
            <span style={{ color: 'var(--accent)' }}>PRINCIPIANTE</span>
          </h1>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Day selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {PLAN.map((d) => {
            const isActive = activeDay === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                style={{
                  background: isActive ? d.tagColor : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? d.tagColor : 'var(--border-strong)'}`,
                  padding: '8px 12px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  borderRadius: 2,
                  flexShrink: 0,
                }}>
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Day header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>
              {currentDay.label}
            </h2>
            <span style={{
              background: currentDay.tagColor + '22',
              color: currentDay.tagColor,
              border: `1px solid ${currentDay.tagColor}44`,
              padding: '2px 8px', fontSize: 9, letterSpacing: 1.5, borderRadius: 2,
            }}>
              {currentDay.tag}
            </span>
          </div>

          {currentDay.alt && (
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              {currentDay.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVariant((prev) => ({ ...prev, [currentDay.id]: i }))}
                  style={{
                    background: getVariantIndex(currentDay.id) === i ? 'var(--bg-card)' : 'transparent',
                    color: getVariantIndex(currentDay.id) === i ? 'var(--text)' : 'var(--text-dim)',
                    border: `1px solid ${getVariantIndex(currentDay.id) === i ? 'var(--border-strong)' : 'var(--border)'}`,
                    padding: '6px 10px', fontSize: 10,
                    borderRadius: 2,
                  }}>
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentBlocks.map((block, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${block.color}`,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 14px',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: block.color, letterSpacing: 1 }}>
                  {block.title.toUpperCase()}
                </span>
                <span style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>
                  {block.duration}
                </span>
              </div>
              <ul style={{ margin: 0, padding: '10px 14px 10px 28px', listStyle: 'none' }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{
                    fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.7,
                    position: 'relative', paddingLeft: 14,
                  }}>
                    <span style={{
                      position: 'absolute', left: 0, top: 8,
                      width: 4, height: 4, borderRadius: '50%',
                      background: block.color + '88',
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
