import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  {
    text: "Posts",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "AI",
        icon: "pen-to-square",
        prefix: "ai/",
        children: [
          { text: "AI Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Algorithm",
        icon: "pen-to-square",
        prefix: "algorithm/",
        children: [
          { text: "Algorithm Contents", icon: "pen-to-square", link: "index" },

        ],
      },
      {
        text: "AWS-SAA",
        icon: "pen-to-square",
        prefix: "aws-saa/",
        children: [
          { text: "AWS-SAA Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Cliché",
        icon: "pen-to-square",
        prefix: "cliché/",
        children: [
          { text: "Cliché Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "China Merchant Bank",
        icon: "pen-to-square",
        prefix: "cmb/",
        children: [
          { text: "CMB Internship Record", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Docker",
        icon: "pen-to-square",
        prefix: "docker/",
        children: [
          { text: "Docker Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Dubbo",
        icon: "pen-to-square",
        prefix: "dubbo/",
        children: [
          { text: "Dubbo Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "ElasticSearch",
        icon: "pen-to-square",
        prefix: "elasticsearch/",
        children: [
          { text: "ElasticSearch Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Hadoop and Hive",
        icon: "pen-to-square",
        prefix: "hadoop/",
        children: [
          { text: "Hadoop and Hive Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Interview",
        icon: "pen-to-square",
        prefix: "interview/",
        children: [
          { text: "Interview Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Istio",
        icon: "pen-to-square",
        prefix: "istio/",
        children: [
          { text: "Istio Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "JD",
        icon: "pen-to-square",
        prefix: "jd/",
        children: [
          { text: "JD Notes", icon: "pen-to-square", link: "note" },
        ],
      },
      {
        text: "Kubernetes",
        icon: "pen-to-square",
        prefix: "kubernetes/",
        children: [
          { text: "Concepts", icon: "pen-to-square", link: "concepts/index" },
          { text: "Practices", icon: "pen-to-square", link: "practices/index" },
          { text: "MicroSvc", icon: "pen-to-square", link: "microsvc/index"}
        ],
      },
      {
        text: "MyBatis",
        icon: "pen-to-square",
        prefix: "mybatis/",
        children: [
          { text: "MyBatis Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "NextJS",
        icon: "pen-to-square",
        prefix: "nextjs/",
        children: [
          { text: "NextJS Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "NGINX",
        icon: "pen-to-square",
        prefix: "nginx/",
        children: [
          { text: "NGINX Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Note",
        icon: "pen-to-square",
        prefix: "note/",
        children: [
          { text: "Notes", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Spark",
        icon: "pen-to-square",
        prefix: "spark/",
        children: [
          { text: "Spark Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Tailwind CSS",
        icon: "pen-to-square",
        prefix: "tailwind/",
        children: [
          { text: "Tailwind CSS Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Typescript",
        icon: "pen-to-square",
        prefix: "typescript/",
        children: [
          { text: "Typescript Contents", icon: "pen-to-square", link: "index" },
        ],
      },
      {
        text: "Unimelb Notes",
        icon: "pen-to-square",
        prefix: "unimelb/",
        children: [
          { text: "Unimelb Notes Contents", icon: "pen-to-square", link: "index" },

        ],
      },

    ]}
]);
