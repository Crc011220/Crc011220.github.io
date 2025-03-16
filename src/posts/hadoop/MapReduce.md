---
icon: pen-to-square
date: 2025-03-15
category:
  - Learning Records
tag:
  - Hadoop
---

# MapReduce

**Scatter -> Gather** (This is the pattern of MapReduce)  
**Central Scheduling -> Step Execution** (This is the pattern of big data systems like Spark, Flink)

- The Map function interface provides the "scatter" functionality, allowing servers to process data in a distributed manner.  
- The Reduce function interface provides the "gather" (aggregation) functionality, summarizing and aggregating the distributed processing results.

MapReduce can be used to develop computing programs in languages like Java and Python.  
### Note: 
Although MapReduce can be developed using languages like Java and Python, nowadays, almost no one writes its code because it is too **outdated**. Despite being old, MapReduce is still active in the field, mainly because the Apache Hive framework is very popular, and Hive's underlying layer uses MapReduce.

The tasks to be executed are broken down into multiple Map Tasks and Reduce Tasks.  
Map Tasks and Reduce Tasks are assigned to the corresponding servers for execution.

:::info
**Example:** Monte Carlo simulation to calculate the value of π
:::