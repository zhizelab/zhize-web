import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "智泽实验室",
  description: "⼈⼯智能+产业融合升级的⻅证者、实践者、推动者",

  // 网站图标（浏览器标签页小图标）
  head: [
    ["link", { rel: "icon", href: "/images/zhizelab_logo_ss.png" }],
  ],

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
