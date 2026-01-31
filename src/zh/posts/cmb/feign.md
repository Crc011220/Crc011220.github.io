---
icon: pen-to-square
date: 2026-01-25
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# Feign

Feign 是 Spring Cloud 提供的声明式 HTTP 客户端，用于简化微服务之间的调用。它通过接口定义和注解来调用远程服务，无需编写 HTTP 请求代码。

## 核心特性

- **声明式调用**：通过接口定义，无需实现类
- **负载均衡**：集成 Ribbon，自动实现负载均衡
- **服务发现**：集成 Eureka/Consul，自动发现服务
- **请求/响应拦截**：支持请求和响应拦截器
- **容错处理**：支持 Hystrix 熔断降级

## 基本使用

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

### 2. 启用 Feign 客户端

```java
@SpringBootApplication
@EnableFeignClients  // 启用 Feign 客户端
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 3. 定义 Feign 客户端接口

```java
@FeignClient(name = "user-service", path = "/api/users")
public interface UserFeignClient {
    
    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
    
    @PostMapping
    UserDTO createUser(@RequestBody UserDTO userDTO);
    
    @GetMapping
    List<UserDTO> getUsers(@RequestParam("page") int page, 
                           @RequestParam("size") int size);
    
    @PutMapping("/{id}")
    void updateUser(@PathVariable("id") Long id, 
                    @RequestBody UserDTO userDTO);
    
    @DeleteMapping("/{id}")
    void deleteUser(@PathVariable("id") Long id);
}
```

## 常用注解

| 注解 | 说明 | 示例 |
|------|------|------|
| `@FeignClient` | 声明 Feign 客户端 | `@FeignClient(name = "service-name")` |
| `@GetMapping` | GET 请求 | `@GetMapping("/users/{id}")` |
| `@PostMapping` | POST 请求 | `@PostMapping("/users")` |
| `@PutMapping` | PUT 请求 | `@PutMapping("/users/{id}")` |
| `@DeleteMapping` | DELETE 请求 | `@DeleteMapping("/users/{id}")` |
| `@PathVariable` | 路径变量 | `@PathVariable("id") Long id` |
| `@RequestParam` | 请求参数 | `@RequestParam("name") String name` |
| `@RequestBody` | 请求体 | `@RequestBody UserDTO user` |
| `@RequestHeader` | 请求头 | `@RequestHeader("Authorization") String token` |

## 配置示例

### application.yml 配置

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 5000      # 连接超时时间（毫秒）
        readTimeout: 10000         # 读取超时时间（毫秒）
        loggerLevel: basic         # 日志级别：none, basic, headers, full
      user-service:                # 针对特定服务的配置
        connectTimeout: 3000
        readTimeout: 5000
  compression:
    request:
      enabled: true                # 启用请求压缩
    response:
      enabled: true                # 启用响应压缩
  hystrix:
    enabled: true                  # 启用 Hystrix 熔断
```

## 代码示例

### 1. 基础调用示例

```java
@Service
public class OrderService {
    
    @Autowired
    private UserFeignClient userFeignClient;
    
    public OrderDTO createOrder(Long userId, OrderDTO orderDTO) {
        // 调用用户服务获取用户信息
        UserDTO user = userFeignClient.getUserById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 创建订单逻辑
        orderDTO.setUserId(userId);
        orderDTO.setUserName(user.getName());
        // ... 其他业务逻辑
        
        return orderDTO;
    }
}
```

### 2. 带请求头的调用

```java
@FeignClient(name = "auth-service")
public interface AuthFeignClient {
    
    @GetMapping("/user/info")
    UserInfoDTO getUserInfo(@RequestHeader("Authorization") String token);
}
```

### 3. 文件上传

```java
@FeignClient(name = "file-service")
public interface FileFeignClient {
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    FileUploadResult uploadFile(@RequestPart("file") MultipartFile file);
}
```

### 4. 自定义请求拦截器

```java
@Component
public class FeignRequestInterceptor implements RequestInterceptor {
    
    @Override
    public void apply(RequestTemplate template) {
        // 添加请求头
        template.header("X-Request-Id", UUID.randomUUID().toString());
        template.header("X-Client-Version", "1.0.0");
        
        // 添加认证信息
        String token = getToken();
        if (token != null) {
            template.header("Authorization", "Bearer " + token);
        }
    }
}
```

### 5. 错误处理

```java
@FeignClient(name = "user-service", fallback = UserFeignClientFallback.class)
public interface UserFeignClient {
    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
}

// 降级处理类
@Component
public class UserFeignClientFallback implements UserFeignClient {
    
    @Override
    public UserDTO getUserById(Long id) {
        // 返回默认值或抛出异常
        return UserDTO.builder()
                .id(id)
                .name("默认用户")
                .build();
    }
}
```

## 注意事项

1. **接口方法名不能重载**：Feign 不支持方法重载
2. **参数必须加注解**：`@PathVariable`、`@RequestParam` 等必须明确指定
3. **复杂对象使用 @RequestBody**：POST/PUT 请求的复杂对象必须用 `@RequestBody`
4. **超时配置**：合理设置连接超时和读取超时，避免长时间等待
5. **日志调试**：开发环境可设置 `loggerLevel: full` 查看完整请求响应
6. **熔断降级**：生产环境建议启用 Hystrix 或 Sentinel 进行熔断保护