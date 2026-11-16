import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-surface-300">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 bg-surface-900 border rounded-lg text-white placeholder-surface-600 focus:outline-none focus:ring-2 focus:ring-nova-500 focus:border-transparent transition-all ${error ? 'border-red-500' : 'border-surface-700'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
