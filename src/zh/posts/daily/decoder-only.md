---
icon: pen-to-square
date: 2026-03-29
category:
  - Learning Records
tag:
  - Notes
---

# Decoder-Only
这是一个非常核心的架构问题。
现在主流大模型（Llama、GPT、Qwen、Mistral 等）几乎全是 **Decoder-only（仅解码器）**，不是偶然，而是**效果、训练、推理、工程**全方位碾压后的结果。

一句话总结：
**Decoder-only 在语言建模上最顺手、 scaling 能力最强、推理最简单，所以成了绝对主流。**

---

# 先快速复习三种架构
1. **Encoder-only（仅编码器）**
   - 代表：BERT、RoBERTa
   - 任务：**理解类**（分类、抽取、匹配）
   - 特点：能看全文，但**不会生成文本**

2. **Encoder-Decoder（编码器-解码器）**
   - 代表：T5、BART
   - 任务：**翻译、摘要**等经典 seq2seq
   - 特点：结构对称，适合有明确输入→输出的任务

3. **Decoder-only（仅解码器）**
   - 代表：GPT、Llama、所有现代大模型
   - 任务：**文本生成、对话、续写、思考**
   - 特点：单向自回归，天生会“说话”

---

# 为什么现在都选 Decoder-only？
## 1. 语言的本质就是“从左到右生成”，Decoder-only 天生适配
语言是**顺序、因果**的：
前面的字决定后面的字，后面的字不能反过来决定前面的。

Decoder-only 做的就是：
**给定前文，预测下一个词 → 完美匹配自然语言生成**

而：
- Encoder 是**双向注意力**，适合理解，但不适合生成
- Encoder-Decoder 适合翻译，但对通用续写、对话不自然

所以 Decoder-only **天生就是为大语言模型设计的结构**。

---

## 2. 训练目标最简单：Next Token Prediction（预测下一个词）
Decoder-only 只用一个极其简单的目标：
**给定前面所有 token，预测下一个 token**

优点：
- 目标统一，**scale 能力极强**（越大越强）
- 不需要成对数据，**随便抓一堆文本就能训**
- 不需要复杂任务设计，无脑堆数据就行

这是 GPT 系列能一路从 1B→70B→400B 还能持续涨点的核心原因。

---

## 3. 推理超级简单，天然支持 KV Cache
Decoder-only 是**自回归生成**：
生成一个 token → 缓存 KV → 继续生成下一个

完美适配：
- KV Cache
- Paged Attention
- Flash Attention
- 流式输出（streaming）

推理速度、显存、工程实现都极其友好。

Encoder-Decoder 要维护两套 KV Cache，复杂很多。

---

## 4. 通用能力碾压：一个模型干所有事
Decoder-only 不需要区分任务类型：
- 续写
- 对话
- 翻译
- 摘要
- 代码
- 推理思考
- 工具调用

**全部用自然语言指令（prompt）搞定**

Encoder-Decoder 更适合固定任务，很难做到通用 AGI。

---

## 5. 经验证明：Decoder-only  scaling 最强
OpenAI、Meta、Google 无数实验共同结论：
**在超大参数量+超大文本语料下，Decoder-only 性能 > Encoder-Decoder**

它的表达能力、泛化能力、涌现能力（思维链、推理）都是最强。

---

## 6. 工程生态完全成熟
现在所有优化都是围绕 Decoder-only 做的：
- KV Cache
- Paged Attention
- vLLM
- TensorRT-LLM
- FP8/INT4 量化
- 连续批处理
- 长上下文扩展

你用别的架构，连轮子都没有。

---

# 那为什么不全都用 Decoder-only？
有两种情况依然不用：

1. **只做理解任务（分类、NER、检索）**
   → Encoder-only（BERT 系）更快更小更准

2. **极度对称的任务（机器翻译）**
   → Encoder-Decoder 仍有优势

但**通用大模型 = 必须能生成、能思考、能对话**
这就注定了 Decoder-only 是唯一选择。

---

# 总结
- **想“理解”** → Encoder-only
- **想“翻译”** → Encoder-Decoder
- **想“像人一样说话、思考、通用”** → **Decoder-only**

现代大模型的目标是通用智能，不是单一任务，
所以**全部变成 Decoder-only**。
