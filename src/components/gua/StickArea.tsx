'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components';
import { SectionTitle } from '@/components';

interface StickAreaProps {
  isShaking?: boolean;
}

export function StickArea({ isShaking = false }: StickAreaProps) {
  return (
    <section>
      <SectionTitle title="六爻展示" description="摇卦时六爻将在这里生成" />

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-16">
          {/* 签筒 - CSS 绘制 - 温暖治愈风格 */}
          <div className="relative mb-8">
            {/* 签筒主体 - 木色/青绿色调，摇卦时轻微摆动 */}
            <motion.div
              animate={
                isShaking
                  ? { rotate: [-3, 3, -3, 3, 0] }
                  : { rotate: 0 }
              }
              transition={
                isShaking
                  ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
              className="relative h-48 w-20 rounded-t-full rounded-b-lg bg-gradient-to-b from-teal-100 via-teal-50 to-emerald-100 shadow-lg border border-teal-200/50 overflow-hidden"
            >
              {/* 签筒内壁 */}
              <div className="absolute inset-1 rounded-t-full rounded-b-lg bg-white/50" />

              {/* 竹签 - 多根 - 温暖木色 */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                {/* 竹签 1 */}
                <div className="h-28 w-2 rounded-t-full bg-gradient-to-b from-teal-400 via-teal-300 to-teal-200 shadow-sm" />
                {/* 竹签 2 */}
                <div className="h-32 w-2 rounded-t-full bg-gradient-to-b from-teal-500 via-teal-400 to-teal-300 shadow-sm" />
                {/* 竹签 3 */}
                <div className="h-26 w-2 rounded-t-full bg-gradient-to-b from-teal-300 via-teal-200 to-teal-100 shadow-sm" />
                {/* 竹签 4 */}
                <div className="h-30 w-2 rounded-t-full bg-gradient-to-b from-teal-400 via-teal-300 to-teal-200 shadow-sm" />
                {/* 竹签 5 */}
                <div className="h-24 w-2 rounded-t-full bg-gradient-to-b from-teal-200 via-teal-100 to-white shadow-sm" />
              </div>

              {/* 签筒顶部边缘 */}
              <div className="absolute top-0 left-0 right-0 h-4 rounded-t-full bg-gradient-to-b from-teal-300 to-teal-200" />
            </motion.div>

            {/* 签筒底部 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-gradient-to-b from-teal-300 to-emerald-400 shadow-md" />
          </div>

          {/* 提示文字 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{isShaking ? '正在摇卦...' : '静心摇卦'}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
