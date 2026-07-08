'use client';

import { cn } from '@/utils';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp?: string;
}

export function MessageBubble({ content, isOwn, timestamp }: MessageBubbleProps) {
  return (
    <div className={cn('flex w-full', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 shadow-md',
          isOwn
            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-md'
            : 'bg-white/80 backdrop-blur-sm text-foreground rounded-bl-md border border-white/20'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className={cn(
            'text-xs mt-1',
            isOwn ? 'text-white/60' : 'text-muted-foreground'
          )}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
