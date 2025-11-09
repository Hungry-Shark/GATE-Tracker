
import React from 'react';
import { differenceInDays } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import { CalendarIcon, ChartBarIcon, CheckCircleIcon, FireIcon } from '../icons/Icons';
import { GATE_EXAM_DATE } from '../../constants';

const ProgressOverview: React.FC = () => {
  const { student, tasks } = useAppContext();
  
  if (!student) return null;
  
  const daysLeft = differenceInDays(GATE_EXAM_DATE, new Date());
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const weeklyTasks = tasks.filter(t => new Date(t.dueDate) >= oneWeekAgo && new Date(t.dueDate) <= today);
  const weeklyCompletedTasks = weeklyTasks.filter(t => t.status === 'completed').length;
  const weeklyCompletionRate = weeklyTasks.length > 0 ? Math.round((weeklyCompletedTasks / weeklyTasks.length) * 100) : 0;

  const stats = [
    { name: 'Days to GATE', value: daysLeft, icon: <CalendarIcon className="w-8 h-8 text-primary" />, unit: 'days' },
    { name: 'Overall Completion', value: completionPercentage, icon: <CheckCircleIcon className="w-8 h-8 text-success" />, unit: '%' },
    { name: 'Current Streak', value: student.currentStreak, icon: <FireIcon className="w-8 h-8 text-danger" />, unit: 'days' },
    { name: 'Weekly Rate', value: weeklyCompletionRate, icon: <ChartBarIcon className="w-8 h-8 text-secondary" />, unit: '%' },
  ];

  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {stats.map((stat) => (
          <div key={stat.name} className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-3 bg-gray-200 dark:bg-gray-800/80 rounded-full transition-colors duration-300">
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.name}</p>
            <p className="text-3xl font-bold font-mono text-gray-900 dark:text-white transition-colors duration-300">
              {stat.value}<span className="text-lg">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressOverview;
