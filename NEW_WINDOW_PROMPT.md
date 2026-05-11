# GameHub 项目 - 新窗口执行提示词

**创建日期**: 2026-05-10
**执行目标**: 完成基础设施配置与数据库初始化
**预计时间**: 30-60分钟

---

## 📋 第一步：项目了解（约5分钟）

### 1.1 阅读关键文档

在开始任何编码之前，请先完整阅读以下文档（按顺序）：

**必须阅读**:
1. `f:\国外游戏站\site\PROJECT_PROGRESS.md` - 了解项目进度
2. `f:\国外游戏站\site\PROJECT_ANALYSIS.md` - 了解项目现状
3. `f:\国外游戏站\site\MODEL_ASSIGNMENT.md` - 理解大模型分工
4. `f:\国外游戏站\site\EXECUTION_PLAN.md` - 理解执行计划

### 1.2 项目基本信息

| 项目 | 详情 |
|-----|------|
| 项目路径 | `F:\国外游戏站\site\` |
| 技术栈 | Next.js 16 · TypeScript · Tailwind CSS · Prisma · SQLite |
| 当前状态 | 🚧 开发中 - 基础设施阶段 |
| 开发服务器 | http://localhost:3000 (已运行) |

---

## 🎯 第二步：明确任务（约2分钟）

### 当前任务：基础设施配置（Phase A）

**优先级 🔴 最高 - 必须立即执行**

#### 任务A1: 创建 .env.local 配置文件
- **负责模型**: Claude Haiku（简单任务）
- **预计时间**: 10分钟
- **前置依赖**: 无

#### 任务A2-A6: Lib库完整实现
- **负责模型**: Claude Opus 4（核心任务）
- **预计时间**: 2-3小时
- **前置依赖**: 任务A1完成

#### 任务A7: 数据库初始化
- **负责模型**: Claude Sonnet 4
- **预计时间**: 1-2小时
- **前置依赖**: 任务A2完成

---

## 🚀 第三步：开始执行（约10分钟）

### 3.1 复制并创建 .env.local

**执行命令**:
```powershell
# 在项目目录执行
cd "F:\国外游戏站\site"
copy .env.example .env.local
```

**修改 .env.local 文件**:
由于这是本地开发环境，修改以下内容：

```env
# Database - 使用SQLite本地开发
DATABASE_URL="file:./dev.db"

# Next Auth - 本地开发配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# Site - 本地配置
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="GameHub"

# Internal API - 本地开发密钥
INTERNAL_API_SECRET="dev-internal-secret-key-12345"
```

### 3.2 验证开发服务器状态

**检查开发服务器是否运行**:
```powershell
# 检查端口3000是否被占用
netstat -ano | findstr :3000
```

如果服务器未运行，启动它：
```powershell
cd "F:\国外游戏站\site"
npm run dev
```

---

## 📝 第四步：详细任务执行指南

### 任务A1: 创建 .env.local（Claude Haiku）

**提示词**:

```
请完成以下任务：

1. 复制 .env.example 为 .env.local
2. 修改 .env.local 中的以下值（仅针对本地开发）:

# Database
DATABASE_URL="file:./dev.db"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="GameHub"

# Internal API
INTERNAL_API_SECRET="dev-internal-secret-key-12345"

3. 其他所有以 "your-" 开头的值保持不变（这些是生产环境需要配置的）

4. 完成后确认文件已创建
```

---

### 任务A2: 完善 lib/db.ts（Claude Opus 4）

**提示词**:

```
请完善 src/lib/db.ts 文件，实现 Prisma Client 单例模式。

当前文件内容可能只是一个骨架，需要添加：

1. 导入 PrismaClient
2. 创建全局单例实例（防止开发模式热重载时创建多个实例）
3. 导出 db 实例供全站使用
4. 添加错误处理

参考实现：

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
```

文件位置: F:\国外游戏站\site\src\lib\db.ts

请先读取当前文件内容，然后进行修改。
```

---

### 任务A3: 完善 lib/redis.ts（Claude Sonnet 4）

**提示词**:

```
请完善 src/lib/redis.ts 文件。

由于用户还没有注册 Upstash Redis，我们需要实现一个带 fallback 的版本：

1. 检查 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN 是否存在
2. 如果存在，使用 @upstash/redis 连接到真实 Redis
3. 如果不存在，使用内存 Map 作为 mock 实现
4. 导出统一的 redis 对象，提供 get/set 方法

参考实现思路：

```typescript
interface RedisInterface {
  get(key: string): Promise<any>
  set(key: string, value: any, options?: { ex?: number }): Promise<void>
}

class MockRedis implements RedisInterface {
  private store = new Map()
  async get(key: string) { return this.store.get(key) }
  async set(key: string, value: any) { this.store.set(key, value) }
}

// 根据环境变量决定使用真实Redis还是Mock
```

文件位置: F:\国外游戏站\site\src\lib\redis.ts

请先读取当前文件内容，然后进行修改。
```

---

### 任务A4: 完善 lib/algolia.ts（Claude Sonnet 4）

**提示词**:

```
请完善 src/lib/algolia.ts 文件。

实现一个带 fallback 的 Algolia 搜索库：

1. 检查环境变量是否存在
2. 如果存在，使用 algoliasearch 客户端
3. 如果不存在，返回空的搜索结果
4. 导出搜索函数

文件位置: F:\国外游戏站\site\src\lib\algolia.ts

请先读取当前文件内容，然后进行修改。
```

---

### 任务A5: 完善 lib/igdb.ts 和 lib/steam.ts（Claude Sonnet 4）

**提示词**:

```
请完善以下两个文件：

1. src/lib/igdb.ts - IGDB游戏数据API
2. src/lib/steam.ts - Steam游戏数据API

两个文件都实现为带 mock 数据的版本：

1. 检查环境变量
2. 如果有凭证，实现真实API调用
3. 如果没有凭证，返回模拟数据
4. 导出获取游戏信息的函数

文件位置:
- F:\国外游戏站\site\src\lib\igdb.ts
- F:\国外游戏站\site\src\lib\steam.ts

请先读取当前文件内容，然后进行修改。
```

---

### 任务A6: 完善 lib/auth.ts（Claude Opus 4）

**提示词**:

```
请完善 src/lib/auth.ts 文件，配置 NextAuth。

需要实现：
1. 导入 NextAuth
2. 配置 Google OAuth provider（使用环境变量）
3. 配置 GitHub OAuth provider（可选，作为备选）
4. 设置 session strategy
5. 配置 callbacks

参考结构：

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // 可选：添加 GitHub
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export default NextAuth(authOptions)
```

文件位置: F:\国外游戏站\site\src\lib\auth.ts

请先读取当前文件内容，然后进行修改。
```

---

### 任务A7: 数据库初始化（Claude Sonnet 4）

**提示词**:

```
请完成数据库初始化任务：

1. 确保 .env.local 已创建并包含 DATABASE_URL="file:./dev.db"
2. 运行 Prisma 命令创建 SQLite 数据库:

```bash
cd F:\国外游戏站\site
npx prisma generate
npx prisma db push
```

3. 这会根据 prisma/schema.prisma 创建本地数据库文件 dev.db

4. 验证数据库文件已创建

5. （可选）创建种子数据脚本 src/lib/seed.ts 填充测试数据

注意：
- 如果遇到错误，先运行 `npx prisma validate` 检查 schema
- 确保在正确的目录执行命令
```

---

## ✅ 第五步：验证任务完成（约5分钟）

### 验证清单

完成每个任务后，检查以下内容：

#### 任务A1 验证
- [ ] .env.local 文件存在于 `F:\国外游戏站\site\.env.local`
- [ ] 文件包含 DATABASE_URL="file:./dev.db"
- [ ] 文件包含 NEXTAUTH_URL="http://localhost:3000"

#### 任务A2 验证
- [ ] 运行 `node -e "require('./src/lib/db')"` 无报错
- [ ] 可以导入 db 对象

#### 任务A7 验证
- [ ] dev.db 文件存在于 `F:\国外游戏站\site\dev.db`
- [ ] 运行 `npx prisma studio` 可以打开数据库可视化工具

---

## 🎯 成功标准

所有任务完成的标准：

1. ✅ .env.local 已创建并配置正确
2. ✅ 所有 lib 文件可以正常导入
3. ✅ 数据库 dev.db 已创建
4. ✅ 开发服务器仍然运行在 http://localhost:3000
5. ✅ 访问网站首页不报错

---

## ⚠️ 常见问题排查

### 问题1: "Cannot find module '@prisma/client'"
**解决**: 运行 `npx prisma generate`

### 问题2: "ENOENT: no such file or directory, open '.env.local'"
**解决**: 确认在正确的目录执行 `copy .env.example .env.local`

### 问题3: 数据库连接错误
**解决**: 确认 .env.local 中的 DATABASE_URL 格式正确

### 问题4: 开发服务器报错
**解决**: 重启开发服务器 `taskkill /F /IM node.exe` 然后 `npm run dev`

---

## 📞 需要帮助？

如果在执行过程中遇到问题：

1. 先查看错误信息
2. 检查文件路径是否正确
3. 确认命令在正确的目录执行
4. 查看 PROJECT_ANALYSIS.md 中的问题分析

---

**提示词结束**
**祝执行顺利！🎉**
