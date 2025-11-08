
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import ProgressOverview from '../student/ProgressOverview';
import TodaysTasks from '../student/TodaysTasks';
import SubjectProgress from '../student/SubjectProgress';
import Rewards from '../student/Rewards';
import Analytics from '../student/Analytics';
import Card from '../common/Card';

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

const StudentDashboard: React.FC = () => {
  const { student } = useAppContext();

  if (!student) {
    return (
      <Card>
        <div className="p-8 text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Loading your dashboard...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <motion.div variants={itemVariants} className="lg:col-span-3 xl:col-span-4">
        <ProgressOverview />
      </motion.div>
      <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-2">
        <TodaysTasks />
      </motion.div>
      <motion.div variants={itemVariants} className="lg:col-span-1 xl:col-span-2">
        <Rewards />
      </motion.div>
      <motion.div variants={itemVariants} className="lg:col-span-3 xl:col-span-4">
        <SubjectProgress />
      </motion.div>
       <motion.div variants={itemVariants} className="lg:col-span-3 xl:col-span-4">
        <Analytics />
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;
