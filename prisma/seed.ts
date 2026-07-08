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
      title: '治愈解压视频合集',
      coverUrl: 'https://picsum.photos/400/300?random=1',
      videoUrl: 'https://www.bilibili.com/video/BV1e7XrBqE2c',
      platform: 'bilibili' as const,
      category: 'healing' as const,
      tags: ['治愈', '解压', '放松'],
      sortOrder: 0,
    },
    {
      title: '校园搞笑日常',
      coverUrl: 'https://picsum.photos/400/300?random=2',
      videoUrl: 'https://www.bilibili.com/video/BV1YkQfBJE1n',
      platform: 'bilibili' as const,
      category: 'campus' as const,
      tags: ['校园', '搞笑', '日常'],
      sortOrder: 1,
    },
    {
      title: '萌宠搞笑瞬间',
      coverUrl: 'https://picsum.photos/400/300?random=3',
      videoUrl: 'https://www.bilibili.com/video/BV1fXQSY3ET1',
      platform: 'bilibili' as const,
      category: 'animal' as const,
      tags: ['萌宠', '搞笑', '治愈'],
      sortOrder: 2,
    },
    {
      title: '沙雕网友精选',
      coverUrl: 'https://picsum.photos/400/300?random=4',
      videoUrl: 'https://www.bilibili.com/video/BV1AJDTBnER4',
      platform: 'bilibili' as const,
      category: 'funny' as const,
      tags: ['沙雕', '网友', '笑到头掉'],
      sortOrder: 3,
    },
    {
      title: '轻松一刻 - 快乐源泉',
      coverUrl: 'https://picsum.photos/400/300?random=5',
      videoUrl: 'https://www.bilibili.com/video/BV1pSNqzGE2J',
      platform: 'bilibili' as const,
      category: 'stress_relief' as const,
      tags: ['解压', '快乐', '轻松'],
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
