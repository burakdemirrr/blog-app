'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const Logo = memo(() => (
  <motion.svg 
    className="w-6 h-6" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.2, rotate: 180 }}
    transition={{ type: "spring", damping: 10 }}
  >
    <motion.path 
      d="M12 2L2 7L12 12L22 7L12 2Z" 
      className="stroke-current" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    <motion.path 
      d="M2 17L12 22L22 17" 
      className="stroke-current" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    />
    <motion.path 
      d="M2 12L12 17L22 12" 
      className="stroke-current" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
    />
  </motion.svg>
));

Logo.displayName = 'Logo';

export default Logo; 