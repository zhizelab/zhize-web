<template>
  <div class="teachers-showcase">
    <div class="ts-wall">
      <a v-for="(teacher, index) in teachers" :key="teacher.id"
         class="ts-card"
         :class="[`ts-card-variant-${(index % 3) + 1}`]"
         :href="teacher.link">
        <div class="ts-card-visual">
          <div class="ts-card-photo-wrap">
            <img class="ts-card-photo" :src="teacher.avatar" :alt="teacher.name" />
          </div>
          <div class="ts-card-tag">
            <span class="ts-card-tag-name">{{ teacher.name }}</span>
            <span class="ts-card-tag-role">{{ teacher.role }}</span>
          </div>
        </div>
        <div class="ts-card-body">
          <h3 class="ts-card-name">{{ teacher.name }}</h3>
          <p class="ts-card-title">{{ teacher.title }}</p>
          <p class="ts-card-bio">{{ teacher.shortBio }}</p>
          <div class="ts-card-areas">
            <span v-for="area in teacher.researchAreas.slice(0,2)" :key="area"
                  class="ts-card-area-tag">{{ area }}</span>
          </div>
          <span class="ts-card-action">查看详情 →</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { allTeachers } from "../../data/teachers";
const teachers = allTeachers;
</script>

<style scoped>
.teachers-showcase {
  position: fixed;
  top: var(--navbar-height, 60px);
  left: 0;
  width: 100vw;
  height: calc(100vh - var(--navbar-height, 60px));
  z-index: 999;
  overflow: hidden;
}

.ts-wall {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 0;
  padding: 5vh 0 10vh 0;
  background: url('/images/teacher-photo/changzhou_campus.jpg') center/cover no-repeat;
  perspective: 1800px;
  perspective-origin: 50% 50%;
}

.ts-card {
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(100% / 6);
  min-width: 0;
  height: 78%;
  text-decoration: none;
  color: inherit;
  border-radius: 0;
  overflow: hidden;
  background: transparent;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  border-right: 1px solid rgba(0,0,0,0.06);
  box-shadow: inset 0 0 40px rgba(0,0,0,0.03);
}

/* 精确 3D 投影拼接 —— 奇→偶差 -18.69px(-5.84%)，偶→奇差 -56.25px(-17.58%) */
.ts-card:nth-child(1) { --tx: 26.34%; transform: translateX(var(--tx)) rotateY(-28deg) translateZ(-20px); }
.ts-card:nth-child(2) { --tx: 20.50%; transform: translateX(var(--tx)) rotateY( 28deg) translateZ(-20px); }
.ts-card:nth-child(3) { --tx:  2.92%; transform: translateX(var(--tx)) rotateY(-28deg) translateZ(-20px); }
.ts-card:nth-child(4) { --tx: -2.92%; transform: translateX(var(--tx)) rotateY( 28deg) translateZ(-20px); }
.ts-card:nth-child(5) { --tx:-20.50%; transform: translateX(var(--tx)) rotateY(-28deg) translateZ(-20px); }
.ts-card:nth-child(6) { --tx:-26.34%; transform: translateX(var(--tx)) rotateY( 28deg) translateZ(-20px); }

.ts-card:hover {
  transform: translateX(var(--tx)) rotateY(0deg) translateZ(80px) scale(1.06) !important;
  z-index: 100;
  background: #fff;
  box-shadow: 0 40px 100px rgba(0,0,0,0.2);
  border-radius: 16px;
}

/* 彩色背景 */
.ts-card-variant-1 .ts-card-visual {
  background: linear-gradient(180deg, #ff9a76 0%, #ff7e5f 100%);
}
.ts-card-variant-2 .ts-card-visual {
  background: linear-gradient(180deg, #a8edea 0%, #7ee8fa 100%);
}
.ts-card-variant-3 .ts-card-visual {
  background: linear-gradient(180deg, #ffd194 0%, #ffb347 100%);
}

.ts-card-visual {
  position: relative;
  height: 58%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 8px;
  overflow: visible;
  margin: 0 8px;
  border-radius: 16px 16px 0 0;
}

.ts-card-photo-wrap {
  position: relative;
  width: 100%;
  height: 95%;
  margin-bottom: -10px;
  z-index: 2;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,0.18));
}

.ts-card-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 16px 16px 0 0;
  mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
}

.ts-card-tag {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ts-card-tag-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  letter-spacing: 2px;
}

.ts-card-tag-role {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.9);
  margin-top: 4px;
  padding: 2px 10px;
  background: rgba(0,0,0,0.15);
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.ts-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 20px 20px;
  background: #fff;
  border-radius: 0 0 12px 12px;
}

.ts-card-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 4px;
}

.ts-card-title {
  font-size: 0.8rem;
  color: #888;
  margin: 0 0 8px;
}

.ts-card-bio {
  font-size: 0.78rem;
  color: #666;
  line-height: 1.5;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin: 0 0 10px;
}

.ts-card-areas {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.ts-card-area-tag {
  font-size: 0.68rem;
  color: #777;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.ts-card-action {
  font-size: 0.75rem;
  color: #b08d6e;
  font-weight: 500;
  margin-top: auto;
}
</style>
