---
title: 通知系统
icon: notice
---

# 通知系统

Noti Android 客户端实现了一个完整的通知管理系统，支持接收、显示和管理各类通知。

## 通知系统实现

### 概述
Noti Android 客户端使用前台服务实现了实时通知系统，可以及时接收和显示新消息。

### 核心功能

#### 前台服务
使用 `NotificationService` 作为前台服务，确保通知检查服务持续运行：
```kotlin
class NotificationService : Service() {
    companion object {
        private const val TAG = "NotificationService"
        private const val NOTIFICATION_CHANNEL_ID = "noti_service_channel"
        private const val FOREGROUND_SERVICE_ID = 1
        private const val CHECK_INTERVAL = 10000L // 10秒检查一次
    }

    private var checkJob: Job? = null
    private lateinit var notificationManager: NotificationManager
}
```

#### 消息检查
使用 Kotlin 协程实现定期检查新消息：
```kotlin
private fun startNotificationCheck() {
    checkJob = CoroutineScope(Dispatchers.IO).launch {
        while (isActive) {
            try {
                val messages = ApiClient.notificationService.getUnprocessedMessages()
                messages.forEach { message ->
                    showNotification(message.title, message.content)
                    ApiClient.notificationService.processMessage(message.id)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error checking messages", e)
            }
            delay(CHECK_INTERVAL)
        }
    }
}
```

#### 通知权限管理
适配 Android 13 的通知权限要求：
```kotlin
private fun checkPermissionAndStartService() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED -> {
                startNotificationService()
            }
            else -> {
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    } else {
        startNotificationService()
    }
}
```

## 实现细节

### 通知渠道
为了支持 Android 8.0 及以上版本，创建了专门的通知渠道：
```kotlin
private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel(
            NOTIFICATION_CHANNEL_ID,
            "消息检查服务",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "用于保持消息检查服务运行"
        }
        notificationManager.createNotificationChannel(channel)
    }
}
```

### 前台服务通知
创建前台服务所需的持久通知：
```kotlin
private fun createForegroundNotification() = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
    .setSmallIcon(R.drawable.ic_notification)
    .setContentTitle("消息检查服务")
    .setContentText("正在运行中...")
    .setPriority(NotificationCompat.PRIORITY_LOW)
    .build()
```

### 消息通知
显示新消息的通知：
```kotlin
private fun showNotification(title: String, content: String) {
    val notification = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
        .setSmallIcon(R.drawable.ic_notification)
        .setContentTitle(title)
        .setContentText(content)
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setAutoCancel(true)
        .setVibrate(longArrayOf(0, 500))
        .build()

    notificationManager.notify(notificationId++, notification)
}
```

## 最佳实践
1. 使用前台服务确保通知检查服务不被系统杀死
2. 采用协程处理异步操作，避免阻塞主线程
3. 适当的错误处理和日志记录
4. 适配不同 Android 版本的通知权限要求
5. 使用通知渠道管理不同类型的通知

## 注意事项
1. 需要在 AndroidManifest.xml 中声明必要的权限
2. 需要处理服务的生命周期
3. 注意内存泄漏的问题，在服务销毁时取消协程
4. 考虑网络状态的变化
5. 注意电池优化的影响

## 核心组件

### 1. 通知服务

```kotlin
@AndroidEntryPoint
class NotificationService : FirebaseMessagingService() {
    @Inject
    lateinit var notificationManager: NotificationManagerCompat

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        
        // 创建通知渠道
        createNotificationChannel()
        
        // 显示通知
        showNotification(message)
    }
}
```

### 2. 通知渠道管理

```kotlin
private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Noti Notifications",
            NotificationManager.IMPORTANCE_DEFAULT
        ).apply {
            description = "Receive notifications from Noti"
        }
        
        notificationManager.createNotificationChannel(channel)
    }
}
```

### 3. 通知构建器

```kotlin
private fun buildNotification(message: RemoteMessage): Notification {
    return NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(R.drawable.ic_notification)
        .setContentTitle(message.notification?.title)
        .setContentText(message.notification?.body)
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .setAutoCancel(true)
        .build()
}
```

## 通知类型

### 1. 基本通知
基本的文本通知，包含标题和内容。

### 2. 大文本通知
支持显示长文本内容的通知。

### 3. 进度通知
显示下载或上传进度的通知。

### 4. 自定义通知
支持自定义布局的通知。

## 通知管理

### 1. 通知状态
- 未读/已读状态管理
- 通知优先级设置
- 通知分组管理

### 2. 通知操作
- 点击操作
- 滑动删除
- 快捷回复
- 通知静音

### 3. 通知存储
使用 Room 数据库存储通知历史：

```kotlin
@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey val id: Int,
    val title: String,
    val content: String,
    val timestamp: Long,
    var isRead: Boolean = false
)
```

### 4. 通知列表
使用 RecyclerView 显示通知列表：

```kotlin
class NotificationAdapter : ListAdapter<NotificationItem, NotificationViewHolder>(
    NotificationDiffCallback()
) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationViewHolder {
        return NotificationViewHolder(
            ItemNotificationBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: NotificationViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
}
```

## 通知设置

### 1. 通知开关
允许用户控制不同类型通知的开关：

```kotlin
class NotificationSettingsViewModel @Inject constructor(
    private val repository: NotificationSettingsRepository
) : ViewModel() {
    val settings = repository.getNotificationSettings()
        .stateIn(viewModelScope, SharingStarted.Lazily, NotificationSettings())
    
    fun updateSettings(settings: NotificationSettings) {
        viewModelScope.launch {
            repository.updateNotificationSettings(settings)
        }
    }
}
```

### 2. 通知过滤
支持根据关键词或规则过滤通知：

```kotlin
fun filterNotifications(notifications: List<NotificationItem>): List<NotificationItem> {
    return notifications.filter { notification ->
        notification.priority >= minPriority &&
        !notification.title.containsAnyOf(blockedKeywords)
    }
}
```

### 3. 通知时间设置
允许用户设置免打扰时间段：

```kotlin
data class QuietHours(
    val enabled: Boolean = false,
    val startTime: LocalTime = LocalTime.of(22, 0),
    val endTime: LocalTime = LocalTime.of(7, 0)
)
