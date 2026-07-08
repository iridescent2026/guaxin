'use client';

import Image from 'next/image';
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
  welcomeMessage: string;
  messages: Message[];
  onSend: (message: string) => void;
  onBack: () => void;
}

export function ChatWindow({ character, welcomeMessage, messages, onSend, onBack }: ChatWindowProps) {
  // 将欢迎语作为第一条 AI 消息
  const allMessages = [
    {
      id: 'welcome',
      content: welcomeMessage,
      isOwn: false,
      timestamp: '刚刚',
    },
    ...messages,
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Card with Avatar */}
        <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-dashed border-muted">
          {/* Large Avatar */}
          <div className="relative mb-4 transition-transform duration-300 hover:scale-105">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-pink-400 to-purple-400">
              <Image
                src={character.avatar}
                alt={character.name}
                width={96}
                height={96}
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-1">{character.name}</h3>
          <p className="text-sm text-green-500 mb-2">在线</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            {character.name} 正在等你倾诉，无论是烦恼、困惑还是心事，都可以和她/他说说
          </p>
        </div>

        {/* Messages */}
        {allMessages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            isOwn={message.isOwn}
            timestamp={message.timestamp}
          />
        ))}
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSend} />
    </div>
  );
}
