# Noti Projects

这是一个基于 monorepo 管理的通知系统项目集合，包含以下子项目：

## 项目结构

```
noti/                    # 项目根目录
├── apps/                # 应用程序目录
│   ├── android/        # Android 客户端
│   ├── server/         # FastAPI 后端服务
│   └── web/           # Web 前端
├── docs/               # 项目文档 (VuePress)
├── packages/           # 共享包目录
│   ├── common/        # 共享工具和类型
│   └── api/           # API 客户端库
└── tools/              # 开发工具和脚本
```

## 子项目说明

### Android 客户端 (apps/android)
- 使用 Kotlin 开发的原生 Android 应用
- 采用 MVVM 架构
- 实现实时消息通知功能

### 后端服务 (apps/server)
- 基于 FastAPI 框架
- 提供 RESTful API
- 支持消息的存储和检索

### Web 前端 (apps/web)
- 现代化的 Web 界面
- 支持消息管理和订阅配置

### 项目文档 (docs)
- 使用 VuePress 构建
- 包含所有子项目的文档
- 提供完整的开发指南

## 开发指南

1. 克隆项目
```bash
git clone https://github.com/yourusername/noti.git
cd noti
```

2. 安装依赖
- 每个子项目都有自己的依赖管理
- 请参考各子项目目录下的 README.md

3. 本地开发
- Android: 使用 Android Studio 打开 apps/android 目录
- Server: 参考 apps/server 目录下的开发指南
- Web: 参考 apps/web 目录下的开发指南
- 文档: 在 docs 目录下运行开发服务器

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License
