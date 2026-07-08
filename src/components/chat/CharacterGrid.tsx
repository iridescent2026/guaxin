'use client';

import { CharacterCard, type Character } from './CharacterCard';
import { PageTitle } from '@/components';

interface CharacterGridProps {
  characters: Character[];
  onSelect: (character: Character) => void;
}

export function CharacterGrid({ characters, onSelect }: CharacterGridProps) {
  return (
    <div className="space-y-8">
      <PageTitle
        title="选择一个角色"
        description="在这里，你可以选择一位信任的伙伴，倾诉你的心事"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
