import React from 'react';

const TABS = [
  { id: 'home', label: 'Hoy', icon: '🏠' },
  { id: 'plan', label: 'Plan', icon: '📋' },
  { id: 'history', label: 'Historial', icon: '📅' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'settings', label: 'Ajustes', icon: '⚙️' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#0c0c18',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      paddingBottom: 'var(--safe-bottom)',
      zIndex: 100,
    }}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '10px 4px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: isActive ? 'var(--accent)' : 'var(--text-dim)',
              transition: 'color 0.15s',
              position: 'relative',
            }}
          >
            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 2,
                background: 'var(--accent)',
              }} />
            )}
            <span style={{ fontSize: 18, opacity: isActive ? 1 : 0.5 }}>{tab.icon}</span>
            <span style={{
              fontSize: 9,
              letterSpacing: 1,
              fontWeight: isActive ? 700 : 500,
              textTransform: 'uppercase',
            }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
