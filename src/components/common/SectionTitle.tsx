import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
  description?: string;
}

export function SectionTitle({ title, description, className, ...props }: SectionTitleProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
