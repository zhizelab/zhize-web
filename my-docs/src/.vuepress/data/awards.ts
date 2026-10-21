export interface AwardTeam {
  level: string;
  members?: string;
  teachers?: string;
  project?: string;
  note?: string;
}

export interface Award {
  id: string;
  title: string;
  level: string;
  date: string;
  image: string;
  orientation: "landscape" | "portrait";
  teams: AwardTeam[];
}

// 按证书原图录入。合照按从左到右、从上到下排列；无法辨认的姓名不推测。
export const awards: Award[] = [
  {
    id: "iot13", title: "第十三届全国大学生物联网设计竞赛", level: "全国总决赛二等奖", date: "2026年8月", image: "/images/awards/2025-2026school_year/IOT13_hff.jpg", orientation: "landscape",
    teams: [{ level: "二等奖", members: "黄丰帆、吴鑫磊、文康、阮叶", teachers: "张卓、胡银龙" }],
  },
  {
    id: "soc9", title: "第九届全国大学生嵌入式芯片与系统设计竞赛", level: "全国总决赛三等奖", date: "2026年8月", image: "/images/awards/2025-2026school_year/soc9_hff.png", orientation: "portrait",
    teams: [{ level: "芯片应用赛道 · 三等奖", members: "黄丰帆、文康、吴鑫磊", teachers: "张卓、胡银龙", project: "基于 QSM368ZP-WF 的智能安防机器人与双目视觉实时避障系统" }],
  },
  {
    id: "zrb15-hyc", title: "第十五届“中国软件杯”大学生软件设计大赛", level: "全国总决赛二等奖", date: "2026年8月", image: "/images/awards/2025-2026school_year/zrb15_hyc.jpg", orientation: "landscape",
    teams: [{ level: "普通高等教育组 · 二等奖", members: "黄奕琛、陈锦彤、袁哲", project: "AI 与 AR 融合的四足机器狗消防侦察和救援系统开发赛" }],
  },
  {
    id: "zrb15-wk", title: "第十五届“中国软件杯”大学生软件设计大赛", level: "全国总决赛二等奖", date: "2026年8月", image: "/images/awards/2025-2026school_year/zrb15_wk.jpg", orientation: "landscape",
    teams: [{ level: "普通高等教育组 · 二等奖", members: "文康、刘鸿宇、孟恒", project: "AI 与 AR 融合的四足机器狗消防侦察和救援系统开发赛" }],
  },
  {
    id: "zrb15-teacher", title: "第十五届“中国软件杯”大学生软件设计大赛", level: "全国总决赛一等奖指导教师", date: "2026年8月", image: "/images/awards/2025-2026school_year/zrb15_zz.jpg", orientation: "landscape",
    teams: [{ level: "普通高等教育组 · 一等奖", teachers: "张卓", project: "AI 与 AR 融合的四足机器狗消防侦察和救援系统开发赛" }],
  },
  {
    id: "fwwb17-hff", title: "第十七届中国大学生服务外包创新创业大赛", level: "全国赛企业命题类三等奖", date: "2026年7月", image: "/images/awards/2025-2026school_year/fwwb17_hff.jpg", orientation: "landscape",
    teams: [{ level: "企业命题类 · 三等奖", members: "黄丰帆、阮叶、吴鑫磊、张潇玲、岳彤", teachers: "张卓、刘小峰" }],
  },
  {
    id: "fwwb17-yjy", title: "第十七届中国大学生服务外包创新创业大赛", level: "全国赛人工智能专项赛道二等奖", date: "2026年7月", image: "/images/awards/2025-2026school_year/fwwb17_yjy.jpg", orientation: "landscape",
    teams: [{ level: "人工智能专项赛道 · 二等奖", members: "杨静怡、王柯楠、沈鹏菲、程钰尧、黄嘉成", teachers: "张卓、王龙宝" }],
  },
  {
    id: "fwwb17-yz", title: "第十七届中国大学生服务外包创新创业大赛", level: "全国赛人工智能专项赛道二等奖", date: "2026年7月", image: "/images/awards/2025-2026school_year/fwwb17_yz.jpg", orientation: "landscape",
    teams: [{ level: "人工智能专项赛道 · 二等奖", members: "袁哲、文康、刘鸿宇、孟恒、陈锦彤", teachers: "张卓、胡银龙" }],
  },
  {
    id: "aic7", title: "第七届全球校园人工智能算法精英大赛", level: "全国总决赛一等奖 11 项、二等奖 1 项", date: "2025年12月", image: "/images/awards/2025-2026school_year/AIC7.jpg", orientation: "landscape",
    teams: [{ level: "获奖情况", project: "一等奖 11 项、二等奖 1 项" }],
  },
  {
    id: "aic7-teacher", title: "第七届全球校园人工智能算法精英大赛", level: "全国总决赛优秀指导教师", date: "2025年12月", image: "/images/awards/2025-2026school_year/AIC7_zz.jpg", orientation: "portrait",
    teams: [{ level: "优秀指导教师", teachers: "张卓" }],
  },
  {
    id: "soc8", title: "第八届全国大学生嵌入式芯片与系统设计竞赛", level: "全国总决赛三等奖", date: "2025年8月", image: "/images/awards/2024-2025school_year/soc8_wxl.jpg", orientation: "portrait",
    teams: [{ level: "芯片应用赛道 · 三等奖", members: "吴鑫磊、黄嘉成、王垚涵", teachers: "张卓", project: "基于 hi3861 的智能药盒与多维度用药安全防护体系" }],
  },
  {
    id: "zrb14", title: "第十四届“中国软件杯”大学生软件设计大赛", level: "一等奖", date: "2025年8月", image: "/images/awards/2024-2025school_year/zrb14_1.jpg", orientation: "landscape",
    teams: [{ level: "一等奖", note: "奖牌未列获奖成员姓名。" }],
  },
  {
    id: "zrb14-teacher", title: "第十四届“中国软件杯”大学生软件设计大赛", level: "优秀指导教师", date: "2025年8月", image: "/images/awards/2024-2025school_year/zrb14_zz.jpg", orientation: "landscape",
    teams: [{ level: "优秀指导教师", note: "奖牌未列获奖教师姓名。" }],
  },
  {
    id: "fwwb16-xly", title: "第十六届中国大学生服务外包创新创业大赛", level: "全国赛三等奖", date: "2025年7月", image: "/images/awards/2024-2025school_year/fwwb16_xly.jpg", orientation: "landscape",
    teams: [{ level: "企业命题类 · 三等奖", members: "谢乐妍、刘诗冉、侯婧馨、黄嘉成、蒋乐蕙", teachers: "张卓" }],
  },
  {
    id: "fwwb16-oybw", title: "第十六届中国大学生服务外包创新创业大赛", level: "全国赛三等奖", date: "2025年7月", image: "/images/awards/2024-2025school_year/fwwb16_oybw.jpg", orientation: "landscape",
    teams: [{ level: "企业命题类 · 三等奖", members: "欧阳博文、朱依武、孙展腾、牛秀林、吴鑫磊", teachers: "张卓" }],
  },
  {
    id: "4c12", title: "第十二届江苏省大学生计算机设计大赛", level: "省级三等奖", date: "2025年5月", image: "/images/awards/2024-2025school_year/4C12_hjc.jpg", orientation: "landscape",
    teams: [{ level: "人工智能应用 · 三等奖", members: "黄嘉成、夏若轩、刘安乔、周浩逸、晏赫雄", teachers: "张卓", project: "基于文心大模型的四足机器人森林巡检系统" }],
  },
  {
    id: "aic6", title: "第六届全球校园人工智能算法精英大赛", level: "全国总决赛一等奖 3 项、二等奖 4 项、三等奖 1 项", date: "2024年11—12月", image: "/images/awards/2024-2025school_year/AIC6.jpg", orientation: "landscape",
    teams: [{ level: "获奖情况", project: "一等奖 3 项、二等奖 4 项、三等奖 1 项" }],
  },
  {
    id: "aic6-organization", title: "第六届全球校园人工智能算法精英大赛", level: "优秀组织奖", date: "2024年11月", image: "/images/awards/2024-2025school_year/AIC6_hhu.jpg", orientation: "portrait",
    teams: [{ level: "优秀组织奖", members: "河海大学" }],
  },
  {
    id: "zrb13", title: "第十三届“中国软件杯”大学生软件设计大赛", level: "总决赛普通高等教育组二等奖", date: "2024年8月", image: "/images/awards/2023-2024school_year/zrb13_zz.jpg", orientation: "landscape",
    teams: [{ level: "二等奖", teachers: "张卓", project: "基于文心大模型的智能四足机器狗森林巡检系统开发", note: "指导教师荣誉证书未列参赛成员姓名。" }],
  },
];
