import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/zh/",
  {
    text: "笔记",
    icon: "pen-to-square",
    prefix: "/zh/posts/",
    children: [
      {
        text: "算法",
        icon: "pen-to-square",
        prefix: "algo/",
        children: [
          { text: "数组", icon: "pen-to-square", link: "数组" },
          { text: "链表", icon: "pen-to-square", link: "链表" },
          { text: "字符串", icon: "pen-to-square", link: "字符串" },
          { text: "栈和队列", icon: "pen-to-square", link: "栈和队列" },
          { text: "二叉树", icon: "pen-to-square", link: "二叉树" },
          { text: "图", icon: "pen-to-square", link: "图" },
          { text: "哈希", icon: "pen-to-square", link: "哈希" },
          { text: "双指针", icon: "pen-to-square", link: "双指针" },
          { text: "动态规划", icon: "pen-to-square", link: "动态规划" },
          { text: "回溯", icon: "pen-to-square", link: "回溯" },
          { text: "贪心", icon: "pen-to-square", link: "贪心" },
          { text: "单调栈", icon: "pen-to-square", link: "单调栈" },
          { text: "位运算", icon: "pen-to-square", link: "位运算" },
          { text: "其他", icon: "pen-to-square", link: "其他" },
        ],
      },
      {
        text: "招商银行",
        icon: "pen-to-square",
        prefix: "cmb/",
        children: [
          { text: "实习记录", icon: "pen-to-square", link: "review" },
        ],
      },
      {
        text: "日常记录",
        icon: "pen-to-square",
        prefix: "daily/",
        children: [
          { text: "CE项目", icon: "pen-to-square", link: "CE-project" },
          { text: "Good MCP", icon: "pen-to-square", link: "good_mcp" },
          { text: "Skills", icon: "pen-to-square", link: "skills" },
        ],
      },
      {
        text: "声明式编程",
        icon: "pen-to-square",
        prefix: "declarative/",
        children: [
          { text: "Haskell", icon: "pen-to-square", link: "haskell" },
          { text: "Haskell速记", icon: "pen-to-square", link: "haskell速记" },
          { text: "Prolog", icon: "pen-to-square", link: "prolog" },
          { text: "Prolog速记", icon: "pen-to-square", link: "prolog速记" },
        ],
      },
      {
        text: "深度学习",
        icon: "pen-to-square",
        prefix: "deep-learning/",
        children: [
          { text: "深度学习基础", icon: "pen-to-square", link: "1" },
          { text: "深度学习进阶", icon: "pen-to-square", link: "2" },
          { text: "深度学习应用", icon: "pen-to-square", link: "3" },
          { text: "深度学习优化", icon: "pen-to-square", link: "4" },
          { text: "深度学习实践", icon: "pen-to-square", link: "5" },
          { text: "卷积神经网络CNN", icon: "pen-to-square", link: "卷积神经网络CNN" },
          { text: "循环神经网络RNN", icon: "pen-to-square", link: "循环神经网络RNN" },
        ],
      },
      {
        text: "Hive",
        icon: "pen-to-square",
        prefix: "hive/",
        children: [
          { text: "Hive语法大全", icon: "pen-to-square", link: "Hive-SQL语法大全" },
        ],
      },
      {
        text: "Java8特性",
        icon: "pen-to-square",
        prefix: "java8/",
        children: [
          { text: "函数式编程", icon: "pen-to-square", link: "函数式编程" },
        ],
      },
      {
        text: "自然语言处理",
        icon: "pen-to-square",
        prefix: "nlp/",
        children: [
          { text: "NLP基础", icon: "pen-to-square", link: "1" },
          { text: "NLP进阶", icon: "pen-to-square", link: "2" },
        ],
      },
      {
        text: "Netty",
        icon: "pen-to-square",
        prefix: "netty/",
        children: [
          { text: "Nio介绍", icon: "pen-to-square", link: "Netty01-nio" },
          { text: "Netty入门", icon: "pen-to-square", link: "Netty02-intro" },
          { text: "Netty进阶", icon: "pen-to-square", link: "Netty03-进阶" },
          { text: "Netty优化", icon: "pen-to-square", link: "Netty04-优化与源码" },
        ],
      },
      {
        text: "NGINX",
        icon: "pen-to-square",
        prefix: "nginx/",
        children: [
          { text: "NGINX 高级", icon: "pen-to-square", link: "1" },
        ],
      },
      {
        text: "Python",
        icon: "pen-to-square",
        prefix: "py/",
        children: [
          { text: "NumPy", icon: "pen-to-square", link: "numpy" },
          { text: "Pandas", icon: "pen-to-square", link: "pandas" },
        ],
      },
      {
        text: "复习笔记",
        icon: "pen-to-square",
        prefix: "review/",
        children: [
          { text: "面试要点", icon: "pen-to-square", link: "面试要点" },
          { text: "数据结构", icon: "pen-to-square", link: "数据结构" },
          { text: "算法", icon: "pen-to-square", link: "其他问题" },
          { text: "操作系统", icon: "pen-to-square", link: "操作系统" },
          { text: "计算机网络", icon: "pen-to-square", link: "计算机网络" },
          { text: "数据库", icon: "pen-to-square", link: "数据库" },
          { text: "计算机组成原理", icon: "pen-to-square", link: "计算机组成原理" },
          { text: "信息新技术", icon: "pen-to-square", link: "信息新技术" },
          { text: "数学", icon: "pen-to-square", link: "数学" },
          { text: "词汇", icon: "pen-to-square", link: "词汇" },
        ],
      },
    ],
  }
]);
