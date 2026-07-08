# 心易陪伴 - 前后端接口规范文档

> 本文档供成员A（前端）、成员B（后端）、成员C（产品）共同参考，确保命名、类型、接口一致。

---

## 一、命名规范

### 1.1 通用规则
- 所有标识符使用 **小写驼峰（camelCase）**
- 数据库表名使用 **小写下划线（snake_case）**，复数形式
- API 路径使用 **kebab-case**
- 枚举值使用 **大写下划线（SCREAMING_SNAKE_CASE）**

### 1.2 时间字段统一
- 创建时间：`createdAt`（前端）/ `created_at`（数据库）
- 更新时间：`updatedAt`（前端）/ `updated_at`（数据库）

### 1.3 ID 字段
- 主键统一使用 `id`，类型 `uuid`，由数据库自动生成
- 外键格式：`{表名}Id`，如 `userId`、`guaId`

---

## 二、数据模型

### 2.1 用户 User
```typescript
interface User {
  id: string;           // UUID
  nickname: string;     // 昵称，默认"匿名旅人"
  avatar: string;       // 头像URL，可空
  createdAt: string;    // ISO 8601 时间戳
}
```

### 2.2 卦象 Gua
```typescript
interface Gua {
  id: string;
  userId: string;       // 关联用户，匿名用户可空
  question: string;     // 用户问的问题
  mood: Mood;           // 当前情绪标签
  lines: YaoLine[];     // 六爻数组，从下到上（初爻到上爻）
  guaName: string;      // 卦名，如"乾为天"
  guaCode: string;      // 卦象编码，如"111111"
  interpretation: string; // AI解卦内容
  createdAt: string;
}
```

### 2.3 爻 YaoLine
```typescript
interface YaoLine {
  position: number;     // 1-6，表示第几爻
  value: YaoValue;      // 爻值
}

type YaoValue = 6 | 7 | 8 | 9;
// 6: 老阴（变爻，阴变阳）
// 7: 少阳（不变，阳）
// 8: 少阴（不变，阴）
// 9: 老阳（变爻，阳变阴）
```

### 2.4 情绪标签 Mood
```typescript
type Mood = 'anxious' | 'sad' | 'confused' | 'stressed' | 'calm' | 'happy' | 'tired';
// 焦虑 | 低落 | 迷茫 | 压力大 | 平静 | 开心 | 疲惫
```

### 2.5 聊天记录 ChatMessage
```typescript
interface ChatMessage {
  id: string;
  userId: string;
  roleId: string;       // 角色ID
  content: string;      // 消息内容
  sender: 'user' | 'assistant'; // 发送者
  isCrisis: boolean;    // 是否触发危机识别
  createdAt: string;
}
```

### 2.6 角色 Character
```typescript
interface Character {
  id: string;
  name: string;         // 角色名，如"温言"
  title: string;        // 称号，如"温柔学姐"
  avatar: string;       // 头像URL
  personality: string;  // 人设简介
  promptKey: string;    // 对应提示词key，如"gentle_senior"
  tags: string[];       // 标签，如["温柔", "倾听"]
}
```

### 2.7 视频 Video
```typescript
interface Video {
  id: string;
  title: string;        // 视频标题
  coverUrl: string;     // 封面图URL
  videoUrl: string;     // 跳转链接（B站/抖音等外部链接）
  platform: Platform;   // 来源平台
  category: VideoCategory; // 分类
  tags: string[];       // 标签
  sortOrder: number;    // 排序权重
  createdAt: string;
}

type Platform = 'bilibili' | 'douyin' | 'xiaohongshu' | 'youtube' | 'other';

type VideoCategory = 'stress_relief' | 'animal' | 'campus' | 'funny' | 'healing' | 'random';
// 解压 | 萌宠 | 校园 | 沙雕 | 治愈 | 随机
```

---

## 三、API 接口清单

### 3.1 基础信息
- Base URL: `/api`
- 所有响应统一包装：
```typescript
interface ApiResponse<T> {
  code: number;       // 0 成功，非0 错误
  message: string;    // 提示信息
  data: T;            // 数据体
}
```

### 3.2 错误码
| 错误码 | 含义 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
| 503 | AI服务暂时不可用 |

---

### 3.3 卦象模块 `/api/gua`

#### POST `/api/gua/generate` - 生成卦象
**请求：**
```json
{
  "userId": "uuid | null",
  "question": "string, max 200",
  "mood": "anxious"
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "question": "我最近考试压力很大，该怎么办？",
    "mood": "stressed",
    "lines": [
      { "position": 1, "value": 7 },
      { "position": 2, "value": 8 },
      { "position": 3, "value": 9 },
      { "position": 4, "value": 6 },
      { "position": 5, "value": 7 },
      { "position": 6, "value": 8 }
    ],
    "guaName": "火水未济",
    "guaCode": "101010",
    "createdAt": "2026-07-08T14:30:00Z"
  }
}
```

#### POST `/api/gua/interpret` - AI解卦
**请求：**
```json
{
  "guaId": "uuid",
  "lines": [
    { "position": 1, "value": 7 },
    { "position": 2, "value": 8 },
    { "position": 3, "value": 9 },
    { "position": 4, "value": 6 },
    { "position": 5, "value": 7 },
    { "position": 6, "value": 8 }
  ],
  "question": "string",
  "mood": "stressed"
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "guaName": "火水未济",
    "guaMeaning": "卦象基本含义...",
    "interpretation": "针对你的问题的趣味解读...",
    "psychologyAdvice": "心理建议...",
    "actionAdvice": "具体行动建议...",
    "changingLines": [
      { "position": 3, "meaning": "九三爻辞解读..." },
      { "position": 4, "meaning": "六四爻辞解读..." }
    ],
    "overallTone": "encouraging",
    "crisisFlag": false
  }
}
```

#### GET `/api/gua/history?userId={uuid}` - 获取卦象历史
**响应：**
```json
{
  "code": 0,
  "data": {
    "items": [Gua],
    "total": 10
  }
}
```

---

### 3.4 聊天模块 `/api/chat`

#### POST `/api/chat` - 发送消息
**请求：**
```json
{
  "userId": "uuid | null",
  "roleId": "string",
  "message": "string, max 1000",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "reply": "string",
    "isCrisis": false,
    "crisisResources": null,
    "characterName": "温言"
  }
}
```

**危机响应示例：**
```json
{
  "code": 0,
  "data": {
    "reply": "我听到你说最近感觉很糟糕，这让我很担心你。你愿意和我说说发生了什么吗？同时，这些资源也许能帮到你：",
    "isCrisis": true,
    "crisisResources": {
      "hotline": "400-161-9995",
      "campusCenter": "校心理中心：010-12345678",
      "tip": "你并不孤单，有人愿意倾听和帮助你。"
    }
  }
}
```

#### GET `/api/chat/history?userId={uuid}&roleId={string}&limit=20` - 获取聊天记录
**响应：**
```json
{
  "code": 0,
  "data": {
    "items": [ChatMessage],
    "total": 50
  }
}
```

---

### 3.5 角色模块 `/api/characters`

#### GET `/api/characters` - 获取角色列表
**响应：**
```json
{
  "code": 0,
  "data": {
    "items": [Character]
  }
}
```

---

### 3.6 视频模块 `/api/videos`

#### GET `/api/videos?category={category}&limit=20&offset=0` - 获取视频列表
**响应：**
```json
{
  "code": 0,
  "data": {
    "items": [Video],
    "total": 100
  }
}
```

#### GET `/api/videos/random` - 随机获取一个视频
**响应：**
```json
{
  "code": 0,
  "data": {
    "video": Video
  }
}
```

---

### 3.7 用户模块 `/api/user`

#### POST `/api/user` - 创建/更新用户
**请求：**
```json
{
  "nickname": "string",
  "avatar": "string | null"
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "user": User,
    "token": "jwt_string"
  }
}
```

#### GET `/api/user/{id}` - 获取用户信息
**响应：**
```json
{
  "code": 0,
  "data": {
    "user": User
  }
}
```

---

## 四、数据库表结构（概述）

| 表名 | 说明 | 核心字段 |
|------|------|----------|
| `users` | 用户表 | id, nickname, avatar, created_at |
| `gua_records` | 卦象记录 | id, user_id, question, mood, lines, gua_name, gua_code, interpretation, created_at |
| `chat_messages` | 聊天记录 | id, user_id, role_id, content, sender, is_crisis, created_at |
| `characters` | 角色配置 | id, name, title, avatar, personality, prompt_key, tags |
| `videos` | 视频导航 | id, title, cover_url, video_url, platform, category, tags, sort_order, created_at |

---

## 五、安全与边界

1. **匿名优先**：不强制登录，userId 可为 null，使用 localStorage 临时标识
2. **危机识别**：聊天内容触发关键词时，`isCrisis` 置为 true，返回求助资源
3. **内容长度限制**：question ≤ 200字，message ≤ 1000字
4. **频率限制**：解卦和聊天接口单IP限流（如 10次/分钟）
5. **免责声明**：解卦内容必须包含"仅供娱乐参考，不构成专业心理建议"

---

> 文档版本：v1.0 | 维护人：成员B | 最后更新：2026-07-08
