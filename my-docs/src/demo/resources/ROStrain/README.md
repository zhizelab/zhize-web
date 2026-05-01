---
title: ROS培训
icon: robot
category:
  - 技术文档
  - ROS机器人
tag:
  - ROS机器人
  - 培训
author:
  - laq
  - hjc
---

# ROS 机器人培训综述

本培训体系面向实验室新成员，系统讲解 **ROS（Robot Operating System）** 机器人开发的核心知识与实战技能。内容涵盖从环境搭建到视觉模型训练的完整链路，帮助你快速上手机器人项目的开发与部署。

---

## 培训内容概览

| 模块                                             | 内容                                | 目标                           |
| ------------------------------------------------ | ----------------------------------- | ------------------------------ |
| [环境准备](./environment.md)                     | VMware + Ubuntu + ROS 安装          | 搭建完整的开发环境             |
| [建图导航](./nav.md)                             | Gazebo 仿真、SLAM 建图、自主导航    | 掌握机器人空间感知与路径规划   |
| [话题获取摄像头数据并处理](./imageProcessing.md) | ROS 话题通信、OpenCV 图像处理       | 实现传感器数据获取与视觉预处理 |
| [视觉模型的训练](./visionTraining.md)            | 目标检测、PaddleDetection、模型部署 | 训练并部署自定义视觉识别模型   |

---

## 一、环境准备

ROS 开发基于 Linux 系统，推荐使用 **VMware 虚拟机** 运行 **Ubuntu 20.04**，并通过 **Fishros 一键脚本** 快速安装 ROS 环境。

**核心要点：**
- 理解 VMware 三种网络模式（桥接 / NAT / Host-only）的适用场景
- 掌握 `.bashrc` 环境配置与 `source` 命令的作用
- 通过 `turtlesim` 小乌龟验证 ROS 安装是否成功
- 熟悉 ROS 核心概念：节点（Node）、包（Package）、话题（Topic）

> 详细步骤请查看 [环境准备](./environment.md)

---

## 二、建图导航

基于 **armbot_nav** 项目，在 Gazebo 仿真环境中完成机器人的 SLAM 建图与自主导航。

**核心流程：**
1. **启动仿真环境** — `roslaunch armbot_nav armbot_gazebo.launch`
2. **SLAM 建图** — 使用 `gmapping` 算法实时构建环境地图
3. **键盘遥控** — 通过 `teleop` 节点控制机器人遍历整个空间
4. **保存地图** — 导出 `.pgm` + `.yaml` 地图文件供导航使用
5. **自主导航** — 加载已有地图，实现基于 A* / Dijkstra 的路径规划

**关键工具：**
- `map_server`：地图的保存与加载
- `gmapping`：基于激光雷达的 SLAM 建图
- `amcl`：蒙特卡洛定位，确定机器人在地图中的实时位置

> 详细步骤请查看 [建图导航](./nav.md)

---

## 三、话题通信与图像处理

ROS 中传感器数据通过**话题（Topic）**以**发布-订阅**模式传输。本模块教你订阅摄像头图像话题，并使用 **OpenCV** 进行实时处理。

**核心内容：**
- 编写 Python 节点，订阅 `/armbot_rgb_camera/image_raw` 话题
- 使用 `cv_bridge` 将 ROS 的 `Image` 消息转换为 OpenCV 格式
- 掌握图像基础处理：裁剪、翻转、灰度化、二值化
- OpenCV 进阶操作：滤波、边缘检测（Canny）、轮廓提取、几何变换

**典型应用场景：**
- 实时视觉监控与画面预处理
- 为后续目标检测模型提供标准化输入图像
- 机器人视觉 servo 控制的前置步骤

> 详细步骤请查看 [话题获取摄像头数据并处理](./imageProcessing.md)

---

## 四、视觉模型训练与部署

基于 **PaddlePaddle** 深度学习框架，训练轻量级目标检测模型 **PicoDet**，并导出为 **ONNX** 格式进行跨平台部署。

**核心流程：**
1. **环境配置** — Anaconda 虚拟环境 + PaddlePaddle-GPU + PaddleDetection
2. **数据采集** — 通过仿真摄像头采集待识别目标的图像
3. **数据标注** — 使用 PaddleLabel 标注并导出为 COCO 格式
4. **模型训练** — 基于 PicoDet 架构训练自定义检测模型
5. **推理验证** — 使用训练好的模型对新图像进行目标检测
6. **导出部署** — 导出为静态图，并转换为 ONNX 格式用于边缘设备部署

**涉及技术：**
- **目标检测**：YOLO、PicoDet 等单阶段检测器
- **分类网络**：ResNet 等骨干网络
- **OCR**：PaddleOCR 文字识别
- **部署格式**：ONNX（跨平台推理标准）

> 详细步骤请查看 [视觉模型的训练](./visionTraining.md)

---

## 学习路径建议

```
环境准备 ──→ 建图导航 ──→ 图像处理 ──→ 视觉模型训练 ──→ 实践项目整合
```

1. **第 1 周**：完成环境搭建，熟悉 ROS 基础命令与小乌龟操作
2. **第 2 周**：在 Gazebo 中完成建图与导航，理解 TF 坐标变换
3. **第 3 周**：编写图像处理节点，掌握 OpenCV 核心 API
4. **第 4 周**：完成数据集采集、标注、模型训练与 ONNX 导出
5. **第 5 周+**：整合各模块，在仿真或真实机器人上完成端到端视觉导航任务

---

## 相关资源

- [ROS Wiki 官方文档](http://wiki.ros.org/)
- [PaddleDetection GitHub](https://github.com/PaddlePaddle/PaddleDetection)
- [OpenCV 官方教程](https://docs.opencv.org/)
- [Gazebo 仿真平台](http://gazebosim.org/)

---

*本培训内容由智泽实验室整理编写，旨在帮助新成员快速掌握机器人开发的核心技能。如有疑问，请联系实验室学长。*
