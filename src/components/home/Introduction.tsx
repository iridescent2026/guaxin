'use client';

import { Card, CardContent } from '@/components';
import { SectionTitle } from '@/components';
import { Heart } from 'lucide-react';

export function Introduction() {
  return (
    <section>
      <SectionTitle
        title="关于心易陪伴"
        description="我们致力于为大学生提供一个温暖的心理支持空间"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex shrink-0">
              <div className="rounded-full bg-primary/10 p-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                心易陪伴是一个专为大学生设计的心理健康陪伴平台。在这里，你可以：
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>通过周易八卦意象，探索你当下的心理状态</li>
                <li>与 AI 角色进行温暖的对话倾诉</li>
                <li>观看精选的解压视频放松身心</li>
              </ul>
              <p>
                我们相信，有时候一个小小的指引、一句温暖的问候、一段轻松的视频，
                就能帮助你缓解压力，重新找到内心的平静。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
