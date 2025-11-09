
import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader, CardContent } from '../common/Card';
import { formatDistanceToNow } from 'date-fns';

const ProgressMonitor: React.FC = () => {
  const { tasks, students, getTasksForStudent } = useAppContext();
  const { currentUser, students: adminStudents } = useAuth();

  // Get all tasks for all students under this admin
  const allAdminTasks = useMemo(() => {
    if (!currentUser || currentUser.role !== 'admin') return [];
    const studentIds = adminStudents[currentUser.id] || [];
    return studentIds.flatMap(id => {
      const student = Object.values(students).find(s => s.userId === id);
      return student ? getTasksForStudent(student.id) : [];
    });
  }, [currentUser, adminStudents, students, getTasksForStudent]);

  const completedTasks = allAdminTasks.filter(t => t.status === 'completed');
  const recentActivities = completedTasks
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 10);
  
  // Aggregate stats across all students
  const totalXP = Object.values(students)
    .filter(s => adminStudents[currentUser?.id || '']?.includes(s.userId))
    .reduce((sum, s) => sum + s.totalXP, 0);
  const totalBadges = Object.values(students)
    .filter(s => adminStudents[currentUser?.id || '']?.includes(s.userId))
    .reduce((sum, s) => sum + s.badges.length, 0);
  
  const stats = [
    { label: 'Total XP (All Students)', value: totalXP },
    { label: 'Total Students', value: adminStudents[currentUser?.id || '']?.length || 0 },
    { label: 'Total Badges', value: totalBadges },
    { label: 'Tasks Completed', value: completedTasks.length },
    { label: 'Tasks Pending', value: allAdminTasks.filter(t => t.status === 'pending').length },
    { label: 'Total Tasks', value: allAdminTasks.length },
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Student Progress Monitor</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
              <p className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.label}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">Recent Activity</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentActivities.length > 0 ? recentActivities.map(task => (
              <div key={task.id} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm transition-colors duration-300">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Completed: <span className="text-gray-900 dark:text-white transition-colors duration-300">{task.title}</span></p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{task.subject}</p>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  {formatDistanceToNow(new Date(task.completedAt!), { addSuffix: true })}
                </span>
              </div>
            )) : <p className="text-center text-gray-600 dark:text-gray-400 transition-colors duration-300">No completed tasks yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressMonitor;
