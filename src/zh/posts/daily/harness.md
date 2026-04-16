---
icon: pen-to-square
date: 2026-04-16
category:
  - Learning Records
tag:
  - Notes
---

# Harness 该做大还是缩小？

行业内部也似乎正在形成一种新的共识：决定 AI 编程上限的，不再是模型本身的单次生成能力，而是 Harness Engineering。

在 Anthropic 最近的工程文章展示了他们对 Long-running Agent（长时运行智能体）的深度探索。为了解决 AI 在长时间任务中“脱轨”的问题，他们构建了一套极其严密的 Harness：

- 结构化交接（Structured Handoff）：强制 AI 在上下文耗尽前生成“进度文件”，将状态外置。
- 多智能体协作：引入 Planner（规划器）、Generator（生成器）、Evaluator（评估器）分工。
- 上下文重置机制：为了避免“上下文焦虑”，直接清空对话历史，仅保留结构化产物，给新智能体一张“白板”。

这种思路的本质是“把 Harness 做强、做厚”。他们认为，只要框架足够健壮，就能撑起最复杂的任务。

但近日，OpenAI Codex 开源负责人 Michael Bolin 做客了一档访谈栏目，释放出了与 Anthropic 把 Harness 做厚做强相反的信号。

这场对话围绕“AI 编码时代，真正改变软件开发范式的究竟是‘大模型本身’，还是围绕模型构建的 harness？”这一话题展开。

在访谈中，Michael 认为，Harness 不应该无限膨胀。

Michael 根据 Codex 的构建理念阐述了一个他们看到的重要趋势：理想状态下，harness 应该“尽可能小”，而模型应“尽可能强”。Codex 的设计理念就是减少工具数量、避免过度干预，让模型在更接近真实计算环境（如终端）的空间中自主探索解决路径。这种“AGI 导向”的思路，本质上是在减少人为规则对模型的束缚，把更多决策权交还给模型本身。但 Michael 也提到，在这一过程中，安全（security）和隔离（sandboxing）成为不可妥协的底线，也是 harness 不可替代的核心职责。

Codex 的理念更倾向于“把 Harness 做薄、做轻”，具体表现在以下几点：

- 最小化工具依赖：甚至刻意减少专用工具，转而让模型直接使用通用的终端（Terminal）。
- 环境而非框架：Harness 仅提供必要的沙箱（Sandbox）安全环境和基础接口，不做过多的流程控制。
- 能力回归模型：探索、决策和执行的逻辑，尽量交给模型自身去学习，而不是由外部的编排框架硬编码。