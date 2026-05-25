import React, { useState } from 'react';
import HomeView from './views/HomeView.jsx';
import PlanView from './views/PlanView.jsx';
import HistoryView from './views/HistoryView.jsx';
import StatsView from './views/StatsView.jsx';
import SettingsView from './views/SettingsView.jsx';
import BottomNav from './components/BottomNav.jsx';

export default function App() {
  const [tab, setTab] = useState('home');

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <div style={{ paddingTop: 'var(--safe-top)' }}>
        {tab === 'home' && <HomeView onNavigate={setTab} />}
        {tab === 'plan' && <PlanView />}
        {tab === 'history' && <HistoryView />}
        {tab === 'stats' && <StatsView />}
        {tab === 'settings' && <SettingsView />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
