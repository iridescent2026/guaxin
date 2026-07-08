import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { generateGua } from '@/lib/gua-utils';
import { sanitizeInput, validateLength } from '@/lib/safety';
import type { ApiResponse, Gua, GenerateGuaRequest, YaoLine } from '@/types';

/** 安全解析 JSON 字符串，失败时返回 fallback */
function safeParseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Gua>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: '仅支持 POST 请求', data: null as unknown as Gua });
  }

  try {
    const { userId, question, mood } = req.body as GenerateGuaRequest;

    // 参数校验
    const cleanQuestion = sanitizeInput(question || '');
    if (!validateLength(cleanQuestion, 200)) {
      return res.status(400).json({
        code: 400,
        message: '问题不能为空且不能超过200字',
        data: null as unknown as Gua,
      });
    }

    if (!mood) {
      return res.status(400).json({
        code: 400,
        message: '请选择当前情绪状态',
        data: null as unknown as Gua,
      });
    }

    // 生成六爻
    const { lines, guaCode, guaName } = generateGua();

    // 存入数据库（lines 数组需序列化为 JSON 字符串）
    const record = await prisma.guaRecord.create({
      data: {
        userId: userId || null,
        question: cleanQuestion,
        mood,
        lines: JSON.stringify(lines),
        guaName,
        guaCode,
      },
    });

    const response: Gua = {
      id: record.id,
      userId: record.userId || undefined,
      question: record.question,
      mood: record.mood as any,
      lines: safeParseJSON<YaoLine[]>(record.lines, lines),
      guaName: record.guaName,
      guaCode: record.guaCode,
      createdAt: record.createdAt.toISOString(),
    };

    return res.status(200).json({
      code: 0,
      message: '卦象生成成功',
      data: response,
    });
  } catch (error) {
    console.error('生成卦象失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as Gua,
    });
  }
}
