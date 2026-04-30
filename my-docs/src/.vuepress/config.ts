import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  bundler: viteBundler({
    viteOptions: {
      server: {
        proxy: {
          "/api": {
            target: "http://127.0.0.1:8080",
            changeOrigin: true,
            secure: false,
            rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
          },
        },
      },
    },
  }),

  lang: "zh-CN",
  title: "河海大学智泽实验室",
  description: "",

  // 网站图标（浏览器标签页小图标）
  head: [
    ["link", { rel: "icon", href: "/images/logos/zhizelab_logo_ss.png" }],
    // 不蒜子访问量统计脚本
    ["script", { async: true, src: "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" }],
  ],

  theme,

  // 客户端配置文件
  clientConfigFile: path.resolve(__dirname, "./client.ts"),

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
