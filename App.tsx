
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import StudentDashboard from './components/dashboard/StudentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Header from './components/common/Header';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import LandingPage from './components/landing/LandingPage';

type View = 'landing' | 'login' | 'signup';

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [view, setView] = useState<View>('landing');

  // Listen for navigation events from landing page
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      const path = (e.detail as { path: string }).path;
      if (path === 'login') setView('login');
      else if (path === 'signup') setView('signup');
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  // Show minimal loading state - only if truly needed
  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg shadow-orange-500/50 animate-pulse">
            G
          </div>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated and on landing view
  if (!currentUser && view === 'landing') {
    return (
      <div className="min-h-screen font-sans text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background transition-colors duration-300">
        <LandingPage />
      </div>
    );
  }

  // Show auth forms if not authenticated
  if (!currentUser) {
    return (
      <>
        {view === 'login' ? (
          <Login onSwitchToSignup={() => setView('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setView('login')} />
        )}
      </>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen font-sans text-light-text dark:text-dark-text bg-light-background dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-300">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          {currentUser.role === 'student' ? <StudentDashboard /> : <AdminDashboard />}
        </main>
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
