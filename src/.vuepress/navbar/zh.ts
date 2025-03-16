import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/zh/",
  {
    text: "笔记",
    icon: "pen-to-square",
    prefix: "/zh/posts/",
    children: [
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
    ],
  }
]);
