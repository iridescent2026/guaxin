import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { sanitizeInput, validateLength } from '@/lib/safety';
import type { ApiResponse, User, CreateUserRequest } from '@/types';

interface UserResponse {
  user: User;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 POST 请求',
      data: null as unknown as UserResponse,
    });
  }

  try {
    const { nickname, avatar } = req.body as CreateUserRequest;

    const cleanNickname = sanitizeInput(nickname || '匿名旅人');
    if (!validateLength(cleanNickname, 50)) {
      return res.status(400).json({
        code: 400,
        message: '昵称不能超过50字',
        data: null as unknown as UserResponse,
      });
    }

    const user = await prisma.user.create({
      data: {
        nickname: cleanNickname,
        avatar: avatar || null,
      },
    });

    const response: User = {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt.toISOString(),
    };

    return res.status(200).json({
      code: 0,
      message: '用户创建成功',
      data: { user: response },
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null as unknown as UserResponse,
    });
  }
}
