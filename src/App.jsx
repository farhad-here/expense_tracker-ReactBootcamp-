import { useState, useContext } from 'react';
import { AuthContext, AuthProvider } from './components/context/AuthContext.jsx';
import { AppProvider } from './components/context/AppContext.jsx';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import { ReminderProvider } from './components/context/ReminderContext.jsx';
import { WalletProvider } from './components/context/WalletContext.jsx';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Dashboard />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <ReminderProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </ReminderProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
