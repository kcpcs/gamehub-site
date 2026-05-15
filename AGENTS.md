# GameHub 项目 AI 智能体配置

> 本文件定义项目的 AI 智能体工作规则和配置

---

## ⚠️ 临时配置通知（立即生效）

### 重要：暂时禁用所有收费模型

**生效时间**：2026-05-16 起，直至用户另行通知

**配置内容**：
- ✅ **完全禁用自定义收费大模型** - 所有任务仅使用 TRAE CN 内置免费模型
- ✅ **禁止自动调用** - 绝对不允许未经用户明确申请就调用任何收费模型
- ✅ **持续有效** - 直到用户明确通知恢复为止

**当前联调任务模型分配**：
| 任务步骤 | 推荐模型 | 状态 |
|---------|---------|------|
| 步骤1：验证GET接口 | Doubao-Seed-2.0-Code | ✅ 免费 |
| 步骤2：验证POST接口 | Doubao-Seed-2.0-Code | ✅ 免费 |
| 步骤3：增强验证功能 | DeepSeek-V4-Pro | ✅ 免费 |
| 步骤4：增强前端交互 | Doubao-Seed-2.0-Code | ✅ 免费 |
| 步骤5：测试完整流程 | DeepSeek-V4-Pro | ✅ 免费 |

---

## 一、项目概述

### 1.1 项目信息

- **项目名称**：GameHub 国外游戏站
- **项目路径**：`F:\国外游戏站\site`
- **技术栈**：Next.js 14, TypeScript, Prisma, PostgreSQL, TailwindCSS
- **目标**：建立一个面向国外用户的游戏资讯、兑换码、Tier List 平台

### 1.2 核心功能模块

1. **游戏库** - 游戏展示、筛选、搜索
2. **兑换码** - 游戏兑换码管理
3. **攻略** - 游戏攻略文章
4. **Tier List** - 游戏角色/角色排名
5. **AI 自动化** - AI 玩家系统、内容自动生成
6. **创作者中心** - 用户生成内容管理

---

## 二、工作规范

### 2.1 必须遵守的规则

请在开始工作前阅读以下规则文件：

1. **`.trae/rules/WORKFLOW.md`** - 核心工作流程规范
2. **`.trae/rules/MODEL_MONITOR.md`** - 模型监控规则

### 2.2 模型优先级

**⚠️ 临时配置期间：所有收费模型禁用，仅使用以下免费模型**

**严格按照以下优先级使用模型：**

1. ✅ **唯一允许**：TRAE 内置免费模型
   - 🥇 **Doubao-Seed-2.0-Code** - 代码开发首选
   - 🥈 **DeepSeek-V4-Pro** - 复杂推理任务
   - 🥉 **DeepSeek-V4-Flash** - 快速批量任务
   - 🏅 **Kimi-K2.6** - 长文本处理
   - 🏅 **Doubao-Seed-1.8** - 简单快速任务

2. ❌ **完全禁用**：低成本付费模型
   - GLM-5.1（¥2/M）
   - Gemini 3.1 Pro（$1.25/M）

3. ❌ **完全禁用**：高质量付费模型
   - Claude Opus 4.7
   - GPT-5.4

**临时配置说明**：
- 即使任务极其复杂，也优先尝试免费模型
- 只有当免费模型连续3次明确无法完成相同任务时，才可以申请使用收费模型
- 申请必须包含详细的失败记录和证据

### 2.3 任务拆分要求

**所有复杂任务必须拆分：**

```
任务：开发完整的用户认证系统
├─ 步骤1：设计数据库模型（必须先确认）
├─ 步骤2：实现注册 API
├─ 步骤3：实现登录 API
├─ 步骤4：实现会话管理
├─ 步骤5：前端登录表单
└─ 步骤6：测试验证
```

---

## 三、项目结构

### 3.1 核心目录

```
site/
├─ src/
│  ├─ app/              # Next.js App Router 页面
│  ├─ components/       # React 组件
│  ├─ lib/             # 工具函数和库
│  ├─ hooks/           # 自定义 React Hooks
│  ├─ types/          # TypeScript 类型定义
│  └─ middleware/     # 中间件
├─ prisma/
│  └─ schema.prisma   # 数据库模型
├─ scripts/            # 自动化脚本
└─ public/            # 静态资源
```

### 3.2 关键文件

| 文件路径 | 用途 |
|---------|------|
| `#src/lib/db.ts` | 数据库连接 |
| `#src/lib/auth.ts` | 认证逻辑 |
| `#src/lib/igdb.ts` | IGDB API 集成 |
| `#src/app/api/` | API 路由 |
| `#prisma/schema.prisma` | 数据模型 |

---

## 四、代码规范

### 4.1 命名规范

- **变量/函数**：使用驼峰命名（camelCase）
- **组件**：使用帕斯卡命名（PascalCase）
- **类型/接口**：使用帕斯卡命名（PascalCase）
- **常量**：使用大写蛇形（SNAKE_CASE）

### 4.2 文件组织

- 每个组件单独文件
- 相关功能放在同一目录
- 使用 `index.ts` 导出公共接口

### 4.3 API 设计

- RESTful 风格
- 使用 Next.js App Router 的 route handlers
- 统一错误响应格式

---

## 五、数据库规范

### 5.1 ORM 使用

- **必须使用 Prisma ORM**
- 禁止使用原生 SQL
- 所有数据库操作通过 Prisma Client

### 5.2 模型定义

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 六、安全规范

### 6.1 敏感操作

- 所有敏感操作必须添加错误处理
- 使用环境变量管理密钥
- 禁止在代码中硬编码密钥

### 6.2 用户输入

- 所有用户输入必须验证
- 使用 Zod 或类似库进行 schema 验证
- 防止 SQL 注入和 XSS 攻击

---

## 七、Git 规范

### 7.1 Commit 信息

```
feat: 添加用户注册功能
fix: 修复登录验证问题
docs: 更新 README
refactor: 重构认证模块
test: 添加单元测试
```

### 7.2 分支策略

- `main` - 主分支
- `feature/` - 功能分支
- `fix/` - 修复分支
- `hotfix/` - 紧急修复分支

---

## 八、部署规范

### 8.1 环境

- **开发环境**：本地 `npm run dev`
- **预览环境**：Vercel Preview
- **生产环境**：Vercel Production

### 8.2 环境变量

必须配置的环境变量：

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 九、监控与汇报

### 9.1 模型使用监控

- 每次使用收费模型必须记录
- 每周五生成成本报告
- 超过 ¥100/月 必须预警

### 9.2 问题升级

如遇以下情况，立即汇报：

- 发现严重 bug
- 第三方服务异常
- 成本异常增长
- 安全漏洞

---

**本文档最后更新：2026-05-16**
