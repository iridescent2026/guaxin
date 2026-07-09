import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
  description?: string;
}

export function PageTitle({ title, description, className, ...props }: PageTitleProps) {
  return (
    <div className={cn('mb-8', className)} {...props}>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
