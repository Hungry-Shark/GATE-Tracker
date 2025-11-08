
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardHeader, CardContent } from '../common/Card';
import { formatDistanceToNow } from 'date-fns';

const ProgressMonitor: React.FC = () => {
  const { student, tasks } = useAppContext();

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const recentActivities = completedTasks
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 10);
  
  const stats = [
    { label: 'Total XP', value: student.totalXP },
    { label: 'Level', value: student.level },
    { label: 'Current Streak', value: student.currentStreak },
    { label: 'Badges', value: student.badges.length },
    { label: 'Tasks Completed', value: completedTasks.length },
    { label: 'Tasks Pending', value: tasks.filter(t => t.status === 'pending').length },
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Student Progress Monitor</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="p-4 rounded-lg bg-light-background dark:bg-dark-background/50 text-center">
              <p className="text-2xl font-bold font-mono text-primary">{stat.value}</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentActivities.length > 0 ? recentActivities.map(task => (
              <div key={task.id} className="p-3 rounded-lg bg-light-background dark:bg-dark-background/50 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">Completed: <span className="text-light-text dark:text-dark-text">{task.title}</span></p>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{task.subject}</p>
                </div>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {formatDistanceToNow(new Date(task.completedAt!), { addSuffix: true })}
                </span>
              </div>
            )) : <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">No completed tasks yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressMonitor;
