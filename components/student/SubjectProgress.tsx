
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { SUBJECTS } from '../../constants';
import Card, { CardHeader, CardContent } from '../common/Card';
import { motion } from 'framer-motion';

const SubjectCard: React.FC<{ subject: typeof SUBJECTS[0] }> = ({ subject }) => {
  const { tasks } = useAppContext();
  const subjectTasks = tasks.filter(t => t.subject === subject.name);
  const completedTasks = subjectTasks.filter(t => t.status === 'completed').length;
  const totalTasks = subjectTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const lastActivity = subjectTasks
    .filter(t => t.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0]?.completedAt;

  return (
    <motion.div
      className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      whileHover={{ y: -5 }}
    >
      <div className={`h-2 ${subject.color}`} style={{ width: `${progress}%` }}></div>
      <div className="p-4">
        <h4 className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{subject.name}</h4>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <span>Progress</span>
          <span className="font-mono font-semibold text-gray-900 dark:text-white transition-colors duration-300">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2.5 my-2 transition-colors duration-300">
          <div className={`${subject.color} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <span>{completedTasks}/{totalTasks} tasks</span>
          {lastActivity && <span>Last active: {new Date(lastActivity).toLocaleDateString()}</span>}
        </div>
      </div>
    </motion.div>
  );
};


const SubjectProgress: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Subject Progress</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SUBJECTS.map(subject => (
            <SubjectCard key={subject.name} subject={subject} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectProgress;
