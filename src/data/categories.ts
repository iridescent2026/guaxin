import type { CategoryConfig, SubCategory } from '@/types';

export const CATEGORIES: CategoryConfig[] = [
  {
    value: 'study',
    label: '学业成长',
    emoji: '📚',
    guide: '学习上的事，再小也值得被看见',
    subCategories: [
      {
        value: 'exam_stress',
        label: '考试压力大',
        prompt: '有时候不是准备不够，而是太想做好了。我们先看看。',
      },
      {
        value: 'major_confused',
        label: '专业迷茫想转',
        prompt: '选了一条路，不代表不能换一条。先想清楚自己真正喜欢什么。',
      },
      {
        value: 'procrastination',
        label: '拖延学不进去',
        prompt: '有时候不是懒，而是不知道该从哪里开始。没关系，我们先看看。',
      },
      {
        value: 'no_motivation',
        label: '失去学习动力',
        prompt: '不想学的时候，可以先不学——先照顾好自己。',
      },
    ],
  },
  {
    value: 'relationship',
    label: '人际关系',
    emoji: '💬',
    guide: '人和人之间，有时候就是需要一点距离',
    subCategories: [
      {
        value: 'dormitory',
        label: '宿舍相处矛盾',
        prompt: '朝夕相处，难免有摩擦。你的感受是真实的。',
      },
      {
        value: 'friend_conflict',
        label: '朋友之间闹别扭',
        prompt: '在乎的人，才会计较。给彼此一点空间。',
      },
      {
        value: 'isolation',
        label: '融不进圈子',
        prompt: '圈子不是硬融的，合适的人会自然走近。',
      },
      {
        value: 'family_communication',
        label: '和父母沟通不顺',
        prompt: '最亲近的人，有时候最难开口。慢慢来。',
      },
    ],
  },
  {
    value: 'love',
    label: '情感关系',
    emoji: '💕',
    guide: '心里有话，不一定知道怎么说出口',
    subCategories: [
      {
        value: 'crush',
        label: '喜欢但不敢表达',
        prompt: '喜欢本身就是一种勇气，说不说是另一回事。',
      },
      {
        value: 'couple_conflict',
        label: '和恋人最近有矛盾',
        prompt: '两个人要走得远，不是不吵架，而是吵完还愿意一起走。',
      },
      {
        value: 'breakup',
        label: '分手后走不出来',
        prompt: '放下一个人需要时间，不需要责怪自己放不下。',
      },
      {
        value: 'lonely',
        label: '单身但感到孤独',
        prompt: '一个人也可以过得很好——先从喜欢自己开始。',
      },
    ],
  },
  {
    value: 'future',
    label: '未来方向',
    emoji: '🔮',
    guide: '看不见的路，往往才是该走的路',
    subCategories: [
      {
        value: 'career_anxiety',
        label: '不知道毕业做什么',
        prompt: '不是每个人一开始就知道答案，边走边看也是一种活法。',
      },
      {
        value: 'exam_choice',
        label: '考研考公工作怎么选',
        prompt: '每条路都有代价，关键是选一条自己不后悔的。',
      },
      {
        value: 'change_anxiety',
        label: '想改变但不知从哪开始',
        prompt: '改变不需要一步到位，一小步也是向前。',
      },
      {
        value: 'future_anxiety',
        label: '对未来感到焦虑',
        prompt: '没有人能预知未来，但你可以决定现在怎么过。',
      },
    ],
  },
  {
    value: 'emotion',
    label: '情绪困扰',
    emoji: '💝',
    guide: '情绪不是敌人，它是你在乎的信号',
    subCategories: [
      {
        value: 'low_mood',
        label: '莫名低落什么都不想做',
        prompt: '累了就休息，不需要理由。',
      },
      {
        value: 'anxiety_sleep',
        label: '焦虑到睡不好',
        prompt: '把脑子里的声音写下来，它会安静一些。',
      },
      {
        value: 'loss_interest',
        label: '对什么都提不起兴趣',
        prompt: '有时候不是没热情，只是电量耗尽了。',
      },
      {
        value: 'self_doubt',
        label: '总是自我怀疑',
        prompt: '你已经做得很好了，只是对自己太苛刻。',
      },
    ],
  },
  {
    value: 'growth',
    label: '个人成长',
    emoji: '🌱',
    guide: '变成更好的自己，不用一天完成',
    subCategories: [
      {
        value: 'habit_struggle',
        label: '习惯坚持不下来',
        prompt: '坚持不是每天做到，而是倒下了还能再站起来。',
      },
      {
        value: 'lack_confidence',
        label: '缺乏自信怕表达',
        prompt: '你的声音值得被听见，先从小声说开始。',
      },
      {
        value: 'people_pleasing',
        label: '太在意别人的看法',
        prompt: '你不需要让每个人都满意——包括你自己，偶尔不满意也没关系。',
      },
      {
        value: 'find_passion',
        label: '想找到自己的热爱',
        prompt: '热爱不是找出来的，是做出来的。多试试。',
      },
    ],
  },
  {
    value: 'daily',
    label: '日常生活',
    emoji: '⏰',
    guide: '照顾好自己，就是最重要的事',
    subCategories: [
      {
        value: 'time_management',
        label: '时间总是不够用',
        prompt: '时间不会变多，但你可以选择把精力花在最重要的事上。',
      },
      {
        value: 'sleep_disorder',
        label: '作息混乱熬夜严重',
        prompt: '熬夜不是自律问题，有时候是白天没有属于自己的时间。',
      },
      {
        value: 'financial_stress',
        label: '经济上有压力',
        prompt: '钱的问题很现实，但你不是一个人在面对。',
      },
      {
        value: 'health_concern',
        label: '健康方面的困扰',
        prompt: '身体是革命的本钱——这句话老套但真实。',
      },
    ],
  },
];

export function getCategory(value: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.value === value);
}

export function getSubCategory(categoryValue: string, subValue: string): SubCategory | undefined {
  const cat = getCategory(categoryValue);
  return cat?.subCategories.find((s) => s.value === subValue);
}
