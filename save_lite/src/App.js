import React, { createContext, useContext, useState } from 'react';
import './App.css';

// Simulated context providers for User, Savings, and Localization
// In real implementation, these would be separated into their own files with additional logic.

//
// UserContext
//
const UserContext = createContext();
const UserProvider = ({ children }) => {
  // You would pull from localStorage/network in real app
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

//
// SavingsContext
//
const SavingsContext = createContext();
const SavingsProvider = ({ children }) => {
  // Mock: tracking savings/goal/transactions
  const [savings, setSavings] = useState({ total: 0, goals: [], transactions: [] });
  return (
    <SavingsContext.Provider value={{ savings, setSavings }}>
      {children}
    </SavingsContext.Provider>
  );
};

//
// LocalizationContext
//
const LocalizationContext = createContext();
const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  return (
    <LocalizationContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// =========== Minimal manual router implementation (no external deps) ============
const ROUTES = {
  onboarding: { path: '/onboarding', label: 'Onboarding' },
  home: { path: '/', label: 'Home' },
  goals: { path: '/goals', label: 'Goals' },
  withdrawals: { path: '/withdrawals', label: 'Withdraw' },
  gamification: { path: '/gamification', label: 'Rewards' },
  settings: { path: '/settings', label: 'Settings' },
};

function getCurrentPath() {
  // Only path, ignore query/hash for minimalism.
  return window.location.pathname === '/' ? '/' : window.location.pathname;
}

function navigate(path) {
  window.history.pushState({}, '', path);
  // Dispatch a "popstate" so listeners re-render
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// =========== Dummy screen containers =============
const Onboarding = () => (
  <div className="container"><h2 className="title">Onboarding</h2><div className="description">Welcome! Register or log in to start saving.</div></div>
);

const Home = () => {
  const { savings } = useContext(SavingsContext);
  return (
    <div className="container">
      <h2 className="title">Home</h2>
      <div className="description">Total Saved: <b>${savings.total}</b></div>
    </div>
  );
};

const Goals = () => (
  <div className="container"><h2 className="title">Savings Goals</h2><div className="description">Track and manage your saving goals.</div></div>
);

const Withdrawals = () => (
  <div className="container"><h2 className="title">Withdrawals</h2><div className="description">Request a withdrawal (for emergencies).</div></div>
);

const Gamification = () => (
  <div className="container"><h2 className="title">Gamification</h2><div className="description">View your streaks, badges & milestones!</div></div>
);

const Settings = () => {
  const { locale, setLocale } = useContext(LocalizationContext);
  return (
    <div className="container">
      <h2 className="title">Settings</h2>
      <div className="description">
        Language:&nbsp;
        <select value={locale} onChange={e => setLocale(e.target.value)}>
          <option value="en">English</option>
          <option value="sw">Swahili</option>
        </select>
      </div>
    </div>
  );
};

// ============ Main App Shell with Navigation and Routing =============

function App() {
  // Simple client-side router (without react-router-dom to keep lightweight)
  const [currentPath, setCurrentPath] = React.useState(getCurrentPath());

  React.useEffect(() => {
    const onPopState = () => setCurrentPath(getCurrentPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Map path to component
  let Screen;
  switch (currentPath) {
    case ROUTES.onboarding.path: Screen = Onboarding; break;
    case ROUTES.goals.path: Screen = Goals; break;
    case ROUTES.withdrawals.path: Screen = Withdrawals; break;
    case ROUTES.gamification.path: Screen = Gamification; break;
    case ROUTES.settings.path: Screen = Settings; break;
    case ROUTES.home.path:
    default:
      Screen = Home;
      break;
  }

  // Basic nav: home, goals, withdrawals, gamification, and settings
  // Onboarding is not in nav (only shown if route matched)
  const navTabs = [
    ROUTES.home,
    ROUTES.goals,
    ROUTES.withdrawals,
    ROUTES.gamification,
    ROUTES.settings
  ];

  return (
    <UserProvider>
      <SavingsProvider>
        <LocalizationProvider>
          <div className="app">
            {/* Top NavBar */}
            <nav className="navbar">
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div className="logo">
                    <span className="logo-symbol">*</span> SaveLite
                  </div>
                  {/* Placeholder for global quick action */}
                  <button className="btn" onClick={() => navigate('/onboarding')}>
                    Onboard
                  </button>
                </div>
              </div>
            </nav>

            {/* Main content screen */}
            <main style={{ marginTop: 70, marginBottom: 60 /* for spacing below navbars */ }}>
              <Screen />
            </main>

            {/* Bottom Nav (tab bar) */}
            <nav
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'var(--kavia-dark)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                height: 48, zIndex: 100
              }}
            >
              {navTabs.map(tab => (
                <button
                  key={tab.path}
                  className="btn"
                  style={{
                    background: currentPath === tab.path ? 'var(--kavia-orange)' : 'transparent',
                    color: currentPath === tab.path ? '#fff' : 'var(--text-secondary)',
                    fontWeight: currentPath === tab.path ? 600 : 400,
                    fontSize: 15,
                    borderRadius: 4,
                    flex: 1,
                    margin: 4
                  }}
                  onClick={() => navigate(tab.path)}
                  aria-current={currentPath === tab.path ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </LocalizationProvider>
      </SavingsProvider>
    </UserProvider>
  );
}

// PUBLIC_INTERFACE
export default App;