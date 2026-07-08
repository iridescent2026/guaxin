import { useState } from 'react';
import { User, Heart, Shield, BookOpen } from 'lucide-react';
import { MainLayout } from '@/components';
import {
  CharacterGrid,
  CharacterCard,
  CharacterHeader,
  ChatWindow,
  type Character,
} from '@/components/chat';

// 静态角色数据
const CHARACTERS: Character[] = [
  {
    id: 'senior',
    name: '学姐',
    title: '温柔陪伴',
    icon: <User className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500',
    description: '一位善解人意的学姐，擅长倾听和安慰。无论你遇到什么烦恼，她都会用温暖的话语陪伴你。',
    accentColor: 'text-white',
  },
  {
    id: 'cat',
    name: '猫娘',
    title: '活泼治愈',
    icon: <Heart className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500',
    description: '一只来自喵星的小可爱，总是能用可爱的话语和表情包治愈你的不开心。',
    accentColor: 'text-white',
  },
  {
    id: 'treehole',
    name: '树洞',
    title: '匿名倾诉',
    icon: <Shield className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500',
    description: '一个安全的匿名空间，在这里你可以完全卸下防备，倾诉所有不敢说的话。',
    accentColor: 'text-white',
  },
  {
    id: 'teacher',
    name: '心理老师',
    title: '理性建议',
    icon: <BookOpen className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600',
    description: '专业的心理健康教育老师，能够用科学的方法帮助你分析问题、理清思路。',
    accentColor: 'text-white',
  },
];

// 静态消息数据
const SAMPLE_MESSAGES = [
  {
    id: '1',
    content: '嗨，你好呀！最近怎么样？有什么想和我聊聊的吗？',
    isOwn: false,
    timestamp: '刚刚',
  },
  {
    id: '2',
    content: '最近感觉压力挺大的...',
    isOwn: true,
    timestamp: '刚刚',
  },
  {
    id: '3',
    content: '没关系，慢慢说。我在听。',
    isOwn: false,
    timestamp: '刚刚',
  },
];

export default function ChatPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleBack = () => {
    setSelectedCharacter(null);
  };

  const handleSendMessage = (message: string) => {
    // TODO: 后续接入 AI
    console.log('发送消息:', message);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-12rem)]">
        {selectedCharacter ? (
          <>
            <CharacterHeader
              name={selectedCharacter.name}
              title={selectedCharacter.title}
              onBack={handleBack}
            />
            <ChatWindow
              character={selectedCharacter}
              messages={SAMPLE_MESSAGES}
              onSend={handleSendMessage}
              onBack={handleBack}
            />
          </>
        ) : (
          <CharacterGrid
            characters={CHARACTERS}
            onSelect={handleSelectCharacter}
          />
        )}
      </div>
    </MainLayout>
  );
}
