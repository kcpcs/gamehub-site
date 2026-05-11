# GameHub AI自动化工作流 - 完整部署指南

## 📋 概述

GameHub的AI自动化工作流是一套完整的内容自动生成和更新系统，能够：
- 自动监控游戏更新
- 生成高质量游戏攻略
- 检查兑换码状态
- 定时更新游戏内容
- 智能分类内容到对应页面

## 🚀 快速开始

### 1. 配置环境变量

首先复制示例配置文件：
```bash
cd f:\国外游戏站\site
cp .env.ai.example .env.ai
```

编辑 `.env.ai` 并填入你的配置：
- `ANTHROPIC_API_KEY` - 你的Claude API密钥
- 其他配置根据需要调整

### 2. 运行单次工作流

```bash
# 运行完整的AI自动化工作流一次
node scripts/ai-workflow.js --run-once
```

### 3. 查看工作目录

```
f:\国外游戏站\site\scripts\
├── ai-workflow.js        # 主程序
├── logger.js             # 日志系统
├── content-monitor.js    # 内容监控
├── code-checker.js       # 兑换码检查
└── game-updater.js       # 游戏更新器
```

## 🔧 配置详解

### 环境变量配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `ANTHROPIC_API_KEY` | Claude API密钥 | 必填 |
| `AI_WORKFLOW_ENABLED` | 启用工作流 | `true` |
| `LOG_LEVEL` | 日志级别 | `INFO` |
| `ENABLE_AUTO_PUBLISH` | 自动发布内容 | `false` |

### Cron定时配置

在生产环境中，可以使用cron来定时运行工作流：

```cron
# 每6小时运行内容监控
0 */6 * * * cd /path/to/site && node scripts/ai-workflow.js --run-once

# 每天检查兑换码
0 0 * * * cd /path/to/site && node scripts/ai-workflow.js --check-codes

# 每周更新游戏信息
0 0 * * 0 cd /path/to/site && node scripts/ai-workflow.js --update-games
```

## 📊 工作流详情

### 完整工作流循环 (4个步骤)

#### 1️⃣ 内容监控
- 检查数据库中的内容分布
- 识别需要新攻略的游戏
- 生成内容需求报告
- 记录到日志系统

#### 2️⃣ 兑换码检查
- 扫描所有活动中的兑换码
- 检测可能过期的代码
- 标记需要验证的内容
- 统计报告

#### 3️⃣ 游戏信息更新
- 检查游戏信息时效性
- 更新最后检查时间
- 准备下次内容更新
- 数据维护

#### 4️⃣ 智能内容生成
- 为需要内容的游戏生成攻略
- 使用Claude AI创作高质量内容
- 自动分类到正确的游戏目录
- 更新数据库统计

## 🎯 使用场景

### 场景1: 初次部署
```bash
# 1. 确保数据库已设置
npm run db:push
npm run db:seed

# 2. 配置API密钥
# 编辑 .env.ai

# 3. 运行工作流测试
node scripts/ai-workflow.js --run-once
```

### 场景2: 生产环境部署
1. 设置cron定时任务
2. 配置日志轮转
3. 设置监控告警
4. 定期检查运行状态

### 场景3: 手动内容生成
```bash
# 直接运行一次完整循环
node scripts/ai-workflow.js --run-once
```

## 📝 日志说明

日志系统提供以下级别：
- `DEBUG` - 详细调试信息
- `INFO` - 一般信息（默认）
- `WARN` - 警告信息
- `ERROR` - 错误信息
- `SUCCESS` - 成功操作

日志输出格式：
```
[时间戳] [级别] 消息内容
```

## 🛠️ 故障排查

### 问题1: API密钥未配置
```
❌ 错误: ANTHROPIC_API_KEY is not configured
```
解决：在 `.env.ai` 中配置密钥，或在模拟模式下运行

### 问题2: 数据库连接失败
检查 `DATABASE_URL` 是否正确，数据库文件是否存在

### 问题3: 内容生成失败
- 检查API密钥是否有效
- 查看日志中的详细错误
- 确认API配额是否用尽

## 📈 扩展开发

### 添加新的内容类型

在 `ai-workflow.js` 中添加新的生成器函数：
```javascript
async function generateNewTypeContent(game) {
  // 你的代码
}
```

### 自定义提示词

修改内容生成时的提示词，在claude.js中添加新模板。

## 🎉 开始使用

现在你已准备好启动GameHub的AI自动化工作流了！

1. ⚙️ 配置API密钥
2. ▶️ 运行单次工作流测试
3. 🔄 设置定时任务
4. 📊 监控运行状态

**有问题？查看项目文档或联系维护者！**
