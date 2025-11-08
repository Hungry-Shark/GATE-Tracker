
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import StudentDashboard from './components/dashboard/StudentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Header from './components/common/Header';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

function AppContent() {
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!currentUser) {
    return (
      <div className="min-h-screen font-sans text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLogin ? (
            <Login onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen font-sans text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background transition-colors duration-300">
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
