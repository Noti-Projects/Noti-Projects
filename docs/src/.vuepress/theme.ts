import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://noti-docs.netlify.app",

  author: {
    name: "CCViolett",
    url: "https://github.com/CCViolett",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/logo.png",

  repo: "CCViolett/noti",

  docsDir: "src",

  navbar: [
    {
      text: "主页",
      link: "/",
      icon: "home"
    },
    {
      text: "Android",
      link: "/android/",
      icon: "android"
    },
    {
      text: "服务器",
      link: "/server/",
      icon: "server"
    },
    {
      text: "Web",
      link: "/web/",
      icon: "chrome"
    }
  ],

  sidebar: {
    "/": [
      {
        text: "指南",
        link: "/",
        children: [
          "README.md",
          "guide/getting-started.md",
          "guide/architecture.md"
        ]
      }
    ],
    "/android/": [
      {
        text: "Android 客户端",
        children: [
          "README.md",
          "notification.md"
        ]
      }
    ],
    "/server/": [
      {
        text: "服务器",
        children: [
          "README.md",
          "api.md"
        ]
      }
    ],
    "/web/": [
      {
        text: "Web 前端",
        children: [
          "README.md"
        ]
      }
    ]
  },

  footer: "MIT Licensed",
  displayFooter: true,

  plugins: {
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: ["highlight", "math", "search", "notes", "zoom"],
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
  },
});
