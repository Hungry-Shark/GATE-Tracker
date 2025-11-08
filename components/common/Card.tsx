
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
      className={`bg-light-card/80 dark:bg-dark-card/60 backdrop-blur-md rounded-2xl border border-light-border dark:border-dark-border shadow-lg transition-all duration-300 ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-4 border-b border-light-border dark:border-dark-border ${className || ''}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-4 ${className || ''}`}>
    {children}
  </div>
);

export default Card;
