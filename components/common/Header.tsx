
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '../icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-lg shadow-orange-500/10 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/50">
              G
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
              GATE 2026 Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-right">
                  <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{currentUser.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize transition-colors duration-300">{currentUser.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm font-semibold transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
            
            <button onClick={toggleTheme} className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'moon' : 'sun'}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-orange-400" />}
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
