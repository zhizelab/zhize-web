import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    "portfolio",
    {
      text: "关于实验室",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: [
        {
          text: "ROS培训",
          icon: "robot",
          prefix: "ROStrain/",
          link: "ROStrain/",
          children: [
            "environment",
            "nav",
            "imageProcessing",
            "visionTraining",
          ],
        },
        {
          text: "硬件培训",
          icon: "plug",
          prefix: "HardWare/",
          link: "HardWare/",
          children: [

          ],
        }
      ],
    },
    {
      text: "文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    },
  ],
});
