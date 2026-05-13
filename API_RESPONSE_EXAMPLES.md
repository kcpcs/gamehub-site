# GameHub API 响应示例数据

## 健康检查

**请求**: `GET /api/health`

```json
{
  "status": "healthy",
  "timestamp": "2026-05-13T10:30:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "up",
      "latency_ms": 5
    },
    "redis": {
      "status": "up",
      "latency_ms": 2
    },
    "memory": {
      "status": "healthy",
      "used_mb": 128,
      "limit_mb": 512,
      "percentage": 25
    }
  }
}
```

---

## 游戏列表

**请求**: `GET /api/games?page=1&page_size=10`

```json
{
  "success": true,
  "data": [
    {
      "id": "cls123abc",
      "slug": "genshin-impact",
      "name": "Genshin Impact",
      "cover_url": "https://example.com/genshin.jpg",
      "platforms": ["PC", "PlayStation 5", "iOS", "Android"],
      "genres": ["RPG", "Action", "Open World"],
      "developer": "miHoYo",
      "publisher": "miHoYo",
      "release_date": "2020-09-28T00:00:00.000Z",
      "guide_count": 42,
      "code_count": 15,
      "has_tier_list": true
    },
    {
      "id": "cls456def",
      "slug": "zelda-tears-of-the-kingdom",
      "name": "The Legend of Zelda: Tears of the Kingdom",
      "cover_url": "https://example.com/zelda.jpg",
      "platforms": ["Nintendo Switch"],
      "genres": ["Action", "Adventure", "Open World"],
      "developer": "Nintendo EPD",
      "publisher": "Nintendo",
      "release_date": "2023-05-12T00:00:00.000Z",
      "guide_count": 28,
      "code_count": 0,
      "has_tier_list": false
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

---

## 游戏详情

**请求**: `GET /api/games/genshin-impact`

```json
{
  "success": true,
  "data": {
    "id": "cls123abc",
    "slug": "genshin-impact",
    "name": "Genshin Impact",
    "cover_url": "https://example.com/genshin.jpg",
    "screenshots": [
      "https://example.com/screen1.jpg",
      "https://example.com/screen2.jpg"
    ],
    "platforms": ["PC", "PlayStation 5", "iOS", "Android"],
    "genres": ["RPG", "Action", "Open World"],
    "tags": ["anime", "free-to-play", "gacha"],
    "developer": "miHoYo",
    "publisher": "miHoYo",
    "release_date": "2020-09-28T00:00:00.000Z",
    "description": "Genshin Impact is an open-world action RPG developed by miHoYo...",
    "score_opencritic": 84,
    "score_steam_pct": 87,
    "score_community": 92,
    "score_review_count": 15234,
    "guide_count": 42,
    "code_count": 15,
    "has_tier_list": true,
    "created_at": "2026-05-01T00:00:00.000Z",
    "updated_at": "2026-05-12T00:00:00.000Z"
  }
}
```

---

## 管理员仪表盘

**请求**: `GET /api/admin/dashboard`

```json
{
  "success": true,
  "data": {
    "overview": {
      "total_games": 50,
      "total_articles": 128,
      "total_codes": 86,
      "total_users": 1234,
      "published_articles": 95,
      "active_codes": 42,
      "draft_articles": 33,
      "expired_codes": 44
    },
    "recent_activity": {
      "articles": [
        {
          "id": "art123",
          "title": "Genshin Impact 4.6 Update Guide",
          "game": "Genshin Impact",
          "status": "published",
          "created_at": "2026-05-12T10:30:00.000Z"
        }
      ],
      "codes": [
        {
          "id": "code123",
          "code": "GENSHIN46",
          "game": "Genshin Impact",
          "status": "active",
          "created_at": "2026-05-11T15:20:00.000Z"
        }
      ]
    },
    "top_games": [
      {
        "rank": 1,
        "id": "cls123abc",
        "name": "Genshin Impact",
        "slug": "genshin-impact",
        "cover_url": "https://example.com/genshin.jpg",
        "guide_count": 42,
        "code_count": 15
      }
    ]
  }
}
```

---

## 管理员登录

**请求**: `POST /api/admin/auth/login`

**Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "adm123",
      "email": "admin@example.com",
      "username": "admin",
      "avatar": null,
      "role": "super_admin"
    },
    "session_token": "session_abc123def"
  },
  "message": "登录成功"
}
```

---

## 创建游戏

**请求**: `POST /api/admin/games`

**Body**:
```json
{
  "name": "Hogwarts Legacy",
  "slug": "hogwarts-legacy",
  "cover_url": "https://example.com/hogwarts.jpg",
  "platforms": ["PC", "PlayStation 5", "Xbox Series X/S"],
  "genres": ["Action", "RPG", "Adventure"],
  "developer": "Portkey Games",
  "publisher": "Warner Bros. Interactive",
  "release_date": "2023-02-10T00:00:00.000Z",
  "description": "Hogwarts Legacy is an immersive, open-world action RPG..."
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "cls789ghi",
    "slug": "hogwarts-legacy",
    "name": "Hogwarts Legacy",
    "cover_url": "https://example.com/hogwarts.jpg",
    "platforms": ["PC", "PlayStation 5", "Xbox Series X/S"],
    "genres": ["Action", "RPG", "Adventure"],
    "developer": "Portkey Games",
    "publisher": "Warner Bros. Interactive",
    "release_date": "2023-02-10T00:00:00.000Z",
    "description": "Hogwarts Legacy is an immersive, open-world action RPG...",
    "guide_count": 0,
    "code_count": 0,
    "has_tier_list": false,
    "created_at": "2026-05-13T10:30:00.000Z",
    "updated_at": "2026-05-13T10:30:00.000Z"
  },
  "message": "游戏创建成功"
}
```

---

## 更新游戏

**请求**: `PATCH /api/admin/games/cls789ghi`

**Body**:
```json
{
  "description": "Updated description for Hogwarts Legacy"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "cls789ghi",
    "slug": "hogwarts-legacy",
    "name": "Hogwarts Legacy",
    "description": "Updated description for Hogwarts Legacy",
    "updated_at": "2026-05-13T11:00:00.000Z"
  },
  "message": "游戏更新成功"
}
```

---

## 删除游戏

**请求**: `DELETE /api/admin/games/cls789ghi`

**响应**:
```json
{
  "success": true,
  "message": "游戏删除成功"
}
```

---

## 错误响应示例

### 401 未授权
```json
{
  "success": false,
  "error": "未授权访问",
  "code": "UNAUTHORIZED"
}
```

### 403 权限不足
```json
{
  "success": false,
  "error": "权限不足",
  "code": "FORBIDDEN"
}
```

### 404 未找到
```json
{
  "success": false,
  "error": "资源不存在",
  "code": "NOT_FOUND"
}
```

### 422 验证失败
```json
{
  "success": false,
  "error": "输入验证失败",
  "code": "VALIDATION_ERROR",
  "details": {
    "name": ["不能为空"],
    "slug": ["格式无效"]
  }
}
```

### 500 服务器错误
```json
{
  "success": false,
  "error": "服务器内部错误",
  "code": "INTERNAL_ERROR"
}
```
