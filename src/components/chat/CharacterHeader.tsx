'use client';

import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components';

interface CharacterHeaderProps {
  name: string;
  title: string;
  avatar?: string;
  onBack?: () => void;
}

export function CharacterHeader({ name, title, avatar, onBack }: CharacterHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Back button */}
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Avatar */}
          <div className="relative">
            {avatar ? (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-medium">
                {avatar}
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-medium">
                {name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-background" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">{name}</h2>
            <p className="text-sm text-muted-foreground truncate">{title}</p>
          </div>

          {/* Favorite icon */}
          <Button variant="ghost" size="icon" className="shrink-0">
            <Heart className="h-5 w-5 text-pink-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
