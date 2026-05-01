<template>
  <div class="success-showcase">
    <!-- Hero -->
    <section class="sc-hero">
      <img class="sc-hero-image" src="/images/main_img/hhu-bridge.png" alt="成果展示背景" />
      <div class="sc-hero-mask"></div>
      <div class="sc-hero-content">
        <p class="sc-hero-kicker">成果展示</p>
        <h1>实验室成果</h1>
        <p>以赛促学，以研促创——记录实验室的每一步成长</p>
      </div>
    </section>

    <!-- 竞赛获奖 -->
    <section class="sc-section">
      <div class="sc-section-header">
        <h2>🏆 竞赛获奖</h2>
        <p>实验室成员在各类学科竞赛中的优异表现</p>
      </div>
      <div class="sc-award-grid">
        <article v-for="award in awards" :key="award.id" class="sc-award-card">
          <div class="sc-award-icon">{{ award.icon }}</div>
          <div class="sc-award-info">
            <h3>{{ award.title }}</h3>
            <p class="sc-award-level">{{ award.level }}</p>
            <p class="sc-award-members">👥 {{ award.members }}</p>
            <p class="sc-award-year">📅 {{ award.year }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- 项目成果 -->
    <section class="sc-section sc-alt">
      <div class="sc-section-header">
        <h2>🚀 项目成果</h2>
        <p>实验室承接或自主研发的代表性项目</p>
      </div>
      <div class="sc-project-grid">
        <article v-for="project in projects" :key="project.id" class="sc-project-card">
          <div class="sc-project-cover">
            <img v-if="project.cover" :src="project.cover" :alt="project.title" />
            <div v-else class="sc-project-placeholder">{{ project.title[0] }}</div>
          </div>
          <div class="sc-project-info">
            <h3>{{ project.title }}</h3>
            <p class="sc-project-desc">{{ project.desc }}</p>
            <div class="sc-project-tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
            <p class="sc-project-year">{{ project.year }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const awards = [
  {
    id: "award-1",
    icon: "🥇",
    title: "全国大学生电子设计竞赛",
    level: "国家级一等奖",
    members: "张三、李四、王五",
    year: "2024",
  },
  {
    id: "award-2",
    icon: "🥈",
    title: "全国大学生数学建模竞赛",
    level: "省级一等奖",
    members: "张三、赵六",
    year: "2024",
  },
  {
    id: "award-3",
    icon: "🥇",
    title: "中国大学生计算机设计大赛",
    level: "国家级二等奖",
    members: "李四、孙七",
    year: "2023",
  },
  {
    id: "award-4",
    icon: "🥉",
    title: "RoboMaster 机甲大师赛",
    level: "区域赛三等奖",
    members: "实验室机器人战队",
    year: "2023",
  },
];

const projects = [
  {
    id: "proj-1",
    title: "智慧水利监测平台",
    desc: "基于物联网与深度学习的水利设施智能监测系统，实现水位、流量、水质等多维度数据的实时采集与异常预警。",
    tags: ["物联网", "深度学习", "水利"],
    year: "2024",
    cover: "",
  },
  {
    id: "proj-2",
    title: "机器人视觉导航系统",
    desc: "基于 ROS 与 YOLO 的自主导航机器人，融合 SLAM 建图、视觉识别与路径规划，实现复杂室内环境下的自主巡航。",
    tags: ["ROS", "SLAM", "目标检测"],
    year: "2024",
    cover: "",
  },
  {
    id: "proj-3",
    title: "实验室 3D 点云场景",
    desc: "基于 Gaussian Splat 技术构建的实验室高精度三维点云场景，支持 Web 端实时浏览与交互，用于新成员环境熟悉与机器人任务预览。",
    tags: ["3D Gaussian Splat", "点云", "WebGL"],
    year: "2025",
    cover: "/images/main_img/hhu-bridge.png",
  },
  {
    id: "proj-4",
    title: "智能问答系统",
    desc: "基于大语言模型的领域知识问答系统，支持多轮对话与知识库检索，为实验室新人提供自动化的技术文档问答服务。",
    tags: ["LLM", "RAG", "NLP"],
    year: "2024",
    cover: "",
  },
];
</script>

<style scoped>
/* ========== Hero ========== */
.sc-hero {
  position: relative;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.sc-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.sc-hero-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.sc-hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  max-width: 700px;
  padding: 0 24px;
}

.sc-hero-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #ffd700;
  margin: 0 0 12px;
}

.sc-hero-content h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin: 0 0 16px;
}

.sc-hero-content p {
  font-size: 1.05rem;
  opacity: 0.9;
  margin: 0;
}

/* ========== Section ========== */
.sc-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.sc-alt {
  background: #f8f9fa;
}

.sc-section-header {
  text-align: center;
  margin-bottom: 40px;
}

.sc-section-header h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.sc-section-header p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* ========== Award Grid ========== */
.sc-award-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.sc-award-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.sc-award-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.sc-award-icon {
  font-size: 2.4rem;
  line-height: 1;
  flex-shrink: 0;
}

.sc-award-info h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.sc-award-level {
  font-size: 0.9rem;
  color: #ff7e5f;
  font-weight: 700;
  margin: 0 0 10px;
}

.sc-award-members,
.sc-award-year {
  font-size: 0.82rem;
  color: #666;
  margin: 0 0 4px;
}

/* ========== Project Grid ========== */
.sc-project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.sc-project-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.sc-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.sc-project-cover {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.sc-project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sc-project-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 4rem;
  font-weight: 900;
  color: rgba(255,255,255,0.3);
}

.sc-project-info {
  padding: 20px 24px 24px;
}

.sc-project-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.sc-project-desc {
  font-size: 0.88rem;
  color: #555;
  line-height: 1.6;
  margin: 0 0 14px;
}

.sc-project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.sc-project-tags span {
  font-size: 0.75rem;
  color: #4a90d9;
  background: rgba(74, 144, 217, 0.08);
  padding: 4px 12px;
  border-radius: 12px;
}

.sc-project-year {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

@media (max-width: 768px) {
  .sc-award-grid,
  .sc-project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
