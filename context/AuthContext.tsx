import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  students: { [adminId: string]: string[] }; // adminId -> studentIds
  signup: (email: string, name: string, password: string, role: UserRole, adminToken?: string) => { success: boolean; error?: string; token?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  generateToken: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = usePersistentState<User[]>('gate-users', []);
  const [students, setStudents] = usePersistentState<{ [adminId: string]: string[] }>('gate-admin-students', {});
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('gate-current-user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Generate a unique 5 alphanumeric token
  const generateToken = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 5; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }, []);

  // Check if token is unique
  const isTokenUnique = useCallback((token: string, excludeUserId?: string) => {
    return !users.some(u => u.token === token && u.id !== excludeUserId);
  }, [users]);

  const signup = useCallback((email: string, name: string, password: string, role: UserRole, adminToken?: string) => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    let token: string | undefined;
    let adminId: string | undefined;

    if (role === 'admin') {
      // Generate unique token for admin
      let newToken = generateToken();
      let attempts = 0;
      while (!isTokenUnique(newToken) && attempts < 100) {
        newToken = generateToken();
        attempts++;
      }
      if (attempts >= 100) {
        return { success: false, error: 'Failed to generate unique token. Please try again.' };
      }
      token = newToken;
    } else if (role === 'student') {
      // Student must provide admin token
      if (!adminToken) {
        return { success: false, error: 'Admin token is required for student signup' };
      }
      
      // Find admin with this token
      const admin = users.find(u => u.role === 'admin' && u.token === adminToken);
      if (!admin) {
        return { success: false, error: 'Invalid admin token' };
      }
      
      adminId = admin.id;
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      role,
      token,
      adminId,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);

    // If student, add to admin's student list
    if (role === 'student' && adminId) {
      setStudents(prev => ({
        ...prev,
        [adminId]: [...(prev[adminId] || []), newUser.id],
      }));
    }

    // Auto-login after signup
    setCurrentUser(newUser);
    localStorage.setItem('gate-current-user', JSON.stringify(newUser));

    return { success: true, token: role === 'admin' ? token : undefined };
  }, [users, generateToken, isTokenUnique, setUsers, setStudents]);

  const login = useCallback((email: string, password: string) => {
    // Simple email-based login (no password verification for now)
    const user = users.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    setCurrentUser(user);
    localStorage.setItem('gate-current-user', JSON.stringify(user));
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('gate-current-user');
  }, []);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gate-current-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gate-current-user');
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, users, students, signup, login, logout, generateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

