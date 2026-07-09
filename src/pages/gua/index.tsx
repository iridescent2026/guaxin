'use client';

import { useState, useCallback } from 'react';
import { MainLayout, PageTitle } from '@/components';
import { BAGUA_ARCHETYPES, type BaguaArchetype } from '@/lib/bagua-archetypes';
import { MOODS } from '@/constants';
import type { Mood } from '@/types';

type PageStep = 'input' | 'select' | 'loading' | 'result';

interface InterpretResult {
  psychologicalAnalysis: string;
  philosophyInsight: string;
  growthAdvice: string;
  actionSteps: string;
  crisisFlag: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GuaPage() {
  const [step, setStep] = useState<PageStep>('input');
  const [question, setQuestion] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [archetypes, setArchetypes] = useState<BaguaArchetype[]>(
    () => shuffleArray(BAGUA_ARCHETYPES),
  );
  const [selectedArchetype, setSelectedArchetype] =
    useState<BaguaArchetype | null>(null);
  const [result, setResult] = useState<InterpretResult | null>(null);
  const [error, setError] = useState('');

  const handleReshuffle = useCallback(() => {
    setArchetypes(shuffleArray(BAGUA_ARCHETYPES));
    setSelectedArchetype(null);
  }, []);

  const handleStartExplore = () => {
    setStep('select');
    setArchetypes(shuffleArray(BAGUA_ARCHETYPES));
  };

  const handleSelectArchetype = async (archetype: BaguaArchetype) => {
    setSelectedArchetype(archetype);
    setStep('loading');
    setError('');

    try {
      const res = await fetch('/api/gua/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetypeName: archetype.name,
          question,
          mood: mood ?? 'confused',
          options: BAGUA_ARCHETYPES.map((a) => a.name),
        }),
      });

      const json = await res.json();

      if (json.code !== 0) {
        setError(json.message || '解读失败，请稍后重试');
        setStep('select');
        return;
      }

      setResult(json.data as InterpretResult);
      setStep('result');
    } catch {
      setError('网络错误，请检查网络连接后重试');
      setStep('select');
    }
  };

  const handleReset = () => {
    setStep('input');
    setQuestion('');
    setMood(null);
    setSelectedArchetype(null);
    setResult(null);
    setError('');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          {/* ========== Step 1: Input ========== */}
          {step === 'input' && (
            <div className="animate-fade-in space-y-8">
              <PageTitle
                title="意象探索"
                description="选择一个最触动你的意象，探索当下的内心"
              />

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
                {/* Text input */}
                <div>
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    输入你当下的困惑（可选）
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="比如：最近总觉得自己在原地踏步..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none transition-all"
                  />
                </div>

                {/* Mood selection */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    此刻的心情
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-all ${
                          mood === m.value
                            ? 'bg-purple-100 border-purple-400 text-purple-700 font-medium'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start button */}
                <div className="pt-2">
                  <button
                    onClick={handleStartExplore}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    开始探索
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== Step 2: Card Selection ========== */}
          {step === 'select' && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  选择最触动你的意象
                </h2>
                <p className="text-sm text-gray-500">
                  让直觉引导你，不要思考太久
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
                  {error}
                </div>
              )}

              {/* Card grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {archetypes.map((archetype) => {
                  const isSelected = selectedArchetype?.name === archetype.name;
                  return (
                    <button
                      key={archetype.name}
                      onClick={() => handleSelectArchetype(archetype)}
                      disabled={false}
                      className={`relative bg-white rounded-2xl shadow-md overflow-hidden text-left transition-all duration-200
                        hover:-translate-y-1 hover:shadow-lg
                        ${isSelected ? 'ring-2 ring-purple-500 scale-105 shadow-xl' : ''}
                      `}
                    >
                      {/* Color top border */}
                      <div
                        className="h-1.5"
                        style={{ backgroundColor: archetype.color }}
                      />
                      <div className="p-4 sm:p-5">
                        {/* Symbol */}
                        <div className="text-4xl sm:text-5xl mb-2 text-center leading-none">
                          {archetype.symbol}
                        </div>
                        {/* Name & archetype */}
                        <div className="text-center mb-2">
                          <span className="text-base font-bold text-gray-800">
                            {archetype.name}
                          </span>
                          <span className="mx-1.5 text-gray-300">|</span>
                          <span className="text-sm text-gray-500">
                            {archetype.archetype}
                          </span>
                        </div>
                        {/* Description */}
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {archetype.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom hint & reshuffle */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-400 italic">
                  不要思考，选择第一眼最吸引你的那个
                </p>
                <button
                  onClick={handleReshuffle}
                  className="text-sm text-purple-500 hover:text-purple-700 transition-colors underline underline-offset-4"
                >
                  重新排列
                </button>
              </div>
            </div>
          )}

          {/* ========== Step 3: Loading ========== */}
          {step === 'loading' && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-24 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p
                  className="text-xl font-bold text-gray-700"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  正在深度解读...
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedArchetype?.archetype}正在与你对话
                </p>
              </div>
            </div>
          )}

          {/* ========== Step 4: Result ========== */}
          {step === 'result' && result && selectedArchetype && (
            <div className="animate-fade-in space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="text-5xl sm:text-6xl">{selectedArchetype.symbol}</div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-800"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {selectedArchetype.name} · {selectedArchetype.archetype}
                </h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {selectedArchetype.description}
                </p>
              </div>

              {/* Crisis flag */}
              {result.crisisFlag && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-2">
                  <p className="font-bold text-red-700">
                    我们注意到你可能在经历一些困难的时刻
                  </p>
                  <p className="text-sm text-red-600">
                    如果你觉得难以承受，请联系专业帮助：400-161-9995
                  </p>
                </div>
              )}

              {/* Result sections */}
              <div className="space-y-5">
                {/* 1. Psychological analysis */}
                <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-3"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    你为什么被它吸引？
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {result.psychologicalAnalysis}
                  </p>
                </section>

                {/* 2. Philosophy insight */}
                <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-3"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    千年智慧
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {result.philosophyInsight}
                  </p>
                </section>

                {/* 3. Growth advice */}
                <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-3"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    向前一步
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {result.growthAdvice}
                  </p>
                </section>

                {/* 4. Action steps */}
                <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-3"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    今天可以做的事
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {result.actionSteps}
                  </p>
                </section>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 text-center leading-relaxed max-w-lg mx-auto pb-4">
                以上解读基于心理学投射原理，意象本身不具有预测功能。如需专业帮助，请拨打
                400-161-9995。
              </p>

              {/* Action button */}
              <div className="text-center pb-8">
                <button
                  onClick={handleReset}
                  className="py-3 px-10 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  再来一次探索
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}