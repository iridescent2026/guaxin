'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={cn('text-muted-foreground', sizeClasses[size])} />
      </motion.div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
