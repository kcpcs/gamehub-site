# 🚀 GameHub - Vercel 部署指南

## 快速开始

### 第一步：准备 Git 仓库

```bash
cd f:\国外游戏站\site

# 检查 Git 状态
git status

# 添加所有文件
git add .

# 提交
git commit -m "Initial deployment commit"
```

### 第二步：安装 Vercel CLI

```bash
npm install -g vercel
```

### 第三步：登录 Vercel

```bash
vercel login
```

### 第四步：部署（预览环境）

```bash
vercel
```

跟随提示操作：
- Set up and deploy: `Y`
- Link to existing project: `N`
- Project name: `gamehub` (或你喜欢的名字)
- In which directory is your code located: `./`
- Want to modify these settings? `N`

### 第五步：部署到生产环境

```bash
vercel --prod
```

---

## 环境变量配置

部署后，需要在 Vercel 项目设置中添加环境变量：

### 必需的环境变量（最小化配置）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | 数据库连接 | `file:./dev.db` (先用 SQLite) |
| `NEXTAUTH_SECRET` | 认证密钥 | 生成一个随机字符串 |
| `NEXTAUTH_URL` | 认证回调 URL | `https://your-project.vercel.app` |

### 生成 NEXTAUTH_SECRET

```bash
# 在命令行运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 添加环境变量到 Vercel

1. 访问 https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加上述环境变量
5. 重新部署

---

## 使用 Turso 数据库（推荐用于生产）

### 1. 创建 Turso 账号

访问 https://turso.tech 注册

### 2. 创建数据库

```bash
# 安装 Turso CLI
# Windows: 使用 npm
npm install -g turso-cli

# 登录
turso auth login

# 创建数据库
turso db create gamehub-db

# 获取数据库 URL
turso db show gamehub-db --url
```

### 3. 更新 Prisma Schema

确保 `prisma/schema.prisma` 中的 datasource 配置正确。

---

## 部署后检查清单

- [ ] 首页可以正常访问
- [ ] 游戏列表页面可以正常显示
- [ ] API 健康检查 `/api/health` 返回 200
- [ ] Sitemap 可以访问 `/sitemap.xml`
- [ ] robots.txt 可以访问 `/robots.txt`

---

## 故障排除

### 构建失败

```bash
# 本地先测试构建
npm run build
```

### 数据库连接问题

确保 `DATABASE_URL` 环境变量正确设置。

### 认证问题

确保 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL` 正确设置。

---

## 下一步

部署成功后，你可以：

1. 配置自定义域名
2. 添加更多环境变量（Stripe, Algolia, Anthropic 等）
3. 设置 Analytics
4. 配置 Webhooks

---

## 获取帮助

- Vercel 文档: https://vercel.com/docs
- Next.js 部署: https://nextjs.org/docs/deployment
