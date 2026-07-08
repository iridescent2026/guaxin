import { CrisisResources } from '@/types';

// ==================== 危机关键词库 ====================
const CRISIS_KEYWORDS = [
  // 自伤/自杀
  '自杀', '想死', '不想活', '死了算了', '结束生命', '了结', '跳楼', '割腕',
  '自残', '伤害自己', '想消失', '活不下去', '没有意义', '绝望', '没救了',
  // 严重抑郁
  '重度抑郁', '抑郁症', '想死', '活着没意思', '一切都是空的',
  // 危机表达
  '我想离开', '不要救我', '告别', '遗言', '处理后事',
];

// 轻度表达，不触发危机但增加关注
const WARNING_KEYWORDS = [
  '很焦虑', '睡不着', '很难受', '压力大', '崩溃了', '受不了', '好痛苦',
];

/**
 * 检测文本是否包含危机信号
 * @returns 危机等级：'crisis' | 'warning' | 'safe'
 */
export function detectCrisis(text: string): {
  level: 'crisis' | 'warning' | 'safe';
  matchedKeywords: string[];
} {
  const lowerText = text.toLowerCase();
  const matchedKeywords: string[] = [];

  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      matchedKeywords.push(keyword);
    }
  }

  if (matchedKeywords.length > 0) {
    return { level: 'crisis', matchedKeywords };
  }

  for (const keyword of WARNING_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      matchedKeywords.push(keyword);
    }
  }

  if (matchedKeywords.length > 0) {
    return { level: 'warning', matchedKeywords };
  }

  return { level: 'safe', matchedKeywords: [] };
}

/**
 * 获取危机求助资源
 */
export function getCrisisResources(): CrisisResources {
  return {
    hotline: '400-161-9995',
    campusCenter: '校心理中心（请替换为实际电话）',
    tip: '你并不孤单，有人愿意倾听和帮助你。你的感受是真实的，也值得被认真对待。',
  };
}

/**
 * 内容安全检查（防提示词注入等）
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f]/g, '') // 移除控制字符
    .trim();
}

/**
 * 长度校验
 */
export function validateLength(input: string, maxLength: number): boolean {
  return input.length > 0 && input.length <= maxLength;
}
