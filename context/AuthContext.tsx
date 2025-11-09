import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User, UserRole, Student } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  students: { [adminId: string]: string[] }; // adminId -> studentIds
  signup: (email: string, name: string, password: string, role: UserRole, adminToken?: string) => Promise<{ success: boolean; error?: string; token?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  generateToken: () => string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<{ [adminId: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const studentListenerRef = React.useRef<(() => void) | null>(null);

  // Generate a unique 5 alphanumeric token
  const generateToken = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 5; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }, []);

  // Check if token is unique in Firestore
  const isTokenUnique = useCallback(async (token: string): Promise<{ unique: boolean; error?: string }> => {
    try {
      const usersRef = collection(db, 'users');
      // Query only by token (simpler, less likely to need composite index)
      const q = query(usersRef, where('token', '==', token));
      const querySnapshot = await getDocs(q);
      
      // Check if any of the results are admins (tokens are only for admins)
      const hasAdminWithToken = querySnapshot.docs.some(doc => {
        const data = doc.data();
        return data.role === 'admin' && data.token === token;
      });
      
      return { unique: !hasAdminWithToken };
    } catch (error: any) {
      console.error('Error checking token uniqueness:', error);
      
      // Handle specific Firestore errors with user-friendly messages
      if (error.code === 'permission-denied') {
        return { 
          unique: false, 
          error: 'Unable to verify token. Please contact support if this issue persists.' 
        };
      }
      if (error.code === 'failed-precondition') {
        // Firestore needs an index - provide helpful but non-technical message
        return { 
          unique: false, 
          error: 'System configuration required. Please contact your administrator.' 
        };
      }
      
      // For network errors, we'll proceed but log a warning
      // This allows signup to work even with temporary network issues
      console.warn('Token uniqueness check failed (network issue?), proceeding:', error.message);
      return { unique: true, error: error.message };
    }
  }, []);

  // Load user data from Firestore
  const loadUserData = useCallback(async (uid: string) => {
    try {
      // Clean up previous listener if exists
      if (studentListenerRef.current) {
        studentListenerRef.current();
        studentListenerRef.current = null;
      }

      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setCurrentUser({ ...userData, id: uid });
        
        // Load admin-student relationships with real-time listener
        if (userData.role === 'admin') {
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('adminId', '==', uid));
          
          // Use onSnapshot for real-time updates when new students sign up
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const studentIds = querySnapshot.docs.map(doc => doc.data().userId);
            setStudents(prev => ({ ...prev, [uid]: studentIds }));
          }, (error) => {
            console.error('Error listening to students:', error);
          });
          
          // Store unsubscribe function for cleanup
          studentListenerRef.current = unsubscribe;
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Don't block loading - load user data in background
        setLoading(false);
        loadUserData(user.uid).catch(console.error);
      } else {
        setCurrentUser(null);
        setStudents({});
        setLoading(false);
        // Clean up student listener when user logs out
        if (studentListenerRef.current) {
          studentListenerRef.current();
          studentListenerRef.current = null;
        }
      }
    });

    return () => {
      unsubscribe();
      // Clean up student listener on unmount
      if (studentListenerRef.current) {
        studentListenerRef.current();
        studentListenerRef.current = null;
      }
    };
  }, [loadUserData]);

  const signup = useCallback(async (email: string, name: string, password: string, role: UserRole, adminToken?: string) => {
    try {
      let token: string | undefined;
      let adminId: string | undefined;

      if (role === 'admin') {
        // Generate unique token for admin
        let newToken = generateToken();
        let attempts = 0;
        let lastError: string | undefined;
        let foundUnique = false;
        
        while (attempts < 20) { // Reduced attempts for faster feedback
          const result = await isTokenUnique(newToken);
          
          if (result.unique && !result.error) {
            // Token is confirmed unique
            token = newToken;
            foundUnique = true;
            break;
          }
          
          if (result.error) {
            lastError = result.error;
            // If it's a system error, fail immediately with user-friendly message
            if (result.error.includes('Unable to verify') || result.error.includes('System configuration')) {
              return { success: false, error: result.error };
            }
            // For other errors, continue trying but log them
            console.warn(`Token check attempt ${attempts + 1} failed:`, result.error);
          }
          
          // Generate new token and try again
          newToken = generateToken();
          attempts++;
        }
        
        // If we didn't find a unique token
        if (!foundUnique) {
          // If there was a system error, return it
          if (lastError && (lastError.includes('Unable to verify') || lastError.includes('System configuration'))) {
            return { success: false, error: lastError };
          }
          
          // If we just couldn't verify uniqueness (network issues, etc.), 
          // proceed anyway since collision probability is extremely low (1 in 60 million)
          // But use the last generated token
          console.warn('Could not verify token uniqueness, but proceeding with token:', newToken);
          token = newToken;
        }
      } else if (role === 'student') {
        // Student must provide admin token
        if (!adminToken) {
          return { success: false, error: 'Admin token is required for student signup' };
        }
        
        // Find admin with this token in Firestore
        const usersRef = collection(db, 'users');
        // Query by token only, then filter by role client-side to avoid composite index requirement
        const q = query(usersRef, where('token', '==', adminToken));
        const querySnapshot = await getDocs(q);
        
        // Filter for admin role client-side
        const adminDocs = querySnapshot.docs.filter(doc => doc.data().role === 'admin');
        
        if (adminDocs.length === 0) {
          return { success: false, error: 'The admin token you entered is invalid. Please check with your administrator.' };
        }
        
        const adminDoc = adminDocs[0];
        adminId = adminDoc.id;
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Create user document in Firestore
      // Only include adminId if it's defined (for students)
      const userData: any = {
        email,
        name,
        role,
        createdAt: serverTimestamp(),
      };
      
      // Only add token if it exists (for admins)
      if (token) {
        userData.token = token;
      }
      
      // Only add adminId if it exists (for students)
      if (adminId) {
        userData.adminId = adminId;
      }

      await setDoc(doc(db, 'users', uid), userData);

      // If student, create student progress document and add to admin's student collection
      if (role === 'student' && adminId) {
        const studentId = `student_${uid}`;
        const newStudent: Student = {
          id: studentId,
          userId: uid,
          name: name,
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          badges: [],
          lastLogin: new Date().toISOString(),
        };

        await setDoc(doc(db, 'students', studentId), {
          ...newStudent,
          adminId: adminId,
          createdAt: serverTimestamp(),
        });

        // Update admin's student list
        setStudents(prev => ({
          ...prev,
          [adminId!]: [...(prev[adminId!] || []), uid],
        }));
      }

      return { success: true, token: role === 'admin' ? token : undefined };
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'This email is already registered. Please use a different email or try logging in.' };
      }
      return { success: false, error: 'Unable to create your account. Please try again later.' };
    }
  }, [generateToken, isTokenUnique]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
      }
      return { success: false, error: 'Unable to sign in. Please try again later.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setStudents({});
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      firebaseUser,
      students, 
      signup, 
      login, 
      logout, 
      generateToken,
      loading 
    }}>
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
