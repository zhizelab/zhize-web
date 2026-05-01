import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { getDirname, path } from "vuepress/utils";
import fs from "node:fs";

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

  head: [
    ["link", { rel: "icon", href: "/images/logos/zhizelab_logo_ss.png" }],
    ["script", { async: true, src: "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" }],
  ],

  theme,

  clientConfigFile: path.resolve(__dirname, "./client.ts"),

  // 启动时自动扫描 teachers/*.md 的 frontmatter，生成 teachers.ts
  async onInitialized(app) {
    const teacherPages = app.pages
      .filter((p) => p.path.startsWith("/teachers/") && p.frontmatter.id)
      .sort((a, b) => (a.frontmatter.order || 999) - (b.frontmatter.order || 999));

    const teachers = teacherPages.map((p) => {
      const fm = p.frontmatter;
      return {
        id: String(fm.id || ""),
        name: String(fm.name || ""),
        title: String(fm.rank || ""),
        role: String(fm.role || ""),
        avatar: String(fm.avatar || ""),
        shortBio: String(fm.shortBio || ""),
        researchAreas: Array.isArray(fm.researchAreas) ? fm.researchAreas : [],
        link: p.path,
      };
    });

    const json = JSON.stringify(teachers, null, 2);

    const tsContent = `/**
 * 教师完整信息接口（用于详情页 TeacherProfile 组件）
 */
export interface Teacher {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
  photo: string;
  shortBio: string;
  researchAreas: string[];
  email: string;
  office: string;
  education: string[];
  bio: string;
  achievements: string[];
  courses: string[];
  publications?: string[];
  projects?: string[];
  awards?: string[];
  students?: string;
  link: string;
}

/**
 * 卡片墙用的轻量信息
 * ⚠️ 本文件由 VuePress onInitialized 钩子自动生成，请勿手动修改
 *    改图片/信息请直接编辑 src/teachers/*.md 的 frontmatter
 */
export interface TeacherCard {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
  shortBio: string;
  researchAreas: string[];
  link: string;
}

export const allTeachers: TeacherCard[] = ${json};
`;

    fs.writeFileSync(path.resolve(__dirname, "./data/teachers.ts"), tsContent, "utf-8");
    console.log(`[teachers] 已同步 ${teachers.length} 位教师数据`);

    /* ===== 成员数据生成 ===== */
    const memberPages = app.pages
      .filter((p) => p.path.startsWith("/demo/team/") && p.frontmatter.id)
      .sort((a, b) => (a.frontmatter.order || 999) - (b.frontmatter.order || 999));

    const members = memberPages.map((p) => {
      const fm = p.frontmatter;
      return {
        id: String(fm.id || ""),
        name: String(fm.name || ""),
        title: String(fm.role || ""),
        desc: String(fm.shortBio || ""),
        badge: String(fm.avatar || ""),
        link: p.path,
        grade: String(fm.grade || ""),
        major: String(fm.major || ""),
      };
    });

    const membersJson = JSON.stringify(members, null, 2);

    const membersTsContent = `/**
 * 成员完整信息接口（用于详情页 MemberProfile 组件）
 */
export interface MemberProfileData {
  id: string;
  name: string;
  grade: string;
  major: string;
  role: string;
  avatar: string;
  photo: string;
  shortBio: string;
  researchAreas: string[];
  email: string;
  skills?: string[];
  projects?: string[];
  awards?: string[];
  bio: string;
  link: string;
}

/**
 * 卡片墙用的轻量信息
 * ⚠️ 本文件由 VuePress onInitialized 钩子自动生成，请勿手动修改
 *    改信息请直接编辑 src/demo/team/*.md 的 frontmatter
 */
export interface MemberItem {
  id: string;
  name: string;
  title: string;
  desc: string;
  badge: string;
  link: string;
  grade: string;
  major: string;
}

export const allMembers: MemberItem[] = ${membersJson};
`;

    fs.writeFileSync(path.resolve(__dirname, "./data/members.ts"), membersTsContent, "utf-8");
    console.log(`[members] 已同步 ${members.length} 位成员数据`);
  },
});
