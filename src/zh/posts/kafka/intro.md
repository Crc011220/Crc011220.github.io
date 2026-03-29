---
icon: pen-to-square
date: 2026-03-28
category:
  - Learning Records
tag:
  - Notes
---

# Apache Kafka 系统性入门

Kafka 是分布式**流处理与事件日志**平台，被广泛用于实时数据管道、微服务解耦与流式分析。下面按学习顺序组织笔记，可从上到下逐章阅读。

## 一、Kafka 是什么、解决什么问题

### 定位

- **本质**：分布式、可水平扩展的**发布-订阅**消息系统 + **持久化日志**（append-only log）
- **特点**：高吞吐、可回放、多消费者并行消费同一数据、数据可持久化在磁盘

### 典型场景

| 场景 | 说明 |
|------|------|
| **异步解耦** | 服务 A 写事件，服务 B/C/D 各自订阅，互不直接依赖 |
| **削峰填谷** | 瞬间流量写入 Kafka，下游按能力消费 |
| **日志/埋点汇聚** | 多端数据统一写入，再落数仓或实时计算 |
| **事件溯源 / CQRS** | 以事件流为事实来源，重建读模型 |

### 与「传统 MQ」的直觉区别

- **RabbitMQ 等**：偏队列语义，消息常被消费后即确认删除（可配置）
- **Kafka**：偏**日志**：消息按主题持久化一段时间（或按策略清理），同一数据可被多组消费者各消费一遍，并可按 offset **重放**

---

## 二、核心概念（必背）

### 1. Broker、Cluster

- **Broker**：Kafka 集群里的**一台服务器进程**，负责存数据、处理读写请求
- **Cluster**：多个 Broker 组成集群，对外提供统一服务

### 2. Topic 与 Partition

- **Topic**：逻辑上的消息类别（如 `orders`、`user-events`）
- **Partition**：Topic 的**物理分片**，一个 Topic 可多个 Partition
  - 消息在**单个 Partition 内有序**（按写入顺序）
  - 跨 Partition **无序**（除非业务自己做分区键保证顺序）

**为何分区**：并行写入、并行消费、扩容吞吐。

### 3. Producer

- 向 Topic（指定 Partition 或由分区策略决定）**追加**消息
- 可设置 **key**：相同 key 通常落同一 Partition（保证该 key 下有序）

### 4. Consumer 与 Consumer Group

- **Consumer**：从 Topic 拉取消息的程序
- **Consumer Group**：一组 Consumer **协同消费**同一 Topic
  - 同一 Group 内：**每条消息只会被组内一个 Consumer 处理**（负载均衡）
  - **不同 Group**：彼此独立进度，同一条消息可被多个 Group 各消费一次

### 5. Offset

- **Offset**：消息在 Partition 中的**递增序号**（逻辑位移）
- Consumer 提交**消费位移**（commit），崩溃恢复后从上次位置继续消费

---

## 三、架构鸟瞰

```
Producer --> Topic(Partition 0,1,...) --> Consumer / Consumer Group
              |
              +--> 多副本 Replica（Leader + Follower）
```

- 每个 Partition 在集群中有**一个 Leader**，读写经 Leader；Follower 做副本同步
- **Controller**：集群元数据与分区 Leader 选举等（随 Kafka 版本演进，细节可查官方文档）

---

## 四、副本与高可用（简述）

- **Replication**：Partition 有多个副本，分布在不同 Broker，防单点故障
- **ISR**（In-Sync Replicas）：与 Leader 同步跟得上的副本集合
- **Leader 选举**：Leader 挂了，通常从 ISR 里选新 Leader（保证尽量不丢已「提交」规则的最小语义）

深入时可再学：`acks`、`min.insync.replicas`、幂等与事务。

---

## 五、交付语义（必须心里有数）

| 语义 | 含义 | 代价 |
|------|------|------|
| **At-most-once** | 可能丢消息，不重复 | 实现简单 |
| **At-least-once** | 可能重复，尽量不丢 | 常见默认倾向 |
| **Exactly-once** | 不丢且不重复（在限定条件下） | 需要事务 / 幂等 + 协调 |

Kafka 可通过 Producer 确认、Consumer 提交时机、**幂等 Producer**、**事务**等在业务允许范围内逼近 exactly-once。

---

## 六、与常见系统对比（入门用）

| 系统 | 侧重 |
|------|------|
| **RabbitMQ** | 路由灵活、传统队列、低延迟小消息 |
| **Kafka** | 高吞吐日志、持久化、多订阅、回放 |
| **Pulsar** | 存储计算分层、多租户等（另一类架构选型） |

选型要看：是否要**大量持久 + 多消费者 + 回放**，以及团队运维与生态。

---

## 七、推荐学习路径（系统练完）

1. **本地或用 Docker 起单节点 / 小集群**，用命令行或脚本 `kafka-console-producer/consumer` 收发消息  
2. **画图**：Topic、Partition、Group、Offset 在你业务里怎么对应  
3. **实验**：同 Topic、两个 Consumer Group 是否都能消费全量；同一 Group 扩容 Consumer 是否分区重平衡  
4. **读配置**：`retention`、`compression`、`acks`、消费 `auto.offset.reset`  
5. **进阶**：副本与 ISR、再均衡、监控指标（lag、吞吐）、**Kafka Connect**、**Kafka Streams** / 外接 Flink  
6. **官方文档**：[https://kafka.apache.org/documentation/](https://kafka.apache.org/documentation/)

---

## 八、术语速查表

| 术语 | 一句话 |
|------|--------|
| Topic | 消息主题 / 逻辑分类 |
| Partition | 分片，单分区内有序 |
| Broker | Kafka 节点 |
| Producer / Consumer | 生产 / 消费客户端 |
| Consumer Group | 协同消费的一组消费者 |
| Offset | 分区内的消费位点 |
| Leader / Follower | 分区主的副本与从副本 |
| ISR | 与 Leader 同步正常的副本集合 |
| Rebalance | Consumer Group 成员或分区分配变化时的再分配 |


