'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components';
import { SectionTitle } from '@/components';
import { MessageCircle, Lightbulb, Rocket, Heart } from 'lucide-react';

interface ResultSectionProps {
  isCompleted: boolean;
}

export function ResultSection({ isCompleted }: ResultSectionProps) {
  if (!isCompleted) return null;

  return (
    <section>
      <SectionTitle title="AI 心理解读" description="结合卦象与你的问题，获得温暖的心理陪伴建议" />

      <div className="space-y-6">
        {/* 你的问题 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              你的问题
            </CardTitle>
            <CardDescription>你心中所想的问题</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[60px] rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground italic">等待摇卦完成...</p>
            </div>
          </CardContent>
        </Card>

        {/* 传统文化启示 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              传统文化启示
            </CardTitle>
            <CardDescription>《周易》智慧对你的问题有什么启示</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[100px] rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground italic">等待摇卦完成...</p>
            </div>
          </CardContent>
        </Card>

        {/* 心理建议 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-pink-500" />
              心理建议
            </CardTitle>
            <CardDescription>温暖、理性、积极的陪伴与支持</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[100px] rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground italic">等待摇卦完成...</p>
            </div>
          </CardContent>
        </Card>

        {/* 今日行动建议 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Rocket className="h-5 w-5 text-teal-500" />
              今日行动建议
            </CardTitle>
            <CardDescription>具体、可行的第一步建议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[100px] rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground italic">等待摇卦完成...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
