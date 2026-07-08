import { useState, useEffect, useCallback } from 'react';
import type { Video, VideoCategory } from '@/types';

/* ==================== 常量 ==================== */

interface CategoryOption {
  key: string;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'all', label: '全部' },
  { key: 'stress_relief', label: '解压' },
  { key: 'animal', label: '萌宠' },
  { key: 'campus', label: '校园' },
  { key: 'funny', label: '沙雕' },
  { key: 'healing', label: '治愈' },
];

const PLATFORM_LABELS: Record<string, string> = {
  bilibili: 'B站',
  douyin: '抖音',
  xiaohongshu: '小红书',
  youtube: 'YouTube',
  other: '其他',
};

/* ==================== 类型 ==================== */

interface VideosData {
  items: Video[];
  total: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/* ==================== 页面组件 ==================== */

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [randomLoading, setRandomLoading] = useState<boolean>(false);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  /* 获取视频列表 */
  const fetchVideos = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const query = category === 'all' ? '' : `?category=${category}`;
      const res = await fetch(`/api/videos${query}`);
      const json: ApiResponse<VideosData> = await res.json();
      if (json.code === 0 && json.data) {
        setVideos(json.data.items);
        setTotal(json.data.total);
      }
    } catch (err) {
      console.error('获取视频列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* 切换分类 */
  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    fetchVideos(key);
  };

  /* 随机跳转 */
  const handleRandom = async () => {
    setRandomLoading(true);
    try {
      const res = await fetch('/api/videos/random');
      const json: ApiResponse<{ video: Video }> = await res.json();
      if (json.code === 0 && json.data?.video) {
        setPlayingVideo(json.data.video);
      }
    } catch (err) {
      console.error('获取随机视频失败:', err);
    } finally {
      setRandomLoading(false);
    }
  };

  /* 初始加载 */
  useEffect(() => {
    fetchVideos('all');
  }, [fetchVideos]);

  /* 监听子组件播放事件 */
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<Video>;
      setPlayingVideo(customEvent.detail);
    };
    window.addEventListener('playVideo', handler);
    return () => window.removeEventListener('playVideo', handler);
  }, []);

  /* ==================== 渲染 ==================== */

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 顶部导航 */}
      <nav className="max-w-5xl mx-auto px-4 pt-6 flex items-center gap-4">
        <a href="/" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
          ← 返回首页
        </a>
      </nav>

      {/* 视频播放弹窗 */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={() => setPlayingVideo(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{playingVideo.title}</h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={`https://player.bilibili.com/player.html?bvid=${playingVideo.videoUrl.split('/').pop()}&autoplay=1`}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
            <div className="px-5 py-3">
              <a
                href={playingVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:text-blue-700 underline"
              >
                在B站打开观看
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 顶部标题区 */}
      <header className="pt-10 pb-6 text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          &#127881; 开心一下
        </h1>
        <p className="text-lg text-gray-500">看看搞笑视频，放松心情</p>
      </header>

      {/* 分类标签栏 + 随机按钮 */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat.key
                  ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 随机按钮 */}
        <div className="text-center">
          <button
            onClick={handleRandom}
            disabled={randomLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {randomLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            随机开心一下
          </button>
        </div>
      </div>

      {/* 视频数量统计 */}
      <div className="max-w-5xl mx-auto px-4 mb-4">
        <p className="text-sm text-gray-400">
          共 {total} 个视频
          {activeCategory !== 'all' && (
            <span>
              {' / '}
              {CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </span>
          )}
        </p>
      </div>

      {/* 视频卡片网格 */}
      <main className="max-w-5xl mx-auto px-4 pb-12">
        {loading ? (
          /* 加载状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400">加载中...</p>
          </div>
        ) : videos.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无视频，敬请期待~</p>
          </div>
        ) : (
          /* 视频网格 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>

      {/* 底部提示 */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-2">
            如果遇到心理困扰，请寻求专业帮助
          </p>
          <p className="text-gray-600 font-medium">
            全国24小时心理援助热线：
            <a
              href="tel:400-161-9995"
              className="text-pink-500 hover:text-pink-600 underline"
            >
              400-161-9995
            </a>
          </p>
          <p className="text-gray-600 font-medium mt-1">
            北京心理危机研究与干预中心：
            <a
              href="tel:010-82951332"
              className="text-pink-500 hover:text-pink-600 underline"
            >
              010-82951332
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ==================== 视频卡片子组件 ==================== */

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  const platformLabel = PLATFORM_LABELS[video.platform] || '其他';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* 封面图 - 点击播放 */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer"
           onClick={() => {
             const event = new CustomEvent('playVideo', { detail: video });
             window.dispatchEvent(event);
           }}>
        <img
          src={video.coverUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <svg className="w-7 h-7 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* 平台标识 */}
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-pink-500/90 text-white text-xs font-medium rounded">
          {platformLabel}
        </span>
      </div>

      {/* 卡片内容 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-gray-800 font-medium text-base leading-snug mb-2 line-clamp-2">
          {video.title}
        </h3>

        {/* 标签 */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 去看看按钮 */}
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
        >
          在B站打开
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
