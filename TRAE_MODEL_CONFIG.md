# Trae CN 自定义模型配置指南

> 本文档说明如何在 Trae CN 助手中配置自定义大模型，以便执行 GameHub 项目任务

## 一、项目所需大模型清单

根据 GameHub 项目执行计划，需要用到以下大模型：

| 任务场景 | 推荐模型 | 说明 |
|---------|---------|------|
| AI 文章内容生成 | Claude Opus 4 | 最强写作和推理能力 |
| Tier List 数据分析 | Claude Sonnet 4 | 平衡速度与质量 |
| 复杂代码架构设计 | Claude Opus 4 | 复杂任务处理 |
| 日常开发迭代 | Claude Sonnet 4 | 快速响应 |
| 简单批量任务 | Claude Haiku | 最快最便宜 |
| 备用/降级方案 | DeepSeek V3 | 成本优化 |

## 二、Jiekou.AI 接入方案（推荐）

### 2.1 为什么选择 Jiekou.AI？

- ✅ 支持 **Anthropic 原生协议**（Claude 官方协议）
- ✅ 支持 **OpenAI 兼容协议**
- ✅ 国内访问稳定，无需魔法
- ✅ 按量计费，灵活控制成本

### 2.2 获取 API Key

1. 访问 **https://jiekou.ai**
2. 注册账号并完成认证
3. 进入「API Key 管理」创建新密钥
4. 复制密钥（格式：`sk_xxxxxxxx`）

### 2.3 可用 Claude 模型列表

| 模型 | 端点 | 说明 |
|------|------|------|
| claude-opus-4-1-20250805 | Anthropic 协议 | 最强推理 |
| claaude-sonnet-4-20250514 | Anthropic 协议 | 平衡之选 |
| claaude-3-5-haiku | Anthropic 协议 | 快速响应 |

## 三、Trae CN 自定义模型配置步骤

### 方式一：原生 IDE 配置（如果支持）

1. 打开 **Trae CN IDE**
2. 点击右上角 **⚙️ 设置图标**
3. 左侧选择 **「模型」** 面板
4. 点击 **「+ 添加模型」**
5. 选择服务商：**Anthropic**
6. 填写配置：

```
模型名称：claude-opus-4
API Key：sk_你的Jiekou密钥
Base URL：https://api.jiekou.ai/anthropic
```

7. 点击「添加」并测试连接

### 方式二：Cline 插件配置（推荐）

如果 Trae 原生不支持自定义模型入口，使用 Cline 插件：

#### Step 1：安装 Cline 插件

1. 在 VS Code 中按 `Ctrl+Shift+X` 打开扩展
2. 搜索 **Cline**
3. 点击安装

#### Step 2：配置 API

1. 点击左侧 Cline 图标
2. 点击右上角 **⚙️ 设置图标**
3. 填写配置：

```
API Provider: OpenAI Compatible
Base URL: https://api.jiekou.ai/openai/v1
API Key: sk_你的Jiekou密钥
Model ID: claude-opus-4-1-20250805
```

#### Step 3：测试连接

发送一条简单消息测试是否正常工作

## 四、多模型切换配置

如果需要配置多个模型（如 Claude Opus + DeepSeek）：

### 4.1 Claude Opus 4（主力模型）

```
模型名称：Claude Opus 4
API Provider: Anthropic
Base URL: https://api.jiekou.ai/anthropic
API Key: sk_你的Jiekou密钥
模型ID: claude-opus-4-1-20250805
```

### 4.2 Claude Sonnet 4（辅助模型）

```
模型名称：Claude Sonnet 4
API Provider: Anthropic
Base URL: https://api.jiekou.ai/anthropic
API Key: sk_你的Jiekou密钥
模型ID: claude-sonnet-4-20250514
```

### 4.3 DeepSeek V3（备用/成本优化）

如果 Jiekou.AI 支持 DeepSeek：

```
模型名称：DeepSeek V3
API Provider: OpenAI Compatible
Base URL: 填写 DeepSeek 中转服务地址
API Key: 你的 DeepSeek API Key
模型ID: deepseek-chat
```

## 五、常见问题排查

### 5.1 返回 401 无效令牌

- 确认 API Key 格式正确（`sk_` 开头）
- 确认请求头格式：`Authorization: Bearer sk_xxxxxx`

### 5.2 返回 404 page not found

- 检查 Base URL 是否正确
- Anthropic 协议：`https://api.jiekou.ai/anthropic`
- OpenAI 兼容：`https://api.jiekou.ai/openai/v1/chat/completions`

### 5.3 思考块错误 (thinking block)

- Claude 4.5 启用 Thinking 后需要特定上下文格式
- 建议使用 Claude Sonnet 4 或禁用 Thinking 功能

## 六、成本优化建议

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 复杂架构设计 | Opus 4 | 最强推理能力 |
| 日常页面开发 | Sonnet 4 | 平衡速度与成本 |
| 简单批量任务 | Haiku | 最快最便宜 |
| 长文本生成 | Opus 4 | 大上下文窗口 |

## 七、配置检查清单

在开始 GameHub 项目开发前，确认以下配置完成：

- [ ] Jiekou.AI 账号注册
- [ ] 获取 API Key
- [ ] Trae CN / Cline 模型配置
- [ ] 至少一个模型测试成功
- [ ] 熟悉模型切换方法

---

**配置完成后即可开始 Phase 2 页面联调任务！**
