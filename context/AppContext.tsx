
import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { Student, Task, Reward, BadgeKey, TaskStatus } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { isSameDay, isBefore, parseISO } from 'date-fns';
import { BADGES } from '../constants';

interface AppContextType {
  student: Student;
  tasks: Task[];
  rewards: Reward[];
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addReward: (reward: Omit<Reward, 'id' | 'redeemed'>) => void;
  redeemReward: (rewardId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialStudent: Student = {
  id: 'student1',
  name: 'GATE Aspirant',
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  badges: [],
  lastLogin: new Date().toISOString(),
};

const initialTasks: Task[] = [];

const initialRewards: Reward[] = [
    { id: 'reward1', title: 'One Day Off', description: 'Take a guilt-free day off from studying.', xpCost: 500, redeemed: false },
    { id: 'reward2', title: 'Movie/Gaming Break', description: 'Enjoy a 3-hour entertainment break.', xpCost: 1000, redeemed: false },
    { id: 'reward3', title: 'Dinner Treat', description: 'Get a dinner treat of your choice.', xpCost: 2000, redeemed: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = usePersistentState<Student>('gate-student', initialStudent);
  const [tasks, setTasks] = usePersistentState<Task[]>('gate-tasks', initialTasks);
  const [rewards, setRewards] = usePersistentState<Reward[]>('gate-rewards', initialRewards);

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

      if (xpChange !== 0) {
        setStudent(prevStudent => {
          const newStudent = { ...prevStudent, totalXP: prevStudent.totalXP + xpChange };
          const newBadges = status === 'completed' ? checkAchievements(newStudent, newTasks, task) : prevStudent.badges;
          return { ...newStudent, badges: newBadges as BadgeKey[] };
        });
      }

      return newTasks;
    });
  }, [setTasks, setStudent, checkAchievements]);

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      status: 'pending',
    };
    setTasks(prev => [...prev, newTask]);
  };
  
  const addReward = (reward: Omit<Reward, 'id' | 'redeemed'>) => {
    const newReward: Reward = {
      ...reward,
      id: `reward_${Date.now()}`,
      redeemed: false,
    };
    setRewards(prev => [...prev, newReward]);
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && !reward.redeemed && student.totalXP >= reward.xpCost) {
      setStudent(prev => ({...prev, totalXP: prev.totalXP - reward.xpCost}));
      setRewards(prev => prev.map(r => r.id === rewardId ? {...r, redeemed: true} : r));
    }
  };

  useEffect(() => {
    const today = new Date();
    const lastLoginDate = student.lastLogin ? parseISO(student.lastLogin) : new Date(0);
    
    if (!isSameDay(today, lastLoginDate)) {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      
      const completedYesterday = tasks.some(task => 
        task.status === 'completed' && task.completedAt && isSameDay(parseISO(task.completedAt), yesterday)
      );

      let newStreak = student.currentStreak;
      if (completedYesterday) {
        newStreak += 1;
      } else if (!isSameDay(today, lastLoginDate) && isBefore(lastLoginDate, yesterday)) {
        newStreak = 0;
      }

      setStudent(prev => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastLogin: today.toISOString()
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={{ student, tasks, rewards, addTask, updateTaskStatus, addReward, redeemReward }}>
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
