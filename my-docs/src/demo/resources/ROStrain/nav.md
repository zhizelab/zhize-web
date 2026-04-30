---
title: 建图导航
icon: circle-info
order: 2
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

## 虚拟机补充

### 好处
- 资源隔离：每个虚拟机运行在一个独立的环境中，互不干扰，可以避免软件冲突或安全问题影响到宿主机。
- 多系统共存：在一台物理机上，可以同时运行多个操作系统（如 Windows、Linux），方便测试、开发和学习。
- 灵活管理：可以根据需要随时创建、删除、克隆虚拟机，不会像物理机那样受限。（导出为ovf文件）
- 快照与回滚：可以保存虚拟机当前的状态，当出现错误或系统崩溃时快速恢复，非常适合做实验、测试软件或学习新系统。快照就是在某一时刻保存虚拟机的完整状态（包括内存、磁盘、硬件配置等），相当于一个“时间点的备份”。

### 三种状态
- 1.运行：虚拟机正在运行，就像一台开机的电脑。
- 2.挂起：类似于笔记本电脑的“休眠”。虚拟机会把内存和运行状态保存到磁盘，下次再启动时可以直接恢复到原来的工作状态。
- 3.关机：虚拟机完全关闭，处于停止状态，需要重新启动才能使用。

## 项目举例（armbot_nav）

### Git介绍
- Git 是一个分布式版本控制系统，是一个代码管理软件、工具。
- Github是一个在线云端仓库 + 协作平台。

### 安装编译
```bash
cd ~/catkin_ws/src
git clone https://github.com/prabinrath/armbot_nav.git
catkin build armbot_nav
source ~/catkin_ws/devel/setup.bash
```
- .bashrc文件作用：每次你启动一个 交互式非登录 shell（比如打开一个新的终端窗口）时，Bash 就会自动执行 .bashrc 里的内容。可用于加载环境。

### 建图
```bash
roslaunch armbot_nav armbot_gazebo.launch
roslaunch armbot_nav armbot_gmapping.launch
rosrun armbot_nav armbot_nav_teleop.py
rosrun map_server map_saver -f map
```
- 地图文件.pgm和.yaml：
- map.pgm：环境地图的“图像数据”。
- map.yaml：地图的“说明书”，定义比例、原点和阈值

### 导航
```bash
roslaunch armbot_nav armbot_gazebo.launch
roslaunch armbot_nav armbot_offline_nav.launch
```

更新日期：2025年9月22日
