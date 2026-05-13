# GameHub 管理员后台后端优化任务

## 📋 任务概述

请你作为 **Claude Opus 4**（主力旗舰模型），负责全面优化 GameHub 游戏资讯网站的管理员后台后端系统。

---

## 🏗️ 当前项目架构

### 技术栈
- **框架**: Next.js 16.2.6 + TypeScript
- **数据库**: Prisma ORM + SQLite (dev) / Turso/PostgreSQL (prod)
- **缓存**: Upstash Redis
- **搜索**: Algolia
- **AI**: Claude API (jiekou.ai代理)
- **认证**: NextAuth v5 + 自定义管理员认证

### 项目结构
```
site/
├── prisma/
│   └── schema.prisma          # 数据库Schema（完整）
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── admin/         # 管理员API（已有基础）
│   │       ├── games/         # 游戏API
│   │       ├── articles/      # 文章API
│   │       ├── codes/         # 兑换码API
│   │       └── ...
│   ├── lib/
│   │   ├── db.ts              # Prisma客户端
│   │   ├── admin-auth.ts      # 管理员认证
│   │   └── ...
│   └── components/
└── package.json
```

---

## 🎯 当前API状态

### ✅ 已存在的管理员API
```
/api/admin/auth/login          # 登录
/api/admin/auth/logout         # 登出
/api/admin/dashboard           # 仪表盘统计
/api/admin/games               # 游戏管理（列表/创建）
/api/admin/articles            # 文章管理（列表/创建）
/api/admin/codes               # 兑换码管理（列表/创建）
/api/admin/users               # 用户管理（列表）
/api/admin/comments            # 评论管理（列表）
/api/admin/tierlists           # Tier List管理（列表）
/api/admin/settings            # 系统设置
/api/admin/audit-logs          # 审计日志
/api/admin/ai-players          # AI玩家管理
/api/admin/roles               # 角色权限
/api/admin/subscribers         # 订阅者
/api/admin/backup              # 备份恢复
/api/admin/import-export       # 数据导入导出
```

### 🆕 刚刚新增的API（单个资源操作）
```
/api/admin/games/[id]          # GET/PATCH/DELETE
/api/admin/articles/[id]       # GET/PATCH/DELETE
/api/admin/codes/[id]          # GET/PATCH/DELETE
/api/admin/users/[id]          # GET/PATCH/DELETE
/api/admin/comments/[id]       # GET/PATCH/DELETE
/api/admin/tierlists/[id]      # GET/PATCH/DELETE
/api/admin/subscribers/[id]    # GET/PATCH/DELETE
/api/admin/roles/[id]          # GET/PATCH/DELETE
/api/admin/ai-players/[id]     # GET/PATCH/DELETE
/api/admin/admin-users/[id]    # GET/PATCH/DELETE
```

---

## 📊 数据库Schema

### 核心模型（完整定义见 prisma/schema.prisma）

```prisma
// 游戏
model Game {
  id           String    @id @default(cuid())
  slug         String    @unique
  name         String
  cover_url    String
  platforms    Json      @default("[]")
  genres       Json      @default("[]")
  developer    String?
  publisher    String?
  release_date DateTime?
  articles     Article[]
  codes        GameCode[]
  tier_lists   TierList[]
  created_at   DateTime  @default(now())
}

// 文章/攻略
model Article {
  id            String        @id @default(cuid())
  slug          String        @unique
  title         String
  content       String
  article_type  ArticleType   // guide | news | codes | tierlist
  status        ArticleStatus // draft | review | published | archived
  game_id       String?
  author_id     String?
  seo_title     String
  seo_desc      String
  created_at    DateTime      @default(now())
}

// 兑换码
model GameCode {
  id          String     @id @default(cuid())
  code        String
  game_id     String
  reward_desc String
  status      CodeStatus // active | expired | unverified
  source      CodeSource
  expires_at  DateTime?
}

// Tier List
model TierList {
  id            String        @id @default(cuid())
  game_id       String
  category      TierCategory  // character | weapon | class
  patch_version String
  entries       TierEntry[]
}

// 用户
model User {
  id              String        @id @default(cuid())
  email           String        @unique
  username        String        @unique
  membership      MembershipType
  creator_level   CreatorLevel
  points          Int           @default(0)
}

// 管理员
model AdminUser {
  id            String        @id @default(cuid())
  email         String        @unique
  username      String        @unique
  password_hash String
  role          AdminRoleType // super_admin | admin | moderator | editor
  last_login_at DateTime?
  created_at    DateTime      @default(now())
}

// AI玩家（仿真实用户）
model AIPlayer {
  id           String        @id @default(cuid())
  username     String        @unique
  personality  Json
  status       AIPlayerStatus
  activity_logs AIActivityLog[]
}

// 审计日志
model AuditLog {
  id            String    @id @default(cuid())
  admin_id      String?
  action        AuditAction
  resource_type String
  resource_id   String?
  details       Json
  created_at    DateTime  @default(now())
}

// 系统设置
model SystemSetting {
  id         String   @id @default(cuid())
  key        String   @unique
  value      String
  value_type String
  group      String?
}

// 订阅者
model Subscriber {
  id         String   @id @default(cuid())
  email      String   @unique
  status     String
  games      String?  // JSON array
}
```

---

## 🔧 需要优化的功能清单

### 1. 管理员认证与权限 ✅ 基础已存在，需完善
- [ ] 密码重置功能
- [ ] 双因素认证（2FA）
- [ ] 登录限流/防暴力破解
- [ ] 会话超时自动登出
- [ ] 密码强度验证
- [ ] 管理员创建/编辑/删除完整功能

### 2. 游戏管理 🎮
- [ ] 游戏信息完整CRUD（已新增单个API）
- [ ] 批量导入游戏（从IGDB/Steam）
- [ ] 游戏封面/截图上传
- [ ] 游戏标签/分类管理
- [ ] 游戏状态管理（推荐/热门/新游）
- [ ] 游戏评分管理
- [ ] 游戏排序/优先级设置

### 3. 文章/攻略管理 📝
- [ ] 文章完整CRUD（已新增单个API）
- [ ] Markdown编辑器集成
- [ ] 草稿自动保存
- [ ] 文章审核工作流
- [ ] SEO元数据编辑
- [ ] 文章分类/标签管理
- [ ] 文章预览功能
- [ ] 文章版本历史
- [ ] 批量操作（发布/归档/删除）

### 4. 兑换码管理 🎁
- [ ] 兑换码完整CRUD（已新增单个API）
- [ ] 批量导入兑换码
- [ ] 兑换码自动验证（测试可用性）
- [ ] 兑换码过期提醒
- [ ] 兑换码来源追踪
- [ ] 兑换码使用统计

### 5. Tier List管理 🏆
- [ ] Tier List完整CRUD（已新增单个API）
- [ ] Tier条目拖拽排序
- [ ] Tier模板管理
- [ ] 社区投票管理
- [ ] Tier历史版本

### 6. 用户管理 👥
- [ ] 用户完整CRUD（已新增单个API）
- [ ] 用户状态管理（禁言/封禁）
- [ ] 用户角色/权限调整
- [ ] 用户积分管理
- [ ] 用户行为日志
- [ ] 批量用户操作

### 7. 评论管理 💬
- [ ] 评论完整CRUD（已新增单个API）
- [ ] 评论审核功能
- [ ] 批量审核/删除
- [ ] 敏感词过滤
- [ ] 评论举报处理

### 8. AI玩家管理 🤖
- [ ] AI玩家完整CRUD
- [ ] AI玩家行为配置
- [ ] AI玩家启动/停止控制
- [ ] AI活动日志查看
- [ ] AI统计报表

### 9. 数据分析与报表 📊
- [ ] 网站流量统计
- [ ] 内容发布统计
- [ ] 用户增长趋势
- [ ] 兑换码使用统计
- [ ] 热门游戏排行
- [ ] 数据可视化API
- [ ] 自定义日期范围报表
- [ ] 导出报表（CSV/PDF）

### 10. 系统设置 ⚙️
- [ ] 系统设置完整CRUD
- [ ] 设置分组管理
- [ ] 设置验证规则
- [ ] 设置变更日志

### 11. 备份与恢复 💾
- [ ] 手动备份功能
- [ ] 自动备份调度
- [ ] 备份下载
- [ ] 从备份恢复
- [ ] 备份历史管理

### 12. 数据导入导出 📤
- [ ] 游戏数据导入/导出
- [ ] 文章数据导入/导出
- [ ] 兑换码批量导入
- [ ] 支持多种格式（JSON/CSV/Excel）

### 13. 审计日志 🔍
- [ ] 审计日志查询API
- [ ] 日志筛选（按时间/操作/管理员）
- [ ] 日志导出
- [ ] 日志保留策略

### 14. 角色与权限管理 🛡️
- [ ] 角色完整CRUD
- [ ] 权限精细配置
- [ ] 角色分配管理
- [ ] 权限继承机制

### 15. 订阅者管理 📧
- [ ] 订阅者完整CRUD
- [ ] 订阅者分组
- [ ] 邮件模板管理
- [ ] 批量发送通知
- [ ] 订阅统计

### 16. 视频管理 📺
- [ ] 视频CRUD（已有基础视频API）
- [ ] 视频审核
- [ ] 视频状态管理
- [ ] 视频标签管理
- [ ] 视频统计

### 17. 系统监控与健康检查 🔬
- [ ] 服务健康检查API
- [ ] 性能监控
- [ ] 错误日志查看
- [ ] 服务器资源监控
- [ ] 告警通知

### 18. 多语言与本地化 🌍
- [ ] 多语言内容管理
- [ ] 翻译管理
- [ ] 语言切换

---

## 🎯 核心优化要求

### 原则1：前后端完全分离
- ❌ **禁止前端直接操作数据库**
- ✅ 所有操作通过API进行
- ✅ API需返回统一格式响应
- ✅ 完善的错误处理

### 原则2：权限控制
- ✅ 每个API都要验证管理员身份
- ✅ 按角色权限控制访问
- ✅ 敏感操作需要二次确认
- ✅ 所有操作记录审计日志

### 原则3：性能优化
- ✅ 使用Redis缓存热点数据
- ✅ 数据库查询优化（索引/分页）
- ✅ 批量操作优化
- ✅ 异步处理耗时任务

### 原则4：安全优先
- ✅ 输入验证（使用Zod）
- ✅ SQL注入防护
- ✅ XSS防护
- ✅ CSRF防护
- ✅ 速率限制

### 原则5：可维护性
- ✅ 代码结构清晰
- ✅ 类型安全（TypeScript）
- ✅ 错误处理统一
- ✅ 日志完善
- ✅ 注释充分

---

## 📝 API响应格式规范

### 成功响应
```typescript
{
  success: true,
  data: any,
  message?: string
}
```

### 错误响应
```typescript
{
  success: false,
  error: string,
  code?: string, // 错误码
  details?: any
}
```

### 分页响应
```typescript
{
  success: true,
  data: any[],
  pagination: {
    page: number,
    page_size: number,
    total: number,
    total_pages: number
  }
}
```

---

## 🔐 权限检查规范

每个管理员API必须：

1. **调用 `adminAuth(request)` 验证身份**
2. **检查权限 `permissions.canManageXxx`**
3. **记录审计日志 `createAuditLog(...)`**
4. **返回适当的错误码**

示例：
```typescript
// /api/admin/games/route.ts
import { adminAuth, createAuditLog } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const auth = await adminAuth(request)
  
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: '未授权访问' },
      { status: 401 }
    )
  }
  
  if (!auth.permissions.canManageGames) {
    return NextResponse.json(
      { success: false, error: '权限不足' },
      { status: 403 }
    )
  }
  
  // ... 业务逻辑 ...
  
  await createAuditLog({
    admin_id: auth.admin?.id,
    action: 'create',
    resource_type: 'game',
    resource_id: newGame.id,
    details: { name: newGame.name },
    success: true
  }, request)
  
  return NextResponse.json({ success: true, data: newGame })
}
```

---

## 🚀 执行步骤

### Phase 1：完善现有API（高优先级）
1. 为所有管理员API添加完整的权限检查
2. 完善审计日志记录
3. 统一错误处理和响应格式
4. 优化数据库查询
5. 添加输入验证（Zod）

### Phase 2：缺失功能补充（中优先级）
1. 补充缺少的单个资源API（如视频、订阅者等）
2. 实现批量操作API
3. 实现搜索/筛选API
4. 实现统计/分析API

### Phase 3：高级功能（低优先级）
1. AI玩家管理完整功能
2. 高级数据分析
3. 备份恢复功能
4. 系统监控

---

## 📋 质量检查清单

完成每个功能后检查：

- [ ] 类型安全（TypeScript）
- [ ] 输入验证（Zod）
- [ ] 权限控制
- [ ] 审计日志
- [ ] 错误处理
- [ ] API文档（注释）
- [ ] 性能优化（缓存/索引）
- [ ] 安全检查
- [ ] 代码格式化
- [ ] 测试覆盖

---

## 🔗 相关文件参考

需要参考的文件：
- `prisma/schema.prisma` - 完整数据库定义
- `src/lib/admin-auth.ts` - 认证和权限系统
- `src/app/api/admin/dashboard/route.ts` - 仪表盘API示例
- `src/app/api/admin/games/route.ts` - 游戏管理API示例

---

## 🎯 最终目标

构建一个**功能完整、安全可靠、性能优秀**的管理员后台后端，支持：
- 日常运营管理
- 内容发布与审核
- 用户管理与分析
- 系统监控与维护
- 数据备份与恢复
- AI自动化运营

请开始优化！
