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

##
