import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader, CardContent } from '../common/Card';
import { motion } from 'framer-motion';
import type { UserRole } from '../../types';

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState('');
  const [successToken, setSuccessToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessToken(null);
    
    const result = signup(email, name, password, role, role === 'student' ? adminToken : undefined);
    
    if (result.success) {
      if (role === 'admin' && result.token) {
        setSuccessToken(result.token);
      }
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const commonInputClass = "w-full p-3 rounded-md bg-light-background dark:bg-dark-background/50 border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-8"
    >
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        </CardHeader>
        <CardContent>
          {successToken ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <p className="font-semibold mb-2">Account created successfully!</p>
                <p className="text-sm mb-3">Your unique admin token is:</p>
                <div className="bg-white dark:bg-dark-background p-3 rounded-md border-2 border-green-500">
                  <p className="text-2xl font-mono font-bold text-center text-primary">{successToken}</p>
                </div>
                <p className="text-xs mt-2 text-center">Share this token with students so they can join under your account.</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-dark transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
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
                <label className="block text-sm font-medium mb-1">Email</label>
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
                <label className="block text-sm font-medium mb-1">Password</label>
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
                <label className="block text-sm font-medium mb-1">I want to sign up as</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-md border-2 transition-colors ${
                      role === 'student'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background/50'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-md border-2 transition-colors ${
                      role === 'admin'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background/50'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
              {role === 'student' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Admin Token</label>
                  <input
                    type="text"
                    value={adminToken}
                    onChange={e => setAdminToken(e.target.value.toUpperCase())}
                    className={commonInputClass}
                    placeholder="Enter 5-character token"
                    maxLength={5}
                    required
                  />
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                    Enter the token provided by your admin
                  </p>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-dark transition-colors"
              >
                Sign Up
              </button>
              <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-primary hover:underline font-semibold"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Signup;

