import { useState, useRef, useEffect, useCallback } from 'react';
import type { Character, ChatHistoryItem, ChatReply, CrisisResources } from '@/types';

/* ========== 硬编码角色数据 ========== */
const CHARACTERS: (Character & { description: string })[] = [
  {
    id: '1',
    name: '古见',
    title: '温柔倾听者',
    promptKey: 'furude',
    personality: '温柔、倾听、治愈',
    tags: ['温柔', '倾听', '治愈'],
    description:
      '来自《古见同学有交流障碍症》的温柔少女。虽然有着社交恐惧，但内心丰富而敏感，善于通过文字表达真挚的情感，是最温柔的倾听者。',
  },
  {
    id: '2',
    name: '五条',
    title: '最强导师',
    promptKey: 'gojo',
    personality: '自信、直接、守护',
    tags: ['自信', '直接', '守护'],
    description:
      '来自《咒术回战》的最强咒术师。自信满满，偶尔毒舌但内心极其关心身边每一个人，会用霸气的方式守护你的心灵。',
  },
  {
    id: '3',
    name: '射干',
    title: '巫女守护者',
    promptKey: 'yakan',
    personality: '神秘、温暖、灵性',
    tags: ['神秘', '温暖', '灵性'],
    description:
      '银发琥珀眼的温柔巫女，能感知人的情绪。说话带着神秘的诗意，用自然和神社的意象为你编织心灵的庇护之所。',
  },
];

/* ========== 角色对应的头像 emoji ========== */
const AVATAR_MAP: Record<string, { emoji: string; bg: string }> = {
  furude: { emoji: '\u{1F338}', bg: 'bg-pink-100' },
  gojo: { emoji: '\u{1F60E}', bg: 'bg-indigo-100' },
  yakan: { emoji: '\u{1F319}', bg: 'bg-purple-100' },
};

/* ========== 类型定义 ========== */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isCrisis: boolean;
  crisisResources?: CrisisResources;
}

/* ========== 主组件 ========== */
export default function ChatPage() {
  // 页面阶段：select（角色选择） | chat（聊天）
  const [phase, setPhase] = useState<'select' | 'chat'>('select');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ---------- 自动滚到底部 ---------- */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /* ---------- 选择角色 ---------- */
  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setPhase('chat');
  };

  /* ---------- 返回角色选择 ---------- */
  const handleBack = () => {
    setPhase('select');
    setMessages([]);
    setInputValue('');
    setSelectedCharacter(null);
  };

  /* ---------- 发送消息 ---------- */
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading || !selectedCharacter) return;

    // 用户消息
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      isCrisis: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // 重置 textarea 高度
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // 构建对话历史
    const history: ChatHistoryItem[] = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: null,
          roleId: selectedCharacter.promptKey,
          message: trimmed,
          history,
        }),
      });

      const json = await res.json();

      if (json.code === 0 && json.data) {
        const data: ChatReply = json.data;
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
          isCrisis: data.isCrisis,
          crisisResources: data.crisisResources,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // 错误处理
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: json.message || '抱歉，出了点问题，请稍后再试~',
          isCrisis: false,
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '网络好像不太稳定，请检查网络后重试~',
        isCrisis: false,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      // 重新聚焦输入框
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  /* ---------- 键盘事件：Enter 发送，Shift+Enter 换行 ---------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ---------- Textarea 自适应高度 ---------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  /* ========== 渲染：角色选择阶段 ========== */
  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-sage-50">
        {/* 顶部装饰 */}
        <div className="pt-12 pb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            选择你的心灵伙伴
          </h1>
          <p className="text-gray-500 text-base">
            每个人都需要一个可以倾诉的伙伴
          </p>
        </div>

        {/* 角色卡片 */}
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHARACTERS.map((char) => {
              const avatar = AVATAR_MAP[char.promptKey];
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className="
                    group relative bg-white rounded-2xl p-6 shadow-sm
                    hover:shadow-xl hover:-translate-y-1
                    transition-all duration-300 ease-out
                    border-2 border-transparent hover:border-warm-300
                    focus:outline-none focus:ring-2 focus:ring-warm-300 focus:ring-offset-2
                    text-left cursor-pointer
                  "
                >
                  {/* 头像 */}
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      text-3xl mb-4 ${avatar.bg}
                      group-hover:scale-110 transition-transform duration-300
                    `}
                  >
                    {avatar.emoji}
                  </div>

                  {/* 角色名 & 称号 */}
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {char.name}
                  </h2>
                  <p className="text-sm text-warm-500 font-medium mb-3">
                    {char.title}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {char.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-0.5 text-xs rounded-full bg-sage-50 text-sage-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 简介 */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {char.description}
                  </p>

                  {/* 选择按钮提示 */}
                  <div className="mt-4 text-center">
                    <span className="text-sm text-warm-400 group-hover:text-warm-600 transition-colors">
                      点击开始聊天
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ========== 渲染：聊天阶段 ========== */
  const avatar = selectedCharacter ? AVATAR_MAP[selectedCharacter.promptKey] : null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-warm-50 to-white">
      {/* 顶部导航栏 */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {/* 返回按钮 */}
          <button
            onClick={handleBack}
            className="
              w-9 h-9 rounded-full flex items-center justify-center
              bg-gray-100 hover:bg-gray-200 transition-colors
              text-gray-600 text-lg cursor-pointer
            "
            aria-label="返回角色选择"
          >
            &larr;
          </button>

          {/* 角色头像 */}
          {avatar && (
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-xl
                ${avatar.bg}
              `}
            >
              {avatar.emoji}
            </div>
          )}

          {/* 角色名 */}
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              {selectedCharacter?.name}
            </h2>
            <p className="text-xs text-gray-400">{selectedCharacter?.title}</p>
          </div>
        </div>
      </header>

      {/* 消息列表区域 */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* 欢迎消息 */}
          {messages.length === 0 && selectedCharacter && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-xl flex-shrink-0 ${avatar?.bg}
                `}
              >
                {avatar?.emoji}
              </div>
              <div
                className="
                  bg-white rounded-2xl rounded-tl-md px-4 py-3
                  shadow-sm border border-gray-100 max-w-[75%]
                "
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  嗨~ 我是{selectedCharacter.name}，你的{selectedCharacter.title}
                  。有什么想跟我聊聊的吗？不管开心还是不开心，我都在这里陪着你。
                </p>
              </div>
            </div>
          )}

          {/* 消息列表 */}
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div
                  key={msg.id}
                  className="flex justify-end animate-slide-up"
                >
                  <div
                    className="
                      bg-warm-400 text-white rounded-2xl rounded-tr-md
                      px-4 py-2.5 shadow-sm max-w-[75%]
                    "
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            }

            // AI 消息
            return (
              <div key={msg.id} className="space-y-3 animate-slide-up">
                <div className="flex items-start gap-3">
                  {/* 头像 */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      text-xl flex-shrink-0 ${avatar?.bg}
                    `}
                  >
                    {avatar?.emoji}
                  </div>
                  {/* 气泡 */}
                  <div
                    className="
                      bg-white rounded-2xl rounded-tl-md px-4 py-3
                      shadow-sm border border-gray-100 max-w-[75%]
                    "
                  >
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>

                {/* 危机求助卡片 */}
                {msg.isCrisis && msg.crisisResources && (
                  <CrisisCard resources={msg.crisisResources} />
                )}
              </div>
            );
          })}

          {/* 加载动画 */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-xl flex-shrink-0 ${avatar?.bg}
                `}
              >
                {avatar?.emoji}
              </div>
              <div
                className="
                  bg-white rounded-2xl rounded-tl-md px-4 py-3
                  shadow-sm border border-gray-100
                "
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 mr-1">正在思考</span>
                  <span
                    className="w-2 h-2 rounded-full bg-warm-300 animate-typing-dot"
                    style={{ animationDelay: '0s' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-warm-300 animate-typing-dot"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-warm-300 animate-typing-dot"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 滚动锚点 */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 底部输入栏 */}
      <footer className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="说出你的心声..."
            rows={1}
            disabled={isLoading}
            className="
              flex-1 resize-none rounded-xl border border-gray-200
              bg-gray-50 px-4 py-2.5 text-sm text-gray-700
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              leading-relaxed
            "
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              bg-warm-400 hover:bg-warm-500 text-white
              disabled:bg-gray-200 disabled:text-gray-400
              transition-colors cursor-pointer
            "
            aria-label="发送"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-2">
          AI 陪伴不能替代专业心理咨询，如需帮助请联系校心理中心
        </p>
      </footer>
    </div>
  );
}

/* ========== 危机求助卡片 ========== */
function CrisisCard({ resources }: { resources: CrisisResources }) {
  return (
    <div
      className="
        ml-13 bg-red-50 border border-red-200 rounded-xl p-4 max-w-[75%]
        animate-slide-up
      "
      style={{ marginLeft: '52px' }}
    >
      <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">
          !
        </span>
        如果你正在经历困难，请记住你并不孤单
      </h3>

      <div className="space-y-2">
        {/* 热线电话 */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-red-500 font-medium">心理热线：</span>
          <span className="text-red-800 font-semibold">{resources.hotline}</span>
        </div>

        {/* 校心理中心 */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-red-500 font-medium">校心理中心：</span>
          <span className="text-red-800">{resources.campusCenter}</span>
        </div>

        {/* 温馨提示 */}
        <p className="text-sm text-red-600 mt-2 pt-2 border-t border-red-100 leading-relaxed">
          {resources.tip}
        </p>
      </div>
    </div>
  );
}
