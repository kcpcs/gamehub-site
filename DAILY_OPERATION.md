# GameHub 每日自动运营定时任务

这是一个完全自动化的每日运营系统，每天凌晨 2 点自动执行以下任务：

1. ✅ 自动审核用户提交的兑换码
2. ✅ 自动检查兑换码过期状态
3. ✅ 自动更新首页最近更新区域
4. ✅ 自动更新 SEO 最后修改时间
5. ✅ 自动清理测试数据
6. ✅ 自动提交 Git 备份

---

## 🚀 快速开始

### 安装依赖

```bash
# 进入项目目录
cd F:\国外游戏站\site

# 安装依赖 (如果还没安装 node-cron)
npm install
```

### 手动测试运营（测试一次）

```bash
# 立即运行一次每日运营任务
npm run operate:daily
```

---

## 🕐 启动定时任务

```bash
# 启动每日自动运营任务（每天凌晨2点执行）
npm run operate:start
```

这个命令会在后台运行，并在每天凌晨 2 点自动执行任务。

### 验证定时任务是否正常启动

启动后，您会看到：
```
🚀 GameHub Cron Job Scheduler Started
⏰ Waiting for scheduled tasks...

✅ Cron job scheduled successfully!
⏰ Task will run daily at 2:00 AM (Asia/Shanghai)
💡 To run manually: npm run operate:start -- --run-now
```

---

## 📋 任务列表

### 1. 手动立即运行一次

如果您想现在就测试运行一次，而不等明天：

```bash
npm run operate:start -- --run-now
```

### 2. 仅运行每日任务脚本

```bash
npm run operate:daily
```

---

## 📦 自动执行的任务

每日任务会自动执行以下内容：

| 任务 | 说明 |
|------|------|
| 1️⃣ 兑换码审核 | 自动审核用户提交的兑换码 |
| 2️⃣ 过期检查 | 检查并标记过期的兑换码 |
| 3️⃣ 首页更新 | 更新首页的最近更新区域 |
| 4️⃣ SEO 更新 | 更新所有页面的 lastModified 时间 |
| 5️⃣ 数据清理 | 清理测试数据（TEST, GENSHIN 等） |
| 6️⃣ Git 备份 | 自动提交到 Git 仓库 |

---

## 🤖 零成本运营

所有任务都使用内置免费模型：
- **Doubao-Seed-2.0-Code（主要代码任务）
- **DeepSeek（复杂推理任务）
- **不使用任何收费模型

---

## 🔧 Windows 服务化设置（高级）

如果您想让定时任务在系统启动时自动运行，有几个选项：

### 选项 1：使用 PM2 进程管理器（推荐）

```bash
# 安装 PM2
npm install -g pm2 -g

# 使用 PM2 启动定时任务
cd F:\国外游戏站\site
pm2 start npm --name "gamehub-operate" -- run operate:start

# 设置开机自启
pm2 save
pm2 startup
```

### 选项 2：使用 Windows 任务计划程序

1. 打开"任务计划程序"
2. 创建基本任务
3. 触发器：每天凌晨 2 点
4. 操作：启动程序
5. 程序：`node.exe`
6. 参数：`F:\国外游戏站\site\scripts\daily-operate.mjs`

---

## 📊 日志记录

每日运营任务的执行会在：
- Git 提交会记录每次更改
- 控制台输出可以查看执行情况
- 任务执行情况可以追溯

---

## 🔄 恢复方案

如果您可以随时手动运行任务进行测试

```bash
npm run operate:daily
```

---

## ✅ 配置完成！

现在您的 GameHub 网站已经完全自动化运营了！🎉

每天凌晨 2 点，一切都会自动处理！