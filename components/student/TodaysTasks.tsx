
import React, { useState } from 'react';
import { isToday } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import type { Task, TaskPriority } from '../../types';
import Card, { CardHeader, CardContent } from '../common/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, XMarkIcon, ChevronDownIcon } from '../icons/Icons';
import { SUBJECTS } from '../../constants';

const priorityConfig = {
  high: { label: 'High', color: 'bg-danger/80', textColor: 'text-white' },
  medium: { label: 'Medium', color: 'bg-warning/80', textColor: 'text-white' },
  low: { label: 'Low', color: 'bg-secondary/80', textColor: 'text-white' },
};

const TaskItem: React.FC<{ task: Task, onUpdate: (id: string, status: 'completed' | 'skipped') => void }> = ({ task, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const subject = SUBJECTS.find(s => s.name === task.subject);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`p-3 rounded-lg flex flex-col transition-shadow duration-200 border ${task.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'} transition-colors duration-300`}
    >
      <div className="flex items-center">
        <div className="flex-grow flex items-center space-x-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className={`w-3 h-3 rounded-full ${subject?.color || 'bg-gray-400'}`}></div>
          <div className="flex-grow">
            <p className={`font-medium transition-colors duration-300 ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{task.subject} • {task.estimatedTime} min</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button onClick={() => onUpdate(task.id, 'completed')} className="w-8 h-8 rounded-full flex items-center justify-center bg-success/80 hover:bg-success text-white transition-all transform hover:scale-110">
            <CheckIcon className="w-5 h-5" />
          </button>
          <button onClick={() => onUpdate(task.id, 'skipped')} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400/80 hover:bg-gray-500 text-white transition-all transform hover:scale-110">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300"
          >
            <p>Type: <span className="font-semibold">{task.type}</span></p>
            <p>Due: <span className="font-semibold">{new Date(task.dueDate).toLocaleDateString()}</span></p>
            <p>XP: <span className="font-semibold">{task.xpReward}</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TaskGroup: React.FC<{ priority: TaskPriority; tasks: Task[] }> = ({ priority, tasks }) => {
  const { updateTaskStatus } = useAppContext();
  const config = priorityConfig[priority];
  if (tasks.length === 0) return null;

  return (
    <div>
      <h3 className={`px-3 py-1 text-sm font-bold rounded-full inline-block ${config.color} ${config.textColor} mb-2`}>
        {config.label} Priority
      </h3>
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onUpdate={updateTaskStatus} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TodaysTasks: React.FC = () => {
  const { tasks } = useAppContext();
  const todaysTasks = tasks.filter(task => isToday(new Date(task.dueDate)) && task.status === 'pending');

  const highPriorityTasks = todaysTasks.filter(t => t.priority === 'high');
  const mediumPriorityTasks = todaysTasks.filter(t => t.priority === 'medium');
  const lowPriorityTasks = todaysTasks.filter(t => t.priority === 'low');

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Today's Tasks</h2>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[450px] overflow-y-auto">
        {todaysTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <p>🎉 All tasks for today are done!</p>
            <p className="text-sm">Great job! Time for a well-deserved break.</p>
          </div>
        ) : (
          <>
            <TaskGroup priority="high" tasks={highPriorityTasks} />
            <TaskGroup priority="medium" tasks={mediumPriorityTasks} />
            <TaskGroup priority="low" tasks={lowPriorityTasks} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysTasks;
