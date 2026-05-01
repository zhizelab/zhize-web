<template>
  <div class="member-profile">
    <!-- 上半部分：头像 + 基本信息卡片 -->
    <section class="mp-hero">
      <div class="mp-hero-card">
        <div class="mp-hero-photo">
          <img :src="member.photo" :alt="member.name" />
        </div>
        <div class="mp-hero-info">
          <h1 class="mp-hero-name">{{ member.name }}</h1>
          <p class="mp-hero-grade">{{ member.grade }} · {{ member.major }}</p>
          <p class="mp-hero-role">{{ member.role }}</p>
          <p class="mp-hero-bio">{{ member.shortBio }}</p>
          <div class="mp-hero-areas">
            <span v-for="area in member.researchAreas" :key="area" class="mp-area-tag">
              {{ area }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容 -->
    <div class="mp-layout">
      <!-- 左侧：核心信息 -->
      <aside class="mp-sidebar">
        <div class="mp-sidebar-card">
          <h3>联系方式</h3>
          <ul class="mp-contact-list">
            <li v-if="member.email">
              <span class="mp-contact-icon">✉</span>
              <span>{{ member.email }}</span>
            </li>
          </ul>
        </div>

        <div class="mp-sidebar-card" v-if="member.skills && member.skills.length">
          <h3>技能特长</h3>
          <ul class="mp-skill-list">
            <li v-for="(skill, idx) in member.skills" :key="idx">{{ skill }}</li>
          </ul>
        </div>

        <div class="mp-sidebar-card" v-if="member.awards && member.awards.length">
          <h3>获奖情况</h3>
          <ul class="mp-award-list">
            <li v-for="(item, idx) in member.awards" :key="idx">
              <span class="mp-award-icon">🏆</span>
              {{ item }}
            </li>
          </ul>
        </div>
      </aside>

      <!-- 右侧：详细介绍 -->
      <main class="mp-main">
        <section class="mp-section">
          <h2>个人简介</h2>
          <div class="mp-bio" v-html="formattedBio"></div>
        </section>

        <section class="mp-section" v-if="member.projects && member.projects.length">
          <h2>参与项目</h2>
          <ul class="mp-project-list">
            <li v-for="(item, idx) in member.projects" :key="idx">{{ item }}</li>
          </ul>
        </section>
      </main>
    </div>

    <!-- 返回按钮 -->
    <div class="mp-back">
      <a href="/demo/members-list.html" class="mp-back-btn">← 返回研究队伍</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { MemberProfileData } from "../../data/members";

const props = defineProps<{
  member: MemberProfileData;
}>();

const formattedBio = computed(() => {
  return props.member.bio
    .split("\n")
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim()}</p>`)
    .join("");
});
</script>

<style scoped>
/* ========== Hero 区域：左侧大图 + 右侧信息 ========== */
.mp-hero {
  padding: 40px 24px 0;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f2f6fa 100%);
}

.mp-hero-card {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  align-items: flex-start;
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.mp-hero-photo {
  width: 240px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  background: #eee;
}

.mp-hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.mp-hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
}

.mp-hero-name {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
}

.mp-hero-grade {
  font-size: 1.1rem;
  color: #4a90d9;
  font-weight: 700;
  margin: 0;
}

.mp-hero-role {
  font-size: 0.95rem;
  color: #888;
  margin: 0;
}

.mp-hero-bio {
  font-size: 1rem;
  color: #555;
  line-height: 1.7;
  margin: 8px 0 0;
}

.mp-hero-areas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.mp-area-tag {
  font-size: 0.82rem;
  color: #555;
  background: rgba(74, 144, 217, 0.1);
  border: 1px solid rgba(74, 144, 217, 0.2);
  padding: 5px 16px;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .mp-hero-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    padding: 24px;
  }
  .mp-hero-photo {
    width: 180px;
    height: 220px;
  }
  .mp-hero-areas {
    justify-content: center;
  }
}

/* ========== 主体布局 ========== */
.mp-layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 40px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
}

@media (max-width: 900px) {
  .mp-layout {
    grid-template-columns: 1fr;
    padding: 24px;
    gap: 24px;
  }
}

/* ========== 侧边栏 ========== */
.mp-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mp-sidebar-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.mp-sidebar-card h3 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #4a90d9;
  display: inline-block;
}

.mp-contact-list,
.mp-skill-list,
.mp-award-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mp-contact-list li,
.mp-skill-list li,
.mp-award-list li {
  font-size: 0.88rem;
  color: #444;
  line-height: 1.5;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.mp-contact-icon {
  flex-shrink: 0;
  font-size: 1rem;
  line-height: 1.4;
}

.mp-award-icon {
  flex-shrink: 0;
  font-size: 1.1rem;
}

/* ========== 主内容区 ========== */
.mp-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mp-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.mp-section h2 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #4a90d9;
  display: inline-block;
}

.mp-bio :deep(p) {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.8;
  margin: 0 0 12px;
}

.mp-bio :deep(p:last-child) {
  margin-bottom: 0;
}

.mp-project-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mp-project-list li {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
  padding-left: 20px;
  position: relative;
}

.mp-project-list li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #4a90d9;
  font-weight: 700;
}

/* ========== 返回按钮 ========== */
.mp-back {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

.mp-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #fff;
  color: #4a90d9;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 2px solid rgba(74, 144, 217, 0.2);
  transition: all 0.2s;
}

.mp-back-btn:hover {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
</style>
