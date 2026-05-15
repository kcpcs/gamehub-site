# TRAE 内置免费大模型配置指南 - GameHub 项目

> 🚀 **零成本方案**：使用 TRAE 内置国产大模型，完全免费！

---

## 📊 一、内置模型总览（完全免费）

### 核心主力模型

| 模型 | 厂商 | 能力定位 | 最佳场景 | 推荐优先级 |
|------|------|---------|---------|-----------|
| **Doubao-Seed-2.0-Code** | 字节跳动 | 代码专家 | 复杂架构设计、核心业务逻辑 | ⭐⭐⭐⭐⭐ |
| **DeepSeek-V4-Pro** | 深度求索 | 推理王者 | 复杂逻辑、代码重构、系统设计 | ⭐⭐⭐⭐⭐ |
| **GLM-5.1** | 智谱AI | 综合平衡 | 内容生成、数据分析、页面优化 | ⭐⭐⭐⭐ |
| **Doubao-Seed-1.8** | 字节跳动 | 通用全能 | 页面开发、UI组件、数据处理 | ⭐⭐⭐⭐ |

### 辅助模型

| 模型 | 厂商 | 能力定位 | 最佳场景 |
|------|------|---------|---------|
| **DeepSeek-V4-Flash** | 深度求索 | 极速响应 | 批量任务、简单处理、快速迭代 |
| **Kimi-K2.6** | 月之暗面 | 长文本专家 | SEO优化、长文档处理 |
| **Qwen3.6-Plus** | 阿里云 | 全能选手 | 全场景覆盖 |
| **GLM-5V-Turbo** | 智谱AI | 视觉增强 | 多模态内容、UI设计辅助 |

---

## 🎯 二、模型切换方法

### 在 TRAE SOLO 中切换模型

1. 点击对话输入框**右下角**的当前模型名称
2. 从下拉列表中选择需要的模型
3. 鼠标悬停可查看模型支持的能力

### 推荐模型快速切换

| 任务类型 | 推荐模型 | 操作 |
|---------|---------|------|
| 写代码/架构设计 | Doubao-Seed-2.0-Code | 直接选择 |
| 复杂问题推理 | DeepSeek-V4-Pro | 直接选择 |
| 写文章/SEO | Kimi-K2.6 | 直接选择 |
| 快速简单任务 | DeepSeek-V4-Flash | 直接选择 |

---

## 📋 三、Phase 任务与模型映射表

### Phase 2：页面联调（高优先级）

| # | 任务 | 推荐模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 2-1 | 兑换码页面联调 `GET/POST /api/codes/[game]` | **Doubao-Seed-2.0-Code** | `Read` `SearchCodebase` `RunCommand` `GetDiagnostics` |
| 2-2 | 游戏库页面联调 `GET /api/games` 筛选/分页 | **Doubao-Seed-2.0-Code** | `Read` `SearchCodebase` `RunCommand` `Glob` |
| 2-3 | 首页接口联调（真实攻略/游戏数据） | **DeepSeek-V4-Pro** | `Read` `SearchCodebase` `RunCommand` |
| 2-4 | 攻略详情页联调 `GET /api/guides/[slug]` | **Doubao-Seed-2.0-Code** | `Read` `SearchCodebase` `RunCommand` |
| 2-5 | Tier List 页面联调 `GET /api/tierlist/[game]` | **GLM-5.1** | `Read` `SearchCodebase` `RunCommand` |
| 2-6 | 创作者中心联调 `POST /api/internal/articles` | **Doubao-Seed-2.0-Code** | `Read` `SearchCodebase` `RunCommand` |
| 2-7 | Markdown渲染（MDX/remark） | **Doubao-Seed-1.8** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 2-8 | Algolia搜索UI（搜索弹窗） | **Doubao-Seed-1.8** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 2-9 | 用户认证（NextAuth + Google OAuth） | **DeepSeek-V4-Pro** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 2-10 | 联盟链接重定向 `/go/[partner]/[id]` | **DeepSeek-V4-Flash** | `Read` `SearchCodebase` `Edit` `RunCommand` |

---

### Phase 3：AI自动化系统（中优先级）

| # | 任务 | 推荐模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 3-1 | n8n部署（Railway自托管） | **Doubao-Seed-2.0-Code** | `Read` `WebSearch` `RunCommand` |
| 3-2 | 工作流1：Discord/Reddit兑换码监听 | **Doubao-Seed-2.0-Code** | `Read` `SearchCodebase` `Edit` |
| 3-3 | 工作流2：RSS Patch Notes监听 | **GLM-5.1** | `Read` `SearchCodebase` `Edit` |
| 3-4 | 工作流3：AI文章生产流水线 | **Kimi-K2.6** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 3-5 | 工作流4：社媒自动分发（Twitter/Reddit） | **Qwen3.6-Plus** | `Read` `SearchCodebase` `Edit` |
| 3-6 | 工作流5：夜间自动维护（死链/备份/日报） | **DeepSeek-V4-Flash** | `Read` `SearchCodebase` `Edit` |
| 3-7 | IGDB批量导入脚本（前1000热门游戏） | **DeepSeek-V4-Flash** | `Read` `SearchCodebase` `Edit` `RunCommand` |
| 3-8 | Dify RAG攻略助手部署 | **Doubao-Seed-2.0-Code** | `Read` `WebSearch` `RunCommand` |

---

### Phase 4：SEO与变现（中优先级）

| # | 任务 | 推荐模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 4-1 | 动态XML Sitemap（Next.js sitemap.ts） | **GLM-5.1** | `Read` `SearchCodebase` `Edit` |
| 4-2 | 全站Schema.org结构化数据注入 | **Doubao-Seed-2.0-Code** | `Read` `SearchCodebase` `Edit` |
| 4-3 | robots.txt配置 | **DeepSeek-V4-Flash** | `Read` `Edit` |
| 4-4 | OpenGraph图片自动生成（next/og） | **GLM-5V-Turbo** | `Read` `SearchCodebase` `Edit` |
| 4-5 | Google AdSense广告位联调 | **Qwen3.6-Plus** | `Read` `SearchCodebase` `Edit` |
| 4-6 | 联盟链接配置（Green Man Gaming / Amazon） | **Doubao-Seed-1.8** | `Read` `SearchCodebase` `Edit` |
| 4-7 | Stripe付费会员系统 | **DeepSeek-V4-Pro** | `Read` `SearchCodebase` `Edit` `RunCommand` |

---

### Phase 5：部署上线（高优先级）

| # | 任务 | 推荐模型 | 用到的工具/技能 |
|---|------|---------|----------------|
| 5-1 | 配置所有环境变量（.env.local） | **DeepSeek-V4-Flash** | `Read` `Edit` `RunCommand` |
| 5-2 | Railway部署PostgreSQL数据库 | **Doubao-Seed-2.0-Code** | `Read` `WebSearch` `RunCommand` |
| 5-3 | Prisma migrate初始化数据库 | **Doubao-Seed-1.8** | `Read` `RunCommand` |
| 5-4 | Vercel部署Next.js项目 | **DeepSeek-V4-Pro** | `Read` `WebSearch` `RunCommand` `TodoWrite` |
| 5-5 | Cloudflare配置DNS + CDN + R2图片存储 | **Qwen3.6-Plus** | `Read` `WebSearch` `RunCommand` |
| 5-6 | Upstash Redis配置 | **DeepSeek-V4-Flash** | `Read` `WebSearch` `Edit` |
| 5-7 | Algolia索引初始化 | **GLM-5.1** | `Read` `SearchCodebase` `RunCommand` |
| 5-8 | 提交Google Search Console | **DeepSeek-V4-Flash** | `Read` `WebSearch` |

---

## 🔧 四、模型自动选择规则

### Rule 1：默认优先策略
**任何未明确指定的任务，按以下优先级选择：**
1. `Doubao-Seed-2.0-Code` - 首选
2. `DeepSeek-V4-Pro` - 次选
3. `GLM-5.1` - 第三选择

### Rule 2：任务复杂度判断标准

| 任务特征 | 推荐模型 |
|---------|---------|
| 需要跨文件/跨模块协调 | **Doubao-Seed-2.0-Code** |
| 需要深度思考或决策 | **DeepSeek-V4-Pro** |
| 系统架构/核心逻辑 | **Doubao-Seed-2.0-Code** |
| 单文件/单组件修改 | **Doubao-Seed-1.8** |
| 明确简单的执行任务 | **GLM-5.1** |
| 批量/重复工作 | **DeepSeek-V4-Flash** |
| 长文本/SEO相关 | **Kimi-K2.6** |

### Rule 3：模型降级策略
1. 如果 `Doubao-Seed-2.0-Code` 响应慢 → 切换到 `DeepSeek-V4-Pro`
2. 如果 `DeepSeek-V4-Pro` 响应慢 → 切换到 `GLM-5.1`
3. 记录失败情况，后续再用 `Doubao-Seed-2.0-Code` 重新处理

---

## ⚡ 五、性能优化策略

### 核心优化建议

1. **启用 Plan 模式**
   - 复杂任务先规划再执行
   - 点击对话框中的 "Plan" 按钮

2. **多任务并行**
   - 充分利用 TRAE 的多任务能力
   - 左侧任务列表同时推进多个模块

3. **上下文压缩**
   - TRAE 自动优化对话上下文
   - 长对话不会丢失关键信息

4. **分步验证**
   - 重要代码分多次提交
   - 每次确认后再继续

### 执行优先级

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

## 📝 六、执行前检查清单

每次开始新任务前，确认：

- [ ] 已阅读 `PROJECT_PROGRESS.md` 了解当前进度
- [ ] 已阅读本文档确定推荐模型
- [ ] 在 TRAE SOLO 右下角切换到正确模型
- [ ] 使用 `TodoWrite` 规划子任务
- [ ] 复杂任务启用 Plan 模式

---

## 💡 七、快速参考卡片

### 最常用模型快捷键

| 场景 | 模型 | 记忆点 |
|------|------|--------|
| 写代码 | Doubao-Seed-2.0-Code | 豆包代码专家 |
| 想问题 | DeepSeek-V4-Pro | 深度思考 |
| 写文章 | Kimi-K2.6 | 长文高手 |
| 快任务 | DeepSeek-V4-Flash | 闪电速度 |

---

**本文档最后更新：2026-05-16**
**成本节省：¥0/月（原方案 ¥500-2000/月）**
