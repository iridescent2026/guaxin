import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (!apiKey) {
  console.warn('⚠️ OPENAI_API_KEY 未配置，AI 功能将不可用');
}

const openai = new OpenAI({
  apiKey,
  baseURL,
  timeout: 30000,
  maxRetries: 2,
});

export { openai, model };

/**
 * 统一调用大模型的封装函数
 */
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  } = {}
): Promise<string> {
  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } = options;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    response_format: jsonMode ? { type: 'json_object' } : undefined,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('LLM 返回内容为空');
  }

  return content;
}

/**
 * 流式调用（用于聊天）
 */
export async function* streamLLM(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const { temperature = 0.8, maxTokens = 2048 } = options;

  const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const stream = await openai.chat.completions.create({
    model,
    messages: allMessages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
