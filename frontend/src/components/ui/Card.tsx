import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.07] bg-white/[0.025] ${hover ? 'transition hover:bg-white/[0.04]' : ''} ${className}`}
      style={{ boxShadow: 'inset 0 1px #ffffff08' }}
    >
      {children}
    </div>
  );
}