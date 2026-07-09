'use client';

import { Card, CardContent, Textarea, Button } from '@/components';
import { SectionTitle } from '@/components';
import { Lock } from 'lucide-react';
import { MOODS } from '@/constants';
import type { Mood } from '@/types';
import { cn } from '@/utils';

interface QuestionInputProps {
  question: string;
  mood: Mood | null;
  onChange: (value: string) => void;
  onMoodChange: (mood: Mood) => void;
  onStart: () => void;
  disabled?: boolean;
}

export function QuestionInput({
  question,
  mood,
  onChange,
  onMoodChange,
  onStart,
  disabled,
}: QuestionInputProps) {
  const isDisabled = question.trim().length === 0 || !mood || disabled;

  return (
    <section>
      <SectionTitle
        title="今天有什么想和自己聊聊？"
        description="借助传统文化，帮助整理思绪"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* 输入区域 */}
            <div>
              <Textarea
                placeholder="例如：最近学习压力很大怎么办？"
                value={question}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={200}
                disabled={disabled}
              />
              {/* 字数提示 */}
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {question.length} / 200
              </p>
            </div>

            {/* 情绪选择 */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                你现在的情绪状态
              </p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => onMoodChange(m.value)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                      mood === m.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 隐私提示 */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="mt-0.5 h-3 w-3 shrink-0" />
              <p>你的问题仅用于生成本次 AI 心理解读，不会公开保存。</p>
            </div>

            {/* 开始按钮 */}
            <div className="flex justify-center pt-2">
              <Button
                size="lg"
                disabled={isDisabled}
                onClick={onStart}
                className="px-8"
              >
                开始摇卦
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
