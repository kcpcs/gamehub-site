# GameHub 视频平台 Phase 2 规划

**日期**: 2026-05-13  
**状态**: Phase 1 已完成 ✅, Phase 2 规划中

---

## 📊 Phase 1 完成回顾

### 已实现功能
- ✅ YouTube + Twitch API 集成
- ✅ 视频卡片组件
- ✅ 游戏详情页标签系统
- ✅ 视频发现页面 ( `/videos` )
- ✅ 演示模式 (无 API 密钥也能使用)
- ✅ 完整翻译支持
- ✅ 数据库模型扩展
- ✅ 开发服务器运行中

### 开发服务器地址
**http://localhost:3000** - 已在运行!

---

## 🚀 Phase 2: 用户交互与增强

### Phase 2 目标
- 提高用户参与度
- 添加视频收藏功能
- 视频评论与评分
- AI 驱动的视频推荐
- 更多视频平台支持

---

## 📋 Phase 2 功能列表

### 优先级 1: 核心用户功能
1. **视频收藏/书签系统**
   - 用户可以收藏喜欢的视频
   - 个人收藏夹页面
   - 视频卡片上的收藏按钮

2. **视频评论系统**
   - 用户可以对视频进行评论
   - 评论显示在视频下方
   - 点赞/回复评论

3. **视频评分/点赞功能**
   - 用户可以给视频点赞
   - 按点赞数排序视频

### 优先级 2: AI 驱动增强
4. **智能视频推荐**
   - 基于用户浏览历史的视频推荐
   - 游戏相关视频的智能推荐
   - "你可能也喜欢" 部分

5. **视频分类优化**
   - AI 驱动的视频内容分类
   - 更好的标签系统
   - 相关视频聚合

6. **视频搜索增强**
   - 按内容类型筛选
   - 按时间范围筛选
   - 按观看次数/评分排序

### 优先级 3: 平台扩展
7. **更多视频平台支持**
   - TikTok/抖音视频嵌入
   - Kick 直播集成
   - Bilibili 集成

8. **视频播放增强**
   - 视频队列功能
   - 自动播放下一个视频
   - 画中画模式

---

## 🗺️ 开发路线图

### Week 1-2: Phase 2 MVP
1. 数据库模型更新
2. 用户收藏 API
3. 收藏 UI 组件
4. 基础评论系统
5. 集成到现有页面

### Week 3-4: AI 推荐系统
1. 浏览历史追踪
2. 推荐算法开发
3. 推荐 UI 组件
4. A/B 测试框架

### Week 5-6: 平台扩展
1. TikTok/Kick API 集成
2. 更多平台嵌入
3. 高级播放器功能
4. 性能优化

---

## 🔧 数据库模型扩展 (Phase 2)

### 新增表
```prisma
// 用户视频收藏
model VideoFavorite {
  id        String   @id @default(cuid())
  userId    String
  videoId   String
  createdAt DateTime @default(now())
  // 索引优化
  @@index([userId, videoId])
  @@unique([userId, videoId])
}

// 视频评论
model VideoComment {
  id        String   @id @default(cuid())
  videoId   String
  userId    String
  content   String
  createdAt DateTime @default(now())
  // 索引优化
  @@index([videoId, createdAt])
}

// 视频点赞
model VideoLike {
  id        String   @id @default(cuid())
  videoId   String
  userId    String
  createdAt DateTime @default(now())
  // 索引优化
  @@unique([userId, videoId])
  @@index([videoId])
}

// 用户浏览历史
model VideoViewHistory {
  id        String   @id @default(cuid())
  userId    String
  videoId   String
  watchedAt DateTime @default(now())
  // 索引优化
  @@index([userId, watchedAt])
}
```

---

## 📁 Phase 2 文件结构

```
src/
├── app/
│   ├── api/
│   │   ├── videos/
│   │   │   └── [videoId]/
│   │   │       ├── favorite/       # 收藏 API
│   │   │       ├── like/          # 点赞 API
│   │   │       └── comments/      # 评论 API
│   │   └── recommend/
│   │       └── videos/            # 推荐 API
│   └── videos/
│       └── [id]/                  # 视频详情页
├── components/
│   ├── videos/
│   │   ├── VideoFavoriteButton.tsx
│   │   ├── VideoLikeButton.tsx
│   │   ├── VideoComments.tsx
│   │   └── VideoRecommendations.tsx
│   └── ...
└── lib/
    ├── video-recommendations.ts
    └── video-analytics.ts
```

---

## 🎯 成功指标

### Phase 2 KPI
- ⬆️ 用户停留时间: +50% (Phase 1 为 +150%)
- ⬆️ 视频观看量: +200%
- ⬆️ 用户参与度: +100% (收藏/评论/点赞)
- ⬆️ 新用户留存: +30%

### 商业指标
- 广告收入: +80%
- 转化率: +25%
- 用户参与度: +150%

---

## 📊 当前状态总结

### 已完成的工作 (Phase 1)
1. ✅ Prisma 模型更新
2. ✅ YouTube + Twitch API 集成
3. ✅ 视频组件开发
4. ✅ 游戏详情页标签系统
5. ✅ 视频发现页面 ( `/videos` )
6. ✅ 翻译文件更新
7. ✅ Prisma Client 生成
8. ✅ 开发服务器运行中

### 下一步
**立即开始**:
1. 访问 http://localhost:3000 测试 Phase 1 功能
2. 访问 /videos 页面浏览视频
3. 访问任意游戏详情页测试视频标签

**Phase 2 开发**:
- 可根据用户反馈进行规划
- 建议先做用户测试再决定 Phase 2 优先级

---

## ✅ 执行检查清单

### Phase 1 完整度检查
- [x] 数据库模型扩展
- [x] YouTube API 集成
- [x] Twitch API 集成
- [x] 视频卡片组件
- [x] 视频发现页面
- [x] 游戏详情页标签
- [x] 导航栏更新
- [x] 翻译文件更新
- [x] Prisma Client 生成
- [x] 开发服务器运行

### 可立即测试的页面
- http://localhost:3000/videos - 视频发现页面
- http://localhost:3000/games - 游戏列表
- 任意游戏详情页的视频标签

---

**文档生成日期**: 2026-05-13  
**总调度**: Claude Opus 4
