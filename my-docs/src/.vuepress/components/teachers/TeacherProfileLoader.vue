<template>
  <TeacherProfile v-if="teacher && teacher.name" :teacher="teacher" />
  <div v-else class="tp-not-found">
    <h1>未找到该教师信息</h1>
    <p>请检查链接是否正确，或返回师资队伍首页查看。</p>
    <a href="/portfolio.html">返回师资队伍</a>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { usePageData } from "vuepress/client";
import TeacherProfile from "./TeacherProfile.vue";
import type { Teacher } from "../../data/teachers";

const page = usePageData();
const frontmatter = computed(() => page.value?.frontmatter || {});

onMounted(() => {
  // 移除内容区宽度限制
  const vpContent = document.querySelector('[vp-content]') as HTMLElement | null;
  if (vpContent) {
    vpContent.style.maxWidth = 'none';
    vpContent.style.width = '100%';
    vpContent.style.padding = '0';
  }
  // 隐藏页面标题
  const pageTitle = document.querySelector('.vp-page-title') as HTMLElement | null;
  if (pageTitle) {
    pageTitle.style.display = 'none';
  }
});

const teacher = computed<Teacher | null>(() => {
  const fm = frontmatter.value;
  if (!fm.name) return null;
  return {
    id: String(fm.id || ""),
    name: String(fm.name),
    title: String(fm.rank || ""),
    role: String(fm.role || ""),
    avatar: String(fm.avatar || ""),
    photo: String(fm.photo || fm.avatar || ""),
    shortBio: String(fm.shortBio || ""),
    researchAreas: Array.isArray(fm.researchAreas) ? fm.researchAreas.map(String) : [],
    email: String(fm.email || ""),
    office: String(fm.office || ""),
    education: Array.isArray(fm.education) ? fm.education.map(String) : [],
    bio: String(fm.bio || ""),
    achievements: Array.isArray(fm.achievements) ? fm.achievements.map(String) : [],
    courses: Array.isArray(fm.courses) ? fm.courses.map(String) : [],
    publications: Array.isArray(fm.publications) ? fm.publications.map(String) : undefined,
    projects: Array.isArray(fm.projects) ? fm.projects.map(String) : undefined,
    awards: Array.isArray(fm.awards) ? fm.awards.map(String) : undefined,
    students: fm.students ? String(fm.students) : undefined,
    link: String(fm.link || ""),
  };
});
</script>

<style scoped>
.tp-not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}
.tp-not-found h1 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 12px;
}
.tp-not-found p {
  color: #666;
  margin: 0 0 24px;
}
.tp-not-found a {
  display: inline-block;
  padding: 10px 28px;
  background: #ff7e5f;
  color: #fff;
  text-decoration: none;
  border-radius: 24px;
  font-weight: 700;
}
</style>
