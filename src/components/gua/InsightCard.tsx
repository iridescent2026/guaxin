'use client';

import { Card, CardContent, Button } from '@/components';
import { SectionTitle } from '@/components';
import { Play, Square, ChevronRight, Sparkles, Clock } from 'lucide-react';

interface InsightCardProps {
  isStarted: boolean;
  currentStep: number;
  isCompleted: boolean;
}

export function InsightCard({ isStarted, currentStep, isCompleted }: InsightCardProps) {
  // 状态提示
  const getStatusText = () => {
    if (isCompleted) return '六爻完成，正在等待 AI 分析...';
    if (isStarted) return `正在生成第 ${currentStep} 爻...`;
    if (currentStep > 0) return `已完成第 ${currentStep} 爻`;
    return '等待开始摇卦';
  };

  // 获取按钮文案
  const getPrimaryButton = () => {
    if (isCompleted) return { label: '查看 AI 心理解读', icon: Sparkles, disabled: true };
    if (isStarted) return { label: '结束本次摇卦', icon: Square, disabled: false };
    if (currentStep > 0) return { label: '继续下一爻', icon: ChevronRight, disabled: false };
    return { label: '开始摇卦', icon: Play, disabled: false };
  };

  const primaryBtn = getPrimaryButton();

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
              <Button size="lg" className="gap-2" disabled={primaryBtn.disabled}>
                <primaryBtn.icon className="h-4 w-4" />
                {primaryBtn.label}
              </Button>
            </div>

            {/* 提示文字 */}
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {isCompleted
                ? '六爻已全部完成，点击上方按钮查看 AI 分析结果'
                : isStarted
                ? '请在心中默念问题，想好答案后点击「结束本次摇卦」'
                : currentStep > 0
                ? '你已经完成了部分摇卦，可以继续下一爻或重新开始'
                : '点击「开始摇卦」按钮，开始你的传统文化体验之旅'}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
