<template>
  <MemberProfile v-if="member && member.name" :member="member" />
  <div v-else class="mp-not-found">
    <h1>未找到该成员信息</h1>
    <p>请检查链接是否正确，或返回研究队伍首页查看。</p>
    <a href="/demo/members-list.html">返回研究队伍</a>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { usePageData } from "vuepress/client";
import MemberProfile from "./MemberProfile.vue";
import type { MemberProfileData } from "../../data/members";

const page = usePageData();
const frontmatter = computed(() => page.value?.frontmatter || {});

onMounted(() => {
  const vpContent = document.querySelector('[vp-content]') as HTMLElement | null;
  if (vpContent) {
    vpContent.style.maxWidth = 'none';
    vpContent.style.width = '100%';
    vpContent.style.padding = '0';
  }
  const pageTitle = document.querySelector('.vp-page-title') as HTMLElement | null;
  if (pageTitle) {
    pageTitle.style.display = 'none';
  }
});

const member = computed<MemberProfileData | null>(() => {
  const fm = frontmatter.value;
  if (!fm.name) return null;
  return {
    id: String(fm.id || ""),
    name: String(fm.name),
    grade: String(fm.grade || ""),
    major: String(fm.major || ""),
    role: String(fm.role || ""),
    avatar: String(fm.avatar || ""),
    photo: String(fm.photo || fm.avatar || ""),
    shortBio: String(fm.shortBio || ""),
    researchAreas: Array.isArray(fm.researchAreas) ? fm.researchAreas.map(String) : [],
    email: String(fm.email || ""),
    skills: Array.isArray(fm.skills) ? fm.skills.map(String) : undefined,
    projects: Array.isArray(fm.projects) ? fm.projects.map(String) : undefined,
    awards: Array.isArray(fm.awards) ? fm.awards.map(String) : undefined,
    bio: String(fm.bio || ""),
    link: String(fm.link || ""),
  };
});
</script>

<style scoped>
.mp-not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}
.mp-not-found h1 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 12px;
}
.mp-not-found p {
  color: #666;
  margin: 0 0 24px;
}
.mp-not-found a {
  display: inline-block;
  padding: 10px 28px;
  background: #4a90d9;
  color: #fff;
  text-decoration: none;
  border-radius: 24px;
  font-weight: 700;
}
</style>
