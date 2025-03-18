---
icon: pen-to-square
date: 2025-03-18
category:
  - Learning Records
tag:
  - Spark
---

# Spark Intro

## Differences between Spark and Hadoop MapReduce
| Feature                     | Apache Spark                                       | Apache MapReduce                                 |
|-----------------------------|---------------------------------------------------|-------------------------------------------------|
| **Processing Model**         | In-memory processing, DAG-based                   | Disk-based, Map and Reduce operations           |
| **Performance**              | Faster due to in-memory computation               | Slower, as data is read/written to disk after each operation |
| **Ease of Use**              | High-level APIs (Java, Scala, Python, R)          | Low-level APIs (Java)                           |
| **Fault Tolerance**          | Uses lineage for fault tolerance (re-computation) | Replication of data blocks for fault tolerance  |
| **Data Processing**          | Supports batch and real-time processing (streaming) | Primarily batch processing                      |
| **Memory Consumption**       | High, due to in-memory processing                 | Lower, because it relies on disk storage        |
| **Data Shuffling**           | More efficient due to DAG and in-memory storage   | Less efficient, as it involves disk I/O         |
| **APIs and Libraries**       | Rich libraries (MLlib, GraphX, SparkSQL, etc.)    | Limited libraries, mostly for basic processing  |
| **Latency**                  | Low latency due to in-memory processing          | High latency due to disk I/O                    |
| **Fault Tolerance Mechanism**| Lineage-based re-computation                      | Data replication at HDFS level                  |
| **Resource Management**      | Built-in support for YARN, Mesos, and Kubernetes  | Requires Hadoop YARN or similar systems         |
| **Scalability**              | Easily scalable, supports large-scale clusters    | Scalable but with higher overhead due to disk-based operations |
| **Suitability**              | Suitable for both batch and real-time workloads   | Best for batch processing workloads             |
| **Popularity**               | Gaining widespread adoption for big data processing | Mature but less popular for newer workloads      |

## Running Spark locally
```bash
bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master local[The number of cores you want to use, can use * to use all available cores] \
--deploy-mode client \
./examples/jars/spark-examples_2.12-3.3.1.jar \
10

```
## Running Spark on YARN
#### Client Mode
```bash
bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master yarn \
--deploy-mode client \
./examples/jars/spark-examples_2.12-3.3.1.jar \
10
```
#### Cluster Mode
```bash
bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master yarn \
--deploy-mode cluster \
./examples/jars/spark-examples_2.12-3.3.1.jar \
10
```
Spark有yarn-client和yarn-cluster两种模式，主要区别在于：Driver程序的运行节点。
yarn-client：Driver程序运行在客户端，适用于交互、调试，希望立即看到app的输出。
yarn-cluster：Driver程序运行在由ResourceManager启动的APPMaster，适用于生产环境。

## Running Spark Standalone
Standalone模式是Spark自带的资源调度引擎，构建一个由Master + Worker构成的Spark集群，Spark运行在集群中。
| **Mode**       | **Number of Spark Machines** | **Processes to Start**  | **Owner**  |
|--------------|-----------------------|-------------------|--------|
| **Local**    | 1                     | None (Runs Locally)  | Spark  |
| **Standalone** | ≥3                   | Master and Worker  | Spark  |
| **YARN**     | 1                     | YARN and HDFS      | Hadoop |
