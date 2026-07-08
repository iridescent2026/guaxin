import { useState } from 'react';
import { MainLayout, PageTitle } from '@/components';
import { Guide, StickArea, HexagramDisplay, InsightCard, ResultSection } from '@/components/gua';

export default function GuaPage() {
  // 静态数据展示
  const [currentStep] = useState(0);
  const [lines] = useState<(number | null)[]>([null, null, null, null, null, null]);
  const [isStarted] = useState(false);
  const [isCompleted] = useState(false);

  return (
    <MainLayout>
      <PageTitle
        title="周易摇卦"
        description="借助《周易》的文化智慧，帮助整理思绪，AI 将为你提供积极、温暖的心理陪伴建议"
      />

      <div className="space-y-8">
        <Guide />
        <StickArea />
        <HexagramDisplay currentStep={currentStep} lines={lines} />
        <InsightCard isStarted={isStarted} currentStep={currentStep} isCompleted={isCompleted} />
        <ResultSection />
      </div>
    </MainLayout>
  );
}
