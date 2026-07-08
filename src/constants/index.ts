import type { Mood, VideoCategory } from '@/types';

// ==================== 情绪配置 ====================
export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'sad', label: '低落', emoji: '😢' },
  { value: 'confused', label: '迷茫', emoji: '😶' },
  { value: 'stressed', label: '压力大', emoji: '😫' },
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'tired', label: '疲惫', emoji: '😪' },
];

// ==================== 视频分类配置 ====================
export const VIDEO_CATEGORIES: { value: VideoCategory; label: string; emoji: string }[] = [
  { value: 'stress_relief', label: '解压', emoji: '🎮' },
  { value: 'animal', label: '萌宠', emoji: '🐾' },
  { value: 'campus', label: '校园', emoji: '🎓' },
  { value: 'funny', label: '沙雕', emoji: '😂' },
  { value: 'healing', label: '治愈', emoji: '🌸' },
  { value: 'random', label: '随机', emoji: '🎲' },
];

// ==================== 平台配置 ====================
export const PLATFORMS: { value: string; label: string }[] = [
  { value: 'bilibili', label: '哔哩哔哩' },
  { value: 'douyin', label: '抖音' },
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'other', label: '其他' },
];

// ==================== API 错误信息 ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络错误，请检查网络连接',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  AI_UNAVAILABLE: 'AI 服务暂时不可用，请稍后重试',
  REQUEST_TOO_FREQUENT: '请求过于频繁，请稍后重试',
  UNAUTHORIZED: '未授权，请重新登录',
  NOT_FOUND: '资源不存在',
  UNKNOWN: '未知错误，请稍后重试',
};

// ==================== 危机干预资源 ====================
export const CRISIS_RESOURCES = {
  HOTLINE: '400-161-9995',
  CAMPUS_CENTER: '校心理中心',
};

// ==================== 应用信息 ====================
export const APP_NAME = '心易陪伴';
export const APP_TAGLINE = '大学生心理健康陪伴平台';
export const DISCLAIMER = '本平台内容仅供娱乐参考，不构成专业心理建议';
