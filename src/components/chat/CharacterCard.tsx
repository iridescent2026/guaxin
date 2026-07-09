'use client';

import Image from 'next/image';
import { Card, CardContent, Button } from '@/components';
import { MessageCircle, User } from 'lucide-react';

export interface Character {
  id: string;
  name: string;
  title: string;
  icon?: React.ReactNode;
  avatar: string;
  coverImage?: string;
  gradient: string;
  description: string;
  accentColor?: string;
  welcomeMessage?: string;
}

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  const avatarSrc = character.avatar || '';

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 border-0 ${character.gradient}`}
      onClick={() => onSelect(character)}
    >
      {/* Card background character image (人物背景图) */}
      {character.coverImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={character.coverImage}
            alt={`${character.name} 背景`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover opacity-50 mix-blend-luminosity group-hover:opacity-60 transition-opacity duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
            priority={false}
          />
          {/* 渐变蒙层，保证白色文字可读 */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/30 to-black/60" />
          <div className="absolute inset-0 mix-blend-overlay opacity-70 bg-gradient-to-br from-white/0 via-white/0 to-black/40" />
        </div>
      )}

      <CardContent className="relative z-10 p-6 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4 transition-transform duration-300 hover:scale-110">
          <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white/40 shadow-xl bg-white/30 ring-2 ring-white/20 flex items-center justify-center">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={character.name}
                width={80}
                height={80}
                className="object-cover h-full w-full"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = 'none';
                  // 加载失败：改回显示兜底图标
                  const parent = el.parentElement;
                  if (parent && !parent.querySelector('[data-fallback-avatar]')) {
                    const fb = document.createElement('div');
                    fb.setAttribute('data-fallback-avatar', '1');
                    fb.className = 'flex h-full w-full items-center justify-center text-white/80';
                    fb.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                    parent.appendChild(fb);
                  }
                }}
              />
            ) : (
              <User className="h-10 w-10 text-white/80" aria-hidden />
            )}
          </div>
        </div>

        {/* Name & Title */}
        <h3 className="text-xl font-semibold text-white mb-1 drop-shadow-sm">
          {character.name}
        </h3>
        <p className="text-sm text-white/85 mb-4 drop-shadow-sm">{character.title}</p>

        {/* Description */}
        <p className="text-sm text-white/85 mb-6 leading-relaxed line-clamp-2 drop-shadow-sm">
          {character.description}
        </p>

        {/* Action Button */}
        <Button
          variant="secondary"
          className="w-full bg-white/25 hover:bg-white/35 backdrop-blur-md text-white border-0 gap-2 shadow-lg shadow-black/10"
        >
          <MessageCircle className="h-4 w-4" />
          开始聊天
        </Button>
      </CardContent>

      {/* Decorative elements (更柔和，避免覆盖人物背景图) */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-black/15 blur-2xl" />
    </Card>
  );
}
