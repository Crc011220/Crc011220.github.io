---
icon: pen-to-square
date: 2026-03-29
category:
  - Learning Records
tag:
  - Notes
---

# Model Optimization

**KV Cache、Paged Attention、Flash Attention** 不是互斥的，而是**层层递进、互相配合**的大模型推理三件套。

# 一句话总览
- **KV Cache**：基础加速，缓存历史 KV，避免重复计算
- **Paged Attention**：显存管理，把 KV Cache 分页，解决显存碎片、超长文本问题
- **Flash Attention**：计算优化，把 Attention 计算重写，更快、更省显存

下面是详细对比。

---

# 1. KV Cache
**作用：推理提速的基础**
- 只算新 token 的 Q，历史 KV 直接复用
- 把 O(n²) 变成近似 O(n)
- 所有现代大模型推理都必开

**优点**
- 速度提升巨大
- 实现简单
- 几乎无副作用

**缺点**
- 占显存（序列越长越占）
- 显存使用连续、容易碎片
- 无法处理超长文本（比如 100k+）

**适用场景**
- 所有 LLM 推理
- 短文本、普通对话

---

# 2. Paged Attention
**作用：管理 KV Cache 的显存，解决“爆显存、碎片、长文本”**
来自 vLLM，核心思想：
**把 KV Cache 像操作系统内存一样分页（paging）**

- 不要求连续显存
- 显存利用率接近 100%
- 支持超长上下文（100k、200k）
- 支持高并发批量推理

**优点**
- 显存利用率极高
- 支持超长文本
- 高并发下吞吐量暴增

**缺点**
- 只优化显存，不优化计算速度
- 依赖框架实现（vLLM、TGI、TensorRT-LLM）

**适用场景**
- 高并发服务
- 超长上下文
- 生产环境部署
- vLLM 核心就是它

---

# 3. Flash Attention
**作用：重写 Attention 计算，让计算本身更快、更省显存**
核心：
**不把巨大的 Attention 矩阵写到显存，而是分块计算，只在 SRAM 里算**

- 大幅降低显存占用
- 速度明显提升
- 训练 & 推理都能用

**优点**
- 计算更快
- 显存更省
- 训练推理通用

**缺点**
- 只优化计算，不解决 KV 显存碎片化
- 对超长文本效果有限

**适用场景**
- 单卡推理加速
- 模型训练
- 需要低延迟的场景

---

# 终极对比表（最关键）
|  | KV Cache | Paged Attention | Flash Attention |
| --- | --- | --- | --- |
| **解决什么问题** | 重复计算 | KV显存碎片、长文本、并发 | Attention计算慢、耗显存 |
| **本质** | 缓存复用 | 显存分页管理 | 计算算子优化 |
| **速度提升** | ⭐⭐⭐⭐ | ⭐⭐（高并发才明显） | ⭐⭐⭐⭐ |
| **显存节省** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **训练可用** | ❌ | ❌ | ✅ |
| **推理必用** | ✅ | ✅（生产） | ✅ |
| **代表框架** | 所有LLM | vLLM | Transformers、AOT、TensorRT |

---

# 它们之间的关系（最重要）
**不是三选一，而是一起用！**

现代推理引擎真实工作流：
1. **KV Cache** 存历史 token → 基础加速
2. **Paged Attention** 管理这些 KV → 省显存、支持长文本
3. **Flash Attention** 负责快速计算 Attention → 更快

也就是：
> + Flash Attention（算得快）
> + KV Cache（不用重算）
> + Paged Attention（显存不乱）
> = 现代高性能大模型推理**

---

# 最简单记忆法
- 想**快一点** → KV Cache
- 想**显存不爆、支持长文本、多用户并发** → Paged Attention
- 想**计算本身更快更省显存** → Flash Attention
- 生产环境**全都要**
