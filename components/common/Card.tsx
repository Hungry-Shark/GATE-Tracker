
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-orange-500/50 transition-all duration-300 ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-4 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 ${className || ''}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-4 text-gray-900 dark:text-white transition-colors duration-300 ${className || ''}`}>
    {children}
  </div>
);

export default Card;
