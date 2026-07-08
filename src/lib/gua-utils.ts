/**
 * 周易卦象计算工具
 * 六爻生成、卦名查询、变卦计算
 */

import { YaoLine, YaoValue } from '@/types';

// ==================== 64 卦名称与含义映射 ====================
// 卦码格式：从下到上，1=阳，0=阴
// 基于先天/后天八卦排列的64卦完整映射

export interface GuaInfo {
  symbol: string;
  meaning: string;
  keywords: string[];
}

export const HEXAGRAM_DATA: Record<string, GuaInfo> = {
  "乾": { symbol: "䷀", meaning: "刚健中正，自强不息", keywords: ["奋斗", "事业", "坚持", "勇气", "领导", "成功", "进取"] },
  "坤": { symbol: "䷁", meaning: "厚德载物，包容万方", keywords: ["包容", "忍耐", "家庭", "关系", "承受", "温柔", "大地"] },
  "屯": { symbol: "䷂", meaning: "万事开头难", keywords: ["开始", "创业", "困难", "新生", "起步", "艰难", "初生"] },
  "蒙": { symbol: "䷃", meaning: "蒙以养正，启蒙之道", keywords: ["学习", "迷茫", "教育", "成长", "困惑", "启蒙", "未知"] },
  "需": { symbol: "䷄", meaning: "耐心等待时机", keywords: ["等待", "耐心", "时机", "坚持", "信仰", "守候", "希望"] },
  "讼": { symbol: "䷅", meaning: "争讼难解，和为贵", keywords: ["争吵", "矛盾", "冲突", "官司", "争执", "和解", "是非"] },
  "师": { symbol: "䷆", meaning: "统率之道，严明纪律", keywords: ["团队", "领导", "纪律", "管理", "组织", "权威", "指挥"] },
  "比": { symbol: "䷇", meaning: "亲附和合", keywords: ["合作", "朋友", "联盟", "亲密", "友谊", "陪伴", "互助"] },
  "小畜": { symbol: "䷈", meaning: "蓄势待发", keywords: ["积累", "准备", "储备", "蓄力", "等待时机", "未雨绸缪"] },
  "履": { symbol: "䷉", meaning: "如履薄冰，谨慎行事", keywords: ["谨慎", "危险", "小心", "风险", "稳重", "试探", "安全"] },
  "泰": { symbol: "䷊", meaning: "安泰通达", keywords: ["顺利", "平安", "通畅", "好运", "成功", "和谐", "安定"] },
  "否": { symbol: "䷋", meaning: "闭塞不通", keywords: ["阻碍", "不顺", "挫折", "阻塞", "失落", "困境", "停滞"] },
  "同人": { symbol: "䷌", meaning: "志同道合", keywords: ["团队", "合作", "志同道合", "朋友", "认同", "伙伴", "归属"] },
  "大有": { symbol: "䷍", meaning: "丰盈富足", keywords: ["收获", "成就", "富足", "成功", "充实", "丰富", "满足"] },
  "谦": { symbol: "䷎", meaning: "谦虚受益", keywords: ["谦虚", "低调", "学习", "进步", "虚心", "尊重", "涵养"] },
  "豫": { symbol: "䷏", meaning: "安乐豫悦", keywords: ["快乐", "享受", "放松", "愉悦", "满足", "安逸", "幸福"] },
  "随": { symbol: "䷐", meaning: "随顺时机", keywords: ["随缘", "顺应", "变化", "接纳", "灵活", "适应", "放下"] },
  "蛊": { symbol: "䷑", meaning: "除弊革新", keywords: ["改革", "变革", "修复", "整顿", "治理", "改变", "创新"] },
  "临": { symbol: "䷒", meaning: "君临天下", keywords: ["管理", "领导", "责任", "担当", "决策", "权威", "关怀"] },
  "观": { symbol: "䷓", meaning: "观察审慎", keywords: ["观察", "反思", "审慎", "理解", "洞察", "学习", "内省"] },
  "噬嗑": { symbol: "䷔", meaning: "刑狱决断", keywords: ["决断", "判断", "果断", "冲突", "解决", "坚定", "清除"] },
  "贲": { symbol: "䷕", meaning: "文饰之美", keywords: ["外表", "装饰", "文艺", "审美", "包装", "展示", "形象"] },
  "剥": { symbol: "䷖", meaning: "剥落衰败", keywords: ["失去", "衰落", "剥离", "否定", "改变", "放下", "结束"] },
  "复": { symbol: "䷗", meaning: "复归本心", keywords: ["重生", "回归", "反省", "修复", "重新开始", "本源", "挽回"] },
  "无妄": { symbol: "䷘", meaning: "不可妄为", keywords: ["真诚", "本分", "踏实", "务实", "诚信", "不贪", "踏实"] },
  "大畜": { symbol: "䷙", meaning: "积蓄大德", keywords: ["积累", "储备", "提升", "成长", "学习", "厚积薄发", "准备"] },
  "颐": { symbol: "䷚", meaning: "颐养之道", keywords: ["健康", "养生", "照顾", "休息", "平静", "滋养", "安养"] },
  "大过": { symbol: "䷛", meaning: "超常之举", keywords: ["冒险", "勇气", "非常规", "突破", "超越", "大胆", "创新"] },
  "坎": { symbol: "䷜", meaning: "险陷之中", keywords: ["困难", "危险", "挑战", "坚持", "逆境", "艰辛", "考验"] },
  "离": { symbol: "䷝", meaning: "光明依附", keywords: ["光明", "希望", "依附", "智慧", "信任", "依靠"] },
  "咸": { symbol: "䷞", meaning: "感而遂通", keywords: ["感情", "感动", "相通", "共鸣", "恋爱", "真诚", "沟通"] },
  "恒": { symbol: "䷟", meaning: "持久守恒", keywords: ["坚持", "恒心", "稳定", "持久", "婚姻", "长久", "不变"] },
  "遁": { symbol: "䷠", meaning: "退避隐忍", keywords: ["退让", "隐藏", "隐忍", "撤退", "低调", "避险", "策略"] },
  "大壮": { symbol: "䷡", meaning: "强盛壮大", keywords: ["强大", "成长", "力量", "自信", "发展", "扩张", "生机"] },
  "晋": { symbol: "䷢", meaning: "进取晋升", keywords: ["晋升", "进步", "发展", "前途", "事业", "提升", "未来"] },
  "明夷": { symbol: "䷣", meaning: "晦暗待明", keywords: ["压抑", "低谷", "隐忍", "坚持", "等待光明", "黑暗", "蓄力"] },
  "家人": { symbol: "䷤", meaning: "家道和睦", keywords: ["家庭", "亲情", "和睦", "归属", "温暖", "父母", "子女"] },
  "睽": { symbol: "䷥", meaning: "乖离分歧", keywords: ["分歧", "误会", "不和", "分离", "矛盾", "差异", "沟通障碍"] },
  "蹇": { symbol: "䷦", meaning: "艰难险阻", keywords: ["困难", "阻碍", "艰辛", "挑战", "坚持", "逆境", "坎坷"] },
  "解": { symbol: "䷧", meaning: "解脱释放", keywords: ["解脱", "释放", "轻松", "解决问题", "松绑", "自由"] },
  "损": { symbol: "䷨", meaning: "损己益人", keywords: ["奉献", "牺牲", "付出", "慈善", "助人", "利他", "舍弃"] },
  "益": { symbol: "䷩", meaning: "增益他人", keywords: ["帮助", "成长", "利益", "促进", "协助", "共赢", "增益"] },
  "夬": { symbol: "䷪", meaning: "决断果断", keywords: ["决断", "果断", "决心", "行动", "切割", "决策", "勇气"] },
  "姤": { symbol: "䷫", meaning: "遇合机缘", keywords: ["相遇", "机缘", "缘分", "机会", "邂逅", "合作", "新的开始"] },
  "萃": { symbol: "䷬", meaning: "荟萃聚集", keywords: ["聚集", "中心", "精华", "集会", "交流", "团队", "核心"] },
  "升": { symbol: "䷭", meaning: "升进上升", keywords: ["上升", "进步", "提升", "发展", "升迁", "成功", "前进"] },
  "困": { symbol: "䷮", meaning: "困顿坚守", keywords: ["困境", "坚守", "贫穷", "压力", "坚持", "考验", "等待"] },
  "井": { symbol: "䷯", meaning: "修己养人", keywords: ["修养", "自省", "充电", "提高", "内省", "成长", "自我提升"] },
  "革": { symbol: "䷰", meaning: "变革革新", keywords: ["变革", "改变", "创新", "革命", "突破", "新局面", "进化"] },
  "鼎": { symbol: "䷱", meaning: "鼎立更新", keywords: ["稳定", "权威", "更新", "建立", "巩固", "权力", "新气象"] },
  "震": { symbol: "䷲", meaning: "震动警醒", keywords: ["震动", "警醒", "突然", "吃惊", "警惕", "变化", "意外"] },
  "艮": { symbol: "䷳", meaning: "止定如山", keywords: ["停止", "稳定", "坚持原则", "不动", "坚定", "安宁", "果断停止"] },
  "渐": { symbol: "䷴", meaning: "循序渐进", keywords: ["循序渐进", "缓慢", "稳定", "发展", "按部就班", "耐心", "过程"] },
  "归妹": { symbol: "䷵", meaning: "归宿结合", keywords: ["归宿", "结合", "婚姻", "联合", "合作", "归属", "联盟"] },
  "丰": { symbol: "䷶", meaning: "丰盛盈满", keywords: ["丰富", "丰收", "成就", "丰盛", "好运", "圆满", "充足"] },
  "旅": { symbol: "䷷", meaning: "旅居行止", keywords: ["旅行", "漂泊", "移动", "探索", "迁移", "孤独", "暂居"] },
  "巽": { symbol: "䷸", meaning: "谦顺善入", keywords: ["谦逊", "柔顺", "适应", "理解", "沟通", "温和", "融入"] },
  "兑": { symbol: "䷹", meaning: "悦乐和合", keywords: ["喜悦", "沟通", "享受", "快乐", "交流", "友好", "表达"] },
  "涣": { symbol: "䷺", meaning: "涣散释然", keywords: ["涣散", "释放", "放下", "分散", "释然", "解脱", "松散"] },
  "节": { symbol: "䷻", meaning: "节制适度", keywords: ["节制", "适度", "自律", "管理", "节省", "控制"] },
  "中孚": { symbol: "䷼", meaning: "诚信感化", keywords: ["诚信", "信任", "真诚", "感人", "可靠"] },
  "小过": { symbol: "䷽", meaning: "小有超越", keywords: ["小过", "小失误", "修正", "小心", "克服", "微调", "容忍"] },
  "既济": { symbol: "䷾", meaning: "事成之时", keywords: ["完成", "成功", "终点", "达成", "成就", "圆满", "结束"] },
  "未济": { symbol: "䷿", meaning: "事未完成", keywords: ["未完成", "继续", "未竟", "坚持", "待续", "希望", "未来"] },
};

// 卦码 → 卦名 映射（标准周易64卦序）
const GUA_CODE_MAP: Record<string, string> = {
  '111111': '乾', '000000': '坤', '010001': '屯', '100010': '蒙',
  '010111': '需', '111010': '讼', '000010': '师', '010000': '比',
  '110111': '小畜', '111011': '履', '000111': '泰', '111000': '否',
  '111101': '同人', '101111': '大有', '000100': '谦', '001000': '豫',
  '011001': '随', '100110': '蛊', '000011': '临', '110000': '观',
  '100101': '贲', '101001': '噬嗑', '100001': '颐', '011110': '大过',
  '010010': '坎', '101101': '离', '011100': '咸', '001110': '恒',
  '111100': '遁', '001111': '大壮', '101000': '晋', '000101': '明夷',
  '101011': '家人', '110101': '睽', '011010': '蹇', '001010': '解',
  '110011': '损', '100011': '益', '011111': '夬', '111110': '姤',
  '011000': '萃', '000110': '升', '010100': '困', '010110': '井',
  '101110': '革', '011101': '鼎', '100100': '震', '001001': '艮',
  '001011': '渐', '110100': '归妹', '101100': '丰', '001101': '旅',
  '011011': '巽', '110110': '兑', '010011': '涣', '110010': '节',
  '110001': '中孚', '001100': '小过', '101010': '既济', '010101': '未济',
};

/**
 * 摇一爻：使用三枚硬币法模拟
 * 3枚硬币，正面为阳（3），反面为阴（2）
 * 三枚总和：6(老阴)、7(少阳)、8(少阴)、9(老阳)
 */
function tossYao(): YaoValue {
  const coin1 = Math.random() < 0.5 ? 2 : 3;
  const coin2 = Math.random() < 0.5 ? 2 : 3;
  const coin3 = Math.random() < 0.5 ? 2 : 3;
  const sum = coin1 + coin2 + coin3;
  return sum as YaoValue;
}

/**
 * 生成六爻（从下到上）
 */
export function generateSixLines(): YaoLine[] {
  const lines: YaoLine[] = [];
  for (let i = 1; i <= 6; i++) {
    lines.push({
      position: i,
      value: tossYao(),
    });
  }
  return lines;
}

/**
 * 将爻值转换为卦码
 * 阳爻(7,9) → 1，阴爻(6,8) → 0
 */
export function linesToGuaCode(lines: YaoLine[]): string {
  return lines
    .map((line) => (line.value === 7 || line.value === 9 ? '1' : '0'))
    .join('');
}

/**
 * 根据卦码查询卦名
 */
export function getGuaName(guaCode: string): string {
  const name = GUA_CODE_MAP[guaCode];
  return name || '未知卦象';
}

/**
 * 根据卦码查询完整卦信息
 */
export function getGuaInfo(guaCode: string): GuaInfo | null {
  const name = getGuaName(guaCode);
  return name !== '未知卦象' ? HEXAGRAM_DATA[name] : null;
}

/**
 * 获取变爻列表
 */
export function getChangingLines(lines: YaoLine[]): YaoLine[] {
  return lines.filter((line) => line.value === 6 || line.value === 9);
}

/**
 * 计算变卦（变爻翻转后的卦象）
 */
export function getChangedGuaCode(lines: YaoLine[]): string {
  return lines
    .map((line) => {
      if (line.value === 6) return '1'; // 老阴变阳
      if (line.value === 9) return '0'; // 老阳变阴
      return line.value === 7 ? '1' : '0';
    })
    .join('');
}

/**
 * 完整的卦象生成流程
 */
export function generateGua() {
  const lines = generateSixLines();
  const guaCode = linesToGuaCode(lines);
  const guaName = getGuaName(guaCode);
  const guaInfo = getGuaInfo(guaCode);
  const changingLines = getChangingLines(lines);
  const changedGuaCode = getChangedGuaCode(lines);
  const changedGuaName = getGuaName(changedGuaCode);
  const changedGuaInfo = getGuaInfo(changedGuaCode);

  return {
    lines,
    guaCode,
    guaName: guaName !== '未知卦象' ? guaName : '未知',
    guaInfo,
    changingLines,
    changedGuaCode,
    changedGuaName: changedGuaName !== '未知卦象' ? changedGuaName : '未知',
    changedGuaInfo,
  };
}
