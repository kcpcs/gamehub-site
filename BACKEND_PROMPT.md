# GameHub 后端建设 - 新窗口执行提示词

**创建日期**: 2026-05-10
**执行目标**: 完成后端基础设施、数据库初始化、API完善
**负责模型**: Claude Opus 4（主力）
**预计时间**: 3-5小时

---

## 📊 项目现状总结

### 已完成
- ✅ Next.js 16 项目骨架
- ✅ TypeScript 类型定义完整
- ✅ Prisma Schema 设计完整
- ✅ API 路由骨架已创建
- ✅ 前端页面UI完成（使用静态数据）
- ✅ 开发服务器运行正常

### 未完成（后端核心）
- ❌ .env.local 配置文件
- ❌ Lib库实际实现（仅骨架）
- ❌ 数据库初始化（无migration）
- ❌ API与数据库联调
- ❌ 认证系统实现
- ❌ 缓存系统实现
- ❌ 错误处理完善

---

## 🎯 后端建设任务清单（按优先级）

### 🔴 Phase A: 基础设施（必须立即完成）

| 任务ID | 任务名称 | 负责模型 | 预计时间 | 优先级 |
|-------|---------|---------|---------|--------|
| A1 | 创建 .env.local | Claude Haiku | 10分钟 | 🔴 最高 |
| A2 | 完善 lib/db.ts | Claude Opus 4 | 30分钟 | 🔴 最高 |
| A3 | 完善 lib/redis.ts | Claude Sonnet 4 | 20分钟 | 🔴 最高 |
| A4 | 完善 lib/algolia.ts | Claude Sonnet 4 | 20分钟 | 🟡 高 |
| A5 | 完善 lib/igdb.ts | Claude Sonnet 4 | 20分钟 | 🟡 高 |
| A6 | 完善 lib/auth.ts | Claude Opus 4 | 40分钟 | 🔴 最高 |
| A7 | 数据库初始化 | Claude Sonnet 4 | 30分钟 | 🔴 最高 |

### 🟡 Phase B: API完善（核心功能）

| 任务ID | 任务名称 | 负责模型 | 预计时间 | 优先级 |
|-------|---------|---------|---------|--------|
| B1 | 完善 /api/games | Claude Opus 4 | 40分钟 | 🔴 最高 |
| B2 | 完善 /api/codes/[game] | Claude Opus 4 | 40分钟 | 🔴 最高 |
| B3 | 完善 /api/guides/[slug] | Claude Sonnet 4 | 30分钟 | 🟡 高 |
| B4 | 完善 /api/tierlist | Claude Sonnet 4 | 30分钟 | 🟡 高 |
| B5 | 完善 /api/search | Claude Sonnet 4 | 20分钟 | 🟡 高 |
| B6 | 完善 /api/subscribe | Claude Haiku | 15分钟 | 🟢 中 |

### 🟢 Phase C: 增强功能（后期优化）

| 任务ID | 任务名称 | 负责模型 | 预计时间 | 优先级 |
|-------|---------|---------|---------|--------|
| C1 | 输入验证（Zod） | Claude Sonnet 4 | 30分钟 | 🟢 中 |
| C2 | 错误处理中间件 | Claude Opus 4 | 30分钟 | 🟢 中 |
| C3 | 日志系统 | Claude Haiku | 20分钟 | 🟢 低 |
| C4 | API文档 | Claude Haiku | 30分钟 | 🟢 低 |

---

## 🚀 详细执行步骤

### 第一步：环境准备（5分钟）

#### 1.1 确认项目路径
```powershell
cd "F:\国外游戏站\site"
```

#### 1.2 检查开发服务器
```powershell
# 检查端口3000
netstat -ano | findstr :3000

# 如果未运行，启动服务器
npm run dev
```

#### 1.3 阅读关键文档
- `PROJECT_PROGRESS.md` - 项目进度
- `PROJECT_ANALYSIS.md` - 项目现状
- `EXECUTION_PLAN.md` - 执行计划

---

### 第二步：任务A1 - 创建 .env.local（10分钟）

**执行命令**:
```powershell
copy .env.example .env.local
```

**修改 .env.local 内容**:
```env
# Database - SQLite本地开发
DATABASE_URL="file:./dev.db"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production-32chars"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="GameHub"

# Internal API
INTERNAL_API_SECRET="dev-internal-secret-key-12345678"

# 其他保持 your-xxx 格式（生产环境配置）
```

**验证**:
```powershell
# 检查文件是否存在
dir .env.local
```

---

### 第三步：任务A2 - 完善 lib/db.ts（30分钟）

**提示词**:
```
请完善 src/lib/db.ts 文件，实现 Prisma Client 单例模式。

要求：
1. 导入 PrismaClient
2. 实现全局单例（防止开发模式热重载创建多个实例）
3. 配置日志级别（开发环境显示query/error/warn）
4. 导出 db 实例
5. 添加 TypeScript 类型支持

参考实现：
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
```

文件位置: F:\国外游戏站\site\src\lib\db.ts

请先读取当前文件，然后进行修改。
```

**验证**:
```powershell
# 测试导入
node -e "const { db } = require('./src/lib/db'); console.log('db imported successfully')"
```

---

### 第四步：任务A3 - 完善 lib/redis.ts（20分钟）

**提示词**:
```
请完善 src/lib/redis.ts 文件，实现带 Mock 的 Redis 客户端。

要求：
1. 检查环境变量 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN
2. 如果存在，使用 @upstash/redis 连接真实 Redis
3. 如果不存在，使用内存 Map 作为 Mock 实现
4. 提供统一的 get/set/del 方法
5. 支持过期时间设置

接口定义：
```typescript
interface RedisClient {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: any, options?: { ex?: number }): Promise<void>
  del(key: string): Promise<void>
}
```

Mock实现示例：
```typescript
class MockRedis implements RedisClient {
  private store = new Map<string, { value: any; expires?: number }>()
  
  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key)
    if (!item) return null
    if (item.expires && Date.now() > item.expires) {
      this.store.delete(key)
      return null
    }
    return item.value as T
  }
  
  async set(key: string, value: any, options?: { ex?: number }) {
    this.store.set(key, {
      value,
      expires: options?.ex ? Date.now() + options.ex * 1000 : undefined
    })
  }
  
  async del(key: string) {
    this.store.delete(key)
  }
}
```

文件位置: F:\国外游戏站\site\src\lib\redis.ts

请先读取当前文件，然后进行修改。
```

---

### 第五步：任务A4-A5 - 完善其他lib库（40分钟）

**任务A4 - lib/algolia.ts**:
```
请完善 src/lib/algolia.ts 文件。

要求：
1. 检查 ALGOLIA_APP_ID 和 ALGOLIA_ADMIN_KEY 环境变量
2. 如果存在，使用 algoliasearch 客户端
3. 如果不存在，返回空搜索结果的 Mock
4. 导出 searchGames 和 searchGuides 函数

Mock返回示例：
```typescript
return {
  hits: [],
  nbHits: 0,
  page: 0,
  nbPages: 0,
}
```

文件位置: F:\国外游戏站\site\src\lib\algolia.ts
```

**任务A5 - lib/igdb.ts 和 lib/steam.ts**:
```
请完善以下两个文件：

1. src/lib/igdb.ts - IGDB游戏数据API
2. src/lib/steam.ts - Steam游戏数据API

要求：
1. 检查环境变量
2. 实现真实API调用（如果有凭证）
3. 实现Mock数据返回（如果无凭证）
4. 导出 getGameInfo 和 searchGames 函数

文件位置:
- F:\国外游戏站\site\src\lib\igdb.ts
- F:\国外游戏站\site\src\lib\steam.ts
```

---

### 第六步：任务A6 - 完善 lib/auth.ts（40分钟）

**提示词**:
```
请完善 src/lib/auth.ts 文件，配置 NextAuth.js。

要求：
1. 导入 NextAuth 和相关 providers
2. 配置 Google OAuth Provider
3. 配置 GitHub OAuth Provider（备选）
4. 配置 Credentials Provider（邮箱密码登录）
5. 设置 JWT session strategy
6. 配置 callbacks（jwt, session）
7. 添加类型扩展

参考实现：
```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // 实现邮箱密码登录逻辑
        // 注意：需要实现密码哈希验证
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
```

文件位置: F:\国外游戏站\site\src\lib\auth.ts

请先读取当前文件，然后进行修改。
```

---

### 第七步：任务A7 - 数据库初始化（30分钟）

**执行命令**:
```powershell
# 1. 生成 Prisma Client
npx prisma generate

# 2. 创建 SQLite 数据库和表
npx prisma db push

# 3. 验证数据库
npx prisma studio
```

**创建种子数据脚本** (可选):
```typescript
// src/lib/seed.ts
import { db } from './db'

async function main() {
  // 创建测试游戏
  const game1 = await db.game.create({
    data: {
      slug: 'genshin-impact',
      name: 'Genshin Impact',
      cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xhc.jpg',
      platforms: ['PC', 'PS5', 'Mobile'],
      genres: ['RPG', 'Action'],
      guide_count: 45,
      code_count: 12,
    }
  })
  
  console.log('Seed data created:', game1)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
```

**运行种子脚本**:
```powershell
npx tsx src/lib/seed.ts
```

---

### 第八步：任务B1 - 完善 /api/games（40分钟）

**提示词**:
```
请完善 src/app/api/games/route.ts 文件。

要求：
1. 实现 GET 方法获取游戏列表
2. 支持查询参数：platform, genre, sort, page, limit
3. 实现数据库查询
4. 实现Redis缓存（5分钟过期）
5. 返回标准化的API响应格式
6. 完善错误处理

参考实现：
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const platform = searchParams.get('platform')
  const genre = searchParams.get('genre')
  const sort = searchParams.get('sort') || 'popular'
  const page = Number(searchParams.get('page')) || 1
  const limit = Math.min(Number(searchParams.get('limit')) || 24, 48)
  
  const cacheKey = `games:${platform}:${genre}:${sort}:${page}:${limit}`
  
  try {
    // 检查缓存
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
    
    // 构建查询条件
    const where: any = {}
    if (platform) where.platforms = { has: platform }
    if (genre) where.genres = { has: genre }
    
    // 排序
    const orderBy: any = {}
    switch (sort) {
      case 'newest':
        orderBy.release_date = 'desc'
        break
      case 'rating':
        orderBy.score_opencritic = 'desc'
        break
      default:
        orderBy.guide_count = 'desc'
    }
    
    // 查询数据库
    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.game.count({ where })
    ])
    
    const response = {
      success: true,
      data: {
        games,
        meta: {
          page,
          limit,
          total,
          has_next: page * limit < total
        }
      }
    }
    
    // 设置缓存
    await redis.set(cacheKey, response, { ex: 300 })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/games]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

文件位置: F:\国外游戏站\site\src\app\api\games\route.ts

请先读取当前文件，然后进行修改。
```

---

### 第九步：任务B2 - 完善 /api/codes/[game]（40分钟）

**提示词**:
```
请完善 src/app/api/codes/[game]/route.ts 文件。

要求：
GET方法：
1. 从数据库获取指定游戏的兑换码
2. 分离active和expired代码
3. 返回标准化响应
4. 实现缓存

POST方法：
1. 接收用户提交的新代码
2. 验证必填字段
3. 保存到数据库
4. 返回成功响应

参考实现：
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'

export async function GET(
  req: NextRequest,
  { params }: { params: { game: string } }
) {
  const gameSlug = params.game
  const cacheKey = `codes:${gameSlug}`
  
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
    
    const codes = await db.gameCode.findMany({
      where: { game_slug: gameSlug },
      orderBy: { created_at: 'desc' }
    })
    
    const active_codes = codes.filter(c => c.status === 'active')
    const expired_codes = codes.filter(c => c.status === 'expired')
    
    const response = {
      success: true,
      data: {
        game_slug: gameSlug,
        active_codes,
        expired_codes,
        last_updated: new Date().toISOString()
      }
    }
    
    await redis.set(cacheKey, response, { ex: 120 })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/codes]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { game: string } }
) {
  try {
    const body = await req.json()
    const { code, reward_desc, source_url } = body
    
    if (!code || !reward_desc) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const newCode = await db.gameCode.create({
      data: {
        code,
        game_slug: params.game,
        reward_desc,
        source: 'user',
        source_url,
        status: 'unverified'
      }
    })
    
    // 清除缓存
    await redis.del(`codes:${params.game}`)
    
    return NextResponse.json({
      success: true,
      data: newCode
    })
  } catch (error) {
    console.error('[POST /api/codes]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

文件位置: F:\国外游戏站\site\src\app\api\codes\[game]\route.ts

请先读取当前文件，然后进行修改。
```

---

## ✅ 验证清单

### Phase A 验证
- [ ] .env.local 文件存在
- [ ] `npx prisma studio` 可以打开数据库
- [ ] `node -e "require('./src/lib/db')"` 无报错
- [ ] `node -e "require('./src/lib/redis')"` 无报错
- [ ] `node -e "require('./src/lib/auth')"` 无报错

### Phase B 验证
- [ ] GET http://localhost:3000/api/games 返回数据
- [ ] GET http://localhost:3000/api/codes/genshin-impact 返回数据
- [ ] GET http://localhost:3000/api/guides 返回数据
- [ ] 开发服务器无报错

### 功能验证
- [ ] 首页可以正常访问
- [ ] 游戏库页面显示真实数据
- [ ] 兑换码页面显示真实数据
- [ ] 搜索功能正常工作

---

## ⚠️ 常见问题排查

### 问题1: Prisma Client 未生成
```powershell
npx prisma generate
```

### 问题2: 数据库连接错误
检查 .env.local 中的 DATABASE_URL 格式：
```env
DATABASE_URL="file:./dev.db"
```

### 问题3: Redis 连接错误
这是正常的，因为未配置Upstash。Mock实现会自动启用。

### 问题4: API返回500错误
检查终端日志，确认数据库查询是否正确。

---

## 📞 需要帮助？

如果遇到问题：
1. 检查终端错误日志
2. 查看 PROJECT_ANALYSIS.md
3. 确认所有前置任务已完成
4. 重启开发服务器

---

**提示词结束**
**祝执行顺利！🎉**
