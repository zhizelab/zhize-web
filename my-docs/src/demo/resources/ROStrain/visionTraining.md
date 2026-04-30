---
title: 视觉模型的训练
icon: circle-info
order: 4
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

## 一、基本概念

- **目标检测（Object Detection）**  
  识别画面中有什么，并给出位置坐标（边界框）。如 **YOLO**。

- **分类（Classification）**  
  给整个图像打一个标签，回答“这张图片是什么”。如 **ResNet**。

- **OCR（Optical Character Recognition）**  
  光学字符识别，把字符识别出来，形成字符串。如 **PaddleOCR**。


## 二、框架介绍

- **PaddlePaddle**  
  深度学习的“工具箱”，包含各种现成的零件（模型、算子、工具），可快速搭建目标检测、分类、OCR、语音识别、推荐系统等应用。

- **PaddleDetection**  
  基于 PaddlePaddle 的目标检测套件，集成了多种检测模型，提供训练、推理和部署接口。

- **YOLO 等算法模型**  
  一种算法架构，可以基于 **PyTorch**、**PaddlePaddle** 等框架实现。


## 三、训练 PicoDet 模型并实现目标检测

### 1. 环境配置

1. **安装 Anaconda**  
   - 安装成功后重启命令行，路径前出现 `(base)`。

2. **创建虚拟环境**  
   ```bash
   conda create -n paddlepaddle python=3.10
   ```

3. **安装 PaddlePaddle-GPU 框架**  
   ```bash
   conda activate paddlepaddle
   pip install paddlepaddle-gpu==2.6.2
   ```
   > 建议使用稳定版本，新版本可能存在 bug。

4. **下载 PaddleDetection 源码并安装依赖**  
   ```bash
   git clone https://github.com/PaddlePaddle/PaddleDetection.git
   cd PaddleDetection
   pip install -r requirements.txt
   ```


### 2. 数据准备

1. **采集数据**  
   通过仿真环境摄像头采集待识别图像，保存为多张图片。

2. **数据标注**  
   使用 **PaddleLabel** 导出为 **COCO 格式**。  
   安装：
   ```bash
   pip install paddlelabel
   pip install "connexion[flask]==2.14.2" "starlette<0.27" "uvicorn<0.20"
   ```
   > 也可用 **makesense** 导出 VOC 格式，再转换为 COCO。

   示例目录结构：
   ```
   ├── anno
   │   ├── frame1.xml
   │   ├── frame2.xml
   │   └── ...
   ├── image
   │   ├── frame1.png
   │   ├── frame2.png
   │   └── ...
   ```

   - 创建 `label_list.txt` 存放类别  
   - 编写脚本划分训练集/验证集  
   - 使用 `x2coco.py` 转换为 COCO 格式：
     ```bash
     python tools/x2coco.py --dataset_type voc        --voc_anno_dir /home/hjc/dataset/test2/anno        --voc_anno_list /home/hjc/dataset/test2/train.txt        --voc_label_list /home/hjc/dataset/test2/label_list.txt        --voc_out_name /home/hjc/dataset/test2/train.json
     
     python tools/x2coco.py --dataset_type voc        --voc_anno_dir /home/hjc/dataset/test2/anno        --voc_anno_list /home/hjc/dataset/test2/val.txt        --voc_label_list /home/hjc/dataset/test2/label_list.txt        --voc_out_name /home/hjc/dataset/test2/val.json
     ```

3. **修改 YAML 文件** 以适配数据集。


### 3. 训练模型

- 启动训练：
  ```bash
  python tools/train.py -c configs/picodet/picodet_s_320_coco_lcnet.yml
  ```

- 验证训练的模型：
  ```bash
  python tools/infer.py -c configs/picodet/picodet_s_320_coco_lcnet.yml     --infer_dir /home/hjc/dataset/zhihuishequ/images
  ```


### 4. 导出与部署

1. **导出模型**  
   ```bash
   python tools/export_model.py      -c configs/picodet/picodet_l_640_coco_lcnet.yml      -o weights=output/model_final.pdparams      --output_dir=./inference_model
   ```

2. **转换为 ONNX**  
   ```bash
   pip install paddle2onnx==1.0.6
   paddle2onnx --model_dir inference_model/picodet_l_640_coco_lcnet/      --model_filename model.pdmodel      --params_filename model.pdiparams      --save_file picodet_l_640.onnx      --opset_version 11      --enable_onnx_checker True
   ```

3. **安装 ONNX 推理库并运行推理**  
   ```bash
   pip install onnxruntime onnx
   ```
