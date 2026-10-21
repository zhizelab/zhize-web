export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: "团队合影" | "竞赛现场" | "团队日常";
  featured?: boolean;
}

export const galleryPhotos: GalleryPhoto[] = [
  { id: "fwwb-chengdu", src: "/images/imgs/fwwb_chengdu.jpg", title: "服务外包创新创业大赛 · 成都", caption: "参赛成员赛场合影", category: "团队合影", featured: true },
  { id: "aic-team", src: "/images/imgs/AIC_tot.jpg", title: "人工智能算法精英大赛参赛团队", caption: "参赛成员合影", category: "团队合影", featured: true },
  { id: "fwwb-nanjing", src: "/images/imgs/fwwb_nanjing_tot.jpg", title: "服务外包创新创业大赛 · 南京", caption: "参赛团队集体合影", category: "团队合影", featured: true },
  { id: "iot-team-all", src: "/images/imgs/IOT_hjc_hff_tot.jpg", title: "全国大学生物联网设计竞赛团队", caption: "参赛团队在赛场合影", category: "团队合影", featured: true },
  { id: "team-building", src: "/images/imgs/tj_tot.jpg", title: "实验室团建", caption: "成员户外团建合影", category: "团队合影", featured: true },
  { id: "iot-team", src: "/images/imgs/IOT_hff_hjc_tot.jpg", title: "物联网设计竞赛参赛成员", caption: "赛场团队合影", category: "团队合影", featured: true },
  { id: "aic-all", src: "/images/imgs/AIC_totot.jpg", title: "人工智能算法精英大赛团队合影", caption: "团队与指导教师在赛场留影", category: "团队合影", featured: true },
  { id: "iot-award", src: "/images/imgs/IOT_hff_ry.jpg", title: "物联网设计竞赛获奖留影", caption: "成员在全国总决赛现场", category: "竞赛现场" },
  { id: "iot-demo", src: "/images/imgs/IOT_hff.jpg", title: "物联网作品现场展示", caption: "团队进行作品演示与答辩", category: "竞赛现场" },
  { id: "aic-award", src: "/images/imgs/AIC_hff.jpg", title: "竞赛颁奖现场", caption: "成员在颁奖仪式现场留影", category: "竞赛现场" },
  { id: "aic-test", src: "/images/imgs/AIC_test.jpg", title: "机器人赛前测试", caption: "团队进行场地测试与参数调整", category: "竞赛现场" },
  { id: "aic-debug", src: "/images/imgs/AIC_yjy.jpg", title: "机器人现场调试", caption: "参赛成员协作完成设备调试", category: "竞赛现场" },
  { id: "aic-code-1", src: "/images/imgs/AIC_hj.jpg", title: "算法调试", caption: "成员专注完善竞赛方案", category: "竞赛现场" },
  { id: "aic-code-2", src: "/images/imgs/AIC_yhx.jpg", title: "赛前准备", caption: "团队在现场进行程序检查", category: "竞赛现场" },
  { id: "aic-code-3", src: "/images/imgs/AIC_zxt.jpg", title: "程序联调", caption: "成员进行系统联调与验证", category: "竞赛现场" },
  { id: "lab-open", src: "/images/imgs/212_go.jpg", title: "实验室开放交流", caption: "成员展示机器人项目", category: "团队日常" },
  { id: "lab-demo", src: "/images/imgs/212_wxl.jpg", title: "项目成果演示", caption: "向来访师生介绍实验室作品", category: "团队日常" },
  { id: "barbecue", src: "/images/imgs/tj_wxl.jpg", title: "户外团建", caption: "轻松愉快的团队烧烤时光", category: "团队日常" },
  { id: "daily", src: "/images/imgs/yz.jpg", title: "团队日常", caption: "成员在实验室交流与协作", category: "团队日常" },
];

export const featuredPhotos = galleryPhotos.filter((photo) => photo.featured);
export const momentPhotos = galleryPhotos.filter((photo) => !photo.featured);
