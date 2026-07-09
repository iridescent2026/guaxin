'use client';

import { Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components';
import { SectionTitle } from '@/components';

const TIP = {
  title: '今日心理小贴士',
  content: '当你感到焦虑时，试着做几次深呼吸：吸气4秒，屏住呼吸4秒，呼气4秒。重复3-5次，可以有效激活副交感神经，帮助你平静下来。',
};

export function MentalHealthTip() {
  return (
    <section>
      <SectionTitle title={TIP.title} />

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex shrink-0">
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/50">
                <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              {TIP.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
