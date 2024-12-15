# Android 客户端

## 项目概述

Noti Android 客户端是一个现代化的通知管理应用，使用 Kotlin 开发，采用 MVVM 架构模式。它提供了实时消息通知、消息管理和订阅配置等功能。

## 技术栈

- **开发语言**: Kotlin
- **最低 SDK**: Android 8.0 (API level 26)
- **目标 SDK**: Android 14 (API level 34)
- **架构模式**: MVVM
- **主要依赖**:
  - Android Jetpack
  - Room Database
  - Retrofit
  - Kotlin Coroutines
  - WorkManager

## 主要功能

### 1. 消息管理
- 显示消息列表
- 消息详情查看
- 消息状态管理
- 本地消息存储

### 2. 通知系统
- 实时消息通知
- 通知权限管理
- 通知渠道配置
- 前台服务保活

### 3. 订阅功能
- 订阅列表管理
- 订阅配置
- 订阅状态同步

## 项目结构

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/ccviolett/noti/
│   │   │   ├── data/           # 数据层
│   │   │   │   ├── api/        # API 接口
│   │   │   │   ├── dao/        # 数据访问对象
│   │   │   │   ├── model/      # 数据模型
│   │   │   │   └── repository/ # 数据仓库
│   │   │   ├── service/        # 服务
│   │   │   ├── ui/             # 界面
│   │   │   └── utils/          # 工具类
│   │   └── res/                # 资源文件
│   └── test/                   # 测试
└── build.gradle.kts            # 构建配置
```

## 开发指南

### 环境配置
1. Android Studio Hedgehog | 2023.1.1
2. JDK 17 或更高版本
3. Android SDK Platform-Tools 34.0.0

### 构建步骤
1. 克隆项目仓库
2. 在 Android Studio 中打开项目
3. 同步 Gradle 依赖
4. 运行应用

### 开发规范
1. 使用 Kotlin 编码规范
2. 遵循 MVVM 架构模式
3. 使用 Kotlin Coroutines 处理异步操作
4. 保持代码整洁和可维护性

## 最佳实践

### 1. 性能优化
- 使用 ViewBinding 代替 findViewById
- 使用协程处理异步任务
- 优化数据库操作
- 合理使用缓存

### 2. 内存管理
- 避免内存泄漏
- 及时释放资源
- 使用 WeakReference

### 3. 电池优化
- 合理使用后台服务
- 优化网络请求
- 适当的轮询间隔

### 4. 用户体验
- 流畅的界面交互
- 合理的错误提示
- 优雅的加载状态
- 友好的空状态处理
