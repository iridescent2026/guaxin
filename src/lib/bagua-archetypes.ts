export interface BaguaArchetype {
  name: string;
  symbol: string;
  nature: string;
  archetype: string;
  description: string;
  psychologyConcept: string;
  strengths: string[];
  challenges: string[];
  growthDirection: string;
  philosophy: string;
  color: string;
  emoji: string;
}

export const BAGUA_ARCHETYPES: BaguaArchetype[] = [
  {
    name: '乾',
    symbol: '☰',
    nature: '天',
    archetype: '创造者',
    description: '你内心有强烈的成就驱动力，喜欢主动掌控局面，是天生的行动派与领导者。',
    psychologyConcept: '内控型人格 — 相信个人努力能影响结果，心理韧性更强',
    strengths: ['行动力强', '决断力高', '目标清晰', '勇于担当', '自我驱动'],
    challenges: ['控制欲过强', '难以接受失败', '忽视他人感受', '容易倦怠'],
    growthDirection: '学会放手，接纳不确定性，在掌控与顺其自然之间找到平衡',
    philosophy: '「天行健，君子以自强不息」—— 天道刚健运行不息，君子应效法天道，不断自我提升，永不停歇。',
    color: '#7C3AED',
    emoji: '🌟',
  },
  {
    name: '坤',
    symbol: '☷',
    nature: '地',
    archetype: '滋养者',
    description: '你是团队的稳定基石，善于包容和支持他人，你的温柔不是软弱，而是一种深沉的力量。',
    psychologyConcept: '安全型依恋 — 能为他人提供安全的心理空间，建立稳固的情感联结',
    strengths: ['包容性强', '情绪稳定', '善于支持', '耐心持久', '忠诚可靠'],
    challenges: ['自我牺牲过度', '边界模糊', '忽略自身需求', '容易被动'],
    growthDirection: '建立清晰的个人边界，学会在照顾他人的同时关照自己',
    philosophy: '「地势坤，君子以厚德载物」—— 大地承载万物而不言，君子应以深厚的德行包容承载一切。',
    color: '#059669',
    emoji: '🌿',
  },
  {
    name: '震',
    symbol: '☳',
    nature: '雷',
    archetype: '变革者',
    description: '你不满足于现状，总想打破常规，你的冲动背后是对改变的渴望和对可能性的探索。',
    psychologyConcept: '高开放性（大五人格）—— 对新经验有强烈的好奇心和接受度，创造力旺盛',
    strengths: ['敢于创新', '打破常规', '充满勇气', '开拓精神', '适应变化'],
    challenges: ['冲动行事', '半途而废', '缺乏耐心', '忽视细节'],
    growthDirection: '培养坚持与耐心，将变革的冲动转化为持续的行动力',
    philosophy: '「洊雷，震；君子以恐惧修省」—— 雷声接连而至，君子应心存敬畏，时时反省自身，在变革中保持警醒。',
    color: '#DC2626',
    emoji: '⚡',
  },
  {
    name: '巽',
    symbol: '☴',
    nature: '风',
    archetype: '思考者',
    description: '你像风一样灵活善变，能快速适应不同环境，善于从多角度思考问题，是个终身学习者。',
    psychologyConcept: '反思型认知风格 — 善于深度思考和多角度分析，决策更审慎',
    strengths: ['灵活变通', '好奇心强', '适应力强', '善于学习', '思维敏捷'],
    challenges: ['犹豫不决', '想太多而行动少', '缺乏主见', '容易分心'],
    growthDirection: '培养果断行动的能力，在思考与行动之间找到节奏',
    philosophy: '「随风，巽；君子以申命行事」—— 风行天下无孔不入，君子应顺势而行，将思考化为切实的行动。',
    color: '#0891B2',
    emoji: '🍃',
  },
  {
    name: '坎',
    symbol: '☵',
    nature: '水',
    archetype: '感受者',
    description: '你有极强的共情能力和直觉，能感受到别人忽略的情绪细节，但也容易因此感到疲惫。',
    psychologyConcept: '高情绪智力（EQ）—— 能精准感知和调节自己与他人的情绪',
    strengths: ['共情力强', '直觉敏锐', '情感丰富', '善于倾听', '深度理解'],
    challenges: ['情绪过载', '边界感弱', '容易受他人影响', '难以抽离'],
    growthDirection: '学习情绪调节技巧，在共情与自我保护之间建立健康的屏障',
    philosophy: '「水洊至，习坎；君子以常德行」—— 水流不息，即便面对重重险阻也从容前行，君子应在困境中坚守德行与操守。',
    color: '#2563EB',
    emoji: '💧',
  },
  {
    name: '离',
    symbol: '☲',
    nature: '火',
    archetype: '表达者',
    description: '你热情洋溢，善于表达和感染他人，你的存在本身就能照亮周围的人，但也需要注意不要燃尽自己。',
    psychologyConcept: '外向型人格（大五人格）—— 从社交互动中获取能量，表达力和感染力强',
    strengths: ['感染力强', '善于表达', '充满热情', '创造力丰富', '善于激励'],
    challenges: ['注意力分散', '忽视深层思考', '过度消耗自己', '缺乏独处能力'],
    growthDirection: '培养深度思考的习惯，在热情表达与内省沉淀之间找到平衡',
    philosophy: '「明两作，离；大人以继明照于四方」—— 光明相继不绝，大人应持续散发光芒，照亮四方。',
    color: '#F59E0B',
    emoji: '🔥',
  },
  {
    name: '艮',
    symbol: '☶',
    nature: '山',
    archetype: '观察者',
    description: '你稳重内敛，善于独立思考，在喧嚣中你能保持内心的宁静，你的坚持常常被人低估。',
    psychologyConcept: '内省型人格 — 善于深度反思和独立思考，内心世界丰富而深刻',
    strengths: ['稳重踏实', '深思熟虑', '原则坚定', '独立自主', '内心宁静'],
    challenges: ['固步自封', '抗拒变化', '过度封闭', '行动迟缓'],
    growthDirection: '学会拥抱变化，在坚守原则的同时保持开放和灵活',
    philosophy: '「兼山，艮；君子以思不出其位」—— 两山重叠，静止不动，君子应安于本位，不逾越自己的职责范围去思考。',
    color: '#6B7280',
    emoji: '⛰️',
  },
  {
    name: '兑',
    symbol: '☱',
    nature: '泽',
    archetype: '连接者',
    description: '你是天生的社交高手，善于建立和维护人际关系，能让身边的人都感到舒服和被接纳。',
    psychologyConcept: '高社交智力 — 善于读取社交信号，建立和维持深度的人际连接',
    strengths: ['善于沟通', '关系建设', '促进和谐', '富有同理心', '团队协作'],
    challenges: ['讨好型人格', '忽视自身需求', '难以拒绝他人', '过度依赖社交认同'],
    growthDirection: '学会表达真实自我，在维护关系与忠于自己之间找到平衡',
    philosophy: '「丽泽，兑；君子以朋友讲习」—— 两泽相连互相滋润，君子应与朋友切磋交流，教学相长。',
    color: '#EC4899',
    emoji: '💬',
  },
];

export function getRandomArchetypes(count: number = 8): BaguaArchetype[] {
  const shuffled = [...BAGUA_ARCHETYPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}