'use client';

import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { Character } from './CharacterCard';

interface Message {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
}

interface ChatWindowProps {
  character: Character;
  messages: Message[];
  onSend: (message: string) => void;
  onBack: () => void;
}

export function ChatWindow({ character, messages, onSend, onBack }: ChatWindowProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`inline-flex p-4 rounded-3xl bg-gradient-to-br ${character.gradient} mb-4`}>
              <div className={character.accentColor}>
                {character.icon}
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">和 {character.name} 聊聊吧</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {character.name} 正在等你倾诉，无论是烦恼、困惑还是心事，都可以和她/他说说
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isOwn={message.isOwn}
              timestamp={message.timestamp}
            />
          ))
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSend} />
    </div>
  );
}
