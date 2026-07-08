import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import type { ApiResponse, Video, VideoCategory } from '@/types';

interface VideosResponse {
  items: Video[];
  total: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VideosResponse>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 GET 请求',
      data: null as unknown as VideosResponse,
    });
  }

  try {
    const { category, limit = '20', offset = '0' } = req.query;

    const take = Math.min(parseInt(limit as string, 10) || 20, 100);
    const skip = parseInt(offset as string, 10) || 0;

    const where: any = {};
    if (category && typeof category === 'string' && category !== 'all') {
      where.category = category;
    }

    const [records, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take,
        skip,
      }),
      prisma.video.count({ where }),
    ]);

    const items: Video[] = records.map((record) => ({
      id: record.id,
      title: record.title,
      coverUrl: record.coverUrl,
      videoUrl: record.videoUrl,
      platform: record.platform as any,
      category: record.category as VideoCategory,
      tags: record.tags,
      sortOrder: record.sortOrder,
      createdAt: record.createdAt.toISOString(),
    }));

    return res.status(200).json({
      code: 0,
      message: '获取成功',
      data: { items, total },
    });
  } catch (error) {
    console.error('获取视频列表失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as VideosResponse,
    });
  }
}
