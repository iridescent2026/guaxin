const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9';
const W = 10, H = 5.625;
const M = 0.5;
const CW = W - M * 2;
const CH = H - M * 2;

const C = {
  primary: '7C3AED',
  secondary: 'EC4899',
  accent: 'F59E0B',
  dark: '4C1D95',
  light: 'FDF4FF',
  white: 'FFFFFF',
  text: '1F2937',
  textLight: '6B7280',
  pinkLight: 'FCE7F3',
  purpleLight: 'EDE9FE',
};

const IMG = {
  home: path.join(__dirname, 'screenshots', 'home.png'),
  gua: path.join(__dirname, 'screenshots', 'gua.png'),
  chat: path.join(__dirname, 'screenshots', 'chat.png'),
  videos: path.join(__dirname, 'screenshots', 'videos.png'),
};

function addGradientBg(slide, c1, c2) {
  slide.background = { color: c1 };
}

function hexToRgb(hex) {
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// ============================================================
// Slide 1: 封面
// ============================================================
let s1 = pres.addSlide();
s1.background = { color: C.dark };

// 装饰圆
s1.addShape(pres.shapes.OVAL, {
  x: 7.5, y: -1, w: 4, h: 4,
  fill: { color: C.primary, transparency: 60 }
});
s1.addShape(pres.shapes.OVAL, {
  x: -1.5, y: 3.5, w: 3, h: 3,
  fill: { color: C.secondary, transparency: 70 }
});

s1.addText('心易陪伴', {
  x: M, y: 1.5, w: CW, h: 1,
  fontSize: 48, fontFace: 'Georgia', bold: true, color: C.white,
  align: 'center', charSpacing: 3,
});
s1.addText('探索内心，遇见更好的自己', {
  x: M, y: 2.6, w: CW, h: 0.5,
  fontSize: 22, fontFace: 'Calibri', color: C.white,
  align: 'center',
});
s1.addText('基于周易文化 + AI 心理陪伴的大学生心理健康平台', {
  x: M, y: 3.3, w: CW, h: 0.4,
  fontSize: 14, fontFace: 'Calibri', color: 'D1D5DB',
  align: 'center',
});

// ============================================================
// Slide 2: 目录
// ============================================================
let s2 = pres.addSlide();
s2.background = { color: C.light };

s2.addText('目录', {
  x: M, y: M + 0.2, w: CW, h: 0.8,
  fontSize: 36, fontFace: 'Georgia', bold: true, color: C.dark,
});

const tocItems = [
  { num: '01', title: '项目概述', desc: '为什么需要心易陪伴' },
  { num: '02', title: '周易文化', desc: '三千年智慧的现代价值' },
  { num: '03', title: '核心功能', desc: '摇卦 · 陪伴 · 视频' },
  { num: '04', title: '技术架构', desc: 'Next.js + AI + 云数据库' },
  { num: '05', title: '市场分析', desc: '百亿级心理健康赛道' },
  { num: '06', title: '团队愿景', desc: '让心理健康触手可及' },
];

let tocY = M + 1.2;
let tocCol1X = M;
let tocCol2X = M + CW / 2 + 0.2;

tocItems.forEach((item, i) => {
  let x = i % 2 === 0 ? tocCol1X : tocCol2X;
  let y = tocY + Math.floor(i / 2) * 1.3;

  s2.addShape(pres.shapes.OVAL, {
    x: x, y: y, w: 0.45, h: 0.45,
    fill: { color: C.primary },
  });
  s2.addText(item.num, {
    x: x, y: y, w: 0.45, h: 0.45,
    fontSize: 12, bold: true, color: C.white, align: 'center', valign: 'middle',
  });
  s2.addText(item.title, {
    x: x + 0.6, y: y, w: 3, h: 0.3,
    fontSize: 18, bold: true, color: C.text, fontFace: 'Georgia',
  });
  s2.addText(item.desc, {
    x: x + 0.6, y: y + 0.32, w: 3, h: 0.3,
    fontSize: 12, color: C.textLight, fontFace: 'Calibri',
  });
});

// ============================================================
// Slide 3: 项目概述
// ============================================================
let s3 = pres.addSlide();
s3.background = { color: C.white };

// 左侧深紫背景
s3.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 4.2, h: H,
  fill: { color: C.dark },
});
s3.addText('项目概述', {
  x: M, y: M + 0.3, w: 3.2, h: 0.6,
  fontSize: 32, fontFace: 'Georgia', bold: true, color: C.white,
});
s3.addText('Why do we need\n心易陪伴?', {
  x: M, y: M + 1.2, w: 3.2, h: 1.2,
  fontSize: 22, fontFace: 'Calibri', color: 'E9D5FF',
});

// 痛点数据
const painPoints = [
  { num: '25%', label: '大学生存在不同程度心理问题' },
  { num: '80%', label: '从未寻求过专业心理咨询' },
  { num: '3000万+', label: '中国在校大学生总数' },
];

painPoints.forEach((p, i) => {
  let y = M + 2.8 + i * 0.85;
  s3.addText(p.num, {
    x: M, y: y, w: 1.2, h: 0.4,
    fontSize: 24, bold: true, color: C.secondary, fontFace: 'Georgia',
  });
  s3.addText(p.label, {
    x: M + 1.3, y: y + 0.08, w: 2.5, h: 0.4,
    fontSize: 13, color: 'E9D5FF', fontFace: 'Calibri',
  });
});

// 右侧解决方案
s3.addText('我们的解决方案', {
  x: 4.6, y: M + 0.3, w: 5, h: 0.6,
  fontSize: 28, fontFace: 'Georgia', bold: true, color: C.dark,
});

const solutions = [
  '将三千年周易文化与现代AI技术结合',
  '用年轻人喜爱的动漫角色降低心理门槛',
  '趣味化、游戏化的心理疏导体验',
  '零成本、随时可用的心理健康工具',
];

solutions.forEach((text, i) => {
  let y = M + 1.2 + i * 0.7;
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 4.6, y: y, w: 0.08, h: 0.35,
    fill: { color: C.primary },
  });
  s3.addText(text, {
    x: 4.8, y: y, w: 4.5, h: 0.5,
    fontSize: 15, color: C.text, fontFace: 'Calibri',
    valign: 'top',
  });
});

// 网站截图
s3.addImage({
  path: IMG.home,
  x: 4.6, y: 3.8, w: 4.5, h: 1.5,
});

// ============================================================
// Slide 4: 周易文化介绍
// ============================================================
let s4 = pres.addSlide();
s4.background = { color: C.light };

s4.addText('周易文化 — 三千年智慧的现代价值', {
  x: M, y: M, w: CW, h: 0.7,
  fontSize: 30, fontFace: 'Georgia', bold: true, color: C.dark,
});

// 三列卡片
const cultureCards = [
  {
    title: '起源',
    content: '《周易》成书于西周，是中国最古老的哲学典籍，历经伏羲画卦、文王演易、孔子作传，凝结了三千年文明智慧。',
    color: C.primary,
  },
  {
    title: '哲学',
    content: '阴阳变化、天人合一、变通趋时 —— 周易揭示了宇宙万物的变化规律，强调在变化中寻求平衡与和谐。',
    color: C.secondary,
  },
  {
    title: '现代价值',
    content: '当代心理学研究发现，象征性思维和叙事疗法与周易"象思维"高度契合，卦象成为整理思绪的有效工具。',
    color: C.accent,
  },
];

let cardW = (CW - 0.6) / 3;
cultureCards.forEach((card, i) => {
  let x = M + i * (cardW + 0.3);
  let y = M + 1;

  s4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: cardW, h: 3.2,
    fill: { color: C.white },
    line: { color: 'E5E7EB', width: 1 },
    rectRadius: 0.1,
  });

  s4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: cardW, h: 0.08,
    fill: { color: card.color },
  });

  s4.addText(card.title, {
    x: x + 0.2, y: y + 0.25, w: cardW - 0.4, h: 0.4,
    fontSize: 20, bold: true, color: card.color, fontFace: 'Georgia',
  });
  s4.addText(card.content, {
    x: x + 0.2, y: y + 0.75, w: cardW - 0.4, h: 2.2,
    fontSize: 13, color: C.text, fontFace: 'Calibri',
    valign: 'top',
  });
});

// 底部引用
s4.addShape(pres.shapes.RECTANGLE, {
  x: M, y: 4.6, w: CW, h: 0.7,
  fill: { color: C.purpleLight },
  rectRadius: 0.1,
});
s4.addText('"《易》与天地准，故能弥纶天地之道。" —— 《系辞上传》', {
  x: M + 0.3, y: 4.7, w: CW - 0.6, h: 0.5,
  fontSize: 14, color: C.dark, fontFace: 'Georgia', italic: true,
  align: 'center', valign: 'middle',
});

// ============================================================
// Slide 5: 核心功能 — 周易摇卦
// ============================================================
let s5 = pres.addSlide();
s5.background = { color: C.white };

s5.addText('核心功能 01 — 周易摇卦', {
  x: M, y: M, w: CW, h: 0.7,
  fontSize: 30, fontFace: 'Georgia', bold: true, color: C.dark,
});

// 左侧截图
s5.addImage({
  path: IMG.gua,
  x: M, y: M + 0.9, w: 4.5, h: 3.8,
});

// 右侧功能说明
s5.addText('输入问题 → 摇卦生成 → AI 解卦', {
  x: 5.3, y: M + 0.9, w: 4.2, h: 0.5,
  fontSize: 20, bold: true, color: C.primary, fontFace: 'Georgia',
});

const guaFeatures = [
  '三枚硬币模拟传统摇卦方式',
  '自动生成六爻卦象与变爻分析',
  'AI 结合情绪状态给出个性化解读',
  '专业卦辞引用 + 趣味网络梗解读',
  '心理建议 + 具体行动指南',
];

guaFeatures.forEach((text, i) => {
  let y = M + 1.6 + i * 0.55;
  s5.addShape(pres.shapes.OVAL, {
    x: 5.3, y: y + 0.05, w: 0.2, h: 0.2,
    fill: { color: C.primary },
  });
  s5.addText(text, {
    x: 5.6, y: y, w: 4, h: 0.4,
    fontSize: 14, color: C.text, fontFace: 'Calibri',
  });
});

// ============================================================
// Slide 6: 核心功能 — AI心理陪伴
// ============================================================
let s6 = pres.addSlide();
s6.background = { color: C.light };

s6.addText('核心功能 02 — AI 心理陪伴', {
  x: M, y: M, w: CW, h: 0.7,
  fontSize: 30, fontFace: 'Georgia', bold: true, color: C.dark,
});

// 左侧说明
s6.addText('三个动漫角色，三种守护方式', {
  x: M, y: M + 0.9, w: 4, h: 0.5,
  fontSize: 20, bold: true, color: C.secondary, fontFace: 'Georgia',
});

const roleDesc = [
  { name: '古见', title: '温柔倾听者', style: '温柔细腻，善于共情，推荐治愈系内容' },
  { name: '五条', title: '最强导师', style: '自信直接，给有效建议，适度毒舌让人振作' },
  { name: '射干', title: '巫女守护者', style: '神秘温暖，用自然意象引导内心平静' },
];

roleDesc.forEach((role, i) => {
  let y = M + 1.5 + i * 0.8;
  s6.addShape(pres.shapes.RECTANGLE, {
    x: M, y: y, w: 0.08, h: 0.55,
    fill: { color: i === 0 ? C.secondary : i === 1 ? C.primary : C.accent },
  });
  s6.addText(`${role.name} · ${role.title}`, {
    x: M + 0.2, y: y, w: 3.5, h: 0.3,
    fontSize: 15, bold: true, color: C.text, fontFace: 'Calibri',
  });
  s6.addText(role.style, {
    x: M + 0.2, y: y + 0.28, w: 3.5, h: 0.3,
    fontSize: 12, color: C.textLight, fontFace: 'Calibri',
  });
});

s6.addText('危机识别：AI 实时监测对话情绪，\n一旦发现危机信号立即给出求助渠道。', {
  x: M, y: 4.3, w: 4, h: 0.8,
  fontSize: 12, color: C.textLight, fontFace: 'Calibri',
  valign: 'top',
});

// 右侧截图
s6.addImage({
  path: IMG.chat,
  x: 4.5, y: M + 0.9, w: 5, h: 3.8,
});

// ============================================================
// Slide 7: 核心功能 — 治愈视频
// ============================================================
let s7 = pres.addSlide();
s7.background = { color: C.white };

s7.addText('核心功能 03 — 开心视频', {
  x: M, y: M, w: CW, h: 0.7,
  fontSize: 30, fontFace: 'Georgia', bold: true, color: C.dark,
});

// 截图
s7.addImage({
  path: IMG.videos,
  x: M, y: M + 0.9, w: 5, h: 3.8,
});

// 右侧说明
s7.addText('精选 B 站搞笑视频，一键驱散阴霾', {
  x: 5.8, y: M + 0.9, w: 4, h: 0.5,
  fontSize: 20, bold: true, color: C.accent, fontFace: 'Georgia',
});

const videoCats = [
  { label: '解压', desc: '冥想、白噪音、放松' },
  { label: '萌宠', desc: '猫咪、狗狗搞笑瞬间' },
  { label: '校园', desc: '大学生日常、宿舍趣事' },
  { label: '沙雕', desc: '网友神评论、段子合集' },
  { label: '治愈', desc: '风景、美食、温暖故事' },
];

videoCats.forEach((cat, i) => {
  let y = M + 1.5 + i * 0.55;
  s7.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: y, w: 0.7, h: 0.35,
    fill: { color: C.accent },
    rectRadius: 0.08,
  });
  s7.addText(cat.label, {
    x: 5.8, y: y, w: 0.7, h: 0.35,
    fontSize: 12, bold: true, color: C.white, align: 'center', valign: 'middle',
  });
  s7.addText(cat.desc, {
    x: 6.6, y: y + 0.05, w: 3, h: 0.3,
    fontSize: 13, color: C.text, fontFace: 'Calibri',
  });
});

s7.addText('"随机开心一下" 按钮：\n每次点击都是一次意外惊喜', {
  x: 5.8, y: 4.5, w: 4, h: 0.6,
  fontSize: 12, color: C.textLight, fontFace: 'Calibri', italic: true,
});

// ============================================================
// Slide 8: 技术架构
// ============================================================
let s8 = pres.addSlide();
s8.background = { color: C.light };

s8.addText('技术架构', {
  x: M, y: M, w: CW, h: 0.7,
  fontSize: 30, fontFace: 'Georgia', bold: true, color: C.dark,
});

// 架构图用原生形状
const boxH = 0.7, boxW = 2.2;
const layers = [
  { label: '前端层', items: 'Next.js 14 + React + TypeScript\nTailwind CSS + 响应式设计', color: C.primary, y: M + 1 },
  { label: 'API 层', items: 'Next.js API Routes\nRESTful 接口设计', color: C.secondary, y: M + 2 },
  { label: 'AI 层', items: 'DeepSeek AI (deepseek-chat)\n角色扮演 + 解卦提示词工程', color: C.accent, y: M + 3 },
  { label: '数据层', items: 'Prisma ORM + PostgreSQL\nVercel Postgres 托管', color: C.dark, y: M + 4 },
];

layers.forEach((layer, i) => {
  let x = M + 1;
  // 标签
  s8.addShape(pres.shapes.RECTANGLE, {
    x: x, y: layer.y, w: boxW, h: boxH,
    fill: { color: layer.color },
    rectRadius: 0.08,
  });
  s8.addText(layer.label, {
    x: x, y: layer.y, w: boxW, h: boxH,
    fontSize: 14, bold: true, color: C.white, align: 'center', valign: 'middle',
  });

  // 详情
  s8.addText(layer.items, {
    x: x + boxW + 0.4, y: layer.y, w: 5, h: boxH,
    fontSize: 13, color: C.text, fontFace: 'Calibri', valign: 'middle',
  });

  // 箭头（除了最后一层）
  if (i < layers.length - 1) {
    s8.addShape(pres.shapes.RECTANGLE, {
      x: x + boxW / 2 - 0.02, y: layer.y + boxH,
      w: 0.04, h: 0.35,
      fill: { color: '9CA3AF' },
    });
  }
});

// 右侧特性标签
const techTags = ['全栈 TypeScript', 'Serverless 部署', 'AI 驱动', '云原生'];
techTags.forEach((tag, i) => {
  s8.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: M + 1 + i * 0.6, w: 1.8, h: 0.4,
    fill: { color: C.white },
    line: { color: C.primary, width: 1 },
    rectRadius: 0.1,
  });
  s8.addText(tag, {
    x: 7.5, y: M + 1 + i * 0.6, w: 1.8, h: 0.4,
    fontSize: 12, color: C.primary, align: 'center', valign: 'middle',
  });
});

// ============================================================
// Slide 9: 市场需求分析
// ============================================================
let s9 = pres.addSlide();
s9.background = { color: C.white };

s9.addText('市场需求分析', {
  x: M, y: M, w: CW, h: 0.7,
  fontSize: 30, fontFace: 'Georgia', bold: true, color: C.dark,
});

// 三个大数字
const marketStats = [
  { num: '3000万+', label: '中国在校大学生', sub: '核心目标用户群体' },
  { num: '25%', label: '存在心理问题比例', sub: '约750万潜在用户' },
  { num: '100亿+', label: '心理健康市场规模', sub: '年增长率超过15%' },
];

let statW = (CW - 0.6) / 3;
marketStats.forEach((stat, i) => {
  let x = M + i * (statW + 0.3);
  let y = M + 1;

  s9.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: statW, h: 2.2,
    fill: { color: C.white },
    line: { color: 'E5E7EB', width: 1 },
    rectRadius: 0.1,
  });

  s9.addText(stat.num, {
    x: x, y: y + 0.3, w: statW, h: 0.7,
    fontSize: 36, bold: true, color: i === 0 ? C.primary : i === 1 ? C.secondary : C.accent,
    align: 'center', fontFace: 'Georgia',
  });
  s9.addText(stat.label, {
    x: x, y: y + 1.1, w: statW, h: 0.35,
    fontSize: 14, bold: true, color: C.text, align: 'center',
  });
  s9.addText(stat.sub, {
    x: x, y: y + 1.5, w: statW, h: 0.3,
    fontSize: 11, color: C.textLight, align: 'center',
  });
});

// 竞争优势
s9.addText('核心竞争优势', {
  x: M, y: 3.8, w: CW, h: 0.4,
  fontSize: 20, bold: true, color: C.dark, fontFace: 'Georgia',
});

const advantages = [
  '文化差异化：唯一融合周易文化的心理健康产品',
  '角色IP化：动漫角色降低心理服务使用门槛',
  '趣味化设计：摇卦+解卦+聊天，游戏化体验',
  '零门槛接入：无需注册，打开即用',
];

advantages.forEach((text, i) => {
  let y = 4.2 + i * 0.35;
  s9.addShape(pres.shapes.OVAL, {
    x: M, y: y + 0.05, w: 0.18, h: 0.18,
    fill: { color: C.primary },
  });
  s9.addText(text, {
    x: M + 0.3, y: y, w: CW - 0.5, h: 0.3,
    fontSize: 13, color: C.text, fontFace: 'Calibri',
  });
});

// ============================================================
// Slide 10: 团队与愿景
// ============================================================
let s10 = pres.addSlide();
s10.background = { color: C.light };

s10.addText('团队与愿景', {
  x: M, y: M, w: CW, h: 0.7,
  fontSize: 30, fontFace: 'Georgia', bold: true, color: C.dark,
});

// 愿景大字
s10.addShape(pres.shapes.RECTANGLE, {
  x: M, y: M + 1, w: CW, h: 1.2,
  fill: { color: C.dark },
  rectRadius: 0.1,
});
s10.addText('让每一个年轻人都能找到心灵的出口', {
  x: M, y: M + 1.15, w: CW, h: 0.9,
  fontSize: 26, bold: true, color: C.white, align: 'center', valign: 'middle',
  fontFace: 'Georgia',
});

// 三个价值标签
const values = [
  { title: '文化创新', desc: '让传统文化焕发新生', color: C.primary },
  { title: '技术赋能', desc: 'AI 让心理健康触手可及', color: C.secondary },
  { title: '心理关怀', desc: '守护每一位年轻人的内心', color: C.accent },
];

let valW = (CW - 0.6) / 3;
values.forEach((val, i) => {
  let x = M + i * (valW + 0.3);
  let y = M + 2.5;

  s10.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: valW, h: 1.5,
    fill: { color: C.white },
    line: { color: val.color, width: 2 },
    rectRadius: 0.1,
  });
  s10.addText(val.title, {
    x: x, y: y + 0.25, w: valW, h: 0.4,
    fontSize: 18, bold: true, color: val.color, align: 'center',
  });
  s10.addText(val.desc, {
    x: x, y: y + 0.75, w: valW, h: 0.5,
    fontSize: 13, color: C.textLight, align: 'center',
  });
});

s10.addText('未来规划：移动端适配 · 社区互动 · 更多角色 · 专业心理咨询对接', {
  x: M, y: 4.4, w: CW, h: 0.4,
  fontSize: 12, color: C.textLight, align: 'center',
});

// ============================================================
// Slide 11: 结束页
// ============================================================
let s11 = pres.addSlide();
s11.background = { color: C.dark };

s11.addShape(pres.shapes.OVAL, {
  x: 7.5, y: -1, w: 4, h: 4,
  fill: { color: C.primary, transparency: 60 },
});
s11.addShape(pres.shapes.OVAL, {
  x: -1.5, y: 3.5, w: 3, h: 3,
  fill: { color: C.secondary, transparency: 70 },
});

s11.addText('感谢聆听', {
  x: M, y: 1.6, w: CW, h: 1,
  fontSize: 44, fontFace: 'Georgia', bold: true, color: C.white,
  align: 'center', charSpacing: 3,
});
s11.addText('心易陪伴 — 探索内心，遇见更好的自己', {
  x: M, y: 2.7, w: CW, h: 0.5,
  fontSize: 18, fontFace: 'Calibri', color: 'E9D5FF',
  align: 'center',
});
s11.addText('https://guaxin-16wlv5e8h-iridescent1.vercel.app', {
  x: M, y: 3.3, w: CW, h: 0.4,
  fontSize: 13, fontFace: 'Calibri', color: 'A78BFA',
  align: 'center',
});

// 保存
const outputPath = path.join(__dirname, '..', '..', '心易陪伴-路演-v2.pptx');
pres.writeFile({ fileName: outputPath })
  .then(() => console.log('PPT saved to:', outputPath))
  .catch((err) => console.error('Error:', err));
