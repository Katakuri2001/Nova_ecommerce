import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ className = '', count = 1, variant = 'rect' }: SkeletonProps) {
  const baseClasses = 'skeleton';
  
  const variants = {
    text: 'h-4 w-full',
    rect: 'h-48 w-full',
    circle: 'h-12 w-12 rounded-full',
  };
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`${baseClasses} ${variants[variant]} ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      ))}
    </>
  );
}
