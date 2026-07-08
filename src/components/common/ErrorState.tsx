'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = '出错了',
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-8 text-center', className)}>
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          重试
        </Button>
      )}
    </div>
  );
}
