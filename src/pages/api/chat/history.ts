import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import type { ApiResponse, ChatMessage } from '@/types';

interface HistoryResponse {
  items: ChatMessage[];
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
    const { userId, roleId, limit = '20' } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        code: 400,
        message: '缺少 userId 参数',
        data: null as unknown as HistoryResponse,
      });
    }

    const take = Math.min(parseInt(limit as string, 10) || 20, 100);

    const where: any = { userId };
    if (roleId && typeof roleId === 'string') {
      where.roleId = roleId;
    }

    const [records, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
      }),
      prisma.chatMessage.count({ where }),
    ]);

    const items: ChatMessage[] = records
      .reverse() // 按时间正序返回
      .map((record) => ({
        id: record.id,
        userId: record.userId || undefined,
        roleId: record.roleId,
        content: record.content,
        sender: record.sender as any,
        isCrisis: record.isCrisis,
        createdAt: record.createdAt.toISOString(),
      }));

    return res.status(200).json({
      code: 0,
      message: '获取成功',
      data: { items, total },
    });
  } catch (error) {
    console.error('获取聊天记录失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as HistoryResponse,
    });
  }
}
