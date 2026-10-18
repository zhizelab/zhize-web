<template>
  <div class="success-showcase">
    <!-- ===== 全屏 3D 转盘获奖证书墙 ===== -->
    <section class="sc-carousel-fullscreen">
      <div class="sc-carousel-bg"></div>

      <div class="sc-carousel-ui">
        <h2>🏆 竞赛获奖</h2>
        <p>实验室成员在各类学科竞赛中的优异表现</p>
        <a class="sc-details-link" href="#award-details">查看完整获奖名单 ↓</a>
      </div>

      <div
        class="sc-carousel-stage"
        ref="stageRef"
        :class="{ 'is-hovering': hoveredId !== null }"
      >
        <div class="sc-carousel-ring sc-ring-landscape" :style="landscapeRingStyle">
          <div
            v-for="(award, i) in landscapeAwards"
            :key="award.id"
            class="sc-carousel-card sc-card-landscape"
            :style="cardPositionStyle(i, landscapeAwards.length, 'landscape', 'outer')"
            @mouseenter="onHover(award.id)"
            @mouseleave="onLeave"
          >
            <div
              class="sc-carousel-card-inner"
              :class="{ 'is-hovered': hoveredId === award.id }"
            >
              <div class="sc-carousel-card-front">
                <img
                  v-if="award.image"
                  :src="withBase(award.image)"
                  :alt="award.title"
                  draggable="false"
                />
                <div v-else class="sc-carousel-placeholder">
                  <div class="sc-ph-ribbon">{{ award.level }}</div>
                  <span class="sc-ph-icon">🏅</span>
                  <span class="sc-ph-title">{{ award.title }}</span>
                  <span class="sc-ph-year">{{ award.date }}</span>
                </div>
              </div>
              <div class="sc-carousel-card-back">
                <h4>{{ award.title }}</h4>
                <p class="sc-back-level">{{ award.level }}</p>
                <p class="sc-back-meta">{{ award.teams[0].members || award.teams[0].teachers || "详见下方获奖详情" }}</p>
                <p class="sc-back-meta">📅 {{ award.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="sc-carousel-ring sc-ring-portrait" :style="portraitRingStyle">
          <div
            v-for="(award, i) in portraitAwards"
            :key="award.id"
            class="sc-carousel-card sc-card-portrait"
            :style="cardPositionStyle(i, portraitAwards.length, 'portrait', 'inner')"
            @mouseenter="onHover(award.id)"
            @mouseleave="onLeave"
          >
            <div class="sc-carousel-card-inner" :class="{ 'is-hovered': hoveredId === award.id }">
              <div class="sc-carousel-card-front">
                <img :src="withBase(award.image)" :alt="award.title" draggable="false" />
              </div>
              <div class="sc-carousel-card-back">
                <h4>{{ award.title }}</h4>
                <p class="sc-back-level">{{ award.level }}</p>
                <p class="sc-back-meta">{{ award.teams[0].members || award.teams[0].teachers || "详见下方获奖详情" }}</p>
                <p class="sc-back-meta">📅 {{ award.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sc-section sc-gallery-section">
      <div class="sc-section-header">
        <h2>团队足迹</h2>
        <p>竞赛同行，也记录并肩成长的每一次相聚</p>
      </div>

      <div class="sc-featured-gallery">
        <figure
          v-for="(photo, index) in featuredPhotos"
          :key="photo.id"
          class="sc-featured-photo"
          :class="{ 'is-leading': index === 0 }"
        >
          <img :src="withBase(photo.src)" :alt="photo.title" loading="lazy" />
          <figcaption>
            <strong>{{ photo.title }}</strong>
            <span>{{ photo.caption }}</span>
          </figcaption>
        </figure>
      </div>

      <div class="sc-moments-heading">
        <h3>竞赛现场与团队日常</h3>
        <span>{{ momentPhotos.length }} 个片段</span>
      </div>
      <div class="sc-moments-grid">
        <figure v-for="photo in momentPhotos" :key="photo.id" class="sc-moment-photo">
          <img :src="withBase(photo.src)" :alt="photo.title" loading="lazy" />
          <figcaption>
            <strong>{{ photo.title }}</strong>
            <span>{{ photo.caption }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="award-details" class="sc-section sc-awards-section">
      <div class="sc-section-header">
        <h2>获奖详情</h2>
        <p>按获奖时间排列 · 点击证书查看原图</p>
      </div>
      <div class="sc-award-grid">
        <article v-for="award in awards" :key="award.id" class="sc-award-detail" :class="{ 'sc-award-collection': award.teams.length > 1 }">
          <a :href="withBase(award.image)" target="_blank" rel="noopener" class="sc-certificate-link" :aria-label="`查看${award.title}证书原图`">
            <img :src="withBase(award.image)" :alt="`${award.title} · ${award.level}`" loading="lazy" />
            <span>查看证书原图 ↗</span>
          </a>
          <div class="sc-award-info">
            <p class="sc-award-date">{{ award.date }}</p>
            <h3>{{ award.title }}</h3>
            <p class="sc-award-level">{{ award.level }}</p>
            <div class="sc-award-teams">
            <div v-for="(team, index) in award.teams" :key="index" class="sc-award-team">
              <h4>{{ award.teams.length > 1 ? `${index + 1} · ` : "" }}{{ team.level }}</h4>
              <p v-if="team.project">{{ team.project }}</p>
              <p v-if="team.members"><strong>获奖成员 / 单位：</strong>{{ team.members }}</p>
              <p v-if="team.teachers"><strong>指导教师：</strong>{{ team.teachers }}</p>
              <p v-if="team.note" class="sc-award-note">{{ team.note }}</p>
            </div>
            </div>
          </div>
        </article>
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

import { withBase } from "vuepress/client";
import { awards } from "../../data/awards";
import { featuredPhotos, momentPhotos } from "../../data/gallery";

const projects = [
  { id: "proj-1", title: "智慧水利监测平台", desc: "基于物联网与深度学习的水利设施智能监测系统，实现水位、流量、水质等多维度数据的实时采集与异常预警。", tags: ["物联网", "深度学习", "水利"], year: "2024", cover: "" },
  { id: "proj-2", title: "机器人视觉导航系统", desc: "基于 ROS 与 YOLO 的自主导航机器人，融合 SLAM 建图、视觉识别与路径规划，实现复杂室内环境下的自主巡航。", tags: ["ROS", "SLAM", "目标检测"], year: "2024", cover: "" },
  { id: "proj-3", title: "实验室 3D 点云场景", desc: "基于 Gaussian Splat 技术构建的实验室高精度三维点云场景，支持 Web 端实时浏览与交互。", tags: ["3D Gaussian Splat", "点云", "WebGL"], year: "2025", cover: "/images/main_img/hhu-bridge.png" },
  { id: "proj-4", title: "智能问答系统", desc: "基于大语言模型的领域知识问答系统，支持多轮对话与知识库检索。", tags: ["LLM", "RAG", "NLP"], year: "2024", cover: "" },
];

/* ---------- 3D 转盘逻辑 ---------- */
const stageRef = ref<HTMLElement | null>(null);
const rotation = ref(0);
const hoveredId = ref<string | null>(null);
let rafId = 0;
const baseSpeed = 0.1;

const landscapeAwards = awards.filter((award) => award.orientation === "landscape");
const portraitAwards = awards.filter((award) => award.orientation === "portrait");

/* ---- 视口自适应缩放 ---- */
const viewportW = ref(1920);
const scale = computed(() => Math.max(0.5, Math.min(1.5, viewportW.value / 1920)));

/* 卡片尺寸（随视口缩放） */
const portraitW = computed(() => Math.round(260 * scale.value));
const portraitH = computed(() => Math.round(340 * scale.value));
const landscapeW = computed(() => Math.round(320 * scale.value));
const landscapeH = computed(() => Math.round(230 * scale.value));

const landscapeRadius = computed(() =>
  Math.round(landscapeW.value / (2 * Math.tan(Math.PI / landscapeAwards.length)))
);
const portraitRadius = computed(() =>
  Math.max(150 * scale.value, Math.round(portraitW.value / (2 * Math.tan(Math.PI / portraitAwards.length))))
);

const landscapeRingStyle = computed(() => ({
  transform: `rotateY(${rotation.value}deg)`,
}));
const portraitRingStyle = computed(() => ({
  transform: `rotateY(${-rotation.value * 1.35}deg)`,
}));

const cardPositionStyle = (
  index: number,
  count: number,
  orientation: "landscape" | "portrait",
  ring: "outer" | "inner"
) => {
  const angle = (360 / count) * index;
  const dims = orientation === "landscape"
    ? { w: landscapeW.value, h: landscapeH.value }
    : { w: portraitW.value, h: portraitH.value };
  const radius = ring === "outer" ? landscapeRadius.value : portraitRadius.value;
  const translateY = ring === "outer" ? 54 * scale.value : -34 * scale.value;
  return {
    width: `${dims.w}px`,
    height: `${dims.h}px`,
    transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${translateY}px)`,
    marginTop: `${-dims.h / 2}px`,
    marginLeft: `${-dims.w / 2}px`,
  };
};

const animate = () => {
  if (hoveredId.value === null) {
    rotation.value += baseSpeed;
  }
  rafId = requestAnimationFrame(animate);
};

const onHover = (id: string) => {
  hoveredId.value = id;
};

const onLeave = () => {
  hoveredId.value = null;
};

let resizePending = false;
const onResize = () => {
  if (resizePending) return;
  resizePending = true;
  requestAnimationFrame(() => {
    viewportW.value = window.innerWidth;
    resizePending = false;
  });
};

onMounted(() => {
  viewportW.value = window.innerWidth;
  window.addEventListener("resize", onResize);
  rafId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
/* ========== 全屏 3D 转盘 ========== */
.sc-carousel-fullscreen {
  position: relative;
  width: calc(100vw - 24px);
  margin-left: calc(-50vw + 50% + 12px);
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
  height: clamp(430px, 58vh, 680px);
  perspective: 1250px;
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

.sc-ring-landscape {
  z-index: 1;
}

.sc-ring-portrait {
  z-index: 2;
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
  transform: scale(1.16) translateZ(70px);
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

/* ========== 团队照片 ========== */
.sc-gallery-section {
  max-width: 1320px;
}

.sc-featured-gallery {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 230px;
  gap: 16px;
}

.sc-featured-photo,
.sc-moment-photo {
  position: relative;
  margin: 0;
  overflow: hidden;
  border-radius: 16px;
  background: #101b2d;
}

.sc-featured-photo.is-leading {
  grid-column: span 2;
  grid-row: span 2;
}

.sc-featured-photo:nth-child(6),
.sc-featured-photo:nth-child(7) {
  grid-column: span 2;
}

.sc-featured-photo img,
.sc-moment-photo img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.sc-featured-photo:hover img,
.sc-moment-photo:hover img {
  transform: scale(1.035);
}

.sc-featured-photo::after,
.sc-moment-photo::after {
  content: "";
  position: absolute;
  inset: 35% 0 0;
  background: linear-gradient(transparent, rgba(4, 12, 26, 0.88));
  pointer-events: none;
}

.sc-featured-photo figcaption,
.sc-moment-photo figcaption {
  position: absolute;
  z-index: 1;
  left: 18px;
  right: 18px;
  bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #fff;
}

.sc-featured-photo figcaption strong,
.sc-moment-photo figcaption strong {
  font-size: 1rem;
  line-height: 1.35;
}

.sc-featured-photo figcaption span,
.sc-moment-photo figcaption span {
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.82rem;
}

.sc-moments-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 48px 0 18px;
  border-bottom: 1px solid #dce2eb;
  padding-bottom: 12px;
}

.sc-moments-heading h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.25rem;
}

.sc-moments-heading span {
  color: #667085;
  font-size: 0.85rem;
}

.sc-moments-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.sc-moment-photo {
  aspect-ratio: 4 / 3;
}

/* ========== 可直接阅读的证书与名单 ========== */
.sc-details-link { display: inline-block; margin-top: 18px; color: #f4d68b; }
.sc-award-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; align-items: start; }
.sc-award-collection { grid-column: 1 / -1; }
.sc-award-collection .sc-award-teams { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
.sc-award-detail { border: 1px solid #e1e5ee; border-radius: 16px; overflow: hidden; background: #fff; color: #1a1a1a; box-shadow: 0 4px 20px #1523400a; }
.sc-certificate-link { display: block; padding: 20px; background: #f0f2f7; text-align: center; }
.sc-certificate-link img { display: block; width: 100%; height: 260px; object-fit: contain; }
.sc-certificate-link span { display: inline-block; margin-top: 12px; font-size: .85rem; color: #405c94; }
.sc-award-info { padding: 24px; }
.sc-award-info h3 { margin: 8px 0 12px; font-size: 1.15rem; line-height: 1.5; }
.sc-award-date { margin: 0; color: #667085; font-size: .85rem; }
.sc-award-level { color: #a74418; font-weight: 700; }
.sc-award-team { border-top: 1px solid #edf0f5; margin-top: 16px; padding-top: 12px; }
.sc-award-team h4 { margin: 0 0 8px; font-size: .95rem; }
.sc-award-team p { margin: 6px 0; line-height: 1.8; font-size: .9rem; overflow-wrap: anywhere; }
.sc-award-team .sc-award-note { color: #667085; font-size: .8rem; }
@media (max-width: 768px) { .sc-award-grid, .sc-award-collection .sc-award-teams { grid-template-columns: 1fr; } }

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
  .sc-carousel-ui {
    margin-bottom: 8px;
  }

  .sc-featured-gallery,
  .sc-moments-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 180px;
  }

  .sc-featured-photo.is-leading,
  .sc-featured-photo:nth-child(6),
  .sc-featured-photo:nth-child(7) {
    grid-column: span 2;
  }

  .sc-moment-photo {
    aspect-ratio: auto;
  }

  .sc-project-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .sc-featured-gallery,
  .sc-moments-grid {
    grid-template-columns: 1fr;
  }

  .sc-featured-photo,
  .sc-featured-photo.is-leading,
  .sc-featured-photo:nth-child(6),
  .sc-featured-photo:nth-child(7) {
    grid-column: auto;
    grid-row: auto;
    height: 230px;
  }

  .sc-moment-photo {
    height: 220px;
  }
}
</style>
