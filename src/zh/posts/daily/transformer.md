---
icon: pen-to-square
date: 2026-02-15
category:
  - Learning Records
tag:
  - Notes
---

# Transformer 复习

Transformer 出自 2017 年论文《Attention is All You Need》，用**纯注意力机制**替代 RNN/CNN，成为大模型（GPT、BERT、LLaMA 等）的基础架构。

## 一、整体结构

Transformer 由 **Encoder** 和 **Decoder** 两部分组成：

```
输入序列 → [Encoder × N] → 编码表示
                           ↓
目标序列 → [Decoder × N] → 输出序列
```

- **Encoder**：理解输入，输出上下文表示（如 BERT 只用 Encoder）
- **Decoder**：自回归生成，每步依赖已生成内容（如 GPT 只用 Decoder）
- **Encoder-Decoder**：机器翻译等 seq2seq 任务（原始论文设计）

## 二、核心：Self-Attention 自注意力

### 1. 直觉

自注意力让序列中每个位置都能「看到」其他所有位置，并学习**该关注谁**。例如「The animal didn't cross the street because it was too tired」中，「it」应更关注「animal」而非「street」。

### 2. Q、K、V

每个词通过三个线性变换得到三个向量：

| 符号 | 含义 | 作用 |
|------|------|------|
| **Q**（Query） | 查询 | 「我在找什么」 |
| **K**（Key） | 键 | 「我有什么可被匹配」 |
| **V**（Value） | 值 | 「匹配后要取出的内容」 |

```
Q = X · W_Q    K = X · W_K    V = X · W_V
```

### 3. Scaled Dot-Product Attention

```
Attention(Q, K, V) = softmax(QK^T / √d_k) · V
```

- **QK^T**：计算每个位置对其它位置的相似度（分数）
- **√d_k**：缩放因子，避免点积过大导致 softmax 梯度消失
- **softmax**：归一化为权重
- **· V**：按权重加权求和，得到每个位置的输出

### 4. Multi-Head Attention 多头注意力

把 Q、K、V 拆成多组，每组独立做注意力，最后拼接：

```
MultiHead(Q,K,V) = Concat(head_1, ..., head_h) · W_O
其中 head_i = Attention(Q·W_Qi, K·W_Ki, V·W_Vi)
```

- **作用**：不同头可关注不同关系（语法、指代、语义等）
- **典型配置**：8 头或 16 头，d_model=512 时每头 d_k=64

## 三、Positional Encoding 位置编码

Self-Attention 本身**不感知顺序**（打乱输入顺序，注意力分数不变），因此需要显式注入位置信息。

### 正弦/余弦编码（原论文）

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

- 每个维度用不同频率的正弦/余弦
- 无需学习，可外推到更长序列

### 可学习位置编码

- 将位置编码作为可学习参数（如 BERT）
- 更灵活，但长度固定，超出需扩展

## 四、Encoder 结构

每个 Encoder 层包含两个子层：

1. **Multi-Head Self-Attention** + 残差 + Layer Norm
2. **Position-wise Feed-Forward Network（FFN）** + 残差 + Layer Norm

```
FFN(x) = ReLU(x·W_1 + b_1)·W_2 + b_2
```

- FFN 对每个位置独立做两次线性变换，中间用 ReLU
- 典型维度：d_model=512 → d_ff=2048 → d_model=512

## 五、Decoder 结构

每个 Decoder 层包含三个子层：

1. **Masked Self-Attention**：只能看到当前及之前位置（因果掩码）
2. **Cross-Attention**：Query 来自 Decoder，K/V 来自 Encoder 输出
3. **FFN**：与 Encoder 相同

**Masked Self-Attention**：在训练时防止「偷看」未来词，通过将未来位置的注意力分数设为 -∞，softmax 后为 0。

## 六、关键设计总结

| 组件 | 作用 |
|------|------|
| Self-Attention | 序列内全局依赖，并行计算 |
| Multi-Head | 多视角建模不同关系 |
| Positional Encoding | 注入顺序信息 |
| 残差 + Layer Norm | 稳定训练、加速收敛 |
| FFN | 增加非线性与表达能力 |

## 七、变体与衍生

- **BERT**：仅 Encoder，双向上下文，适合理解类任务
- **GPT**：仅 Decoder，因果注意力，适合生成类任务
- **T5**：完整 Encoder-Decoder，统一为「文本到文本」
- **LLaMA、Qwen 等**：Decoder-only + 各种改进（RoPE、SwiGLU 等）

## 八、与 RNN 的对比

| 维度 | RNN/LSTM | Transformer |
|------|----------|-------------|
| 并行性 | 按时间步串行 | 全序列并行 |
| 长程依赖 | 易梯度消失/爆炸 | 注意力直接建模 |
| 计算复杂度 | O(n) | O(n²)（序列长度平方） |
| 位置信息 | 隐式（顺序处理） | 显式（位置编码） |

Transformer 用 O(n²) 的注意力换来了并行与长程建模能力，成为大模型时代的主流架构。
