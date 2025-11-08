
import React, { createContext, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { Student, Task, Reward, BadgeKey, TaskStatus } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { isSameDay, isBefore, parseISO } from 'date-fns';
import { BADGES } from '../constants';
import { useAuth } from './AuthContext';

interface AppContextType {
  student: Student | null;
  students: { [studentId: string]: Student }; // All students (for admin view)
  tasks: Task[];
  rewards: Reward[];
  addTask: (task: Omit<Task, 'id' | 'status' | 'studentId'>, studentId?: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addReward: (reward: Omit<Reward, 'id' | 'redeemed'>) => void;
  redeemReward: (rewardId: string) => void;
  getStudentById: (studentId: string) => Student | null;
  getTasksForStudent: (studentId: string) => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialRewards: Reward[] = [
    { id: 'reward1', title: 'One Day Off', description: 'Take a guilt-free day off from studying.', xpCost: 500, redeemed: false },
    { id: 'reward2', title: 'Movie/Gaming Break', description: 'Enjoy a 3-hour entertainment break.', xpCost: 1000, redeemed: false },
    { id: 'reward3', title: 'Dinner Treat', description: 'Get a dinner treat of your choice.', xpCost: 2000, redeemed: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [students, setStudents] = usePersistentState<{ [studentId: string]: Student }>('gate-students', {});
  const [tasks, setTasks] = usePersistentState<Task[]>('gate-tasks', []);
  const [rewards, setRewards] = usePersistentState<Reward[]>('gate-rewards', initialRewards);

  // Get current student based on logged-in user
  const student = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') return null;
    const studentId = Object.keys(students).find(sId => students[sId].userId === currentUser.id);
    return studentId ? students[studentId] : null;
  }, [currentUser, students]);

  // Initialize student if user is student and doesn't have one
  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      const existingStudent = Object.values(students).find(s => s.userId === currentUser.id);
      if (!existingStudent) {
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
        setStudents(prev => ({ ...prev, [newStudent.id]: newStudent }));
      }
    }
  }, [currentUser, students, setStudents]);

  const checkAchievements = useCallback((updatedStudent: Student, updatedTasks: Task[], completedTask: Task) => {
    const newBadges = new Set(updatedStudent.badges);

    // Early Bird
    if (new Date(completedTask.completedAt!).getHours() < 9) {
        const earlyBirdTasks = updatedTasks.filter(t => t.status === 'completed' && new Date(t.completedAt!).getHours() < 9).length;
        if (earlyBirdTasks >= 3) newBadges.add('EARLY_BIRD');
    }
    
    // Night Owl
    if (new Date(completedTask.completedAt!).getHours() >= 22) {
        const nightOwlTasks = updatedTasks.filter(t => t.status === 'completed' && new Date(t.completedAt!).getHours() >= 22).length;
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
    const todayCompleted = updatedTasks.filter(t => t.status === 'completed' && isSameDay(new Date(t.completedAt!), new Date())).length;
    if (todayCompleted >= 10) {
        newBadges.add('SPEED_RUNNER');
    }
    
    return Array.from(newBadges);
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = newTasks[taskIndex];
      const oldStatus = task.status;
      task.status = status;
      
      let xpChange = 0;
      if (status === 'completed' && oldStatus !== 'completed') {
        task.completedAt = new Date().toISOString();
        xpChange = task.xpReward;
      } else if (oldStatus === 'completed' && status !== 'completed') {
        xpChange = -task.xpReward;
        task.completedAt = undefined;
      }

      if (xpChange !== 0 && task.studentId) {
        setStudents(prevStudents => {
          const prevStudent = prevStudents[task.studentId];
          if (!prevStudent) return prevStudents;
          
          const newStudent = { ...prevStudent, totalXP: prevStudent.totalXP + xpChange };
          const newBadges = status === 'completed' ? checkAchievements(newStudent, newTasks.filter(t => t.studentId === task.studentId), task) : prevStudent.badges;
          return { ...prevStudents, [task.studentId]: { ...newStudent, badges: newBadges as BadgeKey[] } };
        });
      }

      return newTasks;
    });
  }, [setTasks, setStudents, checkAchievements]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'studentId'>, studentId?: string) => {
    const targetStudentId = studentId || (currentUser && currentUser.role === 'student' ? Object.keys(students).find(sId => students[sId].userId === currentUser.id) : undefined);
    if (!targetStudentId) return;
    
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      studentId: targetStudentId,
    };
    setTasks(prev => [...prev, newTask]);
  }, [currentUser, students, setTasks]);
  
  const addReward = (reward: Omit<Reward, 'id' | 'redeemed'>) => {
    const newReward: Reward = {
      ...reward,
      id: `reward_${Date.now()}`,
      redeemed: false,
    };
    setRewards(prev => [...prev, newReward]);
  };

  const redeemReward = useCallback((rewardId: string) => {
    if (!student) return;
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && !reward.redeemed && student.totalXP >= reward.xpCost) {
      setStudents(prev => ({ ...prev, [student.id]: { ...prev[student.id], totalXP: prev[student.id].totalXP - reward.xpCost } }));
      setRewards(prev => prev.map(r => r.id === rewardId ? {...r, redeemed: true} : r));
    }
  }, [student, rewards, setStudents, setRewards]);

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

      setStudents(prev => ({
        ...prev,
        [student.id]: {
          ...prev[student.id],
          currentStreak: newStreak,
          longestStreak: Math.max(prev[student.id].longestStreak, newStreak),
          lastLogin: today.toISOString()
        }
      }));
    }
  }, [student, tasks, setStudents]);

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
