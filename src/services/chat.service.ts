import type { ChatReply, ChatRequest, ChatMessage } from '@/types';

/**
 * 发送聊天消息
 */
export async function sendChat(data: ChatRequest): Promise<ChatReply> {
  throw new Error('TODO');
}

/**
 * 获取聊天历史
 */
export async function getChatHistory(
  userId: string,
  roleId: string,
  limit?: number
): Promise<{ items: ChatMessage[]; total: number }> {
  throw new Error('TODO');
}
