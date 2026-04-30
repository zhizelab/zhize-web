<template>
  <TeacherProfile v-if="teacher" :teacher="teacher" />
  <div v-else class="tp-not-found">
    <h1>未找到该教师信息</h1>
    <p>请检查链接是否正确，或返回师资队伍首页查看。</p>
    <a href="/portfolio.html">返回师资队伍</a>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { allTeachers } from "../data/teachers";
import TeacherProfile from "./TeacherProfile.vue";

const props = defineProps<{
  id: string;
}>();

const teacher = computed(() => allTeachers.find((t) => t.id === props.id) || null);
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
