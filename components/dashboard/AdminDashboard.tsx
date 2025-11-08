
import React from 'react';
import TaskAssignment from '../admin/TaskAssignment';
import ProgressMonitor from '../admin/ProgressMonitor';
import RewardManagement from '../admin/RewardManagement';
import StudentList from '../admin/StudentList';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const AdminDashboard: React.FC = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <StudentList />
      </motion.div>
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-1">
          <TaskAssignment />
        </div>
        <div className="lg:col-span-2">
          <ProgressMonitor />
        </div>
      </motion.div>
      <motion.div variants={itemVariants}>
        <RewardManagement />
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
