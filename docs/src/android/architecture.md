---
title: 架构设计
icon: structure
---

# 架构设计

Noti Android 客户端采用 MVVM 架构模式，结合 Android Jetpack 组件，实现了清晰的代码结构和关注点分离。

## 整体架构

### 分层设计

```
┌─────────────┐
│     UI      │  ← Activity/Fragment + XML Layouts
├─────────────┤
│  ViewModel  │  ← UI Logic + State Management
├─────────────┤
│ Repository  │  ← Data Operations
├─────────────┤
│ Data Source │  ← API + Local Database
└─────────────┘
```

### 各层职责

1. **UI 层**
   - 处理用户界面展示
   - 响应用户交互
   - 观察 ViewModel 的数据变化

2. **ViewModel 层**
   - 管理 UI 相关的数据
   - 处理业务逻辑
   - 协调 Repository 和 UI 层

3. **Repository 层**
   - 统一数据操作接口
   - 协调远程和本地数据
   - 实现数据缓存策略

4. **数据源层**
   - 远程数据源（API）
   - 本地数据源（Room）

## 核心组件

### 1. UI 组件

#### Activity

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setupNavigation()
    }
}
```

#### Fragment

```kotlin
@AndroidEntryPoint
class SubscriptionFragment : Fragment() {
    private val viewModel: SubscriptionViewModel by viewModels()
    private lateinit var binding: FragmentSubscriptionBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSubscriptionBinding.inflate(inflater, container, false)
        return binding.root
    }
}
```

### 2. ViewModel

```kotlin
@HiltViewModel
class SubscriptionViewModel @Inject constructor(
    private val repository: SubscriptionRepository
) : ViewModel() {
    private val _subscriptions = MutableLiveData<List<SubscriptionItem>>()
    val subscriptions: LiveData<List<SubscriptionItem>> = _subscriptions

    fun loadSubscriptions() {
        viewModelScope.launch {
            _subscriptions.value = repository.getSubscriptions()
        }
    }
}
```

### 3. Repository

```kotlin
class SubscriptionRepository @Inject constructor(
    private val api: ApiService,
    private val db: AppDatabase
) {
    suspend fun getSubscriptions(): List<SubscriptionItem> {
        return try {
            val remoteData = api.getSubscriptions()
            db.subscriptionDao().insertAll(remoteData)
            remoteData
        } catch (e: Exception) {
            db.subscriptionDao().getAll()
        }
    }
}
```

### 4. 数据模型

```kotlin
@Entity(tableName = "subscriptions")
data class SubscriptionEntity(
    @PrimaryKey val id: Int,
    val title: String,
    var isSubscribed: Boolean
)

data class SubscriptionItem(
    val id: Int,
    val title: String,
    var isSubscribed: Boolean
)
```

## 依赖注入

使用 Hilt 进行依赖注入：

```kotlin
@HiltAndroidApp
class NotiApplication : Application()

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideApiService(): ApiService {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .build()
            .create(ApiService::class.java)
    }
}
```

## 导航架构

使用 Navigation Component 管理页面导航：

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/mobile_navigation"
    app:startDestination="@+id/navigation_home">

    <fragment
        android:id="@+id/navigation_home"
        android:name="com.ccviolett.noti.ui.home.HomeFragment"
        android:label="@string/title_home" />

    <fragment
        android:id="@+id/navigation_subscription"
        android:name="com.ccviolett.noti.ui.subscription.SubscriptionFragment"
        android:label="@string/title_subscription" />
</navigation>
```

## 数据流

### 1. UI 更新流程

```
User Action → Fragment → ViewModel → Repository → API/Database
     ↑          ↑          |
     └──────────└──────────┘
        Data Updates
```

### 2. 数据缓存策略

1. **在线模式**
   - 优先从 API 获取数据
   - 数据保存到本地数据库
   - UI 显示最新数据

2. **离线模式**
   - 从本地数据库获取数据
   - 显示缓存的数据
   - 网络恢复后自动同步

## 测试策略

### 1. 单元测试

```kotlin
@Test
fun `test subscription toggle`() = runTest {
    val repository = FakeSubscriptionRepository()
    val viewModel = SubscriptionViewModel(repository)
    
    viewModel.toggleSubscription(1)
    
    val result = viewModel.subscriptions.getOrAwaitValue()
    assertTrue(result[0].isSubscribed)
}
```

### 2. UI 测试

```kotlin
@Test
fun testSubscriptionList() {
    launchFragmentInContainer<SubscriptionFragment>()
    
    onView(withId(R.id.subscription_list))
        .check(matches(isDisplayed()))
}
```
