// ==================== 基础响应 ====================
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ==================== 用户 ====================
export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
}

// ==================== 卦象 ====================
export type YaoValue = 6 | 7 | 8 | 9;

export interface YaoLine {
  position: number; // 1-6
  value: YaoValue;
}

export type Mood = 'anxious' | 'sad' | 'confused' | 'stressed' | 'calm' | 'happy' | 'tired';

export const MOOD_LABELS: Record<Mood, string> = {
  anxious: '焦虑',
  sad: '低落',
  confused: '迷茫',
  stressed: '压力大',
  calm: '平静',
  happy: '开心',
  tired: '疲惫',
};

export interface Gua {
  id: string;
  userId?: string;
  question: string;
  mood: Mood;
  lines: YaoLine[];
  guaName: string;
  guaCode: string;
  interpretation?: string;
  createdAt: string;
}

export interface GuaInterpretation {
  guaName: string;
  guaMeaning: string;
  interpretation: string;
  psychologyAdvice: string;
  actionAdvice: string;
  changingLines: ChangingLine[];
  overallTone: 'encouraging' | 'cautionary' | 'neutral';
  crisisFlag: boolean;
}

export interface ChangingLine {
  position: number;
  meaning: string;
}

// ==================== 聊天 ====================
export type Sender = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  userId?: string;
  roleId: string;
  content: string;
  sender: Sender;
  isCrisis: boolean;
  createdAt: string;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatReply {
  reply: string;
  isCrisis: boolean;
  crisisResources?: CrisisResources;
  characterName: string;
}

export interface CrisisResources {
  hotline: string;
  campusCenter: string;
  tip: string;
}

// ==================== 角色 ====================
export interface Character {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  personality: string;
  promptKey: string;
  tags: string[];
}

// ==================== 视频 ====================
export type Platform = 'bilibili' | 'douyin' | 'xiaohongshu' | 'youtube' | 'other';

export type VideoCategory = 'stress_relief' | 'animal' | 'campus' | 'funny' | 'healing' | 'random';

export const CATEGORY_LABELS: Record<VideoCategory, string> = {
  stress_relief: '解压',
  animal: '萌宠',
  campus: '校园',
  funny: '沙雕',
  healing: '治愈',
  random: '随机',
};

export interface Video {
  id: string;
  title: string;
  coverUrl: string;
  videoUrl: string;
  platform: Platform;
  category: VideoCategory;
  tags: string[];
  sortOrder: number;
  createdAt: string;
}

// ==================== API 请求体 ====================
export interface GenerateGuaRequest {
  userId?: string;
  question: string;
  mood: Mood;
}

export interface InterpretGuaRequest {
  guaId?: string;
  lines: YaoLine[];
  question: string;
  mood: Mood;
}

export interface ChatRequest {
  userId?: string;
  roleId: string;
  message: string;
  history?: ChatHistoryItem[];
}

export interface CreateUserRequest {
  nickname: string;
  avatar?: string;
}
