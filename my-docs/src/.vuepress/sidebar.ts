import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    { text: "首页", icon: "house", link: "/" },
    { text: "负责老师", icon: "graduation-cap", link: "portfolio" },
    { text: "成果展示", icon: "trophy", link: "demo/success" },
    {
      text: "资源库",
      icon: "folder-tree",
      prefix: "demo/resources/",
      link: "demo/resources/",
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
        "hardware-training",
        "machine-learning-training",
      ],
    },
    { text: "加入我们", icon: "user-plus", link: "join-us" },
  ],
});
