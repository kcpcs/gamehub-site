# GameHub 后端建设 - 快速执行提示词

**创建日期**: 2026-05-10
**文档位置**: `F:\国外游戏站\site\BACKEND_DETAILED_ANALYSIS.md`（详细版）
**执行目标**: 完成后端基础设施，让网站可以运行真实数据
**预计时间**: 4-6小时

---

## ⚡ 项目好消息：后端已经相当完整！

经过详细分析，我发现项目后端实际上已经相当完善了：

✅ **已完整实现**:
- `src/lib/db.ts` - Prisma客户端（100%完成）
- `src/lib/redis.ts` - Redis缓存+Mock实现（100%完成）
- `/api/games` - 游戏列表API（95%完成）
- `/api/games/[slug]` - 游戏详情API（95%完成）
- `/api/codes/[game]` - 兑换码API（95%完成）
- `/api/guides` - 攻略列表API（95%完成）
- `/api/guides/[slug]` - 攻略详情API（95%完成）
- `/api/tierlist/[game]` - Tier List API（90%完成）
- `/api/search` - 搜索API（90%完成）

❌ **需要实现**:
- 数据库初始化和种子数据
- `src/lib/algolia.ts` - 搜索集成
- `src/lib/igdb.ts` - IGDB API
- `src/lib/steam.ts` - Steam API
- `src/lib/auth.ts` - 完善认证（添加GitHub等）
- `/api/tierlist/vote` - 投票API
- `/api/subscribe` - 订阅API

---

## 🎯 新窗口对话 - 快速开始

### 复制以下内容到新窗口：

```
请帮我完成GameHub项目的后端初始化任务。

项目路径：F:\国外游戏站\site\
开发服务器：已运行在 http://localhost:3000

好消息！经过分析，后端大部分代码已经完成，只需要：
1. 初始化数据库
2. 填充种子数据
3. 完善剩余的lib库

请按以下顺序执行：

## 任务1：环境配置（10分钟）
1. 复制 .env.example 为 .env.local
2. 修改 DATABASE_URL="file:./dev.db"
3. 添加 NEXTAUTH_SECRET="dev-secret-key-at-least-32-chars"

## 任务2：数据库初始化（15分钟）
运行以下命令：
npx prisma generate
npx prisma db push

## 任务3：创建种子数据（30分钟）
请创建 src/lib/seed.ts 文件，包含：
- 5个热门游戏测试数据
- 每个游戏3篇攻略
- 每个游戏5个兑换码
- 1个测试用户

完成后运行：
npx tsx src/lib/seed.ts

## 任务4：完善lib库（1小时）
1. 完善 src/lib/algolia.ts（搜索集成）
2. 完善 src/lib/auth.ts（添加Credentials provider）

## 验证任务
完成后请测试：
- GET http://localhost:3000/api/games
- GET http://localhost:3000/api/codes/genshin-impact

详细说明请查看：BACKEND_DETAILED_ANALYSIS.md
```

---

## 📋 详细任务分解

### 🔴 任务A：数据库初始化（必须先做）

#### A1: 创建.env.local
```powershell
cd F:\国外游戏站\site
copy .env.example .env.local
```

修改.env.local：
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-32-chars-min"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

#### A2: 初始化数据库
```bash
npx prisma generate
npx prisma db push
```

#### A3: 创建种子数据脚本
创建 `src/lib/seed.ts`：
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 创建测试游戏
  const game = await prisma.game.create({
    data: {
      slug: 'genshin-impact',
      name: 'Genshin Impact',
      cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xhc.jpg',
      platforms: ['PC', 'PS5', 'Mobile'],
      genres: ['RPG', 'Action'],
      guide_count: 0,
      code_count: 0,
    }
  })

  // 创建兑换码
  await prisma.gameCode.create({
    data: {
      code: 'GENSHINGIFT',
      game_id: game.id,
      reward_desc: '60 Primogems + 5 Hero Wit',
      status: 'active',
      source: 'official',
    }
  })

  console.log('✅ Seed completed!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

运行：
```bash
npx tsx src/lib/seed.ts
```

---

### 🟡 任务B：完善Lib库

#### B1: algolia.ts
实现搜索功能（查看详细代码：BACKEND_DETAILED_ANALYSIS.md）

#### B2: auth.ts
添加GitHub OAuth和Credentials provider（查看详细代码：BACKEND_DETAILED_ANALYSIS.md）

---

## ✅ 验证清单

完成所有任务后，检查：

- [ ] `npx prisma studio` 可以打开
- [ ] `GET /api/games` 返回游戏列表
- [ ] `GET /api/codes/genshin-impact` 返回兑换码
- [ ] 首页显示数据库中的游戏
- [ ] 开发服务器无报错

---

## 📞 如果遇到问题

1. **"Cannot find module '@prisma/client'"**
   → 运行 `npx prisma generate`

2. **"ENOENT: .env.local not found"**
   → 确保在 `F:\国外游戏站\site\` 目录执行

3. **数据库连接错误**
   → 检查 .env.local 中的 DATABASE_URL

4. **API返回空数据**
   → 运行种子数据脚本

---

详细分析报告位置：`F:\国外游戏站\site\BACKEND_DETAILED_ANALYSIS.md`
