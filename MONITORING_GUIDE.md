# GameHub 监控与告警配置指南

## 📋 目录

1. [Sentry 错误监控](#sentry-错误监控)
2. [网站可用性监控](#网站可用性监控)
3. [服务器资源监控](#服务器资源监控)
4. [Google Analytics 集成](#google-analytics-集成)
5. [告警配置](#告警配置)

---

## 1. Sentry 错误监控

### 1.1 创建 Sentry 项目

1. 访问 [Sentry.io](https://sentry.io/) 并登录
2. 创建新项目，选择 "Next.js" 平台
3. 获取 DSN 密钥

### 1.2 安装依赖

```bash
npm install @sentry/nextjs
```

### 1.3 配置 Sentry

创建 `sentry.client.config.js`：

```javascript
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || '';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

创建 `sentry.server.config.js`：

```javascript
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || '';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

### 1.4 环境变量

在 `.env.production` 中添加：

```env
SENTRY_DSN=your-sentry-dsn
```

---

## 2. 网站可用性监控

### 2.1 使用 UptimeRobot

1. 访问 [UptimeRobot](https://uptimerobot.com/)
2. 创建新监控：
   - 监控类型：HTTP(s)
   - URL：`https://yourdomain.com/api/health`
   - 监控间隔：5分钟
   - 告警方式：邮件、Discord、Slack

### 2.2 健康检查端点

项目已内置 `/api/health` 端点，返回：

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 3. 服务器资源监控

### 3.1 自建服务器监控（Docker Compose）

推荐使用 [cAdvisor](https://github.com/google/cadvisor)：

```yaml
services:
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    restart: unless-stopped
```

### 3.2 Vercel 监控

Vercel 内置监控功能：
- 访问 Vercel Dashboard
- 进入项目 → Analytics
- 查看：请求数、响应时间、错误率

---

## 4. Google Analytics 集成

### 4.1 创建 Analytics 账号

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建新属性（GA4）
3. 获取 Measurement ID

### 4.2 配置 Next.js

安装依赖：

```bash
npm install @google-analytics/data
```

在 `src/app/layout.tsx` 中添加：

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
```

### 4.3 环境变量

```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 5. 告警配置

### 5.1 邮件告警

在 `.env.production` 中配置：

```env
ALERT_EMAIL_ENABLED=true
ALERT_EMAIL_RECIPIENTS=admin@gamehub.com,dev@gamehub.com
```

### 5.2 Discord 告警

1. 创建 Discord Webhook
2. 配置环境变量：

```env
ALERT_DISCORD_ENABLED=true
ALERT_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 5.3 Slack 告警

1. 创建 Slack Webhook
2. 配置环境变量：

```env
ALERT_SLACK_ENABLED=true
ALERT_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## 📊 监控指标

| 指标 | 说明 | 阈值建议 |
|------|------|----------|
| CPU 使用率 | 服务器 CPU 占用 | >80% 告警 |
| 内存使用率 | 服务器内存占用 | >85% 告警 |
| 响应时间 | API 响应时长 | >500ms 告警 |
| 错误率 | 请求错误百分比 | >5% 告警 |
| 可用性 | 网站在线率 | <99.9% 告警 |

---

## ✅ 配置完成

监控配置已就绪！确保以下环境变量已设置：

- `SENTRY_DSN`
- `GOOGLE_ANALYTICS_ID`
- `ALERT_EMAIL_ENABLED` / `ALERT_EMAIL_RECIPIENTS`
- `ALERT_DISCORD_ENABLED` / `ALERT_DISCORD_WEBHOOK_URL`
- `ALERT_SLACK_ENABLED` / `ALERT_SLACK_WEBHOOK_URL`