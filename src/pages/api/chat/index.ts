import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { callLLM } from '@/lib/openai';
import { detectCrisis, getCrisisResources, sanitizeInput, validateLength } from '@/lib/safety';
import { getCharacterPrompt } from '@/prompts/companion-prompt';
import { CRISIS_SYSTEM_PROMPT, SAFETY_LAYER_PROMPT } from '@/prompts/safety-prompt';
import type { ApiResponse, ChatReply, ChatRequest } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ChatReply>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 POST 请求',
      data: null as unknown as ChatReply,
    });
  }

  try {
    const { userId, roleId, message, history = [] } = req.body as ChatRequest;

    // 参数校验
    const cleanMessage = sanitizeInput(message);
    if (!validateLength(cleanMessage, 1000)) {
      return res.status(400).json({
        code: 400,
        message: '消息不能为空且不能超过1000字',
        data: null as unknown as ChatReply,
      });
    }

    if (!roleId) {
      return res.status(400).json({
        code: 400,
        message: '请选择对话角色',
        data: null as unknown as ChatReply,
      });
    }

    // 安全检测
    const crisisCheck = detectCrisis(cleanMessage);
    const isCrisis = crisisCheck.level === 'crisis';

    // 保存用户消息
    await prisma.chatMessage.create({
      data: {
        userId: userId || null,
        roleId,
        content: cleanMessage,
        sender: 'user',
        isCrisis: false,
      },
    });

    // 构建系统提示词
    let systemPrompt: string;
    let characterName = 'AI助手';

    if (isCrisis) {
      // 危机模式：使用专门的危机提示词
      systemPrompt = CRISIS_SYSTEM_PROMPT;
    } else {
      // 正常模式：角色提示词 + 安全层
      const character = getCharacterPrompt(roleId);
      if (character) {
        systemPrompt = character.systemPrompt + SAFETY_LAYER_PROMPT;
        characterName = character.name;
      } else {
        systemPrompt = '你是一位温暖的心理陪伴助手。' + SAFETY_LAYER_PROMPT;
      }
    }

    // 构建对话历史
    const chatHistory = history.map((h) => ({
      role: h.role,
      content: h.content,
    }));

    // 调用 AI
    const aiReply = await callLLM(
      systemPrompt,
      cleanMessage,
      {
        temperature: 0.8,
        maxTokens: 2048,
      }
    );

    // 保存 AI 回复
    await prisma.chatMessage.create({
      data: {
        userId: userId || null,
        roleId,
        content: aiReply,
        sender: 'assistant',
        isCrisis,
      },
    });

    const reply: ChatReply = {
      reply: aiReply,
      isCrisis,
      characterName,
    };

    // 危机模式下附加求助资源
    if (isCrisis) {
      reply.crisisResources = getCrisisResources();
    }

    return res.status(200).json({
      code: 0,
      message: '回复成功',
      data: reply,
    });
  } catch (error) {
    console.error('聊天失败:', error);
    return res.status(503).json({
      code: 503,
      message: 'AI 服务暂时不可用，请稍后重试',
      data: null as unknown as ChatReply,
    });
  }
}
