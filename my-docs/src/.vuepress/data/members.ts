/**
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

export const allMembers: MemberItem[] = [
  {
    "id": "lisi",
    "name": "李四",
    "title": "核心成员",
    "desc": "研究方向为大语言模型与自然语言处理，热衷于探索AI前沿技术。",
    "badge": "21-01",
    "link": "/demo/team/lisi.html",
    "grade": "22级",
    "major": "智能科学与技术"
  },
  {
    "id": "liuhongyu",
    "name": "刘鸿宇",
    "title": "新成员",
    "desc": "对数据挖掘与机器学习有浓厚兴趣，正在积极探索科研方向。",
    "badge": "/images/team-member/liuhongyu.png",
    "link": "/demo/team/liuhongyu.html",
    "grade": "24级",
    "major": "大数据管理与应用"
  },
  {
    "id": "wenkang",
    "name": "文康",
    "title": "新成员",
    "desc": "人工智能方向新人，对深度学习与计算机视觉充满热情。",
    "badge": "/images/main_img/hhu-bridge.png",
    "link": "/demo/team/wenkang.html",
    "grade": "24级",
    "major": "人工智能"
  },
  {
    "id": "zhangsan",
    "name": "张三",
    "title": "核心成员",
    "desc": "专注于深度学习与计算机视觉研究，多次在国家级竞赛中获奖。",
    "badge": "/images/main_img/hhu-bridge.png",
    "link": "/demo/team/zhangsan.html",
    "grade": "21级",
    "major": "人工智能"
  }
];
