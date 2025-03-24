---
icon: pen-to-square
date: 2025-03-19
category:
  - Learning Records
tag:
  - Spark
---

# Spark Core

## RDD (Resilient Distributed Dataset)
- Can be understood as a data pipeline.

```java
    public static void main(String[] args) {

        SparkConf conf = new SparkConf();
        conf.setAppName("Spark01");
        conf.setMaster("local");
        JavaSparkContext sc = new JavaSparkContext(conf);


        // read from memory
        List<String> list = Arrays.asList("alice,bob");
        JavaRDD<String> rdd = sc.parallelize(list,3); //3 partitions\

        // read from disk
        // JavaRDD<String> rdd = sc.textFile("/Users/chenruochen/Documents/IT-Study/Spark/spark/data/1.txt");


        List<String> collect = rdd.collect();
        collect.forEach(System.out::println);

        rdd.saveAsTextFile("output");// save as text file in relatived path

        sc.close();
    }

```

### Partitioning Rules

#### 1. **Spark File Path Settings**  
- Spark can read files using **absolute** or **relative paths**.  
- In **IDEA**, the relative path is based on the **project root** rather than the **module root**.  

#### 2. **Spark File Source Partitioning Strategy**  
- JavaRDD<String> rdd = sc.parallelize(list,3); //3 partitions\
- If above is not set, set spark.default.parallelism
- If above is not set, Spark uses the following default value `conf.setMaster("local[*]");`

- The `textFile` method can accept a third parameter: `minPartitions` (minimum number of partitions).  
    - If not provided, Spark uses the following default value:  
    ```java
    minPartitions = math.min(defaultParallelism, 2)
    ```
- You can also configure it using parameters:  
    - `spark.default.parallelism` (default is 1)  
    ```python
    math.min(parameter, 2)
    ```
- Alternatively, Spark can use the total number of cores in the environment:  
    ```python
    math.min(total_cores, 2)
    ```

#### 3. **Spark is Built on Hadoop's MR Framework**  
- Spark does **not implement file slicing** itself—it relies on Hadoop's MapReduce (MR) library.  
- The number of file splits is determined by **Hadoop**, not Spark. Spark does not support file manipulation.

The calculation rules for the number of slices and file data storage in Hadoop are different.
1. When calculating the number of partitions, it is split by bytes as evenly as possible.
2. The partition data storage considers the integrity of the business data and reads it line by line. When reading data, the offset (starting from 0) must also be considered.

:::info
### Java Tuples Class
The `Tuple` class is a container class that holds multiple values of different types. It is used to represent a row in a dataset. The `Tuple` class is part of the `scala.Tuple` package. The maximum number of values that can be stored in a `Tuple` is 22.

```java
import scala.Tuple2;

public class MyClass {
    public static void main(String[] args) {
        Tuple2<String, Integer> tuple = new Tuple2<>("Alice", 25);
        String name = tuple._1();
        int age = tuple._2();
        System.out.println(name + " is " + age + " years old.");
    }
}
```
:::
### RDD Methods
All methods can be divided into two categories:
#### Transformations
- `map` - applies a function to each element of the RDD and returns a new RDD.
- `filter` - selects only the elements that satisfy a predicate and returns a new RDD.
- `flatMap` - applies a function to each element of the RDD and returns a new RDD, but the function can return multiple elements.
- `sample` - returns a sampled subset of the RDD.
- `union` - combines two RDDs into a single RDD.
- `groupByKey` - groups the elements of the RDD by key.
- `reduceByKey` - reduces the values of each key in the RDD.
- `sortByKey` - sorts the elements of the RDD by key.
- `join` - joins two RDDs based on their keys.
- `cogroup` - groups the elements of the RDD by key and then joins them.
- `cartesian` - returns the Cartesian product of two RDDs.
- `distinct` - returns a new RDD with duplicate elements removed.
- `intersection` - returns a new RDD with the elements that are common to both RDDs.
- `subtract` - returns a new RDD with the elements that are in the first RDD but not in the second RDD.
- `sampleByKey` - returns a sampled subset of the RDD based on the keys.
- `coalesce` - reduces the number of partitions in the RDD.
- `repartition` - repartitions the RDD into a specific number of partitions.
- `persist` - caches the RDD in memory or disk.
- `checkpoint` - sets a checkpoint directory for fault-tolerance.


#### Map()
- 默认情况下，新创建的RDD分区数量和之前的RDD分区数量相同
- 默认情况下，数据所在的分布也不会变
- 数据将所有的RDD执行完，才会执行下一个操作

#### Filter()
- 可能会导致数据倾斜，会导致性能下降

#### FlatMap() 
- 与map()类似，但是可以返回多个元素
- 拆开一个元素，然后再重新组合
- map没有扁平化的能力

#### GroupBy()
- 按照key进行分组
- 相同key的数据会被聚合到一起
- 不会改变分区数量
- 存在shuffle操作

:::info
### Shuffle
- 为了解决数据倾斜问题，Spark会自动进行shuffle操作
- 所有的数据必须分组后才能执行后续操作
- 落盘操作会将数据写入磁盘
- shuffle操作会将数据重新分配到不同的分区，以便每个分区的数据量相似
- shuffle操作会消耗大量的网络带宽和磁盘IO
:::

#### Distinct()
- 分布式去重
- 分组 + shuffle操作

#### KV methods
- use `parallelizePairs` to create a RDD of key-value pairs
- use `mapValues` to apply a function to the values of the RDD
- use `groupByKey` to group values by key
- use `reduceByKey` to aggregate values by key



### Actions
- `collect` - returns an array that contains all the elements of the RDD.
- `reduce` - reduces the elements of the RDD using a function.
- `count` - returns the number of elements in the RDD.
- `first` - returns the first element of the RDD.
- `take` - returns an array with the first n elements of the RDD.
- `saveAsTextFile` - saves the RDD as a text file.
- `saveAsObjectFile` - saves the RDD as an object file.
- `foreach` - applies a function to each element of the RDD.
- `foreachPartition` - applies a function to each partition of the RDD.