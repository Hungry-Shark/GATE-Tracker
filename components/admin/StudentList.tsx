import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader, CardContent } from '../common/Card';

const StudentList: React.FC = () => {
  const { students, getTasksForStudent } = useAppContext();
  const { currentUser, students: adminStudents } = useAuth();

  // Get students assigned to current admin
  const assignedStudents = useMemo(() => {
    if (!currentUser || currentUser.role !== 'admin') return [];
    const studentIds = adminStudents[currentUser.id] || [];
    return studentIds.map(id => {
      const student = Object.values(students).find(s => s.userId === id);
      return student;
    }).filter(Boolean);
  }, [currentUser, adminStudents, students]);

  if (assignedStudents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">My Students</h2>
        </CardHeader>
        <CardContent>
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-4">
            No students assigned yet. Share your admin token with students so they can join.
          </p>
          {currentUser?.token && (
            <div className="mt-4 p-4 rounded-lg bg-light-background dark:bg-dark-background/50 border-2 border-primary">
              <p className="text-sm font-medium mb-2">Your Admin Token:</p>
              <p className="text-2xl font-mono font-bold text-center text-primary">{currentUser.token}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">My Students ({assignedStudents.length})</h2>
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
                className="p-4 rounded-lg bg-light-background dark:bg-dark-background/50 border border-light-border dark:border-dark-border"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Level {student.level} • {student.totalXP} XP
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {student.currentStreak} day streak
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2 rounded bg-primary/10">
                    <p className="text-lg font-bold text-primary">{completedTasks}</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Completed</p>
                  </div>
                  <div className="p-2 rounded bg-yellow-500/10">
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{pendingTasks}</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Pending</p>
                  </div>
                  <div className="p-2 rounded bg-green-500/10">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{student.badges.length}</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Badges</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {currentUser?.token && (
          <div className="mt-4 p-4 rounded-lg bg-light-background dark:bg-dark-background/50 border-2 border-primary">
            <p className="text-sm font-medium mb-2">Your Admin Token:</p>
            <p className="text-2xl font-mono font-bold text-center text-primary">{currentUser.token}</p>
            <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Share this with students so they can join
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;

