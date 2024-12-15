# Web 前端

## 项目概述

Noti Web 是一个现代化的 Web 应用，提供消息管理和订阅配置的图形界面。它使用 Vue.js 3 和 TypeScript 开发，采用 Vite 作为构建工具。

## 技术栈

- **框架**: Vue.js 3
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI 框架**: TailwindCSS
- **HTTP 客户端**: Axios
- **路由**: Vue Router

## 主要功能

### 1. 消息管理
- 消息列表展示
- 消息详情查看
- 消息状态管理
- 消息搜索和过滤

### 2. 订阅管理
- 订阅列表
- 订阅配置
- 订阅状态监控
- 订阅数据统计

### 3. 用户界面
- 响应式设计
- 深色模式支持
- 多语言支持
- 自定义主题

## 项目结构

```
web/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 组件
│   ├── composables/   # 组合式函数
│   ├── layouts/       # 布局组件
│   ├── pages/         # 页面
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── types/         # 类型定义
│   └── utils/         # 工具函数
├── public/            # 公共资源
└── vite.config.ts     # Vite 配置
```

## 开发指南

### 环境要求
- Node.js 18+
- pnpm 8+

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/your-username/noti-web.git
cd noti-web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### 开发规范

#### 1. 组件命名
- 使用 PascalCase 命名组件
- 页面组件使用 Page 后缀
- 通用组件使用 Base 前缀

```vue
<!-- 页面组件 -->
<script setup lang="ts">
// MessagesPage.vue
</script>

<!-- 基础组件 -->
<script setup lang="ts">
// BaseButton.vue
</script>
```

#### 2. 类型定义
```typescript
// types/message.ts
export interface Message {
  id: string
  title: string
  content: string
  type: MessageType
  status: MessageStatus
  createdAt: string
  updatedAt: string
}

export enum MessageType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  PROCESSED = 'processed'
}
```

#### 3. API 调用
```typescript
// api/messages.ts
import { http } from '@/utils/http'
import type { Message } from '@/types/message'

export const messageApi = {
  getList: (params: MessageQueryParams) => {
    return http.get<PaginatedResponse<Message>>('/api/messages', { params })
  },
  
  getById: (id: string) => {
    return http.get<Message>(`/api/messages/${id}`)
  },
  
  process: (id: string) => {
    return http.post(`/api/messages/${id}/process`)
  }
}
```

#### 4. 状态管理
```typescript
// stores/message.ts
import { defineStore } from 'pinia'
import type { Message } from '@/types/message'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    error: null as Error | null
  }),
  
  actions: {
    async fetchMessages() {
      this.loading = true
      try {
        const response = await messageApi.getList()
        this.messages = response.data.items
      } catch (error) {
        this.error = error as Error
      } finally {
        this.loading = false
      }
    }
  }
})
```

## 组件示例

### 消息列表组件
```vue
<!-- components/MessageList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessageStore } from '@/stores/message'
import type { Message } from '@/types/message'

const store = useMessageStore()
const messages = ref<Message[]>([])

onMounted(async () => {
  await store.fetchMessages()
  messages.value = store.messages
})
</script>

<template>
  <div class="message-list">
    <div v-if="store.loading" class="loading">
      加载中...
    </div>
    <template v-else>
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-item"
      >
        <h3>{{ message.title }}</h3>
        <p>{{ message.content }}</p>
        <div class="message-meta">
          <span>{{ message.type }}</span>
          <span>{{ message.status }}</span>
          <time>{{ message.createdAt }}</time>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.message-list {
  @apply space-y-4;
}

.message-item {
  @apply p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow;
}

.message-meta {
  @apply mt-2 text-sm text-gray-500 flex gap-4;
}
</style>
```

## 部署指南

### 使用 Docker 部署
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Nginx 配置
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 性能优化

### 1. 代码分割
```typescript
// router/index.ts
const routes = [
  {
    path: '/messages',
    component: () => import('@/pages/MessagesPage.vue')
  },
  {
    path: '/subscriptions',
    component: () => import('@/pages/SubscriptionsPage.vue')
  }
]
```

### 2. 资源优化
- 使用 Vite 的构建优化
- 图片懒加载
- 组件懒加载
- 合理的缓存策略

### 3. 状态管理优化
- 使用 Pinia 的持久化插件
- 合理的数据预取
- 优化重复请求
