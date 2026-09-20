---
icon: pen-to-square
date: 2026-09-16
category:
  - Learning Records
tag:
  - Notes
---

# LangGraph Human-in-the-Loop（HITL）底层原理

一句话核心：**HITL 本质是利用 Checkpoint 持久化 + 图执行中断机制，把执行线程暂停，状态完整保存；等外部人工操作后，复用同一个 thread_id 继续推进图的执行，并不是在LLM内部做暂停。**

> 关键点：LangGraph 本身是**单线程、步进式执行**，不是协程挂起那么神奇；每执行完一个节点，才会判断是否要中断。**不能在一个node函数执行中途打断，只能在节点与节点之间的边界暂停**。

## 1. 前置：Checkpointer（检查点存储）是HITL的基础

HITL 完全依赖 Checkpointer，没有它就做不了暂停恢复。 Checkpointer 负责持久化两类东西：

1. **State：当前图状态（messages、自定义字段）**
2. **Next step 执行指针：下一个要跑的节点是谁**

> 内置实现：
> 
> - MemorySaver：内存，仅调试，重启丢失
> - SqliteCheckpointer / PostgresCheckpointer / RedisCheckpointer：生产持久化 每条会话用唯一 `thread_id` 作为主键存储检查点；一个thread可以有多个checkpoint版本（支持时间旅行）。

### 存储结构简化理解

```
thread_id = "t1001"
checkpoint_id = "uuid-xxxx"
{
  "state": { messages: [...], order_id: "xxx" },
  "next": "agent",       # 下次恢复时，从哪个节点开始执行
  "metadata": {...}
}
```

## 2. 两种HITL实现方式（底层不一样）

### 方式A：**节点返回 `Interrupt`（最常用，推荐）**

在节点内部，主动抛出/返回 `Interrupt`，**执行会在当前节点跑完之后，图进入暂停**。

> 注意：不是node函数跑一半停，是node逻辑执行完毕，返回Interrupt标记，LangGraph在**节点执行完成后，停止继续走边**，保存checkpoint。

伪代码：

```
from langgraph.types import interrupt

def human_review_node(state):
    # 1. 节点内部先执行代码，生成待人工审核内容
    proposal = "账单分期方案：xxx"
    # 2. 触发中断，把提示信息抛给外部
    user_input = interrupt(f"请人工审核方案：{proposal}，同意/拒绝？")
    # 3. 【暂停点】执行流卡在这一行！
    # 当后续用同一个thread_id invoke恢复时，interrupt()会返回外部传入的值，继续往下执行
    if user_input == "同意":
        return {"result": "审批通过"}
    else:
        return {"result": "驳回"}
```

#### 底层执行流程拆解

1. `graph.invoke(..., config={"thread_id":"t1"})` 启动
2. 图调度器执行节点 `human_review_node`
3. 节点执行到 `interrupt(xxx)`：
    - LangGraph 捕获这个调用，**不继续执行节点后面代码**
    - 把当前状态、当前代码位置（栈标记）写入checkpoint
    - 终止本次invoke调用，返回中断信息给调用方
4. 此时：**Python进程退出本次invoke，线程释放，不是挂起协程**
5. 人工在外部输入审批结果（`resume`值）
6. 再次调用 `graph.invoke(None, config=config)`
    - 调度器读取该thread的checkpoint
    - 回到上次`interrupt()`的位置，**把人工输入作为interrupt返回值**
    - 继续执行节点剩下代码，再走边、跑后续节点

> 重点：`interrupt()` 是**特殊的状态标记**，checkpoint会保存「节点内的执行位置」，恢复时继续在节点内部往下跑。

### 方式B：**条件边判断，在节点之间暂停（旧方案）**

不使用`interrupt`，在节点执行完成后，在条件路由函数判断需要人工介入，直接路由到END。

- 状态保存到checkpoint
- 人工修改状态（`graph.update_state()`）
- 再次invoke，从该节点继续跑

缺点：只能在**节点与节点之间断点**，不能在同一个node内部等待输入；现在优先用`interrupt`。

## 3. 核心对象：`Command` 和 `interrupt` 底层关系

`interrupt()` 本质是封装返回 `Command` 对象：

```
# 简化源码逻辑
def interrupt(value):
    raise Command(resume=value, interrupts=[Interrupt(value)])
```

`Command` 是LangGraph的控制原语，可以：

- `interrupt`：暂停并等待外部resume值
- `goto`：强制跳转到某个节点
- `update`：更新状态

> 调度器在节点返回结果时，检测是不是Command：
> 
> 1. 如果包含interrupt标记 → 保存checkpoint，停止执行
> 2. 下一轮恢复时，传入resume参数，注入到interrupt调用点

## 4. graph.stream / invoke 如何感知中断

当图触发interrupt后：

- `graph.invoke()` 直接返回，返回结果里包含 `__interrupt__` 字段，携带中断提示
- `graph.stream()` 会流式输出到中断节点，然后停止流
- 你可以调用 `graph.get_state(config)` 获取当前会话状态 + 中断信息

```
state = graph.get_state(config)
print(state.interrupts) # 拿到interrupt的提示内容
```

恢复时，你可以传入resume值：

```
graph.invoke(Command(resume="同意"), config=config)
```

## 5. 生产关键点（银行/信用卡业务场景）

1. **中断是无锁的**：checkpoint只是持久化数据，**没有数据库锁**。业务层自己要做并发控制，防止同一个thread被多人同时审批。
2. **恢复时不会重跑已经跑完的节点**：checkpoint记录执行位置，只从断点继续。
3. **支持时间旅行**：`get_state` 可以读取历史checkpoint_id，可以回滚到任意历史状态重新执行，适合审计、回溯账单分期推理链路。
4. **不能跨机器内存挂起**：暂停之后进程可以直接退出，恢复可以在另一台机器，**全部靠外部存储（Postgres/Redis）的checkpoint**。这是分布式部署的关键。

## 6. 极简Mermaid执行流程

```
START → agent_node → human_review_node
                     ↓ 执行到interrupt()
                保存checkpoint，中断返回
                ↓（人工在外部输入审批结果）
                读取checkpoint，恢复interrupt位置
                ↓ 继续执行human_review_node剩余代码
→ 路由判断 → END
```

## 7. 和普通代码断点区别

|普通debug断点|LangGraph HITL interrupt|
|---|---|
|进程挂起，占内存/线程|进程可以退出，状态存在外部存储|
|只能单机器调试|分布式、多服务实例可恢复|
|无法持久化|可持久化、可审计、可回滚|
|任意代码行暂停|只能在interrupt调用点暂停|

## 8. 常见坑

1. ❌ 不要在循环内频繁interrupt，会产生大量checkpoint，存储膨胀
2. ❌ MemorySaver不能上生产，进程重启所有中断会话丢失
3. ❌ 并发调用同一个thread_id，会产生冲突，业务层加锁
4. ❌ 不要把业务事务和图执行绑定：**中断时数据库事务一定会提交/回滚，图暂停不持有DB事务**（非常重要！银行系统重点）
