import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "首页", icon: "house", link: "/" },
  { text: "负责老师", icon: "user-tie", link: "/portfolio" },
  { text: "资源库", icon: "flask-vial", link: "/demo/resources/" },
  { text: "研究队伍", icon: "users", link: "/demo/members-list" },
  { text: "加入我们", icon: "user-plus", link: "/join-us" },
]);
