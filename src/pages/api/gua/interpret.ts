import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { callLLM } from '@/lib/openai';
import { detectCrisis } from '@/lib/safety';
import { GUA_SYSTEM_PROMPT, buildGuaUserPrompt } from '@/prompts/gua-prompt';
import type { ApiResponse, GuaInterpretation, InterpretGuaRequest } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GuaInterpretation>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 POST 请求',
      data: null as unknown as GuaInterpretation,
    });
  }

  try {
    const { guaId, lines, question, mood } = req.body as InterpretGuaRequest;

    if (!lines || lines.length !== 6) {
      return res.status(400).json({
        code: 400,
        message: '六爻数据不完整',
        data: null as unknown as GuaInterpretation,
      });
    }

    // 构建提示词
    const systemPrompt = GUA_SYSTEM_PROMPT;
    const userPrompt = buildGuaUserPrompt(lines, question, mood);

    // 调用 AI（限制token避免超时）
    const aiResponse = await callLLM(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 1200,
      jsonMode: true,
    });

    // 解析 JSON
    let interpretation: GuaInterpretation;
    try {
      const parsed = JSON.parse(aiResponse);
      interpretation = {
        guaName: parsed.guaName || '',
        guaMeaning: parsed.guaMeaning || '',
        funInterpretation: parsed.funInterpretation || '',
        interpretation: parsed.interpretation || '',
        psychologyAdvice: parsed.psychologyAdvice || '',
        actionAdvice: parsed.actionAdvice || '',
        changingLines: parsed.changingLines || [],
        overallTone: parsed.overallTone || 'neutral',
        crisisFlag: !!parsed.crisisFlag,
      };
    } catch {
      // 如果 JSON 解析失败，包装原始文本
      interpretation = {
        guaName: '',
        guaMeaning: '',
        interpretation: aiResponse,
        psychologyAdvice: '',
        actionAdvice: '',
        changingLines: [],
        overallTone: 'neutral',
        crisisFlag: false,
      };
    }

    // 额外安全层：关键词检测
    const crisisCheck = detectCrisis(question + ' ' + interpretation.interpretation);
    if (crisisCheck.level === 'crisis') {
      interpretation.crisisFlag = true;
    }

    // 更新数据库中的解卦结果
    if (guaId) {
      await prisma.guaRecord.update({
        where: { id: guaId },
        data: {
          interpretation: JSON.stringify(interpretation),
        },
      });
    }

    return res.status(200).json({
      code: 0,
      message: '解卦成功',
      data: interpretation,
    });
  } catch (error) {
    console.error('解卦失败:', error);
    return res.status(503).json({
      code: 503,
      message: 'AI 服务暂时不可用，请稍后重试',
      data: null as unknown as GuaInterpretation,
    });
  }
}
