'use client';

import { Card, CardContent } from '@/components';
import { SectionTitle } from '@/components';

interface HexagramDisplayProps {
  currentStep: number;
  lines: (number | null)[];
}

export function HexagramDisplay({ currentStep, lines }: HexagramDisplayProps) {
  // 爻的位置标签（从上爻到初爻）
  const positionLabels = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻'];

  return (
    <section>
      <SectionTitle
        title="六爻记录"
        description={`当前进度：第 ${currentStep} / 6 爻`}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            {/* 六爻显示区域 */}
            <div className="flex flex-col gap-3">
              {/* 从上爻到初爻显示 */}
              {[...lines].reverse().map((line, index) => {
                const positionIndex = 5 - index;
                const positionLabel = positionLabels[positionIndex];
                const isActive = positionIndex === currentStep - 1;
                const isFilled = line !== null;

                return (
                  <div key={index} className="flex items-center gap-4">
                    {/* 位置标签 */}
                    <span
                      className={`w-12 text-sm text-right ${
                        isActive
                          ? 'font-medium text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {positionLabel}
                    </span>

                    {/* 爻线 */}
                    <div
                      className={`h-2 w-32 rounded-full transition-colors ${
                        isFilled
                          ? 'bg-teal-500'
                          : isActive
                          ? 'bg-primary/30 animate-pulse'
                          : 'bg-muted'
                      }`}
                    />

                    {/* 结果标记 */}
                    <span className="w-8 text-sm text-muted-foreground">
                      {isFilled
                        ? line === 7 || line === 9
                          ? '阳'
                          : line === 6 || line === 8
                          ? '阴'
                          : '?'
                        : '-'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 卦象预览 */}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>卦象：</span>
              <code className="rounded bg-muted px-2 py-1">
                {lines.every((l) => l !== null)
                  ? lines.map((l) => (l === 7 || l === 9 ? '1' : '0')).join('')
                  : '------'}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
