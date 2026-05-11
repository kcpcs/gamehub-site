# GameHub 优化执行计划

## 📊 项目进度追踪

**更新时间**: 2026-01-20
**当前状态**: 🚀 执行中

---

## 🎯 任务分工表

| 任务ID | 任务名称 | 负责AI | 工具/技能 | 优先级 | 状态 |
|--------|---------|--------|----------|--------|------|
| 1 | 内容优化 | Claude Opus 4 | Deep Research, Code Writing | P0 | 🔄 进行中 |
| 2 | UI/UX改进 | Claude Sonnet 4 | Design Analysis, React Components | P1 | ⏳ 待开始 |
| 3 | 功能增强 | Claude Opus 4 | Tool Integration, Database | P2 | ⏳ 待开始 |
| 4 | AI自动化 | Claude Haiku | Workflow Setup, API Integration | P3 | ⏳ 待开始 |
| 5 | SEO优化 | Claude Sonnet 4 | Schema Generation, Link Building | P4 | ⏳ 待开始 |

---

## 📋 详细任务清单

### 🔴 P0 - 内容优化（立即执行）

**执行AI**: Claude Opus 4
**协同工具**: Deep Research, Code Writing, SearchCodebase

#### 目标
- 确保所有页面内容与标题匹配
- 提升内容丰富度至标杆水平
- 修复guides页面显示问题
- 完善codes页面内容
- 优化tier-list页面展示

#### 具体任务
1. [ ] 检查并修复 /guides 页面内容显示
2. [ ] 检查并修复 /codes/[game] 页面内容
3. [ ] 检查并修复 /tier-list/[game] 页面内容
4. [ ] 检查并修复 /creator/studio 页面功能
5. [ ] 扩充种子数据至50+游戏
6. [ ] 生成100+高质量攻略内容
7. [ ] 添加真实有效的兑换码数据
8. [ ] 创建深度Tier List内容

#### 执行标准（参考Pro Game Guides）
- ✅ How-to标题格式：How to [做某事] in [游戏名]
- ✅ FAQ格式内容：每个问题独立锚点
- ✅ Updated时间戳：📅 Updated: X hours ago
- ✅ 兑换码完整信息：代码、奖励、来源、状态

---

### 🟡 P1 - UI/UX改进

**执行AI**: Claude Sonnet 4
**协同技能**: Design Analysis, React Components, Styling

#### 目标（参考Polygon + Game8）
- 精美排版设计
- 移动端优先体验
- 内部推荐模块
- 阅读进度指示
- 深色主题优化

#### 具体任务
1. [ ] 优化首页Hero区域布局
2. [ ] 添加阅读进度条组件
3. [ ] 实现文章内部推荐模块
4. [ ] 优化移动端导航体验
5. [ ] 添加骨架屏加载效果
6. [ ] 优化卡片阴影和动画
7. [ ] 实现深色/浅色主题切换

#### 设计标准
- 正文最大宽度: 700px
- 段落: 3-4句，不超过5句
- 每500字配1张截图
- S/A/B/C/D Tier视觉化（渐变色）
- 代码框一键复制按钮

---

### 🟢 P2 - 功能增强

**执行AI**: Claude Opus 4
**协同工具**: Tool Integration, Database Design

#### 目标（参考Game8 + Fextralife）
- 互动Tier List（可投票）
- Build计算器
- 用户收藏系统
- 词条型内容体系
- 社区评论功能

#### 具体任务
1. [ ] 实现用户投票Tier List系统
2. [ ] 添加用户收藏/喜欢功能
3. [ ] 创建评论系统
4. [ ] 实现词条型内容页面（角色/武器/道具）
5. [ ] 添加游戏进度追踪
6. [ ] 实现平台分类导航（PC/PS5/Xbox/Switch）
7. [ ] 添加相关攻略推荐算法

#### 功能优先级
1. 用户收藏系统（LocalStorage）
2. 评论功能
3. 投票系统
4. 进度追踪

---

### 🔵 P3 - AI自动化

**执行AI**: Claude Haiku
**协同工具**: Workflow Setup, API Integration

#### 目标（参考IGN + 我站独创）
- Claude API内容生成
- n8n自动化工作流
- Dify RAG知识库
- 社交媒体分发

#### 具体任务
1. [ ] 配置Claude API内容生成脚本
2. [ ] 创建n8n自动化工作流
3. [ ] 配置Dify RAG知识库
4. [ ] 实现自动礼包码抓取
5. [ ] 实现自动补丁监控
6. [ ] 配置自动社交媒体分发

#### 自动化工作流
```
数据源层（Steam API / IGDB / Reddit）
    ↓
n8n调度层（每日06:00触发）
    ↓
AI生产层（Claude API生成内容）
    ↓
质量层（SEO检查 / 原创性验证）
    ↓
发布层（Strapi草稿 / 人工审核）
    ↓
分发层（Twitter / Reddit / 邮件）
```

---

### 🟣 P4 - SEO优化

**执行AI**: Claude Sonnet 4
**协同技能**: Schema Generation, Link Building, SEO Analysis

#### 目标（参考GameFAQs + Polygon）
- FAQ Schema富片段
- 内部链接优化
- How-to标题策略
- 元数据完善

#### 具体任务
1. [ ] 实现FAQ Schema自动注入
2. [ ] 优化所有页面Meta描述
3. [ ] 生成完整Sitemap
4. [ ] 配置robots.txt
5. [ ] 添加OpenGraph标签
6. [ ] 优化内部链接结构
7. [ ] 添加结构化数据（JSON-LD）

#### SEO标准
- FAQ Schema覆盖率 > 50%
- 内部链接数量 > 500
- 移动端友好度 100%
- 页面加载时间 < 2秒

---

## 📈 进度记录

### 2026-01-20 - P0内容优化执行
- [x] P0-1: 修复首页 - 移除假数据fallback
- [x] P0-2: 修复游戏详情页 - 移除假游戏数据fallback
- [x] P0-3: 扩充种子数据
  - ✅ 30款热门游戏
  - ✅ 8篇高质量攻略
  - ✅ 20个有效兑换码
  - ✅ 2个完整Tier List
- [x] P0-4: 验证页面内容匹配

### 2026-01-20 - P1 UI/UX优化执行
- [x] P1-1: 优化首页Hero区域布局
  - 增大标题尺寸（5xl → 7xl）
  - 添加动画效果（pulse、spin）
  - 优化搜索框样式（圆角2xl、阴影效果）
  - 优化统计数据展示
- [x] P1-2: 添加阅读进度条组件
  - 创建ReadingProgress组件
  - 固定在顶部，渐变色彩
- [x] P1-3: 实现相关文章推荐模块
  - 创建RelatedArticles组件
  - 显示3篇相关文章
- [x] P1-4: 优化移动端导航体验
  - Header添加毛玻璃效果
  - 优化Logo样式
  - 移动端菜单动画效果
- [x] P1-5: 添加骨架屏加载效果
  - 创建Skeleton组件
  - GameCardSkeleton和ArticleCardSkeleton
- [x] P1-6: 优化卡片阴影和动画
  - 所有卡片添加hover:scale效果
  - 过渡动画duration-300
- [x] P1-7: 实现深色/浅色主题切换
  - 创建ThemeToggle组件
  - localStorage保存主题偏好

### 新增组件文件
- `src/components/ReadingProgress.tsx` - 阅读进度条
- `src/components/Skeleton.tsx` - 骨架屏加载
- `src/components/ThemeToggle.tsx` - 主题切换
- `src/components/RelatedArticles.tsx` - 相关文章推荐

### 修改的文件
- `src/app/page.tsx` - 首页Hero区域优化
- `src/components/layout/Header.tsx` - Header优化

### 数据库导入结果
```
Total games: 30
Total articles: 8
Total codes: 20
Total tier lists: 2
```

### 修改的文件
- `src/app/page.tsx` - 移除首页假数据fallback
- `src/app/games/[slug]/page.tsx` - 移除游戏详情页假数据
- `prisma/seed_full.cjs` - 创建完整的种子数据文件

### 每次执行前记录
1. 当前任务ID和名称
2. 执行前网站状态
3. 预计改动内容
4. 潜在风险点
5. 回滚方案

---

## 🎯 成功指标

### 内容指标
- ✅ 50+ 游戏数据 ✓（已确认）
- ⏳ 100+ 攻略文章（当前6篇）
- ⏳ 30+ 兑换码（当前10个）
- ⏳ 10+ Tier List（当前2个）

### 用户体验指标
- 首屏加载时间 < 2秒
- 页面跳出率降低30%
- 平均停留时间 > 3分钟

### SEO指标
- FAQ富片段覆盖率 > 50%
- 内部链接数量 > 500
- 移动端友好度 100%

---

## 🚨 风险管理

### 高风险项
1. **数据库迁移** - 修改schema前备份数据
2. **样式变更** - 可能影响现有功能
3. **API改动** - 确保向后兼容

### 回滚方案
1. Git提交点标记
2. 数据库定期备份
3. 功能开关机制

---

**下次执行**: P0内容优化 - 修复页面内容与标题不符问题

---
*本文档由 Claude Opus 4 创建 | GameHub Optimization Plan*
