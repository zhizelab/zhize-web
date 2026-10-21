<template>
  <section class="team-footprints">
    <header class="team-footprints__header">
      <h2>团队足迹</h2>
      <p>竞赛同行，也记录并肩成长的每一次相聚</p>
    </header>

    <div class="team-footprints__featured">
      <figure
        v-for="(photo, index) in featuredPhotos"
        :key="photo.id"
        class="team-footprints__photo"
        :class="{ 'team-footprints__photo--leading': index === 0 }"
      >
        <img :src="withBase(photo.src)" :alt="photo.title" loading="lazy" />
        <figcaption>
          <strong>{{ photo.title }}</strong>
          <span>{{ photo.caption }}</span>
        </figcaption>
      </figure>
    </div>

    <div class="team-footprints__moments-heading">
      <h3>竞赛现场与团队日常</h3>
      <span>{{ momentPhotos.length }} 个片段</span>
    </div>

    <div class="team-footprints__moments">
      <figure v-for="photo in momentPhotos" :key="photo.id" class="team-footprints__photo">
        <img :src="withBase(photo.src)" :alt="photo.title" loading="lazy" />
        <figcaption>
          <strong>{{ photo.title }}</strong>
          <span>{{ photo.caption }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { withBase } from "vuepress/client";
import { featuredPhotos, momentPhotos } from "../../data/gallery";
</script>

<style scoped>
.team-footprints {
  margin: 3rem 0;
}

.team-footprints__header {
  margin-bottom: 2rem;
  text-align: center;
}

.team-footprints__header h2 {
  margin: 0 0 0.5rem;
  color: #1a1a1a;
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.team-footprints__header p {
  margin: 0;
  color: #667085;
}

.team-footprints__featured,
.team-footprints__moments {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.team-footprints__featured {
  grid-auto-rows: 220px;
}

.team-footprints__photo {
  position: relative;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  border-radius: 16px;
  background: #101b2d;
}

.team-footprints__photo--leading {
  grid-column: span 2;
  grid-row: span 2;
}

.team-footprints__featured .team-footprints__photo:nth-child(6),
.team-footprints__featured .team-footprints__photo:nth-child(7) {
  grid-column: span 2;
}

.team-footprints__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.team-footprints__photo:hover img {
  transform: scale(1.035);
}

.team-footprints__photo::after {
  position: absolute;
  inset: 35% 0 0;
  background: linear-gradient(transparent, rgba(4, 12, 26, 0.88));
  content: "";
  pointer-events: none;
}

.team-footprints__photo figcaption {
  position: absolute;
  right: 18px;
  bottom: 15px;
  left: 18px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #fff;
}

.team-footprints__photo figcaption strong {
  font-size: 1rem;
  line-height: 1.35;
}

.team-footprints__photo figcaption span {
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.82rem;
}

.team-footprints__moments-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 48px 0 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #dce2eb;
}

.team-footprints__moments-heading h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.25rem;
}

.team-footprints__moments-heading span {
  color: #667085;
  font-size: 0.85rem;
}

.team-footprints__moments .team-footprints__photo {
  aspect-ratio: 4 / 3;
}

@media (max-width: 768px) {
  .team-footprints__featured,
  .team-footprints__moments {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 180px;
  }

  .team-footprints__featured .team-footprints__photo--leading,
  .team-footprints__featured .team-footprints__photo:nth-child(6),
  .team-footprints__featured .team-footprints__photo:nth-child(7) {
    grid-column: span 2;
  }
}

@media (max-width: 520px) {
  .team-footprints__featured,
  .team-footprints__moments {
    grid-template-columns: 1fr;
  }

  .team-footprints__featured .team-footprints__photo,
  .team-footprints__featured .team-footprints__photo--leading,
  .team-footprints__featured .team-footprints__photo:nth-child(6),
  .team-footprints__featured .team-footprints__photo:nth-child(7) {
    grid-column: auto;
    grid-row: auto;
    height: 230px;
  }

  .team-footprints__moments .team-footprints__photo {
    aspect-ratio: auto;
    height: 220px;
  }
}
</style>
