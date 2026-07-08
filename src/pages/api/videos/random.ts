import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import type { ApiResponse, Video } from '@/types';

interface RandomVideoResponse {
  video: Video;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RandomVideoResponse>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 GET 请求',
      data: null as unknown as RandomVideoResponse,
    });
  }

  try {
    const { category } = req.query;
    const where: any = {};
    if (category && typeof category === 'string' && category !== 'all') {
      where.category = category;
    }

    const count = await prisma.video.count({ where });
    if (count === 0) {
      return res.status(404).json({
        code: 404,
        message: '暂无视频数据',
        data: null as unknown as RandomVideoResponse,
      });
    }

    const skip = Math.floor(Math.random() * count);
    const records = await prisma.video.findMany({
      where,
      take: 1,
      skip,
    });

    if (records.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '暂无视频数据',
        data: null as unknown as RandomVideoResponse,
      });
    }

    const record = records[0];
    const video: Video = {
      id: record.id,
      title: record.title,
      coverUrl: record.coverUrl,
      videoUrl: record.videoUrl,
      platform: record.platform as any,
      category: record.category as any,
      tags: record.tags,
      sortOrder: record.sortOrder,
      createdAt: record.createdAt.toISOString(),
    };

    return res.status(200).json({
      code: 0,
      message: '获取成功',
      data: { video },
    });
  } catch (error) {
    console.error('获取随机视频失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as RandomVideoResponse,
    });
  }
}
