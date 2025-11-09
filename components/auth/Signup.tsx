import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon } from '../icons/Icons';
import type { UserRole } from '../../types';

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState('');
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessToken(null);
    setIsLoading(true);
    
    try {
      // Normalize token before passing to signup
      const normalizedToken = role === 'student' && adminToken ? adminToken.trim().toUpperCase() : undefined;
      const result = await signup(email, name, password, role, normalizedToken);
      
      if (result.success) {
        if (role === 'admin' && result.token) {
          setSuccessToken(result.token);
        }
      } else {
        setError(result.error || 'Unable to create account. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClass = "w-full p-3 rounded-lg bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <button
          onClick={toggleTheme}
          className="absolute -top-12 right-0 w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDarkMode ? 'moon' : 'sun'}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-orange-400" />}
            </motion.div>
          </AnimatePresence>
        </button>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-8 transition-colors duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 transition-colors duration-300">Sign Up</h2>
          
          {successToken ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-900/30 border border-green-700 text-green-300">
                <p className="font-semibold mb-2">Account created successfully!</p>
                <p className="text-sm mb-3 text-gray-300">Your unique admin token is:</p>
                <div className="bg-gray-900/50 p-4 rounded-lg border-2 border-orange-500">
                  <p className="text-3xl font-mono font-bold text-center text-orange-500">{successToken}</p>
                </div>
                <p className="text-xs mt-3 text-center text-gray-400">Share this token with students so they can join under your account.</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30"
              >
                Continue to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={commonInputClass}
                  placeholder="Your Name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={commonInputClass}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={commonInputClass}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">I want to sign up as</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                      role === 'student'
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                      role === 'admin'
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
              
              {role === 'student' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">Admin Token</label>
                  <input
                    type="text"
                    value={adminToken}
                    onChange={e => setAdminToken(e.target.value.trim().toUpperCase().slice(0, 5))}
                    className={commonInputClass}
                    placeholder="Enter 5-character token"
                    maxLength={5}
                    required
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                    Enter the token provided by your admin
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
              
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold hover:underline transition-colors"
              >
                Login
              </button>
            </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
