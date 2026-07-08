'use client';

import Image from 'next/image';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components';

interface CharacterHeaderProps {
  name: string;
  title: string;
  avatar: string;
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
          <div className="relative shrink-0 transition-transform duration-300 hover:scale-110">
            <div className="h-[72px] w-[72px] rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-pink-400 to-purple-400">
              <Image
                src={avatar}
                alt={name}
                width={72}
                height={72}
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            {/* Online status indicator */}
            <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-400 border-3 border-white shadow-md" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">{name}</h2>
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-xs text-green-500 mt-0.5">在线</p>
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
