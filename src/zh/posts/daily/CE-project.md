---
icon: pen-to-square
date: 2025-08-25
category:
  - Learning Records
tag:
  - Notes
---

# CE project

## JWT 

### 1. 🔑 JWT存储在哪里？

**客户端存储**：
- JWT **不存储在服务器端**（这是JWT的特点之一）
- JWT由**客户端**（前端）负责存储，常见方式：
  - `localStorage` - 持久化存储
  - `sessionStorage` - 会话存储  
  - `Memory` - 内存存储（最安全，但刷新页面会丢失）
  - `HttpOnly Cookie` - 相对安全的方式

**服务器端**：
- 服务器只在**黑名单**中存储已登出的token
- 黑名单存储在**Redis**中，key格式：`jwt:blacklist:{token}`

### 2. 🚪 登出时JWT如何处理？

根据你的代码，登出流程如下：

```java
// 1. 客户端发送登出请求，携带JWT token
POST /auth/logout
Authorization: Bearer {jwt-token}

// 2. 服务器处理登出
@PostMapping("/logout")
public R<Void> logout(HttpServletRequest request) {
    String token = extractTokenFromRequest(request);  // 提取token
    if (token != null) {
        authService.logout(token);  // 调用登出服务
    }
    return R.ok(Constants.LOGOUT_SUCCESS, null);
}

// 3. 将token加入Redis黑名单
public void logout(String token) {
    long remainingTime = jwtUtil.getRemainingTime(token);  // 获取剩余有效时间
    if (remainingTime > 0) {
        tokenBlacklistService.addToBlacklist(token, remainingTime);  // 加入黑名单
    }
}
```

**登出机制**：
- ✅ 将token加入**Redis黑名单**，存储时间为token的剩余有效期
- ✅ 后续请求会检查黑名单，已登出的token将被拒绝访问
- ✅ 客户端需要**删除本地存储的token**

### 3. ⏰ JWT存在时间多久？

根据你的配置文件：

```yaml
jwt:
  # Access Token 过期时间 (小时)
  access-token-expiration: 24
  # Refresh Token 过期时间 (天)  
  refresh-token-expiration: 7
```

**Token生存时间**：
- **Access Token**: **24小时**（用于API访问）
- **Refresh Token**: **7天**（用于刷新Access Token）

**Token刷新机制**：
```java
// 使用refresh token获取新的access token
POST /auth/refresh
{
  "refreshToken": "your-refresh-token"
}

// 返回新的token对
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token", 
  "expiresIn": 86400  // 24小时(秒)
}
```

### 🛡️ 安全建议

1. **客户端存储**：
   - 推荐使用`httpOnly cookie`存储refresh token
   - Access token可存储在内存中
   - 避免在`localStorage`中存储敏感token

2. **Token刷新**：
   - Access token过期前自动刷新
   - Refresh token使用一次后立即更新（你的代码已实现）

3. **登出清理**：
   ```javascript
   // 前端登出时需要清理
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
   // 或者清空所有认证相关数据
   ```

你的JWT实现已经很完善了，包含了Token黑名单、自动刷新等安全机制！

## 重置密码流程

### 🔄 用户操作流程

1. **用户在登录页面点击"忘记密码"**
   - 跳转到忘记密码页面
   - 输入邮箱：`user@example.com`
   - 点击"发送重置邮件"

2. **前端调用忘记密码接口**
   ```javascript
   POST /auth/forgot-password
   {
     "email": "user@example.com"
   }
   ```

3. **用户看到提示信息**
   ```
   "如果该邮箱已注册，您将收到密码重置邮件"
   ```

4. **用户检查邮箱，收到重置邮件**
   ```
   标题：CE-Wombat 密码重置请求
   
   亲爱的 user，
   
   您收到此邮件是因为有人请求重置您的 CE-Wombat 账户密码。
   
   如果这是您本人的操作，请点击以下链接重置密码：
   http://localhost:3000/reset-password?token=abcd-1234-efgh-5678
   
   此链接将在30分钟后失效。
   ```

5. **用户点击邮件中的链接**
   - 浏览器打开：`http://localhost:3000/reset-password?token=abcd-1234-efgh-5678`
   - 前端从URL获取token参数
   - 显示重置密码表单

6. **用户在重置密码页面输入新密码**
   - 输入新密码：`newPassword123`
   - 确认密码：`newPassword123`
   - 点击"重置密码"

7. **前端调用重置密码接口**
   ```javascript
   POST /auth/reset-password
   {
     "token": "abcd-1234-efgh-5678",
     "newPassword": "newPassword123",
     "confirmPassword": "newPassword123"
   }
   ```

8. **密码重置成功**
   ```
   "密码重置成功"
   ```
   - 用户可以用新密码登录了

### 🎯 关键点总结

- **第一个接口**：处理"发送重置邮件"的请求
- **邮件链接**：连接两个步骤的桥梁（包含token）
- **第二个接口**：处理"实际重置密码"的请求

就像你说的，**先忘记密码 → 邮件收到 → 点进去 → 重置密码**，这是一个完整的安全链条！🔗

这样设计确保了：
1. ✅ 只有邮箱拥有者能收到重置链接
2. ✅ 只有点击邮件链接的人能重置密码  
3. ✅ 令牌有时效性，防止滥用
4. ✅ 整个过程安全可控

## 邮件

### 1. 邮件发送

https://myaccount.google.com/apppasswords