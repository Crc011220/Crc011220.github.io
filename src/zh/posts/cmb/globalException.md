---
icon: pen-to-square
date: 2026-01-25
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# 全局异常处理

全局异常处理是 Spring Boot 应用中统一处理异常的最佳实践，可以避免在每个 Controller 方法中重复编写 try-catch 代码，提高代码的可维护性和用户体验。

## 核心组件

### 1. @ControllerAdvice 注解
- 用于定义全局异常处理器
- 可以指定扫描的包或 Controller
- 配合 `@ExceptionHandler` 处理特定异常

### 2. @ExceptionHandler 注解
- 标注在方法上，指定处理的异常类型
- 可以处理多个异常类型
- 支持方法参数注入（HttpServletRequest、HttpServletResponse 等）

## 基础实现

### 1. 统一响应结果类

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    private Integer code;      // 响应码
    private String message;    // 响应消息
    private T data;            // 响应数据
    private Long timestamp;    // 时间戳
    
    public static <T> Result<T> success(T data) {
        return Result.<T>builder()
                .code(200)
                .message("操作成功")
                .data(data)
                .timestamp(System.currentTimeMillis())
                .build();
    }
    
    public static <T> Result<T> success(String message, T data) {
        return Result.<T>builder()
                .code(200)
                .message(message)
                .data(data)
                .timestamp(System.currentTimeMillis())
                .build();
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        return Result.<T>builder()
                .code(code)
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build();
    }
    
    public static <T> Result<T> error(String message) {
        return error(500, message);
    }
}
```

### 2. 业务异常类

```java
public class BusinessException extends RuntimeException {
    private Integer code;
    
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public Integer getCode() {
        return code;
    }
}

// 常用业务异常
public class NotFoundException extends BusinessException {
    public NotFoundException(String message) {
        super(404, message);
    }
}

public class BadRequestException extends BusinessException {
    public BadRequestException(String message) {
        super(400, message);
    }
}

public class UnauthorizedException extends BusinessException {
    public UnauthorizedException(String message) {
        super(401, message);
    }
}
```

### 3. 全局异常处理器

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 处理参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(MethodArgumentNotValidException e) {
        StringBuilder message = new StringBuilder();
        e.getBindingResult().getFieldErrors().forEach(error -> {
            message.append(error.getField())
                   .append(": ")
                   .append(error.getDefaultMessage())
                   .append("; ");
        });
        log.warn("参数校验失败: {}", message);
        return Result.error(400, message.toString());
    }
    
    /**
     * 处理请求参数绑定异常
     */
    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException e) {
        StringBuilder message = new StringBuilder();
        e.getBindingResult().getFieldErrors().forEach(error -> {
            message.append(error.getField())
                   .append(": ")
                   .append(error.getDefaultMessage())
                   .append("; ");
        });
        log.warn("参数绑定失败: {}", message);
        return Result.error(400, message.toString());
    }
    
    /**
     * 处理请求参数缺失异常
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public Result<Void> handleMissingParameterException(
            MissingServletRequestParameterException e) {
        log.warn("缺少请求参数: {}", e.getParameterName());
        return Result.error(400, "缺少请求参数: " + e.getParameterName());
    }
    
    /**
     * 处理请求体缺失异常
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Result<Void> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e) {
        log.warn("请求体解析失败: {}", e.getMessage());
        return Result.error(400, "请求体格式错误");
    }
    
    /**
     * 处理请求方法不支持异常
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Result<Void> handleMethodNotSupportedException(
            HttpRequestMethodNotSupportedException e) {
        log.warn("请求方法不支持: {}", e.getMethod());
        return Result.error(405, "请求方法不支持: " + e.getMethod());
    }
    
    /**
     * 处理媒体类型不支持异常
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public Result<Void> handleMediaTypeNotSupportedException(
            HttpMediaTypeNotSupportedException e) {
        log.warn("媒体类型不支持: {}", e.getContentType());
        return Result.error(415, "媒体类型不支持");
    }
    
    /**
     * 处理空指针异常
     */
    @ExceptionHandler(NullPointerException.class)
    public Result<Void> handleNullPointerException(NullPointerException e) {
        log.error("空指针异常", e);
        return Result.error(500, "系统内部错误");
    }
    
    /**
     * 处理其他运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public Result<Void> handleRuntimeException(RuntimeException e) {
        log.error("运行时异常", e);
        return Result.error(500, "系统内部错误: " + e.getMessage());
    }
    
    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("未知异常", e);
        return Result.error(500, "系统内部错误");
    }
}
```

## 高级用法

### 1. 异常码枚举

```java
public enum ErrorCode {
    SUCCESS(200, "操作成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_ERROR(500, "系统内部错误"),
    
    // 业务异常码
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户已存在"),
    PASSWORD_ERROR(1003, "密码错误"),
    ORDER_NOT_FOUND(2001, "订单不存在"),
    INSUFFICIENT_STOCK(2002, "库存不足");
    
    private final Integer code;
    private final String message;
    
    ErrorCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public Integer getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }
}
```

### 2. 增强的异常类

```java
public class BusinessException extends RuntimeException {
    private ErrorCode errorCode;
    private Object[] args;
    
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
    
    public BusinessException(ErrorCode errorCode, Object... args) {
        super(String.format(errorCode.getMessage(), args));
        this.errorCode = errorCode;
        this.args = args;
    }
    
    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
```

### 3. 异常信息国际化

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @Autowired
    private MessageSource messageSource;
    
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(
            BusinessException e,
            HttpServletRequest request) {
        // 获取请求的语言环境
        Locale locale = request.getLocale();
        
        // 从国际化资源文件中获取错误消息
        String message = messageSource.getMessage(
            e.getErrorCode().name().toLowerCase(),
            e.getArgs(),
            e.getErrorCode().getMessage(),
            locale
        );
        
        log.warn("业务异常: {}", message);
        return Result.error(e.getErrorCode().getCode(), message);
    }
}
```

### 4. 异常日志记录

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e, HttpServletRequest request) {
        // 记录异常详情
        log.error("异常详情: URL={}, Method={}, Exception={}", 
            request.getRequestURI(),
            request.getMethod(),
            e.getClass().getName(),
            e);
        
        // 发送告警（可选）
        alertService.sendAlert(e, request);
        
        return Result.error(500, "系统内部错误");
    }
}
```

## 使用示例

### Controller 中使用

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public Result<UserDTO> getUserById(@PathVariable Long id) {
        // 直接抛出异常，由全局异常处理器处理
        UserDTO user = userService.getUserById(id);
        if (user == null) {
            throw new NotFoundException("用户不存在");
        }
        return Result.success(user);
    }
    
    @PostMapping
    public Result<UserDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
        // 参数校验失败会自动抛出 MethodArgumentNotValidException
        UserDTO user = userService.createUser(dto);
        return Result.success("创建成功", user);
    }
}
```

## 最佳实践

1. **统一响应格式**：所有接口返回统一的 Result 格式
2. **异常分类处理**：区分业务异常、系统异常、参数异常
3. **异常码规范**：定义清晰的异常码体系
4. **日志记录**：记录异常详情，便于排查问题
5. **用户友好**：返回用户友好的错误信息，避免暴露系统细节
6. **国际化支持**：支持多语言错误消息
7. **异常监控**：集成监控系统，及时发现问题
