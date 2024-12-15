---
title: 环境搭建
icon: install
---

# 环境搭建

本文将指导你如何从零开始搭建 Noti Android 客户端的开发环境。

## 必要条件

### 开发工具

1. **Android Studio**
   - 版本：Hedgehog | 2023.1.1 或更高
   - 下载：[Android Studio 官网](https://developer.android.com/studio)

2. **JDK (Java Development Kit)**
   - 版本：JDK 17 或更高
   - 推荐使用 Android Studio 内置的 OpenJDK

3. **Git**
   - 用于版本控制
   - 下载：[Git 官网](https://git-scm.com/)

### SDK 要求

- **Android SDK Platform**
  - API 34 (Android 14.0)
  - API 23 (Android 6.0) 或更高版本的 SDK Platform
  - Android SDK Build-Tools 34.0.0
  - Android SDK Tools
  - Android SDK Platform-Tools

## 安装步骤

### 1. 安装 Android Studio

1. 从官网下载并安装 Android Studio
2. 首次启动时，会自动下载必要的 SDK 组件
3. 通过 SDK Manager 确保安装了所需的 SDK 版本

### 2. 配置 Android SDK

1. 打开 Android Studio
2. 进入 Settings/Preferences
3. 导航到 Appearance & Behavior → System Settings → Android SDK
4. 安装必要的 SDK 平台和工具：
   - Android 14.0 (API 34)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Tools

### 3. 配置环境变量

#### Windows

1. 添加 ANDROID_HOME 环境变量：
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
```

2. 添加到 Path：
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

#### macOS/Linux

在 `~/.bash_profile` 或 `~/.zshrc` 中添加：
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 项目设置

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/noti.git
cd noti
```

### 2. 导入项目

1. 打开 Android Studio
2. 选择 "Open an existing project"
3. 导航到克隆的项目目录并打开

### 3. 配置 Gradle

1. 在项目根目录创建 `local.properties`（如果不存在）
2. 添加必要的配置：
```properties
sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
SERVER_URL=http://your-server-url
```

### 4. 同步项目

1. 点击 "Sync Project with Gradle Files"
2. 等待同步完成
3. 解决任何可能的依赖问题

## 运行项目

### 1. 创建模拟器

1. 打开 Device Manager
2. 点击 "Create Device"
3. 选择设备定义（如 Pixel 4）
4. 选择系统镜像（API 34）
5. 完成模拟器创建

### 2. 运行应用

1. 选择目标设备（模拟器或实体设备）
2. 点击 "Run" 按钮或使用快捷键 Shift + F10

## 常见问题

### Gradle 同步失败

1. 检查网络连接
2. 更新 Gradle 版本
3. 清理项目：Build → Clean Project
4. 删除 .gradle 文件夹后重新同步

### SDK 工具缺失

1. 打开 SDK Manager
2. 安装缺失的组件
3. 重新同步项目

### 编译错误

1. 检查 Build 窗口的错误信息
2. 确保所有依赖都正确配置
3. 尝试 Invalidate Caches / Restart

## 下一步

环境搭建完成后，你可以：

1. 阅读[架构文档](./architecture.md)了解项目结构
2. 查看[通知系统](./notification.md)了解核心功能
3. 开始进行实际开发
