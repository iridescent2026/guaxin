import { useState } from 'react';
import { MainLayout, PageTitle } from '@/components';
import { MOODS } from '@/constants';
import type { Gua, GuaInterpretation, Mood, YaoLine } from '@/types';

export default function GuaPage() {
  const [question, setQuestion] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [step, setStep] = useState<'input' | 'generating' | 'result' | 'interpreting' | 'interpreted'>('input');
  const [guaData, setGuaData] = useState<Gua | null>(null);
  const [interpretation, setInterpretation] = useState<GuaInterpretation | null>(null);
  const [error, setError] = useState('');

  // 摇卦
  const handleGenerate = async () => {
    if (!question.trim()) { setError('请输入你的问题'); return; }
    if (!selectedMood) { setError('请选择当前情绪'); return; }
    setError('');
    setStep('generating');

    try {
      const res = await fetch('/api/gua/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, mood: selectedMood }),
      });
      const json = await res.json();
      if (json.code !== 0) throw new Error(json.message);
      setGuaData(json.data);
      setStep('result');
    } catch (e: any) {
      setError(e.message || '摇卦失败');
      setStep('input');
    }
  };

  // AI解卦
  const handleInterpret = async () => {
    if (!guaData) return;
    setStep('interpreting');
    try {
      const res = await fetch('/api/gua/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guaId: guaData.id,
          lines: guaData.lines,
          question: guaData.question,
          mood: guaData.mood,
        }),
      });
      const json = await res.json();
      if (json.code !== 0) throw new Error(json.message);
      setInterpretation(json.data);
      setStep('interpreted');
    } catch (e: any) {
      setError(e.message || '解卦失败');
      setStep('result');
    }
  };

  const reset = () => {
    setStep('input');
    setGuaData(null);
    setInterpretation(null);
    setError('');
    setQuestion('');
    setSelectedMood(null);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PageTitle title="周易摇卦" description="借助《周易》的文化智慧，帮助整理思绪" />

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* 步骤1：输入 */}
        {step === 'input' && (
          <div className="space-y-6 animate-fade-in">
            {/* 问题输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 你心中所想的是什么？
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={200}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none text-gray-800"
                placeholder="写下你最近的烦恼或困惑..."
              />
              <p className="text-right text-xs text-gray-400 mt-1">{question.length}/200</p>
            </div>

            {/* 情绪选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                😊 你现在的情绪状态
              </label>
              <div className="flex flex-wrap gap-3">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedMood === m.value
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                    }`}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 摇卦按钮 */}
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              🎲 摇卦
            </button>
          </div>
        )}

        {/* 步骤2：摇卦中 */}
        {step === 'generating' && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-gray-600">正在为你摇卦...</p>
          </div>
        )}

        {/* 步骤3：显示六爻 */}
        {step === 'result' && guaData && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{guaData.guaName}</h2>
              <p className="text-gray-500">卦象编码: {guaData.guaCode}</p>
            </div>

            {/* 六爻展示 */}
            <div className="flex flex-col items-center gap-3 py-4">
              {[...guaData.lines].reverse().map((line: YaoLine) => (
                <div key={line.position} className="flex items-center gap-3 w-full max-w-xs">
                  <span className="w-10 text-right text-sm text-gray-500">
                    {line.position === 1 ? '初爻' : line.position === 2 ? '二爻' : line.position === 3 ? '三爻' : line.position === 4 ? '四爻' : line.position === 5 ? '五爻' : '上爻'}
                  </span>
                  {line.value === 7 || line.value === 9 ? (
                    <div className={`flex-1 h-2 rounded-full ${line.value === 9 ? 'bg-pink-500 animate-pulse' : 'bg-purple-500'}`} />
                  ) : (
                    <div className="flex-1 flex gap-3">
                      <div className={`flex-1 h-2 rounded-full ${line.value === 6 ? 'bg-pink-500 animate-pulse' : 'bg-purple-500'}`} />
                      <div className={`flex-1 h-2 rounded-full ${line.value === 6 ? 'bg-pink-500 animate-pulse' : 'bg-purple-500'}`} />
                    </div>
                  )}
                  <span className="w-8 text-sm text-gray-400">
                    {line.value === 6 ? '老阴' : line.value === 7 ? '少阳' : line.value === 8 ? '少阴' : '老阳'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleInterpret}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              ✨ AI 解卦
            </button>
            <button onClick={reset} className="w-full py-3 text-gray-500 hover:text-gray-700">
              重新摇卦
            </button>
          </div>
        )}

        {/* 步骤4：解卦中 */}
        {step === 'interpreting' && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-gray-600">正在为你解读卦象...</p>
          </div>
        )}

        {/* 步骤5：解卦结果 */}
        {step === 'interpreted' && interpretation && (
          <div className="space-y-4 animate-fade-in">
            {/* 危机提示 */}
            {interpretation.crisisFlag && (
              <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
                <p className="text-yellow-800 font-medium mb-2">⚠️ 温馨提示</p>
                <p className="text-yellow-700 text-sm">全国心理援助热线：400-161-9995</p>
                <p className="text-yellow-700 text-sm">你并不孤单，有人愿意倾听和帮助你。</p>
              </div>
            )}

            {/* 卦象解读 */}
            {interpretation.guaMeaning && (
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-purple-700 mb-2">📜 卦象解读</h3>
                <p className="text-gray-700 leading-relaxed">{interpretation.guaMeaning}</p>
              </div>
            )}

            {/* 趣味解读 */}
            {interpretation.funInterpretation && (
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-pink-600 mb-2">🎭 趣味解读</h3>
                <p className="text-gray-700 leading-relaxed">{interpretation.funInterpretation}</p>
              </div>
            )}

            {/* 心理解读 */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-purple-700 mb-2">💭 心理解读</h3>
              <p className="text-gray-700 leading-relaxed">{interpretation.interpretation}</p>
            </div>

            {/* 心理建议 */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-600 mb-2">💡 心理建议</h3>
              <p className="text-gray-700 leading-relaxed">{interpretation.psychologyAdvice}</p>
            </div>

            {/* 行动建议 */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-orange-600 mb-2">🚀 行动建议</h3>
              <p className="text-gray-700 leading-relaxed">{interpretation.actionAdvice}</p>
            </div>

            {/* 免责声明 */}
            <p className="text-center text-xs text-gray-400 mt-4">
              仅供娱乐参考，不构成专业心理建议
            </p>

            <button onClick={reset} className="w-full py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors">
              🔄 重新摇卦
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
