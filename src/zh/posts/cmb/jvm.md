---
icon: pen-to-square
date: 2026-02-07
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# JVM 调优

## 一、调优目标（先明确再动手）

- **吞吐量型**：批处理、离线任务，追求单位时间内完成任务数量
- **低延迟型**：Web 服务、API、交易系统，追求 GC 停顿时间短
- **内存受限型**：容器、云环境，堆大小受限，需避免 OOM

## 二、常用 JVM 参数（以 JDK 8 为例）

```bash
# 堆内存
-Xms4g -Xmx4g                      # 初始堆=最大堆，避免运行时扩容
-Xmn2g                              # 年轻代，一般约为堆的 1/3～1/2

# GC 选择
-XX:+UseG1GC                       # G1 适合大多数企业场景
# 或 -XX:+UseZGC（JDK15+，超低延迟）

# GC 日志（JDK 9+）
-Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=100m

# OOM 时 dump
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/to/dumps/
```

## 三、常见问题与诊断思路

| 现象 | 可能原因 | 调整方向 |
|------|----------|----------|
| Full GC 频繁 | 老年代空间不足、元空间膨胀 | 增大堆/老年代、检查元空间、排查大对象泄漏 |
| Young GC 频繁 | 年轻代过小、晋升过快 | 增大 -Xmn、调整晋升年龄 |
| GC 停顿时间长 | 堆过大、STW 时间长 | 考虑 ZGC/Shenandoah，或缩小堆、优化对象分配 |
| OOM | 内存泄漏或堆太小 | 分析 dump、排查泄漏、适当增大堆 |

## 四、企业实践经验

1. **-Xms 与 -Xmx 设成相同**：避免运行期堆动态扩容，减少 GC 抖动
2. **生产环境务必开启 GC 日志**：至少保留数天，便于事后排查
3. **容器环境**：使用 `-XX:+UseContainerSupport` 和 `-XX:MaxRAMPercentage`，让 JVM 感知容器限制
4. **压测 + 监控**：用 JMeter 等压测，结合 Prometheus + Grafana 观察 GC、CPU、内存曲线
5. **先看 GC 日志再调参**：根据 GC 频率、停顿、晋升情况决定是否调 -Xmn、Survivor 等
6. **OOM 必做 HeapDump 分析**：用 MAT、VisualVM 等分析 dump，定位大对象和引用链

## 五、不同 JDK 版本的 GC 选型

- **JDK 8**：**G1GC** 为主流，兼顾吞吐和停顿，适合多数 Web 服务
- **JDK 11+**：G1 更成熟，可开始尝试 **ZGC** 追求超低延迟
- **JDK 17+**：**ZGC**、**Shenandoah** 可用于生产，追求亚毫秒级停顿
