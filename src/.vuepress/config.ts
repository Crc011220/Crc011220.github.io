import { defineUserConfig } from "vuepress";

import theme from "./theme.js";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export default defineUserConfig({
  base: "/personalweb/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Richard Chen",
      description: "Richard Chen's personal blog",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Richard Chen",
      description: "若尘的博客",
    },
  },

  theme,

  head: [
    [
      "script",
      {
        src: "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js",
        async: true,
      },
    ],
  ],

  plugins: [
    docsearchPlugin({
      appId: "6264MA721Y",

      apiKey: "006ddc432bcbe37fa6582bde28e2a386",

      indexName: "crc011220io",
      locales: {
        '/': {
          placeholder: 'Search Blogs',
          translations: {
            button: {
              buttonText: 'Search Blogs',
            },
          },
        },
        '/zh/': {
          placeholder: '搜索文档',
          translations: {
            button: {
              buttonText: '搜索文档',
            },
          },
        },
      },
    }),
  ],
  // Enable it with pwa
  // shouldPrefetch: false,
});






