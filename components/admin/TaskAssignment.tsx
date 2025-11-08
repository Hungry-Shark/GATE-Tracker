
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SUBJECTS } from '../../constants';
import type { TaskType, TaskPriority } from '../../types';
import Card, { CardHeader, CardContent } from '../common/Card';

const TaskAssignment: React.FC = () => {
  const { addTask } = useAppContext();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0].name);
  const [type, setType] = useState<TaskType>('lecture');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedTime, setEstimatedTime] = useState(60);
  const [xpReward, setXpReward] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addTask({ title, subject, type, priority, dueDate, estimatedTime, xpReward });
    setTitle('');
  };

  const commonInputClass = "w-full p-2 rounded-md bg-light-background dark:bg-dark-background/50 border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Assign Task</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={commonInputClass} placeholder="e.g., Watch Lecture 5 on OS" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className={commonInputClass}>
              {SUBJECTS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as TaskType)} className={commonInputClass}>
                <option value="lecture">Lecture</option>
                <option value="practice">Practice</option>
                <option value="test">Test</option>
                <option value="revision">Revision</option>
                <option value="notes">Notes</option>
                <option value="doubt">Doubt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className={commonInputClass}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Time (min)</label>
              <input type="number" value={estimatedTime} onChange={e => setEstimatedTime(Number(e.target.value))} className={commonInputClass} min="10" step="5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">XP Reward</label>
              <input type="number" value={xpReward} onChange={e => setXpReward(Number(e.target.value))} className={commonInputClass} min="5" step="5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={commonInputClass} />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
            Add Task
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskAssignment;
