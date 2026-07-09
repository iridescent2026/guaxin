const PptxGenJS = require("pptxgenjs");

// ============================================================
// 常量定义
// ============================================================
const SLIDE_W = 10;
const SLIDE_H = 5.625; // 16:9

// ============================================================
// 配色
// ============================================================
const COLORS = {
  Primary: "7C3AED",
  Secondary: "EC4899",
  Accent: "F59E0B",
  Dark: "4C1D95",
  LightBg: "FDF4FF",
  White: "FFFFFF",
  TextDark: "1F2937",
  TextLight: "6B7280",
};

// ============================================================
// 容器系统（Flex-like 布局引擎）
// ============================================================
class Container {
  constructor(opts = {}) {
    this.x = opts.x ?? 0;
    this.y = opts.y ?? 0;
    this.w = opts.w ?? SLIDE_W;
    this.h = opts.h ?? SLIDE_H;
    this.pad = opts.pad ?? 0;
    this.gap = opts.gap ?? 0;
    this.dir = opts.dir ?? "col"; // 'row' | 'col'
    this.align = opts.align ?? "start"; // 'start' | 'center' | 'end' | 'stretch'
    this.justify = opts.justify ?? "start"; // 'start' | 'center' | 'end' | 'between' | 'evenly'
    this.children = [];
  }

  add(child) {
    if (child instanceof Container) {
      this.children.push({ type: "container", container: child });
    } else {
      this.children.push(child);
    }
    return this;
  }

  text(txt, opts = {}) {
    this.children.push({ type: "text", text: txt, opts });
    return this;
  }

  shape(shapeType, opts = {}) {
    this.children.push({ type: "shape", shapeType, opts });
    return this;
  }

  rect(opts = {}) {
    this.children.push({ type: "rect", opts });
    return this;
  }

  line(opts = {}) {
    this.children.push({ type: "line", opts });
    return this;
  }

  _getMainSize(child) {
    if (child.type === "container") {
      return this.dir === "row" ? (child.container.w ?? 0) : (child.container.h ?? 0);
    }
    return this.dir === "row" ? (child.opts.w ?? 0) : (child.opts.h ?? 0);
  }

  _setMainPos(child, pos) {
    if (child.type === "container") {
      if (this.dir === "row") child.container.x = pos;
      else child.container.y = pos;
    } else {
      if (this.dir === "row") child.opts.x = pos;
      else child.opts.y = pos;
    }
  }

  _setCrossPos(child, pos) {
    if (child.type === "container") {
      if (this.dir === "row") child.container.y = pos;
      else child.container.x = pos;
    } else {
      if (this.dir === "row") child.opts.y = pos;
      else child.opts.x = pos;
    }
  }

  _setMainSize(child, size) {
    if (child.type === "container") {
      if (this.dir === "row") child.container.w = size;
      else child.container.h = size;
    } else {
      if (this.dir === "row") child.opts.w = size;
      else child.opts.h = size;
    }
  }

  _setCrossSize(child, size) {
    if (child.type === "container") {
      if (this.dir === "row") child.container.h = size;
      else child.container.x = size;
    } else {
      if (this.dir === "row") child.opts.h = size;
      else child.opts.w = size;
    }
  }

  _getCrossSize(child) {
    if (child.type === "container") {
      return this.dir === "row" ? (child.container.h ?? 0) : (child.container.w ?? 0);
    }
    return this.dir === "row" ? (child.opts.h ?? 0) : (child.opts.w ?? 0);
  }

  render(slide) {
    const innerW = this.w - this.pad * 2;
    const innerH = this.h - this.pad * 2;
    const baseX = this.x + this.pad;
    const baseY = this.y + this.pad;

    // 分离固定尺寸和弹性尺寸子元素
    const fixed = [];
    const flex = [];
    let fixedMainTotal = 0;

    for (const child of this.children) {
      const ms = this._getMainSize(child);
      if (ms > 0) {
        fixed.push(child);
        fixedMainTotal += ms;
      } else {
        flex.push(child);
      }
    }

    const totalGap = this.children.length > 1 ? this.gap * (this.children.length - 1) : 0;
    const availableMain = (this.dir === "row" ? innerW : innerH) - fixedMainTotal - totalGap;
    const flexUnit = flex.length > 0 ? availableMain / flex.length : 0;

    // 分配尺寸
    for (const child of flex) {
      this._setMainSize(child, flexUnit);
    }

    // 计算 cross 轴尺寸
    for (const child of this.children) {
      const cs = this._getCrossSize(child);
      if (cs === 0) {
        this._setCrossSize(child, this.dir === "row" ? innerH : innerW);
      }
    }

    // 计算 main 轴位置（justify）
    const totalMain =
      this.children.reduce((sum, c) => sum + this._getMainSize(c), 0) +
      (this.children.length > 1 ? this.gap * (this.children.length - 1) : 0);

    let currentMain = 0;
    if (this.justify === "center") {
      currentMain = ((this.dir === "row" ? innerW : innerH) - totalMain) / 2;
    } else if (this.justify === "end") {
      currentMain = (this.dir === "row" ? innerW : innerH) - totalMain;
    } else if (this.justify === "between" && this.children.length > 1) {
      currentMain = 0; // 单独处理
    } else if (this.justify === "evenly" && this.children.length > 1) {
      currentMain = 0; // 单独处理
    }

    const betweenGap =
      this.justify === "between" && this.children.length > 1
        ? ((this.dir === "row" ? innerW : innerH) - this.children.reduce((sum, c) => sum + this._getMainSize(c), 0)) /
          (this.children.length - 1)
        : this.gap;

    const evenlyGap =
      this.justify === "evenly" && this.children.length > 1
        ? ((this.dir === "row" ? innerW : innerH) - this.children.reduce((sum, c) => sum + this._getMainSize(c), 0)) /
          (this.children.length + 1)
        : this.gap;

    if (this.justify === "evenly" && this.children.length > 1) {
      currentMain = evenlyGap;
    }

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      const ms = this._getMainSize(child);
      const cs = this._getCrossSize(child);

      // main 轴位置
      const mainPos = currentMain;

      // cross 轴位置（align）
      let crossPos = 0;
      if (this.align === "center") {
        crossPos = ((this.dir === "row" ? innerH : innerW) - cs) / 2;
      } else if (this.align === "end") {
        crossPos = (this.dir === "row" ? innerH : innerW) - cs;
      } else if (this.align === "stretch") {
        crossPos = 0;
        this._setCrossSize(child, this.dir === "row" ? innerH : innerW);
      }

      if (this.dir === "row") {
        this._setMainPos(child, baseX + mainPos);
        this._setCrossPos(child, baseY + crossPos);
      } else {
        this._setMainPos(child, baseY + mainPos);
        this._setCrossPos(child, baseX + crossPos);
      }

      // 推进 currentMain
      if (this.justify === "between") {
        currentMain += ms + betweenGap;
      } else if (this.justify === "evenly") {
        currentMain += ms + evenlyGap;
      } else {
        currentMain += ms + this.gap;
      }
    }

    // 渲染子元素
    for (const child of this.children) {
      if (child.type === "container") {
        child.container.render(slide);
      } else if (child.type === "text") {
        const opts = { ...child.opts };
        slide.addText(child.text, opts);
      } else if (child.type === "shape") {
        slide.addShape(child.shapeType, child.opts);
      } else if (child.type === "rect") {
        slide.addShape("rect", child.opts);
      } else if (child.type === "line") {
        slide.addShape("line", child.opts);
      }
    }
  }
}

// ============================================================
// 辅助函数
// ============================================================
function hexToRgb(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

function hexColor(hex) {
  return hex.startsWith("#") ? hex : `#${hex}`;
}

// ============================================================
// 初始化 PPTX
// ============================================================
const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";
pres.title = "心易陪伴 路演";
pres.author = "心易陪伴团队";

// ============================================================
// Slide 1: 封面
// ============================================================
(function () {
  const slide = pres.addSlide();

  // 深紫渐变背景（用 rect 模拟）
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.Dark) },
  });

  // 上部紫色覆盖层
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H * 0.6,
    fill: { color: hexColor(COLORS.Primary) },
  });

  const container = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "center", justify: "center", gap: 0.2 });

  container.text("心易陪伴", {
    fontSize: 44,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.White),
    align: "center",
    w: SLIDE_W - 1,
    h: 0.8,
  });

  container.text("探索内心，遇见更好的自己", {
    fontSize: 20,
    fontFace: "Calibri",
    color: hexColor(COLORS.White),
    align: "center",
    w: SLIDE_W - 1,
    h: 0.5,
  });

  container.text("基于周易文化 + AI 心理陪伴的大学生心理健康平台", {
    fontSize: 14,
    fontFace: "Calibri",
    color: "FFFFFF",
    colorOpacity: 60,
    align: "center",
    w: SLIDE_W - 1,
    h: 0.4,
  });

  container.render(slide);
})();

// ============================================================
// Slide 2: 目录
// ============================================================
(function () {
  const slide = pres.addSlide();

  // 浅紫背景
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.LightBg) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.8, dir: "col", align: "start", gap: 0.4 });

  root.text("目录", {
    fontSize: 32,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.Dark),
    w: SLIDE_W - 1.6,
    h: 0.6,
  });

  const items = [
    { num: "1", text: "项目概述" },
    { num: "2", text: "核心功能" },
    { num: "3", text: "技术架构" },
    { num: "4", text: "市场与愿景" },
  ];

  const listContainer = new Container({ x: 0, y: 0, w: SLIDE_W - 1.6, h: 3.5, dir: "col", align: "start", gap: 0.35 });

  for (const item of items) {
    const row = new Container({ x: 0, y: 0, w: SLIDE_W - 1.6, h: 0.6, dir: "row", align: "center", gap: 0.25 });

    // 序号圆圈
    row.shape("ellipse", {
      w: 0.5,
      h: 0.5,
      fill: { color: hexColor(COLORS.Primary) },
      line: { color: hexColor(COLORS.Primary), width: 1 },
    });

    // 序号文字（覆盖在圆圈上）
    row.add({
      type: "text",
      text: item.num,
      opts: {
        x: 0,
        y: 0,
        w: 0.5,
        h: 0.5,
        fontSize: 18,
        fontFace: "Calibri",
        bold: true,
        color: hexColor(COLORS.White),
        align: "center",
      },
    });

    row.text(item.text, {
      fontSize: 22,
      fontFace: "Calibri",
      color: hexColor(COLORS.TextDark),
      w: 4,
      h: 0.5,
      valign: "middle",
    });

    listContainer.add(row);
  }

  root.add(listContainer);
  root.render(slide);
})();

// ============================================================
// Slide 3: 项目概述 — 痛点
// ============================================================
(function () {
  const slide = pres.addSlide();

  const leftW = SLIDE_W * 0.38;
  const rightW = SLIDE_W - leftW;

  // 左半：深紫背景
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: leftW,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.Dark) },
  });

  // 右半：浅紫背景
  slide.addShape("rect", {
    x: leftW,
    y: 0,
    w: rightW,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.LightBg) },
  });

  // 左侧标题
  const leftContainer = new Container({ x: 0, y: 0, w: leftW, h: SLIDE_H, pad: 0.5, dir: "col", align: "center", justify: "center" });
  leftContainer.text("为什么我们需要\n心易陪伴？", {
    fontSize: 28,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.White),
    align: "center",
    w: leftW - 1,
    h: 1.2,
  });
  leftContainer.render(slide);

  // 右侧痛点卡片
  const pains = [
    "大学生心理健康问题日益严峻",
    "传统心理咨询门槛高、费用贵",
    "现有APP缺乏文化认同感和趣味性",
  ];

  const rightContainer = new Container({ x: leftW, y: 0, w: rightW, h: SLIDE_H, pad: 0.6, dir: "col", align: "start", justify: "center", gap: 0.4 });

  for (const pain of pains) {
    const row = new Container({ x: 0, y: 0, w: rightW - 1.2, h: 0.7, dir: "row", align: "center", gap: 0.2 });

    row.shape("ellipse", {
      w: 0.18,
      h: 0.18,
      fill: { color: hexColor(COLORS.Primary) },
    });

    row.text(pain, {
      fontSize: 18,
      fontFace: "Calibri",
      color: hexColor(COLORS.TextDark),
      w: rightW - 1.6,
      h: 0.5,
      valign: "middle",
    });

    rightContainer.add(row);
  }

  rightContainer.render(slide);
})();

// ============================================================
// Slide 4: 核心功能 — 周易摇卦
// ============================================================
(function () {
  const slide = pres.addSlide();

  // 白色背景
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.White) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "start", gap: 0.3 });

  root.text("周易摇卦 — 用古老智慧整理思绪", {
    fontSize: 28,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.Dark),
    w: SLIDE_W - 1,
    h: 0.6,
  });

  const body = new Container({ x: 0, y: 0, w: SLIDE_W - 1, h: SLIDE_H - 1.4, dir: "row", align: "start", gap: 0.4 });

  // 左侧步骤
  const steps = [
    { num: "1", title: "输入问题", desc: "在心中默念你的困惑" },
    { num: "2", title: "摇卦生成六爻", desc: "模拟铜钱摇卦过程" },
    { num: "3", title: "AI 趣味解卦", desc: "结合心理学解读卦象" },
  ];

  const leftCol = new Container({ x: 0, y: 0, w: (SLIDE_W - 1) * 0.55, h: SLIDE_H - 1.4, dir: "col", align: "start", justify: "center", gap: 0.35 });

  for (const step of steps) {
    const card = new Container({ x: 0, y: 0, w: (SLIDE_W - 1) * 0.55, h: 1.1, dir: "row", align: "center", gap: 0.25 });

    // 圆形紫底+白色数字
    card.shape("ellipse", {
      w: 0.6,
      h: 0.6,
      fill: { color: hexColor(COLORS.Primary) },
    });

    card.add({
      type: "text",
      text: step.num,
      opts: {
        x: 0,
        y: 0,
        w: 0.6,
        h: 0.6,
        fontSize: 22,
        fontFace: "Calibri",
        bold: true,
        color: hexColor(COLORS.White),
        align: "center",
        valign: "middle",
      },
    });

    const textCol = new Container({ x: 0, y: 0, w: (SLIDE_W - 1) * 0.55 - 0.9, h: 1.0, dir: "col", align: "start", gap: 0.05 });
    textCol.text(step.title, {
      fontSize: 18,
      fontFace: "Calibri",
      bold: true,
      color: hexColor(COLORS.TextDark),
      w: (SLIDE_W - 1) * 0.55 - 0.9,
      h: 0.35,
      valign: "middle",
    });
    textCol.text(step.desc, {
      fontSize: 14,
      fontFace: "Calibri",
      color: hexColor(COLORS.TextLight),
      w: (SLIDE_W - 1) * 0.55 - 0.9,
      h: 0.3,
      valign: "middle",
    });

    card.add(textCol);
    leftCol.add(card);
  }

  body.add(leftCol);

  // 右侧描述区域
  const rightBox = new Container({ x: 0, y: 0, w: (SLIDE_W - 1) * 0.45, h: SLIDE_H - 1.6, dir: "col", align: "start", justify: "center", pad: 0.3 });
  rightBox.rect({
    x: 0,
    y: 0,
    w: (SLIDE_W - 1) * 0.45,
    h: SLIDE_H - 1.6,
    fill: { color: hexColor(COLORS.LightBg) },
    line: { color: hexColor(COLORS.Primary), width: 1 },
  });
  rightBox.text("通过数字化周易摇卦，将古老的东方智慧与现代AI技术结合，帮助大学生在趣味互动中梳理情绪、获得心灵启发。", {
    fontSize: 15,
    fontFace: "Calibri",
    color: hexColor(COLORS.TextDark),
    w: (SLIDE_W - 1) * 0.45 - 0.6,
    h: 1.8,
    align: "left",
    valign: "middle",
  });

  body.add(rightBox);
  root.add(body);
  root.render(slide);
})();

// ============================================================
// Slide 5: 核心功能 — AI心理陪伴
// ============================================================
(function () {
  const slide = pres.addSlide();

  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.White) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "start", gap: 0.3 });

  root.text("AI心理陪伴 — 三个动漫角色守护你", {
    fontSize: 28,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.Dark),
    w: SLIDE_W - 1,
    h: 0.6,
  });

  const cards = [
    { name: "古见", title: "温柔倾听者", desc: '「我在这里，静静听你说。"', color: COLORS.Secondary },
    { name: "五条", title: "最强导师", desc: '「没问题，交给我吧！"', color: COLORS.Primary },
    { name: "射干", title: "巫女守护者", desc: '「愿神谕指引你的前路。"', color: "6366F1" },
  ];

  const cardRow = new Container({ x: 0, y: 0, w: SLIDE_W - 1, h: SLIDE_H - 1.4, dir: "row", align: "stretch", justify: "between", gap: 0.3 });

  const cardW = (SLIDE_W - 1 - 0.6) / 3;

  for (const c of cards) {
    const card = new Container({ x: 0, y: 0, w: cardW, h: SLIDE_H - 1.4, dir: "col", align: "center", justify: "center", pad: 0.25, gap: 0.15 });

    card.rect({
      x: 0,
      y: 0,
      w: cardW,
      h: SLIDE_H - 1.4,
      fill: { color: hexColor(c.color) },
      rectRadius: 0.15,
    });

    card.text(c.name, {
      fontSize: 24,
      fontFace: "Georgia",
      bold: true,
      color: hexColor(COLORS.White),
      w: cardW - 0.5,
      h: 0.5,
      align: "center",
    });

    card.text(c.title, {
      fontSize: 16,
      fontFace: "Calibri",
      bold: true,
      color: hexColor(COLORS.White),
      w: cardW - 0.5,
      h: 0.35,
      align: "center",
    });

    card.text(c.desc, {
      fontSize: 14,
      fontFace: "Calibri",
      color: hexColor(COLORS.White),
      w: cardW - 0.5,
      h: 0.5,
      align: "center",
    });

    cardRow.add(card);
  }

  root.add(cardRow);
  root.render(slide);
})();

// ============================================================
// Slide 6: 核心功能 — 治愈视频
// ============================================================
(function () {
  const slide = pres.addSlide();

  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.White) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "center", justify: "center", gap: 0.4 });

  root.text("开心视频 — 用笑声驱散阴霾", {
    fontSize: 28,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.Dark),
    w: SLIDE_W - 1,
    h: 0.6,
    align: "center",
  });

  const tags = ["解压", "萌宠", "校园", "沙雕", "治愈"];
  const tagRow = new Container({ x: 0, y: 0, w: SLIDE_W - 1, h: 0.6, dir: "row", align: "center", justify: "center", gap: 0.2 });

  for (const tag of tags) {
    const tagContainer = new Container({ x: 0, y: 0, w: 1.0, h: 0.45, dir: "col", align: "center", justify: "center" });
    tagContainer.rect({
      x: 0,
      y: 0,
      w: 1.0,
      h: 0.45,
      fill: { color: hexColor(COLORS.LightBg) },
      line: { color: hexColor(COLORS.Primary), width: 1 },
      rectRadius: 0.2,
    });
    tagContainer.text(tag, {
      fontSize: 16,
      fontFace: "Calibri",
      bold: true,
      color: hexColor(COLORS.Primary),
      w: 1.0,
      h: 0.45,
      align: "center",
      valign: "middle",
    });
    tagRow.add(tagContainer);
  }

  root.add(tagRow);

  root.text("精选B站搞笑视频，一键随机开心", {
    fontSize: 18,
    fontFace: "Calibri",
    color: hexColor(COLORS.TextLight),
    w: SLIDE_W - 1,
    h: 0.4,
    align: "center",
  });

  root.render(slide);
})();

// ============================================================
// Slide 7: 技术架构
// ============================================================
(function () {
  const slide = pres.addSlide();

  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.White) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "start", gap: 0.4 });

  root.text("技术架构", {
    fontSize: 28,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.Dark),
    w: SLIDE_W - 1,
    h: 0.6,
  });

  const archH = 1.0;
  const archGap = 0.4;
  const archY = 1.5;
  const boxH = 0.9;
  const boxW = 2.2;

  // 前端层
  const frontX = 0.8;
  slide.addShape("rect", {
    x: frontX,
    y: archY,
    w: boxW,
    h: boxH,
    fill: { color: hexColor(COLORS.Primary) },
    rectRadius: 0.08,
  });
  slide.addText("前端\nNext.js + React", {
    x: frontX,
    y: archY,
    w: boxW,
    h: boxH,
    fontSize: 14,
    fontFace: "Calibri",
    bold: true,
    color: hexColor(COLORS.White),
    align: "center",
    valign: "middle",
  });

  // 箭头 1
  slide.addShape("line", {
    x1: frontX + boxW + 0.05,
    y1: archY + boxH / 2,
    x2: frontX + boxW + archGap - 0.05,
    y2: archY + boxH / 2,
    line: { color: hexColor(COLORS.TextLight), width: 2 },
  });
  slide.addShape("triangle", {
    x: frontX + boxW + archGap - 0.15,
    y: archY + boxH / 2 - 0.08,
    w: 0.16,
    h: 0.16,
    fill: { color: hexColor(COLORS.TextLight) },
  });

  // API层
  const apiX = frontX + boxW + archGap;
  slide.addShape("rect", {
    x: apiX,
    y: archY,
    w: boxW,
    h: boxH,
    fill: { color: hexColor(COLORS.Accent) },
    rectRadius: 0.08,
  });
  slide.addText("API层\nNext.js API Routes", {
    x: apiX,
    y: archY,
    w: boxW,
    h: boxH,
    fontSize: 14,
    fontFace: "Calibri",
    bold: true,
    color: hexColor(COLORS.White),
    align: "center",
    valign: "middle",
  });

  // 分叉箭头
  const forkX = apiX + boxW + archGap - 0.05;
  const forkStartX = apiX + boxW + 0.05;
  const forkY = archY + boxH / 2;

  // 水平线
  slide.addShape("line", {
    x1: forkStartX,
    y1: forkY,
    x2: forkX,
    y2: forkY,
    line: { color: hexColor(COLORS.TextLight), width: 2 },
  });

  // 向下箭头到 AI 层
  const aiX = forkX + 0.3;
  const aiY = archY + 1.2;
  slide.addShape("line", {
    x1: forkX,
    y1: forkY,
    x2: forkX,
    y2: aiY - 0.05,
    line: { color: hexColor(COLORS.TextLight), width: 2 },
  });
  slide.addShape("line", {
    x1: forkX,
    y1: aiY - 0.05,
    x2: aiX + boxW / 2,
    y2: aiY - 0.05,
    line: { color: hexColor(COLORS.TextLight), width: 2 },
  });
  slide.addShape("triangle", {
    x: aiX + boxW / 2 - 0.08,
    y: aiY - 0.13,
    w: 0.16,
    h: 0.16,
    fill: { color: hexColor(COLORS.TextLight) },
  });

  // 向下箭头到 DB 层
  const dbX = aiX + boxW + 0.6;
  slide.addShape("line", {
    x1: forkX,
    y1: forkY,
    x2: forkX,
    y2: aiY - 0.05,
    line: { color: hexColor(COLORS.TextLight), width: 2 },
  });
  slide.addShape("line", {
    x1: forkX,
    y1: aiY - 0.05,
    x2: dbX + boxW / 2,
    y2: aiY - 0.05,
    line: { color: hexColor(COLORS.TextLight), width: 2 },
  });
  slide.addShape("triangle", {
    x: dbX + boxW / 2 - 0.08,
    y: aiY - 0.13,
    w: 0.16,
    h: 0.16,
    fill: { color: hexColor(COLORS.TextLight) },
  });

  // AI层
  slide.addShape("rect", {
    x: aiX,
    y: aiY,
    w: boxW,
    h: boxH,
    fill: { color: hexColor(COLORS.Secondary) },
    rectRadius: 0.08,
  });
  slide.addText("AI层\nDeepSeek", {
    x: aiX,
    y: aiY,
    w: boxW,
    h: boxH,
    fontSize: 14,
    fontFace: "Calibri",
    bold: true,
    color: hexColor(COLORS.White),
    align: "center",
    valign: "middle",
  });

  // DB层
  slide.addShape("rect", {
    x: dbX,
    y: aiY,
    w: boxW,
    h: boxH,
    fill: { color: hexColor(COLORS.Dark) },
    rectRadius: 0.08,
  });
  slide.addText("数据库层\nPrisma + PostgreSQL", {
    x: dbX,
    y: aiY,
    w: boxW,
    h: boxH,
    fontSize: 14,
    fontFace: "Calibri",
    bold: true,
    color: hexColor(COLORS.White),
    align: "center",
    valign: "middle",
  });

  root.render(slide);
})();

// ============================================================
// Slide 8: 市场分析
// ============================================================
(function () {
  const slide = pres.addSlide();

  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.White) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "start", gap: 0.4 });

  root.text("市场机遇", {
    fontSize: 28,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.Dark),
    w: SLIDE_W - 1,
    h: 0.6,
  });

  const stats = [
    { num: "3000万+", label: "中国大学生人数", color: COLORS.Primary },
    { num: "25%", label: "大学生存在心理问题比例", color: COLORS.Secondary },
    { num: "100亿+", label: "心理健康市场规模", color: COLORS.Accent },
  ];

  const statsRow = new Container({ x: 0, y: 0, w: SLIDE_W - 1, h: SLIDE_H - 1.4, dir: "row", align: "center", justify: "between", gap: 0.3 });

  const statW = (SLIDE_W - 1 - 0.6) / 3;

  for (const s of stats) {
    const col = new Container({ x: 0, y: 0, w: statW, h: SLIDE_H - 1.4, dir: "col", align: "center", justify: "center", gap: 0.15 });

    col.text(s.num, {
      fontSize: 42,
      fontFace: "Georgia",
      bold: true,
      color: hexColor(s.color),
      w: statW,
      h: 0.8,
      align: "center",
    });

    col.text(s.label, {
      fontSize: 16,
      fontFace: "Calibri",
      color: hexColor(COLORS.TextDark),
      w: statW,
      h: 0.4,
      align: "center",
    });

    statsRow.add(col);
  }

  root.add(statsRow);
  root.render(slide);
})();

// ============================================================
// Slide 9: 团队与愿景
// ============================================================
(function () {
  const slide = pres.addSlide();

  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.LightBg) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "start", gap: 0.4 });

  root.text("我们的愿景", {
    fontSize: 28,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.Dark),
    w: SLIDE_W - 1,
    h: 0.6,
  });

  const body = new Container({ x: 0, y: 0, w: SLIDE_W - 1, h: SLIDE_H - 1.4, dir: "row", align: "center", gap: 0.5 });

  // 左侧愿景文字
  const left = new Container({ x: 0, y: 0, w: (SLIDE_W - 1) * 0.5, h: SLIDE_H - 1.4, dir: "col", align: "start", justify: "center" });
  left.text("让每一个年轻人\n都能找到心灵的出口", {
    fontSize: 24,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.TextDark),
    w: (SLIDE_W - 1) * 0.5,
    h: 1.2,
    align: "left",
  });
  body.add(left);

  // 右侧核心价值标签
  const right = new Container({ x: 0, y: 0, w: (SLIDE_W - 1) * 0.5, h: SLIDE_H - 1.4, dir: "col", align: "start", justify: "center", gap: 0.3 });

  const values = ["文化创新", "技术赋能", "心理关怀"];
  for (const v of values) {
    const tag = new Container({ x: 0, y: 0, w: 2.2, h: 0.55, dir: "col", align: "center", justify: "center" });
    tag.rect({
      x: 0,
      y: 0,
      w: 2.2,
      h: 0.55,
      fill: { color: hexColor(COLORS.Primary) },
      rectRadius: 0.25,
    });
    tag.text(v, {
      fontSize: 16,
      fontFace: "Calibri",
      bold: true,
      color: hexColor(COLORS.White),
      w: 2.2,
      h: 0.55,
      align: "center",
      valign: "middle",
    });
    right.add(tag);
  }

  body.add(right);
  root.add(body);
  root.render(slide);
})();

// ============================================================
// Slide 10: 结束页
// ============================================================
(function () {
  const slide = pres.addSlide();

  // 深紫渐变背景
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: hexColor(COLORS.Dark) },
  });
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H * 0.55,
    fill: { color: hexColor(COLORS.Primary) },
  });

  const root = new Container({ x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, pad: 0.5, dir: "col", align: "center", justify: "center", gap: 0.25 });

  root.text("感谢聆听", {
    fontSize: 40,
    fontFace: "Georgia",
    bold: true,
    color: hexColor(COLORS.White),
    w: SLIDE_W - 1,
    h: 0.8,
    align: "center",
  });

  root.text("心易陪伴 — 探索内心，遇见更好的自己", {
    fontSize: 18,
    fontFace: "Calibri",
    color: hexColor(COLORS.White),
    w: SLIDE_W - 1,
    h: 0.4,
    align: "center",
  });

  root.text("项目链接：github.com/your-team/mindful-gua", {
    fontSize: 13,
    fontFace: "Calibri",
    color: "FFFFFF",
    colorOpacity: 70,
    w: SLIDE_W - 1,
    h: 0.3,
    align: "center",
  });

  root.render(slide);
})();

// ============================================================
// 保存文件
// ============================================================
pres
  .writeFile({ fileName: "c:\\Users\\14868\\Desktop\\黑客松\\mindful-gua\\scripts\\心易陪伴-路演.pptx" })
  .then(() => {
    console.log("PPT 已生成: c:\\Users\\14868\\Desktop\\黑客松\\mindful-gua\\scripts\\心易陪伴-路演.pptx");
  })
  .catch((err) => {
    console.error("生成失败:", err);
    process.exit(1);
  });
