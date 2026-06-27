---
icon: pen-to-square
date: 2026-06-21
category:
  - Learning Records
tag:
  - Notes
---

# obra/superpowers vs addyosmani/agent-skills 核心区别
两个都是给AI编码Agent（Claude Code/Cursor/Codex）用的Skill仓库，但**定位、设计逻辑、使用方式完全相反**，下面分维度对比：

## 一、基础信息
1. **Superpowers（obra/superpowers）**
    - 作者：Jesse Vincent（obra），⭐约23w+
    - 核心定位：**强制全流程开发方法论框架**
    - 核心逻辑：一套不可跳过的标准化流水线，约束AI按专业工程流程干活
2. **AgentSkills（addyosmani/agent-skills）**
    - 作者：Addy Osmani（谷歌工程负责人），⭐约2.5w
    - 核心定位：**零散、独立、按需调用的工程技能合集**
    - 核心逻辑：一堆独立工具Skill，想用哪个手动触发，不强制流程

## 二、核心差异对比表
| 对比维度 | Superpowers（SuperPower） | AgentSkills（AgentSkill） |
|--------|--------------------------|---------------------------|
| **运行模式** | 全自动串联，**强制流水线**<br>固定链路：头脑风暴→规划→Git隔离分支→TDD实现→调试→代码评审→收尾，每一步不能跳过 | 完全独立碎片化技能，**按需手动调用**<br>没有内置流程，你让Agent用哪个才会执行哪个 |
| **技能设计目标** | 改造AI的开发习惯，解决AI乱写代码、不做测试、无架构的问题，适合长时间自主开发 | 补齐细分领域能力，覆盖前端、安全、CI/CD、API、性能等专项场景，做功能补充 |
| **技能数量&深度** | 仅14个核心Skill，但**每个极深、强耦合**，互相依赖组成完整生产线 | 20+细分独立Skill，覆盖面广，但单技能流程浅、无联动 |
| **触发方式** | 安装后自动全局生效，Agent接任务自动走完整套流程，无需手动调用任何指令 | 必须手动输入斜杠指令（`/api-design`、`/security-hardening`）主动启用 |
| **适用场景** | 大型需求、复杂重构、长期自主开发，追求规范、TDD、可验收的工程产出 | 小型需求、专项优化、查漏补缺（加安全规范、前端性能、CI流水线等） |
| **Git/工程特色** | 内置`git-worktrees`隔离分支、子Agent并行开发、强制测试先行、代码自检闭环 | 少量Git相关能力，侧重业务、前端、运维、安全专项规范 |
| **上手成本** | 高，流程重，小改动也会走完整套流程，执行耗时更长 | 极低，即用即丢，只在需要时加载，轻量化不冗余 |

## 三、举直观例子理解
### Superpowers工作流程
你说：实现用户登录接口
Agent自动完整走一遍：
1. brainstorming：梳理需求、边界、异常
2. using-git-worktrees：新建隔离分支，不污染主代码
3. writing-plans：输出分步实现方案
4. TDD：先写单元测试，再写业务代码
5. systematic-debugging：自测排查bug
6. code-review：自我评审架构、规范
7. finish：提交分支、输出变更说明

全程**不用你干预，强制走完所有步骤**。

### AgentSkills工作流程
你说：实现用户登录接口
Agent直接写代码，不会自动走规范；
如果你觉得API写得不标准，手动输入 `/api-design`，Agent才会套用REST规范重构接口；
需要安全加固，再手动 `/security-and-hardening`，两者互不关联。

## 四、如何选择
1. 选 **Superpowers**
    - 长期、复杂开发，希望AI自主干活几小时不出乱子
    - 严格要求TDD、规范、可测试、完整交付流程
    - 不想频繁手动引导AI，追求全自动工程约束
2. 选 **AgentSkills**
    - 日常简单需求，只需要补充专项能力
    - 前端、性能、安全、CI/CD、API标准化等细分场景补强
    - 不想强制笨重流程，保留对AI的完全控制权
3. 最佳实践（行业通用）
    主力用Superpowers做整体开发，搭配AgentSkills的专项技能做补充，两者互不冲突。

## 五、一句话总结
- **Superpowers = 一套强制AI遵守的完整开发流水线（重、全自动、深度流程）**
- **AgentSkills = 一堆独立零散的专项工具技能（轻、手动调用、广覆盖）**