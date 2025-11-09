import React, { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Student, Task, Reward, BadgeKey, TaskStatus } from '../types';
import { isSameDay, isBefore, parseISO } from 'date-fns';
import { BADGES } from '../constants';
import { useAuth } from './AuthContext';

interface AppContextType {
  student: Student | null;
  students: { [studentId: string]: Student }; // All students (for admin view)
  tasks: Task[];
  rewards: Reward[];
  addTask: (task: Omit<Task, 'id' | 'status' | 'studentId'>, studentId?: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  addReward: (reward: Omit<Reward, 'id' | 'redeemed'>) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<void>;
  getStudentById: (studentId: string) => Student | null;
  getTasksForStudent: (studentId: string) => Task[];
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialRewards: Reward[] = [
    { id: 'reward1', title: 'One Day Off', description: 'Take a guilt-free day off from studying.', xpCost: 500, redeemed: false },
    { id: 'reward2', title: 'Movie/Gaming Break', description: 'Enjoy a 3-hour entertainment break.', xpCost: 1000, redeemed: false },
    { id: 'reward3', title: 'Dinner Treat', description: 'Get a dinner treat of your choice.', xpCost: 2000, redeemed: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser, students: adminStudents } = useAuth();
  const [students, setStudents] = useState<{ [studentId: string]: Student }>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [loading, setLoading] = useState(true);

  // Get current student based on logged-in user
  const student = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') return null;
    const studentId = Object.keys(students).find(sId => students[sId].userId === currentUser.id);
    return studentId ? students[studentId] : null;
  }, [currentUser, students]);

  // Initialize student if user is student and doesn't have one
  useEffect(() => {
    if (currentUser && currentUser.role === 'student' && !loading) {
      const existingStudent = Object.values(students).find(s => s.userId === currentUser.id);
      if (!existingStudent && currentUser.adminId) {
        // Only create student if adminId exists (student was properly registered)
        const newStudent: Student = {
          id: `student_${currentUser.id}`,
          userId: currentUser.id,
          name: currentUser.name,
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          badges: [],
          lastLogin: new Date().toISOString(),
        };
        
        // Save to Firestore with adminId
        setDoc(doc(db, 'students', newStudent.id), {
          ...newStudent,
          adminId: currentUser.adminId,
          createdAt: serverTimestamp(),
        }).catch(console.error);
      }
    }
  }, [currentUser, students, loading]);

  // Load students data from Firestore
  useEffect(() => {
    if (!currentUser || loading) return;

    let unsubscribe: (() => void) | undefined;

    if (currentUser.role === 'admin') {
      // Use real-time listener for admin's students
      const studentsRef = collection(db, 'students');
      const q = query(studentsRef, where('adminId', '==', currentUser.id));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const studentsData: { [key: string]: Student } = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          studentsData[doc.id] = { ...data, id: doc.id } as Student;
        });
        setStudents(studentsData);
      }, (error) => {
        console.error('Error listening to admin students:', error);
      });
    } else if (currentUser.role === 'student') {
      // Load current student's data
      const studentsRef = collection(db, 'students');
      const q = query(studentsRef, where('userId', '==', currentUser.id));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const studentsData: { [key: string]: Student } = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          studentsData[doc.id] = { ...data, id: doc.id } as Student;
        });
        setStudents(studentsData);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, loading]);

  // Load tasks from Firestore
  useEffect(() => {
    if (!currentUser || loading) return;

    let unsubscribe: (() => void) | undefined;

    if (currentUser.role === 'admin') {
      // Load all tasks for students assigned to this admin
      // Get student document IDs from the students state
      const studentDocIds = Object.keys(students);
      if (studentDocIds.length > 0) {
        // Firestore "in" query has a limit of 10 items, so we need to handle this
        // For now, we'll load all tasks and filter client-side if needed
        // Or we can make multiple queries if studentDocIds.length > 10
        const tasksRef = collection(db, 'tasks');
        
        if (studentDocIds.length <= 10) {
          const q = query(tasksRef, where('studentId', 'in', studentDocIds));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData: Task[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              tasksData.push({ ...data, id: doc.id } as Task);
            });
            setTasks(tasksData);
          });
        } else {
          // If more than 10 students, load all tasks and filter client-side
          unsubscribe = onSnapshot(tasksRef, (querySnapshot) => {
            const tasksData: Task[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const task = { ...data, id: doc.id } as Task;
              if (studentDocIds.includes(task.studentId)) {
                tasksData.push(task);
              }
            });
            setTasks(tasksData);
          });
        }
      }
    } else if (currentUser.role === 'student' && student) {
      // Load tasks for current student
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('studentId', '==', student.id));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tasksData.push({ ...data, id: doc.id } as Task);
        });
        setTasks(tasksData);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, student, adminStudents, students, loading]);

  // Load rewards from Firestore
  useEffect(() => {
    if (!currentUser || loading) return;

    const rewardsRef = collection(db, 'rewards');
    const unsubscribe = onSnapshot(rewardsRef, async (querySnapshot) => {
      if (querySnapshot.empty) {
        // Initialize default rewards if none exist
        const initRewards = async () => {
          await Promise.all(
            initialRewards.map((reward) => 
              setDoc(doc(db, 'rewards', reward.id), reward)
            )
          );
          setRewards(initialRewards);
        };
        initRewards();
      } else {
        const rewardsData: Reward[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          rewardsData.push({ ...data, id: doc.id } as Reward);
        });
        setRewards(rewardsData);
      }
    });

    return () => unsubscribe();
  }, [currentUser, loading]);

  // Set loading to false after initial load
  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const checkAchievements = useCallback((updatedStudent: Student, updatedTasks: Task[], completedTask: Task) => {
    const newBadges = new Set(updatedStudent.badges);

    // Early Bird
    if (completedTask.completedAt && new Date(completedTask.completedAt).getHours() < 9) {
        const earlyBirdTasks = updatedTasks.filter(t => t.status === 'completed' && t.completedAt && new Date(t.completedAt).getHours() < 9).length;
        if (earlyBirdTasks >= 3) newBadges.add('EARLY_BIRD');
    }
    
    // Night Owl
    if (completedTask.completedAt && new Date(completedTask.completedAt).getHours() >= 22) {
        const nightOwlTasks = updatedTasks.filter(t => t.status === 'completed' && t.completedAt && new Date(t.completedAt).getHours() >= 22).length;
        if (nightOwlTasks >= 5) newBadges.add('NIGHT_OWL');
    }

    // Streak Master
    if (updatedStudent.currentStreak >= 7) {
        newBadges.add('STREAK_MASTER');
    }

    // Subject Champion
    const subjectTasks = updatedTasks.filter(t => t.subject === completedTask.subject);
    if (subjectTasks.every(t => t.status === 'completed')) {
        newBadges.add('SUBJECT_CHAMPION');
    }

    // Test Ace
    const testTasks = updatedTasks.filter(t => t.type === 'test' && t.status === 'completed').length;
    if (testTasks >= 5) {
        newBadges.add('TEST_ACE');
    }

    // Speed Runner
    const todayCompleted = updatedTasks.filter(t => t.status === 'completed' && t.completedAt && isSameDay(new Date(t.completedAt), new Date())).length;
    if (todayCompleted >= 10) {
        newBadges.add('SPEED_RUNNER');
    }
    
    return Array.from(newBadges);
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskRef);
      
      if (!taskDoc.exists()) return;

      const task = { ...taskDoc.data(), id: taskDoc.id } as Task;
      const oldStatus = task.status;
      
      const updateData: any = { status };
      if (status === 'completed' && oldStatus !== 'completed') {
        updateData.completedAt = new Date().toISOString();
      } else if (oldStatus === 'completed' && status !== 'completed') {
        updateData.completedAt = null;
      }

      await updateDoc(taskRef, updateData);

      // Update student XP
      if (task.studentId) {
        const studentRef = doc(db, 'students', task.studentId);
        const studentDoc = await getDoc(studentRef);
        
        if (studentDoc.exists()) {
          const studentData = studentDoc.data() as Student;
          let xpChange = 0;
          
          if (status === 'completed' && oldStatus !== 'completed') {
            xpChange = task.xpReward;
          } else if (oldStatus === 'completed' && status !== 'completed') {
            xpChange = -task.xpReward;
          }

          if (xpChange !== 0) {
            const newXP = studentData.totalXP + xpChange;
            const newStudent = { ...studentData, totalXP: newXP };
            const newBadges = status === 'completed' ? checkAchievements(newStudent, tasks, task) : studentData.badges;
            
            await updateDoc(studentRef, {
              totalXP: newXP,
              badges: newBadges,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, [tasks, checkAchievements]);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'status' | 'studentId'>, studentId?: string) => {
    try {
      const targetStudentId = studentId || (currentUser && currentUser.role === 'student' ? Object.keys(students).find(sId => students[sId].userId === currentUser.id) : undefined);
      if (!targetStudentId) return;
      
      const newTask: Omit<Task, 'id'> = {
        ...task,
        status: 'pending',
        studentId: targetStudentId,
      };
      
      const taskRef = doc(collection(db, 'tasks'));
      await setDoc(taskRef, {
        ...newTask,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [currentUser, students]);

  const addReward = useCallback(async (reward: Omit<Reward, 'id' | 'redeemed'>) => {
    try {
      const newReward: Omit<Reward, 'id'> = {
        ...reward,
        redeemed: false,
      };
      
      const rewardRef = doc(collection(db, 'rewards'));
      await setDoc(rewardRef, {
        ...newReward,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding reward:', error);
    }
  }, []);

  const redeemReward = useCallback(async (rewardId: string) => {
    if (!student) return;
    
    try {
      const rewardRef = doc(db, 'rewards', rewardId);
      const rewardDoc = await getDoc(rewardRef);
      
      if (!rewardDoc.exists()) return;
      
      const reward = { ...rewardDoc.data(), id: rewardDoc.id } as Reward;
      
      if (reward.redeemed || student.totalXP < reward.xpCost) return;

      const studentRef = doc(db, 'students', student.id);
      await updateDoc(studentRef, {
        totalXP: student.totalXP - reward.xpCost,
      });

      await updateDoc(rewardRef, {
        redeemed: true,
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  }, [student]);

  useEffect(() => {
    if (!student) return;
    
    const today = new Date();
    const lastLoginDate = student.lastLogin ? parseISO(student.lastLogin) : new Date(0);
    
    if (!isSameDay(today, lastLoginDate)) {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      
      const studentTasks = tasks.filter(t => t.studentId === student.id);
      const completedYesterday = studentTasks.some(task => 
        task.status === 'completed' && task.completedAt && isSameDay(parseISO(task.completedAt), yesterday)
      );

      let newStreak = student.currentStreak;
      if (completedYesterday) {
        newStreak += 1;
      } else if (!isSameDay(today, lastLoginDate) && isBefore(lastLoginDate, yesterday)) {
        newStreak = 0;
      }

      const studentRef = doc(db, 'students', student.id);
      updateDoc(studentRef, {
        currentStreak: newStreak,
        longestStreak: Math.max(student.longestStreak, newStreak),
        lastLogin: today.toISOString(),
      }).catch(console.error);
    }
  }, [student, tasks]);

  const getStudentById = useCallback((studentId: string) => {
    return students[studentId] || null;
  }, [students]);

  const getTasksForStudent = useCallback((studentId: string) => {
    return tasks.filter(t => t.studentId === studentId);
  }, [tasks]);

  // Filter tasks for current student if logged in as student
  const filteredTasks = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student' || !student) return [];
    return tasks.filter(t => t.studentId === student.id);
  }, [currentUser, student, tasks]);

  const tasksToUse = currentUser?.role === 'student' ? filteredTasks : tasks;

  return (
    <AppContext.Provider value={{ 
      student, 
      students, 
      tasks: tasksToUse, 
      rewards, 
      addTask, 
      updateTaskStatus, 
      addReward, 
      redeemReward,
      getStudentById,
      getTasksForStudent,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
