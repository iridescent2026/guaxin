// 简单API测试脚本
async function test() {
  const base = 'http://localhost:3000';

  // 测试1: 健康检查
  console.log('=== 测试1: 健康检查 ===');
  const health = await fetch(`${base}/api/health`);
  console.log('状态:', health.status, await health.json());

  // 测试2: 摇卦生成
  console.log('\n=== 测试2: 摇卦生成 ===');
  const gua = await fetch(`${base}/api/gua/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: '我最近考试压力很大', mood: 'stressed' }),
  });
  const guaData = await gua.json();
  console.log('状态:', gua.status, guaData);

  // 测试3: 角色列表
  console.log('\n=== 测试3: 角色列表 ===');
  const chars = await fetch(`${base}/api/characters`);
  console.log('状态:', chars.status, await chars.json());

  // 测试4: 视频列表
  console.log('\n=== 测试4: 视频列表 ===');
  const videos = await fetch(`${base}/api/videos`);
  console.log('状态:', videos.status, await videos.json());

  // 测试5: 随机视频
  console.log('\n=== 测试5: 随机视频 ===');
  const random = await fetch(`${base}/api/videos/random`);
  console.log('状态:', random.status, await random.json());
}

test().catch(console.error);
