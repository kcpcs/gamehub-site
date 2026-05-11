# GameHub 后端建设详细拆解报告

**分析日期**: 2026-05-10
**分析深度**: 完整代码审计
**项目路径**: `F:\国外游戏站\site\`

---

## 📊 一、项目实际状态总览

### 1.1 Lib库实现状态

| 文件 | 状态 | 实现程度 | 备注 |
|-----|------|---------|------|
| `src/lib/db.ts` | ✅ 完整 | 100% | Prisma Client单例模式，配置完善 |
| `src/lib/redis.ts` | ✅ 完整 | 100% | 包含Mock实现，支持所有Redis操作 |
| `src/lib/auth.ts` | ⚠️ 基础 | 60% | 已有Google OAuth，需添加更多providers |
| `src/lib/algolia.ts` | ❌ 骨架 | 10% | 仅有类型定义，需要完整实现 |
| `src/lib/igdb.ts` | ❌ 骨架 | 10% | 仅有类型定义，需要完整实现 |
| `src/lib/steam.ts` | ❌ 骨架 | 10% | 仅有类型定义，需要完整实现 |
| `src/lib/utils.ts` | ✅ 完整 | 100% | 工具函数完善 |

### 1.2 API路由实现状态

| 路由 | 方法 | 状态 | 实现程度 | 缓存 | 错误处理 |
|-----|------|------|---------|------|---------|
| `/api/games` | GET | ✅ 完整 | 95% | ✅ 5分钟 | ✅ 完善 |
| `/api/games/[slug]` | GET | ✅ 完整 | 95% | ✅ 10分钟 | ✅ 完善 |
| `/api/codes/[game]` | GET/POST | ✅ 完整 | 95% | ✅ 2分钟 | ✅ 完善 |
| `/api/guides` | GET | ✅ 完整 | 95% | ✅ 5分钟 | ✅ 完善 |
| `/api/guides/[slug]` | GET | ✅ 完整 | 95% | ✅ 10分钟 | ✅ 完善 |
| `/api/tierlist/[game]` | GET | ✅ 完整 | 90% | ✅ 5分钟 | ✅ 完善 |
| `/api/tierlist/vote` | POST | ⚠️ 待检查 | - | ❌ | ⚠️ |
| `/api/search` | GET | ✅ 完整 | 90% | ✅ 5分钟 | ✅ 完善 |
| `/api/auth/[...nextauth]` | GET/POST | ⚠️ 基础 | 60% | ❌ | ✅ 基础 |
| `/api/subscribe` | POST | ⚠️ 待检查 | - | ❌ | ⚠️ |

### 1.3 数据库状态

| 项目 | 状态 | 备注 |
|-----|------|------|
| Prisma Schema | ✅ 完整 | 7张核心表，关系设计完善 |
| 数据库初始化 | ❌ 未完成 | 无migration，无种子数据 |
| 索引配置 | ✅ 完整 | 所有需要的地方都有索引 |

---

## 🎯 二、详细任务拆解

### 任务A: 数据库初始化（必须优先完成）

#### A1: 环境配置
**前置条件**: 无
**预计时间**: 10分钟
**负责模型**: Claude Haiku

**执行步骤**:
```powershell
# 1. 复制配置文件
cd F:\国外游戏站\site
copy .env.example .env.local

# 2. 修改 .env.local
# 设置 DATABASE_URL="file:./dev.db"
```

**验证命令**:
```bash
# 检查文件存在
dir .env.local
```

---

#### A2: 生成Prisma Client
**前置条件**: 任务A1完成
**预计时间**: 5分钟
**负责模型**: Claude Haiku

**执行步骤**:
```powershell
# 1. 生成Prisma Client
npx prisma generate

# 2. 创建本地SQLite数据库
npx prisma db push
```

**验证命令**:
```bash
# 检查dev.db文件是否创建
dir dev.db

# 打开数据库可视化工具
npx prisma studio
```

---

#### A3: 创建种子数据脚本
**前置条件**: 任务A2完成
**预计时间**: 30分钟
**负责模型**: Claude Sonnet 4

**需要创建的文件**: `src/lib/seed.ts`

**执行步骤**:
1. 创建 `src/lib/seed.ts`
2. 实现以下种子数据：
   - 10个热门游戏（Genshin Impact, Valorant, Elden Ring等）
   - 每游戏3-5篇攻略
   - 每游戏5-10个兑换码
   - 1个测试用户
3. 运行种子脚本

**种子数据示例代码**:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 创建游戏
  const genshin = await prisma.game.create({
    data: {
      slug: 'genshin-impact',
      name: 'Genshin Impact',
      cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xhc.jpg',
      platforms: ['PC', 'PS5', 'Mobile'],
      genres: ['RPG', 'Action', 'Adventure'],
      tags: ['open world', 'anime', 'gacha'],
      guide_count: 0,
      code_count: 0,
      score_opencritic: 81,
    }
  })

  // 创建攻略
  await prisma.article.create({
    data: {
      slug: 'genshin-impact-complete-guide',
      title: 'Complete Beginner\'s Guide to Genshin Impact',
      article_type: 'guide',
      status: 'published',
      source_type: 'ai',
      game_id: genshin.id,
      cover_url: 'https://picsum.photos/seed/genshin-guide/1200/630',
      cover_alt: 'Genshin Impact Guide',
      content: '# Introduction\n\nWelcome to Teyvat...',
      excerpt: 'Master the basics of Genshin Impact with this comprehensive guide.',
      read_time: 15,
      seo_title: 'Genshin Impact Beginner Guide | GameHub',
      seo_description: 'Complete beginner guide for Genshin Impact',
      published_at: new Date(),
    }
  })

  // 创建兑换码
  await prisma.gameCode.create({
    data: {
      code: 'GENSHINGIFT',
      game_id: genshin.id,
      reward_desc: '60 Primogems + 5 Hero Wit',
      status: 'active',
      source: 'official',
      expires_at: new Date('2026-12-31'),
    }
  })

  console.log('✅ Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

**运行命令**:
```bash
npx tsx src/lib/seed.ts
```

---

### 任务B: Lib库完善

#### B1: 完善 algolia.ts
**前置条件**: 任务A1完成
**预计时间**: 45分钟
**负责模型**: Claude Sonnet 4

**当前状态**: 仅有类型定义
**目标状态**: 完整的Algolia搜索实现

**需要实现的功能**:
1. 检查环境变量是否存在
2. 如果存在，初始化Algolia客户端
3. 如果不存在，返回Mock搜索结果
4. 实现以下函数：
   - `searchGames(query: string): Promise<SearchHit[]>`
   - `searchGuides(query: string): Promise<SearchHit[]>`
   - `indexGame(game: Game): Promise<void>`
   - `indexArticle(article: Article): Promise<void>`

**完整代码示例**:
```typescript
import { algoliasearch, SearchIndex } from 'algoliasearch'

// 类型定义
interface SearchHit {
  objectID: string
  type: 'game' | 'guide'
  slug: string
  title: string
  image_url: string
  excerpt?: string
  game_name?: string
  platform?: string[]
  genre?: string[]
}

// 环境检查
const hasAlgoliaConfig = 
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && 
  process.env.ALGOLIA_ADMIN_KEY

// 初始化客户端
let algoliaIndex: SearchIndex | null = null

if (hasAlgoliaConfig) {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
  )
  algoliaIndex = client.initIndex('gamehub')
}

// Mock搜索结果
class MockAlgoliaSearch {
  async searchGames(query: string): Promise<SearchHit[]> {
    // 返回空结果，提示用户配置Algolia
    console.warn('[Algolia] Not configured, returning empty results')
    return []
  }

  async searchGuides(query: string): Promise<SearchHit[]> {
    console.warn('[Algolia] Not configured, returning empty results')
    return []
  }

  async indexGame(game: any): Promise<void> {
    if (!algoliaIndex) {
      console.warn('[Algolia] Not configured, skipping indexing')
      return
    }
    await algoliaIndex.saveObject({
      objectID: `game-${game.id}`,
      type: 'game',
      slug: game.slug,
      title: game.name,
      image_url: game.cover_url,
      platform: game.platforms,
      genre: game.genres,
    })
  }

  async indexArticle(article: any): Promise<void> {
    if (!algoliaIndex) {
      console.warn('[Algolia] Not configured, skipping indexing')
      return
    }
    await algoliaIndex.saveObject({
      objectID: `article-${article.id}`,
      type: 'guide',
      slug: article.slug,
      title: article.title,
      image_url: article.cover_url,
      excerpt: article.excerpt,
    })
  }
}

export const algolia = new MockAlgoliaSearch()
```

---

#### B2: 完善 igdb.ts
**前置条件**: 任务A1完成
**预计时间**: 45分钟
**负责模型**: Claude Sonnet 4

**当前状态**: 仅有类型定义
**目标状态**: 完整的IGDB API集成

**需要实现的功能**:
1. IGDB API认证（OAuth）
2. 获取游戏详情
3. 搜索游戏
4. 获取游戏截图
5. 获取游戏评分

**完整代码示例**:
```typescript
// IGDB API 配置
const IGDB_BASE_URL = 'https://api.igdb.com/v4'
const TWITCH_CLIENT_ID = process.env.IGDB_CLIENT_ID
const TWITCH_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET

// OAuth Token管理
let accessToken: string | null = null
let tokenExpiresAt: number = 0

async function getAccessToken(): Promise<string> {
  // 检查缓存
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken
  }

  // 获取新token
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID!,
      client_secret: TWITCH_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  })

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000

  return accessToken!
}

// IGDB API请求封装
async function igdbRequest<T>(
  endpoint: string,
  body: string
): Promise<T> {
  const token = await getAccessToken()

  const response = await fetch(`${IGDB_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`IGDB API Error: ${response.status}`)
  }

  return response.json()
}

// 游戏搜索
export async function searchIGDBGames(query: string, limit = 10): Promise<any[]> {
  const fields = 'id, name, slug, cover.url, platforms.name, genres.name, summary, url'
  const body = `
    search "${query}";
    fields ${fields};
    limit ${limit};
  `

  return igdbRequest(endpoint, body)
}

// 获取游戏详情
export async function getIGDBGame(igdbId: number): Promise<any> {
  const fields = 'id, name, slug, cover.url, platforms.name, genres.name, summary, url, involved_companies.company.name'
  const body = `
    where id = ${igdbId};
    fields ${fields};
    limit 1;
  `

  const results = await igdbRequest(endpoint, body)
  return results[0] || null
}

// 获取热门游戏
export async function getTrendingGames(limit = 20): Promise<any[]> {
  const fields = 'id, name, slug, cover.url, platforms.name, genres.name'
  const body = `
    sort popularity desc;
    fields ${fields};
    limit ${limit};
  `

  return igdbRequest(endpoint, body)
}

// Mock实现（无凭证时使用）
class MockIGDB {
  async searchGames(query: string): Promise<any[]> {
    console.warn('[IGDB] Not configured, returning empty results')
    return []
  }

  async getGame(igdbId: number): Promise<any> {
    console.warn('[IGDB] Not configured')
    return null
  }

  async getTrendingGames(): Promise<any[]> {
    console.warn('[IGDB] Not configured')
    return []
  }
}

export const igdb = hasIGDBConfig 
  ? { searchGames, getGame, getTrendingGames }
  : new MockIGDB()
```

---

#### B3: 完善 steam.ts
**前置条件**: 任务A1完成
**预计时间**: 45分钟
**负责模型**: Claude Sonnet 4

**当前状态**: 仅有类型定义
**目标状态**: 完整的Steam API集成

**需要实现的功能**:
1. Steam API密钥配置
2. 获取游戏详情
3. 获取游戏评论
4. 获取游戏统计数据

**完整代码示例**:
```typescript
const STEAM_API_KEY = process.env.STEAM_API_KEY
const STEAM_BASE_URL = 'https://api.steampowered.com'

// 获取Steam游戏详情
export async function getSteamGameDetails(appId: number): Promise<any> {
  if (!STEAM_API_KEY) {
    console.warn('[Steam] API key not configured')
    return null
  }

  const url = `${STEAM_BASE_URL}/IStoreService/GetAppList/v1/?key=${STEAM_API_KEY}&appid=${appId}`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Steam API Error: ${response.status}`)
  }

  return response.json()
}

// 获取游戏评论
export async function getSteamReviews(appId: number): Promise<any> {
  if (!STEAM_API_KEY) {
    return null
  }

  const url = `${STEAM_BASE_URL}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${appId}&format=json`
  const response = await fetch(url)
  
  if (!response.ok) {
    return null
  }

  return response.json()
}

// Mock实现
class MockSteam {
  async getGameDetails(appId: number): Promise<any> {
    console.warn('[Steam] Not configured')
    return null
  }

  async getReviews(appId: number): Promise<any> {
    console.warn('[Steam] Not configured')
    return null
  }
}

export const steam = STEAM_API_KEY 
  ? { getGameDetails, getReviews }
  : new MockSteam()
```

---

#### B4: 完善 auth.ts
**前置条件**: 任务A1完成
**预计时间**: 1小时
**负责模型**: Claude Opus 4

**当前状态**: 仅有Google OAuth
**目标状态**: 完整的认证系统（添加GitHub、Credentials）

**需要添加的功能**:
1. GitHub OAuth Provider
2. Email/Password Credentials Provider
3. 密码哈希（bcrypt）
4. 用户注册endpoint
5. JWT callbacks完善

**完整代码示例**:
```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),

    // Email/Password Credentials
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password')
        }

        // 查找用户
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('User not found')
        }

        // 验证密码
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash || ''
        )

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.avatar,
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },

    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // 创建或更新用户
        const existingUser = await db.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email!,
              username: user.name || user.email!.split('@')[0],
              avatar: user.image,
              password_hash: null, // OAuth用户无密码
            }
          })
        }
      }
      return true
    }
  },

  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
}

export default NextAuth(authOptions)
```

---

### 任务C: API路由完善

#### C1: 完善 /api/tierlist/vote
**前置条件**: 任务A3完成（需要用户）
**预计时间**: 30分钟
**负责模型**: Claude Sonnet 4

**需要实现的逻辑**:
1. 获取用户session
2. 验证用户已登录
3. 验证投票数据
4. 创建或更新投票记录
5. 更新TierList的总票数
6. 清除缓存

**完整代码示例**:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { auth } from '@/lib/auth'
import type { ApiResponse } from '@/types'

/**
 * POST /api/tierlist/vote
 * Body: { tier_list_id: string, entry_id: string, grade: 'S'|'A'|'B'|'C'|'D'|'F' }
 * Authenticated users only
 */
export async function POST(req: NextRequest) {
  try {
    // 1. 获取当前用户session
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // 2. 解析请求体
    const body = await req.json()
    const { tier_list_id, entry_id, grade } = body

    // 3. 验证必填字段
    if (!tier_list_id || !entry_id || !grade) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // 4. 验证grade值
    const validGrades = ['S', 'A', 'B', 'C', 'D', 'F']
    if (!validGrades.includes(grade)) {
      return NextResponse.json(
        { success: false, error: 'Invalid grade', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // 5. 创建或更新投票
    const vote = await db.tierVote.upsert({
      where: {
        entry_id_user_id: {
          entry_id,
          user_id: session.user.id,
        }
      },
      create: {
        tier_list_id,
        entry_id,
        user_id: session.user.id,
        grade,
      },
      update: {
        grade,
      },
    })

    // 6. 更新entry的投票统计
    const entryStats = await db.tierVote.aggregate({
      where: { entry_id },
      _count: { grade: true },
      _avg: { grade: true },
    })

    await db.tierEntry.update({
      where: { id: entry_id },
      data: {
        vote_count: entryStats._count.grade,
        avg_score: entryStats._avg.grade || 3,
      },
    })

    // 7. 更新tierlist的总票数
    await db.tierList.update({
      where: { id: tier_list_id },
      data: {
        total_votes: { increment: 1 },
      },
    })

    // 8. 清除缓存
    const tierList = await db.tierList.findUnique({
      where: { id: tier_list_id },
      select: { game_id: true, category: true },
    })

    if (tierList) {
      const game = await db.game.findUnique({
        where: { id: tierList.game_id },
        select: { slug: true },
      })
      if (game) {
        await redis.del(`api:tierlist:${game.slug}:${tierList.category}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: vote,
    })

  } catch (err) {
    console.error('[POST /api/tierlist/vote]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
```

---

#### C2: 完善 /api/subscribe
**前置条件**: 任务A1完成（需要ConvertKit配置）
**预计时间**: 20分钟
**负责模型**: Claude Haiku

**需要实现的逻辑**:
1. 验证邮箱格式
2. 调用ConvertKit API
3. 存储订阅记录到数据库
4. 返回成功响应

**完整代码示例**:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID

/**
 * POST /api/subscribe
 * Body: { email: string, name?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name } = body

    // 1. 验证邮箱
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // 2. 调用ConvertKit API（如果有配置）
    if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
      await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email,
          first_name: name || '',
        }),
      })
    } else {
      console.warn('[Subscribe] ConvertKit not configured')
    }

    // 3. 存储到数据库（可选，用于自己的订阅列表）
    await db.subscriber.upsert({
      where: { email },
      create: { email, name: name || null },
      update: { name: name || null },
    })

    // 4. 设置cookie标记已订阅（7天）
    const response = NextResponse.json({
      success: true,
      message: 'Subscribed successfully',
    })

    response.cookies.set('subscribed', 'true', {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response

  } catch (err) {
    console.error('[POST /api/subscribe]', err)
    return NextResponse.json(
      { success: false, error: 'Subscription failed', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
```

---

## 📋 三、执行检查清单

### Phase A: 数据库初始化
- [ ] A1: 创建.env.local配置文件
- [ ] A2: 运行prisma generate和prisma db push
- [ ] A3: 创建并运行种子数据脚本

### Phase B: Lib库完善
- [ ] B1: 完善algolia.ts
- [ ] B2: 完善igdb.ts
- [ ] B3: 完善steam.ts
- [ ] B4: 完善auth.ts

### Phase C: API完善
- [ ] C1: 完善/api/tierlist/vote
- [ ] C2: 完善/api/subscribe

### 验证测试
- [ ] GET /api/games 返回数据
- [ ] GET /api/codes/genshin-impact 返回数据
- [ ] GET /api/guides 返回数据
- [ ] GET /api/search?q=genshin 返回数据
- [ ] 首页显示真实数据库数据

---

## 🚀 四、推荐执行顺序

```
1. A1 → A2 → A3 (数据库初始化 - 2小时)
   ↓
2. B1 → B2 → B3 (外部API库 - 2小时)
   ↓
3. B4 (认证系统 - 1小时)
   ↓
4. C1 → C2 (API完善 - 1小时)
   ↓
5. 端到端测试 (1小时)
```

**预计总时间**: 7-8小时

---

## 📞 五、常见问题排查

### 问题1: Prisma Client 生成失败
**原因**: 数据库URL配置错误
**解决**: 检查.env.local中的DATABASE_URL格式
```env
DATABASE_URL="file:./dev.db"
```

### 问题2: Redis Mock不工作
**原因**: 可能是内存Map在热重载时丢失
**解决**: 这是正常现象，测试时请重启开发服务器

### 问题3: OAuth登录失败
**原因**: 环境变量未配置
**解决**: 添加Google/GitHub OAuth凭证到.env.local
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 问题4: 数据库查询返回空
**原因**: 数据库没有种子数据
**解决**: 运行 `npx tsx src/lib/seed.ts`

---

**报告生成时间**: 2026-05-10
**分析方法**: 完整代码审计
