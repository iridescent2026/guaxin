'use client';

import Link from 'next/link';
import { TrendingUp, MessageCircle, Video } from 'lucide-react';
import { Card, CardContent } from '@/components';
import { SectionTitle } from '@/components';

const FEATURES = [
  {
    href: '/gua',
    icon: TrendingUp,
    title: '意象探索',
    description: '通过周易八卦意象，探索你当下的心理状态，获得心理学视角的成长指引。',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
  },
  {
    href: '/chat',
    icon: MessageCircle,
    title: 'AI陪伴',
    description: '选择你喜欢的角色，获得温暖的陪伴与倾听，舒缓心中的压力。',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    href: '/videos',
    icon: Video,
    title: '娱乐放松',
    description: '精选解压视频，萌宠、搞笑、治愈内容，帮你赶走坏心情。',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
];

export function FeatureCards() {
  return (
    <section>
      <SectionTitle
        title="探索功能"
        description="我们为你准备了多种舒缓压力的方式"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-teal-100 dark:border-teal-900/50">
                <CardContent className="pt-6">
                  <div className={`mb-4 inline-flex rounded-full ${feature.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
