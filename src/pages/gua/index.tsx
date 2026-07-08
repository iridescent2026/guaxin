import { useState } from 'react';
import { MainLayout, PageTitle } from '@/components';
import { QuestionInput, Guide, StickArea, HexagramDisplay, InsightCard, ResultSection } from '@/components/gua';

export default function GuaPage() {
  // 统一管理状态
  const [question, setQuestion] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [lines, setLines] = useState<(number | null)[]>([null, null, null, null, null, null]);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 按钮回调
  const handleStart = () => {
    setIsStarted(true);
  };

  const handleStop = () => {
    setIsStarted(false);
  };

  const handleContinue = () => {
    // TODO: 后续实现真正的摇卦逻辑
  };

  const handleViewResult = () => {
    // TODO: 后续实现查看结果
  };

  return (
    <MainLayout>
      <PageTitle
        title="周易摇卦"
        description="借助《周易》的文化智慧，帮助整理思绪，AI 将为你提供积极、温暖的心理陪伴建议"
      />

      <div className="space-y-8">
        <QuestionInput
          question={question}
          onChange={setQuestion}
          onStart={handleStart}
        />
        <Guide />
        <StickArea />
        <HexagramDisplay currentStep={currentStep} lines={lines} />
        <InsightCard
          currentStep={currentStep}
          isStarted={isStarted}
          isCompleted={isCompleted}
          onStart={handleStart}
          onStop={handleStop}
          onContinue={handleContinue}
          onViewResult={handleViewResult}
        />
        <ResultSection isCompleted={isCompleted} />
      </div>
    </MainLayout>
  );
}
