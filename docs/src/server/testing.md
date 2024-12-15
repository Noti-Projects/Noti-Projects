---
title: 测试指南
icon: test
---

# 测试指南

本文档介绍了 Noti 服务器端的测试策略和实现方法。

## 测试框架

### 1. pytest

我们使用 pytest 作为主要的测试框架：

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Noti API"}
```

### 2. TestClient

使用 FastAPI 的 TestClient 进行 API 测试：

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_message():
    response = client.post(
        "/messages/",
        json={"title": "Test Message", "content": "Test Content"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Message"
```

## 测试类型

### 1. 单元测试

测试独立的函数和类：

```python
def test_message_model():
    message = Message(
        title="Test",
        content="Content",
        priority=MessagePriority.HIGH
    )
    assert message.title == "Test"
    assert message.priority == MessagePriority.HIGH
```

### 2. 集成测试

测试多个组件的交互：

```python
async def test_message_flow():
    # 创建消息
    message = await create_message("Test", "Content")
    
    # 发送通知
    notification = await send_notification(message.id)
    
    # 验证结果
    assert notification.status == "sent"
    assert notification.message_id == message.id
```

### 3. API 测试

测试 API 端点：

```python
def test_subscription_api():
    # 创建订阅
    response = client.post(
        "/subscriptions/",
        json={"topic": "test", "callback_url": "http://test.com"}
    )
    assert response.status_code == 201
    
    # 获取订阅列表
    response = client.get("/subscriptions/")
    assert response.status_code == 200
    assert len(response.json()) > 0
```

## 测试数据库

### 1. 测试数据库配置

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///./test.db")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    return TestingSessionLocal()
```

### 2. 数据库测试示例

```python
def test_create_user(test_db):
    user = User(username="test_user", email="test@example.com")
    test_db.add(user)
    test_db.commit()
    
    db_user = test_db.query(User).filter_by(username="test_user").first()
    assert db_user is not None
    assert db_user.email == "test@example.com"
```

## Mock 和依赖注入

### 1. 使用 Mock 对象

```python
from unittest.mock import Mock, patch

def test_notification_service():
    mock_client = Mock()
    mock_client.send_notification.return_value = {"status": "success"}
    
    with patch("app.services.notification.client", mock_client):
        result = send_notification("Test message")
        assert result["status"] == "success"
```

### 2. 依赖注入

```python
async def test_message_with_mock_db():
    async def mock_get_db():
        yield test_db
    
    app.dependency_overrides[get_db] = mock_get_db
    
    response = client.post(
        "/messages/",
        json={"title": "Test", "content": "Content"}
    )
    assert response.status_code == 201
```

## 性能测试

### 1. 负载测试

使用 locust 进行负载测试：

```python
from locust import HttpUser, task, between

class NotificationUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def send_notification(self):
        self.client.post(
            "/notifications/",
            json={
                "title": "Test Notification",
                "content": "Test Content"
            }
        )
```

### 2. 基准测试

```python
import pytest
import time

def test_message_processing_performance():
    start_time = time.time()
    
    # 处理1000条消息
    for i in range(1000):
        process_message(f"Message {i}")
    
    end_time = time.time()
    processing_time = end_time - start_time
    
    assert processing_time < 10  # 确保处理时间在10秒内
```

## 测试覆盖率

### 1. 配置 pytest-cov

```ini
[tool:pytest]
addopts = --cov=app --cov-report=html
testpaths = tests
```

### 2. 运行覆盖率测试

```bash
pytest --cov=app --cov-report=html
```

## 持续集成

### 1. GitHub Actions 配置

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      - name: Run tests
        run: |
          pytest --cov=app --cov-report=xml
```

## 最佳实践

1. 保持测试简单和可维护
2. 使用有意义的测试名称
3. 每个测试只测试一个功能点
4. 适当使用测试夹具（fixtures）
5. 保持测试之间的独立性
6. 定期运行测试套件
7. 维护高测试覆盖率

## 常见问题

### 1. 异步测试

处理异步函数的测试：

```python
@pytest.mark.asyncio
async def test_async_function():
    result = await async_function()
    assert result is not None
```

### 2. 数据库清理

确保测试后清理数据：

```python
@pytest.fixture(autouse=True)
async def cleanup():
    yield
    await database.execute("DELETE FROM messages")
```

### 3. 环境变量

管理测试环境变量：

```python
@pytest.fixture(autouse=True)
def env_setup():
    with patch.dict("os.environ", {"API_KEY": "test_key"}):
        yield
```
