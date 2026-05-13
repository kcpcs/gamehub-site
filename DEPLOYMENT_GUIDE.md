# GameHub 部署准备指南

**创建时间**: 2026-05-13
**负责模型**: Claude Opus 4
**目标平台**: Vercel (推荐)

---

## 🎯 部署平台选择

### 推荐方案: Vercel + Turso + Upstash

| 服务 | 用途 | 免费额度 |
|------|------|----------|
| Vercel | 前端托管 | 无限 |
| Turso | 数据库 | 500 DB/day |
| Upstash | Redis缓存 | 10k/day |
| Resend | 邮件服务 | 3k/month |

---

## 📋 部署前检查清单

### 环境变量配置 (.env.production)

在部署前需要配置的环境变量：

```env
# 基础配置
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# 数据库 (Turso)
DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-change-in-production

# OAuth (可选)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Algolia搜索
NEXT_PUBLIC_ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=

# 外部API
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
STEAM_API_KEY=
ANTHROPIC_API_KEY=

# 邮件
RESEND_API_KEY=
MAILGUN_API_KEY=
CONVERTKIT_API_KEY=

# 广告
NEXT_PUBLIC_ADSENSE_CLIENT=
```

---

## 🚀 Vercel部署步骤

### 步骤1: 准备项目配置

**1. 创建Vercel项目设置**
```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

**2. 配置Vercel项目设置**
- Framework Preset: Next.js
- Root Directory: `./site`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 步骤2: 配置环境变量

在Vercel项目设置中添加所有环境变量，
从 `.env.production` 复制。

### 步骤3: 数据库迁移

**Turso数据库设置**
```bash
# 安装Turso CLI
# Windows
curl -sSfL https://get.tur.so/install.sh | bash

# 登录
turso auth login

# 创建数据库
turso db create gamehub

# 获取数据库URL
turso db show gamehub --url

# 获取认证Token
turso db tokens create gamehub
```

**Prisma迁移**
```bash
# 生成迁移
npx prisma migrate deploy

# 种子数据 (可选)
node prisma/seed.cjs
```

### 步骤4: Redis设置

**Upstash设置**
1. 访问 https://upstash.com
2. 创建Redis数据库
3. 获取 REST URL 和 Token
4. 添加到环境变量

### 步骤5: 构建与部署

```bash
# 本地构建测试
npm run build

# 预览
npm run start

# 部署到Vercel
vercel --prod
```

---

## 📦 部署配置文件

### 已存在 ✅
- `next.config.js` (Next.js配置)
- `prisma/schema.prisma` (数据库Schema)
- `.gitignore` (Git忽略)
- `package.json` (依赖)

### 推荐创建
- `vercel.json` (Vercel配置)
- `.env.production.example` (生产环境示例)

---

## 🎯 部署后检查清单

### 部署后验证
- [ ] 网站正常加载
- [ ] 数据库连接正常
- [ ] API响应正常
- [ ] 图片加载正常
- [ ] SEO标签正确
- [ ] Sitemap可访问
- [ ] Robots.txt可访问
- [ ] Analytics工作正常

---

**部署准备指南完成时间**: 2026-05-13
