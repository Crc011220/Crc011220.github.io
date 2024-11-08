import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  {
    text: "Learning Posts",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "AWS-SAA",
        icon: "pen-to-square",
        prefix: "aws-saa/",
        children: [
          { text: "AWS-SAA", icon: "pen-to-square", link: "1" },
        ],
      },
      {
        text: "Cliché",
        icon: "pen-to-square",
        prefix: "cliché/",
        children: [
          { text: "Cliché", icon: "pen-to-square", link: "1" },
        ],
      },
      {
        text: "Kubernetes",
        icon: "pen-to-square",
        prefix: "kubernetes/",
        children: [
          { text: "Concepts", icon: "pen-to-square", link: "concepts/1" },
          { text: "Practices", icon: "pen-to-square", link: "practices/1" },
        ],
      },
      {
        text: "LeetCode",
        icon: "pen-to-square",
        prefix: "leetcode/",
        children: [
          { text: "LeetCode", icon: "pen-to-square", link: "1" },
        ],
      },
      {
        text: "Swen90016",
        icon: "pen-to-square",
        prefix: "swen90016/",
        children: [
          { text: "Swen90016", icon: "pen-to-square", link: "1" },
        ],
      },
    ]}
]);
