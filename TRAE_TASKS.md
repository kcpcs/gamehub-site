# Trae CN 任务分工清单

> **重要规则**
> - 每个任务独立执行，完成一个再开始下一个
> - **严禁修改** `src/types/`、`src/lib/`、`src/app/api/` 下的任何文件
> - **严禁修改** `prisma/schema.prisma`
> - 所有样式使用 CSS 变量（在 `globals.css` 中已定义），禁止使用白色/浅色背景
> - 每个任务完成后告知用户，由用户通知 Claude Code 进行接口联调

---

## T-01 · 首页 UI 实现

**文件：** `src/app/(main)/page.tsx`  
**只能修改这一个文件，其余不动**

---

### 投喂给 Trae CN 的提示词：

```
你是一个 Next.js 14 前端开发者。请实现 src/app/(main)/page.tsx 的首页 UI。

【技术约束】
- 使用 Next.js 14 App Router，这是 Server Component（无 'use client'）
- 样式只用 CSS 变量（已在 globals.css 定义），核心变量：
  --bg-base #0d1117, --bg-surface #161b22, --bg-raised #1c2333
  --accent #7c3aed, --accent-light #9f67ff, --text-primary #e6edf3
  --text-secondary #8b949e, --border #30363d, --success #3fb950
- 用 inline style 或 Tailwind，禁用白色/浅色背景
- 图片用 next/image，链接用 next/link

【禁止修改的文件】
src/types/、src/lib/、src/app/api/ 下所有文件

【页面结构】（从上到下）

1. Hero区（渐变深色背景）
   - 大标题："The Fastest Gaming Guide Hub"
   - 副标题："Live codes · AI tier lists · Real-time patch notes"
   - 搜索框（占位，无需接搜索逻辑）
   - 两个按钮：[Browse Games] [Start Creating →]

2. 实时代码条（accent色背景横条）
   - 文字："🔴 LIVE" 标签 + "Latest Redeem Codes — Updated in Real Time"
   - 右侧：[View All Codes →] 链接到 /codes

3. 热门游戏区
   - 标题："Popular Games"
   - 6个游戏卡片占位（用灰色占位块，尺寸 300x170px）
   - 每卡显示：游戏名占位 + 平台标签占位 + "攻略数" 角标占位
   - 卡片背景 --bg-surface，圆角 10px，hover时边框变 accent色

4. 今日Patch速报区
   - 标题："Today's Patch Notes"
   - 3条时间线样式条目（占位），每条：游戏名 + 版本号 + 时间

5. 新游发现区
   - 标题："New Releases This Week"
   - 4个小卡片横排（占位）

6. 创作者招募横幅
   - 深紫色渐变背景
   - 标题："Write Guides. Earn Real Money."
   - 副标题："Join 500+ creators earning from their gaming knowledge"
   - 按钮：[Become a Creator →] 链接到 /creator

所有数据用静态占位数据（字符串），不要调用任何 API。
占位图片用 https://placehold.co/300x170/1c2333/8b949e?text=Game
```

---

## T-02 · 游戏库页面

**文件：** `src/app/(main)/games/page.tsx`（新建）

---

### 提示词：

```
请创建 src/app/(main)/games/page.tsx，实现游戏库浏览页面。

【技术约束】
- Server Component，使用 fetch 调用 /api/games（内部API）
- 样式变量同 T-01
- 使用 next/image 和 next/link

【禁止修改的文件】（与 T-01 相同）

【页面结构】

1. 页面标题区
   - H1："Game Library"
   - 副标题："Browse [数字] games with guides, codes, and tier lists"

2. 筛选栏（横排，卡片式）
   - 平台按钮组：All / PC / PS5 / Xbox / Switch / Mobile
   - 类型按钮组：All / RPG / FPS / Strategy / Indie / MMO
   - 排序下拉：Popular / Latest / Rating / Most Guides
   - 每个选中状态：background accent色，未选中 bg-raised

3. 游戏网格（响应式：桌面4列，平板3列，手机2列）
   - 每个游戏卡片：
     * 封面图（宽高比 3:4）用 next/image
     * 游戏名（1行截断）
     * 平台标签（小徽章，bg-raised）
     * 底部：攻略数角标 + 评分
     * hover: 整体上浮效果 + 边框变 accent

4. 分页（底部居中）
   - 上一页 / 页码 / 下一页
   - 当前页高亮 accent 色

数据获取：
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/games?page=1&limit=24`, { next: { revalidate: 300 } })
const { data } = await res.json()
const games = data?.games ?? []

如果 data 为空，显示12个占位卡片。
```

---

## T-03 · 兑换码页面

**文件：** `src/app/(main)/codes/[game]/page.tsx`（新建）

---

### 提示词：

```
请创建 src/app/(main)/codes/[game]/page.tsx，实现游戏兑换码页面。

【技术约束】
- Server Component + 局部 Client Component（复制按钮需要 'use client'）
- 数据来自 /api/codes/[game]
- 样式变量同前

【禁止修改的文件】（同上）

【页面结构】

1. 游戏信息横幅
   - 游戏封面（左）+ 游戏名 + "X Active Codes"（右）
   - 最后更新时间

2. 有效代码表格（绿色标题行）
   列：代码 | 奖励内容 | 来源 | 到期时间 | 复制按钮
   - 代码列：等宽字体（monospace），背景 bg-raised，圆角6px
   - 复制按钮：点击后变为"✓ Copied!"持续2秒，然后恢复
   - 来源标签：discord/reddit/official 各有不同颜色徽章

3. 已失效代码（折叠，灰色）
   - 标题："Expired Codes (X)" 可点击展开
   - 内容同上表格，但文字颜色 text-muted

4. 用户提交区
   - 标题："Got a new code? Submit it!"
   - 输入框：代码 + 奖励描述 + 来源链接
   - 提交按钮（调用 POST /api/codes/[game]）
   - 提交后显示"感谢！代码将在验证后显示"

数据获取：
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/codes/${params.game}`, { next: { revalidate: 120 } })
const { data } = await res.json()

用 TypeScript 类型：import type { CodesPageData } from '@/types'
```

---

## T-04 · 攻略详情页

**文件：** `src/app/(main)/guides/[slug]/page.tsx`（新建）

---

### 提示词：

```
请创建 src/app/(main)/guides/[slug]/page.tsx，实现攻略详情页（三栏布局）。

【技术约束】
- Server Component
- Markdown 渲染：用 <article> 标签包裹，将 content 直接 dangerouslySetInnerHTML（暂时）
- 样式变量同前

【禁止修改的文件】（同上）

【页面三栏布局】（桌面端）
左侧栏（220px，固定）| 主内容区（最大720px）| 右侧栏（300px，粘性）

左侧栏（桌面固定，移动端隐藏）：
- 标题："In This Guide"
- 目录列表（占位3-5条，文字链接）
- 阅读进度条（细线，accent色）

主内容区：
- 封面大图（1200x630，next/image，full width）
- H1 标题
- 元信息行：作者头像+名 | 更新时间 | 阅读时长 | 浏览量
- ⚠️ FTC声明框（必须）：浅紫色背景，文字："This article contains affiliate links..."
- Quick Tips 卡片（accent色左边框，bg-raised背景）
- 正文内容（article 标签，prose样式）
- 文章1/3处插入 AdSlot size="300x250" slot="in-article-1"
- 联盟推荐卡片（如有，从 affiliate_links 数据渲染）
- FAQ 区块（如有，手风琴样式）
- 相关攻略（3个 ArticleCard 占位）

右侧栏（position sticky, top 80px）：
- AdSlot size="300x600" slot="sidebar-1"
- 该游戏热门攻略（3条链接列表）
- 会员升级引导卡片（accent渐变背景）

数据获取：
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/guides/${params.slug}`)
const { data: article } = await res.json()
类型：import type { Article } from '@/types'
```

---

## T-05 · Tier List 页面

**文件：** `src/app/(main)/tier-lists/[game]/page.tsx`（新建）

---

### 提示词：

```
请创建 src/app/(main)/tier-lists/[game]/page.tsx，实现游戏强度榜单页面。

【技术约束】
- 主体 Server Component，投票部分用 'use client' 的子组件
- 样式变量同前

【禁止修改的文件】（同上）

【页面结构】

1. 头部信息
   - 游戏名 + "Tier List"
   - 版本标注："Updated for Patch X.X"（accent色徽章）
   - 分类选项卡：Characters / Weapons / Classes（按 TierCategory 切换）
   - 社区投票数 + 最后更新时间

2. Tier List 表格（核心）
   每一行一个等级（S/A/B/C/D）：
   - 左侧等级标签（S=金色，A=绿色，B=蓝色，C=灰色，D=红色）
   - 右侧：该等级的角色/武器卡片横排
   - 每张卡片：图片（60x60圆形）+ 名称 + 平均评分
   - hover卡片：显示 tooltip 描述

3. 用户投票区（Client Component）
   - "Vote for your rankings" 标题
   - 简单投票UI：点击某角色/武器，选择等级，提交
   - 调用 POST /api/tierlist/vote
   - 未登录时提示"Login to vote"

4. 分享按钮行
   - Twitter / Reddit 一键分享（带预设文字）

数据获取：
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/tierlist/${params.game}?category=character`)
const { data: tierList } = await res.json()
类型：import type { TierList } from '@/types'
```

---

## T-06 · 创作者中心首页

**文件：** `src/app/(main)/creator/page.tsx`（新建）

---

### 提示词：

```
请创建 src/app/(main)/creator/page.tsx，实现创作者招募落地页。

【技术约束】
- Server Component
- 样式变量同前，重点用 accent 渐变营造高级感

【禁止修改的文件】（同上）

【页面结构】（营销落地页风格）

1. Hero（深紫渐变背景）
   - 大标题（48px+）："Write Guides. Earn Real Money."
   - 副标题："Join our creator program and earn from every view"
   - 三个数字展示：5,000+ Guides | $0.50-3.00/1K Views | 500+ Creators
   - 按钮："Start Creating Free →"

2. 三步开始（图标+文字）
   Step 1：Create Account（User图标）
   Step 2：Write Your Guide（Edit图标）
   Step 3：Earn from Views（DollarSign图标）

3. 创作者等级表格
   | 等级 | 条件 | 分成比例 | 权益 |
   Reader / Creator / Verified / Partner
   （数据从 src/types/user.ts CreatorLevel 映射，静态即可）

4. FAQ（手风琴，3-5个常见问题）
   Q1: How much can I earn?
   Q2: What games can I write about?
   Q3: How do I get paid?

5. 底部CTA
   - "Ready to start?" + 按钮
```

---

## 执行顺序建议

```
T-03（兑换码）→ T-02（游戏库）→ T-01（首页）→ T-04（攻略详情）→ T-05（Tier List）→ T-06（创作者）
```

T-03 最简单，适合热身。T-04 最复杂，放在熟悉项目后再做。

---

## Trae CN 的全局约束提示词（每次新开对话前投喂）

```
你正在一个已有骨架的 Next.js 14 项目中工作。以下是全局规则：

1. 这是深色游戏主题网站，主色调：
   背景 #0d1117，表面 #161b22，强调色 #7c3aed
   CSS变量已在 globals.css 定义，直接用 var(--accent) 等

2. 禁止修改的目录（这些由 Claude Code 维护）：
   - src/types/（类型定义，这是你和 Claude Code 的接口合同）
   - src/lib/（工具库：db, redis, igdb, steam, algolia, utils）
   - src/app/api/（所有API路由）
   - prisma/schema.prisma（数据库结构）
   - .env.example（环境变量模板）

3. 数据获取：用 fetch 调用已存在的 API 路由，不要直接导入 db 或 redis

4. 类型导入：import type { ... } from '@/types'

5. 如果需要 Client Component，在独立文件中创建，用 'use client'

6. 图片：用 next/image，链接用 next/link

7. 完成后列出你修改/创建的文件，方便我核对
```
