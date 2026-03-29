---
icon: pen-to-square
date: 2026-03-29
category:
  - Learning Records
tag:
  - Notes
---

# KV Cache

**KV Cache（Key-Value Cache，键值缓存）** 是大模型（Transformer 架构）推理时的核心加速技术，通过缓存历史 token 的 **Key** 和 **Value** 向量，避免重复计算，把自回归生成的时间复杂度从 **O(n²)** 降到 **O(n)**，大幅提速。

### 一、为什么需要 KV Cache？
大模型生成文本是**自回归**的：每生成一个新 token，都要和前面所有 token 重新算一遍注意力（QKV 投影 + Attention）。
- 不缓存：生成第 n 个 token 时，要重新算前 n 个 token 的 K、V → 重复计算、越生成越慢。
- 用 KV Cache：只算新 token 的 Q、K、V，历史 K、V 直接从缓存读 → 只做增量计算。

### 二、核心原理（一句话）
**Key 和 Value 只跟输入 token 本身有关，跟未来 token 无关 → 算过就可以永久缓存、反复复用**。

### 三、工作流程（Prefill + Decode）
#### 1. Prefill 阶段（处理 Prompt）
- 输入完整提示（如“AI 很”）。
- 并行计算所有 token 的 **K、V**，存入缓存。
- 生成第一个输出 token（如“强”）。

#### 2. Decode 阶段（逐 token 生成）
- 只接收上一步生成的 token（如“强”）。
- 计算它的 **Q、K、V**。
- 用 **新 Q + 缓存里所有 K、V** 算注意力。
- 把新 K、V 追加到缓存。
- 生成下一个 token，循环。

### 四、直观对比（生成“AI 很强大”）
| 步骤 | 无 KV Cache | 有 KV Cache |
|---|---|---|
| 生成“AI” | 算“AI”的 Q、K、V | 算“AI”的 Q、K、V → 缓存 K、V |
| 生成“很” | 重算“AI、很”的 K、V | 只算“很”的 Q、K、V → 用缓存“AI”的 K、V |
| 生成“强” | 重算“AI、很、强”的 K、V | 只算“强”的 Q、K、V → 用缓存“AI、很”的 K、V |
| 生成“大” | 重算全部 4 个 token | 只算“大”的 Q、K、V → 用全部缓存 |

### 五、收益与代价
- **收益**：推理速度大幅提升（尤其长文本）、降低延迟、减少计算量。
- **代价**：占用显存（随序列长度线性增长），是“空间换时间”。



