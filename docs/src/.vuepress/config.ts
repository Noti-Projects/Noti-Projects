import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Noti 项目文档",
      description: "Noti 项目的完整文档，包含 Android、Server、Web 和文档部分",
    }
  },

  theme,
});
