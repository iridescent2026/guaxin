import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import type { ApiResponse, Gua } from '@/types';

interface HistoryResponse {
  items: Gua[];
  total: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<HistoryResponse>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 GET 请求',
      data: null as unknown as HistoryResponse,
    });
  }

  try {
    const { userId, limit = '20', offset = '0' } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        code: 400,
        message: '缺少 userId 参数',
        data: null as unknown as HistoryResponse,
      });
    }

    const take = Math.min(parseInt(limit as string, 10) || 20, 100);
    const skip = parseInt(offset as string, 10) || 0;

    const [records, total] = await Promise.all([
      prisma.guaRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.guaRecord.count({ where: { userId } }),
    ]);

    const items: Gua[] = records.map((record) => ({
      id: record.id,
      userId: record.userId || undefined,
      question: record.question,
      mood: record.mood as any,
      lines: record.lines as any,
      guaName: record.guaName,
      guaCode: record.guaCode,
      interpretation: record.interpretation || undefined,
      createdAt: record.createdAt.toISOString(),
    }));

    return res.status(200).json({
      code: 0,
      message: '获取成功',
      data: { items, total },
    });
  } catch (error) {
    console.error('获取卦象历史失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as HistoryResponse,
    });
  }
}
