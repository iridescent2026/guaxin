import { useState, useEffect } from 'react';
import { MainLayout } from '@/components';
import { CharacterGrid, CharacterHeader, ChatWindow } from '@/components/chat';
import type { Character as ApiCharacter } from '@/types';

/**
 * 人物视觉资源（本地静态文件 → 存于 public/images/characters/）
 * 每个角色 2 张：avatar 头像 + cover 卡片背景图
 * 均为真实相关人物/壁纸下载，避免 AI 占位图服务返回同一张占位图。
 */
const CHAR_IMG_BASE = '/images/characters';

/** 按 promptKey 的人设返回：头像 + 卡片背景 + 渐变色 */
function promptKeyVisual(promptKey: string): {
  avatar: string;
  coverImage: string;
  gradient: string;
} {
  if (promptKey === 'furude') {
    // 古见硝子（古見さんは、コミュ症です。）—— 温柔倾听者
    return {
      avatar: `${CHAR_IMG_BASE}/furude-avatar.jpg`,
      coverImage: `${CHAR_IMG_BASE}/furude-cover.jpg`,
      gradient: 'bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500',
    };
  }
  if (promptKey === 'gojo') {
    // 五条悟（呪術廻戦 / Jujutsu Kaisen）—— 最强导师
    return {
      avatar: `${CHAR_IMG_BASE}/gojo-avatar.jpg`,
      coverImage: `${CHAR_IMG_BASE}/gojo-cover.jpg`,
      gradient: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600',
    };
  }
  // yakan / 射干：原创温柔系巫女（人设：銀白長髪 + 琥珀瞳 + 神社鳥居紫陽花）
  return {
    avatar: `${CHAR_IMG_BASE}/yakan-avatar.jpg`,
    coverImage: `${CHAR_IMG_BASE}/yakan-cover.jpg`,
    gradient: 'bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600',
  };
}

// 前端展示用的角色数据（从后端获取后补充）
interface DisplayCharacter {
  id: string;
  name: string;
  title: string;
  avatar: string;
  coverImage: string;
  gradient: string;
  description: string;
  promptKey: string;
  welcomeMessage: string;
}

interface Message {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
}

export default function ChatPage() {
  const [characters, setCharacters] = useState<DisplayCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<DisplayCharacter | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  // 加载角色列表
  useEffect(() => {
    fetch('/api/characters')
      .then((r) => r.json())
      .then((json) => {
        if (json.code === 0 && json.data?.items) {
          const mapped: DisplayCharacter[] = json.data.items.map((c: ApiCharacter) => {
            const visual = promptKeyVisual(c.promptKey);
            return {
              id: c.id,
              name: c.name,
              title: c.title,
              // DB 里的 avatar 优先，没填就用生成头像兜底
              avatar: c.avatar && c.avatar.trim() ? c.avatar : visual.avatar,
              coverImage: visual.coverImage,
              gradient: visual.gradient,
              description: c.personality.slice(0, 100) + '...',
              promptKey: c.promptKey,
              welcomeMessage: `你好，我是${c.name}。有什么想聊的吗？`,
            };
          });
          setCharacters(mapped);
        }
      })
      .catch(() => setCharacters([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectCharacter = (character: DisplayCharacter) => {
    setSelectedCharacter(character);
    setMessages([
      {
        id: 'welcome',
        content: character.welcomeMessage,
        isOwn: false,
        timestamp: '刚刚',
      },
    ]);
  };

  const handleBack = () => {
    setSelectedCharacter(null);
    setMessages([]);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedCharacter || !message.trim() || sending) return;

    // 添加用户消息
    const userMsg: Message = {
      id: Date.now().toString(),
      content: message,
      isOwn: true,
      timestamp: '刚刚',
    };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      // 构建 history
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.isOwn ? ('user' as const) : ('assistant' as const),
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: null,
          roleId: selectedCharacter.promptKey,
          message,
          history,
        }),
      });
      const json = await res.json();

      if (json.code === 0 && json.data) {
        const replyMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: json.data.reply,
          isOwn: false,
          timestamp: '刚刚',
        };
        setMessages((prev) => [...prev, replyMsg]);

        // 如果触发危机，附加提示
        if (json.data.isCrisis) {
          const crisisMsg: Message = {
            id: (Date.now() + 2).toString(),
            content: `⚠️ 温馨提示：全国心理援助热线 400-161-9995。你并不孤单。`,
            isOwn: false,
            timestamp: '刚刚',
          };
          setMessages((prev) => [...prev, crisisMsg]);
        }
      } else {
        throw new Error(json.message || '回复失败');
      }
    } catch (e: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: '网络好像不太稳定，请检查网络后重试~',
        isOwn: false,
        timestamp: '刚刚',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-12rem)]">
        {selectedCharacter ? (
          <>
            <CharacterHeader
              name={selectedCharacter.name}
              title={selectedCharacter.title}
              avatar={selectedCharacter.avatar}
              onBack={handleBack}
            />
            <ChatWindow
              character={selectedCharacter as any}
              welcomeMessage={selectedCharacter.welcomeMessage}
              messages={messages}
              onSend={handleSendMessage}
              onBack={handleBack}
            />
          </>
        ) : (
          <CharacterGrid
            characters={characters as any}
            onSelect={(c: any) => {
              const char = characters.find((ch) => ch.id === c.id);
              if (char) handleSelectCharacter(char);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
