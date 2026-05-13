# GameHub 部署清单

**日期**: 2026-05-13  
**版本**: Phase 1-3 完整版  
**状态**: 准备就绪

---

## 📋 部署前检查清单

### 1. 环境变量配置

**必需的环境变量** (`.env.production`):

```env
# Database
DATABASE_URL="file:./prod.db"

# Redis
UPSTASH_REDIS_REST_URL="your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"

# YouTube API (可选)
YOUTUBE_API_KEY="your-youtube-api-key"

# Twitch API (可选)
TWITCH_CLIENT_ID="your-twitch-client-id"
TWITCH_CLIENT_SECRET="your-twitch-client-secret"

# TikTok API (可选)
TIKTOK_API_KEY="your-tiktok-api-key"

# AdSense (可选)
NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-xxxxxxxxxxxxxxx"

# Cloudflare (可选)
CLOUDFLARE_API_TOKEN="your-cloudflare-token"
```

### 2. 数据库迁移

```bash
# 开发环境
npm run db:generate

# 生产环境
npx prisma migrate deploy
```

### 3. 构建和部署

#### Vercel 部署
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

#### 手动构建
```bash
# 安装依赖
npm install

# 生成 Prisma Client
npm run db:generate

# 构建
npm run build

# 启动生产服务器
npm start
```

---

## 🎯 部署步骤

### Step 1: 数据库设置

**推荐: Turso (SQLite 分布式)**

```bash
# 安装 Turso CLI
curl -sSfL https://turso.tech/install.sh | bash

# 创建数据库
turso db create gamehub

# 获取数据库 URL
turso db show gamehub --url

# 创建本地副本进行迁移
turso db shell gamehub < prisma/migrations/migration_name/migration.sql
```

### Step 2: Redis 设置

**推荐: Upstash Redis**

```bash
# 在 Upstash 控制台创建数据库
# 获取 REST URL 和 Token
# 设置环境变量
```

### Step 3: 域名和 CDN

**推荐: Cloudflare**

1. 注册 Cloudflare 账户
2. 添加您的域名
3. 配置 DNS 指向 Vercel
4. 启用 CDN 缓存

### Step 4: 部署

**Vercel 快速部署**:

1. 连接 GitHub 仓库
2. 配置环境变量
3. 部署

**Railway 部署**:

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

---

## ✅ 功能检查

### Phase 1 功能
- [x] YouTube 视频集成
- [x] Twitch 视频集成
- [x] 视频发现页面
- [x] 游戏详情页视频标签

### Phase 2 功能
- [x] 视频收藏
- [x] 视频点赞
- [x] 视频评论
- [x] 观看历史

### Phase 2.5 功能
- [x] AI 视频推荐
- [x] TikTok 集成
- [x] 增强视频搜索

### Phase 3 功能
- [x] 创作者申请系统
- [x] 创作者资料
- [x] 内容提交
- [x] 收益系统
- [x] 视频广告位

---

## 🔒 安全检查

- [x] 所有 API 路由都有认证检查
- [x] 数据库使用 Prisma ORM 防注入
- [x] NextAuth.js 会话管理
- [x] 环境变量管理
- [x] CORS 配置
- [x] Rate Limiting (Redis)

---

## 📊 监控设置

### 推荐工具
- **错误监控**: Sentry
- **性能监控**: Vercel Analytics
- **用户分析**: Google Analytics 4
- **日志管理**: LogRocket

### 环境变量
```env
# Sentry (可选)
SENTRY_DSN="your-sentry-dsn"

# GA4 (可选)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## 🚀 推荐部署架构

```
┌─────────────────────────────────────┐
│           Cloudflare CDN             │
│         (全球 CDN + DDoS)            │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│              Vercel                  │
│         (Next.js 应用)               │
│                                      │
│  ┌─────────────────────────────┐     │
│  │     Next.js Pages           │     │
│  │  - 用户端 (全球边缘)         │     │
│  │  - 管理后台                  │     │
│  └─────────────────────────────┘     │
└─────────────┬───────────────────────┘
              │
       ┌──────┴──────┐
       ▼             ▼
┌──────────┐   ┌──────────┐
│  Turso   │   │ Upstash  │
│ (SQLite) │   │  Redis   │
│  生产数据库│   │   缓存   │
└──────────┘   └──────────┘
```

---

## 📞 支持

如遇部署问题，请检查：
1. 环境变量是否正确配置
2. 数据库迁移是否完成
3. API 路由是否正常响应
4. 日志错误信息

---

**祝部署顺利！** 🚀
