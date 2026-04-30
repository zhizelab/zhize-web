---
title: 实验室环境点云详情
icon: cubes
order: 2
category:
  - 技术文档
  - ROS机器人
tag:
  - ROS机器人
  - 点云
  - 实验室环境
author:
  - laq
  - hjc
---

# 实验室环境点云详情

本页基于新加入的点云场景配置文件读取并整理，来源目录为 `src/zz_lab-c3dcloud/`。

## 一、点云资源概览

- 主点云文件：`point_cloud.ply`
- 主点云大小：`46,055,888` Bytes（约 `43.93 MB`）
- 扩展点云文件：`splat.ply`
- 扩展点云大小：`140,166,977` Bytes（约 `133.67 MB`）
- 场景格式：`3D Gaussian Splat`（配置中 `gsplat` 类型资源）
- 点云编码：`binary_little_endian`（PLY 头可读）

## 二、场景配置摘要

依据 `2408306.json` / `config.json`：

- 场景 ID：`2408306`
- 相机初始位置：`[0, 1.25, 4]`
- 相机视场角（FOV）：`45`
- 支持交互：`mouse + touch + keyboard`
- 交互脚本：`camera-controls.mjs`

说明：该场景内包含 `point_cloud` 与 `splat` 两个实体，均为 `gsplat` 组件加载。

## 三、如何访问

点云页面入口：

- <a href="/zz_lab-c3dcloud/index.html" target="_blank" rel="noopener noreferrer">打开实验室 3D 点云场景</a>

建议从本页返回“环境准备”继续操作：

- [返回环境准备](./environment.md)

## 四、建议用途

- 新成员入门时快速了解实验室空间布局
- 机器人建图导航任务前进行环境先验认知
- 比赛项目汇报时作为场景展示辅助材料

更新日期：2026年3月1日
