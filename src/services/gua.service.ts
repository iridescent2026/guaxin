import type { Gua, GuaInterpretation, GenerateGuaRequest, InterpretGuaRequest } from '@/types';

/**
 * 生成卦象
 */
export async function generateGua(data: GenerateGuaRequest): Promise<Gua> {
  throw new Error('TODO');
}

/**
 * AI 解卦
 */
export async function interpretGua(data: InterpretGuaRequest): Promise<GuaInterpretation> {
  throw new Error('TODO');
}

/**
 * 获取卦象历史
 */
export async function getGuaHistory(userId: string): Promise<{ items: Gua[]; total: number }> {
  throw new Error('TODO');
}
