---
icon: pen-to-square
date: 2026-04-04
category:
  - Learning Records
tag:
  - Notes
---

# Learn Claude Code
[Learn Claude Code](https://learn.shareai.run/)

### Bash is All You Need
- Every agent is a while loop that keeps calling the model until it says 'stop'.
- Agent: One loop & Bash is all you need

### One Handler Per Tool
- Dispatch Map: A dictionary maps tool names to handler functions. The loop code never changes.

### Plan Before Act
- An agent without a plan drifts; list the steps first, then execute
- TodoWrite gives the model a visible plan. All tasks start as pending.

### SubAgent
- Subagents use independent messages, keeping the main conversation clean
- Parent context stays clean. Subagent context is discarded

### Skills
- Inject knowledge via tool_result when needed, not upfront in the system prompt

### Task System
- A file-based task graph with ordering, parallelism, and dependencies -- the coordination backbone for multi-agent work
- Tasks are stored in JSON files on disk. They survive context compaction -- unlike in-memory state.

### Context Compression
- Context will fill up; three-layer compression strategy enables infinite sessions
```
Every turn:
+------------------+
| Tool call result |
+------------------+
        |
        v
[Layer 1: micro_compact]        (silent, every turn)
  Replace tool_result > 3 turns old
  with "[Previous: used {tool_name}]"
        |
        v
[Check: tokens > 50000?]
   |               |
   no              yes
   |               |
   v               v
continue    [Layer 2: auto_compact]
              Save transcript to .transcripts/
              LLM summarizes conversation.
              Replace all messages with [summary].
                    |
                    v
            [Layer 3: compact tool]
              Model calls compact explicitly.
              Same summarization as auto_compact.
```
- Layer 1 -- micro_compact: Before each LLM call, replace old tool results with placeholders.
- Layer 2 -- auto_compact: When tokens exceed threshold, save full transcript to disk, then ask the LLM to summarize.
- Layer 3 -- manual compact: The compact tool triggers the same summarization on demand.
```python
def agent_loop(messages: list):
    while True:
        micro_compact(messages)                        # Layer 1
        if estimate_tokens(messages) > THRESHOLD:
            messages[:] = auto_compact(messages)       # Layer 2
        response = client.messages.create(...)
        # ... tool execution ...
        if manual_compact:
            messages[:] = auto_compact(messages)   
```

### Background Threads + Notifications
- The agent has a main thread and can spawn daemon background threads for parallel work

### Teammates + Mailboxes
- Teams use a leader-worker pattern. Each teammate has a file-based mailbox inbox.

### Shared Communication Rules
- One request-response pattern drives all team negotiation
### Scan Board, Claim Tasks

### Isolate by Directory