
import React from 'react';
import TaskAssignment from '../admin/TaskAssignment';
import ProgressMonitor from '../admin/ProgressMonitor';
import RewardManagement from '../admin/RewardManagement';
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
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <motion.div variants={itemVariants} className="lg:col-span-1">
        <TaskAssignment />
      </motion.div>
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <ProgressMonitor />
      </motion.div>
      <motion.div variants={itemVariants} className="lg:col-span-3">
        <RewardManagement />
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
