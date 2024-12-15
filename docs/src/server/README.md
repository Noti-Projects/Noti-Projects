# 服务器端实现

## 项目概述

Noti Server 是基于 FastAPI 框架开发的后端服务，为 Android 客户端和 Web 前端提供统一的 API 接口。它负责消息的存储、检索和推送功能。

## 技术栈

- **框架**: FastAPI
- **数据库**: PostgreSQL
- **ORM**: SQLAlchemy
- **API 文档**: Swagger UI / ReDoc
- **异步支持**: asyncio
- **依赖注入**: FastAPI Dependency Injection

## 主要功能

### 1. 消息管理
- 消息的创建和存储
- 消息状态追踪
- 消息查询和过滤
- 批量消息处理

### 2. 订阅系统
- 订阅创建和管理
- 订阅规则配置
- 订阅状态同步
- 订阅消息推送

### 3. 用户系统
- 用户认证
- 权限管理
- 用户配置
- 会话管理

## 项目结构

```
server/
├── app/
│   ├── api/           # API 路由
│   │   ├── v1/
│   │   └── deps.py
│   ├── core/          # 核心配置
│   │   ├── config.py
│   │   └── security.py
│   ├── db/            # 数据库
│   │   ├── base.py
│   │   └── session.py
│   ├── models/        # 数据模型
│   ├── schemas/       # Pydantic 模型
│   └── services/      # 业务逻辑
├── tests/             # 测试
└── alembic/           # 数据库迁移
```

## API 接口

### 消息相关接口

#### 获取消息列表
```http
GET /api/v1/messages

Query Parameters:
- page: int = 1
- limit: int = 10
- status: str = None
- type: str = None

Response:
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

#### 获取未处理消息
```http
GET /api/v1/messages/unprocessed

Response:
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

#### 标记消息为已处理
```http
POST /api/v1/messages/{message_id}/process

Response:
{
    "success": true,
    "message": "消息已处理"
}
```

### 订阅相关接口

#### 获取订阅列表
```http
GET /api/v1/subscriptions

Response:
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

#### 创建订阅
```http
POST /api/v1/subscriptions

Request Body:
{
    "name": "订阅名称",
    "type": "订阅类型",
    "config": {
        "key": "value"
    }
}

Response:
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

## 开发指南

### 环境配置
1. Python 3.9+
2. PostgreSQL 13+
3. 虚拟环境管理工具 (如 poetry)

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/your-username/noti-server.git
cd noti-server

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 运行数据库迁移
alembic upgrade head

# 启动服务器
uvicorn app.main:app --reload
```

### 开发规范
1. 遵循 PEP 8 编码规范
2. 使用 Black 进行代码格式化
3. 使用 isort 管理导入顺序
4. 编写单元测试和集成测试

## 部署指南

### 使用 Docker 部署
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 使用 Docker Compose
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/noti
    depends_on:
      - db
  
  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=noti

volumes:
  postgres_data:
```

## 性能优化

### 数据库优化
1. 使用适当的索引
2. 优化查询语句
3. 使用连接池
4. 定期维护和清理

### 缓存策略
1. 使用 Redis 缓存热点数据
2. 实现缓存预热
3. 设置合理的缓存过期时间

### 并发处理
1. 使用异步处理
2. 实现任务队列
3. 合理使用连接池

## 监控和日志

### 日志配置
```python
import logging

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default"
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "app.log",
            "formatter": "default"
        }
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"]
    }
})
```

### 健康检查
```http
GET /health

Response:
{
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2024-12-15T10:00:00Z"
}
```
