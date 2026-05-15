# API 接口验证测试说明

## GET /api/codes/[game] 验证步骤

### 1. 启动开发服务器
```bash
cd F:\国外游戏站\site
npm run dev
```

### 2. 测试端点

#### 测试用例1：获取存在的游戏兑换码
访问：`http://localhost:3000/api/codes/genshin-impact`（或其他存在的游戏slug）

**预期结果：**
- ✅ HTTP 200 状态码
- ✅ 返回 JSON 格式数据
- ✅ 包含 success: true
- ✅ data 包含 active_codes 和 expired_codes
- ✅ 每个 code 对象包含完整字段（game_slug, game_name 等）

#### 测试用例2：获取不存在的游戏
访问：`http://localhost:3000/api/codes/nonexistent-game`

**预期结果：**
- ✅ HTTP 404 状态码
- ✅ 返回 success: false
- ✅ 包含错误信息

#### 测试用例3：测试缓存
连续访问同一端点两次

**预期结果：**
- ✅ 第一次访问：从数据库读取
- ✅ 第二次访问：从Redis缓存读取（更快）
- ✅ 缓存 TTL 2分钟

### 3. 验证数据格式

检查返回的 GameCode 对象是否包含以下字段：
```typescript
{
  id: string,
  code: string,
  game_id: string,
  game_slug: string,  // ✅ 新增
  game_name: string,  // ✅ 新增
  reward_desc: string,
  status: 'active' | 'expired' | 'unverified',
  source: 'discord' | 'reddit' | 'official' | 'twitter' | 'user',
  source_url?: string,
  expires_at?: string,  // ISO 8601
  verified_at: string,  // ISO 8601
  submitted_by?: string,
  created_at: string   // ISO 8601
}
```

### 4. 验证错误处理

检查服务器日志确保：
- ✅ 数据库连接正常
- ✅ Redis缓存正常工作
- ✅ 错误被正确捕获和记录

## POST /api/codes/[game] 验证步骤

### 1. 测试用户提交新兑换码

使用 curl 或 Postman 测试：

```bash
curl -X POST http://localhost:3000/api/codes/genshin-impact \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TESTCODE2024",
    "reward_desc": "100 Primogems",
    "source_url": "https://example.com"
  }'
```

**预期结果：**
- ✅ HTTP 201 状态码
- ✅ 返回 success: true
- ✅ data 包含完整的格式化 GameCode 对象
- ✅ 状态为 'unverified'
- ✅ 来源为 'user'

### 2. 测试重复码检测

提交相同的 code 两次：

```bash
# 第一次提交
curl -X POST http://localhost:3000/api/codes/genshin-impact \
  -H "Content-Type: application/json" \
  -d '{
    "code": "DUPLICATECODE",
    "reward_desc": "Test Reward"
  }'

# 第二次提交（应该失败）
curl -X POST http://localhost:3000/api/codes/genshin-impact \
  -H "Content-Type: application/json" \
  -d '{
    "code": "DUPLICATECODE",
    "reward_desc": "Test Reward"
  }'
```

**预期结果：**
- ✅ 第一次提交：HTTP 201，成功
- ✅ 第二次提交：HTTP 409，返回错误 "Code already exists"
- ✅ 错误 code 为 "DUPLICATE"

### 3. 测试验证规则

#### 测试空 code：
```bash
curl -X POST http://localhost:3000/api/codes/genshin-impact \
  -H "Content-Type: application/json" \
  -d '{
    "code": "",
    "reward_desc": "Test Reward"
  }'
```
**预期结果：** HTTP 400，验证失败

#### 测试短 code：
```bash
curl -X POST http://localhost:3000/api/codes/genshin-impact \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB",
    "reward_desc": "Test Reward"
  }'
```
**预期结果：** HTTP 400，验证失败（最少3个字符）

#### 测试空 reward_desc：
```bash
curl -X POST http://localhost:3000/api/codes/genshin-impact \
  -H "Content-Type: application/json" \
  -d '{
    "code": "VALIDCODE",
    "reward_desc": ""
  }'
```
**预期结果：** HTTP 400，验证失败

#### 测试无效 URL：
```bash
curl -X POST http://localhost:3000/api/codes/genshin-impact \
  -H "Content-Type: application/json" \
  -d '{
    "code": "VALIDCODE",
    "reward_desc": "Test Reward",
    "source_url": "not-a-valid-url"
  }'
```
**预期结果：** HTTP 400，验证失败

### 4. 测试缓存清除

#### 步骤1：先获取一次（缓存）
访问：`http://localhost:3000/api/codes/genshin-impact`

#### 步骤2：提交新码
提交一个新的兑换码

#### 步骤3：再次获取
再次访问：`http://localhost:3000/api/codes/genshin-impact`

**预期结果：**
- ✅ 第二次获取应包含新提交的兑换码
- ✅ 缓存已被正确清除
- ✅ 数据从数据库重新读取

### 5. 测试不存在的游戏
```bash
curl -X POST http://localhost:3000/api/codes/nonexistent-game \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TESTCODE",
    "reward_desc": "Test Reward"
  }'
```

**预期结果：**
- ✅ HTTP 404 状态码
- ✅ 返回 success: false
- ✅ 错误信息 "Game not found"

## 已修复的问题

### GET 接口修复：
1. ✅ 添加了 `formatGameCode()` 辅助函数来正确格式化数据
2. ✅ 确保返回的对象包含 `game_slug` 和 `game_name` 字段
3. ✅ 正确处理日期类型转换（Date → ISO string）
4. ✅ 修复了Redis缓存序列化问题（JSON.stringify）
5. ✅ 修复了Redis缓存反序列化问题（JSON.parse）

### POST 接口修复：
1. ✅ 添加了 game.name 查询以支持格式化
2. ✅ 使用 `formatGameCode()` 统一格式化返回数据
3. ✅ 添加了缓存清除的注释说明
4. ✅ 返回完整格式化的 GameCode 对象而非原始数据库对象

## 测试验证清单

### GET 接口验证：
- [ ] GET 接口返回正确格式数据
- [ ] 类型定义匹配实际返回
- [ ] Redis缓存正常工作
- [ ] 错误处理正常
- [ ] 没有副作用影响其他功能

### POST 接口验证：
- [ ] 能成功提交新兑换码
- [ ] 重复码检测正常工作（P2002错误处理）
- [ ] 验证规则正常工作（code长度、reward_desc等）
- [ ] 提交后缓存被正确清除
- [ ] 返回格式化的 GameCode 对象
- [ ] 错误处理正常
- [ ] 没有副作用影响其他功能
