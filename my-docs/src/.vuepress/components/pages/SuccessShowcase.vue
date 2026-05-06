<template>
  <div class="success-showcase">
    <!-- ===== 全屏 3D 转盘获奖证书墙 ===== -->
    <section class="sc-carousel-fullscreen">
      <div class="sc-carousel-bg"></div>

      <div class="sc-carousel-ui">
        <h2>🏆 竞赛获奖</h2>
        <p>实验室成员在各类学科竞赛中的优异表现</p>
      </div>

      <div
        class="sc-carousel-stage"
        ref="stageRef"
        :class="{ 'is-hovering': hoveredIndex !== null }"
      >
        <div class="sc-carousel-ring" :style="ringStyle">
          <div
            v-for="(award, i) in awards"
            :key="award.id"
            class="sc-carousel-card"
            :style="cardPositionStyle(i)"
            @mouseenter="onHover(i)"
            @mouseleave="onLeave"
          >
            <div
              class="sc-carousel-card-inner"
              :class="{ 'is-hovered': hoveredIndex === i }"
            >
              <div class="sc-carousel-card-front">
                <img
                  v-if="award.image"
                  :src="award.image"
                  :alt="award.title"
                  draggable="false"
                />
                <div v-else class="sc-carousel-placeholder">
                  <div class="sc-ph-ribbon">{{ award.level }}</div>
                  <span class="sc-ph-icon">{{ award.icon }}</span>
                  <span class="sc-ph-title">{{ award.title }}</span>
                  <span class="sc-ph-year">{{ award.year }}</span>
                </div>
              </div>
              <div class="sc-carousel-card-back">
                <h4>{{ award.title }}</h4>
                <p class="sc-back-level">{{ award.level }}</p>
                <p class="sc-back-meta">👥 {{ award.members }}</p>
                <p class="sc-back-meta">📅 {{ award.year }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 项目成果 ===== -->
    <section class="sc-section sc-alt">
      <div class="sc-section-header">
        <h2>🚀 项目成果</h2>
        <p>实验室承接或自主研发的代表性项目</p>
      </div>
      <div class="sc-project-grid">
        <article
          v-for="project in projects"
          :key="project.id"
          class="sc-project-card"
        >
          <div class="sc-project-cover">
            <img
              v-if="project.cover"
              :src="project.cover"
              :alt="project.title"
            />
            <div v-else class="sc-project-placeholder">
              {{ project.title[0] }}
            </div>
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
import { ref, computed, onMounted, onUnmounted } from "vue";

/* ---------- 数据 ---------- */
// 🏅🥇🥈🥉
const awards = [
  { id: "a1", icon: "🥉", title: "第八届全国大学生嵌入式芯片与系统设计大赛", level: "国家级三等奖", members: "吴鑫磊、黄嘉成、王垚涵", year: "2025", image: "/images/awards/soc8_wxl.jpg" },
  { id: "a2", icon: "🥈", title: "第十三届“中国软件杯”大学生软件设计大赛", level: "国家级二等奖", members: "张卓老师团队", year: "2024", image: "/images/awards/zrb13_zz.jpg" },
  { id: "a3", icon: "🥇", title: "第十四届“中国软件杯”大学生软件设计大赛", level: "国家级一等奖", members: "", year: "2025", image: "/images/awards/zrb14_1.jpg" },
  { id: "a4", icon: "🏅", title: "第十四届“中国软件杯”大学生软件设计大赛", level: "优秀指导教师", members: "张卓老师", year: "2025", image: "/images/awards/zrb14_zz.jpg" },
  { id: "a5", icon: "🥉", title: "第十六届中国大学生服务外包创新创业大赛", level: "国家级三等奖", members: "谢乐妍、刘诗冉、侯婧馨、黄嘉成、蒋乐蕙", year: "2025", image: "/images/awards/fwwb16_xly.jpg" },
  { id: "a6", icon: "🥉", title: "第十六届中国大学生服务外包创新创业大赛", level: "国家级三等奖", members: "欧阳博文、朱依武、孙展鹏、牛秀林、吴鑫磊", year: "2025", image: "/images/awards/fwwb16_oybw.jpg" },
  { id: "a7", icon: "🏅", title: "第六届全球校园人工智能算法精英大赛", level: "优秀组织奖", members: "河海大学", year: "2024", image: "/images/awards/AIC6_hhu.jpg" },
  { id: "a8", icon: "🏅", title: "第六届全球校园人工智能算法精英大赛", level: "国家级奖项", members: "", year: "2024", image: "/images/awards/AIC6.jpg" },
  { id: "a9", icon: "🥉", title: "第十二届江苏省大学生计算机设计大赛", level: "省级三等奖", members: "黄嘉成、夏若轩、刘安乔、周浩逸、晏赫雄", year: "2025", image: "/images/awards/4C12_hjc.jpg" },
];

const projects = [
  { id: "proj-1", title: "智慧水利监测平台", desc: "基于物联网与深度学习的水利设施智能监测系统，实现水位、流量、水质等多维度数据的实时采集与异常预警。", tags: ["物联网", "深度学习", "水利"], year: "2024", cover: "" },
  { id: "proj-2", title: "机器人视觉导航系统", desc: "基于 ROS 与 YOLO 的自主导航机器人，融合 SLAM 建图、视觉识别与路径规划，实现复杂室内环境下的自主巡航。", tags: ["ROS", "SLAM", "目标检测"], year: "2024", cover: "" },
  { id: "proj-3", title: "实验室 3D 点云场景", desc: "基于 Gaussian Splat 技术构建的实验室高精度三维点云场景，支持 Web 端实时浏览与交互。", tags: ["3D Gaussian Splat", "点云", "WebGL"], year: "2025", cover: "/images/main_img/hhu-bridge.png" },
  { id: "proj-4", title: "智能问答系统", desc: "基于大语言模型的领域知识问答系统，支持多轮对话与知识库检索。", tags: ["LLM", "RAG", "NLP"], year: "2024", cover: "" },
];

/* ---------- 3D 转盘逻辑 ---------- */
const stageRef = ref<HTMLElement | null>(null);
const rotation = ref(0);
const hoveredIndex = ref<number | null>(null);
let rafId = 0;
const baseSpeed = 0.1;

const count = awards.length;

/* 卡片尺寸：竖版（肖像）/ 横版（风景） */
const portraitW = 220;
const portraitH = 300;
const landscapeW = 280;
const landscapeH = 200;

/* 每张卡片的实际尺寸，初始默认竖版，图片加载后根据比例自动切换 */
const cardDims = ref<Array<{ w: number; h: number }>>(
  awards.map(() => ({ w: portraitW, h: portraitH }))
);

/* 用横版宽度计算半径，保证所有卡片都能容纳 */
const maxCardW = Math.max(portraitW, landscapeW);
const radius = Math.round(maxCardW / (2 * Math.tan(Math.PI / count)));

/** 加载图片自动检测横竖比例并调整卡片尺寸 */
const detectAspectRatios = () => {
  awards.forEach((award, i) => {
    if (!award.image) return;
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      cardDims.value[i] = ratio > 1.2
        ? { w: landscapeW, h: landscapeH }
        : { w: portraitW, h: portraitH };
    };
    img.src = award.image;
  });
};

const ringStyle = computed(() => ({
  transform: `rotateY(${rotation.value}deg)`,
}));

const cardPositionStyle = (index: number) => {
  const angle = (360 / count) * index;
  const dims = cardDims.value[index];
  return {
    width: `${dims.w}px`,
    height: `${dims.h}px`,
    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
    marginTop: `${-dims.h / 2}px`,
    marginLeft: `${-dims.w / 2}px`,
  };
};

const animate = () => {
  if (hoveredIndex.value === null) {
    rotation.value += baseSpeed;
  }
  rafId = requestAnimationFrame(animate);
};

const onHover = (index: number) => {
  hoveredIndex.value = index;
};

const onLeave = () => {
  hoveredIndex.value = null;
};

onMounted(() => {
  detectAspectRatios();
  rafId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
/* ========== 全屏 3D 转盘 ========== */
.sc-carousel-fullscreen {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sc-carousel-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(15, 52, 96, 0.6) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 70%, rgba(26, 26, 46, 0.8) 0%, transparent 60%),
    linear-gradient(180deg, #0a0a12 0%, #12122b 40%, #0d0d1a 100%);
}

.sc-carousel-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 2px),
    radial-gradient(circle at 60% 70%, rgba(255,255,255,0.02) 0%, transparent 2px),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 2px);
  background-size: 120px 120px, 180px 180px, 240px 240px;
}

/* 标题 */
.sc-carousel-ui {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #fff;
  margin-bottom: 24px;
  pointer-events: none;
}

.sc-carousel-ui h2 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: 4px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.5);
}

.sc-carousel-ui p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  letter-spacing: 2px;
}

/* 3D 舞台 */
.sc-carousel-stage {
  position: relative;
  z-index: 5;
  transition: z-index 0s;
  width: 100%;
  height: 420px;
  perspective: 1100px;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sc-carousel-stage.is-hovering {
  z-index: 30;
}

.sc-carousel-ring {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* 卡片外壳 —— 负责环形定位 */
.sc-carousel-card {
  position: absolute;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: pointer;
}

/* 卡片内层 —— 负责 hover 放大 */
.sc-carousel-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}

.sc-carousel-card-inner.is-hovered {
  transform: scale(1.2) translateZ(60px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
}

/* 正面 */
.sc-carousel-card-front {
  position: absolute;
  inset: 0;
  background: #1a1a2e;
  border: 2px solid rgba(201, 162, 39, 0.5);
  overflow: hidden;
  backface-visibility: hidden;
}

.sc-carousel-card-front img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: linear-gradient(145deg, #1a1a2e 0%, #0f3460 50%, #1a1a2e 100%);
}

/* 占位样式 */
.sc-carousel-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #1a1a2e 0%, #0f3460 50%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  position: relative;
}

.sc-carousel-placeholder::before {
  content: "";
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(201, 162, 39, 0.25);
  pointer-events: none;
}

.sc-ph-ribbon {
  position: absolute;
  top: 10px;
  right: -28px;
  background: #c0392b;
  color: #fff;
  font-size: 0.55rem;
  font-weight: 700;
  padding: 3px 28px;
  transform: rotate(45deg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  white-space: nowrap;
  z-index: 2;
}

.sc-ph-icon {
  font-size: 2.8rem;
  margin-bottom: 6px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.sc-ph-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #f0e6c8;
  line-height: 1.4;
  margin-bottom: 4px;
}

.sc-ph-year {
  font-size: 0.7rem;
  color: #c9a227;
  font-weight: 600;
}

/* 背面详情 */
.sc-carousel-card-back {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 18, 0.92);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  backface-visibility: hidden;
  border: 2px solid rgba(201, 162, 39, 0.6);
}

.sc-carousel-card-inner.is-hovered .sc-carousel-card-back {
  opacity: 1;
  pointer-events: auto;
}

.sc-carousel-card-back h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffd700;
  margin: 0 0 8px;
  line-height: 1.3;
}

.sc-back-level {
  font-size: 0.82rem;
  color: #ff7e5f;
  font-weight: 700;
  margin: 0 0 10px;
}

.sc-back-meta {
  font-size: 0.75rem;
  color: #ccc;
  margin: 0 0 4px;
}

/* ========== 项目成果 ========== */
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
  .sc-project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
