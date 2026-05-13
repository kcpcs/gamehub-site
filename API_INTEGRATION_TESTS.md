# GameHub API集成测试套件

**测试时间**: 2026-05-13
**负责模型**: Claude Sonnet 4 (窗口2)
**测试环境**: http://localhost:3000

---

## 测试概述

| 类别 | 数量 | 状态 |
|------|------|------|
| 用户后台API | 12个 | 🔄 测试中 |
| 管理员后台API | 10个 | ⏳ 待测试 |
| 内部API | 3个 | ⏳ 待测试 |
| 总计 | 25个 | - |

---

## 用户后台API测试

### 1. 健康检查 API
**端点**: `GET /api/health`  
**期望**: 200 OK, 返回服务器状态  
**状态**: ✅ 通过 (之前已验证)

### 2. 游戏列表 API
**端点**: `GET /api/games`  
**测试参数**:
- 无参数: 返回默认分页
- `?page=1&limit=12`: 自定义分页
- `?sort=popular`: 按热度排序
- `?sort=latest`: 按最新排序
- `?sort=rating`: 按评分排序
- `?platform=pc`: 按平台过滤

**期望响应格式**:
```json
{
  "success": true,
  "data": {
    "games": [...],
    "meta": {
      "page": 1,
      "limit": 24,
      "total": 50,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 3. 游戏详情 API
**端点**: `GET /api/games/[slug]`  
**测试用例**:
- 存在的游戏: e.g. `/api/games/genshin-impact`
- 不存在的游戏: `/api/games/non-existent-game` → 404

### 4. 兑换码 API
**端点**: `GET /api/codes/[game]`  
**测试用例**:
- `/api/codes/genshin-impact`
- `/api/codes/honkai-star-rail`

**期望响应格式**:
```json
{
  "success": true,
  "data": {
    "game_slug": "genshin-impact",
    "game_name": "Genshin Impact",
    "game_cover": "...",
    "active_codes": [...],
    "expired_codes": [...],
    "last_updated": "2026-05-13T..."
  }
}
```

### 5. 提交兑换码 API
**端点**: `POST /api/codes/[game]`  
**测试**: 验证Zod验证和权限

### 6. 攻略列表 API
**端点**: `GET /api/guides`  
**测试参数**:
- 无参数: 返回全部攻略
- `?game=genshin-impact`: 按游戏过滤
- `?page=1&limit=10`: 分页

### 7. 攻略详情 API
**端点**: `GET /api/guides/[slug]`  
**测试用例**:
- 存在的攻略
- 不存在的攻略 → 404

### 8. Tier List API
**端点**: `GET /api/tierlist/[game]`  
**测试用例**:
- `/api/tierlist/genshin-impact`
- `/api/tierlist/honkai-star-rail`
- `/api/tierlist/valorant`

### 9. Tier List 投票 API
**端点**: `POST /api/tierlist/vote`  
**测试**: 验证输入验证和权限

### 10. 搜索 API
**端点**: `GET /api/search?q=[query]`  
**测试用例**:
- `?q=genshin`
- `?q=honkai`
- `?q=code`
- 无参数: 验证默认行为

### 11. 评论 API
**端点**: `GET /api/comments/[slug]`  
**测试用例**:
- 存在的攻略评论
- 不存在的攻略评论

### 12. 认证 API
**端点**: `/api/auth/*`  
**测试**: 认证流程完整性

---

## 管理员后台API测试

### 13. 仪表盘 API
**端点**: `GET /api/admin/dashboard`  
**测试参数**:
- 无参数: 默认30天
- `?days=7`: 最近7天
- `?days=90`: 最近90天

**期望响应格式** (已验证):
```json
{
  "success": true,
  "data": {
    "overview": {...},
    "recent_games": [...],
    "recent_articles": [...],
    "recent_codes": [...],
    "top_games": [...],
    "trends": {...}
  }
}
```
**状态**: ✅ 通过 (之前已验证)

### 14. 游戏管理 API
**端点**: 
- `GET /api/admin/games` - 列表
- `POST /api/admin/games` - 创建
- `GET /api/admin/games/[id]` - 详情
- `PUT /api/admin/games/[id]` - 更新
- `DELETE /api/admin/games/[id]` - 删除

### 15. 文章管理 API
**端点**: `/api/admin/articles/*`

### 16. 兑换码管理 API
**端点**: `/api/admin/codes/*`

### 17. 评论管理 API
**端点**: `/api/admin/comments/*`

### 18. Tier List管理 API
**端点**: `/api/admin/tierlists/*`

### 19. 管理员用户 API
**端点**: `/api/admin/admin-users/*`

### 20. 角色权限 API
**端点**: `/api/admin/roles/*`

### 21. AI玩家管理 API
**端点**: `/api/admin/ai-players/*`

### 22. 审计日志 API
**端点**: `GET /api/admin/audit-logs`

---

## 内部API测试

### 23. 游戏导入 API
**端点**: `POST /api/internal/games/import`

### 24. 兑换码导入 API
**端点**: `POST /api/internal/codes/import`

### 25. 内容生成 API
**端点**: `POST /api/internal/generate`

---

## 测试结果记录

### 已验证API
- [x] `/api/health` - ✅ 通过
- [x] `/api/admin/dashboard` - ✅ 通过
- [x] Database Connection - ✅ 通过

### 待验证API
- [ ] 剩余23个API - 需完整测试

---

## 测试说明

由于我们已经有了完整的API实现和降级机制，当前测试重点：
1. 验证API响应格式
2. 验证错误处理
3. 验证缓存机制
4. 验证类型安全

---

**测试套件创建时间**: 2026-05-13
