import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { Mood, YaoLine, Gua, GuaInterpretation, ApiResponse } from '@/types';
import { MOOD_LABELS } from '@/types';

type Step = 'input' | 'generating' | 'result' | 'interpreting' | 'interpreted';

const MOOD_LIST: Mood[] = ['anxious', 'sad', 'confused', 'stressed', 'calm', 'happy', 'tired'];

export default function GuaPage() {
  const [question, setQuestion] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [step, setStep] = useState<Step>('input');
  const [guaResult, setGuaResult] = useState<Gua | null>(null);
  const [interpretation, setInterpretation] = useState<GuaInterpretation | null>(null);
  const [error, setError] = useState('');

  // 摇卦
  const handleGenerate = useCallback(async () => {
    if (!question.trim()) {
      setError('请输入你想问的问题');
      return;
    }
    if (!mood) {
      setError('请选择你当前的情绪状态');
      return;
    }
    setError('');
    setStep('generating');

    try {
      const res = await fetch('/api/gua/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), mood }),
      });
      const json: ApiResponse<Gua> = await res.json();
      if (json.code !== 0) {
        setError(json.message || '生成卦象失败，请重试');
        setStep('input');
        return;
      }
      setGuaResult(json.data);
      setStep('result');
    } catch {
      setError('网络请求失败，请检查网络后重试');
      setStep('input');
    }
  }, [question, mood]);

  // 解卦
  const handleInterpret = useCallback(async () => {
    if (!guaResult) return;
    setStep('interpreting');
    try {
      const res = await fetch('/api/gua/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guaId: guaResult.id,
          lines: guaResult.lines,
          question: guaResult.question,
          mood: guaResult.mood,
        }),
      });
      const json: ApiResponse<GuaInterpretation> = await res.json();
      if (json.code !== 0) {
        setError(json.message || '解卦失败，请重试');
        setStep('result');
        return;
      }
      setInterpretation(json.data);
      setStep('interpreted');
    } catch {
      setError('网络请求失败，请检查网络后重试');
      setStep('result');
    }
  }, [guaResult]);

  // 重新摇卦
  const handleReset = useCallback(() => {
    setQuestion('');
    setMood(null);
    setStep('input');
    setGuaResult(null);
    setInterpretation(null);
    setError('');
  }, []);

  // 判断是否是变爻
  const isChangingLine = (value: number) => value === 6 || value === 9;

  return (
    <>
      <Head>
        <title>摇卦问心 - 心易陪伴</title>
      </Head>

      <div className="page-container">
        {/* 页头导航 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(124, 58, 237, 0.06)',
              color: 'var(--color-primary)',
              fontSize: 18,
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
          >
            {'\u2190'}
          </Link>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            摇卦问心
          </h1>
        </div>

        {/* 错误提示 */}
        {error && (
          <div
            className="crisis-banner"
            style={{ marginBottom: 16, animation: 'fadeIn 0.3s ease' }}
          >
            <p style={{ color: '#92400e' }}>{error}</p>
          </div>
        )}

        {/* ====== Step 1: 输入阶段 ====== */}
        {step === 'input' && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            {/* 问题输入 */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: 8,
                }}
              >
                {'\u{1F4DD}'} 你心中所想的是什么？
              </label>
              <textarea
                className="input-textarea"
                rows={4}
                maxLength={200}
                placeholder="在这里写下你的问题或困惑... (最多200字)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div
                style={{
                  textAlign: 'right',
                  marginTop: 4,
                  fontSize: 12,
                  color: question.length >= 190 ? 'var(--color-secondary)' : 'var(--color-text-light)',
                }}
              >
                {question.length}/200
              </div>
            </div>

            {/* 情绪选择 */}
            <div style={{ marginBottom: 32 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: 12,
                }}
              >
                {'\u{1F60A}'} 你现在的情绪状态
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {MOOD_LIST.map((m) => (
                  <button
                    key={m}
                    className={`mood-tag ${mood === m ? 'mood-tag-active' : ''}`}
                    onClick={() => setMood(m)}
                    type="button"
                  >
                    {MOOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* 摇卦按钮 */}
            <div style={{ textAlign: 'center', paddingTop: 8 }}>
              <button
                className="btn-primary"
                style={{ width: '100%', maxWidth: 280, padding: '14px 32px', fontSize: 17 }}
                onClick={handleGenerate}
              >
                {'\u{1F3B2}'} 摇卦
              </button>
            </div>
          </div>
        )}

        {/* ====== Step 2: 生成中 ====== */}
        {step === 'generating' && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              animation: 'fadeIn 0.4s ease',
            }}
          >
            <div
              className="coin-toss"
              style={{
                fontSize: 48,
                marginBottom: 20,
                display: 'inline-block',
              }}
            >
              {'\u{1FA2}'}
            </div>
            <p
              style={{
                fontSize: 16,
                color: 'var(--color-text-secondary)',
                marginBottom: 8,
              }}
            >
              正在摇卦中...
            </p>
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* ====== Step 3: 显示卦象结果 ====== */}
        {step === 'result' && guaResult && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            {/* 问题回顾 */}
            <div
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                marginBottom: 24,
                border: '1px solid rgba(124, 58, 237, 0.06)',
              }}
            >
              <p style={{ fontSize: 13, color: 'var(--color-text-light)', marginBottom: 4 }}>你的问题</p>
              <p style={{ fontSize: 15, color: 'var(--color-text)' }}>{guaResult.question}</p>
            </div>

            {/* 卦象展示 */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: 32,
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px 24px',
                border: '1px solid rgba(124, 58, 237, 0.08)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* 卦名 */}
              <div style={{ marginBottom: 24 }}>
                <span
                  style={{
                    fontSize: 40,
                    display: 'block',
                    marginBottom: 8,
                    filter: 'drop-shadow(0 2px 8px rgba(124, 58, 237, 0.2))',
                  }}
                >
                  {'\u{1F52E}'}
                </span>
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    background: 'var(--gradient-main)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: 4,
                  }}
                >
                  {guaResult.guaName}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-light)' }}>
                  卦码: {guaResult.guaCode}
                </p>
              </div>

              {/* 六爻展示 */}
              <div
                style={{
                  width: '60%',
                  maxWidth: 200,
                  margin: '0 auto 20px',
                }}
              >
                {guaResult.lines.map((line: YaoLine) => {
                  const isYang = line.value === 7 || line.value === 9;
                  const isChanging = isChangingLine(line.value);
                  return (
                    <div key={line.position} className="yao-line">
                      <div
                        className={`${isYang ? 'yao-yang' : 'yao-yin'} ${isChanging ? 'yao-changing' : ''}`}
                        style={{
                          justifyContent: 'center',
                        }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 2,
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ fontSize: 10, color: 'var(--color-text-light)' }}>
                          {isYang ? '\u2588\u2588\u2588' : '\u2588\u2588 \u2588\u2588'}
                        </span>
                        {isChanging && (
                          <span style={{ fontSize: 10, color: 'var(--color-secondary)', fontWeight: 600 }}>
                            {'\u21BB'} 变
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 说明 */}
              <p style={{ fontSize: 12, color: 'var(--color-text-light)' }}>
                {'\u2588'} 阳爻 &nbsp;|&nbsp; 断线为阴爻 &nbsp;|&nbsp;{' '}
                <span style={{ color: 'var(--color-secondary)' }}>粉色为变爻</span>
              </p>
            </div>

            {/* 解卦按钮 */}
            <div style={{ textAlign: 'center' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', maxWidth: 280, padding: '14px 32px', fontSize: 17 }}
                onClick={handleInterpret}
              >
                {'\u{1F4D6}'} 开始解卦
              </button>
            </div>
          </div>
        )}

        {/* ====== Step 4: 解卦中 ====== */}
        {step === 'interpreting' && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              animation: 'fadeIn 0.4s ease',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 20,
                animation: 'coinToss 1s ease-in-out infinite',
                display: 'inline-block',
              }}
            >
              {'\u{1F9E9}'}
            </div>
            <p
              style={{
                fontSize: 16,
                color: 'var(--color-text-secondary)',
                marginBottom: 8,
              }}
            >
              正在解读卦象...
            </p>
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* ====== Step 5: 解卦结果 ====== */}
        {step === 'interpreted' && interpretation && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            {/* 卦象概览 */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: 24,
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                border: '1px solid rgba(124, 58, 237, 0.08)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  background: 'var(--gradient-main)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 4,
                }}
              >
                {interpretation.guaName || guaResult?.guaName}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {interpretation.guaMeaning}
              </p>
            </div>

            {/* 卦象解读 */}
            {interpretation.guaMeaning && (
              <div className="interpretation-section fade-in-up">
                <h3>{'\u{1F4D6}'} 卦象解读</h3>
                <p>{interpretation.guaMeaning}</p>
              </div>
            )}

            {/* 趣味解读 */}
            {interpretation.funInterpretation && (
              <div
                className="interpretation-section fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <h3>{'\u{1F604}'} 趣味解读</h3>
                <p>{interpretation.funInterpretation}</p>
              </div>
            )}

            {/* 心理解读 */}
            {interpretation.interpretation && (
              <div
                className="interpretation-section fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <h3>{'\u{1F9E0}'} 心理解读</h3>
                <p>{interpretation.interpretation}</p>
              </div>
            )}

            {/* 心理建议 */}
            {interpretation.psychologyAdvice && (
              <div
                className="interpretation-section fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <h3>{'\u{1F4A1}'} 心理建议</h3>
                <p>{interpretation.psychologyAdvice}</p>
              </div>
            )}

            {/* 行动建议 */}
            {interpretation.actionAdvice && (
              <div
                className="interpretation-section fade-in-up"
                style={{ animationDelay: '0.4s' }}
              >
                <h3>{'\u{1F3AF}'} 行动建议</h3>
                <p>{interpretation.actionAdvice}</p>
              </div>
            )}

            {/* 变爻特别解读 */}
            {interpretation.changingLines && interpretation.changingLines.length > 0 && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(124, 58, 237, 0.05))',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  marginBottom: 16,
                  border: '1px solid rgba(236, 72, 153, 0.15)',
                  animation: 'fadeInUp 0.5s ease 0.4s both',
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--color-secondary)',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {'\u2728'} 变爻特别解读
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {interpretation.changingLines.map((cl) => (
                    <div
                      key={cl.position}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(236, 72, 153, 0.1)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-secondary)',
                          display: 'block',
                          marginBottom: 4,
                        }}
                      >
                        第 {cl.position} 爻
                      </span>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text)' }}>
                        {cl.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 危机标志求助信息 */}
            {interpretation.crisisFlag && (
              <div className="crisis-banner" style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{'\u{1F6E1}\u{FE0F}'}</span>
                  <strong style={{ fontSize: 15, color: '#991b1b' }}>关注你的安全</strong>
                </div>
                <p style={{ color: '#991b1b', fontSize: 14, lineHeight: 1.8 }}>
                  我们注意到你可能在经历一些困难时刻。请知道，寻求帮助是勇敢的表现，你值得被关心和支持。
                </p>
                <div
                  style={{
                    marginTop: 12,
                    padding: '12px 16px',
                    background: 'rgba(153, 27, 27, 0.06)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <p style={{ color: '#991b1b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    24小时心理危机干预热线
                  </p>
                  <p style={{ color: '#991b1b', fontSize: 15, fontWeight: 700 }}>
                    400-161-9995
                  </p>
                </div>
              </div>
            )}

            {/* 底部操作按钮 */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 32,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                className="btn-primary"
                style={{ minWidth: 140 }}
                onClick={handleReset}
              >
                {'\u{1F504}'} 重新摇卦
              </button>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <button
                  className="btn-primary"
                  style={{
                    minWidth: 140,
                    background: 'var(--color-bg-card)',
                    color: 'var(--color-primary)',
                    border: '2px solid rgba(124, 58, 237, 0.2)',
                    boxShadow: 'none',
                  }}
                >
                  {'\u{1F3E0}'} 返回首页
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
