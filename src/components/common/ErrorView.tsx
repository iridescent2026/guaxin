'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from './Button';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorView({ message = '出错了', onRetry, className }: ErrorViewProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-8', className)}>
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          重试
        </Button>
      )}
    </div>
  );
}
