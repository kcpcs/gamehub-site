# GameHub · 详细执行计划 2026-05-10

**文档版本**: 1.0  
**创建日期**: 2026-05-10  
**总任务数**: 35个主要任务  
**预计完成时间**: 2-3周

---

## 📋 一、任务执行总览

### 阶段时间线
```
第1天-第2天: 基础设施与配置
第3天-第5天: Phase 2 页面联调
第6天-第8天: Phase 4 SEO基础
第9天-第12天: Phase 3 AI自动化
第13天-第14天: Phase 5 部署上线
```

---

## 🎯 二、详细执行计划

### Phase A: 基础设施（第1天 - 第2天）

#### 任务A1: 创建.env.local配置文件
**负责模型**: Claude Haiku  
**预计时间**: 30分钟  
**优先级**: 🔴 最高  

**具体步骤**:
1. 从 `.env.example` 复制创建 `.env.local`
2. 配置基础环境变量：
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Next Auth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Site
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
3. 测试环境变量加载

**依赖**: 无  
**输出**: `.env.local` 文件

---

#### 任务A2: Lib库完整实现 - db.ts
**负责模型**: Claude Opus 4  
**预计时间**: 1小时  
**优先级**: 🔴 最高  

**具体步骤**:
1. 完善 `src/lib/db.ts`
2. 实现Prisma Client单例模式
3. 添加错误处理和日志
4. 测试数据库连接

**依赖**: 任务A1完成  
**输出**: 可用的Prisma Client

---

#### 任务A3: Lib库完整实现 - redis.ts
**负责模型**: Claude Sonnet 4  
**预计时间**: 45分钟  
**优先级**: 🔴 最高  

**具体步骤**:
1. 完善 `src/lib/redis.ts`
2. 实现Upstash Redis连接
3. 添加缓存辅助函数
4. 添加mock实现（无真实账号时）

**依赖**: 任务A1完成  
**输出**: Redis连接库

---

#### 任务A4: Lib库完整实现 - algolia.ts
**负责模型**: Claude Sonnet 4  
**预计时间**: 45分钟  
**优先级**: 🟡 高  

**具体步骤**:
1. 完善 `src/lib/algolia.ts`
2. 实现搜索索引函数
3. 添加mock实现
4. 测试基础功能

**依赖**: 任务A1完成  
**输出**: Algolia搜索库

---

#### 任务A5: Lib库完整实现 - igdb.ts & steam.ts
**负责模型**: Claude Sonnet 4  
**预计时间**: 1小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 完善 `src/lib/igdb.ts`
2. 完善 `src/lib/steam.ts`
3. 添加API调用函数
4. 添加mock实现

**依赖**: 任务A1完成  
**输出**: IGDB和Steam库

---

#### 任务A6: Lib库完整实现 - auth.ts & utils.ts
**负责模型**: Claude Opus 4  
**预计时间**: 1.5小时  
**优先级**: 🔴 最高  

**具体步骤**:
1. 完善 `src/lib/auth.ts` - NextAuth配置
2. 完善 `src/lib/utils.ts` - 工具函数
3. 添加类型安全的辅助函数
4. 测试所有导出函数

**依赖**: 任务A1完成  
**输出**: 完整的lib库

---

#### 任务A7: 数据库初始化 - SQLite本地
**负责模型**: Claude Sonnet 4  
**预计时间**: 1.5小时  
**优先级**: 🔴 最高  

**具体步骤**:
1. 创建SQLite数据库
2. 运行 `prisma migrate dev`
3. 创建种子数据脚本
4. 填充测试游戏数据
5. 填充测试攻略数据
6. 填充测试兑换码数据
7. 验证数据库连接

**依赖**: 任务A2完成  
**输出**: 可用的数据库 + 测试数据

---

### Phase B: Phase 2 页面联调（第3天 - 第5天）

#### 任务B1: 兑换码页面联调
**负责模型**: Claude Opus 4  
**预计时间**: 2小时  
**优先级**: 🔴 最高  

**具体步骤**:
1. 完善 `/api/codes/[game]/route.ts`
   - 实现GET获取兑换码
   - 实现POST提交新代码
   - 添加验证逻辑
   - 添加缓存策略
2. 更新 `codes/[game]/page.tsx`
   - 移除静态占位数据
   - 集成真实API
   - 添加加载状态
   - 添加错误处理
3. 端到端测试

**依赖**: 任务A7完成  
**输出**: 完整工作的兑换码页面

---

#### 任务B2: 游戏库页面联调
**负责模型**: Claude Opus 4  
**预计时间**: 2小时  
**优先级**: 🔴 最高  

**具体步骤**:
1. 完善 `/api/games/route.ts`
   - 实现筛选逻辑
   - 实现分页
   - 添加缓存
2. 更新 `games/page.tsx`
   - 移除静态数据
   - 集成真实API
   - 优化筛选UI
3. 端到端测试

**依赖**: 任务A7完成  
**输出**: 完整工作的游戏库页面

---

#### 任务B3: 首页接口联调
**负责模型**: Claude Opus 4  
**预计时间**: 2小时  
**优先级**: 🔴 最高  

**具体步骤**:
1. 更新 `page.tsx`
   - 移除静态占位游戏
   - 从API获取热门游戏
   - 优化Hero区域
   - 添加真实统计数据
2. 测试所有链接
3. 优化性能

**依赖**: 任务B2完成  
**输出**: 完整工作的首页

---

#### 任务B4: 攻略详情页联调
**负责模型**: Claude Sonnet 4  
**预计时间**: 2小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 完善 `/api/guides/[slug]/route.ts`
2. 更新 `guides/[slug]/page.tsx`
   - Markdown渲染
   - 目录导航
   - 相关攻略推荐
3. 测试

**依赖**: 任务A7完成  
**输出**: 完整工作的攻略详情页

---

#### 任务B5: Tier List页面联调
**负责模型**: Claude Sonnet 4  
**预计时间**: 2小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 完善 `/api/tierlist/[game]/route.ts`
2. 完善 `/api/tierlist/vote/route.ts`
3. 更新 `tier-list/[game]/page.tsx`
4. 实现投票功能（需要用户认证）
5. 测试

**依赖**: 任务A7完成  
**输出**: 完整工作的Tier List页面

---

#### 任务B6: 创作者中心联调
**负责模型**: Claude Opus 4  
**预计时间**: 2.5小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 完善内部API路由
2. 更新 `creator/studio/page.tsx`
3. 实现Markdown编辑器
4. 测试创建/编辑流程
5. 测试

**依赖**: 任务A7完成  
**输出**: 完整工作的创作者中心

---

#### 任务B7: Markdown渲染完善
**负责模型**: Claude Sonnet 4  
**预计时间**: 1小时  
**优先级**: 🟡 中  

**具体步骤**:
1. 完善 `components/MarkdownRenderer.tsx`
2. 添加代码高亮
3. 添加图片优化
4. 测试渲染效果

**依赖**: 任务B4完成  
**输出**: 完善的Markdown渲染

---

#### 任务B8: Algolia搜索UI完善
**负责模型**: Claude Sonnet 4  
**预计时间**: 1小时  
**优先级**: 🟡 中  

**具体步骤**:
1. 完善 `components/SearchModal.tsx`
2. 集成搜索API
3. 添加防抖优化
4. 测试搜索功能

**依赖**: 任务A4完成  
**输出**: 完善的搜索功能

---

#### 任务B9: 用户认证实现
**负责模型**: Claude Opus 4  
**预计时间**: 2.5小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 完善 `api/auth/[...nextauth]/route.ts`
2. 配置Google OAuth（需要用户提供凭证）
3. 添加登录/注册UI
4. 保护需要认证的路由
5. 测试认证流程

**依赖**: 任务A6完成  
**输出**: 完整的用户认证系统

---

#### 任务B10: 联盟链接重定向完善
**负责模型**: Claude Sonnet 4  
**预计时间**: 1小时  
**优先级**: 🟡 中  

**具体步骤**:
1. 完善 `go/[partner]/route.ts`
2. 实现点击追踪逻辑
3. 添加数据库记录
4. 测试重定向

**依赖**: 任务A7完成  
**输出**: 完善的联盟追踪

---

### Phase C: Phase 4 SEO基础（第6天 - 第8天）

#### 任务C1: 动态XML Sitemap
**负责模型**: Claude Haiku  
**预计时间**: 1小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 创建 `sitemap.ts`
2. 实现动态URL生成
3. 添加所有游戏、攻略页面
4. 测试sitemap.xml

**依赖**: 任务A7完成  
**输出**: sitemap.ts

---

#### 任务C2: Schema.org结构化数据
**负责模型**: Claude Opus 4  
**预计时间**: 2小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 完善 `components/SchemaOrg.tsx`
2. 集成到所有相关页面
3. 添加Article、Game、HowTo等schema
4. 测试Google Rich Results

**依赖**: 任务B完成  
**输出**: 完整的Schema.org集成

---

#### 任务C3: robots.txt配置
**负责模型**: Claude Haiku  
**预计时间**: 30分钟  
**优先级**: 🟡 中  

**具体步骤**:
1. 创建 `robots.ts`
2. 配置允许/禁止的路径
3. 指向sitemap
4. 测试

**依赖**: 任务C1完成  
**输出**: robots.ts

---

#### 任务C4: OpenGraph图片生成
**负责模型**: Claude Sonnet 4  
**预计时间**: 2小时  
**优先级**: 🟡 中  

**具体步骤**:
1. 创建 `og/route.tsx`
2. 使用 `next/og` 生成图片
3. 集成到页面meta
4. 测试分享预览

**依赖**: 无  
**输出**: OG图片生成

---

### Phase D: Phase 3 AI自动化（第9天 - 第12天）

#### 任务D1: n8n部署（Railway自托管）
**负责模型**: Claude Opus 4  
**预计时间**: 2小时  
**优先级**: 🟡 中  

**具体步骤**:
1. 准备Railway部署配置
2. 配置环境变量
3. 部署n8n
4. 测试n8n界面访问

**依赖**: 用户完成Railway注册  
**输出**: 运行中的n8n实例

---

#### 任务D2-D7: n8n工作流导入与测试
**负责模型**: Claude Sonnet 4  
**预计时间**: 4小时（共6个工作流）  
**优先级**: 🟡 中  

**具体步骤**:
1. 导入6个工作流JSON
2. 配置每个工作流的触发器
3. 配置API凭证
4. 逐个测试工作流
5. 错误修复

**工作流清单**:
- 01-redemption-code-monitor.json
- 02-patch-notes-monitor.json
- 03-ai-article-pipeline.json
- 04-social-media-distribution.json
- 05-nightly-maintenance.json
- 06-igdb-batch-import.json

**依赖**: 任务D1完成  
**输出**: 全部工作流正常运行

---

#### 任务D8: Dify RAG助手部署
**负责模型**: Claude Opus 4  
**预计时间**: 2小时  
**优先级**: 🟢 低  

**具体步骤**:
1. 参考 `gamehub-n8n/DIFY_RAG_SETUP.md`
2. 部署Dify（或使用云服务）
3. 创建知识库
4. 配置API
5. 集成到网站

**依赖**: 用户完成Dify注册  
**输出**: RAG助手集成

---

### Phase E: Phase 5 部署上线（第13天 - 第14天）

#### 任务E1: Railway PostgreSQL部署
**负责模型**: Claude Opus 4  
**预计时间**: 1.5小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 在Railway创建PostgreSQL
2. 获取连接字符串
3. 更新生产环境变量
4. 测试连接

**依赖**: 用户完成Railway注册  
**输出**: 生产数据库

---

#### 任务E2: Prisma migrate初始化（生产）
**负责模型**: Claude Sonnet 4  
**预计时间**: 1小时  
**优先级**: 🟡 高  

**具体步骤**:
1. 创建生产migration
2. 运行 `prisma migrate deploy`
3. 验证表结构
4. 导入初始数据（可选）

**依赖**: 任务E1完成  
**输出**: 生产数据库就绪

---

#### 任务E3: Vercel部署
**负责模型**: Claude Opus 4  
**预计时间**: 2小时  
**优先级**: 🔴 最高  

**具体步骤**:
1. 准备Vercel配置
2. 配置环境变量
3. 部署到Vercel
4. 测试生产环境
5. 配置域名（可选）

**依赖**: 任务E2完成 + 用户完成Vercel注册  
**输出**: 网站在线运行

---

#### 任务E4: Upstash Redis配置（生产）
**负责模型**: Claude Haiku  
**预计时间**: 45分钟  
**优先级**: 🟡 中  

**具体步骤**:
1. 注册Upstash
2. 创建Redis实例
3. 更新环境变量
4. 测试缓存

**依赖**: 用户完成Upstash注册  
**输出**: 生产Redis

---

#### 任务E5: Algolia索引初始化（生产）
**负责模型**: Claude Sonnet 4  
**预计时间**: 1小时  
**优先级**: 🟡 中  

**具体步骤**:
1. 注册Algolia
2. 创建索引
3. 批量导入数据
4. 测试搜索

**依赖**: 用户完成Algolia注册  
**输出**: 生产搜索索引

---

#### 任务E6: Cloudflare配置（可选）
**负责模型**: Claude Sonnet 4  
**预计时间**: 2小时  
**优先级**: 🟢 低  

**具体步骤**:
1. 配置DNS
2. 配置CDN
3. 配置R2存储（图片）
4. 测试加速效果

**依赖**: 用户完成Cloudflare注册  
**输出**: Cloudflare配置完成

---

#### 任务E7: Google Search Console提交
**负责模型**: Claude Haiku  
**预计时间**: 30分钟  
**优先级**: 🟢 低  

**具体步骤**:
1. 验证网站所有权
2. 提交sitemap
3. 请求索引
4. 监控搜索控制台

**依赖**: 任务E3完成  
**输出**: 网站已提交到Google

---

### Phase F: 变现功能（后期，按需）

#### 任务F1: Google AdSense广告位
**负责模型**: Claude Sonnet 4  
**预计时间**: 1.5小时  
**优先级**: 🟢 低  

**具体步骤**:
1. 注册AdSense（用户操作）
2. 集成广告位
3. 配置广告展示规则
4. 测试广告加载

**依赖**: 用户完成AdSense注册  
**输出**: AdSense集成

---

#### 任务F2: 联盟链接配置
**负责模型**: Claude Sonnet 4  
**预计时间**: 1小时  
**优先级**: 🟢 低  

**具体步骤**:
1. 注册Green Man Gaming联盟
2. 注册Amazon联盟
3. 配置联盟链接
4. 测试跳转和追踪

**依赖**: 用户完成联盟注册  
**输出**: 联盟链接配置

---

#### 任务F3: Stripe付费会员系统
**负责模型**: Claude Opus 4  
**预计时间**: 3小时  
**优先级**: 🟢 低  

**具体步骤**:
1. 注册Stripe（用户操作）
2. 创建产品和价格
3. 实现checkout session
4. 实现webhook处理
5. 实现会员功能
6. 测试支付流程

**依赖**: 用户完成Stripe注册  
**输出**: 完整的付费会员系统

---

## 📊 三、依赖关系图

```
A1 (.env) → A2-A6 (lib) → A7 (数据库)
                      ↓
    ┌─────────────────┼─────────────────┐
    ↓                 ↓                 ↓
  B1 (兑换码)      B2 (游戏库)      B3 (首页)
    ↓                 ↓                 ↓
  B4-B10 (其他页面) ──┴─────────────────┘
                      ↓
    ┌─────────────────┼─────────────────┐
    ↓                 ↓                 ↓
  C1-C4 (SEO)      D1-D8 (AI自动化)  E1-E7 (部署)
                      ↓                 ↓
                  F1-F3 (变现)      项目完成 🎉
```

---

## 🎯 四、快速开始路线（MVP版本）

如果要快速上线MVP，优先完成：
1. ✅ A1-A7 (基础设施)
2. ✅ B1-B3 (核心页面)
3. ✅ C1-C3 (基础SEO)
4. ✅ E1-E3 (部署上线)

**预计MVP时间**: 5-7天

---

## ✅ 五、完成检查清单

### 每日结束前检查
- [ ] 更新PROJECT_PROGRESS.md
- [ ] 更新TodoWrite状态
- [ ] 提交代码（如有git）
- [ ] 记录遇到的问题
- [ ] 确认明天的任务

### 每个任务完成检查
- [ ] 代码已编写
- [ ] 已运行GetDiagnostics检查
- [ ] 已测试功能
- [ ] 无TypeScript错误
- [ ] 文档已更新

---

**文档维护**: 每周更新进度  
**下次评审**: MVP上线后
