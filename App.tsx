
import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import StudentDashboard from './components/dashboard/StudentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Header from './components/common/Header';
import type { View } from './types';

function App() {
  const [view, setView] = useState<View>('student');
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

  return (
    <AppProvider>
      <div className="min-h-screen font-sans text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background transition-colors duration-300">
        <Header 
          currentView={view} 
          onViewChange={setView} 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme} 
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {view === 'student' ? <StudentDashboard /> : <AdminDashboard />}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
