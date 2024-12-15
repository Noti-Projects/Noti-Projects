# API 文档

## 基础信息

- **基础URL**: `http://localhost:8000`
- **API版本**: v1
- **认证方式**: Bearer Token

## 认证

所有的 API 请求都需要在 Header 中携带 Token：

```http
Authorization: Bearer <your_token>
```

## 消息管理 API

### 获取消息列表

获取分页的消息列表。

```http
GET /api/v1/messages
```

#### 查询参数

| 参数     | 类型    | 必填 | 描述           |
|----------|---------|------|----------------|
| page     | integer | 否   | 页码，默认为 1  |
| limit    | integer | 否   | 每页数量，默认 10|
| status   | string  | 否   | 消息状态过滤    |
| type     | string  | 否   | 消息类型过滤    |

#### 响应

```json
{
    "items": [
        {
            "id": "uuid",
            "title": "消息标题",
            "content": "消息内容",
            "type": "消息类型",
            "status": "消息状态",
            "created_at": "创建时间",
            "updated_at": "更新时间"
        }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
}
```

### 获取未处理消息

获取所有未处理的消息。

```http
GET /api/v1/messages/unprocessed
```

#### 响应

```json
{
    "items": [
        {
            "id": "uuid",
            "title": "消息标题",
            "content": "消息内容",
            "type": "消息类型",
            "created_at": "创建时间"
        }
    ]
}
```

### 标记消息为已处理

将指定消息标记为已处理状态。

```http
POST /api/v1/messages/{message_id}/process
```

#### 路径参数

| 参数       | 类型   | 描述     |
|------------|--------|----------|
| message_id | string | 消息 ID  |

#### 响应

```json
{
    "success": true,
    "message": "消息已处理"
}
```

## 订阅管理 API

### 获取订阅列表

获取用户的订阅列表。

```http
GET /api/v1/subscriptions
```

#### 响应

```json
{
    "items": [
        {
            "id": "uuid",
            "name": "订阅名称",
            "type": "订阅类型",
            "config": {
                "key": "value"
            },
            "status": "订阅状态",
            "created_at": "创建时间"
        }
    ]
}
```

### 创建订阅

创建新的订阅。

```http
POST /api/v1/subscriptions
```

#### 请求体

```json
{
    "name": "订阅名称",
    "type": "订阅类型",
    "config": {
        "key": "value"
    }
}
```

#### 响应

```json
{
    "id": "uuid",
    "name": "订阅名称",
    "type": "订阅类型",
    "config": {
        "key": "value"
    },
    "status": "active",
    "created_at": "创建时间"
}
```

### 更新订阅

更新现有订阅的配置。

```http
PUT /api/v1/subscriptions/{subscription_id}
```

#### 路径参数

| 参数            | 类型   | 描述     |
|-----------------|--------|----------|
| subscription_id | string | 订阅 ID  |

#### 请求体

```json
{
    "name": "新订阅名称",
    "config": {
        "key": "new_value"
    }
}
```

#### 响应

```json
{
    "id": "uuid",
    "name": "新订阅名称",
    "type": "订阅类型",
    "config": {
        "key": "new_value"
    },
    "status": "active",
    "updated_at": "更新时间"
}
```

### 删除订阅

删除指定的订阅。

```http
DELETE /api/v1/subscriptions/{subscription_id}
```

#### 路径参数

| 参数            | 类型   | 描述     |
|-----------------|--------|----------|
| subscription_id | string | 订阅 ID  |

#### 响应

```json
{
    "success": true,
    "message": "订阅已删除"
}
```

## 错误处理

### 错误响应格式

```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "错误描述",
        "details": {}  // 可选的详细信息
    }
}
```

### 常见错误码

| 错误码               | HTTP 状态码 | 描述                     |
|---------------------|-------------|--------------------------|
| UNAUTHORIZED        | 401         | 未认证或 Token 无效      |
| FORBIDDEN           | 403         | 权限不足                 |
| NOT_FOUND           | 404         | 资源不存在               |
| VALIDATION_ERROR    | 422         | 请求参数验证失败         |
| INTERNAL_ERROR      | 500         | 服务器内部错误           |

## 限流策略

API 使用令牌桶算法进行限流：

- 普通用户：100 请求/分钟
- 高级用户：1000 请求/分钟

超出限制时返回 429 状态码：

```json
{
    "error": {
        "code": "RATE_LIMIT_EXCEEDED",
        "message": "请求过于频繁，请稍后再试",
        "details": {
            "reset_at": "2024-12-15T10:00:00Z"
        }
    }
}
```
