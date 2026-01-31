---
icon: pen-to-square
date: 2026-01-27
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# Mapstruct

MapStruct 是一个代码生成器，用于简化 Java Bean 之间的映射。它通过编译时生成映射代码，性能优于反射，类型安全，且易于调试。

## BeanUtils.copyProperties()的缺点

### 1. 性能问题
- **反射机制**：使用反射进行属性复制，性能较差
- **运行时开销**：每次调用都需要反射查找字段和方法
- **不适合高频调用**：在高并发场景下会成为性能瓶颈

### 2. 类型安全问题
- **编译期不检查**：属性名拼写错误在编译期无法发现
- **运行时异常**：只有在运行时才会抛出异常
- **IDE 不支持**：IDE 无法提供自动补全和重构支持

### 3. 功能限制
- **不支持复杂映射**：无法处理嵌套对象、集合转换等
- **不支持自定义转换**：无法自定义字段转换逻辑
- **不支持条件映射**：无法根据条件决定是否映射

### 4. 代码示例对比

```java
// 使用 BeanUtils（不推荐）
UserDTO userDTO = new UserDTO();
BeanUtils.copyProperties(user, userDTO);  // 运行时才知道是否有问题

// 使用 MapStruct（推荐）
UserDTO userDTO = UserMapper.INSTANCE.toDTO(user);  // 编译期检查
```

## 使用Mapstruct

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

### 2. 基础映射

```java
@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    // 简单映射
    UserDTO toDTO(User user);
    
    // 反向映射
    User toEntity(UserDTO dto);
    
    // 批量映射
    List<UserDTO> toDTOList(List<User> users);
    
    // 更新实体（忽略 null 值）
    @Mapping(target = "id", ignore = true)
    void updateEntity(UserDTO dto, @MappingTarget User user);
}
```

### 3. 字段映射

```java
@Mapper
public interface UserMapper {
    
    // 字段名不同
    @Mapping(source = "userName", target = "name")
    @Mapping(source = "emailAddress", target = "email")
    UserDTO toDTO(User user);
    
    // 忽略字段
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createTime", ignore = true)
    UserDTO toDTO(User user);
    
    // 常量映射
    @Mapping(target = "status", constant = "ACTIVE")
    UserDTO toDTO(User user);
    
    // 表达式映射
    @Mapping(target = "fullName", 
             expression = "java(user.getFirstName() + \" \" + user.getLastName())")
    UserDTO toDTO(User user);
}
```

### 4. 嵌套对象映射

```java
// 实体类
public class User {
    private Long id;
    private String name;
    private Address address;  // 嵌套对象
}

public class Address {
    private String street;
    private String city;
}

// DTO 类
public class UserDTO {
    private Long id;
    private String name;
    private AddressDTO address;  // 嵌套对象
}

// Mapper
@Mapper
public interface UserMapper {
    
    // 自动处理嵌套映射（需要 AddressMapper）
    UserDTO toDTO(User user);
}

@Mapper
public interface AddressMapper {
    AddressDTO toDTO(Address address);
}
```

### 5. 集合映射

```java
@Mapper
public interface UserMapper {
    
    // List 映射
    List<UserDTO> toDTOList(List<User> users);
    
    // Set 映射
    Set<UserDTO> toDTOSet(Set<User> users);
    
    // Map 映射
    Map<String, UserDTO> toDTOMap(Map<String, User> userMap);
    
    // 集合中的对象映射
    @Mapping(source = "orders", target = "orderList")
    UserDTO toDTO(User user);
}
```

### 6. 自定义转换方法

```java
@Mapper
public interface UserMapper {
    
    // 使用默认方法
    default String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    
    @Mapping(source = "createTime", target = "createTimeStr", 
             qualifiedByName = "formatDate")
    UserDTO toDTO(User user);
    
    // 使用其他 Mapper
    @Mapper(uses = {AddressMapper.class, OrderMapper.class})
    public interface UserMapper {
        UserDTO toDTO(User user);
    }
}
```

### 7. 条件映射

```java
@Mapper
public interface UserMapper {
    
    // 条件映射（仅当 source 不为 null 时映射）
    @Mapping(source = "email", target = "email", 
             conditionExpression = "java(user.getEmail() != null)")
    UserDTO toDTO(User user);
    
    // 使用自定义条件方法
    default boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
    
    @Mapping(source = "name", target = "name", 
             conditionExpression = "java(isNotEmpty(user.getName()))")
    UserDTO toDTO(User user);
}
```

### 8. 多源映射

```java
@Mapper
public interface UserMapper {
    
    // 从多个源对象映射到一个目标对象
    @Mapping(source = "user.id", target = "id")
    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "address.street", target = "street")
    @Mapping(source = "address.city", target = "city")
    UserDetailDTO toDetailDTO(User user, Address address);
}
```

### 9. 更新现有对象

```java
@Mapper
public interface UserMapper {
    
    // 更新现有对象（忽略 null 值）
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createTime", ignore = true)
    void updateEntity(UserDTO dto, @MappingTarget User user);
    
    // 部分更新
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UserDTO dto, @MappingTarget User user);
}
```

### 10. 完整示例

```java
// 实体类
@Entity
public class User {
    private Long id;
    private String userName;
    private String email;
    private String password;
    private LocalDateTime createTime;
    private Address address;
    private List<Order> orders;
}

// DTO 类
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String addressStr;
    private List<OrderDTO> orderList;
    private String createTimeStr;
}

// Mapper 接口
@Mapper(componentModel = "spring", uses = {AddressMapper.class, OrderMapper.class})
public interface UserMapper {
    
    @Mapping(source = "userName", target = "name")
    @Mapping(source = "address", target = "addressStr", 
             qualifiedByName = "addressToString")
    @Mapping(source = "orders", target = "orderList")
    @Mapping(source = "createTime", target = "createTimeStr", 
             dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "password", ignore = true)
    UserDTO toDTO(User user);
    
    List<UserDTO> toDTOList(List<User> users);
    
    @Named("addressToString")
    default String addressToString(Address address) {
        if (address == null) {
            return null;
        }
        return address.getStreet() + ", " + address.getCity();
    }
}

// 使用示例
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    public UserDTO getUserDTO(Long id) {
        User user = userRepository.findById(id);
        return userMapper.toDTO(user);
    }
    
    public List<UserDTO> getUserDTOList() {
        List<User> users = userRepository.findAll();
        return userMapper.toDTOList(users);
    }
}
```

## 配置选项

### componentModel 配置

```java
// Spring 组件（推荐）
@Mapper(componentModel = "spring")
public interface UserMapper {
    // Spring 会自动注入
}

// CDI 组件
@Mapper(componentModel = "cdi")
public interface UserMapper {
    // 用于 Java EE 应用
}

// 默认（手动获取实例）
@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
}
```

### 编译配置（Maven）

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.8.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.5.Final</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

## 最佳实践

1. **使用 Spring 组件模型**：`componentModel = "spring"` 便于依赖注入
2. **合理使用 @Mapping**：明确指定字段映射关系
3. **忽略敏感字段**：使用 `ignore = true` 忽略密码等敏感信息
4. **处理 null 值**：使用 `nullValuePropertyMappingStrategy` 控制 null 值处理
5. **自定义转换方法**：对于复杂转换，使用默认方法或 @Named 方法
6. **嵌套对象映射**：使用 `uses` 属性引用其他 Mapper
7. **批量映射**：利用 List/Set/Map 的自动映射功能
8. **编译时检查**：充分利用编译期的类型检查，避免运行时错误