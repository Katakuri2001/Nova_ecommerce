import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  count?: number;
  size?: number;
}

export default function Rating({ rating, count, size = 16 }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= Math.round(rating) ? '#f59e0b' : 'none'}
            className={star <= Math.round(rating) ? 'text-amber-400' : 'text-surface-600'}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{rating}</span>
      {count !== undefined && <span className="text-xs text-surface-500">({count})</span>}
    </div>
  );
}
