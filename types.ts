import React from 'react';

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string; // For admins: their unique token, for students: the admin token they used
  adminId?: string; // For students: the admin they're assigned to
  createdAt: string; // ISO string
}

export interface Student {
  id: string;
  userId: string; // Links to User.id
  name: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: BadgeKey[];
  lastLogin: string; // ISO string
}

export type TaskType = 'lecture' | 'practice' | 'test' | 'revision' | 'notes' | 'doubt';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';

export interface Task {
  id: string;
  studentId: string; // Which student this task is assigned to
  title: string;
  subject: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string; // ISO string
  estimatedTime: number; // in minutes
  xpReward: number;
  status: TaskStatus;
  completedAt?: string; // ISO string
}

export interface Reward {
  id:string;
  title: string;
  description: string;
  xpCost: number;
  redeemed: boolean;
}

export type BadgeKey = 'EARLY_BIRD' | 'NIGHT_OWL' | 'STREAK_MASTER' | 'SUBJECT_CHAMPION' | 'TEST_ACE' | 'SPEED_RUNNER';

export interface Badge {
  key: BadgeKey;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Subject {
    name: string;
    color: string;
}

export type View = 'student' | 'admin';