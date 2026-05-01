/**
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

export const allTeachers: TeacherCard[] = [
  {
    "id": "zhangzhuo",
    "name": "张卓",
    "title": "高级工程师",
    "role": "实验室创建者与负责人",
    "avatar": "/images/portfolio_img/teacher_temp.png",
    "shortBio": "深度学习与智能数据分析专家，智慧施工与智慧水利研究方向带头人",
    "researchAreas": [
      "深度学习",
      "智能数据分析",
      "智慧施工",
      "智慧水利"
    ],
    "link": "/teachers/zhangzhuo.html"
  },
  {
    "id": "huyinlong",
    "name": "胡银龙",
    "title": "教授",
    "role": "学术顾问",
    "avatar": "/images/teacher-photo/huyinlong-removebg.png",
    "shortBio": "计算机视觉与机器人系统专家，专注于多模态感知与自主导航",
    "researchAreas": [
      "计算机视觉",
      "机器人系统",
      "多模态感知",
      "自主导航"
    ],
    "link": "/teachers/huyinlong.html"
  },
  {
    "id": "shipengfei",
    "name": "史朋飞",
    "title": "副教授",
    "role": "核心指导老师",
    "avatar": "/images/portfolio_img/teacher_temp.png",
    "shortBio": "研究方向简介",
    "researchAreas": [
      "研究方向1",
      "研究方向2"
    ],
    "link": "/teachers/shipengfei.html"
  },
  {
    "id": "miaohongxia",
    "name": "苗红霞",
    "title": "讲师",
    "role": "青年骨干老师",
    "avatar": "/images/portfolio_img/teacher_temp.png",
    "shortBio": "研究方向简介",
    "researchAreas": [
      "研究方向1",
      "研究方向2"
    ],
    "link": "/teachers/miaohongxia.html"
  },
  {
    "id": "jinjidong",
    "name": "金纪东",
    "title": "高级工程师",
    "role": "工程实践指导老师",
    "avatar": "/images/portfolio_img/teacher_temp.png",
    "shortBio": "研究方向简介",
    "researchAreas": [
      "研究方向1",
      "研究方向2"
    ],
    "link": "/teachers/jinjidong.html"
  },
  {
    "id": "guyang",
    "name": "顾杨",
    "title": "副教授",
    "role": "竞赛指导老师",
    "avatar": "/images/teacher-photo/guyang-removebg.png",
    "shortBio": "研究方向简介",
    "researchAreas": [
      "研究方向1",
      "研究方向2"
    ],
    "link": "/teachers/guyang.html"
  }
];
