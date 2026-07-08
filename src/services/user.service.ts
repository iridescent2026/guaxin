import type { User, CreateUserRequest } from '@/types';

/**
 * 创建或更新用户
 */
export async function createOrUpdateUser(data: CreateUserRequest): Promise<{ user: User; token: string }> {
  throw new Error('TODO');
}

/**
 * 获取用户信息
 */
export async function getUser(id: string): Promise<User> {
  throw new Error('TODO');
}
