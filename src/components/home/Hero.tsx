'use client';

import { Sparkles } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/constants';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-background to-emerald-50 py-16 px-8 sm:py-24 sm:px-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
        <Sparkles className="h-64 w-64 text-teal-200/50" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Website Name */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          {APP_TAGLINE}
        </p>
      </div>
    </section>
  );
}
