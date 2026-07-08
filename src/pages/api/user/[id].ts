import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import type { ApiResponse, User } from '@/types';

interface UserResponse {
  user: User;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserResponse>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 GET 请求',
      data: null as unknown as UserResponse,
    });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        code: 400,
        message: '缺少用户ID',
        data: null as unknown as UserResponse,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null as unknown as UserResponse,
      });
    }

    const response: User = {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt.toISOString(),
    };

    return res.status(200).json({
      code: 0,
      message: '获取成功',
      data: { user: response },
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as UserResponse,
    });
  }
}
