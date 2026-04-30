export interface Teacher {
  /** 唯一标识，用于路由 */
  id: string;
  /** 姓名 */
  name: string;
  /** 职称，如 高级工程师、教授、副教授 */
  title: string;
  /** 实验室角色，如 实验室负责人、指导老师 */
  role: string;
  /** 半身照（展示页卡片用） */
  avatar: string;
  /** 详情页大图 */
  photo: string;
  /** 一句话简介 */
  shortBio: string;
  /** 研究方向标签 */
  researchAreas: string[];
  /** 邮箱 */
  email: string;
  /** 办公室 */
  office: string;
  /** 教育背景 */
  education: string[];
  /** 详细介绍（支持 HTML/Markdown） */
  bio: string;
  /** 主要成就/荣誉 */
  achievements: string[];
  /** 主讲课程 */
  courses: string[];
  /** 代表论文（可选） */
  publications?: string[];
  /** 科研项目（可选） */
  projects?: string[];
  /** 获奖情况（可选） */
  awards?: string[];
  /** 指导学生情况（可选） */
  students?: string;
  /** 详情页链接 */
  link: string;
}

export const allTeachers: Teacher[] = [
  {
    id: "zhangzhuo",
    name: "张卓",
    title: "高级工程师",
    role: "实验室创建者与负责人",
    avatar: "/images/portfolio_img/teacher_temp.png",
    photo: "/images/portfolio_img/teacher_temp.png",
    shortBio: "深度学习与智能数据分析专家，智慧施工与智慧水利研究方向带头人",
    researchAreas: ["深度学习", "智能数据分析", "智慧施工", "智慧水利"],
    email: "zhangzhuo@hhu.edu.cn",
    office: "人工智能与自动化学院 212 室",
    education: [
      "博士，计算机科学与技术，某重点大学",
      "硕士，软件工程，某重点大学",
    ],
    bio: `张卓老师是本实验室的创建者与负责人。她长期致力于深度学习、智能数据分析与相关领域的应用研究。张老师以其深厚的学术造诣和前瞻性的科研视野，为实验室确立了面向智慧施工以及智慧水利的智能决策等前沿研究方向，并承担了多项国家级和省部级科研项目。`,
    achievements: [
      "承担多项国家级和省部级科研项目",
      "指导学生在中国软件杯、服务外包创新创业竞赛、全球人工智能算法精英赛等多项赛事取得佳绩",
      "培养众多毕业生已成为学术界和工业界的中坚力量",
    ],
    courses: ["深度学习", "智能数据分析", "Python 程序设计"],
    publications: [
      "基于深度学习的智慧施工安全监测方法研究",
      "面向水利场景的智能决策系统设计与实现",
    ],
    projects: [
      "国家自然科学基金项目：XXX",
      "省部级科研项目：智慧水利大数据平台",
    ],
    awards: [
      "省级教学成果奖",
      "校级优秀教师",
    ],
    students: "指导硕士研究生 10 余名，本科生创新项目团队多个",
    link: "/teachers/zhangzhuo.html",
  },
  {
    id: "wanglin",
    name: "王林",
    title: "教授",
    role: "学术顾问",
    avatar: "/images/portfolio_img/teacher_temp.png",
    photo: "/images/portfolio_img/teacher_temp.png",
    shortBio: "计算机视觉与机器人系统专家，专注于多模态感知与自主导航",
    researchAreas: ["计算机视觉", "机器人系统", "多模态感知", "自主导航"],
    email: "wanglin@hhu.edu.cn",
    office: "人工智能与自动化学院 305 室",
    education: [
      "博士，控制科学与工程，某重点大学",
      "硕士，模式识别与智能系统，某重点大学",
    ],
    bio: `王林教授是计算机视觉与机器人系统领域的知名专家。他的研究聚焦于多模态感知与自主导航技术，致力于将先进的视觉算法应用于实际机器人平台。王教授在顶级国际期刊和会议上发表了大量高水平论文，并主持了多项国家重点研发计划课题。`,
    achievements: [
      "国家重点研发计划课题负责人",
      "顶级国际期刊审稿人",
      "IEEE 高级会员",
    ],
    courses: ["计算机视觉", "机器人学导论", "模式识别"],
    publications: [
      "Multi-modal Perception for Autonomous Navigation in Dynamic Environments",
      "A Novel Visual SLAM Framework with Semantic Understanding",
    ],
    projects: [
      "国家重点研发计划：智能机器人感知与决策",
      "国家自然科学基金重点项目",
    ],
    awards: [
      "国家科技进步二等奖",
      "教育部自然科学一等奖",
    ],
    students: "指导博士研究生 5 名，硕士研究生 15 名",
    link: "/teachers/wanglin.html",
  },
  {
    id: "lichen",
    name: "李辰",
    title: "副教授",
    role: "核心指导老师",
    avatar: "/images/portfolio_img/teacher_temp.png",
    photo: "/images/portfolio_img/teacher_temp.png",
    shortBio: "嵌入式系统与物联网专家，擅长边缘计算与实时系统开发",
    researchAreas: ["嵌入式系统", "物联网", "边缘计算", "实时系统"],
    email: "lichen@hhu.edu.cn",
    office: "人工智能与自动化学院 208 室",
    education: [
      "博士，电子科学与技术，某重点大学",
      "硕士，微电子学与固体电子学，某重点大学",
    ],
    bio: `李辰副教授专注于嵌入式系统与物联网技术的研究。他在边缘计算、实时系统开发以及低功耗设计方面有着丰富的经验。李老师主导了实验室多个硬件项目的开发，包括智能传感器节点、嵌入式视觉平台等。`,
    achievements: [
      "主持多项企业横向合作项目",
      "获授权发明专利 8 项",
      "指导学生获全国电子设计竞赛一等奖",
    ],
    courses: ["嵌入式系统设计", "物联网技术", "微机原理与接口技术"],
    publications: [
      "Edge Computing Architecture for Real-time Water Quality Monitoring",
      "Low-power Design of Wireless Sensor Networks in Agricultural Applications",
    ],
    projects: [
      "企业合作项目：智慧农业物联网平台",
      "省自然科学基金：面向水利监测的边缘智能方法",
    ],
    awards: [
      "全国电子设计竞赛优秀指导教师",
      "校级青年教师教学竞赛一等奖",
    ],
    students: "指导硕士研究生 8 名，本科生竞赛团队多个",
    link: "/teachers/lichen.html",
  },
  {
    id: "zhaoyue",
    name: "赵玥",
    title: "讲师",
    role: "青年骨干老师",
    avatar: "/images/portfolio_img/teacher_temp.png",
    photo: "/images/portfolio_img/teacher_temp.png",
    shortBio: "自然语言处理与知识图谱研究方向，关注大模型应用落地",
    researchAreas: ["自然语言处理", "知识图谱", "大模型应用", "文本挖掘"],
    email: "zhaoyue@hhu.edu.cn",
    office: "人工智能与自动化学院 210 室",
    education: [
      "博士，人工智能，某重点大学",
      "硕士，计算机应用技术，某重点大学",
    ],
    bio: `赵玥老师是实验室的青年骨干力量。她的研究方向为自然语言处理与知识图谱，近期重点关注大语言模型在行业场景中的应用落地。赵老师善于将前沿技术与实际需求相结合，带领学生完成了多个有影响力的项目。`,
    achievements: [
      "发表 CCF-A/B 类论文 6 篇",
      "主持国家自然科学基金青年项目",
      "获省级优秀博士论文奖",
    ],
    courses: ["自然语言处理", "知识图谱技术", "人工智能导论"],
    publications: [
      "Domain-specific Knowledge Graph Construction Based on Large Language Models",
      "Few-shot Text Classification with Prompt-based Learning",
    ],
    projects: [
      "国家自然科学基金（青年）：面向水利领域的知识图谱构建方法研究",
      "校级人才引进项目",
    ],
    awards: [
      "省级优秀博士论文",
      "国际会议最佳论文提名",
    ],
    students: "指导硕士研究生 4 名，本科生科研训练项目多个",
    link: "/teachers/zhaoyue.html",
  },
  {
    id: "sunwei",
    name: "孙伟",
    title: "高级工程师",
    role: "工程实践指导老师",
    avatar: "/images/portfolio_img/teacher_temp.png",
    photo: "/images/portfolio_img/teacher_temp.png",
    shortBio: "软件工程与系统架构专家，丰富的工业界项目经验",
    researchAreas: ["软件工程", "系统架构", "DevOps", "云原生技术"],
    email: "sunwei@hhu.edu.cn",
    office: "人工智能与自动化学院 215 室",
    education: [
      "硕士，软件工程，某重点大学",
      "本科，计算机科学与技术，某重点大学",
    ],
    bio: `孙伟老师拥有丰富的工业界工作经验，曾在知名科技企业担任技术负责人。他专注于软件工程实践、系统架构设计以及云原生技术的教学与研究。孙老师将真实的工程经验带入课堂，帮助学生建立从代码到系统的完整工程思维。`,
    achievements: [
      "10 年以上大型软件系统开发经验",
      "主导过千万级用户系统的架构设计",
      "指导学生获服务外包创新创业竞赛全国一等奖",
    ],
    courses: ["软件工程", "系统架构设计", "云计算技术"],
    publications: [
      "基于微服务架构的智慧校园平台设计与实现",
      "云原生技术在科研系统中的应用实践",
    ],
    projects: [
      "校企合作：智慧校园大数据平台",
      "横向项目：企业级 DevOps 平台构建",
    ],
    awards: [
      "服务外包创新创业竞赛优秀指导教师",
      "校级教学成果奖",
    ],
    students: "指导专业硕士 6 名，工程实践团队多个",
    link: "/teachers/sunwei.html",
  },
  {
    id: "zhoumin",
    name: "周敏",
    title: "副教授",
    role: "竞赛指导老师",
    avatar: "/images/portfolio_img/teacher_temp.png",
    photo: "/images/portfolio_img/teacher_temp.png",
    shortBio: "数据科学与可视化分析专家，擅长将复杂数据转化为直观洞察",
    researchAreas: ["数据科学", "可视化分析", "时空数据挖掘", "交互设计"],
    email: "zhoumin@hhu.edu.cn",
    office: "人工智能与自动化学院 220 室",
    education: [
      "博士，数据科学，某海外知名大学",
      "硕士，计算机科学，某重点大学",
    ],
    bio: `周敏副教授在数据科学与可视化分析领域有深厚的积累。她特别关注时空数据挖掘与交互式可视化技术，其研究成果广泛应用于城市规划、环境监测等领域。周老师是实验室竞赛团队的核心指导力量，多次带领学生在国内外数据挖掘竞赛中获奖。`,
    achievements: [
      "Kaggle 竞赛金牌团队指导教师",
      "主持国家自然科学基金面上项目",
      "担任多个国际期刊审稿人",
    ],
    courses: ["数据可视化", "高级数据分析", "人机交互"],
    publications: [
      "Visual Analytics of Urban Mobility Patterns Using Multi-source Data",
      "Interactive Visualization for Real-time Flood Monitoring",
    ],
    projects: [
      "国家自然科学基金：面向城市洪涝灾害的可视分析技术研究",
      "国际合作项目：智慧城市数据平台",
    ],
    awards: [
      "Kaggle 竞赛优秀指导教师",
      "校级科研先进个人",
    ],
    students: "指导硕士研究生 7 名，数据竞赛团队多个",
    link: "/teachers/zhoumin.html",
  },
];
