'use client';

import { type ReactNode } from 'react';
import { Card, CardContent, Button } from '@/components';
import { MessageCircle } from 'lucide-react';

export interface Character {
  id: string;
  name: string;
  title: string;
  icon: ReactNode;
  gradient: string;
  description: string;
  accentColor: string;
}

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 ${character.gradient}`}
      onClick={() => onSelect(character)}
    >
      <CardContent className="relative z-10 p-6">
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-sm mb-4`}>
          <div className={character.accentColor}>
            {character.icon}
          </div>
        </div>

        {/* Name & Title */}
        <h3 className="text-xl font-semibold text-white mb-1">{character.name}</h3>
        <p className="text-sm text-white/80 mb-4">{character.title}</p>

        {/* Description */}
        <p className="text-sm text-white/70 mb-6 leading-relaxed">
          {character.description}
        </p>

        {/* Action Button */}
        <Button
          variant="secondary"
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          开始聊天
        </Button>
      </CardContent>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
    </Card>
  );
}
