'use client';

import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = '还没有消息',
  description = '开始你们的对话吧，我会一直在这里陪伴你'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Decorative icon */}
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-pink-400" />
        </div>
        {/* Floating hearts */}
        <div className="absolute -top-2 -right-2">
          <Heart className="h-5 w-5 text-rose-300 fill-rose-200" />
        </div>
        <div className="absolute -bottom-1 -left-3">
          <Heart className="h-4 w-4 text-pink-300 fill-pink-200" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {description}
      </p>

      {/* Decorative button hint */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
        <span>尝试发送一条消息</span>
      </div>
    </div>
  );
}
