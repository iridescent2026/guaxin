'use client';

import { Card, CardContent } from '@/components';
import { SectionTitle } from '@/components';
import { BookOpen } from 'lucide-react';

export function Guide() {
  return (
    <section>
      <SectionTitle title="如何使用" description="借助传统文化，帮助整理思绪" />

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex shrink-0">
              <div className="rounded-full bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>《周易》是中国传统文化的经典之作，它提供了一种独特的方式来反思我们内心的想法。</p>
              <ol className="list-inside list-decimal space-y-2">
                <li>在心中想一个最近困扰自己的问题</li>
                <li>点击「开始摇卦」</li>
                <li>完成六次摇卦</li>
                <li>AI 将结合卦象和你的问题进行分析</li>
                <li>阅读今日启示与行动建议</li>
              </ol>
              <p className="text-xs text-muted-foreground/70 border-t pt-3 mt-3">
                * 本功能仅供传统文化体验与心理陪伴参考，不作为任何医疗、心理咨询或现实决策依据。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
