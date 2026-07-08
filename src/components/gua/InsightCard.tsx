'use client';

import { Card, CardContent, Button } from '@/components';
import { SectionTitle } from '@/components';
import { Clock } from 'lucide-react';

interface InsightCardProps {
  currentStep: number;
  isStarted: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onStop: () => void;
  onContinue: () => void;
  onViewResult: () => void;
}

export function InsightCard({
  currentStep,
  isStarted,
  isCompleted,
  onStart,
  onStop,
  onContinue,
  onViewResult,
}: InsightCardProps) {
  // 状态提示
  const getStatusText = () => {
    if (isCompleted) return '六爻完成，正在等待 AI 分析...';
    if (isStarted) return `正在生成第 ${currentStep} 爻...`;
    if (currentStep > 0) return `已完成第 ${currentStep} 爻`;
    return '等待开始摇卦';
  };

  // 提示文字
  const getHintText = () => {
    if (isCompleted) return '六爻已全部完成，点击上方按钮查看 AI 分析结果';
    if (isStarted) return '请在心中默念问题，想好答案后点击「结束本次摇卦」';
    if (currentStep > 0) return '你已经完成了部分摇卦，可以继续下一爻或重新开始';
    return '点击「开始摇卦」按钮，开始你的传统文化体验之旅';
  };

  return (
    <section>
      <SectionTitle title="摇卦控制" />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            {/* 状态显示 */}
            <div className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {getStatusText()}
              </span>
            </div>

            {/* 控制按钮 */}
            <div className="flex gap-4">
              {isCompleted ? (
                <Button size="lg" onClick={onViewResult}>
                  查看 AI 心理解读
                </Button>
              ) : isStarted ? (
                <Button size="lg" variant="destructive" onClick={onStop}>
                  结束本次摇卦
                </Button>
              ) : currentStep > 0 ? (
                <Button size="lg" onClick={onContinue}>
                  继续下一爻
                </Button>
              ) : (
                <Button size="lg" onClick={onStart}>
                  开始摇卦
                </Button>
              )}
            </div>

            {/* 提示文字 */}
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {getHintText()}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
