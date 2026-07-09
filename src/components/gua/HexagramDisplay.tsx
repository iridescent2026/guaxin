'use client';

import { Card, CardContent } from '@/components';
import { SectionTitle } from '@/components';
import type { YaoValue } from '@/types';

interface HexagramDisplayProps {
  /** 已揭示的爻数量（0-6） */
  revealedCount: number;
  /** 六爻值数组（从初爻到上爻，未揭示的位置为 null） */
  lines: (YaoValue | null)[];
  /** 卦名 */
  guaName?: string;
  /** 卦码 */
  guaCode?: string;
}

export function HexagramDisplay({
  revealedCount,
  lines,
  guaName,
  guaCode,
}: HexagramDisplayProps) {
  // 爻的位置标签（从上爻到初爻）
  const positionLabels = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻'];

  const allRevealed =
    revealedCount >= 6 && lines.every((l) => l !== null);

  return (
    <section>
      <SectionTitle
        title="六爻记录"
        description={`当前进度：第 ${Math.min(revealedCount, 6)} / 6 爻`}
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
                const isFilled = line !== null;
                const isActive =
                  !isFilled &&
                  positionIndex === revealedCount &&
                  revealedCount < 6;

                return (
                  <div key={index} className="flex items-center gap-4">
                    {/* 位置标签 */}
                    <span
                      className={`w-12 text-right text-sm ${
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
                          ? 'animate-pulse bg-primary/30'
                          : 'bg-muted'
                      }`}
                    />

                    {/* 结果标记 */}
                    <span className="w-8 text-sm text-muted-foreground">
                      {isFilled
                        ? line === 7 || line === 9
                          ? '阳'
                          : '阴'
                        : '-'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 卦名 / 卦象预览 */}
            {allRevealed ? (
              <div className="mt-4 flex flex-col items-center gap-1">
                {guaName && (
                  <span className="text-lg font-semibold text-primary">
                    {guaName}
                  </span>
                )}
                {guaCode && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>卦象：</span>
                    <code className="rounded bg-muted px-2 py-1">
                      {guaCode}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>卦象：</span>
                <code className="rounded bg-muted px-2 py-1">------</code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
