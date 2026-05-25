import React, { useMemo } from 'react';
import { useSessions } from '../hooks/useSessions.js';
import { weeklyAdherence, variantDistribution, gradeProgress, lifetimeStats } from '../lib/stats.js';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

export default function StatsView() {
  const { sessions } = useSessions();

  const weekly = useMemo(() => weeklyAdherence(sessions, 8), [sessions]);
  const distribution = useMemo(() => variantDistribution(sessions), [sessions]);
  const grades = useMemo(() => gradeProgress(sessions), [sessions]);
  const lifetime = useMemo(() => lifetimeStats(sessions), [sessions]);

  const weeklyChartData = weekly.map((w) => ({
    week: w.week.split('-W')[1],
    sesiones: w.sessions,
    rocodromo: w.rocodromo,
  }));

  const gradeChartData = grades.map((g) => ({
    date: g.date.slice(5), // MM-DD
    grado: g.grade,
  }));

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--accent)', marginBottom: 6 }}>
          PROGRESO
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>
          ESTADÍSTICAS
        </h1>
      </div>

      {/* Lifetime stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <BigStat label="SESIONES" value={lifetime.totalSessions} color="var(--accent)" />
        <BigStat label="HORAS" value={lifetime.totalHours} color="var(--success)" />
        <BigStat label="ROCÓDROMO" value={lifetime.rocodromoCount} color="var(--accent-2)" />
        <BigStat label="CASA" value={lifetime.casaCount} color="var(--purple)" />
      </div>

      {/* Weekly adherence chart */}
      <ChartCard title="ADHERENCIA SEMANAL — Últimas 8 semanas">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyChartData}>
            <CartesianGrid stroke="#1a1a2e" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 10 }} axisLine={{ stroke: '#2a2a3a' }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={{ stroke: '#2a2a3a' }} />
            <Tooltip
              contentStyle={{ background: '#0f0f1a', border: '1px solid #2a2a3a', fontSize: 11, borderRadius: 4 }}
              labelStyle={{ color: '#f0e8d8' }}
            />
            <Bar dataKey="sesiones" fill="#06d6a0" radius={[3, 3, 0, 0]} />
            <Bar dataKey="rocodromo" fill="#ff6b35" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, fontSize: 10 }}>
          <Legend color="#06d6a0" label="Sesiones totales" />
          <Legend color="#ff6b35" label="Rocódromo" />
        </div>
      </ChartCard>

      {/* Distribution */}
      <ChartCard title="DISTRIBUCIÓN GLOBAL">
        {distribution.total === 0 ? (
          <Empty>Aún no hay datos suficientes.</Empty>
        ) : (
          <div>
            <div style={{
              height: 24, display: 'flex',
              borderRadius: 4, overflow: 'hidden',
              border: '1px solid var(--border-strong)',
            }}>
              <div style={{
                width: `${(distribution.rocodromo / distribution.total) * 100}%`,
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'var(--bg)',
              }}>
                {distribution.rocodromo > 0 && distribution.rocodromo}
              </div>
              <div style={{
                width: `${(distribution.casa / distribution.total) * 100}%`,
                background: 'var(--purple)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'var(--bg)',
              }}>
                {distribution.casa > 0 && distribution.casa}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11 }}>
              <span style={{ color: 'var(--accent)' }}>
                🧗 Rocódromo · {Math.round((distribution.rocodromo / distribution.total) * 100)}%
              </span>
              <span style={{ color: 'var(--purple)' }}>
                💪 Casa · {Math.round((distribution.casa / distribution.total) * 100)}%
              </span>
            </div>
          </div>
        )}
      </ChartCard>

      {/* Grade progression */}
      <ChartCard title="PROGRESIÓN DE GRADO (rocódromo)">
        {gradeChartData.length === 0 ? (
          <Empty>Registra el grado máximo en tus sesiones de rocódromo para ver tu evolución.</Empty>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={gradeChartData}>
              <CartesianGrid stroke="#1a1a2e" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10 }} axisLine={{ stroke: '#2a2a3a' }} />
              <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={{ stroke: '#2a2a3a' }} type="category" />
              <Tooltip contentStyle={{ background: '#0f0f1a', border: '1px solid #2a2a3a', fontSize: 11, borderRadius: 4 }} />
              <Line type="monotone" dataKey="grado" stroke="#ff6b35" strokeWidth={2} dot={{ fill: '#ff6b35', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

function BigStat({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 6, padding: '16px 14px',
    }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-dim)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--bg-card-soft)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: 16,
      marginBottom: 14,
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text-dim)', marginBottom: 12, fontWeight: 700 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
      <span style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
      {label}
    </span>
  );
}

function Empty({ children }) {
  return (
    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
      {children}
    </div>
  );
}
