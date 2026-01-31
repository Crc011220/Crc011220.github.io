---
icon: pen-to-square
date: 2026-01-27
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# Kafka

Apache Kafka 是一个分布式流处理平台，主要用于构建实时数据管道和流式应用。在微服务架构中，Kafka 常用于异步消息传递、事件驱动架构、日志收集等场景。

## 核心概念

### 1. 基本术语

| 术语 | 说明 |
|------|------|
| **Producer** | 生产者，发送消息到 Kafka |
| **Consumer** | 消费者，从 Kafka 读取消息 |
| **Broker** | Kafka 服务器节点 |
| **Topic** | 主题，消息的分类 |
| **Partition** | 分区，Topic 的物理分割 |
| **Offset** | 偏移量，消息在分区中的位置 |
| **Consumer Group** | 消费者组，多个消费者协同消费 |

### 2. Topic 和 Partition

- **Topic**：逻辑概念，用于分类消息
- **Partition**：物理概念，Topic 被分成多个分区
- **分区优势**：
  - 提高并发处理能力
  - 支持水平扩展
  - 保证消息顺序（分区内有序）

## Spring Boot 集成 Kafka

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

### 2. 配置文件

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: all                    # 等待所有副本确认
      retries: 3                   # 重试次数
      batch-size: 16384            # 批量发送大小
      linger-ms: 10                # 等待时间
    consumer:
      group-id: my-consumer-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      auto-offset-reset: earliest  # earliest, latest, none
      enable-auto-commit: false    # 手动提交偏移量
      max-poll-records: 500        # 每次拉取最大记录数
```

### 3. 生产者示例

```java
@Service
@Slf4j
public class KafkaProducerService {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    /**
     * 发送简单消息
     */
    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
        log.info("发送消息到主题 {}: {}", topic, message);
    }
    
    /**
     * 发送带 key 的消息（相同 key 会路由到同一分区）
     */
    public void sendMessageWithKey(String topic, String key, String message) {
        kafkaTemplate.send(topic, key, message);
    }
    
    /**
     * 发送到指定分区
     */
    public void sendToPartition(String topic, int partition, String message) {
        kafkaTemplate.send(topic, partition, null, message);
    }
    
    /**
     * 发送对象消息（需要配置 JSON 序列化器）
     */
    public void sendObjectMessage(String topic, Object obj) {
        kafkaTemplate.send(topic, obj);
    }
    
    /**
     * 异步发送并处理回调
     */
    public void sendMessageWithCallback(String topic, String message) {
        ListenableFuture<SendResult<String, String>> future = 
            kafkaTemplate.send(topic, message);
        
        future.addCallback(
            result -> {
                log.info("消息发送成功: topic={}, offset={}", 
                    topic, result.getRecordMetadata().offset());
            },
            failure -> {
                log.error("消息发送失败: topic={}, error={}", 
                    topic, failure.getMessage());
            }
        );
    }
}
```

### 4. 消费者示例

```java
@Component
@Slf4j
public class KafkaConsumerService {
    
    /**
     * 简单消费者
     */
    @KafkaListener(topics = "user-topic", groupId = "user-group")
    public void consumeUserMessage(String message) {
        log.info("收到消息: {}", message);
        // 处理消息逻辑
    }
    
    /**
     * 消费带 key 的消息
     */
    @KafkaListener(topics = "order-topic", groupId = "order-group")
    public void consumeOrderMessage(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        log.info("收到订单消息: key={}, partition={}, offset={}, message={}", 
            key, partition, offset, message);
    }
    
    /**
     * 消费对象消息
     */
    @KafkaListener(topics = "payment-topic", groupId = "payment-group")
    public void consumePaymentMessage(PaymentDTO payment) {
        log.info("收到支付消息: {}", payment);
        // 处理支付逻辑
    }
    
    /**
     * 批量消费
     */
    @KafkaListener(topics = "batch-topic", groupId = "batch-group",
                   containerFactory = "batchKafkaListenerContainerFactory")
    public void consumeBatchMessages(List<String> messages) {
        log.info("批量收到 {} 条消息", messages.size());
        for (String message : messages) {
            // 处理每条消息
            processMessage(message);
        }
    }
    
    /**
     * 手动提交偏移量
     */
    @KafkaListener(topics = "manual-topic", groupId = "manual-group",
                   containerFactory = "manualKafkaListenerContainerFactory")
    public void consumeWithManualCommit(
            String message,
            Acknowledgment acknowledgment) {
        try {
            // 处理消息
            processMessage(message);
            // 手动提交偏移量
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("处理消息失败", e);
            // 不提交偏移量，消息会被重新消费
        }
    }
}
```

### 5. 配置类示例

```java
@Configuration
@EnableKafka
public class KafkaConfig {
    
    /**
     * 批量消费容器工厂
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> 
            batchKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setBatchListener(true);  // 启用批量消费
        return factory;
    }
    
    /**
     * 手动提交容器工厂
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String>
            manualKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties().setAckMode(
            ContainerProperties.AckMode.MANUAL_IMMEDIATE);  // 手动提交
        return factory;
    }
    
    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "my-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, 
            StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, 
            StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(props);
    }
}
```

## 常见使用场景

### 1. 事件驱动架构

```java
// 订单创建事件
@Component
public class OrderEventPublisher {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public void publishOrderCreated(OrderDTO order) {
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .amount(order.getAmount())
                .timestamp(LocalDateTime.now())
                .build();
        
        kafkaTemplate.send("order-created-topic", event);
    }
}

// 订单事件消费者
@Component
public class OrderEventConsumer {
    
    @KafkaListener(topics = "order-created-topic", groupId = "order-processor")
    public void handleOrderCreated(OrderCreatedEvent event) {
        // 发送通知
        notificationService.sendOrderConfirmation(event.getUserId());
        
        // 更新库存
        inventoryService.reduceStock(event.getOrderId());
        
        // 记录日志
        logService.recordOrderLog(event);
    }
}
```

### 2. 日志收集

```java
@Component
public class LogCollector {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    public void collectLog(String level, String message, String module) {
        LogMessage logMessage = LogMessage.builder()
                .level(level)
                .message(message)
                .module(module)
                .timestamp(System.currentTimeMillis())
                .build();
        
        kafkaTemplate.send("log-topic", JSON.toJSONString(logMessage));
    }
}
```

### 3. 数据同步

```java
// 用户数据变更同步
@Component
public class UserDataSync {
    
    @KafkaListener(topics = "user-update-topic", groupId = "user-sync")
    public void syncUserData(UserUpdateEvent event) {
        // 同步到缓存
        cacheService.updateUser(event.getUserId(), event.getUserData());
        
        // 同步到搜索引擎
        searchService.indexUser(event.getUserData());
        
        // 同步到数据仓库
        dataWarehouseService.syncUser(event.getUserData());
    }
}
```

## 最佳实践

1. **消息幂等性**：消费者处理消息时要保证幂等，避免重复处理
2. **错误处理**：合理处理消费失败，避免消息丢失
3. **批量处理**：对于高吞吐场景，使用批量消费提高效率
4. **偏移量管理**：根据业务需求选择自动或手动提交偏移量
5. **分区策略**：合理设置分区数和分区 key，保证消息顺序
6. **监控告警**：监控消费延迟、积压情况，及时发现问题
7. **消息压缩**：对于大消息，启用压缩减少网络传输
8. **事务支持**：需要严格一致性时，使用 Kafka 事务 