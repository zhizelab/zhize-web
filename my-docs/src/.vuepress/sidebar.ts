import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    "portfolio",
    "join-us",
    {
      text: "关于实验室",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: [
        {
          text: "研究队伍",
          icon: "users",
          link: "members-list",
          
        },
        {
          text: "成果展示",
          icon: "trophy",
          link: "success",
        },
        {
          text: "资源库",
          icon: "folder-tree",
          prefix: "resources/",
          link: "resources/",
          collapsible: true,
          expanded: false,
          children: [
            {
              text: "ROS培训",
              icon: "robot",
              prefix: "ROStrain/",
              link: "ROStrain/",
              collapsible: true,
              expanded: false,
              children: [
                "environment",
                "nav",
                "imageProcessing",
                "visionTraining",
              ],
            },
            "lab-point-cloud-detail/lab-point-cloud-detail",
            "hardware-training",
            "machine-learning-training",
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
