---
icon: pen-to-square
date: 2026-03-21
category:
  - Learning Records
tag:
  - Notes
---

# OpenClaw 进阶教程

## 一、安装与初始化

近一个月 OpenClaw 进行了多次升级，安装过程有所变化，以 Mac mini 为例：

1. **安装 Node.js**：打开命令行终端，从 Node.js 官网复制安装命令执行；若网络连接 GitHub 困难，可替换为指定命令
2. **安装 OpenClaw**：在 OpenClaw 官网找到 npm 安装命令，在终端执行
3. **初始化配置**：
   - 输入命令，选择 `yes` 快速开始
   - 选择 AI 模型供应商（推荐 Coding Plan，如 MiniMax 国内版，按次数计费更划算）
   - 授权后选择默认模型
   - 暂时跳过聊天工具接入和技能配置
   - 选择 Open in Web UI，能正常对话即配置成功
4. **修改权限配置**：在控制台找到配置的 raw 原始文件，将 `messaging` 默认配置改为 `full`，保存并 reload，以获取调用所有工具的权限

## 二、记忆系统

OpenClaw 的记忆系统位于用户文件夹下的 `OpenClaw/Workspace` 文件夹，包含多个关键文件：

| 文件/文件夹 | 作用 |
|-------------|------|
| **AGENTS.md** | 存储工作规范，有助于理解 OpenClaw 工作机制 |
| **IDENTITY.md** 与 **SOUL.md** | 保存 OpenClaw 的自我认知 |
| **USER.md** | 存储对用户的认知 |
| **TOOLS.md** | 保存工具调用相关知识 |
| **MEMORY.md** | 长期记忆文件 |
| **memory** 文件夹 | 按天存放短期记忆 |
| **HEARTBEAT.md** | 心跳机制文件 |

若 OpenClaw 行为不符合预期，可修改上述文件纠正其行为。

## 三、网络搜索

OpenClaw 原生搜索需借助 BRAVE API，配置麻烦，可通过安装 skills 修复。

### 方案一：Tavily Web Search skill

- 在 **ClawHub**（OpenClaw 官方 skills 市场）复制该 skill 链接，发送给 OpenClaw 安装
- 获取 Tavily 免费 API Key（每月 1000 次使用额度），配置到 OpenClaw
- **修改配置文件**：
  - 进入 `/Users/用户名/.openclaw`，修改 `openclaw.json`，在 `tools` 中添加关闭默认搜索功能的配置
  - 进入 `workspace/TOOLS.md`，添加优先使用 Tavily Search 的提示词
- 重启 OpenClaw 即可使用搜索功能

### 方案二：Multi SearchEngine skill

- 无需 API Key，直接调用各搜索引擎
- 安装后在 `TOOLS.md` 中添加作为备选搜索方案的提示词，可获取多引擎搜索结果

## 四、Skills

三种寻找和安装 skills 的方式：

### 1. 内置 skills

在 OpenClaw 设置页面的 **BUILD-IN-SKILLS** 中选择，如 `apple-reminder` 可接入苹果提醒事项，点击 install 安装后，可通过对话设置提醒并同步到苹果手机。

### 2. 官方 skills 市场 ClawHub

- 收录 16000 多个 skills
- 建议选择 star 数量高的，避免自动安装，人工审核后安装
- 例如 **Summarize skill** 可总结网页、PDF 等，需配置 Gemini API Key，安装后可对 PDF 论文进行总结

### 3. 开源项目 awesome OpenClaw skills

- 涵盖 5000 多个精选 skills，分类明确（如 finance、marketing ideas）
- 在 ClawHub 搜索对应 skill 名称，复制地址发送给 OpenClaw 安装
- 需 API Key 时同步提供

## 五、接入聊天工具：飞书

1. **安装飞书插件**，执行官方文档命令
2. **在飞书开放平台**创建企业自建应用，获取 APP secret 和 APP ID
3. **配置 OpenClaw**：输入命令，选择飞书，输入 APP secret 和 ID，选择 websocket 长连接、国内版域名，disable 群聊功能
4. **飞书控制台配置**：
   - 批量导入权限，开通缺失权限
   - 开启机器人能力
   - 选择长连接订阅事件（确保 OpenClaw 运行）
   - 添加接收消息事件
   - 创建版本发布
5. 手机端即可与机器人对话

## 六、心跳机制

心跳机制是 OpenClaw 重要工作机制，按设定间隔运行，读取 `HEARTBEAT.md` 文件逐项检查，有需通知事项时发消息。

### 与定时任务的区别

| 维度 | 心跳 | 定时任务 |
|------|------|----------|
| **触发方式** | 固定间隔（如 10 分钟、20 分钟） | 可设精确时间或固定间隔 |
| **上下文** | 有完整对话历史，适合复杂上下文任务（如情感维系） | 无对话历史，适合简单精确任务（如定时提醒） |

### 配置案例：每小时检查金价并推送

- 修改 `openclaw.json`：添加 Heartbeat 配置，设置间隔和渠道
- 修改 `HEARTBEAT.md`：添加检查金价 API 指令

## 七、多 Agents 功能

多 agent 功能即**机器人分身**，可在同一 OpenClaw 运行多个不同性格、工具和记忆的机器人，每个 agent 记忆存储在独立文件夹。

### 配置步骤

1. 输入命令添加新 agent（如命名「林黛玉」），确认新 workspace 地址
2. 配置模型和聊天频道，在飞书创建对应机器人并配置权限
3. 修改 OpenClaw 配置文件，在 `accounts` 中定义多个飞书账号，在 `bindings` 中绑定 agent 与账号
4. 自定义新 agent 的记忆文件（如修改 `SOUL.md`），重启 OpenClaw 并配置飞书机器人事件
5. 即可拥有不同性格的机器人

## 八、云服务器部署

OpenClaw 接入个人微信需企业微信机器人，需公网 IP 或域名，推荐云服务器部署（以 Linux 为例）。

### 安装与启动

1. **安装 Node.js**：执行国内云服务器专用安装命令
2. **安装 OpenClaw**：复制 npm 安装命令执行，输入初始化，选择模型厂商（Coding Plan）、国内站，授权后跳过聊天工具和技能配置
3. **启动方式**：无桌面环境服务器需用后台运行命令，停止时执行对应命令
4. **连接服务器 OpenClaw**：通过 SSH 隧道（如 Windows 命令行建立隧道），在浏览器访问服务器给出的网址即可对话

### 配置企业微信机器人

1. 注册企业微信，创建应用
2. 设置 API 接收 TOKEN、AES Key 和 URL（服务器公网地址：`18789/wecom/app`），开放服务器 18789 端口
3. 安装 OpenClaw 插件，配置 APP 信息、企业 ID、secret 等
4. 修改设置允许公网访问并重启
5. 添加企业可信 IP
6. 个人微信即可与机器人对话
