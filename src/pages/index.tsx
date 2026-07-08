import Link from 'next/link';
import { useMemo } from 'react';

const features = [
  {
    title: '摇卦问心',
    desc: '心有所惑，卦象为答。用周易智慧探索内心',
    icon: '\u{1F52E}',
    href: '/gua',
    color: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    shadowColor: 'rgba(124, 58, 237, 0.25)',
  },
  {
    title: '心灵陪伴',
    desc: '温暖的角色倾听你的心声，随时倾诉',
    icon: '\u{1F49A}',
    href: '/chat',
    color: 'linear-gradient(135deg, #ec4899, #db2777)',
    shadowColor: 'rgba(236, 72, 153, 0.25)',
  },
  {
    title: '开心视频',
    desc: '精选治愈内容，点亮心情的每一天',
    icon: '\u{1F3AC}',
    href: '/videos',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    shadowColor: 'rgba(245, 158, 11, 0.25)',
  },
];

const hotlineItems = [
  { label: '全国24小时心理危机干预热线', number: '400-161-9995' },
  { label: '希望24热线', number: '400-161-9995' },
  { label: '北京心理危机研究与干预中心', number: '010-82951332' },
  { label: '生命热线', number: '400-821-1215' },
];

export default function HomePage() {
  const cards = useMemo(() => features, []);

  return (
    <div className="page-container">
      {/* 头部区域 */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: 48,
          paddingBottom: 40,
          animation: 'fadeInUp 0.6s ease',
        }}
      >
        {/* 装饰背景 */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <div
            style={{
              fontSize: 56,
              lineHeight: 1,
              marginBottom: 16,
              filter: 'drop-shadow(0 4px 12px rgba(124, 58, 237, 0.2))',
            }}
          >
            {'\u{1F9D8}\u{200D}\u{2640}\u{FE0F}'}
          </div>
          {/* 光晕装饰 */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            background: 'var(--gradient-main)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 12,
            letterSpacing: 2,
          }}
        >
          心易陪伴
        </h1>
        <p
          style={{
            fontSize: 16,
            color: 'var(--color-text-secondary)',
            fontWeight: 400,
            letterSpacing: 1,
          }}
        >
          探索内心，遇见更好的自己
        </p>
      </div>

      {/* 功能卡片 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 48,
        }}
      >
        {cards.map((card, index) => (
          <Link key={card.title} href={card.href} style={{ textDecoration: 'none' }}>
            <div
              className="feature-card"
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                border: '1px solid rgba(124, 58, 237, 0.06)',
                boxShadow: 'var(--shadow-card)',
                animation: `fadeInUp 0.6s ease ${0.1 * (index + 1)}s both`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 背景装饰渐变 */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: card.color,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
              {/* hover 伪效果通过 JS state 实现，这里用简单过渡 */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle at top right, ${card.shadowColor}, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* 图标 */}
              <div
                style={{
                  position: 'relative',
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-md)',
                  background: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${card.shadowColor}`,
                }}
              >
                {card.icon}
              </div>

              {/* 文字 */}
              <div style={{ position: 'relative', flex: 1 }}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: 4,
                  }}
                >
                  {card.title}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {card.desc}
                </p>
              </div>

              {/* 箭头 */}
              <div
                style={{
                  position: 'relative',
                  fontSize: 18,
                  color: 'var(--color-text-light)',
                  transition: 'transform 0.3s ease, color 0.3s ease',
                }}
              >
                {'\u203A'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 心理危机求助热线 */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid rgba(124, 58, 237, 0.08)',
          animation: 'fadeInUp 0.6s ease 0.5s both',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 18 }}>{'\u{1F4DE}'}</span>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--color-primary)',
            }}
          >
            心理危机求助热线
          </h3>
        </div>
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-text-light)',
            marginBottom: 16,
            lineHeight: 1.6,
          }}
        >
          如果你或身边的人正在经历心理困扰，请拨打以下热线寻求专业帮助。你并不孤单。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hotlineItems.map((item) => (
            <div
              key={item.number}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(124, 58, 237, 0.03)',
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {item.label}
              </span>
              <a
                href={`tel:${item.number}`}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  letterSpacing: 0.5,
                }}
              >
                {item.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 底部信息 */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 48,
          paddingBottom: 24,
          animation: 'fadeIn 0.6s ease 0.7s both',
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-text-light)',
            lineHeight: 1.6,
          }}
        >
          心易陪伴 -- 用温暖守护每一颗心
          <br />
          本平台仅供心理健康辅助，不能替代专业心理咨询与治疗
        </p>
      </div>
    </div>
  );
}
