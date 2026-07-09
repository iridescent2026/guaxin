import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { Mood, YaoLine, Gua, GuaInterpretation, ApiResponse } from '@/types';
import { MOOD_LABELS } from '@/types';

type Step = 'input' | 'drawing' | 'drawing-stick' | 'result' | 'interpreting' | 'interpreted';

const MOOD_LIST: Mood[] = ['anxious', 'sad', 'confused', 'stressed', 'calm', 'happy', 'tired'];
const YAO_NAMES = ['初', '二', '三', '四', '五', '上'];

export default function GuaPage() {
  const [question, setQuestion] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [step, setStep] = useState<Step>('input');
  const [guaResult, setGuaResult] = useState<Gua | null>(null);
  const [interpretation, setInterpretation] = useState<GuaInterpretation | null>(null);
  const [error, setError] = useState('');
  // 六爻摇卦状态
  const [sticks, setSticks] = useState<YaoLine[]>([]);         // 已抽出的爻
  const [isShaking, setIsShaking] = useState<boolean>(false);   // 是否正在摇卦
  const [currentLine, setCurrentLine] = useState<number>(1);     // 当前第几爻 (1-6)

  // 开始摇卦（调用一次 API，获取完整六爻）
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
      // 重置摇卦状态
      setSticks([]);
      setCurrentLine(1);
      setIsShaking(false);
      // 直接进入摇卦页面
      setStep('drawing-stick');
    } catch {
      setError('网络请求失败，请检查网络后重试');
      setStep('input');
    }
  }, [question, mood]);

  // 摇卦按钮点击（两段式：开始摇卦 → 结束摇卦 → 显示一爻）
  const handleDrawStick = useCallback(() => {
    if (!guaResult) return;

    // 如果正在摇卦中，点击结束
    if (isShaking) {
      // 结束摇卦，添加当前爻到 sticks
      const lineToAdd = guaResult.lines[sticks.length];
      const newSticks = [...sticks, lineToAdd];
      setSticks(newSticks);
      setIsShaking(false);

      // 如果六爻全部完成，进入卦象展示页
      if (newSticks.length >= 6) {
        setStep('result');  // 六爻完成后进入 result 页面显示完整卦象
      }
      return;
    }

    // 如果六爻全部完成（理论上此时已在 result 页面），不再处理
    if (sticks.length >= 6) {
      return;
    }

    // 开始摇卦（进入摇卦动画状态）
    setIsShaking(true);
  }, [guaResult, sticks, isShaking]);

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
    setSticks([]);
    setCurrentLine(1);
    setIsShaking(false);
  }, []);

  // 判断是否是变爻
  const isChangingLine = (value: number) => value === 6 || value === 9;

  // ==================== 心理陪伴风格配色 ====================
  const colors = {
    bg: '#F8FAF8',           // 浅青灰背景
    card: '#FFFFFF',          // 纯白卡片
    sage: '#A8C4A8',          // 青绿色
    sageDark: '#7BA37B',      // 深青绿
    cream: '#F5F0E8',        // 米白
    warmGray: '#E8E4DE',     // 暖灰
    text: '#4A4A4A',         // 深灰文字
    textLight: '#7A7A7A',    // 浅灰文字
    accent: '#7BA37B',        // 青绿强调色
    bamboo: '#D4C8B8',        // 浅木色
    bambooDark: '#B8A898',   // 深木色
    softBlue: '#B8C8D4',      // 柔和蓝（用于资讯卡片）
  };

  // 当前抽到第几签（1-6）
  const currentStick = sticks.length;

  return (
    <>
      <Head>
        <title>摇卦问心 - 心易陪伴</title>
      </Head>

      <div style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        padding: '0 16px 60px',
      }}>
        {/* ====== 页头导航 ====== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingTop: 20,
          marginBottom: 32,
        }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 12,
              background: colors.card,
              color: colors.accent,
              fontSize: 18,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(139, 115, 85, 0.1)',
            }}
          >
            ←
          </Link>
          <h1 style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.text,
            letterSpacing: 2,
          }}>
            周易摇卦
          </h1>
        </div>

        {/* ====== 错误提示 ====== */}
        {error && (
          <div style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: 16,
            padding: '14px 20px',
            marginBottom: 24,
          }}>
            <p style={{ color: '#92400e', fontSize: 14 }}>{error}</p>
          </div>
        )}

        {/* ====== Step 1: 输入阶段 ====== */}
        {step === 'input' && (
          <div>
            {/* 标题区 */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{
                fontSize: 48,
                marginBottom: 12,
                filter: 'drop-shadow(0 2px 8px rgba(123, 163, 123, 0.15))',
              }}>
                🍃
              </div>
              <h2 style={{
                fontSize: 22,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 8,
              }}>
                借助传统文化帮助表达内心感受
              </h2>
              <p style={{
                fontSize: 14,
                color: colors.textLight,
                lineHeight: 1.7,
                maxWidth: 320,
                margin: '0 auto',
              }}>
                借助《周易》的文化智慧，帮助整理思绪，AI 将为你提供积极、温暖的心理陪伴建议
              </p>
            </div>

            {/* 问题输入卡片 */}
            <div style={{
              background: colors.card,
              borderRadius: 24,
              padding: 24,
              marginBottom: 20,
              boxShadow: '0 4px 20px rgba(123, 163, 123, 0.08)',
            }}>
              <label style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 12,
              }}>
                ✏️ 最近有什么事情困扰着你？
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="写下你的困惑或心事..."
                maxLength={200}
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `1.5px solid ${colors.warmGray}`,
                  borderRadius: 16,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: colors.text,
                  background: colors.bg,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{
                textAlign: 'right',
                marginTop: 8,
                fontSize: 12,
                color: question.length >= 190 ? colors.accent : colors.textLight,
              }}>
                {question.length}/200
              </div>
            </div>

            {/* 情绪选择卡片 */}
            <div style={{
              background: colors.card,
              borderRadius: 24,
              padding: 24,
              marginBottom: 20,
              boxShadow: '0 4px 20px rgba(123, 163, 123, 0.08)',
            }}>
              <label style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 16,
              }}>
                🍃 你现在的情绪状态
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                justifyContent: 'center',
              }}>
                {MOOD_LIST.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    type="button"
                    style={{
                      padding: '10px 20px',
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      border: mood === m ? 'none' : `1.5px solid ${colors.warmGray}`,
                      background: mood === m
                        ? `linear-gradient(135deg, ${colors.sage}, ${colors.sageDark})`
                        : colors.card,
                      color: mood === m ? '#FFFFFF' : colors.textLight,
                      boxShadow: mood === m
                        ? '0 4px 12px rgba(123, 163, 123, 0.4)'
                        : '0 2px 6px rgba(0, 0, 0, 0.04)',
                      transform: mood === m ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {MOOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* 引导语 */}
            <div style={{
              textAlign: 'center',
              padding: '20px 0',
              color: colors.textLight,
              fontSize: 13,
              lineHeight: 1.8,
            }}>
              <p>① 在心中想一个最近困扰自己的问题</p>
              <p>② 点击开始摇卦，完成六次摇卦</p>
              <p>③ AI 将结合卦象和问题进行分析</p>
              <p>④ 阅读今日启示与行动建议</p>
            </div>

            {/* 竹签展示区 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 24,
              padding: '20px 0',
            }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 48,
                    background: `linear-gradient(180deg, ${colors.bamboo}, ${colors.bambooDark})`,
                    borderRadius: 4,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  }}
                />
              ))}
            </div>

            {/* 开始摇卦按钮 */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleGenerate}
                style={{
                  padding: '16px 48px',
                  background: `linear-gradient(135deg, ${colors.sage}, ${colors.sageDark})`,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 30,
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(123, 163, 123, 0.3)',
                  letterSpacing: 2,
                }}
              >
                开始摇卦
              </button>
            </div>

            {/* 底部免责 */}
            <div style={{
              textAlign: 'center',
              padding: '24px 0 0',
              color: colors.textLight,
              fontSize: 11,
              lineHeight: 1.6,
            }}>
              <p>本功能仅供传统文化体验与心理陪伴参考</p>
              <p>不作为任何医疗、心理咨询或现实决策依据</p>
            </div>
          </div>
        )}

        {/* ====== Step 2: 准备摇卦动画 ====== */}
        {step === 'drawing' && (
          <div style={{
            textAlign: 'center',
            paddingTop: 80,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 40,
            }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 60,
                    background: `linear-gradient(180deg, ${colors.bamboo}, ${colors.bambooDark})`,
                    borderRadius: 5,
                    animation: `bambooShake 0.6s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                />
              ))}
            </div>
            <p style={{
              fontSize: 18,
              color: colors.text,
              marginBottom: 12,
              fontWeight: 500,
            }}>
              正在生成第 {sticks.length + 1} 爻
            </p>
            <p style={{
              fontSize: 14,
              color: colors.textLight,
            }}>
              静心等待中...
            </p>

            <style>{`
              @keyframes bambooShake {
                0%, 100% { transform: rotate(-3deg); }
                50% { transform: rotate(3deg); }
              }
            `}</style>
          </div>
        )}

        {/* ====== Step 3: 摇卦过程 ====== */}
        {step === 'drawing-stick' && guaResult && (
          <div>
            {/* 问题回顾 */}
            <div style={{
              background: colors.card,
              borderRadius: 20,
              padding: '20px 24px',
              marginBottom: 20,
              boxShadow: '0 4px 16px rgba(123, 163, 123, 0.08)',
            }}>
              <p style={{
                fontSize: 12,
                color: colors.textLight,
                marginBottom: 6,
                letterSpacing: 1,
              }}>
                你的问题
              </p>
              <p style={{
                fontSize: 15,
                color: colors.text,
                lineHeight: 1.6,
              }}>
                {guaResult.question}
              </p>
            </div>

            {/* 摇卦进度指示器 */}
            <div style={{
              textAlign: 'center',
              marginBottom: 24,
            }}>
              <p style={{
                fontSize: 14,
                color: colors.textLight,
                marginBottom: 8,
              }}>
                第 {sticks.length + 1} 爻 / 共 6 爻
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
              }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: i < sticks.length
                        ? colors.accent
                        : i === sticks.length && !isShaking
                          ? colors.sage
                          : colors.warmGray,
                      transition: 'all 0.3s ease',
                      boxShadow: i < sticks.length
                        ? `0 0 8px ${colors.accent}60`
                        : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 摇卦主区域 */}
            <div style={{
              background: colors.card,
              borderRadius: 28,
              padding: '32px 24px',
              marginBottom: 24,
              boxShadow: '0 8px 32px rgba(123, 163, 123, 0.08)',
              textAlign: 'center',
            }}>
              {/* 摇卦动画区 */}
              <div style={{
                fontSize: 80,
                marginBottom: 20,
                animation: isShaking ? 'bambooShake 0.15s ease-in-out infinite' : 'none',
              }}>
                {isShaking ? '🎋' : '🍃'}
              </div>

              {/* 爻线展示区域（从下到上，已完成的爻） */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
                minHeight: 200,
                justifyContent: 'flex-end',
              }}>
                {/* 已完成的爻 */}
                {sticks.map((line, i) => {
                  const isYang = line.value === 7 || line.value === 9;
                  const isChanging = isChangingLine(line.value);
                  return (
                    <div
                      key={line.position}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        maxWidth: 220,
                        animation: 'slideUp 0.4s ease-out',
                      }}
                    >
                      <span style={{
                        fontSize: 11,
                        color: colors.accent,
                        width: 20,
                      }}>
                        {YAO_NAMES[i]}
                      </span>
                      <div style={{
                        flex: 1,
                        height: isChanging ? 10 : 8,
                        background: isChanging
                          ? `linear-gradient(90deg, ${colors.sage}, ${colors.accent})`
                          : isYang
                            ? `linear-gradient(90deg, ${colors.bambooDark}, ${colors.bamboo})`
                            : colors.warmGray,
                        borderRadius: isChanging ? 5 : 4,
                        boxShadow: isChanging ? `0 0 8px ${colors.accent}40` : 'none',
                      }} />
                      {isChanging && (
                        <span style={{
                          fontSize: 10,
                          color: colors.accent,
                          fontWeight: 600,
                        }}>
                          变
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* 当前爻位置（未完成） */}
                {!isShaking && sticks.length < 6 && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 220,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      opacity: 0.4,
                    }}
                  >
                    <span style={{
                      fontSize: 11,
                      color: colors.textLight,
                      width: 20,
                    }}>
                      {YAO_NAMES[sticks.length]}
                    </span>
                    <div style={{
                      flex: 1,
                      height: 8,
                      background: colors.warmGray,
                      borderRadius: 4,
                    }} />
                  </div>
                )}

                {/* 摇卦动画中的占位 */}
                {isShaking && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 220,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      animation: 'pulse 1s ease-in-out infinite',
                    }}
                  >
                    <span style={{
                      fontSize: 11,
                      color: colors.sageDark,
                      width: 20,
                    }}>
                      {YAO_NAMES[sticks.length]}
                    </span>
                    <div style={{
                      flex: 1,
                      height: 10,
                      background: `linear-gradient(90deg, ${colors.sage}, ${colors.sageDark})`,
                      borderRadius: 5,
                      boxShadow: `0 0 12px ${colors.sage}80`,
                    }} />
                  </div>
                )}

                {/* 剩余空位 */}
                {[sticks.length + 1, 1, 2, 3, 4, 5].slice(0, Math.max(0, 5 - sticks.length - (isShaking ? 1 : 0))).map((i) => (
                  <div
                    key={`empty-${i}`}
                    style={{
                      width: '100%',
                      maxWidth: 220,
                      height: 8,
                      background: colors.warmGray,
                      borderRadius: 4,
                      opacity: 0.2,
                    }}
                  />
                ))}
              </div>

              {/* 提示文字 */}
              <p style={{
                fontSize: 15,
                color: colors.textLight,
                marginBottom: 20,
                minHeight: 24,
              }}>
                {isShaking
                  ? `正在摇第 ${sticks.length + 1} 爻……`
                  : sticks.length >= 6
                    ? '六爻已完成'
                    : `第 ${sticks.length + 1} 爻已就位`}
              </p>

              {/* 开始摇卦 / 结束摇卦按钮 */}
              <button
                onClick={handleDrawStick}
                style={{
                  padding: '14px 40px',
                  background: isShaking
                    ? `linear-gradient(135deg, ${colors.warmGray}, ${colors.textLight})`
                    : `linear-gradient(135deg, ${colors.sage}, ${colors.sageDark})`,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 30,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: isShaking
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                    : '0 4px 16px rgba(123, 163, 123, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                {isShaking ? '结束摇卦' : '开始摇卦'}
              </button>
            </div>

            <style>{`
              @keyframes bambooShake {
                0%, 100% { transform: rotate(-8deg) scale(1.05); }
                50% { transform: rotate(8deg) scale(1.05); }
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.02); }
              }
            `}</style>
          </div>
        )}

        {/* ====== Step 4: 显示卦象结果 ====== */}
        {step === 'result' && guaResult && (
          <div>
            {/* 问题回顾 */}
            <div style={{
              background: colors.card,
              borderRadius: 20,
              padding: '20px 24px',
              marginBottom: 20,
              boxShadow: '0 4px 16px rgba(123, 163, 123, 0.08)',
            }}>
              <p style={{
                fontSize: 12,
                color: colors.textLight,
                marginBottom: 6,
                letterSpacing: 1,
              }}>
                你的问题
              </p>
              <p style={{
                fontSize: 15,
                color: colors.text,
                lineHeight: 1.6,
              }}>
                {guaResult.question}
              </p>
            </div>

            {/* 卦象卡片 */}
            <div style={{
              background: colors.card,
              borderRadius: 28,
              padding: '32px 24px',
              marginBottom: 24,
              boxShadow: '0 8px 32px rgba(123, 163, 123, 0.08)',
              textAlign: 'center',
            }}>
              {/* 卦名 */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  fontSize: 56,
                  marginBottom: 12,
                  filter: 'drop-shadow(0 3px 8px rgba(123, 163, 123, 0.15))',
                }}>
                  🍃
                </div>
                <h2 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: colors.accent,
                  marginBottom: 6,
                  letterSpacing: 4,
                }}>
                  {guaResult.guaName}
                </h2>
                <p style={{
                  fontSize: 12,
                  color: colors.textLight,
                  letterSpacing: 2,
                }}>
                  六爻已完成
                </p>
              </div>

              {/* 六爻展示 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                marginBottom: 28,
              }}>
                {[...guaResult.lines].reverse().map((line: YaoLine) => {
                  const isYang = line.value === 7 || line.value === 9;
                  const isChanging = isChangingLine(line.value);
                  return (
                    <div
                      key={line.position}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        maxWidth: 220,
                      }}
                    >
                      <span style={{
                        fontSize: 11,
                        color: colors.textLight,
                        width: 20,
                      }}>
                        {YAO_NAMES[line.position - 1]}
                      </span>
                      <div style={{
                        flex: 1,
                        height: isChanging ? 10 : 8,
                        background: isChanging
                          ? `linear-gradient(90deg, ${colors.sage}, ${colors.accent})`
                          : isYang
                            ? `linear-gradient(90deg, ${colors.bambooDark}, ${colors.bamboo})`
                            : colors.warmGray,
                        borderRadius: isChanging ? 5 : 4,
                        boxShadow: isChanging
                          ? '0 0 8px rgba(123, 163, 123, 0.3)'
                          : 'none',
                        transition: 'all 0.3s ease',
                      }} />
                      {isChanging && (
                        <span style={{
                          fontSize: 10,
                          color: colors.accent,
                          fontWeight: 600,
                        }}>
                          变
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 图例 */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                fontSize: 12,
                color: colors.textLight,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 24,
                    height: 4,
                    background: colors.bamboo,
                    borderRadius: 2,
                  }} />
                  阳
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 24,
                    height: 4,
                    background: colors.warmGray,
                    borderRadius: 2,
                  }} />
                  阴
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 24,
                    height: 4,
                    background: colors.accent,
                    borderRadius: 2,
                  }} />
                  变爻
                </span>
              </div>
            </div>

            {/* 完成摇卦按钮 */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleInterpret}
                style={{
                  padding: '16px 48px',
                  background: `linear-gradient(135deg, ${colors.sage}, ${colors.sageDark})`,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 30,
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(123, 163, 123, 0.3)',
                  letterSpacing: 2,
                }}
              >
                查看 AI 心理解读
              </button>
            </div>
          </div>
        )}

        {/* ====== Step 5: AI 分析中 ====== */}
        {step === 'interpreting' && (
          <div style={{
            textAlign: 'center',
            paddingTop: 80,
          }}>
            <div style={{
              fontSize: 64,
              marginBottom: 32,
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              💭
            </div>
            <p style={{
              fontSize: 18,
              color: colors.text,
              marginBottom: 12,
              fontWeight: 500,
            }}>
              等待 AI 分析
            </p>
            <p style={{
              fontSize: 14,
              color: colors.textLight,
            }}>
              请稍候...
            </p>

            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
              }
            `}</style>
          </div>
        )}

        {/* ====== Step 6: AI 心理解读结果 ====== */}
        {step === 'interpreted' && interpretation && (
          <div>
            {/* 页面标题 */}
            <div style={{
              textAlign: 'center',
              marginBottom: 24,
              background: colors.card,
              borderRadius: 28,
              padding: '28px 24px',
              boxShadow: '0 8px 32px rgba(123, 163, 123, 0.08)',
            }}>
              <div style={{
                fontSize: 48,
                marginBottom: 12,
              }}>
                💭
              </div>
              <h2 style={{
                fontSize: 26,
                fontWeight: 700,
                color: colors.accent,
                marginBottom: 8,
                letterSpacing: 3,
              }}>
                AI 心理解读
              </h2>
              <p style={{
                fontSize: 14,
                color: colors.textLight,
                lineHeight: 1.7,
              }}>
                {guaResult?.guaName} · {guaResult?.question}
              </p>
            </div>

            {/* 你的问题 */}
            <div style={{
              background: colors.card,
              borderRadius: 20,
              padding: '20px 24px',
              marginBottom: 16,
              boxShadow: '0 4px 16px rgba(123, 163, 123, 0.08)',
            }}>
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                color: colors.sageDark,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span>❓</span> 你的问题
              </h3>
              <p style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: colors.text,
              }}>
                {guaResult?.question || '（暂无内容）'}
              </p>
            </div>

            {/* 传统文化启示 */}
            {interpretation.guaMeaning && (
              <div style={{
                background: colors.card,
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(123, 163, 123, 0.08)',
              }}>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: colors.accent,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span>📜</span> 传统文化启示
                </h3>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: colors.text,
                }}>
                  {interpretation.guaMeaning}
                </p>
              </div>
            )}

            {/* 心理建议 */}
            {interpretation.psychologyAdvice && (
              <div style={{
                background: colors.card,
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(123, 163, 123, 0.08)',
              }}>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: colors.sageDark,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span>💡</span> 心理建议
                </h3>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: colors.text,
                }}>
                  {interpretation.psychologyAdvice}
                </p>
              </div>
            )}

            {/* 今日行动建议 */}
            {interpretation.actionAdvice && (
              <div style={{
                background: colors.card,
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(123, 163, 123, 0.08)',
              }}>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: colors.softBlue,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span>🌱</span> 今日行动建议
                </h3>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: colors.text,
                }}>
                  {interpretation.actionAdvice}
                </p>
              </div>
            )}

            {/* 变爻特别解读 */}
            {interpretation.changingLines && interpretation.changingLines.length > 0 && (
              <div style={{
                background: `linear-gradient(135deg, ${colors.sage}20, ${colors.softBlue}20)`,
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 16,
                border: `1px solid ${colors.sage}40`,
              }}>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: colors.accent,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span>🔄</span> 变爻解读
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {interpretation.changingLines.map((cl) => (
                    <div
                      key={cl.position}
                      style={{
                        padding: '14px 18px',
                        background: colors.card,
                        borderRadius: 14,
                        border: `1px solid ${colors.warmGray}`,
                      }}
                    >
                      <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: colors.accent,
                        display: 'block',
                        marginBottom: 6,
                      }}>
                        第 {YAO_NAMES[cl.position - 1]} 爻
                      </span>
                      <p style={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: colors.text,
                      }}>
                        {cl.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 危机标志求助信息 */}
            {interpretation.crisisFlag && (
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 16,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}>
                  <span style={{ fontSize: 24 }}>🫂</span>
                  <strong style={{
                    fontSize: 16,
                    color: '#92400e',
                  }}>
                    我们在这里关心你
                  </strong>
                </div>
                <p style={{
                  color: '#92400e',
                  fontSize: 14,
                  lineHeight: 1.8,
                }}>
                  听到你这么说，我们很担心你。请记得，你并不孤单，有人愿意倾听和帮助你。
                </p>
                <div style={{
                  marginTop: 16,
                  padding: '14px 18px',
                  background: '#FEF9C7',
                  borderRadius: 14,
                  border: '1px solid #F59E0B',
                }}>
                  <p style={{
                    color: '#92400e',
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}>
                    24小时心理危机干预热线
                  </p>
                  <p style={{
                    color: '#92400e',
                    fontSize: 18,
                    fontWeight: 700,
                  }}>
                    400-161-9995
                  </p>
                </div>
              </div>
            )}

            {/* 底部操作按钮 */}
            <div style={{
              display: 'flex',
              gap: 12,
              marginTop: 32,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '14px 32px',
                  background: `linear-gradient(135deg, ${colors.sage}, ${colors.sageDark})`,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 25,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(123, 163, 123, 0.3)',
                }}
              >
                结束本次摇卦
              </button>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    padding: '14px 32px',
                    background: colors.card,
                    color: colors.accent,
                    border: `1.5px solid ${colors.warmGray}`,
                    borderRadius: 25,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  返回首页
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
