'use client';

import { Card, CardContent, Button } from '@/components';
import { SectionTitle } from '@/components';
import { Clock, Sparkles, Loader2, BookOpen, RefreshCw } from 'lucide-react';

/** 摇卦流程的各个阶段 */
export type GuaPhase =
  | 'input'
  | 'generating'
  | 'revealing'
  | 'result'
  | 'interpreting'
  | 'interpreted';

interface InsightCardProps {
  phase: GuaPhase;
  error?: string | null;
  onStart: () => void;
  onInterpret: () => void;
  onReset: () => void;
}

export function InsightCard({
  phase,
  error,
  onStart,
  onInterpret,
  onReset,
}: InsightCardProps) {
  const getStatusText = () => {
    switch (phase) {
      case 'generating':
        return '正在摇卦，请稍候...';
      case 'revealing':
        return '六爻依次显现中...';
      case 'result':
        return '六爻已成，可以开始 AI 解卦';
      case 'interpreting':
        return 'AI 正在解读卦象...';
      case 'interpreted':
        return '解卦完成';
      default:
        return '等待开始摇卦';
    }
  };

  const getHintText = () => {
    switch (phase) {
      case 'generating':
        return '请在心中默念你的问题';
      case 'revealing':
        return '六爻正在依次显现，请静心等待';
      case 'result':
        return '点击下方「AI 解卦」，获取结合卦象的心理陪伴建议';
      case 'interpreting':
        return 'AI 正在结合你的问题与卦象进行分析，请稍候';
      case 'interpreted':
        return '可查看下方解读结果，或重新摇卦';
      default:
        return '输入问题并选择情绪后，点击「开始摇卦」开启你的传统文化体验之旅';
    }
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
              <span className="text-muted-foreground">{getStatusText()}</span>
            </div>

            {/* 错误提示 */}
            {error && (
              <p className="max-w-md text-center text-sm text-destructive">
                {error}
              </p>
            )}

            {/* 控制按钮 */}
            <div className="flex flex-wrap justify-center gap-4">
              {phase === 'input' && (
                <Button size="lg" onClick={onStart}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  开始摇卦
                </Button>
              )}

              {(phase === 'generating' ||
                phase === 'revealing' ||
                phase === 'interpreting') && (
                <Button size="lg" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  请稍候...
                </Button>
              )}

              {phase === 'result' && (
                <Button size="lg" onClick={onInterpret}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  AI 解卦
                </Button>
              )}

              {phase === 'interpreted' && (
                <Button size="lg" variant="outline" onClick={onReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重新摇卦
                </Button>
              )}
            </div>

            {/* 提示文字 */}
            <p className="max-w-md text-center text-sm text-muted-foreground">
              {getHintText()}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
