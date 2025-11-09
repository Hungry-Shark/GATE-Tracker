
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SUBJECTS } from '../../constants';
import type { TaskType, TaskPriority } from '../../types';
import Card, { CardHeader, CardContent } from '../common/Card';

const TaskAssignment: React.FC = () => {
  const { addTask, students } = useAppContext();
  const { currentUser } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0].name);
  const [type, setType] = useState<TaskType>('lecture');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedTime, setEstimatedTime] = useState(60);
  const [xpReward, setXpReward] = useState(20);

  // Get students assigned to current admin
  // Since AppContext now queries students by adminId, we can use them directly
  const assignedStudents = useMemo(() => {
    if (!currentUser || currentUser.role !== 'admin') return [];
    // Students in AppContext are already filtered by adminId via real-time listener
    return Object.values(students).filter(s => s.adminId === currentUser.id);
  }, [currentUser, students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedStudentId) return;
    addTask({ title, subject, type, priority, dueDate, estimatedTime, xpReward }, selectedStudentId);
    setTitle('');
    setSelectedStudentId('');
  };

  const commonInputClass = "w-full p-2 rounded-md bg-white dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300";

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Assign Task</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Assign to Student</label>
            <select 
              value={selectedStudentId} 
              onChange={e => setSelectedStudentId(e.target.value)} 
              className={commonInputClass}
              required
            >
              <option value="">Select a student...</option>
              {assignedStudents.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
            {assignedStudents.length === 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                No students assigned yet. Share your token with students to get started.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={commonInputClass} placeholder="e.g., Watch Lecture 5 on OS" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className={commonInputClass}>
              {SUBJECTS.map(s => <option key={s.name} value={s.name} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Type</label>
              <select value={type} onChange={e => setType(e.target.value as TaskType)} className={commonInputClass}>
                <option value="lecture" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Lecture</option>
                <option value="practice" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Practice</option>
                <option value="test" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Test</option>
                <option value="revision" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Revision</option>
                <option value="notes" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Notes</option>
                <option value="doubt" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Doubt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className={commonInputClass}>
                <option value="high" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">High</option>
                <option value="medium" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Medium</option>
                <option value="low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Low</option>
              </select>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Time (min)</label>
              <input type="number" value={estimatedTime} onChange={e => setEstimatedTime(Number(e.target.value))} className={commonInputClass} min="10" step="5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">XP Reward</label>
              <input type="number" value={xpReward} onChange={e => setXpReward(Number(e.target.value))} className={commonInputClass} min="5" step="5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={commonInputClass} />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30">
            Add Task
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskAssignment;
