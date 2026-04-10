---
icon: pen-to-square
date: 2026-04-10
category:
  - Learning Records
tag:
  - Notes
---

# Claude Code 学习笔记（综合版）

> **用途**：面向分享与复习；工程细节来自本人笔记、公开技术文章与社区对客户端泄露的讨论，**非官方文档或法律结论**，产品行为与路线图以 Anthropic 官方为准。  
> **来源整合**：[CC-ContextManagement](./CC-ContextManagement.md)、[ClaudeCode](./ClaudeCode.md)、[LearnCC](../../../posts/ai/LearnCC.md)、[Learn Claude Code](https://learn.shareai.run/) 课程大纲，以及文末「延伸阅读」中的公开报道与官方文档链接。

---

## 背景：近期热议的 Claude Code 客户端源码泄露

近月在开发者社区里，**Claude Code 的 npm 包误带 Source Map** 一事讨论度很高：任何人从公开 registry 下载包即可配合 map 还原大量 TypeScript 源码，相当于把终端版产品的**客户端实现**摊在了聚光灯下。下文里出现的「从泄露代码读到的架构」「约 xx 万行」等，都指这一事件带来的**可公开获取的客户端侧信息**，不是官方发布的设计文档。

据多篇公开报道（如 [NodeSource 对发布链的分析](https://www.nodesource.com/blog/anthropic-claude-code-source-leak-bun-bug)、[TeqStars 等媒体的梳理](https://teqstars.com/blog/news-6/claude-code-leak-march-31-2026-what-broke-the-internet-for-ai-builders-13)），**2026 年 3 月 31 日前后**有安全研究员注意到 **v2.1.88** 包内存在体积约 **60MB** 量级的 `cli.js.map` 一类文件；细节以各报道原文为准。事件在 GitHub、X、Reddit、HN 等平台上被迅速转发与镜像讨论——**影响主要是「源码可读」与舆论关注**，不等同于服务端或用户数据被入侵（见下表「未泄露」）。

### 泄露原因（工程视角）

Claude Code 通过 **npm** 分发。正常发布流程里，代码会压缩混淆；开发阶段为排错会生成 **Source Map**（`.map`，把打包结果映射回源码），**上线包中本应删除**。

**2.1.88 版本**：打包使用 **Bun** 时生成了 Source Map，且发布侧**未有效排除** `*.map`（例如 [NodeSource](https://www.nodesource.com/blog/anthropic-claude-code-source-leak-bun-bug) 提到 `.npmignore` 未屏蔽 map、并与 **Bun 在部分配置下仍生成 map** 的行为有关——具体 issue 编号以 Bun 仓库为准）。约 **59.8MB～60MB** 的 map（含 `sources` 路径与 `sourcesContent` 里的源码片段）进入公开包。社区亦提到 Anthropic 侧此前曾发生过**同类失误**，属于**供应链与发布检查**上的重复疏漏。

### 公开报道中常见的「未泄露」清单（用于校准预期）

下列条目在多篇报道中反复出现，**利于区分「客户端源码可见」与「后端/模型安全」**；仍以 Anthropic 正式声明为准。

| 通常强调**未**包含 | 说明 |
|-------------------|------|
| 模型权重与训练细节 | 泄露讨论集中在 **CLI 客户端** |
| 用户对话内容、客户凭据 | 与「包内多了 map」是两类风险 |
| 证据表明被外部入侵 | 公开叙事多归为**发布流程失误** |

### 泄露内容大致范围

| 维度 | 说明 |
|------|------|
| **范围** | **客户端**源码量级：约 **1900+** 个 TypeScript 文件、约 **51 万行** |
| **涵盖** | Agent 循环引擎、**40+** 内置工具、系统提示词组装、记忆与上下文压缩、权限与实验开关、部分未上线功能等 |
| **不含** | 服务端模型训练、API 网关与后端核心业务逻辑 |
| **技术栈** | 终端 UI 大量使用 **React Ink**（用 React 写 TUI） |

### 和本笔记的关系

这次泄露**不改变** Claude Code 作为产品的使用方式，但让外人能对照真实代码讨论：**Agent 循环、工具注册、Prompt Cache 切分、多层上下文压缩、记忆文件策略**等是怎么落地的。本笔记后半部分的技术归纳，不少即来自这类**客户端逆向阅读 + 社区梳理**；若需合规、安全或官方口径，**仍以 Anthropic 为准**。

---

## 一、为什么要学这套东西

[Learn Claude Code](https://learn.shareai.run/) 把内容分成 **4 个阶段、19 章**：从「最小 Agent 循环」到「多 Agent 平台 + 外部能力总线」。核心信息是：**智能体产品 = 可控的循环 + 工具 + 上下文工程 + 安全与持久化**，而不是单靠模型本身。

与更广义的 **ReAct**（推理—行动交替）、**Code Agent**（终端/IDE 里读写仓库）范式一致：Claude Code 是其中一个**工程化程度很高**的实例——价值在于把「能 demo 的脚本」做成「能长期跑、能控成本、能接权限与扩展」的产品。

---

## 二、最小核心：Agent 循环与工具

### 2.1 循环本质

- **每个 Agent 本质上是一个 `while` 循环**：发消息 → 模型可能返回 `tool_use` → 执行工具 → 把结果写回对话 → 直到任务结束（模型不再要工具或显式停止）。这与 **ReAct**「想一步、动一步、看结果再决定」同构，只是工具从「搜索/API」换成了 **Bash / Read / Write / Grep** 等仓库级能力。
- **流式优先**：公开架构解读里常提到 **SSE** 一类流式响应——UI 可边收 token 边渲染，并在流未完成前就可能触发工具执行与下一轮规划（详见社区文章如 [dev.to 上的架构导读](https://dev.to/oldeucryptoboi/inside-claude-codes-architecture-the-agentic-loop-that-codes-for-you-cmk)）。
- **通信侧**：**token 统计**用于触发压缩、计费与上限保护；与下文「自动压缩阈值」直接相关。

### 2.2 工具设计（One Handler Per Tool）

- **一个工具名对应一个处理函数**；循环代码保持稳定，扩展能力主要靠**增删工具注册表**（例如集中在一个 `tools.ts` 类文件里）。
- **工具很多时**：可先暴露「名称 + 一句话摘要」，按需再加载完整定义（**Tool Search** 思路），省 token。
- **参数**：常用 schema（如 Zod）校验模型输出的 JSON；**大输出**可进外部存储，模型只拿引用或按需取回。
- **并发与安全**：常见策略是**读写分离**——只读可并发，写入需等前置完成；未声明并发安全则偏保守（fail-closed）。工具数量在不同统计口径下从「**约 58**」到「**80+**」都有人说（取决于是否含实验工具、是否把 MCP 动态工具单算）；**核心读写与检索**通常包括 `Read` / `Write` / `Edit` / `Glob` / `Grep` / `Bash` 等，与 [社区架构向文章](https://dev.to/oldeucryptoboi/inside-claude-codes-architecture-the-agentic-loop-that-codes-for-you-cmk) 的描述一致。
- **元工具**：多篇解读提到 **`AgentTool`（或同类命名）**——由主会话**拉起子会话**执行子任务并回收摘要，相当于把「子 Agent」做成一等公民工具（细节以代码/官方为准）。
- **MCP**：外部能力通过 **Model Context Protocol** 与内置工具走同一套调用与结果回写路径，便于统一权限与审计。

### 2.3 计划再行动（Plan Before Act）

- **没有计划的 Agent 容易飘**；先列步骤再执行。
- **Todo / 任务列表**让「计划」对模型可见（例如全部先标为 pending），复杂任务更稳。

---

## 三、子 Agent、技能与记忆

### 3.1 Subagent（子代理）

- **子代理用独立消息流**，主要价值是**上下文边界**：主对话保持干净；子代理侧上下文用后可丢弃。
- 工程上还会用 **`query source` 等机制**隔离主线程与子 agent，避免压缩/清理误伤。

### 3.2 Skills（技能）

- **知识按需注入**：通过 `tool_result` 等在需要时再加载，而不是一次性塞进超长 system prompt。
- 与「工具搜索 / 按需发现」同一套省 token 哲学。

### 3.3 记忆系统（三层思路）

| 层级 | 典型载体 | 要点 |
|------|-----------|------|
| 指针层 | `memory.md` 等 | 每轮加载、体量有上限（例如量级上约百行/数十 KB）；偏索引与指针 |
| 专题层 | 话题/项目文件 | 编码约定、踩坑等；**一般不长期存整段源码**（避免漂移误导） |
| 历史检索 | 特定格式 + 搜索 | 产品讨论中常见 **Grep 检索** 记忆与历史，而非强依赖向量 RAG |

站点上的表述可记一句：**Memory gives direction; current observation gives truth**（记忆给方向，当前观察给事实）。

### 3.4 多 Agent 与编排（社区解读摘要）

下列内容多来自**技术博客与泄露代码的二次解读**，可能随版本变化，**不宜当作产品承诺**：

- **子任务与模型路由**：子代理或子任务上，社区提到会为不同用途选择不同模型档位（例如轻量检索 vs 重推理），以平衡成本与质量。
- **进程级协作**：有文章描述「队友」以**独立进程 + 基于文件系统的 mailbox / 看板**通信，而非所有协作都走云端 API 消息（见 [多 Agent 架构讨论](https://dev.to/klement_gunndu/inside-claude-codes-hidden-multi-agent-architecture-ne4)）。这与本笔记第六节「任务管什么、worktree 管哪里」可以对照着读。
- **Feature flag**：公开报道曾提到包内可见大量**实验开关**名称，对应未发布或灰度能力——听听就好，以实际上线为准。

---

## 四、上下文压缩：两套表述如何对齐

教学站与泄露分析里的「层数」不完全一致，可理解为**同一问题的不同粒度**。

### 4.1 教学版（Learn / LearnCC）：三层压缩

每轮大致逻辑：

1. **Layer 1 — micro_compact（微压缩）**  
   在每次调模型前，把**较旧的工具结果**换成占位（例如 `[Previous: used {tool_name}]`），控制静默、高频发生。

2. **Layer 2 — auto_compact（自动压缩）**  
   token 超阈值时：可把完整 transcript 落盘（如 `.transcripts/`），再让模型摘要，用摘要替换当前消息列表。

3. **Layer 3 — 显式 compact 工具**  
   用户/模型主动触发，与 auto 同类摘要逻辑，**按需**再来一轮。

伪代码骨架（教学向）：

```python
def agent_loop(messages: list):
    while True:
        micro_compact(messages)
        if estimate_tokens(messages) > THRESHOLD:
            messages[:] = auto_compact(messages)
        response = client.messages.create(...)
        # ... 执行工具，写回 messages ...
```

### 4.2 工程深挖版（CC-ContextManagement）：四层 + 自动策略

更贴近「生产踩坑」的实现要点：

1. **微压缩（Micro Compact）**  
   - **纯规则**、不调模型；按**工具类型白名单**只保留最近 n 条工具结果。  
   - 与 **Prompt Cache** 配合：分 **cache micro compact**（服务端删工具结果、尽量保前缀缓存）与 **time-based**（用户离开久则直接改消息为占位符）。

2. **会话记忆压缩（Session Memory）**  
   - **不做整段对话摘要**，而是抽**结构化事实**写入本地记忆目录，用 `memory.md` 等替代「超长摘要」。  
   - 有 token 上下限与消息边界规则：**不能拆开 tool_use / tool_result 成对消息**；含 thinking block 时不能截断半段。

3. **完整压缩（Full Compact）**  
   - 前两层不够时**调用模型**；prompt 常按多维度归纳；可用 **analysis + summary**，展示时剥掉 analysis。  
   - 压缩请求本身过长时：按 API 轮次丢弃最早段落，**最多重试有限次数**。  
   - 压缩后可能要**清空文件读取缓存**并重新注入 plan、skill、MCP、agent 列表等。

4. **自动触发**  
   - 每次模型调用后看 token；接近窗口上限减缓冲即触发；**先试会话记忆，再完整压缩**。  
   - **熔断**：连续失败超过约 **3** 次停止重试（避免无效 API 调用风暴）。  
   - 特定 **query source**（如 session memory、compact 自身）可能排除自动压缩，防止死锁。  
   - 另有 **Snip compact** 等更轻的中间手段：从对话里剪掉某段以腾 token。

**统一原则**：上下文是稀缺资源——**「这个 token 是否值得留在上下文里？」** 管理得当可在**数小时级**会话保持连贯；管理不当则浪费 API 且伤质量。

### 4.3 与「五级压缩」说法的关系

[ClaudeCode](./ClaudeCode.md) 中还列了从轻到重的五级（剪裁 → 微压缩 → 折叠 → 自动压缩 → 应急/413 等）。可与上面两层表述**叠加理解**：前面是**产品化分层命名**，这里是**更细的工程阶梯**。

---

## 五、System Prompt 与缓存

- 模型输入常是**流水线拼装**，不是单一静态巨字符串：系统说明、工具定义、用户与仓库上下文、当轮消息等往往分块注入；站点 [Learn CC](https://learn.shareai.run/) 也强调 **「模型看到的是一条构造好的输入管线」**。
- **Anthropic Prompt Caching**（官方文档：[Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)）通过可缓存前缀降低重复前缀的成本与延迟；请求里对块标注 `cache_control`（如 `ephemeral`）以声明断点。
- **与工具联用时**：官方文档说明缓存沿前缀层次生效，**`tools` → `system` → `messages`** 一类层级下，**某一层变化会使该层及之后的缓存失效**；例如修改工具定义会整段失效，切换 `tool_choice`、并行工具开关等则主要影响 `messages` 等（见 [Tool use with prompt caching](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/tool-use-with-prompt-caching) 中的表格）。这与 CC 里「静态系统提示与工具清单尽量稳定、动态状态慎混进可缓存前缀」的工程动机一致。
- **Tool Search / 延迟加载**：官方文档还提到 **tool search** 发现的工具以 `tool_reference` 形式追加进对话，**不破坏**已缓存的前缀；**defer_loading** 与「少量常驻工具 + 按需发现」组合，正是 CC 类产品在 **Token 成本** 与 **缓存命中** 之间的常见打法（同上页）。
- **产品内实践**：用「静态 / 动态」边界切分——**静态**（通用指令、稳定工具定义）更易命中共享缓存；**动态**（当前时间、Git 状态、`CLAUDE.md`、当轮文件内容）若误混入静态缓存块，会导致**缓存命中率骤降**。

---

## 六、任务系统与多 Agent（站点进阶主题）

来自课程大纲与 LearnCC 的合并要点：

- **Task System**：基于磁盘的**任务图**（顺序、并行、依赖），比「仅会话内 Todo」更耐久；**可跨压缩存活**。
- **Background / Cron**：背景执行与定时器被描述为**同一条 Agent 循环上的不同喂入方式**，而不是另一套完全独立的大脑。
- **Teams + Mailboxes**：Leader–Worker；**邮箱/持久通道**做协调；**Scan board, claim tasks**：自主认领任务。
- **Worktree 隔离**：**任务管「做什么」、worktree 管「在哪做」**，按目录隔离。
- **MCP & Plugin**：外部能力与原生工具走**同一路由、权限与结果回写**。

---

## 七、安全与工程常识

- **权限**：更像**流水线**（拒绝、检查模式、允许、再询问），而不是单一布尔开关；社区文章常提到**多种权限模式**与「执行前可修改/拦截」的管线设计（参见 [架构向讨论](https://dev.to/oldeucryptoboi/inside-claude-codes-architecture-the-agentic-loop-that-codes-for-you-cmk)）。  
- **Hook**：循环拥有控制流；hook 在命名时刻**观察、阻断或标注**——与「中间件」类似，但不替代主循环的终局责任。  
- **错误恢复**：多数失败被当作**换路径的信号**，而非整任务立即失败。  
- **高危工具**：`Bash` 等往往带**长规则列表**（命令模式、路径、网络），与「默认不信任模型输出的 shell」这一安全常识一致。  
- **Feature flag**：客户端可见的开关反映**灰度与实验**，泄露讨论里常被拿来猜测路线图——**仅作背景**，以官方发布为准。

---

## 八、阅读边界（与文首背景一致）

泄露事件缘起与范围见**文首「背景」**；此处只强调：下文技术点均为**客户端工程视角**的公开讨论归纳，**非** Anthropic 正式白皮书；**模型与 API 服务端**不在此次泄露讨论范围内。分享或引用时请区分「产品怎么用」与「从泄露代码里读到的实现细节」。

---

## 九、一页纸「分享用」结论

1. **Agent = while 循环 + 工具调度**；加工具不必改循环核心。  
2. **先计划、再执行**；复杂任务用可见 Todo / 持久任务图。  
3. **子 Agent 卖的是上下文隔离**；**Skills 卖的是按需加载**。  
4. **记忆要分层**：指针 / 专题 / 检索；慎存易变的大段源码。  
5. **压缩是产品线**：微压缩省 token → 结构化会话记忆 → 全量摘要 → 自动触发与熔断；和 Prompt Cache、工具成对消息等**强耦合**。  
6. **多 Agent / 任务 / MCP** 统一在「同一条循环 + 持久协调层」上扩展。

---

## 十、写在最后（实践参考）

我自己在做的 **AI 驱动 H5 生成与迭代平台**里，也已经落地了与 CC **思路上相通**的几件事，例如 **上下文压缩**（长会话里控制 token、避免无效重复请求）和 **思维链拆分**（推理与对外可见/落库内容分层，思路接近泄露代码里 Full Compact 的 `analysis` 与 `summary` 分离：内部想清楚了，再给干净输出）。

Claude Code 未必是唯一答案，但它把一个严肃 Agent 产品里**循环、工具、记忆、压缩、权限**该怎么搭，拆得很具体。**以后你自己做类似的 Agent 项目时**，不妨把 CC（以及本文梳理的分层）当作一份「对照清单」：哪些层你必须有、哪些可以极简、哪些要按业务换名字——**不必照抄实现，但值得反复参考。**

---

## 十一、延伸阅读、业界启示与自检清单

### 公开报道与二次解读（英文为主）

- [NodeSource：Bun、.npmignore 与 map 泄露链](https://www.nodesource.com/blog/anthropic-claude-code-source-leak-bun-bug)  
- [TeqStars：事件时间线与传播语境](https://teqstars.com/blog/news-6/claude-code-leak-march-31-2026-what-broke-the-internet-for-ai-builders-13)  
- [typescript.news：泄露的技术向综述](https://typescript.news/articles/2026-03-31-claude-code-source-leak-analysis)  
- [dev.to：Agentic loop 与流式、工具、权限](https://dev.to/oldeucryptoboi/inside-claude-codes-architecture-the-agentic-loop-that-codes-for-you-cmk)  
- [dev.to：多 Agent / 子代理讨论](https://dev.to/klement_gunndu/inside-claude-codes-hidden-multi-agent-architecture-ne4)  

### 官方文档（与「缓存 / 工具」直接相关）

- [Anthropic：Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)  
- [Anthropic：Tool use with prompt caching](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/tool-use-with-prompt-caching)  

### 业界启示（npm / CLI 发布）

从本次事件抽象出的**与 Agent 无关**、但极实在的一条：**发布到 npm 的 tarball 里到底有什么**，应用自动化检查（例如 CI 中拒绝 `*.map`、校验包体大小突变、对 `npm pack --dry-run` 做 diff）。这类失误在 AI 产品之前就有先例；AI 只是把「源码里写了什么提示词与策略」变成了更吸睛的讨论点。

顺着这个思路再往前一步，其实也能自然引到 **Harness 工程**：当我们讨论上下文压缩、权限策略、子 Agent 协作时，真正难的是「改完之后到底有没有更稳」。没有可重复的评测与回归框架，团队很容易回到“感觉变好了”的状态。

### 为什么我会提 Harness

对我自己的 **AI 驱动 H5 生成与迭代平台**而言，参考 CC 的不只是架构分层，还包括“如何持续验证迭代质量”的意识。把常见任务、失败样例、成本与时延指标做成固定回放用例后，每次改动压缩策略或思维链拆分逻辑，都能更快判断是优化还是退化。

一个足够轻量的 Harness 看板，通常先盯这几项：

| 指标 | 关注点 |
|------|--------|
| 任务成功率 | 同一批任务是否稳定完成 |
| 平均轮次 / 工具调用数 | 是否出现无效循环或抖动 |
| 平均 token 成本 | 压缩与缓存策略是否真的省成本 |
| P95 端到端时延 | 真实用户体感是否变好 |
| 人工接管率 | 什么时候仍需要人介入 |

### 自建 Agent 时可对照的自检问题

1. **上下文**：长会话时，工具输出是否会在每轮无限堆积？微压缩/摘要/结构化记忆的触发条件是否写死？  
2. **缓存**：若用 Prompt Cache，动态信息是否隔离在易失效的后缀，避免整块前缀频繁失效？  
3. **成本**：连续压缩失败是否有**熔断**，避免对 API 打爆重试？  
4. **权限**：工具执行前是否有**可审计**的分级策略，而非「模型说跑就跑」？  
5. **持久化**：跨会话的任务状态存在哪里——内存、本地文件还是 DB？压缩后能否恢复？

### 现场 Q&A 备答卡片（每题 15–30 秒）

- **Q：这些内容来源靠谱吗？哪些是官方？**  
  A：我把信息分三类：**官方文档**（如 Anthropic 的 Prompt Caching/Tool Use）、**可复现的客户端材料**（这次 npm 包误带 `.map` 带来的源码可读性）、以及**社区/媒体解读**（可能带主观判断）。分享时我会优先引用官方与可复现信息，解读类会明确标注“仅供参考”。  

- **Q：泄露到底算不算安全事故？有没有用户数据/模型权重泄露？**  
  A：公开报道里反复强调的重点是“**客户端源码可读**”，不等同“服务端被入侵”。常见口径是：**不包含模型权重**、也没有证据表明直接泄露用户数据/凭据；但源码泄露本身会暴露实现细节（策略、提示词、权限管线），会带来额外攻防与舆论风险。最终以 Anthropic 官方通告为准。  

- **Q：为什么不直接上 RAG，而要做上下文压缩/记忆分层？**  
  A：RAG 主要解决“**外部知识怎么取回**”，上下文压缩解决“**对话内 token 预算怎么活下去**”。两者不是替代关系：长会话里工具输出会爆炸，不做压缩就会出现成本飙升、缓存失效、甚至重试风暴；而 RAG 更像是把“需要知道什么”从外部取回。  

- **Q：多层压缩听起来很复杂，最小落地顺序是什么？**  
  A：我的建议是：先做 **微压缩（工具结果占位/外置）+ 熔断（连续失败停止）**，这两项性价比最高；再做**结构化会话记忆**；最后才考虑**全量摘要/完整压缩**，因为它成本更高、也更依赖提示词设计。  

- **Q：你说的 `analysis`/`summary`（思维链拆分）到底解决什么？**  
  A：核心是把“**内部推理**”和“**对外输出/可落库事实**”分层：内部可以更充分地想清楚，外部只保留结构化结论、关键依据与可执行步骤，减少噪声、便于压缩与检索，也更利于团队协作与审计。  

- **Q：Prompt Cache 实战里怎么避免频繁失效？**  
  A：原则是让可缓存前缀尽量稳定：**工具定义与系统提示保持稳定**，把时间、Git 状态、文件内容等动态信息尽量放在后缀；减少中途改 `tool_choice`、并行工具开关、以及工具集本身（这些在官方文档里都有会导致失效的说明）。  

- **Q：多 Agent 什么时候值得上？会不会过度工程？**  
  A：先用单 Agent 把“循环 + 工具 + 权限 + 压缩”跑通。多 Agent 适合在两类场景上：一是任务天然可并行（检索/分析/验证分工），二是上下文互相污染严重（主线被细节拖垮）。否则引入协作协议、任务图、隔离目录会带来新的复杂度。  

- **Q：你自己的 H5 平台借鉴这些后，怎么证明真的变好了？**  
  A：靠 Harness：把典型任务与失败样例固化成可回放用例，盯 **成功率、平均轮次/工具调用、token 成本、P95 时延、人工接管率**。这样每次改压缩策略或拆分逻辑，都能快速量化是提升还是退化。  

---

## 附录：Learn Claude Code 课程结构（19 章）

站点大纲（[learn.shareai.run](https://learn.shareai.run/)）：

- **Core Loop**：Agent Loop、Tool Use、TodoWrite、Subagent、Skills、Context Compact  
- **System Hardening**：Permission、Hook、Memory、System Prompt、Error Recovery  
- **Task Runtime**：Task System、Background Tasks、Cron Scheduler  
- **Multi-Agent Platform**：Agent Teams、Team Protocols、Autonomous Agents、Worktree Isolation、MCP & Plugin  
