
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen font-sans text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 animate-pulse">
            G
          </div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading...</p>
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

  // Show auth forms if not authenticated (Login/Signup components handle their own backgrounds)
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
      <div className="min-h-screen font-sans text-white bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme} 
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {currentUser.role === 'student' ? <StudentDashboard /> : <AdminDashboard />}
        </main>
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
