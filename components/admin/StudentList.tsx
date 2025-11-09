import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader, CardContent } from '../common/Card';

const StudentList: React.FC = () => {
  const { students, getTasksForStudent } = useAppContext();
  const { currentUser } = useAuth();

  // Get students assigned to current admin
  // Since AppContext now queries students by adminId, we can use them directly
  const assignedStudents = useMemo(() => {
    if (!currentUser || currentUser.role !== 'admin') return [];
    // Students in AppContext are already filtered by adminId via real-time listener
    return Object.values(students).filter(s => s.adminId === currentUser.id);
  }, [currentUser, students]);

  if (assignedStudents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">My Students</h2>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400 py-4 transition-colors duration-300">
            No students assigned yet. Share your admin token with students so they can join.
          </p>
          {currentUser?.token && (
            <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border-2 border-orange-500 transition-colors duration-300">
              <p className="text-sm font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-300">Your Admin Token:</p>
              <p className="text-2xl font-mono font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{currentUser.token}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">My Students ({assignedStudents.length})</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignedStudents.map(student => {
            const studentTasks = getTasksForStudent(student.id);
            const completedTasks = studentTasks.filter(t => t.status === 'completed').length;
            const pendingTasks = studentTasks.filter(t => t.status === 'pending').length;
            
            return (
              <div
                key={student.id}
                className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white transition-colors duration-300">{student.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      Level {student.level} • {student.totalXP} XP
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {student.currentStreak} day streak
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2 rounded bg-orange-500/10">
                    <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{completedTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Completed</p>
                  </div>
                  <div className="p-2 rounded bg-yellow-500/10">
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-300">{pendingTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Pending</p>
                  </div>
                  <div className="p-2 rounded bg-green-500/10">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{student.badges.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Badges</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {currentUser?.token && (
          <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border-2 border-orange-500 transition-colors duration-300">
            <p className="text-sm font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-300">Your Admin Token:</p>
            <p className="text-2xl font-mono font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{currentUser.token}</p>
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
              Share this with students so they can join
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;

