import { PrismaClient } from '@prisma/client';
import { getAllCharacters } from '../src/prompts/companion-prompt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化种子数据...');

  // 1. 初始化角色数据
  const characters = getAllCharacters();
  for (const char of characters) {
    await prisma.character.upsert({
      where: { promptKey: char.promptKey },
      update: {
        name: char.name,
        title: char.title,
        personality: char.personality,
        tags: char.tags,
      },
      create: {
        name: char.name,
        title: char.title,
        personality: char.personality,
        promptKey: char.promptKey,
        tags: char.tags,
        sortOrder: char.promptKey === 'gentle_senior' ? 0
          : char.promptKey === 'rational_roommate' ? 1
          : 2,
      },
    });
    console.log(`✅ 角色已创建/更新: ${char.name}`);
  }

  // 2. 初始化示例视频数据
  const sampleVideos = [
    {
      title: '猫咪洗脸原声纯享版',
      coverUrl: 'https://picsum.photos/400/300?random=1',
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
      platform: 'bilibili' as const,
      category: 'animal' as const,
      tags: ['猫咪', '治愈', '萌宠'],
      sortOrder: 0,
    },
    {
      title: '大学生期末周崩溃实录',
      coverUrl: 'https://picsum.photos/400/300?random=2',
      videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h7',
      platform: 'bilibili' as const,
      category: 'campus' as const,
      tags: ['期末', '校园', '搞笑'],
      sortOrder: 1,
    },
    {
      title: '10分钟冥想引导 - 缓解焦虑',
      coverUrl: 'https://picsum.photos/400/300?random=3',
      videoUrl: 'https://www.bilibili.com/video/BV1Lt411g7gy',
      platform: 'bilibili' as const,
      category: 'stress_relief' as const,
      tags: ['冥想', '解压', '正念'],
      sortOrder: 2,
    },
    {
      title: '沙雕室友的日常',
      coverUrl: 'https://picsum.photos/400/300?random=4',
      videoUrl: 'https://www.douyin.com/video/1234567890',
      platform: 'douyin' as const,
      category: 'funny' as const,
      tags: ['室友', '沙雕', '日常'],
      sortOrder: 3,
    },
    {
      title: '海边日落 - 治愈系风景',
      coverUrl: 'https://picsum.photos/400/300?random=5',
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mE',
      platform: 'bilibili' as const,
      category: 'healing' as const,
      tags: ['风景', '日落', '治愈'],
      sortOrder: 4,
    },
  ];

  for (const video of sampleVideos) {
    await prisma.video.createMany({
      data: video,
      skipDuplicates: true,
    });
  }
  console.log(`✅ 已创建 ${sampleVideos.length} 条示例视频`);

  console.log('🎉 种子数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
