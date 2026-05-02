<template>
  <div class="teacher-profile">
    <!-- 上半部分：图片 + 基本信息卡片 -->
    <section class="tp-hero">
      <div class="tp-hero-card">
        <div class="tp-hero-photo">
          <img :src="teacher.photo" :alt="teacher.name" />
        </div>
        <div class="tp-hero-info">
          <h1 class="tp-hero-name">{{ teacher.name }}</h1>
          <p class="tp-hero-title">{{ teacher.title }}</p>
          <p class="tp-hero-role">{{ teacher.role }}</p>
          <p class="tp-hero-bio">{{ teacher.shortBio }}</p>
          <div class="tp-hero-areas">
            <span v-for="area in teacher.researchAreas" :key="area" class="tp-area-tag">
              {{ area }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容 -->
    <div class="tp-layout">
      <!-- 左侧：核心信息 -->
      <aside class="tp-sidebar">
        <div class="tp-sidebar-card">
          <h3>联系方式</h3>
          <ul class="tp-contact-list">
            <li v-if="teacher.email">
              <span class="tp-contact-icon">✉</span>
              <span>{{ teacher.email }}</span>
            </li>
            <li v-if="teacher.office">
              <span class="tp-contact-icon">📍</span>
              <span>{{ teacher.office }}</span>
            </li>
          </ul>
        </div>

        <div class="tp-sidebar-card">
          <h3>教育背景</h3>
          <ul class="tp-edu-list">
            <li v-for="(edu, idx) in teacher.education" :key="idx">{{ edu }}</li>
          </ul>
        </div>

        <div class="tp-sidebar-card" v-if="teacher.courses && teacher.courses.length">
          <h3>主讲课程</h3>
          <ul class="tp-course-list">
            <li v-for="(course, idx) in teacher.courses" :key="idx">{{ course }}</li>
          </ul>
        </div>
      </aside>

      <!-- 右侧：详细介绍 -->
      <main class="tp-main">
        <section class="tp-section">
          <h2>个人简介</h2>
          <div class="tp-bio" v-html="formattedBio"></div>
        </section>

        <section class="tp-section" v-if="teacher.achievements && teacher.achievements.length">
          <h2>主要成就</h2>
          <ul class="tp-achievement-list">
            <li v-for="(item, idx) in teacher.achievements" :key="idx">
              <span class="tp-achievement-mark">★</span>
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="tp-section" v-if="teacher.projects && teacher.projects.length">
          <h2>科研项目</h2>
          <ul class="tp-project-list">
            <li v-for="(item, idx) in teacher.projects" :key="idx">{{ item }}</li>
          </ul>
        </section>

        <section class="tp-section" v-if="teacher.publications && teacher.publications.length">
          <h2>代表论文</h2>
          <ol class="tp-pub-list">
            <li v-for="(item, idx) in teacher.publications" :key="idx">{{ item }}</li>
          </ol>
        </section>

        <section class="tp-section" v-if="teacher.awards && teacher.awards.length">
          <h2>获奖情况</h2>
          <ul class="tp-award-list">
            <li v-for="(item, idx) in teacher.awards" :key="idx">
              <span class="tp-award-icon">🏆</span>
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="tp-section" v-if="teacher.students">
          <h2>指导学生</h2>
          <p class="tp-students">{{ teacher.students }}</p>
        </section>

      </main>
    </div>

    <!-- 返回按钮 -->
    <div class="tp-back">
      <a href="/portfolio.html" class="tp-back-btn">← 返回师资队伍</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Teacher } from "../../data/teachers";

const props = defineProps<{
  teacher: Teacher;
}>();

const formattedBio = computed(() => {
  return props.teacher.bio
    .split("\n")
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim()}</p>`)
    .join("");
});
</script>

<style scoped>
/* ========== Hero 区域：左侧大图 + 右侧信息 ========== */
.tp-hero {
  padding: 40px 4vw 0;
  background: linear-gradient(135deg, #f8f5f2 0%, #f0ebe6 50%, #f5f2ee 100%);
}

.tp-hero-card {
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 48px;
  align-items: flex-start;
  background: #fff;
  border-radius: 20px;
  padding: 32px 4vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.tp-hero-photo {
  width: 280px;
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  background: #eee;
}

.tp-hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.tp-hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
}

.tp-hero-name {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
}

.tp-hero-title {
  font-size: 1.2rem;
  color: #ff7e5f;
  font-weight: 700;
  margin: 0;
}

.tp-hero-role {
  font-size: 0.95rem;
  color: #888;
  margin: 0;
}

.tp-hero-bio {
  font-size: 1rem;
  color: #555;
  line-height: 1.7;
  margin: 8px 0 0;
}

.tp-hero-areas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tp-area-tag {
  font-size: 0.82rem;
  color: #555;
  background: rgba(255, 126, 95, 0.1);
  border: 1px solid rgba(255, 126, 95, 0.2);
  padding: 5px 16px;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .tp-hero-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    padding: 24px;
  }
  .tp-hero-photo {
    width: 200px;
    height: 260px;
  }
  .tp-hero-areas {
    justify-content: center;
  }
}

/* ========== 主体布局 ========== */
.tp-layout {
  width: 100%;
  margin: 0 auto;
  padding: 32px 4vw 40px;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
}

@media (max-width: 900px) {
  .tp-layout {
    grid-template-columns: 1fr;
    padding: 24px;
    gap: 24px;
  }
}

/* ========== 侧边栏 ========== */
.tp-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tp-sidebar-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.tp-sidebar-card h3 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ff7e5f;
  display: inline-block;
}

.tp-contact-list,
.tp-edu-list,
.tp-course-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tp-contact-list li,
.tp-edu-list li,
.tp-course-list li {
  font-size: 0.88rem;
  color: #444;
  line-height: 1.5;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.tp-contact-icon {
  flex-shrink: 0;
  font-size: 1rem;
  line-height: 1.4;
}

/* ========== 主内容区 ========== */
.tp-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tp-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.tp-section h2 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ff7e5f;
  display: inline-block;
}

.tp-bio :deep(p) {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.8;
  margin: 0 0 12px;
}

.tp-bio :deep(p:last-child) {
  margin-bottom: 0;
}

.tp-achievement-list,
.tp-project-list,
.tp-award-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tp-achievement-list li,
.tp-project-list li,
.tp-award-list li {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.tp-achievement-mark {
  color: #ff7e5f;
  font-weight: 700;
  flex-shrink: 0;
}

.tp-award-icon {
  flex-shrink: 0;
  font-size: 1.1rem;
}

.tp-pub-list {
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tp-pub-list li {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
  padding-left: 4px;
}

.tp-students {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.7;
  margin: 0;
}

/* ========== Markdown 自定义内容插槽 ========== */
.tp-slot-content {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.tp-slot-content :deep(h2) {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ff7e5f;
  display: inline-block;
}

.tp-slot-content :deep(p) {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.8;
  margin: 0 0 12px;
}

.tp-slot-content :deep(ul),
.tp-slot-content :deep(ol) {
  padding-left: 20px;
  margin: 0 0 12px;
}

.tp-slot-content :deep(li) {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.7;
  margin-bottom: 6px;
}

/* ========== 返回按钮 ========== */
.tp-back {
  width: 100%;
  margin: 0 auto;
  padding: 0 4vw 40px;
}

.tp-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #fff;
  color: #ff7e5f;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 2px solid rgba(255, 126, 95, 0.2);
  transition: all 0.2s;
}

.tp-back-btn:hover {
  background: #ff7e5f;
  color: #fff;
  border-color: #ff7e5f;
}
</style>

<style>
.teacher-profile-page [vp-content]:not(.custom) {
  max-width: none !important;
  width: 100vw !important;
  padding: 0 !important;
  margin: 0 auto !important;
}
.teacher-profile-page .vp-page-title {
  display: none !important;
}
</style>
