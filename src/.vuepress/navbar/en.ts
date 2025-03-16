import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  {
    text: "Posts",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "Algorithm",
        icon: "pen-to-square",
        prefix: "algorithm/",
        children: [
          { text: "LeetCode Q3", icon: "pen-to-square", link: "1" },
          { text: "LeetCode Q5", icon: "pen-to-square", link: "2" },
          { text: "LeetCode Q9", icon: "pen-to-square", link: "3" },
          { text: "LeetCode Q14", icon: "pen-to-square", link: "4" },
          { text: "LeetCode Q15", icon: "pen-to-square", link: "5" },
          { text: "LeetCode Q17", icon: "pen-to-square", link: "6" },
          { text: "LeetCode Q19", icon: "pen-to-square", link: "7" },
          { text: "LeetCode Q24", icon: "pen-to-square", link: "8" },
          { text: "LeetCode Q26", icon: "pen-to-square", link: "9" },
          { text: "Eratosthenes", icon: "pen-to-square", link: "10" },
          { text: "Find the Integer sqrt", icon: "pen-to-square", link: "11" },
          { text: "Reverse a linkedList", icon: "pen-to-square", link: "12" },
          { text: "The biggest product of three numbers", icon: "pen-to-square", link: "13" },
          { text: "Fibonacci", icon: "pen-to-square", link: "14" },
          { text: "Cycle linkedList", icon: "pen-to-square", link: "15" },
          { text: "Combine two sequenced arrays", icon: "pen-to-square", link: "16" },
          { text: "The max depth of a binary tree", icon: "pen-to-square", link: "17" },
          { text: "Longest Continuous Increasing Subsequence, LCIS", icon: "pen-to-square", link: "18" },
          { text: "KMP Algorithm", icon: "pen-to-square", link: "19" },
          { text: "Distributed Consistency Algorithms", icon: "pen-to-square", link: "20" },
          { text: "Question 146", icon: "pen-to-square", link: "21" },

        ],
      },
      {
        text: "AWS-SAA",
        icon: "pen-to-square",
        prefix: "aws-saa/",
        children: [
          { text: "Part 1", icon: "pen-to-square", link: "1" },
          { text: "Part 2", icon: "pen-to-square", link: "2" },
          { text: "Udemy Course", icon: "pen-to-square", link: "3" },
        ],
      },
      {
        text: "Cliché",
        icon: "pen-to-square",
        prefix: "cliché/",
        children: [
          { text: "Differences between @Autowired and @Resource", icon: "pen-to-square", link: "1" },
          { text: "B-Tree vs. B+ Tree in MySQL InnoDB", icon: "pen-to-square", link: "2" },
          { text: "MyBatis: Difference between `#` and `*`", icon: "pen-to-square", link: "3" },
          { text: "Commonly Used Spring Annotations", icon: "pen-to-square", link: "4" },
          { text: "Spring IOC (Inversion of Control)", icon: "pen-to-square", link: "5" },
          { text: "Horizontal and Vertical Scaling", icon: "pen-to-square", link: "6" },
          { text: "Java Reflection Mechanism", icon: "pen-to-square", link: "7" },
          { text: "MySQL Transaction Properties and Isolation Levels", icon: "pen-to-square", link: "8" },
          { text: "Redis Persistence Methods", icon: "pen-to-square", link: "9" },
          { text: "Pessimistic Locking vs Optimistic Locking", icon: "pen-to-square", link: "10" },
          { text: "Differences Between Local Storage, Cookies, Sessions, and Token", icon: "pen-to-square", link: "11" },
          { text: "BitMap", icon: "pen-to-square", link: "12" },
          { text: "BIO, NIO, AIO", icon: "pen-to-square", link: "13" },
        ],
      },
      {
        text: "China Merchant Bank",
        icon: "pen-to-square",
        prefix: "cmb/",
        children: [
          { text: "Week 1", icon: "pen-to-square", link: "1" },
          { text: "Week 2", icon: "pen-to-square", link: "2" },
          { text: "Week 3", icon: "pen-to-square", link: "3" },
          { text: "Week 4", icon: "pen-to-square", link: "4" },
          { text: "Week 5", icon: "pen-to-square", link: "5" },
          { text: "Week 6", icon: "pen-to-square", link: "6" },
          { text: "Week 7", icon: "pen-to-square", link: "7" },
          { text: "Week 8", icon: "pen-to-square", link: "8" },
          { text: "Week 9", icon: "pen-to-square", link: "9" },
        ],
      },
      {
        text: "Dubbo",
        icon: "pen-to-square",
        prefix: "dubbo/",
        children: [
          { text: "Concepts in Distributed Systems", icon: "pen-to-square", link: "1" },
          { text: "Dubbo Architecture", icon: "pen-to-square", link: "2" },
        ],
      },
      {
        text: "Docker",
        icon: "pen-to-square",
        prefix: "docker/",
        children: [
          { text: "Docker Volumes", icon: "pen-to-square", link: "1" },
        ],
      },
      {
        text: "ElasticSearch",
        icon: "pen-to-square",
        prefix: "elasticsearch/",
        children: [
          { text: "Concepts", icon: "pen-to-square", link: "1" },
        ],
      },
      {
        text: "Hadoop and Hive",
        icon: "pen-to-square",
        prefix: "hadoop/",
        children: [
          { text: "HDFS", icon: "pen-to-square", link: "HDFS" },
          { text: "MapReduce", icon: "pen-to-square", link: "MapReduce" },
          { text: "Yarn", icon: "pen-to-square", link: "Yarn" },
          { text: "Hive", icon: "pen-to-square", link: "Hive" },
        ],
      },
      {
        text: "Interview",
        icon: "pen-to-square",
        prefix: "interview/",
        children: [
          { text: "MySQL", icon: "pen-to-square", link: "1" },
          { text: "SSM", icon: "pen-to-square", link: "2" },
          { text: "MicroServices and SpringCloud", icon: "pen-to-square", link: "3" },
          { text: "Redis", icon: "pen-to-square", link: "4" },
          { text: "Message Queue", icon: "pen-to-square", link: "5" },
          { text: "Java Collections", icon: "pen-to-square", link: "6" },
          { text: "Java Concurrent Programming", icon: "pen-to-square", link: "7" },
          { text: "JVM", icon: "pen-to-square", link: "8" },
          { text: "Others", icon: "pen-to-square", link: "9" },
        ],
      },
      {
        text: "Kubernetes",
        icon: "pen-to-square",
        prefix: "kubernetes/",
        children: [
          { text: "Concepts", icon: "pen-to-square", link: "concepts/1" },
          { text: "Practices", icon: "pen-to-square", link: "practices/1" },
          { text: "MicroSvc", icon: "pen-to-square", link: "microsvc/1"}
        ],
      },
      {
        text: "MyBatis",
        icon: "pen-to-square",
        prefix: "mybatis/",
        children: [
          { text: "MyBatis", icon: "pen-to-square", link: "1" },
          { text: "MyBatis-Plus", icon: "pen-to-square", link: "2" },
        ],
      },
      {
        text: "NextJS",
        icon: "pen-to-square",
        prefix: "nextjs/",
        children: [
          { text: "React Hook", icon: "pen-to-square", link: "1" },
          { text: "File-Based Routing", icon: "pen-to-square", link: "2" },
          { text: "Vanilla Javascript Method", icon: "pen-to-square", link: "3" },
          { text: "Understanding `.module.css` in Next.js", icon: "pen-to-square", link: "4" },
          { text: "SSR and SSG", icon: "pen-to-square", link: "5" },
          { text: "Other Features", icon: "pen-to-square", link: "6" },
          { text: "API Routes in NextJS", icon: "pen-to-square", link: "7" },
          { text: "React Context API", icon: "pen-to-square", link: "8" },
        ],
      },
      {
        text: "NGINX",
        icon: "pen-to-square",
        prefix: "nginx/",
        children: [
          { text: "Basic", icon: "pen-to-square", link: "1" },
          { text: "Advanced", icon: "pen-to-square", link: "2" },
        ],
      },
      {
        text: "Unimelb Notes",
        icon: "pen-to-square",
        prefix: "unimelb/",
        children: [
          { text: "SWEN90016", icon: "pen-to-square", link: "SWEN90016" },
          { text: "COMP90048", icon: "pen-to-square", link: "COMP90048" },
          { text: "COMP90049", icon: "pen-to-square", link: "COMP90049" },
          { text: "COMP90050", icon: "pen-to-square", link: "COMP90050" },
          { text: "COMP90024", icon: "pen-to-square", link: "COMP90024" },

        ],
      },
      {
        text: "Typescript",
        icon: "pen-to-square",
        prefix: "typescript/",
        children: [
          { text: "Quick Start", icon: "pen-to-square", link: "1" },
          { text: "Object-Oriented", icon: "pen-to-square", link: "2" },
          { text: "Decorators", icon: "pen-to-square", link: "3" },
        ],
      },
    ]}
]);
