---
icon: pen-to-square
date: 2026-04-25
category:
  - Learning Records
tag:
  - Notes
---

# 2026 AI Agent 框架选型指南

## 三大底层基石

- **MCP 协议**：Anthropic 2024 年底牵头制定的 Agent 工具标准，类似 “USB 接口”，实现工具代码跨框架复用。2026 年 10 个主流框架中 8 个原生支持，工具生态壁垒基本消失，工具数量不再是选型核心考量。
- **A2A 协议**：Google 2025 年推出的 Agent 间通信标准，类似 “普通话”，解决跨框架 Agent 协作问题。大厂框架（微软、Google SDK、阿里 AgentScope）原生支持，CrewAI、LangGraph 等依赖社区插件，普及速度较 MCP 慢，但互操作是必然趋势。
- **上下文工程（Context Engineering）**：2025 年行业共识，通过管理大模型 “内存条” 信息（质量、结构）提升性能，推动框架在记忆压缩、上下文过滤、动态工具选择等底层创新。

## 五大架构范式

### 图状态机

代表框架 **LangGraph**，核心特点 “少抽象、多控制”，基于 node 节点、edge 边、state 状态构建，支持状态持久化、时间旅行调试（回滚查 bug）、节点暂停人工审批，适合复杂业务生产环境。上手难度低（2 星），生产就绪性满分，类似 “Agent 框架里的 Linux”。

### 角色驱动

代表框架 **CrewAI**，逻辑直觉化，通过自然语言定义角色、目标、背景，分任务后一键启动，上手难度满分（5 星），适合自媒体内容管线、市场调研原型。缺点是底层控制力弱，不适合金融交易系统、超长工作流等需精确控制的场景。

### 事件驱动

- **LlamaIndex**：专注数据处理，积累 300+ 连接器，NumberParse 引擎支持复杂嵌套表格和手写笔记解析，数据密集型 Agent 场景（海量文档处理）几乎无替代品。
- **阿里 AgentScope**：主打透明可控，API 调用可追溯，原生支持 Python / Java 双版本，支持模型微调，对国内私有化部署团队友好。

### SDK 封装

- **OpenAI Agent SDK**：极简设计，核心创新 “handoff”（任务转交），五行代码运行，支持实时语音流，缺点是编排能力弱，不支持复杂运行循环。
- **Pedantic AI**：定位 “FastAPI 式 AI 开发”，支持 25+ 大模型无缝切换，自动校验格式、重试，被看好成为底层基础设施标准。

### 低代码平台

代表框架 **Diffy**，Web 平台支持鼠标拖拽拼工作流，非技术人员可使用，一键发布 API，GitHub 星数 13 万+，马士基、诺华等企业采用。缺点是深度代码定制能力有限。

## 企业级框架补充

- **Microsoft Agent Framework**：2025 年合并 OTTOGEN（学术研究）与 Semantic Kernel（企业编排），具备多 Agent 群聊能力和企业级稳定安全，.NET 体系公司唯一选择，支持 MCP、A2A 协议。
- **Google ADK**：多语言支持（Python、TypeScript、Java、Go），瞄准多元混合大型企业客户，目前处于 0.X 阶段，脱离 Google 云生态灵活性较差。

## 选型决策五步法

1. **团队技术栈**：.NET/C# 团队选 Microsoft Agent Framework；Java 团队选 Google ADK 或 AgentScope Java 版；TypeScript 前端选 OpenAI Agents SDK 或 LangGraph JS 版；多语言混合团队选 Google ADK；纯 Python 团队可任意选择。
2. **核心业务场景**：数据密集型 RAG / 文档问答选 LlamaIndex；角色化多 Agent 协作选 CrewAI；复杂有状态工作流选 LangGraph；快速原型 / MVP 选 CrewAI 或 OpenAI SDK；低代码平台需求选 Diffy；国内私有化部署选 AgentScope 或 Diffy。
3. **部署云平台**：Azure 选微软框架；Google Cloud 选 Google SDK；阿里云选 AgentScope；本地服务器托管选 Diffy；无云偏好则按场景选择。
4. **大模型偏好**：绑定 OpenAI 生态选 OpenAI Agent SDK；依赖 Gemini 选 Google SDK；国内模型（通义千问、豆包、文心一言）选 AgentScope 或 Diffy；需多模型切换选 Pedantic AI。
5. **成本分析**：开源框架存在隐性成本（LangGraph Platform 付费、LlamaIndex 高级解析服务 LlamaPack 按量计费、Diffy 企业版功能付费），微软 / Google 框架引导至云付费服务；Pedantic AI 隐性成本最低；需关注 “token 黑洞”（不同架构 token 消耗速度差异，如 LangGraph 利用率高，CrewAI 可能产生冗余消耗）。

## 行业趋势

- **框架数量减少**：大而全的小框架淘汰，巨头框架向庞大化、深度化发展。
- **框架边界模糊**：核心能力模块化（如 LangSmith 剥离 workflow 引擎），支持跨框架组装（如 LangGraph 总编排 + LangSmith 模块）。
- **多模态成标配**：OpenAI SDK 支持实时语音，Google SDK 支持双向音视频，语音、图像交互从附加功能变为基础要求。
- **国内生态差距与优势**：国际社区影响力、英文文档完善度有差距，但 Diffy 全球流行，AgentScope 对国产模型原生支持及框架内微调能力突出，数据安全 / 监管场景下国内框架为首选。

## 不同团队建议

- **独立开发者 / 探索者**：从 Pedantic AI 或 OpenAI SDK 起步，学习曲线平缓，快速建立 Agent 调用工具、交接任务的核心认知，后期再迁移至 LangGraph。
- **初创公司技术骨干**：用 CrewAI 快速跑通原型验证想法，验证通过后迁移至 LangGraph，避免后期维护成本过高。
- **大型企业技术决策层**：优先考虑云战略（Azure 选微软、Google Cloud 选 Google），多云混合环境建议 LangGraph（底层）+ Diffy（应用层）；需支持 MCP 和 A2A 协议，避免封闭框架导致未来协作困难。
