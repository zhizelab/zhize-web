<template>
  <div class="success-showcase">
    <!-- ===== 全屏 3D 转盘获奖证书墙 ===== -->
    <section class="sc-carousel-fullscreen">
      <div class="sc-carousel-bg"></div>

      <div class="sc-carousel-ui">
        <h2>🏆 竞赛获奖</h2>
        <p>实验室成员在各类竞赛中的优异表现</p>
        <a class="sc-details-link" href="#award-details">查看完整获奖名单 ↓</a>
      </div>

      <div
        class="sc-carousel-stage"
        ref="stageRef"
        :class="{ 'is-hovering': hoveredId !== null }"
      >
        <div class="sc-carousel-ring" :style="ringStyle">
          <div
            v-for="(award, i) in carouselAwards"
            :key="award.id"
            class="sc-carousel-card"
            :style="cardPositionStyle(i, carouselAwards.length, award.orientation, award.id)"
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
                <p class="sc-back-level">{{ formatAwardLevel(award.level) }}</p>
                <p
                  v-if="award.teams[0].members || award.teams[0].teachers"
                  class="sc-back-meta"
                >
                  {{ award.teams[0].members || award.teams[0].teachers }}
                </p>
                <p class="sc-back-meta">📅 {{ award.date }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <section id="award-details" class="sc-section sc-awards-section">
      <div class="sc-section-header">
        <h2>获奖详情</h2>
        <p>按获奖时间排列 · 点击证书查看原图</p>
      </div>
      <div class="sc-award-grid">
        <article v-for="award in sortedAwards" :key="award.id" class="sc-award-detail" :class="{ 'sc-award-collection': award.teams.length > 1 }">
          <a :href="withBase(award.image)" target="_blank" rel="noopener" class="sc-certificate-link" :aria-label="`查看${award.title}证书原图`">
            <img :src="withBase(award.image)" :alt="`${award.title} · ${award.level}`" loading="lazy" />
            <span>查看证书原图</span>
          </a>
          <div class="sc-award-info">
            <p class="sc-award-date">{{ award.date }}</p>
            <h3>{{ award.title }}</h3>
            <p class="sc-award-level">{{ formatAwardLevel(award.level) }}</p>
            <div class="sc-award-teams">
            <div v-for="(team, index) in award.teams" :key="index" class="sc-award-team">
              <h4>{{ award.teams.length > 1 ? `${index + 1} · ` : "" }}{{ formatAwardLevel(team.level) }}</h4>
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
            <p class="sc-project-desc">{{ project.overview }}</p>
            <p class="sc-project-status"><strong>项目现状：</strong>{{ project.status }}</p>
            <p class="sc-project-stack"><strong>技术栈：</strong>{{ project.stack }}</p>
            <div class="sc-project-tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
            <p class="sc-project-competitions"><strong>服务比赛：</strong>{{ project.competitions }}</p>
            <p v-if="project.note" class="sc-project-note">{{ project.note }}</p>
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

const projects = [
  {
    id: "patrol-robot",
    title: "巡检无人车系统的设计及应用",
    overview: "变电站巡检机器人利用激光导航定位、图像识别和高精测温等技术，实现设备状态全面感知与信息高效处理，可用于室外设备外观缺陷、表计读数、开关位置、设备测温和声音采集等巡检作业，辅助或代替人工完成设备巡检，提高巡检效率和质量。",
    status: "已能完成基础巡检任务，团队正结合实际巡检场景，从底盘结构、运动方式、感知系统和控制系统架构等方面持续升级。",
    stack: "机械设计、嵌入式软硬件设计、电路设计、底盘运动控制、强化学习、模型量化部署、前后端软件设计。",
    competitions: "OpenHarmony AI 硬件开发者大赛、嵌入式芯片与系统设计大赛、物联网设计大赛、节能减排科技大赛、研华全国 AIoT 创新应用大赛、中国机器人大会。",
    tags: ["巡检机器人", "变电站", "AIoT"],
    cover: "/images/projects/patrol-robot-project.png",
  },
  {
    id: "quadruped-robot",
    title: "四足机器狗系统的设计及应用",
    overview: "针对恶劣地形中单轮式机器人容易打滑失稳、越障爬坡能力不足，以及传统足式机器人长距离通行效率低、功耗高等问题，项目设计四足轮足机器人系统，融合轮式移动的高效性与腿式运动的越障性，具备平地高效行驶、复杂地形腿式越障和轮腿协同通过能力。",
    status: "团队已完成前期方案论证与初步设计，在机械结构、电气系统、控制系统及控制方案等方面形成初步选型，正通过理论分析、仿真建模、测试和关键部件对比开展验证与优化。",
    stack: "机械结构设计、嵌入式软硬件设计、电路设计、电机控制、传统运动控制、强化学习、模型量化加速。",
    competitions: "中国软件杯、服务外包创新创业大赛、机甲大师赛。",
    note: "把相关技术真正融合到一台四足轮足机器人上，完成从掌握知识到构建完整系统的跨越。",
    tags: ["四足轮足机器人", "运动控制", "强化学习"],
    cover: "/images/projects/quadruped-robot-project.png",
  },
];

const awardDateValue = (date: string): number => {
  const match = date.match(/(\d{4})\D+(\d{1,2})/);
  return match ? Number(match[1]) * 100 + Number(match[2]) : 0;
};

const sortedAwards = computed(() =>
  awards
    .map((award, index) => ({ award, index }))
    .sort((a, b) => awardDateValue(b.award.date) - awardDateValue(a.award.date) || a.index - b.index)
    .map(({ award }) => award),
);

/* ---------- Carousel logic ---------- */
const stageRef = ref<HTMLElement | null>(null);
const rotation = ref(0);
const hoveredId = ref<string | null>(null);
let rafId = 0;
const baseSpeed = 0.045;

const carouselAwards = awards;

/* ---- Responsive sizing ---- */
const viewportW = ref(1920);
const scale = computed(() => Math.max(0.5, Math.min(1, viewportW.value / 1440)));

const landscapeW = computed(() => Math.round(176 * scale.value));
const landscapeH = computed(() => Math.round(158 * scale.value));
const portraitW = computed(() => Math.round(180 * scale.value));
const portraitH = computed(() => Math.round(235 * scale.value));
const carouselRadius = computed(() =>
  Math.round(Math.max(landscapeW.value, portraitW.value) / (2 * Math.tan(Math.PI / carouselAwards.length)))
);

const ringStyle = computed(() => ({
  transform: `rotateY(${rotation.value}deg)`,
}));

const cardPositionStyle = (
  index: number,
  count: number,
  orientation: "landscape" | "portrait",
  awardId: string
) => {
  const angle = (360 / count) * index;
  const baseWidth = orientation === "landscape" ? landscapeW.value : portraitW.value;
  const baseHeight = orientation === "landscape" ? landscapeH.value : portraitH.value;
  const hoverScale = hoveredId.value === awardId ? 1.24 : 1;
  const hoverWidth = Math.round(baseWidth * 1.24);
  const hoverHeight = Math.round(baseHeight * 1.24);
  const width = Math.round(baseWidth * hoverScale);
  const height = Math.round(baseHeight * hoverScale);
  return {
    width: `${width}px`,
    height: `${height}px`,
    "--inner-width": `${hoverWidth}px`,
    "--inner-height": `${hoverHeight}px`,
    "--rest-scale": `${1 / 1.24}`,
    transform: `rotateY(${angle}deg) translateZ(${carouselRadius.value}px)`,
    marginTop: `${-height / 2}px`,
    marginLeft: `${-width / 2}px`,
  };
};

const formatAwardLevel = (level: string): string =>
  level.replace(/(?=(?:特等奖|一等奖|二等奖|三等奖|四等奖|五等奖|优秀组织奖))/g, "\n").trim();
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
  transition: width 0.35s ease, height 0.35s ease, margin 0.35s ease;
}

/* 卡片内层 —— 负责 hover 放大 */
.sc-carousel-card-inner {
  width: var(--inner-width, 100%);
  height: var(--inner-height, 100%);
  position: relative;
  transform-style: preserve-3d;
  transform: scale(var(--rest-scale, 1));
  transform-origin: center;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}

.sc-carousel-card-inner.is-hovered {
  transform: scale(1.03) translateZ(22px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
}

.sc-carousel-card-inner.is-hovered .sc-carousel-card-front,
.sc-carousel-card-inner.is-hovered .sc-carousel-card-back {
  border-width: 3px;
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
  box-sizing: border-box;
  overflow: hidden;
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
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.sc-back-level {
  font-size: 0.82rem;
  color: #ff7e5f;
  font-weight: 700;
  margin: 0 0 10px;
  white-space: pre-line;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.sc-back-meta {
  font-size: 0.75rem;
  color: #ccc;
  margin: 0 0 4px;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}


/* ========== 可直接阅读的证书与名单 ========== */
.sc-details-link { display: inline-block; margin-top: 18px; color: #f4d68b; }
.sc-awards-section { max-width: 2400px; }
.sc-award-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; align-items: stretch; }
.sc-award-collection { grid-column: 1 / -1; }
.sc-award-collection .sc-award-teams { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
.sc-award-detail { display: flex; flex-direction: column; border: 1px solid #e1e5ee; border-radius: 16px; overflow: hidden; background: #fff; color: #1a1a1a; box-shadow: 0 4px 20px #1523400a; }
.sc-certificate-link { display: block; padding: 20px; background: #f0f2f7; text-align: center; }
.sc-certificate-link img { display: block; width: 100%; height: 260px; object-fit: contain; }
.sc-certificate-link span { display: inline-block; margin-top: 12px; font-size: .85rem; color: #405c94; }
.sc-award-info { flex: 1; padding: 24px; }
.sc-award-info h3 { margin: 8px 0 12px; font-size: 1.15rem; line-height: 1.5; }
.sc-award-date { margin: 0; color: #667085; font-size: .85rem; }
.sc-award-level { color: #a74418; font-weight: 700; white-space: pre-line; }
.sc-award-team { border-top: 1px solid #edf0f5; margin-top: 16px; padding-top: 12px; }
.sc-award-team h4 { margin: 0 0 8px; font-size: .95rem; white-space: pre-line; }
.sc-award-team p { margin: 6px 0; line-height: 1.8; font-size: .9rem; overflow-wrap: anywhere; }
.sc-award-team .sc-award-note { color: #667085; font-size: .8rem; }
@media (max-width: 768px) { .sc-award-grid, .sc-award-collection .sc-award-teams { grid-template-columns: 1fr; } }

/* ========== 项目成果 ========== */
.sc-section {
  width: 50vw;
  box-sizing: border-box;
  max-width: 2400px;
  margin: 0 0 0 calc(50% - 25vw);
  padding: 60px 12px;
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

.sc-project-status,
.sc-project-stack,
.sc-project-competitions,
.sc-project-note {
  font-size: 0.86rem;
  color: #555;
  line-height: 1.65;
  margin: 0 0 10px;
}

.sc-project-status strong,
.sc-project-stack strong,
.sc-project-competitions strong {
  color: #2458a6;
}

.sc-project-note {
  color: #687386;
  font-style: italic;
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


  .sc-project-grid {
    grid-template-columns: 1fr;
  }

  .sc-section {
    width: calc(100% - 24px);
    margin: 0 auto;
  }
}

@media (max-width: 520px) {
}

</style>
