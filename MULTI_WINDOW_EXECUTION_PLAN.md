# GameHub 多窗口分工执行计划

## 📊 项目进度追踪表

**更新时间**: 2026-01-20
**当前状态**: 🚀 P2/P3/P4阶段执行中

---

## 🎯 三窗口分工执行表

| 窗口 | 执行AI | 任务 | 协同工具/技能 | 优先级 | 状态 |
|------|--------|------|--------------|--------|------|
| **窗口1** | Claude Opus 4 | P2-功能增强：用户收藏/评论/投票系统 | Code Writing, Database, React | P0 | 🔄 执行中 |
| **窗口2** | Claude Sonnet 4 | P3-AI自动化：Claude内容生成工作流 | API Integration, Workflow Setup | P1 | 🔄 执行中 |
| **窗口3** | Claude Haiku | P4-SEO优化：FAQ Schema、内部链接 | SEO Analysis, Schema Generation | P2 | 🔄 执行中 |

---

## 🔴 窗口1：P2-功能增强（Claude Opus 4执行）

### 负责人
- **主力AI**: Claude Opus 4
- **协同工具**: Code Writing, Database Design, React Components
- **技能**: Full-stack Development, State Management

### 任务详情

#### P2-1: 用户收藏系统
- [ ] 创建Favorite组件
- [ ] 添加LocalStorage持久化
- [ ] 实现游戏/文章收藏功能
- [ ] 添加收藏列表页面

#### P2-2: 用户投票系统
- [ ] 创建VoteButton组件
- [ ] 实现Tier List投票功能
- [ ] 添加投票统计显示
- [ ] 防止重复投票

#### P2-3: 评论系统基础
- [ ] 创建CommentForm组件
- [ ] 添加评论显示列表
- [ ] 实现基础评论功能
- [ ] 添加时间戳显示

#### P2-4: 用户进度追踪
- [ ] 创建ProgressTracker组件
- [ ] 实现游戏进度保存
- [ ] 添加进度显示UI
- [ ] LocalStorage持久化

### 文件改动
```
新增:
- src/components/FavoriteButton.tsx
- src/components/VoteButton.tsx
- src/components/CommentForm.tsx
- src/components/CommentList.tsx
- src/components/ProgressTracker.tsx

修改:
- src/app/games/[slug]/page.tsx
- src/app/tier-list/[game]/page.tsx
```

---

## 🟡 窗口2：P3-AI自动化（Claude Sonnet 4执行）

### 负责人
- **主力AI**: Claude Sonnet 4
- **协同工具**: API Integration, Workflow Setup
- **技能**: Automation, Scripting, System Design

### 任务详情

#### P3-1: Claude API配置
- [ ] 创建Claude API配置脚本
- [ ] 配置API密钥和环境变量
- [ ] 实现基础API调用函数
- [ ] 添加错误处理和重试机制

#### P3-2: 内容生成工作流
- [ ] 创建游戏攻略生成器
- [ ] 实现Tier List自动生成
- [ ] 添加兑换码抓取引擎
- [ ] 配置定期执行计划

#### P3-3: n8n工作流设置
- [ ] 创建n8n工作流JSON
- [ ] 配置触发器和动作
- [ ] 设置数据处理节点
- [ ] 配置输出到数据库

#### P3-4: Dify RAG知识库
- [ ] 创建知识库导入脚本
- [ ] 配置向量数据库
- [ ] 实现相似内容推荐
- [ ] 添加自动更新机制

### 文件改动
```
新增:
- scripts/claude-api-config.ts
- scripts/content-generator.ts
- workflows/n8n-gamehub-workflow.json
- scripts/dify-rag-setup.ts

修改:
- .env.local (添加CLAUDE_API_KEY)
```

---

## 🔵 窗口3：P4-SEO优化（Claude Haiku执行）

### 负责人
- **主力AI**: Claude Haiku
- **协同工具**: SEO Analysis, Schema Generation
- **技能**: Technical SEO, Structured Data

### 任务详情

#### P4-1: FAQ Schema实现
- [ ] 创建FAQ Schema组件
- [ ] 在攻略文章中注入Schema
- [ ] 验证Schema有效性
- [ ] 提交Google Search Console

#### P4-2: 内部链接优化
- [ ] 分析当前内部链接结构
- [ ] 创建相关文章推荐逻辑
- [ ] 在内容中插入内部链接
- [ ] 添加面包屑导航

#### P4-3: 元数据完善
- [ ] 优化所有页面Meta描述
- [ ] 添加OpenGraph标签
- [ ] 配置Twitter Cards
- [ ] 添加Canonical URL

#### P4-4: Sitemap更新
- [ ] 生成完整Sitemap
- [ ] 配置robots.txt
- [ ] 提交搜索引擎
- [ ] 监控索引状态

### 文件改动
```
新增:
- src/components/FAQSchema.tsx
- src/components/Breadcrumb.tsx
- src/components/InternalLinks.tsx

修改:
- src/app/layout.tsx
- public/robots.txt
- src/app/sitemap.ts
```

---

## 📈 执行前检查清单

### 窗口1执行前
- [x] 数据库连接正常
- [x] 现有功能无报错
- [x] 代码已提交Git

### 窗口2执行前
- [x] Claude API密钥可用
- [x] 环境变量配置正确
- [x] 网络连接稳定

### 窗口3执行前
- [x] Google Search Console访问
- [x] 网站地图生成正常
- [x] 现有SEO基础评分

---

## 🚨 风险管理

### 高风险项
1. **数据库变更** - 窗口1修改模型前备份
2. **API配置** - 窗口2需要有效密钥
3. **SEO变更** - 可能影响搜索排名

### 回滚方案
1. Git提交点标记
2. 环境变量备份
3. SEO变更前截图记录

---

## ✅ 成功标准

### 窗口1成功指标
- 用户收藏功能正常工作
- 投票系统无重复投票
- 评论功能可正常提交

### 窗口2成功指标
- Claude API调用成功
- 内容生成脚本可执行
- n8n工作流可导入

### 窗口3成功指标
- FAQ Schema验证通过
- 内部链接数量增加50%
- 移动端友好度100%

---

**下次执行前**: 记录当前项目进度条，确认无异常后再开始新任务

---
*本文档由 Claude Opus 4 创建 | GameHub Multi-Window Execution Plan*
