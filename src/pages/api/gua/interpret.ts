import type { NextApiRequest, NextApiResponse } from 'next';
import { callLLM } from '@/lib/openai';
import { detectCrisis } from '@/lib/safety';
import { BAGUA_ARCHETYPES } from '@/lib/bagua-archetypes';
import {
  PROJECTION_SYSTEM_PROMPT,
  buildProjectionPrompt,
} from '@/prompts/gua-prompt';
import type { ApiResponse } from '@/types';

export interface ProjectionInterpretation {
  psychologicalAnalysis: string;
  philosophyInsight: string;
  growthAdvice: string;
  actionSteps: string;
  crisisFlag: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ProjectionInterpretation>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 405,
      message: '仅支持 POST 请求',
      data: null as unknown as ProjectionInterpretation,
    });
  }

  try {
    const { archetypeName, question, mood, options } = req.body as {
      archetypeName?: string;
      question?: string;
      mood?: string;
      options?: string[];
    };

    if (!archetypeName) {
      return res.status(400).json({
        code: 400,
        message: '请选择一个意象',
        data: null as unknown as ProjectionInterpretation,
      });
    }

    // 查找对应的 archetype 数据
    const archetype = BAGUA_ARCHETYPES.find(
      (a) => a.name === archetypeName
    );

    if (!archetype) {
      return res.status(400).json({
        code: 400,
        message: `未找到意象"${archetypeName}"的数据`,
        data: null as unknown as ProjectionInterpretation,
      });
    }

    // 构建 userPrompt，注入 archetype 数据
    const userPrompt = buildProjectionPrompt({
      archetypeName: archetype.name,
      nature: archetype.nature,
      archetype: archetype.archetype,
      psychologyConcept: archetype.psychologyConcept,
      philosophy: archetype.philosophy,
      question: question || '',
      mood: mood || '未选择',
      options: options || BAGUA_ARCHETYPES.map((a) => a.name),
    });

    // 调用 AI
    const aiResponse = await callLLM(PROJECTION_SYSTEM_PROMPT, userPrompt, {
      temperature: 0.7,
      maxTokens: 1200,
      jsonMode: true,
    });

    // 解析 JSON
    let interpretation: ProjectionInterpretation;
    try {
      const parsed = JSON.parse(aiResponse);
      interpretation = {
        psychologicalAnalysis: parsed.psychologicalAnalysis || '',
        philosophyInsight: parsed.philosophyInsight || '',
        growthAdvice: parsed.growthAdvice || '',
        actionSteps: parsed.actionSteps || '',
        crisisFlag: !!parsed.crisisFlag,
      };
    } catch {
      // JSON 解析失败，包装原始文本
      interpretation = {
        psychologicalAnalysis: aiResponse,
        philosophyInsight: '',
        growthAdvice: '',
        actionSteps: '',
        crisisFlag: false,
      };
    }

    // 额外安全层：关键词检测
    const crisisCheck = detectCrisis(
      (question || '') + ' ' + interpretation.psychologicalAnalysis
    );
    if (crisisCheck.level === 'crisis') {
      interpretation.crisisFlag = true;
    }

    return res.status(200).json({
      code: 0,
      message: '解读完成',
      data: interpretation,
    });
  } catch (error) {
    console.error('心理投射解读失败:', error);
    return res.status(503).json({
      code: 503,
      message: 'AI 服务暂时不可用，请稍后重试',
      data: null as unknown as ProjectionInterpretation,
    });
  }
}