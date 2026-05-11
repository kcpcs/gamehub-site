# GameHub · 大模型分工体系 2.0

**文档版本**: 2.0  
**最后更新**: 2026-05-10  
**核心原则**: 根据任务复杂度智能选择最优模型

---

## 🚀 一、模型角色定义

### 1️⃣ Claude Opus 4 (主力旗舰模型)
**定位**: 系统架构设计、核心业务逻辑、复杂问题解决

**职责范围**:
- 复杂系统架构设计与决策
- Phase 2 核心页面联调（兑换码、游戏库、首页）
- Phase 3 AI自动化系统设计
- Phase 4 Stripe支付系统、核心SEO架构
- Phase 5 部署上线全流程
- 跨模块协调与系统级问题解决
- 代码重构与优化
- 数据库Schema设计与优化

**必须使用此模型的场景**:
```
✅ 任何需要深度思考的复杂任务
✅ 需要跨文件/跨模块协调的任务
✅ 系统架构设计与决策
✅ 核心业务逻辑实现
✅ Phase 2-5 的主要任务
```

### 2️⃣ Claude Sonnet 4 (辅助主力模型)
**定位**: 单页面优化、组件开发、中等复杂度任务

**职责范围**:
- Phase 2 次要页面联调（攻略详情、Tier List、创作者中心）
- Phase 3 工作流细节实现
- Phase 4 单页面SEO优化
- UI组件微调与优化
- 数据库查询优化
- API路由完善

**适合使用此模型的场景**:
```
✅ 单文件/单组件修改
✅ 中等复杂度任务
✅ 已有明确方案的执行任务
✅ 需要较快响应但仍需思考质量
```

### 3️⃣ Claude Haiku (快速任务模型)
**定位**: 简单重复任务、文档生成、批量处理

**职责范围**:
- 文档生成与维护
- 代码格式化
- 批量文件处理
- 简单API测试
- 数据验证
- .env配置文件创建
- robots.txt、sitemap.ts等简单文件

**适合使用此模型的场景**:
```
✅ 明确简单的执行任务
✅ 批量自动化工作
✅ 需要快速反馈
✅ 文档编写与格式化
```

### 4️⃣ GPT-4o (补充模型)
**定位**: 多模态任务、视觉设计、复杂模式识别

**职责范围**:
- 多模态内容生成
- UI设计建议
- 图片处理相关
- 复杂正则/模式识别

**适合使用此模型的场景**:
```
✅ 需要视觉能力的任务
✅ 图片生成与处理
✅ UI/UX设计建议
✅ Opus/Sonnet不擅长的特定场景
```

---

## 📊 二、Phase任务与模型映射表

### Phase 2: 页面联调（高优先级）

| 任务ID | 任务名称 | 负责模型 | 用到的工具/技能 | 状态 |
|-------|---------|---------|----------------|------|
| 2-1 | 兑换码页面联调 | **Claude Opus 4** | Read, SearchCodebase, RunCommand, GetDiagnostics | ⏳ 待开始 |
| 2-2 | 游戏库页面联调 | **Claude Opus 4** | Read, SearchCodebase, RunCommand, Glob | ⏳ 待开始 |
| 2-3 | 首页接口联调 | **Claude Opus 4** | Read, SearchCodebase, RunCommand | ⏳ 待开始 |
| 2-4 | 攻略详情页联调 | Claude Sonnet 4 | Read, SearchCodebase, RunCommand | ⏳ 待开始 |
| 2-5 | Tier List页面联调 | Claude Sonnet 4 | Read, SearchCodebase, RunCommand | ⏳ 待开始 |
| 2-6 | 创作者中心联调 | **Claude Opus 4** | Read, SearchCodebase, RunCommand | ⏳ 待开始 |
| 2-7 | Markdown渲染完善 | Claude Sonnet 4 | Read, SearchCodebase, Edit, RunCommand | ⏳ 待开始 |
| 2-8 | Algolia搜索UI完善 | Claude Sonnet 4 | Read, SearchCodebase, Edit, RunCommand | ⏳ 待开始 |
| 2-9 | 用户认证实现 | **Claude Opus 4** | Read, SearchCodebase, Edit, RunCommand | ⏳ 待开始 |
| 2-10 | 联盟链接重定向完善 | Claude Sonnet 4 | Read, SearchCodebase, Edit, RunCommand | ⏳ 待开始 |

### Phase 3: AI自动化系统（中优先级）

| 任务ID | 任务名称 | 负责模型 | 用到的工具/技能 | 状态 |
|-------|---------|---------|----------------|------|
| 3-1 | n8n部署（Railway自托管） | **Claude Opus 4** | Read, WebSearch, RunCommand | ⏳ 待开始 |
| 3-2 | 工作流1：兑换码监听 | **Claude Opus 4** | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 3-3 | 工作流2：Patch Notes监听 | Claude Sonnet 4 | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 3-4 | 工作流3：AI文章流水线 | **Claude Opus 4** | Read, SearchCodebase, Edit, RunCommand | ⏳ 待开始 |
| 3-5 | 工作流4：社媒分发 | Claude Sonnet 4 | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 3-6 | 工作流5：夜间维护 | Claude Haiku | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 3-7 | IGDB批量导入脚本 | Claude Sonnet 4 | Read, SearchCodebase, Edit, RunCommand | ⏳ 待开始 |
| 3-8 | Dify RAG助手部署 | **Claude Opus 4** | Read, WebSearch, RunCommand | ⏳ 待开始 |

### Phase 4: SEO与变现（中优先级）

| 任务ID | 任务名称 | 负责模型 | 用到的工具/技能 | 状态 |
|-------|---------|---------|----------------|------|
| 4-1 | 动态XML Sitemap | Claude Haiku | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 4-2 | Schema.org结构化数据 | **Claude Opus 4** | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 4-3 | robots.txt配置 | Claude Haiku | Read, Edit | ⏳ 待开始 |
| 4-4 | OpenGraph图片生成 | Claude Sonnet 4 | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 4-5 | Google AdSense广告位 | Claude Sonnet 4 | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 4-6 | 联盟链接配置 | Claude Sonnet 4 | Read, SearchCodebase, Edit | ⏳ 待开始 |
| 4-7 | Stripe付费会员系统 | **Claude Opus 4** | Read, SearchCodebase, Edit, RunCommand | ⏳ 待开始 |

### Phase 5: 部署上线（高优先级）

| 任务ID | 任务名称 | 负责模型 | 用到的工具/技能 | 状态 |
|-------|---------|---------|----------------|------|
| 5-1 | .env.local配置 | Claude Haiku | Read, Edit, RunCommand | 🔄 进行中 |
| 5-2 | Railway PostgreSQL部署 | **Claude Opus 4** | Read, WebSearch, RunCommand | ⏳ 待开始 |
| 5-3 | Prisma migrate初始化 | Claude Sonnet 4 | Read, RunCommand | ⏳ 待开始 |
| 5-4 | Vercel部署 | **Claude Opus 4** | Read, WebSearch, RunCommand, TodoWrite | ⏳ 待开始 |
| 5-5 | Cloudflare配置 | Claude Sonnet 4 | Read, WebSearch, RunCommand | ⏳ 待开始 |
| 5-6 | Upstash Redis配置 | Claude Haiku | Read, WebSearch, Edit | ⏳ 待开始 |
| 5-7 | Algolia索引初始化 | Claude Sonnet 4 | Read, SearchCodebase, RunCommand | ⏳ 待开始 |
| 5-8 | Google Search Console提交 | Claude Haiku | Read, WebSearch | ⏳ 待开始 |

---

## 🔧 三、前置任务（必须先完成）

### 前置任务1: Lib库完整实现
**负责模型**: Claude Opus 4  
**优先级**: 🔴 最高  
**涉及文件**:
- `src/lib/db.ts` - Prisma Client初始化
- `src/lib/redis.ts` - Upstash Redis连接
- `src/lib/algolia.ts` - Algolia搜索
- `src/lib/igdb.ts` - IGDB游戏API
- `src/lib/steam.ts` - Steam API
- `src/lib/auth.ts` - NextAuth配置
- `src/lib/utils.ts` - 工具函数

### 前置任务2: 数据库初始化
**负责模型**: Claude Sonnet 4  
**优先级**: 🔴 最高  
**任务内容**:
- 创建SQLite本地数据库
- 执行Prisma Migrate
- 创建种子数据填充脚本

### 前置任务3: .env.local配置
**负责模型**: Claude Haiku  
**优先级**: 🔴 最高  
**任务内容**:
- 从.env.example复制
- 配置基础环境变量
- 配置数据库连接

---

## 📝 四、工具与技能使用策略

### 高优先级工具（必须掌握）

| 工具 | 用途 | 适用模型 | 调用时机 |
|-----|------|---------|---------|
| `TodoWrite` | 任务规划与跟踪 | **所有模型** | 每个任务开始前 |
| `Read` | 读取文件 | **所有模型** | 需要查看代码时 |
| `SearchCodebase` | 代码库搜索 | **Opus/Sonnet** | 需要查找代码模式时 |
| `RunCommand` | 执行命令/脚本 | **所有模型** | 需要运行npm/其他命令时 |
| `Edit` | 修改文件 | **所有模型** | 需要编辑现有文件时 |
| `Write` | 创建新文件 | **所有模型** | 需要创建新文件时 |
| `Glob` | 文件查找 | **Haiku/Sonnet** | 需要批量查找文件时 |
| `GetDiagnostics` | 类型/错误检查 | **所有模型** | 完成代码后需要验证时 |

### 中优先级工具

| 工具 | 用途 | 适用模型 |
|-----|------|---------|
| `WebSearch` | 网络搜索 | **Opus/Sonnet** |
| `WebFetch` | 网页内容获取 | **Opus/Sonnet** |
| `AskUserQuestion` | 用户提问 | **所有模型** |
| `search` | 子代理搜索 | **Claude Opus 4** |

### 低优先级工具

| 工具 | 用途 | 适用模型 |
|-----|------|---------|
| `DeleteFile` | 删除文件 | **Claude Haiku** |
| `Skill` | 技能调用 | **Claude Opus 4** |

---

## 🎯 五、模型自动选择规则

### Rule 1: 默认优先 Claude Opus 4
```
任何未明确指定的任务 → 默认使用 Claude Opus 4
```

### Rule 2: 任务复杂度判断标准

| 任务特征 | 推荐模型 |
|---------|---------|
| 需要跨文件/跨模块协调 | **Claude Opus 4** |
| 需要深度思考或决策 | **Claude Opus 4** |
| 系统架构/核心逻辑 | **Claude Opus 4** |
| 单文件/单组件修改 | **Claude Sonnet 4** |
| 明确简单的执行任务 | **Claude Sonnet 4** |
| 批量/重复工作 | **Claude Haiku** |
| 文档/注释/格式化 | **Claude Haiku** |

### Rule 3: 模型降级策略
```
1. Claude Opus 4 响应超时 → 切换到 Claude Sonnet 4
2. Claude Sonnet 4 响应超时 → 切换到 Claude Haiku
3. 记录失败情况，后续再用 Claude Opus 4 重新处理
```

---

## 🚀 六、执行优先级（2026-05-10）

### 第一优先级（立即开始）
1. 🔄 **5-1**: .env.local配置（Claude Haiku）
2. ⏳ **前置1**: Lib库完整实现（Claude Opus 4）
3. ⏳ **前置2**: 数据库初始化（Claude Sonnet 4）
4. ⏳ **2-1**: 兑换码页面联调（Claude Opus 4）
5. ⏳ **2-2**: 游戏库页面联调（Claude Opus 4）
6. ⏳ **2-3**: 首页接口联调（Claude Opus 4）

### 第二优先级（本周内）
7. ⏳ **2-4** 至 **2-10**: Phase 2 剩余任务
8. ⏳ **4-1** 至 **4-4**: 基础SEO功能
9. ⏳ **2-9**: 用户认证实现

### 第三优先级（本月内）
10. ⏳ **Phase 3**: AI自动化系统
11. ⏳ **4-5** 至 **4-7**: 变现功能
12. ⏳ **Phase 5**: 部署上线

---

## ✅ 七、执行前检查清单

每次开始新任务前，确认：

- [ ] 已阅读 `PROJECT_PROGRESS.md` 了解当前进度
- [ ] 已阅读 `PROJECT_ANALYSIS.md` 了解项目现状
- [ ] 已阅读 `MODEL_STRATEGY.md` 确定负责模型
- [ ] 已阅读 `MODEL_ASSIGNMENT.md`（本文档）
- [ ] 使用 `TodoWrite` 规划子任务
- [ ] 确认当前使用的模型正确
- [ ] 确认前置任务已完成

---

## 📌 八、记忆与上下文保持

### 每次对话开始时
1. **读取关键文档**:
   - `PROJECT_ANALYSIS.md` - 项目现状分析
   - `MODEL_ASSIGNMENT.md` - 本文档
   - `PROJECT_PROGRESS.md` - 进度文档

2. **确认当前任务**:
   - 查看TodoWrite中的待办项
   - 确认负责的模型正确
   - 确认前置条件已满足

3. **任务执行**:
   - 严格按模型分工执行
   - 及时更新进度文档
   - 完成后标记状态

### 任务完成后
1. 更新 `PROJECT_PROGRESS.md`
2. 更新TodoWrite状态
3. 报告完成情况给用户

---

**文档维护**: 每次完成Phase任务后更新此文档  
**下次评审**: 完成Phase 2主要任务后
