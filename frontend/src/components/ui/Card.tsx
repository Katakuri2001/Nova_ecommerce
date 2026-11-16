import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export default function Card({ children, className = '', hover = false, padding = true }: CardProps) {
  return (
    <div
      className={`bg-surface-900/50 border border-surface-800 rounded-xl ${padding ? 'p-5' : ''} ${hover ? 'hover:border-surface-700 hover:bg-surface-900/80 transition-all duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
