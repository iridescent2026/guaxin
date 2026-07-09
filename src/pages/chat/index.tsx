import { useState, useEffect } from 'react';
import { MainLayout } from '@/components';
import { CharacterGrid, CharacterHeader, ChatWindow } from '@/components/chat';
import type { Character as ApiCharacter } from '@/types';

/** 图片生成域名（与 next.config.js images.remotePatterns 保持一致） */
const IMG_API = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';

function imgUrl(prompt: string, size: 'square' | 'landscape_16_9' = 'square'): string {
  return `${IMG_API}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;
}

/** 按 promptKey 的人设生成：头像(square) + 卡片背景(landscape_16_9) + 渐变色 */
function promptKeyVisual(promptKey: string): {
  avatar: string;
  coverImage: string;
  gradient: string;
} {
  if (promptKey === 'furude') {
    // 古见：温柔倾听者，粉樱花
    return {
      avatar: imgUrl(
        '二次元美少女头像，黑长直齐耳黑发，温柔安静的表情，粉色樱花背景，细腻日系插画风格，正面胸像，柔和打光，高质量',
        'square',
      ),
      coverImage: imgUrl(
        '日系二次元场景插画，校园天台粉樱花漫天飘舞，一位黑长发少女的背影，温柔阳光透过花瓣，治愈温暖的粉色调，横屏 16:9，高质量 cinematic',
        'landscape_16_9',
      ),
      gradient: 'bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500',
    };
  }
  if (promptKey === 'gojo') {
    // 五条：最强导师，蓝紫霓虹
    return {
      avatar: imgUrl(
        '二次元少年头像，银白色短发，黑色眼罩遮住双眼，自信淡然的微笑，蓝紫色魔法光晕背景，精致插画风格，正面胸像，高质量',
        'square',
      ),
      coverImage: imgUrl(
        '二次元场景插画，现代都市夜晚天际线，蓝紫色霓虹光辉流动，一位银发黑衣少年背影站在高楼眺望，酷炫魔法氛围，横屏 16:9，cinematic 高质量',
        'landscape_16_9',
      ),
      gradient: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600',
    };
  }
  // 射干：原创温柔系巫女，紫霞神社
  return {
    avatar: imgUrl(
      '二次元少女头像，银白色长发编成低马尾，琥珀色眼眸，红白巫女服与紫藤色发带，温柔治愈的微笑，紫藤花与夕阳光辉背景，精致插画风格，正面胸像，高质量',
      'square',
    ),
    coverImage: imgUrl(
      '二次元场景插画，日式神社朱红鸟居，黄昏紫色晚霞与紫藤花飘落，银白色长发巫女的背影静静站在石阶上，神圣治愈氛围，紫色调，横屏 16:9，cinematic 高质量',
      'landscape_16_9',
    ),
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
