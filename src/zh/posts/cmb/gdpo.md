---
icon: pen-to-square
date: 2026-03-16
category:
  - Learning Records
tag:
  - CMB
---

# GDPO（Group Reward-Decoupled Normalization Policy Optimization）

分组奖励解耦归一化策略优化，由 NVIDIA 等机构2026年提出，是一种用于**多奖励强化学习**的大语言模型优化方法。

## 一、要解决的问题

在基于 **GRPO**（Group Relative Policy Optimization）做多奖励 RL 时，通常会把多个奖励先相加再归一化。这样会导致**奖励信号坍缩**：不同的奖励组合被压成几乎相同的 advantage 值，训练信号分辨率下降，容易收敛差甚至训练失败。

## 二、核心思路

GDPO 的做法是**解耦各奖励的归一化**，而不是先求和再归一化：

- 对每个奖励分别做**分组归一化**
- 再做 batch 维度的 advantage 归一化，保持数值稳定
- 保留不同奖励组合之间的相对差异，避免被压成同一档

这样不同奖励组合会对应不同的 advantage 组，多目标优化时学习信号更清晰。

## 三、适用场景

- 同时优化多个目标：如工具调用、数学推理、代码推理
- 同时考虑正确性（准确率、bug 率）和约束（格式、长度等）
- 需要替代 GRPO 时，GDPO 可作为 drop-in 替换，只需少量代码改动（如 Hugging Face TRL、verl 等）

## 总结

GDPO 通过解耦多奖励的归一化，缓解多奖励 RL 中的奖励坍缩问题，使 LLM 在多目标下训练更稳定、效果更好。
