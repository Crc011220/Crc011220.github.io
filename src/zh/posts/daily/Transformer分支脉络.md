---
icon: pen-to-square
date: 2026-10-03
category:
  - Learning Records
tag: 
  - Notes
---

# Transformer分支脉络

- **架构分支起源**：2017 年谷歌发布 Transformer，用自注意力机制解决传统 RNN 训练循环依赖、效率低下的问题，后续衍生出 Encoder-Only 的 BERT、Encoder-Decoder 的 T5、Decoder-Only 的 GPT 三大技术分支。
    
- **各分支核心贡献**：BERT 验证预训练加微调范式的可行性，大幅降低下游任务训练成本；T5 统一所有 NLP 任务的文本输入输出格式，公开大规模语料库 C4，为后续提示词工程打下基础。
    
- **GPT 路线探索**：OpenAI 先后推出 GPT1 到 GPT3 系列，提出缩放定律、上下文学习等核心结论，证明无需微调仅靠提示词即可完成不同任务，大幅降低任务切换成本。
    
- **胜出核心逻辑**：Decoder-Only 架构训练样本构造简单，训练与推理目标完全一致，结构精简便于参数堆叠和工程落地，规模扩大后效果随算力投入稳定提升，最终成为通用大模型的主流选择。