import type { IChingQuote, Category } from '@/types';

export const ICHING_QUOTES: IChingQuote[] = [
  // ==================== 学业成长 ====================
  {
    id: 'q_study_01',
    guaName: '乾卦·象传',
    original: '天行健，君子以自强不息',
    translation: '天道运行刚健有力，不因任何事停歇。君子从中领悟到：真正的力量不是没有挫折，而是不停下来。',
    insight: '今天的你不必一次做完所有事，只需要比昨天多做一点点。持续的小步前进，比一次冲刺更有力量。',
    categories: ['study', 'growth'],
  },
  {
    id: 'q_study_02',
    guaName: '坤卦·象传',
    original: '地势坤，君子以厚德载物',
    translation: '大地的气势宽厚和顺，承载万物。君子应当效法大地，用深厚的积累来承载自己的目标和理想。',
    insight: '学习不是赶路，是在打地基。现在学的每一点，都在为你未来的高度做准备。',
    categories: ['study', 'growth'],
  },
  {
    id: 'q_study_03',
    guaName: '渐卦·彖传',
    original: '进得位，往有功也',
    translation: '一步一步前进，位置恰当了，往前走就会有成果。',
    insight: '不必急于求成。渐进的力量最稳定——按自己的节奏走，每一步都算数。',
    categories: ['study', 'future'],
  },
  {
    id: 'q_study_04',
    guaName: '蒙卦',
    original: '匪我求童蒙，童蒙求我',
    translation: '不是我去求蒙昧的人学习，而是他发自内心地想要求知。',
    insight: '真正的学习动力来自内心。如果你现在不想学，也许只是还没找到那个让你发自内心想探索的东西。',
    categories: ['study'],
  },

  // ==================== 人际关系 ====================
  {
    id: 'q_rel_01',
    guaName: '同人卦',
    original: '同人于野，亨',
    translation: '在广阔的天地间与人同心同德，一切通达。',
    insight: '真正的连接不需要刻意迎合。在更开阔的地方，自然会遇到志同道合的人。',
    categories: ['relationship'],
  },
  {
    id: 'q_rel_02',
    guaName: '谦卦·象传',
    original: '谦谦君子，卑以自牧',
    translation: '真正有修养的人，用谦逊来管理自己，而不是要求别人。',
    insight: '人际关系中最有力量的姿态不是争对错，而是先做好自己这一部分。',
    categories: ['relationship', 'growth'],
  },
  {
    id: 'q_rel_03',
    guaName: '兑卦·彖传',
    original: '兑，说也。刚中而柔外',
    translation: '兑是表达、是沟通。内心坚定而外表柔和，才能真正让别人听到你的声音。',
    insight: '沟通的秘诀：内心有原则，外在有温度。',
    categories: ['relationship', 'love'],
  },
  {
    id: 'q_rel_04',
    guaName: '睽卦·象传',
    original: '君子以同而异',
    translation: '君子在共同的基础上，尊重彼此的差异。',
    insight: '不必强求一致。好的关系不是两个完全相同的人，而是两个不同的人学会了互相理解。',
    categories: ['relationship', 'love'],
  },

  // ==================== 情感关系 ====================
  {
    id: 'q_love_01',
    guaName: '咸卦·彖传',
    original: '咸，感也。柔上而刚下，二气感应以相与',
    translation: '咸是感应的意思。阴柔在上、阳刚在下，两种气息互相感应而结合。',
    insight: '好的感情是互相感应的，不是单方面的付出或索取。你感受到的，就是真实的。',
    categories: ['love'],
  },
  {
    id: 'q_love_02',
    guaName: '恒卦·彖传',
    original: '恒，久也。刚上而柔下，雷风相与',
    translation: '恒是持久的意思。就像雷与风互相激荡，长久的关系也需要动态的平衡。',
    insight: '长久不是一成不变，而是在变化中始终愿意一起调整方向。',
    categories: ['love', 'relationship'],
  },
  {
    id: 'q_love_03',
    guaName: '损卦·彖传',
    original: '损下益上，其道上行',
    translation: '减损下面的、增益上面的，这个过程的本质是向上走。',
    insight: '有时候放手不是失去，而是在为更好的腾出空间。',
    categories: ['love', 'emotion'],
  },
  {
    id: 'q_love_04',
    guaName: '无妄卦',
    original: '无妄，元亨利贞。其匪正有眚，不利有攸往',
    translation: '不妄为，一切通达顺利。但如果动机不正，就会有灾祸，不利于行动。',
    insight: '在感情里，对得起自己的良心，比结果更重要。真诚本身就是最好的路。',
    categories: ['love', 'emotion'],
  },

  // ==================== 未来方向 ====================
  {
    id: 'q_future_01',
    guaName: '随卦·彖传',
    original: '随时之义大矣哉',
    translation: '顺应时势的义理，真是太重大了。',
    insight: '不是所有时候都需要硬冲。有时候顺应时机，等一等、看一看，也是智慧。',
    categories: ['future'],
  },
  {
    id: 'q_future_02',
    guaName: '革卦·彖传',
    original: '革，去故也。天地革而四时成',
    translation: '革是去掉旧的。天地通过变革才有了四季的更替。',
    insight: '变化是自然的规律。你想要的改变，只是在顺应生命本身的节奏。',
    categories: ['future', 'growth'],
  },
  {
    id: 'q_future_03',
    guaName: '旅卦',
    original: '旅，小亨。旅贞吉',
    translation: '人生如旅，小心谨慎就会顺利。在旅途中坚守正道，结果往往是好的。',
    insight: '未来本身就是一段旅程。不一定要到达终点才叫有意义，路上的风景也值得看。',
    categories: ['future', 'emotion'],
  },
  {
    id: 'q_future_04',
    guaName: '观卦·彖传',
    original: '观天之神道，而四时不忒',
    translation: '观察自然的神妙之道，看到四季运行从不出错。',
    insight: '看不清方向的时候，先观察——观察自己、观察世界。答案往往藏在细节里。',
    categories: ['future', 'study'],
  },

  // ==================== 情绪困扰 ====================
  {
    id: 'q_emo_01',
    guaName: '复卦·彖传',
    original: '复，其见天地之心乎',
    translation: '回复、回归——从复卦中，可以看到天地万物运行的根本规律。',
    insight: '当你觉得迷失的时候，不需要急着找出口。先回到自己这里，回到呼吸、回到当下。',
    categories: ['emotion'],
  },
  {
    id: 'q_emo_02',
    guaName: '解卦·彖传',
    original: '解，险以动。动而免乎险，亨',
    translation: '解是解除困境的意思。在危险中行动，行动起来就能脱离危险，一切通达。',
    insight: '困住你的不是情绪本身，而是"什么都不想做"的停滞。做一件小事——哪怕只是站起来走走。',
    categories: ['emotion', 'daily'],
  },
  {
    id: 'q_emo_03',
    guaName: '小畜卦·彖传',
    original: '小畜，亨。密云不雨',
    translation: '小规模的积蓄，也能通达顺利。就像乌云密布但还没下雨——能量在酝酿中。',
    insight: '现在的低落不是在"浪费"，而是在积蓄。云还没有变成雨，但它已经在路上了。',
    categories: ['emotion'],
  },
  {
    id: 'q_emo_04',
    guaName: '震卦·彖传',
    original: '震来虩虩，笑言哑哑。震惊百里，不丧匕鬯',
    translation: '雷声震来令人恐惧，但过后依然能谈笑自若。即使震动百里之远，手中的祭器也不会掉落。',
    insight: '焦虑就像雷声——来的时候很吓人，但它会过去。你比你想象中更稳，焦虑不会让你失去最重要的东西。',
    categories: ['emotion'],
  },

  // ==================== 个人成长 ====================
  {
    id: 'q_grow_01',
    guaName: '升卦·彖传',
    original: '升，元亨。用见大人',
    translation: '上升、成长，一开始就通达顺利。适合去见贤德的人，向他们学习。',
    insight: '成长不是孤独的旅程。靠近你想成为的人，向他们学习，比一个人硬撑有效得多。',
    categories: ['growth'],
  },
  {
    id: 'q_grow_02',
    guaName: '晋卦·彖传',
    original: '晋，进也。明出地上',
    translation: '晋是前进的意思。就像太阳从地平线升起，光明逐渐照亮大地。',
    insight: '成长也是像日出一样——不是突然大放光芒，而是一点一点亮起来。',
    categories: ['growth', 'study'],
  },
  {
    id: 'q_grow_03',
    guaName: '颐卦·彖传',
    original: '颐，养正也',
    translation: '颐是养育、滋养的意思。养其身、养其德，走正道。',
    insight: '真正的成长不是拼命消耗自己，而是好好养自己。吃好、睡好、心情好，做事自然有劲。',
    categories: ['growth', 'daily', 'emotion'],
  },
  {
    id: 'q_grow_04',
    guaName: '益卦·彖传',
    original: '益，损上益下，民说无疆',
    translation: '益是增益的意思。上面减少、下面增加，人民的喜悦就会无边无际。',
    insight: '有时候成长是做减法——少刷手机、少自我批评、少和人比较。减掉这些，你的空间自然就大了。',
    categories: ['growth', 'daily'],
  },

  // ==================== 日常生活 ====================
  {
    id: 'q_daily_01',
    guaName: '节卦·彖传',
    original: '节，亨。苦节不可贞',
    translation: '节制、有度，可以通达顺利。但过度苛刻的节制，无法持久。',
    insight: '生活需要节奏，但不要太苛责自己。适度放松也是自律的一部分。',
    categories: ['daily'],
  },
  {
    id: 'q_daily_02',
    guaName: '井卦·彖传',
    original: '井，改邑不改井',
    translation: '井的道理是：村庄可以迁移，但井不会改变。它始终在那里，源源不断地提供泉水。',
    insight: '生活再怎么变化，守住你的基本盘——作息、饮食、运动。这些稳定了，其他都会慢慢好起来。',
    categories: ['daily', 'emotion'],
  },
  {
    id: 'q_daily_03',
    guaName: '履卦·彖传',
    original: '履，柔履刚也。履虎尾，不咥人，亨',
    translation: '履是走路、行动的意思。即使踩到老虎尾巴，老虎也不会咬人——行动谨慎，就会平安。',
    insight: '生活中的大多数危险没有想象中那么可怕。小心行事，一步一步走，就不会被"咬到"。',
    categories: ['daily', 'study'],
  },
  {
    id: 'q_daily_04',
    guaName: '泰卦·彖传',
    original: '泰，小往大来，吉亨',
    translation: '泰是通泰、安宁的意思。小的付出换来大的收获，方向对了，每一份努力都不会白费。',
    insight: '生活中那些不起眼的小事——整理书桌、好好吃饭、早睡十分钟——累积起来，就是你的"泰"。',
    categories: ['daily', 'emotion'],
  },
];

export function getQuotesForCategory(category: Category): IChingQuote[] {
  return ICHING_QUOTES.filter((q) => q.categories.includes(category));
}

export function getRandomQuoteForCategory(category: Category): IChingQuote | undefined {
  const quotes = getQuotesForCategory(category);
  if (quotes.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export function getQuoteById(id: string): IChingQuote | undefined {
  return ICHING_QUOTES.find((q) => q.id === id);
}
