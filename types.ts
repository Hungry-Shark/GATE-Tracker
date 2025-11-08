import React from 'react';

export interface Student {
  id: string;
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