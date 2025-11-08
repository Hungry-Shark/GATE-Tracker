import React from 'react';
import type { Subject, Badge, BadgeKey } from './types';
import { AcademicCapIcon, ClockIcon, FireIcon, LightBulbIcon, SparklesIcon, TrophyIcon } from './components/icons/Icons';

export const GATE_EXAM_DATE = new Date('2026-02-08');

export const SUBJECTS: Subject[] = [
  { name: 'C Programming', color: 'bg-blue-500' },
  { name: 'Data Structures', color: 'bg-green-500' },
  { name: 'Algorithms', color: 'bg-yellow-500' },
  { name: 'Operating Systems', color: 'bg-red-500' },
  { name: 'Computer Networks', color: 'bg-purple-500' },
  { name: 'DBMS', color: 'bg-pink-500' },
  { name: 'COA', color: 'bg-indigo-500' },
  { name: 'Compiler Design', color: 'bg-cyan-500' },
  { name: 'Theory of Computation', color: 'bg-teal-500' },
  { name: 'Digital Logic', color: 'bg-orange-500' },
  { name: 'Eng. Mathematics', color: 'bg-lime-500' },
  { name: 'Discrete Mathematics', color: 'bg-fuchsia-500' },
];

export const LEVELS = [
  { level: 1, name: 'GATE Aspirant', minXp: 0 },
  { level: 11, name: 'GATE Warrior', minXp: 1000 },
  { level: 21, name: 'GATE Champion', minXp: 5000 },
  { level: 31, name: 'GATE Master', minXp: 10000 },
];

export const BADGES: Record<BadgeKey, Badge> = {
  EARLY_BIRD: {
    key: 'EARLY_BIRD',
    name: 'Early Bird',
    description: 'Complete 3 tasks before 9 AM.',
    // FIX: Use React.createElement instead of JSX syntax in a .ts file
    icon: React.createElement(ClockIcon, { className: "w-8 h-8" }),
  },
  NIGHT_OWL: {
    key: 'NIGHT_OWL',
    name: 'Night Owl',
    description: 'Complete 5 tasks after 10 PM.',
    // FIX: Use React.createElement instead of JSX syntax in a .ts file
    icon: React.createElement(LightBulbIcon, { className: "w-8 h-8" }),
  },
  STREAK_MASTER: {
    key: 'STREAK_MASTER',
    name: 'Streak Master',
    description: 'Maintain a 7-day completion streak.',
    // FIX: Use React.createElement instead of JSX syntax in a .ts file
    icon: React.createElement(FireIcon, { className: "w-8 h-8" }),
  },
  SUBJECT_CHAMPION: {
    key: 'SUBJECT_CHAMPION',
    name: 'Subject Champion',
    description: 'Complete all tasks for one subject.',
    // FIX: Use React.createElement instead of JSX syntax in a .ts file
    icon: React.createElement(AcademicCapIcon, { className: "w-8 h-8" }),
  },
  TEST_ACE: {
    key: 'TEST_ACE',
    name: 'Test Ace',
    description: 'Complete 5 tasks of type "test".',
    // FIX: Use React.createElement instead of JSX syntax in a .ts file
    icon: React.createElement(TrophyIcon, { className: "w-8 h-8" }),
  },
  SPEED_RUNNER: {
    key: 'SPEED_RUNNER',
    name: 'Speed Runner',
    description: 'Complete 10 tasks in a single day.',
    // FIX: Use React.createElement instead of JSX syntax in a .ts file
    icon: React.createElement(SparklesIcon, { className: "w-8 h-8" }),
  },
};