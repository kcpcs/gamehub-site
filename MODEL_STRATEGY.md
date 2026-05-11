# GameHub · 模型调用策略文档

> **使用说明**：Trae CN 在执行任务前，**必须先阅读本文档**，根据任务类型自动选择对应模型。

---

## 🎯 模型角色定义

### 🚀 Claude Opus 4 (主力模型)
**职责范围**：
- 复杂系统架构设计
- 核心业务逻辑开发
- 高难度代码重构
- Phase 2 页面联调（核心功能）
- Phase 3 AI自动化流程设计
- Phase 4 SEO变现策略制定
- Phase 5 部署上线全流程

**必须使用此模型的场景**：
- 任何需要深度思考的复杂任务
- 需要跨模块协调的系统级任务
- 代码架构设计与决策

---

### 📊 Claude Sonnet 4 (辅助模型)
**职责范围**：
- 单页面开发优化
- UI组件微调
- 数据库查询优化
- Phase 2 次要页面联调
- Phase 3 工作流细节实现
- Phase 4 单页SEO优化

**适合使用此模型的场景**：
- 中等复杂度任务
- 需要较快响应但仍需思考质量
- 已有明确方案的执行任务

---

### ⚡ Claude Haiku (快速任务模型)
**职责范围**：
- 简单重复任务
- 文件批量处理
- 代码格式化
- 文档生成
- 简单API测试
- 数据验证

**适合使用此模型的场景**：
- 明确简单的任务
- 批量自动化工作
- 需要快速反馈

---

### 🎨 GPT-4o (补充模型)
**职责范围**：
- 多模态内容生成
- UI设计建议
- 图片处理相关
- 复杂正则/模式识别

**适合使用此模型的场景**：
- 需要视觉能力的任务
- Opus/Sonnet不擅长的特定场景

---

## 📋 Phase 任务与模型映射表

### Phase 2：页面联调（高优先级）

| # | 任务 | 负责模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 2-1 | 兑换码页面联调 `GET/POST /api/codes/[game]` | **Claude Opus 4** | `Read` `SearchCodebase` `RunCommand` `GetDiagnostics` |
| 2-2 | 游戏库页面联调 `GET /api/games` 筛选/分页 | **Claude Opus 4** | `Read` `SearchCodebase` `RunCommand` `Glob` |
| 2-3 | 首页接口联调（真实攻略/游戏数据） | **Claude Opus 4** | `Read` `SearchCodebase` `RunCommand` |
| 2-4 | 攻略详情页联调 `GET /api/guides/[slug]` | **Claude Opus 4** | `Read` `SearchCodebase` `RunCommand` |
| 2-5 | Tier List 页面联调 `GET /api/tierlist/[game]` | **Claude Sonnet 4** | `Read` `SearchCodebase` `RunCommand` |
| 2-6 | 创作者中心联调 `POST /api/internal/articles` | **Claude Opus 4** | `Read` `SearchCodebase` `RunCommand` |
| 2-7 | Markdown渲染（MDX/remark） | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 2-8 | Algolia搜索UI（搜索弹窗） | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 2-9 | 用户认证（NextAuth + Google OAuth） | **Claude Opus 4** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 2-10 | 联盟链接重定向 `/go/[partner]/[id]` | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` `RunCommand` |

---

### Phase 3：AI自动化系统（中优先级）

| # | 任务 | 负责模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 3-1 | n8n部署（Railway自托管） | **Claude Opus 4** | `Read` `WebSearch` `RunCommand` |
| 3-2 | 工作流1：Discord/Reddit兑换码监听 | **Claude Opus 4** | `Read` `SearchCodebase` `Edit` |
| 3-3 | 工作流2：RSS Patch Notes监听 | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` |
| 3-4 | 工作流3：AI文章生产流水线（Claude API） | **Claude Opus 4** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 3-5 | 工作流4：社媒自动分发（Twitter/Reddit） | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` |
| 3-6 | 工作流5：夜间自动维护（死链/备份/日报） | **Claude Haiku** | `Read` `SearchCodebase` `Edit` |
| 3-7 | IGDB批量导入脚本（前1000热门游戏） | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 3-8 | Dify RAG攻略助手部署 | **Claude Opus 4** | `Read` `WebSearch` `RunCommand` |

---

### Phase 4：SEO与变现（中优先级）

| # | 任务 | 负责模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 4-1 | 动态XML Sitemap（Next.js sitemap.ts） | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` |
| 4-2 | 全站Schema.org结构化数据注入 | **Claude Opus 4** | `Read` `SearchCodebase` `Edit` |
| 4-3 | robots.txt配置 | **Claude Haiku** | `Read` `Edit` |
| 4-4 | OpenGraph图片自动生成（next/og） | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` |
| 4-5 | Google AdSense广告位联调 | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` |
| 4-6 | 联盟链接配置（Green Man Gaming / Amazon） | **Claude Sonnet 4** | `Read` `SearchCodebase` `Edit` |
| 4-7 | Stripe付费会员系统 | **Claude Opus 4** | `Read` `SearchCodebase` `Edit` `RunCommand` |

---

### Phase 5：部署上线（高优先级）

| # | 任务 | 负责模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 5-1 | 配置所有环境变量（.env.local） | **Claude Haiku** | `Read` `Edit` `RunCommand` |
| 5-2 | Railway部署PostgreSQL数据库 | **Claude Opus 4** | `Read` `WebSearch` `RunCommand` |
| 5-3 | Prisma migrate初始化数据库 | **Claude Sonnet 4** | `Read` `RunCommand` |
| 5-4 | Vercel部署Next.js项目 | **Claude Opus 4** | `Read` `WebSearch` `RunCommand` `TodoWrite` |
| 5-5 | Cloudflare配置DNS + CDN + R2图片存储 | **Claude Sonnet 4** | `Read` `WebSearch` `RunCommand` |
| 5-6 | Upstash Redis配置 | **Claude Haiku** | `Read` `WebSearch` `Edit` |
| 5-7 | Algolia索引初始化 | **Claude Sonnet 4** | `Read` `SearchCodebase` `RunCommand` |
| 5-8 | 提交Google Search Console | **Claude Haiku** | `Read` `WebSearch` |

---

## 🔧 工具与技能使用策略

### 高优先级工具（必须掌握）

| 工具 | 用途 | 适用模型 |
|------|------|---------|
| `TodoWrite` | 任务规划与跟踪 | **所有模型** |
| `Read` | 读取文件 | **所有模型** |
| `SearchCodebase` | 代码库搜索 | **Claude Opus 4 / Sonnet 4** |
| `RunCommand` | 执行命令/脚本 | **所有模型** |
| `Edit` | 修改文件 | **所有模型** |
| `Write` | 创建新文件 | **所有模型** |
| `Glob` | 文件查找 | **Claude Haiku / Sonnet 4** |
| `GetDiagnostics` | 类型/错误检查 | **所有模型** |

### 中优先级工具

| 工具 | 用途 | 适用模型 |
|------|------|---------|
| `WebSearch` | 网络搜索 | **Claude Opus 4 / Sonnet 4** |
| `WebFetch` | 网页内容获取 | **Claude Opus 4 / Sonnet 4** |
| `AskUserQuestion` | 用户提问 | **所有模型** |

### 低优先级工具

| 工具 | 用途 | 适用模型 |
|------|------|---------|
| `DeleteFile` | 删除文件 | **Claude Haiku** |
| `search` | 子代理搜索 | **Claude Opus 4** |
| `Skill` | 技能调用 | **Claude Opus 4** |

---

## 📌 模型自动选择规则

### Rule 1：默认优先 Claude Opus 4
**任何未明确指定的任务，默认使用 Claude Opus 4**

### Rule 2：任务复杂度判断标准

| 任务特征 | 推荐模型 |
|---------|---------|
| 需要跨文件/跨模块协调 | **Claude Opus 4** |
| 需要深度思考或决策 | **Claude Opus 4** |
| 系统架构/核心逻辑 | **Claude Opus 4** |
| 单文件/单组件修改 | **Claude Sonnet 4** |
| 明确简单的执行任务 | **Claude Sonnet 4** |
| 批量/重复工作 | **Claude Haiku** |
| 文档/注释/格式化 | **Claude Haiku** |

### Rule 3：模型降级策略
1. 如果 Claude Opus 4 响应超时 → 切换到 Claude Sonnet 4
2. 如果 Claude Sonnet 4 响应超时 → 切换到 Claude Haiku
3. 记录失败情况，后续再用 Claude Opus 4 重新处理

---

## 🚀 执行优先级

### 第一优先级（立即开始）
- ✅ Phase 2-1：兑换码页面联调（最简单，快速验证）
- ✅ Phase 5-1：环境变量配置
- ✅ Phase 5-2~5-8：部署上线准备

### 第二优先级
- ✅ Phase 2 剩余页面联调
- ✅ Phase 3 核心AI工作流

### 第三优先级
- ✅ Phase 4 SEO与变现
- ✅ Phase 3 次要工作流

---

## 📝 执行前检查清单

每次开始新任务前，确认：

- [ ] 已阅读 `PROJECT_PROGRESS.md` 了解当前进度
- [ ] 已阅读 `MODEL_STRATEGY.md` 确定负责模型
- [ ] 使用 `TodoWrite` 规划子任务
- [ ] 确认当前使用的模型正确

---

**本文档最后更新：2026-05-10**
