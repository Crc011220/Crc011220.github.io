---
icon: pen-to-square
date: 2026-01-27
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# POJO

POJO（Plain Old Java Object）是指简单的 Java 对象，不继承任何类，不实现任何接口，不被框架侵入。在分层架构中，不同层次使用不同的 POJO 类型，以实现关注点分离。

## 数据传输对象（DTO）

### 定义
DTO（Data Transfer Object）用于在不同层之间传输数据，特别是在 Controller 层和 Service 层之间，或者在不同服务之间传输数据。

### 特点
- **扁平化结构**：通常不包含业务逻辑
- **序列化支持**：需要支持 JSON/XML 序列化
- **字段验证**：通常包含验证注解（如 `@NotNull`、`@NotBlank`）
- **版本控制**：可以包含版本字段，用于 API 兼容性

### 使用场景
- **请求参数**：接收前端请求参数
- **响应结果**：返回给前端的数据
- **服务间调用**：微服务之间的数据传输

### 代码示例

```java
// 创建用户请求 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    private String userName;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20之间")
    private String password;
    
    @Min(value = 18, message = "年龄不能小于18")
    @Max(value = 100, message = "年龄不能大于100")
    private Integer age;
}

// 用户响应 DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String userName;
    private String email;
    private Integer age;
    private String status;
    private LocalDateTime createTime;
    
    // 不包含敏感信息（如密码）
}

// 分页查询 DTO
@Data
public class UserQueryDTO {
    private String userName;
    private String email;
    private Integer page = 1;
    private Integer size = 10;
    private String sortField = "createTime";
    private String sortOrder = "DESC";
}
```

## 值对象（VO）

### 定义
VO（Value Object）用于展示层，通常用于封装多个相关数据，展示给用户。VO 可以包含多个 DTO 或 PO 的数据组合。

### 特点
- **展示导向**：专门用于前端展示
- **数据组合**：可以组合多个数据源
- **格式化数据**：包含格式化后的数据（如日期字符串）
- **计算属性**：可以包含计算得出的属性

### 使用场景
- **页面展示**：前端页面需要展示的数据
- **报表数据**：报表中的汇总数据
- **统计信息**：统计结果的展示

### 代码示例

```java
// 用户详情 VO（组合多个数据源）
@Data
@Builder
public class UserDetailVO {
    // 用户基本信息
    private Long userId;
    private String userName;
    private String email;
    
    // 统计信息
    private Integer orderCount;
    private BigDecimal totalAmount;
    
    // 最近订单列表
    private List<OrderVO> recentOrders;
    
    // 格式化后的数据
    private String createTimeStr;  // "2024-01-01 12:00:00"
    private String statusText;     // "正常" / "冻结"
}

// 订单 VO
@Data
@Builder
public class OrderVO {
    private Long orderId;
    private String orderNo;
    private BigDecimal amount;
    private String status;
    private String statusText;  // "待支付" / "已支付" / "已取消"
    private String createTimeStr;
    
    // 计算属性
    public String getAmountText() {
        return "¥" + amount.setScale(2, RoundingMode.HALF_UP);
    }
}

// 报表数据 VO
@Data
public class SalesReportVO {
    private String dateRange;
    private BigDecimal totalSales;
    private Integer orderCount;
    private BigDecimal averageOrderAmount;
    private List<DailySalesVO> dailySales;
}
```

## 持久化对象（PO）

### 定义
PO（Persistent Object）用于持久化层，对应数据库表的实体类。PO 通常与数据库表结构一一对应。

### PO 和 Entity 的关系与区别

#### 概念层面
- **PO（Persistent Object）**：是一个**概念**，指用于持久化的对象，强调"持久化"这个职责
- **Entity**：是一个**技术术语**，特指使用 JPA（Java Persistence API）时用 `@Entity` 注解标记的类

#### 实际使用中的关系

| 对比项 | PO | Entity |
|--------|----|----|
| **定义** | 持久化对象的概念 | JPA 中的实体类 |
| **注解** | 无特定注解要求 | 必须使用 `@Entity` 注解 |
| **框架** | 可以是任何 ORM 框架（JPA、MyBatis、Hibernate） | 特指 JPA 规范 |
| **关系** | Entity 是 PO 的一种实现方式 | Entity 是 PO 在 JPA 中的具体体现 |

#### 代码示例对比

**使用 JPA 的 Entity（PO 的一种实现）**
```java
// 使用 JPA 时，PO 就是 Entity
@Entity
@Table(name = "t_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name")
    private String userName;
}
```

**使用 MyBatis 的 PO（不是 Entity）**
```java
// 使用 MyBatis 时，PO 不需要 @Entity 注解
public class User {
    private Long id;
    private String userName;
    
    // MyBatis 通过 XML 映射文件或注解来映射数据库表
}
```

#### 不同框架下的 PO

**1. JPA/Hibernate 框架**
```java
// 使用 @Entity 注解，这就是 Entity，也是 PO
@Entity
@Table(name = "t_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name")
    private String userName;
}
```

**2. MyBatis 框架**
```java
// 不使用 @Entity 注解，只是普通的 PO 类
// 通过 XML 映射文件或 @Mapper 注解来映射数据库表
public class User {
    private Long id;
    private String userName;
    
    // getter/setter...
}

// 对应的 MyBatis Mapper
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM t_user WHERE id = #{id}")
    User findById(Long id);
}
```

**3. JdbcTemplate 框架**
```java
// 也是 PO，但不使用任何 ORM 注解
public class User {
    private Long id;
    private String userName;
    
    // getter/setter...
}

// 手动编写 SQL
@Repository
public class UserRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public User findById(Long id) {
        String sql = "SELECT * FROM t_user WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new UserRowMapper(), id);
    }
}
```

#### 总结
- **PO 是概念**：指所有用于持久化的对象，不限定框架
- **Entity 是技术实现**：特指 JPA 中用 `@Entity` 注解的类
- **关系**：Entity 是 PO 在 JPA 框架下的具体实现形式
- **实际使用**：
  - 使用 **JPA/Hibernate** 时：PO = Entity（用 `@Entity` 注解）
  - 使用 **MyBatis** 时：只有 PO 的概念，没有 Entity（不用 `@Entity` 注解）
  - 使用 **JdbcTemplate** 时：只有 PO 的概念，没有 Entity（纯 JDBC）

### 特点
- **数据库映射**：使用 JPA/MyBatis 等 ORM 框架映射到数据库表
- **包含主键**：通常包含主键字段
- **包含审计字段**：创建时间、更新时间、创建人、更新人等
- **关联关系**：可以包含与其他 PO 的关联关系

### 使用场景
- **数据库操作**：增删改查操作
- **数据持久化**：保存到数据库
- **数据查询**：从数据库查询数据

### 代码示例

```java
// 用户 PO（对应数据库表）
@Entity
@Table(name = "t_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "age")
    private Integer age;
    
    @Column(name = "status", nullable = false)
    private String status;
    
    // 审计字段
    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;
    
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    @Column(name = "create_by")
    private String createBy;
    
    @Column(name = "update_by")
    private String updateBy;
    
    // 关联关系
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
}

// 订单 PO
@Entity
@Table(name = "t_order")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_no", nullable = false, unique = true)
    private String orderNo;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "status", nullable = false)
    private String status;
    
    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;
    
    // 关联关系
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
}
```

## 对象转换

### 使用 MapStruct 进行转换

```java
@Mapper(componentModel = "spring")
public interface UserMapper {
    
    // PO -> DTO
    UserDTO toDTO(User user);
    
    // DTO -> PO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createTime", ignore = true)
    @Mapping(target = "updateTime", ignore = true)
    User toPO(UserCreateDTO dto);
    
    // PO -> VO
    @Mapping(source = "createTime", target = "createTimeStr", 
             dateFormat = "yyyy-MM-dd HH:mm:ss")
    UserDetailVO toVO(User user);
    
    // 批量转换
    List<UserDTO> toDTOList(List<User> users);
}
```

### 手动转换示例

```java
@Service
public class UserService {
    
    public UserDTO getUserDTO(Long id) {
        User user = userRepository.findById(id);
        
        // PO -> DTO
        return UserDTO.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .age(user.getAge())
                .status(user.getStatus())
                .createTime(user.getCreateTime())
                .build();
    }
    
    public UserDetailVO getUserDetailVO(Long id) {
        User user = userRepository.findById(id);
        List<Order> orders = orderRepository.findByUserId(id);
        
        // PO -> VO（组合多个数据源）
        return UserDetailVO.builder()
                .userId(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .orderCount(orders.size())
                .totalAmount(orders.stream()
                    .map(Order::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add))
                .recentOrders(orders.stream()
                    .limit(5)
                    .map(this::toOrderVO)
                    .collect(Collectors.toList()))
                .createTimeStr(user.getCreateTime()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .statusText(getStatusText(user.getStatus()))
                .build();
    }
}
```

## 分层架构中的使用

```
Controller 层
    ↓ 使用 DTO
Service 层
    ↓ 使用 PO
Repository 层
    ↓ 操作数据库
数据库

Controller 层返回 VO 给前端
```

### 各层职责

| 层次 | 使用的对象类型 | 职责 |
|------|---------------|------|
| **Controller** | DTO（请求）、VO（响应） | 接收请求、返回响应 |
| **Service** | DTO、PO | 业务逻辑处理 |
| **Repository** | PO | 数据持久化 |
| **View** | VO | 数据展示 |

## 最佳实践

1. **明确职责**：DTO 用于传输，VO 用于展示，PO 用于持久化
2. **避免混用**：不要将 PO 直接返回给前端，避免暴露数据库结构
3. **使用工具转换**：使用 MapStruct 等工具进行对象转换，避免手动编写
4. **字段验证**：DTO 中使用验证注解，确保数据有效性
5. **敏感信息**：DTO/VO 中不包含密码等敏感信息
6. **版本控制**：DTO 可以包含版本字段，便于 API 演进
7. **性能考虑**：VO 中可以包含计算属性，减少 Service 层计算
8. **命名规范**：统一使用 DTO/VO/PO 后缀，便于识别