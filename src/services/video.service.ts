import type { Video, VideoCategory } from '@/types';

/**
 * 获取视频列表
 */
export async function getVideos(
  category?: VideoCategory,
  limit?: number,
  offset?: number
): Promise<{ items: Video[]; total: number }> {
  throw new Error('TODO');
}

/**
 * 获取随机视频
 */
export async function getRandomVideo(): Promise<Video> {
  throw new Error('TODO');
}
