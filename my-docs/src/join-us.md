---
title: 加入我们
icon: user-plus
---

<!-- 
  使用说明：
  这是一个包含了多个图片展示模块的“加入我们”页面模板。
  您只需要将下面代码中 `src` 属性里的 "https://..." 链接替换为您自己的图片链接即可。
  推荐使用图床（如 sm.ms, Imgur）或您自己服务器上的图片地址。
  占位图尺寸仅为建议，您可以根据实际情况调整。
-->

<style>
  /* 为页面中的图片布局提供样式，使其自适应 */
  .team-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }
  .gallery-item {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }
  .gallery-item:hover {
    transform: translateY(-5px);
  }
  .gallery-item img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }
  .gallery-item-caption {
    padding: 1rem;
    font-size: 0.9rem;
    color: #555;
    background: #fff;
    text-align: center;
  }
  .env-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin: 3rem 0;
    flex-wrap: wrap;
  }
  .env-text {
    flex: 1;
    min-width: 300px;
  }
  .env-image {
    flex: 1;
    min-width: 300px;
    border-radius: 12px;
    overflow: hidden;
  }
  .env-image img {
    width: 100%;
    display: block;
  }
</style>

## 🚀 加入我们，共创未来

我们不仅仅是一个团队，更是一个充满激情、创造力和梦想的大家庭。在这里，每一个想法都被珍视，每一次努力都被看见。我们相信，优秀的人携手，能创造出非凡的事业。

---

## 🌟 我们的故事与瞬间

<!-- 接口一：团队活动相册 (多图网格布局) -->
<!-- 替换下面的 src 链接为您自己的图片 -->
<div class="team-gallery">
  <div class="gallery-item">
    <img src="/images/join-us_img/team_building_1.jpg" alt="团建照片 1">
    <div class="gallery-item-caption">团建</div>
  </div>
  <div class="gallery-item">
    <img src="/images/join-us_img/team_building_2.jpg" alt="团建照片 2">
    <div class="gallery-item-caption">团建</div>
  </div>
  <div class="gallery-item">
    <img src="/images/join-us_img/team_building_3.jpg" alt="团建照片 3">
    <div class="gallery-item-caption">团建</div>
  </div>
  <div class="gallery-item">
    <img src="/images/join-us_img/2025_AIC_group_total.jpg" alt="算法精英赛合影">
    <div class="gallery-item-caption">2025年算法精英赛全国总决赛（江阴）</div>
  </div>
</div>

---

##  实验室环境
我们已加入实验室三维点云环境（Gaussian Splat + PLY），可用于新成员熟悉空间布局、设备位置和任务演示。

- 点云详情页：[`实验室环境点云详情`](/demo/resources/ROStrain/lab-point-cloud-detail.html)
- 3D 点云场景（建议新开页）：<a href="/zz_lab-c3dcloud/index.html" target="_blank" rel="noopener noreferrer">打开实验室 3D 点云场景</a>

### 招生qq群：963390856
招生说明 PDF：[`点击查看《智泽实验室2025招生说明》`](/pdf/智泽实验室2025招生说明.pdf)
