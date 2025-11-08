
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
    <header className="sticky top-0 z-50 bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 shadow-lg shadow-orange-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/50">
              G
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              GATE 2026 Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-right">
                  <p className="font-semibold text-white">{currentUser.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-700 text-red-300 text-sm font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            
            <button onClick={onToggleTheme} className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all">
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
