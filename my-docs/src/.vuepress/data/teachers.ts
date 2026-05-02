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
    "title": "实验中心副主任、工会主席",
    "role": "实验室创建者与负责人",
    "avatar": "/images/portfolio_img/teacher_temp.png",
    "shortBio": "主要从事仿生物视觉的目标检测理论及应用、智能视觉物联网理论与应用研究。",
    "researchAreas": [
      "仿生物视觉的目标检测理论及应用",
      "智能视觉物联网理论与应用"
    ],
    "link": "/teachers/zhangzhuo.html"
  },
  {
    "id": "huyinlong",
    "name": "胡银龙",
    "title": "青年教授、博士生导师",
    "role": "人工智能与自动化学院副院长",
    "avatar": "/images/teacher-photo/huyinlong-removebg.png",
    "shortBio": "主要从事漂浮式风电系统智能控制、AI驱动的智慧能源系统建模与优化、惯容系统分析与非线性控制等研究。",
    "researchAreas": [
      "漂浮式风电系统智能控制与数字孪生",
      "AI驱动的智慧能源系统建模与优化",
      "惯容（inerter）系统分析与非线性控制"
    ],
    "link": "/teachers/huyinlong.html"
  },
  {
    "id": "shipengfei",
    "name": "史朋飞",
    "title": "教授、博士生导师",
    "role": "教授/博导",
    "avatar": "/images/portfolio_img/teacher_temp.png",
    "shortBio": "主要从事人工智能、机器视觉、智能机器人、嵌入式系统、软硬件系统、智能体、软件开发等研究",
    "researchAreas": [
      "人工智能",
      "机器视觉",
      "智能机器人",
      "嵌入式系统",
      "软硬件系统",
      "智能体",
      "软件开发"
    ],
    "link": "/teachers/shipengfei.html"
  },
  {
    "id": "miaohongxia",
    "name": "苗红霞",
    "title": "副教授",
    "role": "副教授",
    "avatar": "/images/teacher-photo/miaohongxia-removebg.png",
    "shortBio": "主要从事电力设备在线监测与故障诊断、人工智能技术等研究。",
    "researchAreas": [
      "电力设备在线监测与故障诊断",
      "人工智能技术"
    ],
    "link": "/teachers/miaohongxia.html"
  },
  {
    "id": "jinjidong",
    "name": "金纪东",
    "title": "高级实验师",
    "role": "大创基地主任",
    "avatar": "/images/teacher-photo/jinjidong-removebg.png",
    "shortBio": "从事检测技术与自动化装置、嵌入式技术等方向的科研与教学，长期指导学生参加智能汽车竞赛、电子设计竞赛等",
    "researchAreas": [
      "检测技术与自动化装置",
      "嵌入式技术"
    ],
    "link": "/teachers/jinjidong.html"
  },
  {
    "id": "guyang",
    "name": "顾杨",
    "title": "讲师",
    "role": "讲师",
    "avatar": "/images/teacher-photo/guyang-removebg.png",
    "shortBio": "主要研究方向为深度强化学习、自然语言处理和机器人控制。围绕强化学习算法优化开展深入研究",
    "researchAreas": [
      "深度强化学习",
      "自然语言处理",
      "机器人控制",
      "多智能体协同",
      "具身智能",
      "人机交互"
    ],
    "link": "/teachers/guyang.html"
  }
];
