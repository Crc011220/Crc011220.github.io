---
icon: pen-to-square
date: 2026-01-06
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# 校招入职笔记
这份笔记聚焦校招入职高频使用场景，覆盖核心知识点、实战用法、避坑要点，兼顾基础与实战，适合快速查阅和日常开发参考。

## 一、Java & Spring Boot 核心篇
### 1. 基础语法（高频易错）
#### （1）核心关键字与特性
| 关键字/特性 | 核心用法 | 注意事项 |
|------------|----------|----------|
| `final`    | 修饰类（不可继承）、方法（不可重写）、变量（不可修改） | 修饰引用变量时，引用不可变，但对象内容可变 |
| `static`   | 静态变量/方法属于类，非实例；静态代码块优先执行 | 静态方法不能调用非静态成员，避免静态变量内存泄漏 |
| `try-with-resources` | 自动关闭资源（IO/数据库连接） | 资源类需实现 `AutoCloseable` 接口 |
| `Optional` | 避免空指针（`ofNullable`/`orElse`/`ifPresent`） | 不要滥用，简单场景直接判空更高效 |

#### （2）集合框架（高频使用）
| 集合类型 | 核心特点 | 适用场景 |
|----------|----------|----------|
| `ArrayList` | 数组实现，查询快、增删慢 | 读多写少的场景 |
| `HashMap` | 哈希表实现，线程不安全，JDK8+红黑树优化 | 键值对存储，非并发场景 |
| `ConcurrentHashMap` | 分段锁/CAS实现，线程安全 | 高并发键值对存储 |
| `LinkedList` | 链表实现，增删快、查询慢 | 写多读少的场景 |

**示例：HashMap 安全遍历**
```java
// 避免遍历中删除元素报 ConcurrentModificationException
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
// 方式1：迭代器删除
Iterator<Map.Entry<String, String>> it = map.entrySet().iterator();
while (it.hasNext()) {
    Map.Entry<String, String> entry = it.next();
    if ("key1".equals(entry.getKey())) {
        it.remove(); // 正确删除方式
    }
}
// 方式2：JDK8+ removeIf
map.entrySet().removeIf(entry -> "key1".equals(entry.getKey()));
```

### 2. Spring Boot 核心配置与用法
#### （1）核心注解（按使用频率排序）
| 注解 | 作用 | 注意事项 |
|------|------|----------|
| `@SpringBootApplication` | 启动类注解（包含 `@Configuration`/`@EnableAutoConfiguration`/`@ComponentScan`） | 扫描当前包及子包下的组件 |
| `@RestController` | 组合 `@Controller` + `@ResponseBody`，返回JSON而非视图 | 前后端分离必用，替代传统 `@Controller` |
| `@RequestMapping`/`@GetMapping`/`@PostMapping` | 映射请求路径/方法 | `@GetMapping` 是 `@RequestMapping(method = RequestMethod.GET)` 的简写 |
| `@Autowired` | 自动注入依赖 | 优先用构造器注入（避免空指针），而非字段注入 |
| `@Service`/`@Repository` | 标记服务层/数据层组件 | `@Repository` 自动捕获数据库异常并转换为Spring异常 |
| `@Value` | 读取配置文件属性 | 示例：`@Value("${server.port:8080}")`（默认值8080） |
| `@ConfigurationProperties` | 批量绑定配置文件属性 | 配合 `@Component` 使用，适合多属性绑定（如数据库配置） |
| `@Transactional` | 声明式事务 | 仅对 `public` 方法生效，异常需抛出自定义运行时异常（默认捕获RuntimeException） |
| `@Cacheable` | 方法结果缓存 | 配合Redis使用，`@Cacheable(value="user", key="#id")` |
| `@CacheEvict` | 清除缓存 | `@CacheEvict(value="user", key="#id")` |
| `@Async` | 异步执行方法 | 需配合`@EnableAsync`使用 |
| `@Scheduled` | 定时任务 | 需配合`@EnableScheduling`使用 |
| `@ConditionalOnProperty` | 条件装配 | `@ConditionalOnProperty(name="feature.enabled", havingValue="true")` |
| `@Profile` | 环境配置 | `@Profile("dev")` 仅在dev环境生效 |
| `@Slf4j` | Lombok日志注解 | 自动生成`log`变量，无需手动创建Logger |
| `@Data` | Lombok数据类 | 自动生成getter/setter/toString/equals/hashCode |
| `@Builder` | Lombok建造者模式 | 链式创建对象：`User.builder().name("xxx").build()` |

**示例：构造器注入（推荐）**
```java
@Service
public class UserService {
    private final UserMapper userMapper;
    
    // 构造器注入（避免@Autowired字段注入的空指针风险）
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
}
```

#### （2）配置文件（application.yml 核心配置）
```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api # 接口前缀
    encoding:
      charset: UTF-8
      enabled: true
      force: true

# 数据库配置（MyBatis/MyBatis-Plus）
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari: # 连接池配置（HikariCP，Spring Boot默认）
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
  
  # Redis配置（常用缓存）
  data:
    redis:
      host: localhost
      port: 6379
      password: # 密码（无密码则不填）
      database: 0
      timeout: 5000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
  
  # Jackson配置（JSON序列化）
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: Asia/Shanghai
    serialization:
      write-dates-as-timestamps: false # 日期不转时间戳
    default-property-inclusion: non_null # 不序列化null值
  
  # 文件上传配置
  servlet:
    multipart:
      enabled: true
      max-file-size: 100MB
      max-request-size: 100MB
      file-size-threshold: 10MB

# MyBatis配置
mybatis:
  mapper-locations: classpath:mapper/*.xml # Mapper文件路径
  type-aliases-package: com.example.demo.entity # 实体类别名包
  configuration:
    map-underscore-to-camel-case: true # 下划线转驼峰
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl # 打印SQL（开发环境）

# MyBatis-Plus配置
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
  global-config:
    db-config:
      id-type: auto # 主键自增
      logic-delete-field: deleted # 逻辑删除字段
      logic-delete-value: 1 # 逻辑删除值
      logic-not-delete-value: 0 # 逻辑未删除值

# 日志配置（logback，Spring Boot默认）
logging:
  level:
    root: INFO
    com.example.demo: DEBUG # 项目包日志级别
    org.springframework.web: INFO
    org.mybatis: DEBUG # MyBatis SQL日志
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{50} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{50} - %msg%n"
  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 30

# 自定义配置
custom:
  upload:
    path: /usr/local/upload # 文件上传路径
    max-size: 10MB # 文件最大大小
```

**多环境配置（重要！）**
```yaml
# application.yml（公共配置）
spring:
  profiles:
    active: dev # 激活dev环境

---
# application-dev.yml（开发环境）
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test_dev

---
# application-prod.yml（生产环境）
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/test_prod
logging:
  level:
    root: WARN # 生产环境日志级别更高
```

#### （3）接口开发规范
```java
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET请求：查询用户（路径参数）
    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.getById(id);
        return Result.success(user); // 统一返回结果
    }

    // POST请求：新增用户（JSON参数）
    @PostMapping
    public Result<Void> addUser(@RequestBody @Valid UserDTO userDTO) {
        userService.addUser(userDTO);
        return Result.success();
    }

    // GET请求：查询参数（@RequestParam）
    @GetMapping("/search")
    public Result<List<User>> searchUsers(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        List<User> users = userService.search(keyword, pageNum, pageSize);
        return Result.success(users);
    }

    // POST请求：表单提交（application/x-www-form-urlencoded）
    @PostMapping("/form")
    public Result<Void> addUserByForm(@RequestParam String username, @RequestParam String password) {
        // 处理表单数据
        return Result.success();
    }

    // 文件上传（重要！）
    @PostMapping("/upload")
    public Result<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return Result.fail("文件不能为空");
        }
        // 文件大小校验
        if (file.getSize() > 10 * 1024 * 1024) {
            return Result.fail("文件大小不能超过10MB");
        }
        // 文件类型校验
        String originalFilename = file.getOriginalFilename();
        String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        if (!Arrays.asList(".jpg", ".png", ".pdf").contains(suffix.toLowerCase())) {
            return Result.fail("不支持的文件类型");
        }
        // 保存文件
        String filePath = userService.saveFile(file);
        return Result.success(filePath);
    }

    // 文件下载
    @GetMapping("/download/{fileName}")
    public void downloadFile(@PathVariable String fileName, HttpServletResponse response) throws IOException {
        File file = new File("/usr/local/upload/" + fileName);
        if (!file.exists()) {
            response.setStatus(404);
            return;
        }
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        Files.copy(file.toPath(), response.getOutputStream());
    }

    // 统一返回结果类（必写）
    @Data
    public static class Result<T> {
        private int code;
        private String msg;
        private T data;

        public static <T> Result<T> success(T data) {
            Result<T> result = new Result<>();
            result.setCode(200);
            result.setMsg("成功");
            result.setData(data);
            return result;
        }

        public static <T> Result<T> success() {
            return success(null);
        }

        public static <T> Result<T> fail(String msg) {
            Result<T> result = new Result<>();
            result.setCode(500);
            result.setMsg(msg);
            return result;
        }
    }
}
```

#### （4）异常处理（全局异常拦截）
```java
@RestControllerAdvice // 全局异常处理
public class GlobalExceptionHandler {

    // 处理自定义业务异常
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        return Result.fail(e.getMessage());
    }

    // 处理参数校验异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidException(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldError().getDefaultMessage();
        return Result.fail(msg);
    }

    // 处理通用异常
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e); // 打印异常栈
        return Result.fail("系统繁忙，请稍后重试");
    }
}
```

**日志使用规范（重要！）**
```java
import lombok.extern.slf4j.Slf4j;

@Slf4j // Lombok注解，自动生成log变量
@Service
public class UserService {
    
    public void example() {
        // 1. 不同级别日志
        log.trace("跟踪信息"); // 最详细，通常不用
        log.debug("调试信息"); // 开发环境使用
        log.info("一般信息"); // 重要业务流程
        log.warn("警告信息"); // 潜在问题
        log.error("错误信息", exception); // 错误，必须带异常对象
        
        // 2. 占位符用法（推荐，性能更好）
        String username = "张三";
        Long id = 1L;
        log.info("用户登录：username={}, id={}", username, id); // ✅ 推荐
        log.info("用户登录：username=" + username + ", id=" + id); // ❌ 不推荐（字符串拼接）
        
        // 3. 异常日志
        try {
            // 业务代码
        } catch (Exception e) {
            log.error("操作失败：username={}", username, e); // ✅ 正确：异常作为最后一个参数
            log.error("操作失败：" + e.getMessage()); // ❌ 错误：丢失堆栈信息
        }
        
        // 4. 条件日志（避免不必要的字符串拼接）
        if (log.isDebugEnabled()) {
            log.debug("复杂对象：{}", expensiveToString()); // 只在DEBUG级别时执行expensiveToString
        }
    }
}
```

### 3. 数据库操作（MyBatis-Plus 高频用法）
#### （1）核心CRUD（无需写XML）
```java
@Service
public class UserService extends ServiceImpl<UserMapper, User> {
    // 继承ServiceImpl后，直接使用内置CRUD方法
    public User getByUsername(String username) {
        // 条件构造器查询
        return lambdaQuery().eq(User::getUsername, username).one();
    }

    public List<User> listByAge(Integer minAge, Integer maxAge) {
        // 多条件查询
        return lambdaQuery()
                .ge(User::getAge, minAge) // >= minAge
                .le(User::getAge, maxAge) // <= maxAge
                .orderByDesc(User::getCreateTime) // 按创建时间降序
                .list();
    }

    public boolean updateUser(Long id, String nickname) {
        // 条件更新
        return lambdaUpdate()
                .eq(User::getId, id)
                .set(User::getNickname, nickname)
                .update();
    }
}
```

#### （2）分页查询（必配）
```java
// 1. 配置分页插件
@Configuration
public class MyBatisConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}

// 2. 分页查询用法
public IPage<User> pageUser(Integer pageNum, Integer pageSize) {
    Page<User> page = new Page<>(pageNum, pageSize);
    return lambdaQuery().page(page);
}

// 3. 更多常用查询方法（容易忘记）
public List<User> complexQuery() {
    return lambdaQuery()
        .eq(User::getStatus, 1) // 等于
        .ne(User::getStatus, 0) // 不等于
        .gt(User::getAge, 18) // 大于
        .ge(User::getAge, 18) // 大于等于
        .lt(User::getAge, 65) // 小于
        .le(User::getAge, 65) // 小于等于
        .like(User::getUsername, "张") // LIKE '%张%'
        .likeLeft(User::getUsername, "三") // LIKE '%三'
        .likeRight(User::getUsername, "张") // LIKE '张%'
        .in(User::getId, Arrays.asList(1, 2, 3)) // IN (1,2,3)
        .notIn(User::getId, Arrays.asList(4, 5)) // NOT IN (4,5)
        .isNull(User::getDeleted) // IS NULL
        .isNotNull(User::getEmail) // IS NOT NULL
        .between(User::getAge, 18, 65) // BETWEEN 18 AND 65
        .groupBy(User::getDepartment) // GROUP BY
        .having("COUNT(*) > 10") // HAVING
        .orderByAsc(User::getCreateTime) // ORDER BY ASC
        .orderByDesc(User::getAge) // ORDER BY DESC
        .last("LIMIT 10") // 追加SQL片段
        .list();
}

// 4. 批量操作（重要！）
public void batchOperations() {
    // 批量插入
    List<User> users = Arrays.asList(new User(), new User());
    saveBatch(users, 100); // 每批100条
    
    // 批量更新
    updateBatchById(users, 100);
    
    // 批量删除
    removeByIds(Arrays.asList(1L, 2L, 3L));
}

// 5. 逻辑删除（配置了logic-delete-field后自动生效）
public void logicDelete() {
    // 删除操作会自动变成UPDATE，设置deleted=1
    removeById(1L); // 实际执行：UPDATE user SET deleted=1 WHERE id=1
    
    // 查询时自动过滤已删除数据
    list(); // 自动添加 WHERE deleted=0
}

// 6. 字段自动填充（创建时间/更新时间）
@TableField(fill = FieldFill.INSERT) // 插入时填充
private LocalDateTime createTime;

@TableField(fill = FieldFill.INSERT_UPDATE) // 插入和更新时填充
private LocalDateTime updateTime;

// 配置自动填充处理器
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

### 4. 高频开发技巧与避坑
#### （1）接口幂等性（防止重复提交）
```java
// 基于Redis + 注解实现幂等性
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Idempotent {
    // 过期时间（秒）
    long expire() default 5;
}

// 切面实现
@Aspect
@Component
public class IdempotentAspect {
    private final StringRedisTemplate redisTemplate;

    public IdempotentAspect(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Around("@annotation(idempotent)")
    public Object around(ProceedingJoinPoint joinPoint, Idempotent idempotent) throws Throwable {
        // 获取请求唯一标识（如token + 请求参数MD5）
        String key = "idempotent:" + getRequestKey();
        // 分布式锁
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "1", idempotent.expire(), TimeUnit.SECONDS);
        if (Boolean.FALSE.equals(success)) {
            throw new BusinessException("请勿重复提交");
        }
        try {
            return joinPoint.proceed();
        } finally {
            redisTemplate.delete(key); // 正常执行完删除key
        }
    }

    // 生成请求唯一标识（简化版）
    private String getRequestKey() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader("token");
        String params = JSON.toJSONString(request.getParameterMap());
        return token + MD5Util.md5(params);
    }
}

// 使用方式
@PostMapping("/submit")
@Idempotent(expire = 10) // 10秒内不可重复提交
public Result<Void> submit() {
    // 业务逻辑
    return Result.success();
}
```

#### （2）参数校验（@Valid + 校验注解）
```java
// DTO类：使用校验注解
@Data
public class UserDTO {
    @NotNull(message = "用户ID不能为空")
    private Long id;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$", 
             message = "密码必须包含大小写字母和数字，长度至少8位")
    private String password;

    @Email(message = "邮箱格式不正确")
    private String email;

    @Min(value = 0, message = "年龄不能小于0")
    @Max(value = 150, message = "年龄不能大于150")
    private Integer age;

    @Past(message = "生日必须是过去的日期")
    private Date birthday;
}

// Controller中使用@Valid触发校验
@PostMapping
public Result<Void> addUser(@RequestBody @Valid UserDTO userDTO) {
    // 校验通过才会执行到这里
    userService.addUser(userDTO);
    return Result.success();
}
```

#### （3）常用工具类（容易忘记）
```java
// 1. BeanUtils：对象属性拷贝（避免手动get/set）
import org.springframework.beans.BeanUtils;

UserDTO dto = new UserDTO();
User user = new User();
BeanUtils.copyProperties(dto, user); // 将dto的属性拷贝到user（同名属性）

// 2. StringUtils：字符串工具（Apache Commons Lang）
import org.apache.commons.lang3.StringUtils;

if (StringUtils.isBlank(str)) { // 判断空字符串（null/空字符串/空格）
    // ...
}
String trimmed = StringUtils.trim(str); // 去除首尾空格
String[] parts = StringUtils.split(str, ","); // 分割字符串

// 3. DateUtils：日期工具（Apache Commons Lang）
import org.apache.commons.lang3.time.DateUtils;

Date date = DateUtils.parseDate("2024-01-01", "yyyy-MM-dd");
Date tomorrow = DateUtils.addDays(new Date(), 1);
Date nextWeek = DateUtils.addWeeks(new Date(), 1);

// 4. LocalDateTime：Java8时间API（推荐）
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

LocalDateTime now = LocalDateTime.now();
String formatted = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
LocalDateTime parsed = LocalDateTime.parse("2024-01-01 12:00:00", 
    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

// 5. JSON工具：Jackson（Spring Boot默认）
import com.fasterxml.jackson.databind.ObjectMapper;

ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(user); // 对象转JSON
User user = mapper.readValue(json, User.class); // JSON转对象

// 6. 集合工具：Collections、Stream API
List<String> list = Arrays.asList("a", "b", "c");
Collections.sort(list); // 排序
List<String> filtered = list.stream()
    .filter(s -> s.startsWith("a"))
    .collect(Collectors.toList()); // Stream过滤

// Stream常用操作（容易忘记）
List<User> users = Arrays.asList(/* ... */);
// 过滤
List<User> adults = users.stream()
    .filter(u -> u.getAge() >= 18)
    .collect(Collectors.toList());
// 映射
List<String> names = users.stream()
    .map(User::getUsername)
    .collect(Collectors.toList());
// 分组
Map<String, List<User>> byDept = users.stream()
    .collect(Collectors.groupingBy(User::getDepartment));
// 去重
List<String> unique = list.stream()
    .distinct()
    .collect(Collectors.toList());
// 排序
List<User> sorted = users.stream()
    .sorted(Comparator.comparing(User::getAge).reversed())
    .collect(Collectors.toList());
// 统计
long count = users.stream().count();
int sum = users.stream().mapToInt(User::getAge).sum();
OptionalDouble avg = users.stream().mapToInt(User::getAge).average();

// 7. 文件操作工具
import java.nio.file.Files;
import java.nio.file.Paths;

// 读取文件
String content = new String(Files.readAllBytes(Paths.get("file.txt")));
// 写入文件
Files.write(Paths.get("output.txt"), content.getBytes());
// 检查文件是否存在
boolean exists = Files.exists(Paths.get("file.txt"));

// 8. 加密工具：MD5、SHA256（常用）
import java.security.MessageDigest;
import java.util.Base64;

public static String md5(String input) {
    try {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input.getBytes());
        return Base64.getEncoder().encodeToString(digest);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

#### （4）Redis使用（缓存/分布式锁）
```java
@Service
public class RedisService {
    private final StringRedisTemplate redisTemplate;

    public RedisService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 1. 基本操作
    public void set(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public void setWithExpire(String key, String value, long seconds) {
        redisTemplate.opsForValue().set(key, value, seconds, TimeUnit.SECONDS);
    }

    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    // 2. 缓存对象（序列化为JSON）
    public void setObject(String key, Object value, long seconds) {
        String json = JSON.toJSONString(value);
        redisTemplate.opsForValue().set(key, json, seconds, TimeUnit.SECONDS);
    }

    public <T> T getObject(String key, Class<T> clazz) {
        String json = redisTemplate.opsForValue().get(key);
        return json != null ? JSON.parseObject(json, clazz) : null;
    }

    // 3. 分布式锁（重要！）
    public boolean tryLock(String key, String value, long expireSeconds) {
        Boolean success = redisTemplate.opsForValue()
            .setIfAbsent(key, value, expireSeconds, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    public void releaseLock(String key, String value) {
        // Lua脚本保证原子性：只有锁的持有者才能释放
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                       "return redis.call('del', KEYS[1]) else return 0 end";
        redisTemplate.execute(new DefaultRedisScript<>(script, Long.class), 
            Collections.singletonList(key), value);
    }
}

// 使用示例：缓存用户信息
@Service
public class UserService {
    private final RedisService redisService;
    private static final String USER_CACHE_KEY = "user:";

    public User getUserById(Long id) {
        String key = USER_CACHE_KEY + id;
        // 1. 先查缓存
        User user = redisService.getObject(key, User.class);
        if (user != null) {
            return user;
        }
        // 2. 缓存未命中，查数据库
        user = userMapper.selectById(id);
        if (user != null) {
            // 3. 写入缓存（过期时间30分钟）
            redisService.setObject(key, user, 1800);
        }
        return user;
    }
}
```

#### （5）定时任务（@Scheduled）
```java
@Configuration
@EnableScheduling // 启用定时任务
public class ScheduleConfig {
}

@Component
public class ScheduledTasks {
    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    // 1. 固定延迟执行（上次执行完成后延迟5秒）
    @Scheduled(fixedDelay = 5000)
    public void task1() {
        log.info("定时任务1执行");
    }

    // 2. 固定频率执行（每10秒执行一次）
    @Scheduled(fixedRate = 10000)
    public void task2() {
        log.info("定时任务2执行");
    }

    // 3. Cron表达式（每天凌晨2点执行）
    @Scheduled(cron = "0 0 2 * * ?")
    public void task3() {
        log.info("定时任务3执行");
    }

    // Cron表达式说明：
    // 秒 分 时 日 月 周
    // "0 0 2 * * ?" 每天2点
    // "0 0/30 * * * ?" 每30分钟
    // "0 0 12 * * ?" 每天12点
    // "0 0 0 1 * ?" 每月1号0点
}
```

#### （6）异步任务（@Async）
```java
@Configuration
@EnableAsync // 启用异步任务
public class AsyncConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

@Service
public class AsyncService {
    @Async // 异步执行
    public CompletableFuture<String> asyncTask(String param) {
        // 模拟耗时操作
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("完成：" + param);
    }
}

// Controller中使用
@GetMapping("/async")
public Result<String> testAsync() {
    asyncService.asyncTask("参数").thenAccept(result -> {
        log.info("异步任务完成：{}", result);
    });
    return Result.success("任务已提交");
}
```

#### （7）跨域配置（CORS）
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允许所有路径
                .allowedOrigins("http://localhost:3000", "http://localhost:3001") // 允许的源
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的方法
                .allowedHeaders("*") // 允许的请求头
                .allowCredentials(true) // 允许携带凭证（cookie）
                .maxAge(3600); // 预检请求缓存时间
    }
}
```

#### （8）拦截器（Interceptor）
```java
@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("token");
        if (StringUtils.isBlank(token)) {
            response.setStatus(401);
            return false; // 拦截请求
        }
        // 验证token逻辑...
        return true; // 放行
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
        // 请求处理完成后执行
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 视图渲染完成后执行（可用于清理资源）
    }
}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AuthInterceptor authInterceptor;

    public WebConfig(AuthInterceptor authInterceptor) {
        this.authInterceptor = authInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/**") // 拦截所有路径
                .excludePathPatterns("/login", "/register"); // 排除登录注册
    }
}
```

#### （9）常见坑点
| 坑点 | 解决方案 |
|------|----------|
| `@Transactional` 事务不生效 | 1. 方法必须是public；2. 异常必须是RuntimeException；3. 避免内部调用（AOP失效，用`@Transactional`的方法调用同一类的另一个`@Transactional`方法不会生效） |
| 接口返回JSON时日期格式乱码 | 在application.yml配置：<br>`spring.jackson.date-format: yyyy-MM-dd HH:mm:ss`<br>`spring.jackson.time-zone: Asia/Shanghai` |
| 大文件上传报错 | 配置：<br>`spring.servlet.multipart.max-file-size: 100MB`<br>`spring.servlet.multipart.max-request-size: 100MB` |
| 跨域问题 | 添加跨域配置类（CorsConfig），允许前端域名访问 |
| `@Value` 注入为null | 确保类被Spring管理（加`@Component`等注解），静态变量不能用`@Value` |
| MyBatis查询结果为空 | 检查实体类字段名与数据库列名是否一致（下划线转驼峰） |
| Redis连接失败 | 检查Redis服务是否启动，配置的host和port是否正确 |
| 定时任务不执行 | 确保启动类或配置类加了`@EnableScheduling`注解 |
| 异步任务不执行 | 确保配置类加了`@EnableAsync`，且调用异步方法的类不能是同一个类（AOP限制） |

## 二、React 核心篇
### 1. 基础语法与核心概念
#### （1）组件定义（函数组件+Hook 主流写法）
```jsx
import { useState, useEffect } from 'react';

// 函数组件（推荐）
const UserList = () => {
    // 状态管理：useState
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);

    // 副作用：useEffect（替代类组件的生命周期）
    useEffect(() => {
        // 组件挂载时加载数据
        setLoading(true);
        fetch('/api/user')
            .then(res => res.json())
            .then(data => {
                setUserList(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('加载失败', err);
                setLoading(false);
            });
    }, []); // 空依赖：仅挂载时执行

    // 事件处理
    const handleDelete = (id) => {
        setUserList(userList.filter(user => user.id !== id));
    };

    if (loading) {
        return <div>加载中...</div>;
    }

    return (
        <div className="user-list">
            <h2>用户列表</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>用户名</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map(user => (
                        <tr key={user.id}> {/* 必须加key，避免渲染异常 */}
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
```

#### （2）核心Hook（按使用频率排序）
| Hook | 作用 | 注意事项 |
|------|------|----------|
| `useState` | 管理组件状态 | 状态更新是异步的，批量更新；对象/数组状态需浅拷贝后修改 |
| `useEffect` | 处理副作用（请求/订阅/DOM操作） | 依赖数组为空：仅挂载执行；依赖数组有值：值变化时执行；返回函数：卸载时执行 |
| `useRef` | 获取DOM元素/保存可变值（不触发重渲染） | 示例：`const inputRef = useRef(null); <input ref={inputRef} />` |
| `useContext` | 跨组件传值（替代props层层传递） | 适合全局状态（如用户信息），复杂状态建议用Redux/ Zustand |
| `useReducer` | 复杂状态管理（替代useState） | 适合状态逻辑复杂、多状态关联的场景 |

**Context API 深入用法（容易忘记）**
```jsx
// 1. 创建Context
const UserContext = React.createContext(null);

// 2. Provider组件（提供数据）
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const res = await request.post('/login', { username, password });
            setUser(res.data);
            localStorage.setItem('token', res.data.token);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// 3. 自定义Hook（方便使用）
const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUser必须在UserProvider内使用');
    }
    return context;
};

// 4. 使用
const App = () => {
    return (
        <UserProvider>
            <Header />
            <Content />
        </UserProvider>
    );
};

const Header = () => {
    const { user, logout } = useUser(); // 直接获取用户信息
    return (
        <div>
            {user ? (
                <>
                    <span>欢迎，{user.username}</span>
                    <button onClick={logout}>退出</button>
                </>
            ) : (
                <span>未登录</span>
            )}
        </div>
    );
};
```
| `useMemo` | 缓存计算结果 | 依赖项变化时才重新计算，避免不必要的计算 |
| `useCallback` | 缓存函数引用 | 依赖项变化时才重新创建函数，避免子组件不必要的重渲染 |

**Hook深入用法（容易忘记）**
```jsx
// 1. useState：函数式更新（避免闭包陷阱）
const [count, setCount] = useState(0);

// ❌ 错误：闭包陷阱，count始终是初始值
const handleClick1 = () => {
    setTimeout(() => {
        setCount(count + 1); // count可能是旧值
    }, 1000);
};

// ✅ 正确：使用函数式更新
const handleClick2 = () => {
    setTimeout(() => {
        setCount(prevCount => prevCount + 1); // 总是使用最新值
    }, 1000);
};

// 2. useEffect：清理函数（重要！）
useEffect(() => {
    const timer = setInterval(() => {
        console.log('定时器执行');
    }, 1000);
    
    // 返回清理函数：组件卸载或依赖变化时执行
    return () => {
        clearInterval(timer); // 必须清理，避免内存泄漏
    };
}, []);

// 3. useEffect：依赖数组的常见错误
const [user, setUser] = useState({ id: 1, name: '张三' });

// ❌ 错误：对象引用变化导致无限循环
useEffect(() => {
    fetchUser(user.id);
}, [user]); // user对象每次渲染都是新引用

// ✅ 正确：只依赖需要的值
useEffect(() => {
    fetchUser(user.id);
}, [user.id]); // 只依赖id

// 4. useRef：保存上一次的值
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value; // 保存当前值
    });
    return ref.current; // 返回上一次的值
}

// 5. useMemo：缓存计算结果（避免重复计算）
const expensiveValue = useMemo(() => {
    // 复杂计算
    return list.reduce((sum, item) => sum + item.value, 0);
}, [list]); // 只有list变化时才重新计算

// 6. useCallback：缓存函数（配合React.memo使用）
const handleClick = useCallback((id) => {
    console.log('点击', id);
}, []); // 空依赖：函数永远不会变化

// 7. useReducer：复杂状态管理
const initialState = { count: 0, name: '' };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { ...state, count: state.count + 1 };
        case 'decrement':
            return { ...state, count: state.count - 1 };
        case 'setName':
            return { ...state, name: action.payload };
        default:
            return state;
    }
}

const [state, dispatch] = useReducer(reducer, initialState);

// 使用
dispatch({ type: 'increment' });
dispatch({ type: 'setName', payload: '新名字' });
```

#### （3）Props 传递与校验
```jsx
import PropTypes from 'prop-types';

// 子组件
const UserCard = (props) => {
    const { user, onEdit } = props;
    return (
        <div>
            <h3>{user.nickname}</h3>
            <button onClick={() => onEdit(user.id)}>编辑</button>
        </div>
    );
};

// Props校验（避免传参错误）
UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nickname: PropTypes.string.isRequired
    }).isRequired,
    onEdit: PropTypes.func.isRequired
};

// 默认Props
UserCard.defaultProps = {
    onEdit: () => {} // 默认空函数，避免调用时报错
};

// 父组件使用
const UserList = () => {
    const handleEdit = (id) => {
        console.log('编辑', id);
    };
    return <UserCard user={{ id: 1, nickname: '张三' }} onEdit={handleEdit} />;
};
```

### 2. 路由与请求（React Router + Axios）
#### （1）React Router 6+ 核心用法
```jsx
// 1. 路由配置（src/router/index.js）
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserList from '../pages/UserList';
import UserDetail from '../pages/UserDetail';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserList />
    },
    {
        path: '/user/:id', // 动态路由
        element: <UserDetail />
    },
    {
        path: '*', // 404页面
        element: <NotFound />
    }
]);

export default router;

// 2. 入口文件（src/index.js）
import { RouterProvider } from 'react-router-dom';
import router from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);

// 3. 页面中使用路由
import { useParams, useNavigate } from 'react-router-dom';

const UserDetail = () => {
    const { id } = useParams(); // 获取动态路由参数
    const navigate = useNavigate(); // 编程式导航

    const handleBack = () => {
        navigate(-1); // 返回上一页
    };

    const goToList = () => {
        navigate('/'); // 跳转到列表页
    };

    return (
        <div>
            <h2>用户详情：{id}</h2>
            <button onClick={handleBack}>返回</button>
            <button onClick={goToList}>返回列表</button>
        </div>
    );
};
```

#### （2）Axios 封装（统一请求拦截）
```jsx
// src/utils/request.js
import axios from 'axios';
import { message } from 'antd'; // 假设使用Ant Design的提示组件

// 创建axios实例
const service = axios.create({
    baseURL: '/api', // 基础路径，配合前端代理
    timeout: 10000 // 超时时间
});

// 请求拦截器：添加token
service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：统一处理结果
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        // 假设后端统一返回格式：{ code: 200, msg: '', data: {} }
        if (res.code !== 200) {
            message.error(res.msg || '请求失败');
            return Promise.reject(res);
        }
        return res;
    },
    (error) => {
        message.error(error.message || '系统异常');
        return Promise.reject(error);
    }
);

export default service;

// 使用方式
import request from './utils/request';

// 获取用户列表
export const getUserList = () => {
    return request({
        url: '/user',
        method: 'get'
    });
};

// 新增用户
export const addUser = (data) => {
    return request({
        url: '/user',
        method: 'post',
        data
    });
};
```

### 3. UI组件库与样式（Ant Design 高频用法）
#### （1）Ant Design 基础使用
```jsx
import { Table, Button, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const UserTable = ({ data }) => {
    // 列配置
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id', // 对应数据的字段名
            key: 'id'
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => ( // render函数：自定义列内容
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record.id)}
                    >
                        编辑
                    </Button>
                    <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            )
        }
    ];

    const handleEdit = (id) => {
        message.info(`编辑用户：${id}`);
    };

    const handleDelete = (id) => {
        message.warning(`删除用户：${id}`);
    };

    return <Table columns={columns} dataSource={data} rowKey="id" />;
};
```

#### （2）样式方案（CSS Modules + Less）
```css
/* src/pages/UserList/UserList.module.less */
.container {
    padding: 20px;
    .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
    }
}
```

```jsx
// 引入CSS Modules
import styles from './UserList.module.less';

const UserList = () => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>用户列表</div>
            {/* 其他内容 */}
        </div>
    );
};
```

### 4. 表单处理（受控组件 vs 非受控组件）
#### （1）受控组件（推荐）
```jsx
const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value // 动态属性名
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // 阻止默认提交
        console.log('提交数据：', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="用户名"
            />
            <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="密码"
            />
            <button type="submit">登录</button>
        </form>
    );
};
```

#### （2）Ant Design Form（推荐，更简单）
```jsx
import { Form, Input, Button } from 'antd';

const LoginForm = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('提交数据：', values);
        // values = { username: 'xxx', password: 'xxx' }
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' }
                ]}
            >
                <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    { required: true, message: '请输入密码' },
                    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 
                      message: '密码必须包含大小写字母和数字，长度至少8位' }
                ]}
            >
                <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">登录</Button>
            </Form.Item>
        </Form>
    );
};
```

### 5. 文件上传下载（前端）
#### （1）文件上传
```jsx
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

const FileUpload = () => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning('请选择文件');
            return;
        }

        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files', file.originFileObj);
        });

        setUploading(true);
        try {
            const res = await request({
                url: '/upload',
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            message.success('上传成功');
            setFileList([]);
        } catch (error) {
            message.error('上传失败');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false} // 阻止自动上传
                multiple
            >
                <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                上传
            </Button>
        </div>
    );
};
```

#### （2）文件下载
```jsx
const downloadFile = async (fileName) => {
    try {
        const response = await request({
            url: `/download/${fileName}`,
            method: 'get',
            responseType: 'blob' // 重要：指定响应类型为blob
        });
        
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // 释放URL对象
    } catch (error) {
        message.error('下载失败');
    }
};
```

### 6. 错误边界（ErrorBoundary）
```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('错误捕获：', error, errorInfo);
        // 可以在这里上报错误到监控系统
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h2>出错了</h2>
                    <p>{this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false })}>
                        重试
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// 使用
<ErrorBoundary>
    <App />
</ErrorBoundary>
```

### 7. 路由懒加载（代码分割）
```jsx
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// 懒加载组件
const UserList = lazy(() => import('../pages/UserList'));
const UserDetail = lazy(() => import('../pages/UserDetail'));

// 路由配置
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense fallback={<Spin size="large" />}>
                <UserList />
            </Suspense>
        )
    },
    {
        path: '/user/:id',
        element: (
            <Suspense fallback={<Spin size="large" />}>
                <UserDetail />
            </Suspense>
        )
    }
]);
```

### 8. 自定义Hook（复用逻辑）
```jsx
// 自定义Hook：获取窗口大小
function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

// 自定义Hook：防抖
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// 自定义Hook：数据请求
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [url]);

    return { data, loading, error };
}

// 使用自定义Hook
const UserList = () => {
    const { width, height } = useWindowSize();
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 500);
    const { data, loading, error } = useFetch(`/api/user?keyword=${debouncedKeyword}`);

    return (
        <div>
            <p>窗口大小：{width} x {height}</p>
            <input value={keyword} onChange={e => setKeyword(e.target.value)} />
            {loading && <div>加载中...</div>}
            {error && <div>错误：{error.message}</div>}
            {data && <div>{JSON.stringify(data)}</div>}
        </div>
    );
};
```

### 9. 路由守卫/权限控制
```jsx
// 路由守卫组件
const PrivateRoute = ({ children, requiredRole }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.token) {
            navigate('/login');
            return;
        }
        if (requiredRole && user.role !== requiredRole) {
            navigate('/403'); // 无权限页面
            return;
        }
    }, [user, requiredRole, navigate]);

    return user.token ? children : null;
};

// 使用
const router = createBrowserRouter([
    {
        path: '/admin',
        element: (
            <PrivateRoute requiredRole="admin">
                <AdminPage />
            </PrivateRoute>
        )
    }
]);
```

### 10. React 避坑与性能优化
| 坑点 | 解决方案 |
|------|----------|
| 组件重复渲染 | 1. 使用 `React.memo` 包裹纯组件；2. 使用 `useCallback` 缓存函数；3. 使用 `useMemo` 缓存计算结果 |
| 状态更新不生效 | 确保修改对象/数组时浅拷贝（如 `setList([...list, newItem])`） |
| 路由跳转后页面不刷新 | 避免直接修改window.location，使用 `useNavigate`；列表页监听路由参数变化重新加载数据 |
| 大型列表渲染卡顿 | 使用Ant Design的 `VirtualTable` 或 `react-window` 实现虚拟列表 |
| useEffect无限循环 | 检查依赖数组，对象/数组依赖要用具体值（如`user.id`而非`user`） |
| 事件处理函数每次渲染都创建 | 使用`useCallback`缓存函数，或使用函数式更新（`setState(prev => ...)`） |
| 请求取消（组件卸载后setState） | 使用`AbortController`取消请求，或在useEffect清理函数中设置标志位 |
| 内存泄漏 | 清理定时器、事件监听器、订阅等（在useEffect返回函数中清理） |

**性能优化示例**：
```jsx
import { useState, useCallback, useMemo } from 'react';
import { Button } from 'antd';

// React.memo：纯组件，仅props变化时重新渲染
const UserItem = React.memo(({ user, onDelete }) => {
    console.log('UserItem渲染：', user.id); // 仅user或onDelete变化时打印
    return (
        <div>
            {user.username}
            <Button onClick={() => onDelete(user.id)}>删除</Button>
        </div>
    );
});

const UserList = () => {
    const [list, setList] = useState([{ id: 1, username: '张三' }]);

    // useCallback：缓存函数，避免每次渲染重新创建
    const handleDelete = useCallback((id) => {
        setList(list.filter(item => item.id !== id));
    }, [list]);

    // useMemo：缓存计算结果，避免每次渲染重新计算
    const total = useMemo(() => {
        return list.length;
    }, [list.length]);

    return (
        <div>
            <div>总数：{total}</div>
            {list.map(item => (
                <UserItem key={item.id} user={item} onDelete={handleDelete} />
            ))}
        </div>
    );
};
```

## 三、前后端联调与部署
### 1. 前端代理配置（解决跨域）
```jsx
// src/setupProxy.js（需安装http-proxy-middleware）
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api', // 前端请求前缀
        createProxyMiddleware({
            target: 'http://localhost:8080', // 后端接口地址
            changeOrigin: true, // 开启跨域
            pathRewrite: {
                '^/api': '' // 去掉前缀（如果后端没有/api前缀）
            },
            onProxyReq: (proxyReq, req, res) => {
                // 可以在这里修改请求头
                console.log('代理请求：', req.url);
            },
            onError: (err, req, res) => {
                console.error('代理错误：', err);
            }
        })
    );
};
```

### 2. 请求取消（避免内存泄漏）
```jsx
// 使用AbortController取消请求
const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await request({
                    url: '/user',
                    method: 'get',
                    signal: abortController.signal // 传入signal
                });
                setUsers(res.data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('请求失败', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        // 清理函数：组件卸载时取消请求
        return () => {
            abortController.abort();
        };
    }, []);

    return <div>{/* ... */}</div>;
};
```

### 3. WebSocket通信（实时通信）
```jsx
// 自定义Hook：WebSocket
function useWebSocket(url) {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState(null);
    const [readyState, setReadyState] = useState(WebSocket.CONNECTING);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket连接已打开');
            setReadyState(WebSocket.OPEN);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket错误', error);
        };

        ws.onclose = () => {
            console.log('WebSocket连接已关闭');
            setReadyState(WebSocket.CLOSED);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (data) => {
        if (socket && readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        }
    };

    return { message, sendMessage, readyState };
}

// 使用
const ChatRoom = () => {
    const { message, sendMessage, readyState } = useWebSocket('ws://localhost:8080/chat');

    useEffect(() => {
        if (message) {
            console.log('收到消息：', message);
        }
    }, [message]);

    const handleSend = () => {
        sendMessage({ type: 'message', content: 'Hello' });
    };

    return (
        <div>
            <p>连接状态：{readyState === WebSocket.OPEN ? '已连接' : '未连接'}</p>
            <button onClick={handleSend}>发送消息</button>
        </div>
    );
};
```

### 4. 错误处理最佳实践
```jsx
// 统一错误处理Hook
function useErrorHandler() {
    const [error, setError] = useState(null);

    const handleError = (error) => {
        console.error('错误：', error);
        setError(error);
        
        // 根据错误类型显示不同提示
        if (error.response) {
            // HTTP错误
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    message.error('未授权，请重新登录');
                    // 跳转到登录页
                    break;
                case 403:
                    message.error('无权限访问');
                    break;
                case 404:
                    message.error('资源不存在');
                    break;
                case 500:
                    message.error('服务器错误');
                    break;
                default:
                    message.error(data?.msg || '请求失败');
            }
        } else if (error.request) {
            // 网络错误
            message.error('网络错误，请检查网络连接');
        } else {
            // 其他错误
            message.error('发生未知错误');
        }
    };

    const clearError = () => setError(null);

    return { error, handleError, clearError };
}

// 在组件中使用
const UserList = () => {
    const { handleError } = useErrorHandler();

    const fetchUsers = async () => {
        try {
            const res = await request({ url: '/user' });
            // 处理数据
        } catch (error) {
            handleError(error);
        }
    };

    return <div>{/* ... */}</div>;
};
```

### 5. 常用工具函数（容易忘记）
```jsx
// 1. 日期格式化
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hour)
        .replace('mm', minute)
        .replace('ss', second);
};

// 2. 防抖函数
export const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

// 3. 节流函数
export const throttle = (func, delay) => {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            func.apply(this, args);
            lastTime = now;
        }
    };
};

// 4. 深拷贝
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
};

// 5. 获取URL参数
export const getUrlParams = (url = window.location.href) => {
    const params = {};
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
};

// 6. 下载文件（通用方法）
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 7. 复制到剪贴板
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    }
};
```

### 6. 打包部署
#### （1）React 打包
```bash
# 打包命令（package.json中配置）
# "build": "react-scripts build"
npm run build

# 打包后的文件在build目录，可直接部署到Nginx
# 需要配置Nginx：
# location / {
#     root /usr/share/nginx/html;
#     index index.html;
#     try_files $uri $uri/ /index.html; # 重要：支持前端路由
# }
```

#### （2）Spring Boot 打包与运行
```bash
# Maven打包为jar包
mvn clean package -DskipTests

# 运行jar包
java -jar demo-0.0.1-SNAPSHOT.jar --server.port=8080

# 指定配置文件运行
java -jar demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# 后台运行（Linux）
nohup java -jar demo-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# 查看日志
tail -f app.log

# 停止应用（找到进程ID后kill）
ps aux | grep java
kill -9 <PID>
```

#### （3）Docker部署（可选）
```dockerfile
# Dockerfile（Spring Boot）
FROM openjdk:11-jre-slim
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
# 构建镜像
docker build -t demo-app .

# 运行容器
docker run -d -p 8080:8080 --name demo demo-app

# 查看日志
docker logs -f demo
```

## 四、日常开发速查表
### Spring Boot 速查
| 场景 | 解决方案 | 代码示例 |
|------|----------|----------|
| 读取配置 | `@Value("${key:default}")` | `@Value("${server.port:8080}")` |
| 批量绑定配置 | `@ConfigurationProperties` | 见配置文件章节 |
| 参数校验 | `@Valid` + `@NotNull`/`@NotBlank`等 | 见参数校验章节 |
| 事务管理 | `@Transactional` | 注意：public方法，RuntimeException |
| 缓存 | `@Cacheable` + Redis | 见Redis使用章节 |
| 异步任务 | `@Async` + `@EnableAsync` | 见异步任务章节 |
| 定时任务 | `@Scheduled` + `@EnableScheduling` | 见定时任务章节 |
| 文件上传 | `MultipartFile` | 见文件上传章节 |
| 跨域 | `CorsConfig` | 见跨域配置章节 |
| 拦截器 | `HandlerInterceptor` | 见拦截器章节 |
| 全局异常 | `@RestControllerAdvice` | 见异常处理章节 |
| 日志打印 | `Logger` + `logback` | `log.info("消息：{}", param)` |

### React 速查
| 场景 | 解决方案 | 代码示例 |
|------|----------|----------|
| 状态管理 | `useState` | `const [state, setState] = useState(init)` |
| 副作用 | `useEffect` | `useEffect(() => {}, [deps])` |
| 缓存计算 | `useMemo` | `const value = useMemo(() => compute(), [deps])` |
| 缓存函数 | `useCallback` | `const fn = useCallback(() => {}, [deps])` |
| DOM引用 | `useRef` | `const ref = useRef(null)` |
| 路由参数 | `useParams` | `const { id } = useParams()` |
| 路由跳转 | `useNavigate` | `navigate('/path')` |
| 表单处理 | Ant Design Form | 见表单处理章节 |
| 文件上传 | `FormData` + `multipart/form-data` | 见文件上传章节 |
| 请求取消 | `AbortController` | 见请求取消章节 |
| 错误边界 | `ErrorBoundary` | 见错误边界章节 |
| 懒加载 | `React.lazy` + `Suspense` | 见路由懒加载章节 |

### 常见问题快速定位
| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| Spring Boot启动失败 | 端口被占用/配置错误 | 检查`application.yml`，查看启动日志 |
| 接口404 | 路径错误/Controller未扫描 | 检查`@RequestMapping`路径，确认包扫描范围 |
| 接口500 | 代码异常/数据库连接失败 | 查看日志，检查异常堆栈 |
| 事务不生效 | 方法非public/内部调用 | 改为public，避免同类内部调用 |
| React组件不更新 | 状态未正确更新/依赖缺失 | 检查`setState`，确认`useEffect`依赖 |
| 无限循环 | useEffect依赖对象引用变化 | 依赖改为具体值（如`user.id`而非`user`） |
| 跨域错误 | 后端未配置CORS | 添加`CorsConfig`配置类 |
| 文件上传失败 | 文件大小超限/类型不支持 | 检查`multipart.max-file-size`配置 |

## 五、总结
### 核心关键点回顾
1. **Java/Spring Boot**：
   - 优先使用构造器注入依赖，避免字段注入；
   - 接口返回统一格式，全局异常拦截；
   - 事务仅对public方法生效，避免内部调用（AOP限制）；
   - MyBatis-Plus简化CRUD，分页需配置插件；
   - 参数校验用`@Valid` + 校验注解，避免手动判断；
   - Redis用于缓存和分布式锁，提升性能；
   - 定时任务和异步任务需启用对应注解。

2. **React**：
   - 函数组件+Hook是主流，避免类组件；
   - 状态更新异步，对象/数组需浅拷贝；
   - `useEffect`依赖数组要正确，避免无限循环；
   - `useCallback`和`useMemo`用于性能优化；
   - Axios封装统一拦截，处理token和异常；
   - 路由使用React Router 6+，动态路由用`useParams`；
   - 表单处理推荐用Ant Design Form，简单高效；
   - 组件卸载时清理定时器、请求等，避免内存泄漏。

3. **通用规范**：
   - 前后端联调优先用代理解决跨域；
   - 代码风格统一（Java用Alibaba规范，React用ESLint）；
   - 关键操作加日志/异常捕获，便于排查问题；
   - 文件上传下载注意大小和类型限制；
   - 使用错误边界捕获React组件错误；
   - 生产环境配置日志级别，避免信息泄露。

### 学习路径建议
1. **基础阶段**：掌握Java基础、Spring Boot核心注解、React Hook基础用法
2. **进阶阶段**：深入理解AOP、事务、缓存、性能优化、错误处理
3. **实战阶段**：结合实际项目，积累问题排查经验，形成自己的开发规范

这份笔记覆盖入职后90%的高频开发场景，包含大量容易忘记的细节和避坑指南。建议：
- 日常开发时快速查阅对应章节
- 遇到问题先查"常见问题快速定位"表
- 根据公司业务补充个性化内容（如微服务、状态管理库Zustand/Redux、消息队列等）