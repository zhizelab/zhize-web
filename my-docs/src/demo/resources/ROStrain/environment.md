---
title: 环境准备
icon: circle-info
order: 1
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


## 环境准备
- 安装VMware虚拟机软件
- 下载Ubuntu系统镜像（推荐20.04版本）
- 使用系统镜像创建虚拟机
- 安装ROS环境：推荐使用Fishros一键脚本进行安装

## Vmware三种网络模式

### 一、桥接模式
- 虚拟机的网卡直接桥接到物理网卡，就像你宿主机和虚拟机都接在同一个交换机上。
- 虚拟机和宿主机在同一个局域网，都有独立 IP

### 二、NAT模式
- 虚拟机通过宿主机的网络进行访问，由 VMware 提供一个虚拟的 NAT 服务。
- 虚拟机获得的是一个私有子网 IP（通常 192.168.xxx.xxx）。外部设备不能主动访问虚拟机。

### 三、Host-only模式
- 虚拟机和宿主机通过 VMware 的虚拟网卡互连，完全隔离外部网络。
- 虚拟机和宿主机能互相通信。虚拟机不能直接访问外网。

## Ros安装命令
```bash
wget http://fishros.com/install -O fishros && . Fishros
```

## 小乌龟验证安装
```bash
rosrun turtlesim turtlesim_node
```
```bash
rosrun turtlesim turtle_teleop_key
```
## ros一些概念
- 节点，包，话题
- 节点执行某个功能，节点之间通过话题通信等方式通信
- 包是一个功能模块，包含多个节点

```bash
rostopic list
```
```bash
rosnode list
```
```bash
rosnode info /节点
```
```bash
rostopic echo /话题
```
```bash
rosrun/roslaunch
```

更新日期：2025年9月17日
