
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SunIcon, MoonIcon } from '../icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-dark-background/70 backdrop-blur-lg shadow-sm dark:shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">G</div>
            <h1 className="text-xl font-bold text-light-text dark:text-dark-text tracking-tight">
              GATE 2026 Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-semibold text-light-text dark:text-dark-text">{currentUser.name}</p>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            
            <button onClick={onToggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center bg-light-background dark:bg-dark-card shadow-neumorphic-light dark:shadow-neumorphic-dark focus:outline-none focus:ring-2 focus:ring-primary">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'moon' : 'sun'}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-indigo-500" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
