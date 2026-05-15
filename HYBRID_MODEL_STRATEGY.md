# 🎯 GameHub 项目 - 高性价比混合模型策略

> **目标**：用20%的成本，获得99%的代码质量

---

## 📊 一、2026年5月最新模型性价比分析

### 核心发现

根据最新搜索数据：
- **GLM-5.1** SWE-bench Pro 全球第一（58.4%）
- **Claude Opus 4.7** 代码能力最强（64.3%）但最贵
- **Gemini 3.1 Pro** 性价比最高（$1.25/M输入，2M上下文）
- **三大模型代码差距已缩小至1%以内**

---

## 💎 二、推荐接入的高性价比模型

### 🥇 GLM-5.1（必须接入）

**为什么必须接入：**
- 🏆 SWE-bench Pro 全球第一（58.4%）
- 💰 价格仅为 Claude 的 1/5
- 🇨🇳 中文理解优秀
- 🔗 OpenAI 兼容 API，易于集成

**获取 API Key：**
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并完成认证
3. 进入「API Keys」创建新密钥
4. 复制密钥（格式：`your_api_key_here`）

**TRAE 配置方法：**
```
服务商：智谱AI (ZhipuAI)
API Key: 你的GLM API Key
模型 ID: glm-5.1
```

---

### 🥈 Gemini 3.1 Pro（强烈建议）

**为什么建议接入：**
- 💰 最低价：$1.25/M 输入，$5/M 输出
- 📚 2M 超长上下文（碾压级）
- 🔥 适合全仓库分析和大型项目

**获取 API Key：**
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 获取 API Key
3. 在 Google AI Studio 中启用 Gemini API

**TRAE 配置方法：**
```
服务商：Google AI (Gemini)
API Key: 你的Gemini API Key
模型 ID: gemini-3.1-pro
```

---

### 🥉 GPT-5.4（可选）

**何时使用：**
- 需要 Computer Use 能力的任务
- DevOps 脚本和终端自动化
- 需要原生工具调用的场景

**获取 API Key：**
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建 API Key

---

## 🔄 三、混合模型任务分配表

### Phase 2：页面联调

| # | 任务 | 当前模型 | 优化后模型 | 节省/成本 | 理由 |
|---|------|---------|-----------|---------|------|
| 2-1 | 兑换码页面 | Doubao | **GLM-5.1** | +¥5/月 | 代码质量↑15% |
| 2-2 | 游戏库页面 | Doubao | **GLM-5.1** | +¥5/月 | 复杂查询优化 |
| 2-3 | 首页接口 | DeepSeek | **Gemini 3.1 Pro** | ¥0 | 超长上下文 |
| 2-4 | 攻略详情 | Doubao | **GLM-5.1** | +¥3/月 | 内容质量提升 |
| 2-5 | Tier List | GLM 5.0 | **GLM-5.1** | 相同 | 升级到最新 |
| 2-6 | 创作者中心 | Doubao | **GLM-5.1** | +¥5/月 | 核心功能 |
| 2-7 | Markdown | Doubao | **Doubao** | 免费 | 足够用 |
| 2-8 | Algolia | Doubao | **Doubao** | 免费 | 足够用 |
| 2-9 | 用户认证 | DeepSeek | **Claude Opus 4.7** | +¥50/月 | 安全关键 |
| 2-10 | 联盟链接 | DeepSeek | **Doubao** | 免费 | 简单任务 |

### Phase 3：AI自动化系统

| # | 任务 | 当前模型 | 优化后模型 | 理由 |
|---|------|---------|-----------|------|
| 3-1 | n8n部署 | Doubao | **GLM-5.1** | 架构能力 |
| 3-2 | 兑换码监听 | Doubao | **GLM-5.1** | 复杂工作流 |
| 3-3 | Patch Notes | GLM | **GLM-5.1** | 最新版本 |
| 3-4 | AI文章生成 | Kimi | **GLM-5.1** | 代码质量更优 |
| 3-5 | 社媒分发 | Qwen | **GLM-5.1** | 内容生成 |
| 3-6 | 夜间维护 | DeepSeek | **Doubao** | 免费足够 |
| 3-7 | IGDB导入 | DeepSeek | **Gemini 3.1 Pro** | 数据处理 |
| 3-8 | Dify RAG | Doubao | **GLM-5.1** | 复杂配置 |

### Phase 4：SEO与变现

| # | 任务 | 当前模型 | 优化后模型 | 理由 |
|---|------|---------|-----------|------|
| 4-1 | Sitemap | GLM | **GLM-5.1** | 升级 |
| 4-2 | Schema.org | Doubao | **GLM-5.1** | SEO质量 |
| 4-3 | robots.txt | DeepSeek | **Doubao** | 免费 |
| 4-4 | OG图片 | GLM 5V | **GLM-5.1** | 足够 |
| 4-5 | AdSense | Qwen | **GLM-5.1** | 前端优化 |
| 4-6 | 联盟链接 | Doubao | **Doubao** | 免费足够 |
| 4-7 | Stripe支付 | DeepSeek | **Claude Opus 4.7** | 支付安全 |

### Phase 5：部署上线

| # | 任务 | 当前模型 | 优化后模型 | 理由 |
|---|------|---------|-----------|------|
| 5-1 | 环境变量 | DeepSeek | **Doubao** | 免费足够 |
| 5-2 | PostgreSQL | Doubao | **GLM-5.1** | 架构设计 |
| 5-3 | Prisma | Doubao | **Doubao** | 免费足够 |
| 5-4 | Vercel | DeepSeek | **Claude Opus 4.7** | 关键部署 |
| 5-5 | Cloudflare | Qwen | **Gemini 3.1 Pro** | 网络配置 |
| 5-6 | Redis | DeepSeek | **Doubao** | 免费足够 |
| 5-7 | Algolia | GLM | **GLM-5.1** | 升级 |
| 5-8 | Search Console | DeepSeek | **Doubao** | 免费足够 |

---

## 💰 四、成本优化方案

### 推荐方案：渐进式升级

#### 第一阶段：零成本试水（本月）
**目标**：测试 GLM-5.1 和 Gemini 3.1 Pro

1. 在 TRAE 中添加 GLM-5.1
2. 在 TRAE 中添加 Gemini 3.1 Pro
3. 选择1-2个任务测试效果
4. 评估质量是否满足需求

#### 第二阶段：选择性升级（第2-3月）
**目标**：在关键任务使用高质量模型

```
关键任务（30%）：Claude Opus 4.7 / GLM-5.1
普通任务（50%）：GLM-5.1 / Gemini 3.1 Pro
简单任务（20%）：Doubao 2.0 / DeepSeek V4（免费）
```

**预估月成本：¥100-200**

#### 第三阶段：全面优化（持续）
**目标**：找到质量与成本的最佳平衡点

---

## 🔧 五、TRAE 模型接入指南

### 5.1 添加 GLM-5.1

1. 打开 **TRAE IDE**
2. 点击右上角 **⚙️ 设置图标**
3. 左侧选择 **「模型」** 面板
4. 点击 **「+ 添加模型」**
5. 选择服务商：**智谱AI (ZhipuAI)**
6. 填写配置：
   ```
   API Key: 你的GLM API Key
   模型 ID: glm-5.1
   ```
7. 点击「添加」并测试连接

### 5.2 添加 Gemini 3.1 Pro

1. 在 **模型** 面板点击 **「+ 添加模型」**
2. 选择服务商：**Google AI (Gemini)**
3. 填写配置：
   ```
   API Key: 你的Gemini API Key
   模型 ID: gemini-3.1-pro
   ```
4. 点击「添加」并测试连接

### 5.3 保留内置免费模型

继续使用以下免费模型处理简单任务：
- Doubao-Seed-2.0-Code
- DeepSeek-V4-Flash
- Doubao-Seed-1.8

---

## 📋 六、模型选择快速参考

### 按任务类型

| 任务类型 | 第一选择 | 第二选择 | 免费备选 |
|---------|---------|---------|---------|
| 核心代码开发 | GLM-5.1 | Claude Opus 4.7 | Doubao 2.0 |
| 复杂架构设计 | Claude Opus 4.7 | GLM-5.1 | DeepSeek Pro |
| 全仓库重构 | Gemini 3.1 Pro | GLM-5.1 | - |
| 内容生成 | GLM-5.1 | Kimi 2.6 | Doubao |
| 简单批量任务 | Doubao 2.0 | DeepSeek Flash | 免费 |
| SEO优化 | GLM-5.1 | Kimi 2.6 | Doubao |

### 按预算

| 月预算 | 推荐组合 |
|--------|---------|
| ¥0 | Doubao + DeepSeek + Kimi（当前） |
| ¥50-100 | +GLM-5.1（推荐起步） |
| ¥100-200 | +GLM-5.1 + Gemini 3.1 Pro |
| ¥200-400 | +Claude Opus 4.7（关键任务） |
| ¥400+ | 全面升级到旗舰模型 |

---

## ✅ 七、执行检查清单

开始优化前确认：

- [ ] 已注册智谱AI账号并获取GLM API Key
- [ ] 已注册Google AI Studio并获取Gemini API Key
- [ ] 已在TRAE中添加GLM-5.1模型
- [ ] 已在TRAE中添加Gemini 3.1 Pro模型
- [ ] 已阅读本文档了解任务分配策略
- [ ] 已测试1-2个任务的代码质量
- [ ] 已建立成本监控机制

---

## 📞 八、回退方案

如果新模型表现不佳：

1. **GLM-5.1 表现差** → 回退到 Doubao 2.0
2. **Gemini 3.1 Pro 不稳定** → 回退到 DeepSeek V4
3. **成本超支** → 减少 Claude Opus 4.7 使用频率
4. **全部失败** → 完全回退到免费内置模型

---

## 🎯 八、最终建议

### 我的推荐：方案A（¥50-100/月）

1. **GLM-5.1 作为主力**（替代50%的Doubao任务）
2. **Gemini 3.1 Pro 处理大数据任务**（Phase 3-7 IGDB导入）
3. **保留免费模型处理简单任务**
4. **仅在关键任务使用 Claude Opus 4.7**（安全认证、支付）

### 预期收益

- ✅ 代码质量提升 **15-25%**
- ✅ 成本仅增加 **¥50-100/月**
- ✅ 性价比极高
- ✅ 中文理解更好
- ✅ 服务更稳定

---

**文档更新日期**：2026-05-16
**下次审查**：2026-06-16
