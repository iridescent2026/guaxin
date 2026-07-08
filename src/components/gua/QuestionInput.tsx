'use client';

import { Card, CardContent, Textarea, Button } from '@/components';
import { SectionTitle } from '@/components';
import { Lock } from 'lucide-react';

interface QuestionInputProps {
  question: string;
  onChange: (value: string) => void;
  onStart: () => void;
}

export function QuestionInput({ question, onChange, onStart }: QuestionInputProps) {
  const isDisabled = question.trim().length === 0;

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
              />
              {/* 字数提示 */}
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {question.length} / 200
              </p>
            </div>

            {/* 隐私提示 */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3 mt-0.5 shrink-0" />
              <p>你的问题仅用于生成本次 AI 心理解读，不会公开保存。</p>
            </div>

            {/* 开始按钮 */}
            <div className="flex justify-center pt-2">
              <Button size="lg" disabled={isDisabled} onClick={onStart} className="px-8">
                开始摇卦
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
