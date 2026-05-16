# GameHub 一键上线指南

## 🚀 快速开始

本文档将指导您完成 GameHub 网站的上线部署。

---

## 一、部署方案选择

### 方案 A：Vercel + Supabase + Upstash（推荐）

**优点：**
- ✅ 零服务器管理
- ✅ 自动扩缩容
- ✅ 全球 CDN
- ✅ 免费额度可用

**适合：** 快速上线、低运维成本

### 方案 B：Docker + 自建服务器

**优点：**
- ✅ 完全可控
- ✅ 灵活定制
- ✅ 适合已有服务器资源

**适合：** 需要高度定制、已有基础设施

---

## 二、方案 A：Vercel 部署

### 步骤 1：准备 Turso 数据库

1. 访问 [Turso](https://turso.tech/)
2. 创建新数据库
3. 获取数据库 URL 和认证令牌

### 步骤 2：准备 Upstash Redis

1. 访问 [Upstash](https://upstash.com/)
2. 创建新 Redis 数据库
3. 获取 REST URL 和 Token

### 步骤 3：配置 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/)
2. 导入项目仓库
3. 配置环境变量：

```env
DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token
NEXTAUTH_SECRET=generate-a-secret
NEXTAUTH_URL=https://your-domain.vercel.app
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

4. 点击 "Deploy"

### 步骤 4：配置域名

1. 在 Vercel 中添加自定义域名
2. 更新 DNS 记录

---

## 三、方案 B：Docker 部署

### 步骤 1：准备服务器

推荐配置：
- CPU: 2核以上
- 内存: 4GB以上
- 存储: 20GB以上
- 操作系统: Ubuntu 22.04

### 步骤 2：安装依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y
```

### 步骤 3：配置环境变量

复制 `.env.production` 并填写真实值：

```bash
cp .env.production .env
nano .env
```

### 步骤 4：启动服务

```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f
```

### 步骤 5：配置反向代理（Nginx）

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 步骤 6：配置 SSL（Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 四、数据迁移

### 步骤 1：导出本地数据

```bash
cd F:\国外游戏站\site
node scripts/import-data.mjs
```

### 步骤 2：验证数据

```bash
node scripts/validate-data.mjs
```

---

## 五、启动自动化运营

### 启动定时任务

```bash
# 开发环境测试
npm run operate:daily

# 启动定时任务（每天凌晨2点）
npm run operate:start

# 手动触发一次
npm run operate:start -- --run-now
```

### PM2 服务化（推荐）

```bash
npm install -g pm2

pm2 start npm --name "gamehub-operate" -- run operate:start

pm2 save
pm2 startup
```

---

## 六、监控配置

### 配置 Sentry

1. 访问 [Sentry.io](https://sentry.io/)
2. 创建项目获取 DSN
3. 添加到环境变量：

```env
SENTRY_DSN=your-sentry-dsn
```

### 配置 Google Analytics

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建 GA4 属性
3. 添加到环境变量：

```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 七、SEO 设置

### 提交搜索引擎

1. **Google Search Console**:
   - 添加站点：https://search.google.com/search-console/
   - 提交 sitemap: `https://yourdomain.com/sitemap.xml`

2. **Bing Webmaster Tools**:
   - 添加站点：https://www.bing.com/webmasters/

---

## 八、上线验证

### 检查清单

- [ ] ✅ 网站可访问（首页加载正常）
- [ ] ✅ API 健康检查：`https://yourdomain.com/api/health`
- [ ] ✅ 数据库连接正常
- [ ] ✅ 用户注册/登录功能
- [ ] ✅ 游戏列表加载
- [ ] ✅ 兑换码功能
- [ ] ✅ 定时任务运行正常
- [ ] ✅ SSL 证书有效
- [ ] ✅ SEO 标签正确

### 性能检查

```bash
# 使用 Lighthouse 检查
npm run build
npx lighthouse https://yourdomain.com --view
```

---

## 九、自动化运营说明

### 每日自动执行任务

| 时间 | 任务 |
|------|------|
| 凌晨 2:00 | 自动审核用户提交的兑换码 |
| 凌晨 2:00 | 检查并标记过期兑换码 |
| 凌晨 2:00 | 更新首页内容 |
| 凌晨 2:00 | 更新 SEO lastModified |
| 凌晨 2:00 | 清理测试数据 |
| 凌晨 2:00 | 自动 Git 备份 |
| 凌晨 2:00 | 数据库备份 |

### 手动运行命令

```bash
# 手动运行每日任务
npm run operate:daily

# 启动定时任务
npm run operate:start

# 验证数据
node scripts/validate-data.mjs

# 数据库备份
node scripts/backup-db.mjs
```

---

## 🎉 上线完成！

您的 GameHub 网站现已成功部署！

**后续维护：**
- ✅ 定期检查日志
- ✅ 监控服务器资源
- ✅ 更新内容
- ✅ 响应用户反馈

如有问题，请查看项目文档或联系开发团队。

---

## 📞 技术支持

- 文档地址：`/docs/`
- API 文档：`/api/docs`
- 管理后台：`/admin`