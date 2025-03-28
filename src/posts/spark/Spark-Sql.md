---
icon: pen-to-square
date: 2025-03-26
category:
  - Learning Records
tag:
  - Spark
---

# Spark SQL
Spark SQL is a Spark module for structured data processing. Unlike the basic Spark RDD API, Spark SQL provides interfaces that give Spark more information about the data structure and the computations being performed. Internally, Spark SQL uses this extra information to perform additional optimizations. There are multiple ways to interact with Spark SQL, including SQL and the Dataset API. When computing results, the same execution engine is used regardless of the API/language you use to express the computation.

SQL->Hive>MR->Jar->Run->JVM
## Quick Start```java
public class Spark_01 {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("Spark_01").setMaster("local");
        SparkContext sc = new SparkContext(conf);
        SparkSession spark = new SparkSession(sc);

        SparkSession sparkSession = SparkSession.builder()
                        .appName("Spark_01")
                        .master("local")
                        .getOrCreate();

        Dataset<Row> ds = sparkSession.read().json("data/user.json");
//        RDD<Row> rdd = ds.rdd();
        ds.createOrReplaceTempView("user");
        sparkSession.sql("SELECT email FROM user").show();
        spark.close();
    }
}
```

### Shift between SparkSQL and RDD

### Shift bewteeen different object types

### UDF
- 每一行数据都会用一次函数
```java
sparkSession.udf().register("name", (UDF1<String, String>) o -> null, DataTypes.StringType);
```

### UDAF
- Aggregates all data to produce a single result
- Requires a buffer to store intermediate results
```java
sparkSession.udf().register("name", (UDAF1<String, String>) (acc, o) -> null, DataTypes.StringType);
```

## Data Source
可以读一种类型 写出另外一种类型 通过dataset这种内置的转换

### CSV
```java
sparkSession.read().option.header("true").csv("data/user.csv")
```
### JSON
```java
sparkSession.read().json("data/user.json")
```

### Parquet
Parquet is a columnar storage format that supports complex data types, has high compression rates, and offers fast query performance.
```java
sparkSession.read().parquet("data/user.parquet")
```
:::info
### Row-based storage: fast query, slow statistics
### Column-based storage: fast statistics, slow query
:::

### MySQL
```java
        // 添加参数
        Properties properties = new Properties();
        properties.setProperty("user","root");
        properties.setProperty("password","000000");

//        json.write()
//                // 写出模式针对于表格追加覆盖
//                .mode(SaveMode.Append)
//                .jdbc("jdbc:mysql://hadoop102:3306","gmall.testInfo",properties);

        Dataset<Row> jdbc = spark.read().jdbc("jdbc:mysql://hadoop102:3306/gmall?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=true", "test_info", properties);
```

### Hive
- SparkSQL可以采用内嵌Hive（spark开箱即用的hive），也可以采用外部Hive。企业开发中，通常采用外部Hive。

#### Steps:
1. Add the MySQL connection driver to the spark-yarn jars directory,
2. Start the spark-sql client,
3. Add dependencies in Maven,
4. Copy hive-site.xml to the resources directory (if you need to operate Hadoop, copy hdfs-site.xml, core-site.xml, and yarn-site.xml)
```java 
    public static void main(String[] args) {

        System.setProperty("HADOOP_USER_NAME","atguigu");

        //1. 创建配置对象
        SparkConf conf = new SparkConf().setAppName("sparksql").setMaster("local[*]");

        //2. 获取sparkSession
        SparkSession spark = SparkSession.builder()
                .enableHiveSupport()// 添加hive支持
                .config(conf).getOrCreate();

        //3. 编写代码
        spark.sql("show tables").show();

        spark.sql("create table user_info(name String,age bigint)");
        spark.sql("insert into table user_info values('zhangsan',10)");
        spark.sql("select * from user_info").show();

        //4. 关闭sparkSession
        spark.close();
    
```
