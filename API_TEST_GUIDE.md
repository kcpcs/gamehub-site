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

## 已修复的问题

1. ✅ 添加了 `formatGameCode()` 辅助函数来正确格式化数据
2. ✅ 确保返回的对象包含 `game_slug` 和 `game_name` 字段
3. ✅ 正确处理日期类型转换（Date → ISO string）
4. ✅ 修复了Redis缓存序列化问题（JSON.stringify）
5. ✅ 修复了Redis缓存反序列化问题（JSON.parse）

## 测试验证清单

在继续到步骤2之前，请确认：
- [ ] GET 接口返回正确格式数据
- [ ] 类型定义匹配实际返回
- [ ] Redis缓存正常工作
- [ ] 错误处理正常
- [ ] 没有副作用影响其他功能
