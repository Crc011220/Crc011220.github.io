import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import theme from "./theme.js";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export default defineUserConfig({
  base: "/",
  locales: {
    "/": {
      lang: "en-US",
      title: "Ruochen Chen",
      description: "Ruochen Chen's personal blog",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Ruochen Chen",
      description: "若尘的博客",
    },
  },

  theme,

  head: [
    ["link", { rel: "icon", href: "/mac.ico" }],
    // [
    //   "script",
    //   {
    //     src: "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js",
    //     async: true,
    //   },
    // ],
  ],

  plugins: [
    docsearchPlugin({
      appId: "HQLAF3SKP7",

      apiKey: "4d988bf659cf371283265b50e983f30d",

      indexName: "rcchen-dpdns",
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

