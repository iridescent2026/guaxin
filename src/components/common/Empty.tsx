'use client';

import { Inbox } from 'lucide-react';
import { cn } from '@/utils';

interface EmptyProps {
  message?: string;
  className?: string;
}

export function Empty({ message = '暂无数据', className }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 p-8', className)}>
      <Inbox className="h-12 w-12 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
