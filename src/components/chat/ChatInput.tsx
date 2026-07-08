'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button, Textarea } from '@/components';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border-t border-white/20 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-3">
          {/* Input */}
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在这里输入你的想法..."
              className="min-h-[56px] max-h-[160px] resize-none rounded-2xl border-white/20 bg-white/50 focus:bg-white/80 transition-colors pr-12"
              disabled={disabled}
            />
          </div>

          {/* Send Button */}
          <Button
            size="lg"
            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/25 transition-all"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Hint */}
        <p className="text-xs text-center text-muted-foreground mt-2">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
}
