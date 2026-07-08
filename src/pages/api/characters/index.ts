import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import type { ApiResponse, Character } from '@/types';

/** 安全解析 JSON 字符串，失败时返回 fallback */
function safeParseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

interface CharactersResponse {
  items: Character[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CharactersResponse>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 GET 请求',
      data: null as unknown as CharactersResponse,
    });
  }

  try {
    const records = await prisma.character.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const items: Character[] = records.map((record) => ({
      id: record.id,
      name: record.name,
      title: record.title,
      avatar: record.avatar || undefined,
      personality: record.personality,
      promptKey: record.promptKey,
      tags: safeParseJSON<string[]>(record.tags, []),
    }));

    return res.status(200).json({
      code: 0,
      message: '获取成功',
      data: { items },
    });
  } catch (error) {
    console.error('获取角色列表失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as CharactersResponse,
    });
  }
}
