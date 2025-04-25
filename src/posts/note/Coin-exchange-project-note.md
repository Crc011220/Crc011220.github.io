---
icon: pen-to-square
date: 2025-03-31
category:
  - Learning Records
tag:
  - Notes
---

# Coin exchange project note

## Differences between Nginx and Internal Microservice Gateways
- Gateways like Nginx are known for their performance and are suitable for acting as portal gateways, serving as the global gateway for external access, positioned at the outermost layer. In contrast, gateways like Spring Cloud Gateway are more akin to business gateways, primarily used to provide services to different clients and aggregate business. Each microservice is independently deployed with a single responsibility, and when providing services externally, there needs to be something to aggregate the business.
- Gateways like Spring Cloud Gateway can implement features such as circuit breaking and retries, which Nginx does not support.

## Dimensions of Gateway Rate Limiting Rules (Spring Cloud Gateway integrated with Sentinel for rate limiting)
1. Gateway Dimension
 - Represents the rate limiting rules when the gateway accesses the service
 - Coarse granularity—global configuration
2. API Group Dimension
 - Represents the rate limiting rules when the gateway accesses the interface
 - Fine granularity—local configuration

### Native Sentinel Configuration Method—JSON
```json
[
  {
    "resource": "admin-service_router",
    "resourceMode": 0 ,
    "count": 2,
    "intervalSec": 60
  },
  {
    "resource": "admin-service-api",
    "resourceMode":"1",
    "count": 1,
    "intervalSec": 60
  }
]
```

:::info
## 配置文件说明
- GatewayFlowRule：网关限流规则，针对 API Gateway 的场景定制的限流规则，可以针对不同 route 或自定义的 API 分组进行限流，支持针对请求中的参 数、Header、来源 IP 等进行定制化的限流。
- ApiDefinition：用户自定义的 API 定义分组，可以看做是一些 URL 匹配的组合。比如我们可以定义一个 API 叫 my_api，请求 path 模式为 /foo/** -和 /baz/** 的都归到 my_api 这个 API 分组下面。限流的时候可以针对这个自定义的 API 分组维度进行限流
- 其中网关限流规则 GatewayFlowRule 的字段解释如下：
- resource：资源名称，可以是网关中的 route 名称或者用户自定义的 API 分组名称。
- resourceMode：规则是针对 API Gateway 的 route（RESOURCE_MODE_ROUTE_ID）还是用户在 Sentinel 中定义的 API 分组- （RESOURCE_MODE_CUSTOM_API_NAME），默认是 route。
- grade：限流指标维度，同限流规则的 grade 字段。
- count：限流阈值
- intervalSec：统计时间窗口，单位是秒，默认是 1 秒。
- controlBehavior：流量整形的控制效果，同限流规则的 controlBehavior 字段，目前支持快速失败和匀速排队两种模式，默认是快速失败。
- burst：应对突发请求时额外允许的请求数目。
- maxQueueingTimeoutMs：匀速排队模式下的最长排队时间，单位是毫秒，仅在匀速排队模式下生效。
- paramItem：参数限流配置。若不提供，则代表不针对参数进行限流，该网关规则将会被转换成普通流控规则；否则会转换成热点规则。其中的字段：
- parseStrategy：从请求中提取参数的策略，目前支持提取来源 IP（PARAM_PARSE_STRATEGY_CLIENT_IP）、Host（PARAM_PARSE_STRATEGY_HOST）、任意 Header（PARAM_PARSE_STRATEGY_HEADER）和任意 URL 参数（PARAM_PARSE_STRATEGY_URL_PARAM）四种模式。
- fieldName：若提取策略选择 Header 模式或 URL 参数模式，则需要指定对应的 header 名称或 URL 参数名称。
- pattern：参数值的匹配模式，只有匹配该模式的请求属性值会纳入统计和流控；若为空则统计该请求属性的所有值。（1.6.2 版本开始支持）
- matchStrategy：参数值的匹配策略，目前支持精确匹配（PARAM_MATCH_STRATEGY_EXACT）、子串匹配（PARAM_MATCH_STRATEGY_CONTAINS）和正则匹配（PARAM_MATCH_STRATEGY_REGEX）。（1.6.2 版本开始支持）
:::

### Use Nacos to persist the rules
### Use Sentinel Dashboard to manage the rules by clickings


## Token
### How to solve the high load on the authorization server
- Use JWT and store it in Redis to prevent malicious attacks

## AOP
- `RequestContextHolder`: Used to access the context information of the current request.
- `ServletRequestAttributes`: Used to get and set attributes of the Servlet request.
- `ProceedingJoinPoint`: In AOP, represents the method being executed and allows you to control the execution of the method.
- `SecurityContextHolder`: Used to store and access the security context information in Spring Security.
- `MethodSignature`: Used in AOP aspects to obtain the signature information of the proxied method.
- `Authentication`: Used in Spring Security to represent and access the authentication information of the current user.


## Difference Between `bootstrap.yml` and YAML on Nacos
`bootstrap.yml` is a special configuration file used in Spring Boot applications that is loaded before the `application.yml`. It is primarily used for setting up the environment and context in which the application runs, such as property sources, encryption, and decryption keys. Here's how it differs from YAML configurations on Nacos:
### `bootstrap.yml`
- **Bootstrap Phase**: `bootstrap.yml` is loaded early in the application startup process, before the `ApplicationContext` is created.
- **Purpose**: It is used to configure the bootstrap phase of the application, including setting up the Spring Cloud Config Server and Nacos configuration center.
- **Content**: It typically contains non-overridable properties that are essential for the application to start, such as service discovery, config server, and encryption configurations.
- **Example**:
  ```yaml
  spring:
    application:
      name: my-service
    cloud:
      nacos:
        config:
          server-addr: 127.0.0.1:8848
          file-extension: yaml
  ```
### YAML on Nacos
- **Dynamic Configuration**: YAML configurations on Nacos are dynamically managed and can be updated at runtime without restarting the application.
- **Purpose**: They are used to externalize and manage application configurations centrally, allowing for easier updates and less downtime.
- **Content**: These configurations can include any properties that are part of your `application.yml`, such as database settings, feature flags, and service-specific configurations.
- **Example**: A configuration file named `my-service.yaml` on Nacos might look like this:
  ```yaml
  server:
    port: 8080
  spring:
    datasource:
      url: jdbc:mysql://localhost:3306/mydb
      username: user
      password: pass
  ```
In summary, `bootstrap.yml` is used for the initial setup and bootstrap phase of the application, while YAML configurations on Nacos are used for dynamic, runtime configuration management.

## PatchMapping and PutMapping
- Partial Update vs. Full Update: @PatchMapping is used for partial updates of resources, while @PutMapping is used for full updates of resources.
- Request Body Content: When using @PatchMapping, the request body usually contains only the fields to be updated, whereas the request body of @PutMapping contains the complete state of the resource.
- Idempotency: The PUT method is idempotent, meaning that multiple identical requests will have the same effect. The PATCH method is usually idempotent, but its idempotency depends on the implementation details.
- In practical applications, choosing between @PatchMapping and @PutMapping depends on your specific needs and the granularity of resource updates. If you only need to update part of the resource's attributes, @PatchMapping is more appropriate; if you need to replace the entire resource, you should use @PutMapping.

## @NotNull and @NotBlank
- @NotNull: Used to ensure that a parameter is not null.
- @NotBlank: Used to ensure that a string parameter is not blank (i.e., not empty or only whitespace).
- Need to use @Validated annotation to validate the parameters on Controller.

## AutoFilledValue in Mybatis-Plus
- No need to set the value of the field in the entity class, and the value will be automatically filled by Mybatis-Plus.
```java
/**
 *字段自动填充
 */
@Component
public class AutoFiledValueHandler implements MetaObjectHandler {


    /**
     * 新增时填入值
     * @param metaObject
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        Long userId = getUserId();
        /**
         * 3 种情况不填充
         * 1 值为null
         * 2 自动类型不匹配
         * 3 没有改字段
         */
        this.strictInsertFill(metaObject, "lastUpdateTime", Date.class, new Date());
        this.strictInsertFill(metaObject, "createBy", Long.class, userId); // 创建人的填充
        this.strictInsertFill(metaObject, "created", Date.class, new Date());

    }


    /**
     * 修改时填入值
     * @param metaObject
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        Long userId = getUserId();
        this.strictInsertFill(metaObject, "lastUpdateTime", Date.class, new Date());
        this.strictInsertFill(metaObject, "modifyBy", Long.class, userId); // 修改人的填充

    }

    /**
     * 获取安全上下文里的用户对象 --- 主要是在线程里面获取改值
     * @return
     */
    private Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = null;
        if (authentication != null) {
            String principal = authentication.getPrincipal().toString();
            userId = Long.valueOf(principal);
        }
        return userId;
    }
}

// domain example
@TableField(value = "create_by", fill = FieldFill.INSERT) // 自动填充 来自AutoFiledValueHandler
@ApiModelProperty(value="创建人")
private Long createBy;
```

## SecurityContextHolder

In Spring Security, `SecurityContextHolder.getContext().getAuthentication().getPrincipal()` is a common method used to obtain the principal of the currently authenticated user. Here is an explanation of each part:
- `SecurityContextHolder.getContext()`: Retrieves the current security context (SecurityContext), which contains the security information of the current thread, such as the authentication object (Authentication).
- `.getAuthentication()`: Obtains the current authentication object (Authentication) from the security context, which contains detailed information about the authenticated user, such as username, password, authorities, and the user principal.
- `.getPrincipal()`: Retrieves the user principal from the authentication object. Typically, this principal is a UserDetails implementation or a string, depending on your configuration. If the user is authenticated, this method usually returns an object representing the current user.
- `.toString()`: Converts the obtained user principal to a string. This usually calls the `toString()` method of the user principal object.
Here are some key points about this expression:
- If the user is not authenticated, `getAuthentication()` may return a null Authentication object, and calling `getPrincipal()` will return null, so calling the `toString()` method in this case will throw a `NullPointerException`.
- If the user is authenticated, `getPrincipal()` typically returns a `UserDetails` implementation or a custom user entity. In this case, calling `toString()` will return the string representation of that object, which is usually the fully qualified class name plus the memory address.

When using this expression, you should always ensure that the user is authenticated and handle potential null values appropriately.


## isBlank() vs. isEmpty()
In summary, the isBlank method checks if a string is empty or contains only whitespace characters, while the isEmpty method only checks if a string is null or empty (length is 0). If you want to check if a string has no useful content at all (including whitespace characters), you should use isBlank. If you only care if the string is null or empty, and do not care if it contains whitespace characters, then you should use isEmpty.

## AWS SNS (SMS service)
- No SMS template service

## Mapstruct

## Request Combination
- minimize rpc call as much as possible
- combine multiple request into one request
- use batch request to improve performance


## JetCache as distributed lock
```java

// Add a distributed lock for the operation identified by cashRechargeAuditRecord.getId().
// If the lock is successfully acquired, execute the specified business logic within 5 minutes (300 seconds).
// Otherwise, skip execution to prevent duplicate processing.

// @CreateCache(
//     name = "CASH_RECHARGE_LOCK",     // Cache name (prefix)
//     timeUnit = TimeUnit.SECONDS,     // Expiration time unit
//     expire = 100,                    // Default expiration time: 100 seconds
//     cacheType = CacheType.BOTH       // Use both local cache and remote cache (e.g., Redis)
// )

    @CreateCache(name = "CASH_RECHARGE_LOCK", timeUnit = TimeUnit.SECONDS, expire = 100, cacheType = CacheType.BOTH)
    private Cache<String, String> cache;

    cache.tryLockAndRun(cashRechargeAuditRecord.getId() + "" , 300, TimeUnit.SECONDS, () -> {
          //do something
    })
```

## Feign
```java
@FeignClient(value = "admin-bank-service", path = "/adminBanks", configuration = OAuth2FeignConfig.class)
```
When using @FeignClient in Spring Cloud, if multiple clients use the same name (or value, they are equivalent), the Spring container will consider them as the same bean, resulting in conflicts when registering multiple. Adding a contextId in the annotation resolves this issue.

## SnowFlake Config
```java
import cn.hutool.core.lang.Snowflake;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IdConfig {

    @Value("${snow.app.id:3}")
    private Integer appId;
    @Value("${snow.data.id:1}")
    private Integer dataId;
    @Bean
    public Snowflake snowflake() {
        return new Snowflake(appId, dataId);
    }
}
```
#### appid
官方名称：通常对应 Snowflake 的 workerId（工作节点ID）

作用：标识不同的应用实例或服务节点

取值范围：一般 0~31（5位二进制，最多支持32个应用实例）

使用场景：当你的系统部署了多个相同服务的实例时（如微服务多实例部署）

用于区分同一数据中心内的不同服务

#### dataid
官方名称：对应 Snowflake 的 datacenterId

作用：标识不同的数据中心/机房

取值范围：一般 0~31（5位二进制，最多支持32个数据中心）

使用场景：当你的系统跨机房/跨地域部署时

用于避免不同机房生成的ID冲突


## Disruptor

### 一、Disruptor 简介

**Disruptor** 是由英国金融公司 **LMAX** 开发的一个高性能并发框架，核心目标是**在多线程之间高效传递消息**，主要用于替代 `BlockingQueue` 实现更快的生产者-消费者模型。

#### 核心特点：

- 高吞吐量（百万级 ops/s）
- 低延迟（微秒级别）
- 无锁设计（基于 CAS 操作）
- 对 GC 友好（预分配内存）
- 适用于：高频交易、日志系统、游戏服务器事件处理等

---

### 二、RingBuffer：Disruptor 的核心组件


RingBuffer 是 Disruptor 中的**核心数据结构**，相当于一个 **环形队列**，用于在多线程间传递事件数据。

- 本质是一个循环数组，位置用完之后回到起点，循环使用。
- 环大小通常是 **2 的幂次方**
- 环中每个格子叫做一个 `slot`（槽位）
- 使用序号 `sequence` 控制读写位置
- 多个生产者/消费者时需协调读写顺序

---

#### RingBuffer 创建示例

```java
RingBuffer<Event> ringBuffer = RingBuffer.createSingleProducer(
    Event::new,         // Event 工厂
    1024,               // 大小必须为 2 的幂
    new BlockingWaitStrategy() // 等待策略
);
```

---

### 三、Disruptor 的使用流程

#### 👣 步骤概览：

1. 创建事件类 `Event` （用于传输的数据）
2. 实现事件处理器 `EventHandler`
3. 初始化 RingBuffer 和 Disruptor
4. 启动 Disruptor
5. 生产者发布事件

---

#### 示例代码简化版：

```java
// 1. 事件类
public class Event {
    private String value;
    public void setValue(String value) { this.value = value; }
    public String getValue() { return value; }
}

// 2. 事件处理器
public class EventHandlerImpl implements EventHandler<Event> {
    @Override
    public void onEvent(Event event, long sequence, boolean endOfBatch) {
        System.out.println("处理事件: " + event.getValue());
    }
}

// 3. 初始化 Disruptor
Disruptor<Event> disruptor = new Disruptor<>(
    Event::new,
    1024,
    Executors.defaultThreadFactory(),
    ProducerType.SINGLE,
    new BlockingWaitStrategy()
);
disruptor.handleEventsWith(new EventHandlerImpl());
disruptor.start();

// 4. 发布事件
RingBuffer<Event> ringBuffer = disruptor.getRingBuffer();
long seq = ringBuffer.next();
try {
    Event event = ringBuffer.get(seq);
    event.setValue("Hello, Disruptor!");
} finally {
    ringBuffer.publish(seq);
}
```

---

### 四、等待策略（Wait Strategy）

等待策略用于控制消费者线程在等待新数据时的行为。

| 策略类型             | 描述                         |
|----------------------|------------------------------|
| `BlockingWaitStrategy` | 使用锁和条件变量（最安全）     |
| `BusySpinWaitStrategy` | 自旋等待（CPU资源占用高，低延迟） |
| `YieldingWaitStrategy` | 使用 `Thread.yield()`，适合低延迟 |
| `SleepingWaitStrategy` | 使用 `Thread.sleep()`，适合日志等低 CPU 场景 |

---

### 五、总结对比：Disruptor vs BlockingQueue

| 特性           | Disruptor                  | BlockingQueue             |
|----------------|----------------------------|---------------------------|
| 内部结构       | RingBuffer（循环数组）     | 链表/数组                 |
| 并发性能       | 极高（无锁）               | 一般（加锁）              |
| 内存分配       | 预分配，低 GC              | 动态分配，易触发 GC       |
| 延迟           | 微秒级                     | 毫秒级                    |
| 等待机制       | 可定制 WaitStrategy        | 固定阻塞行为              |

---

- [Disruptor GitHub 地址](https://github.com/LMAX-Exchange/disruptor)

---
