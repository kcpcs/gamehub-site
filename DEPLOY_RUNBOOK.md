# GameHub Production Deployment Runbook

## 1. 环境变量清单

### 1.1 必需变量

| 变量名 | 获取来源 | 说明 |
|--------|----------|------|
| `ANTHROPIC_API_KEY` | [jiekou.ai](https://jiekou.ai/) | Claude API 密钥 |
| `DATABASE_URL` | [Neon](https://neon.tech/) | PostgreSQL 数据库连接字符串 |
| `UPSTASH_REDIS_REST_URL` | [Upstash](https://console.upstash.com/) | Redis REST API URL |
| `UPSTASH_REDIS_REST_TOKEN` | [Upstash](https://console.upstash.com/) | Redis API 令牌 |
| `NEXTAUTH_SECRET` | 生成命令: `openssl rand -base64 32` | NextAuth 会话加密密钥 |
| `NEXTAUTH_URL` | 你的生产域名 | 完整站点 URL（无末尾斜杠） |
| `INTERNAL_API_SECRET` | 生成命令: `openssl rand -base64 32` | 内部 API 认证密钥 |
| `ADMIN_API_KEY` | 生成命令: `openssl rand -base64 32` | 管理员 API 密钥 |

### 1.2 可选变量

| 变量名 | 获取来源 | 说明 |
|--------|----------|------|
| `YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) | YouTube 数据 API（无则禁用视频功能） |
| `ALGOLIA_APP_ID` | [Algolia](https://www.algolia.com/) | Algolia 搜索应用 ID |
| `ALGOLIA_ADMIN_KEY` | [Algolia](https://www.algolia.com/) | Algolia 管理员密钥 |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | [Algolia](https://www.algolia.com/) | Algolia 公开应用 ID |
| `STRIPE_SECRET_KEY` | [Stripe](https://dashboard.stripe.com/) | Stripe 支付密钥 |
| `STRIPE_WEBHOOK_SECRET` | [Stripe](https://dashboard.stripe.com/) | Stripe Webhook 密钥 |
| `SENTRY_DSN` | [Sentry](https://sentry.io/) | 错误追踪 DSN |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com/) | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | [GitHub Settings](https://github.com/settings/developers) | GitHub OAuth |

---

## 2. Neon Postgres 创建步骤

1. 访问 [Neon Console](https://console.neon.tech/)
2. 点击 "New Project"
3. 输入项目名称（如 `gamehub-prod`）
4. 选择地区（推荐离用户最近的区域）
5. 创建后进入项目，复制 `Connection String`（Full URL）
6. 格式示例: `postgresql://username:password@hostname:5432/dbname`

---

## 3. Vercel 项目导入步骤

1. 安装 Vercel CLI: `npm install -g vercel`
2. 登录: `vercel login`
3. 进入项目目录: `cd gamehub/site`
4. 链接项目: `vercel link`
5. 按提示选择或创建项目
6. 配置环境变量:
   ```bash
   vercel env add ANTHROPIC_API_KEY
   vercel env add DATABASE_URL
   vercel env add UPSTASH_REDIS_REST_URL
   vercel env add UPSTASH_REDIS_REST_TOKEN
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add INTERNAL_API_SECRET
   vercel env add ADMIN_API_KEY
   ```

---

## 4. 域名 DNS 配置

### 4.1 基础配置

在域名注册商或 Cloudflare 中添加以下记录：

| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| A | @ | 76.76.21.21 (Vercel IP) | 300 |
| A | @ | 76.76.21.22 (Vercel IP) | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

### 4.2 Vercel 域名配置

1. 在 Vercel 项目中进入 Settings > Domains
2. 添加域名: `yourdomain.com` 和 `www.yourdomain.com`
3. 等待 Vercel 验证 DNS 配置

---

## 5. Cloudflare CDN 配置

### 5.1 DNS Only 模式（推荐）

- **优点**: 简单，无额外延迟，SSL 由 Vercel 管理
- **配置**:
  1. 在 Cloudflare 中添加域名
  2. 复制 Vercel 的 DNS 记录
  3. 设置 SSL/TLS 模式为 "Flexible" 或 "Full"
  4. 关闭 Cloudflare 代理（DNS Only）

### 5.2 代理模式

- **优点**: 更多安全功能（WAF、DDoS 防护）
- **缺点**: 额外延迟，配置复杂
- **配置**:
  1. 在 Cloudflare 中启用 "Proxy status"（橙色云朵）
  2. 设置 SSL/TLS 模式为 "Full (strict)"
  3. 在 Vercel 中配置自定义域名证书

---

## 6. 监控配置

### 6.1 Sentry 启用

1. 创建 [Sentry](https://sentry.io/) 项目
2. 获取 DSN
3. 在 Vercel 中添加环境变量:
   ```bash
   vercel env add SENTRY_DSN
   ```

### 6.2 Vercel Analytics

1. 在 Vercel 项目中进入 Analytics
2. 点击 "Enable"
3. 配置自定义事件（可选）

---

## 7. Smoke Test 命令

部署成功后执行以下测试：

```bash
# 1. 首页健康检查
curl -s -o /dev/null -w "Homepage: HTTP %{http_code}\n" https://yourdomain.com

# 2. API 健康检查
curl -s -o /dev/null -w "Health API: HTTP %{http_code}\n" https://yourdomain.com/api/health

# 3. 游戏列表 API
curl -s -o /dev/null -w "Games API: HTTP %{http_code}\n" https://yourdomain.com/api/games

# 4. 搜索 API
curl -s -o /dev/null -w "Search API: HTTP %{http_code}\n" "https://yourdomain.com/api/search?q=test"

# 5. 页面渲染检查
curl -s https://yourdomain.com | head -5 | grep -q "GameHub" && echo "Page content: OK" || echo "Page content: FAIL"
```

---

## 8. 部署脚本使用

```bash
# 设置项目 ID
export VERCEL_PROJECT_ID="your-project-id"

# 执行部署
bash scripts/deploy-vercel.sh
```

---

## 9. 回滚步骤

```bash
# 查看部署历史
vercel ls

# 回滚到上一个版本
vercel rollback
```