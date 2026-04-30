---
title: 话题获取摄像头数据并处理
icon: circle-info
order: 3
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

## 话题通信获取摄像头数据（python）

### 创建一个python脚本
```bash
cd ~/catkin_ws/src/armbot_nav
mkdir -p scripts
cd scripts
gedit image_visualizer.py
```

### 编写python脚本
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
import cv2
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError

class ImageProcessor:
    def __init__(self):
        # 初始化ROS节点
        rospy.init_node('image_processor_node', anonymous=True)

        # 创建一个CvBridge的实例，用于ROS图像和OpenCV图像之间的转换
        self.bridge = CvBridge()

        # 初始化一个变量来存储最新的OpenCV格式的图像
        self.cv_image = None

        # 定义要订阅的图像话题
        # 确保这个话题名称与您的机器人发布的话题完全一致
        self.image_topic = "/armbot_rgb_camera/image_raw"
        
        # 创建一个订阅者，订阅指定的图像话题，并设置回调函数
        self.image_sub = rospy.Subscriber(self.image_topic, Image, self.image_callback)
        
        rospy.loginfo("节点已启动，正在等待来自话题 {} 的图像...".format(self.image_topic))

    def image_callback(self, ros_image_msg):
        try:
            # 使用CvBridge将ROS的Image消息转换为OpenCV格式
            self.cv_image = self.bridge.imgmsg_to_cv2(ros_image_msg, "bgr8")
        except CvBridgeError as e:
            rospy.logerr("CvBridge 错误: {}".format(e))

    def process_and_display(self):
        # 检查是否已经接收到了图像，避免在启动初期处理空数据
        if self.cv_image is None:
            return

        # 创建一个原始图像的副本进行处理，以防修改原始数据
        original_img = self.cv_image.copy()
        
        # --- 1. 图像剪切 (Cropping) ---
        # 获取图像的高度和宽度
        h, w, _ = original_img.shape
        # 定义剪切区域 (例如：从1/4高度到3/4高度，1/4宽度到3/4宽度)
        start_y, end_y = h // 4, h * 3 // 4
        start_x, end_x = w // 4, w * 3 // 4
        cropped_img = original_img[start_y:end_y, start_x:end_x]
        
        # --- 2. 图像翻转 (Flipping) ---
        # 1: 水平翻转; 0: 垂直翻转; -1: 水平并垂直翻转
        flipped_img = cv2.flip(original_img, 1)

        # --- 3. 灰度化和二值化 (Grayscale and Binarization) ---
        # 首先将图像转换为灰度图
        gray_img = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)
        
        # 然后进行二值化处理
        # cv2.threshold(源图像, 阈值, 最大值, 类型)
        # 这里我们将所有灰度值大于127的像素设为255(白色)，其余设为0(黑色)
        ret, binary_img = cv2.threshold(gray_img, 127, 255, cv2.THRESH_BINARY)
        
        # --- 可视化 ---
        # 显示所有处理后的图像
        cv2.imshow("Original Image", original_img)
        cv2.imshow("Cropped Image", cropped_img)
        cv2.imshow("Flipped Image", flipped_img)
        cv2.imshow("Binary Image", binary_img)
        
        cv2.waitKey(1)

def main():
    try:
        # 创建ImageProcessor类的实例
        processor = ImageProcessor()
        
        # 设置循环频率，例如30Hz
        rate = rospy.Rate(30)
        
        # 保持节点运行，直到被关闭
        while not rospy.is_shutdown():
            processor.process_and_display()
            rate.sleep()
            
    except rospy.ROSInterruptException:
        pass
    finally:
        # 在程序退出前，关闭所有OpenCV窗口
        cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
```

### 编译运行
```bash
cd ~/catkin_ws/src/armbot_nav/scripts 
chmod +x image_visualizer.py
cd ~/catkin_ws 
catkin build armbot_nav
source devel/setup.bash
rosrun armbot_nav image_visualizer.py
```

## opencv介绍
- OpenCV是一个跨平台的开源计算机视觉和机器学习软件库
- 支持 C++、Python、Java 等语言
- 从简单的图像处理（如滤波、边缘检测）到复杂的应用（如目标检测、人脸识别）都能用到

### 视频处理
```python
# 打开摄像头
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    cv2.imshow("video", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
```

### 图像读取和演示
```python
# 读取图像（默认彩色）
img = cv2.imread("test.jpg", cv2.IMREAD_COLOR)

# 显示图像
cv2.imshow("window", img)
cv2.waitKey(0)   # 等待按键
cv2.destroyAllWindows()

# 保存图像
cv2.imwrite("output.jpg", img)
```

### 图像通道操作
```python
# 拆分通道
b, g, r = cv2.split(img)

# 合并通道
img_merge = cv2.merge([b, g, r])

# 转灰度
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
```

### 图像几何变换
```python
# 缩放
resized = cv2.resize(img, (200, 200))

# 翻转 (0:上下翻转, 1:左右翻转, -1:上下+左右)
flipped = cv2.flip(img, 1)

# 旋转
rows, cols = img.shape[:2]
M = cv2.getRotationMatrix2D((cols/2, rows/2), 45, 1)  # 旋转中心, 角度, 缩放
rotated = cv2.warpAffine(img, M, (cols, rows))
```

### 绘制图像和文字
```python
# 画直线
cv2.line(img, (0,0), (200,200), (255,0,0), 3)

# 画矩形
cv2.rectangle(img, (50,50), (150,150), (0,255,0), 2)

# 画圆
cv2.circle(img, (100,100), 50, (0,0,255), -1)

# 写文字
cv2.putText(img, "OpenCV", (50,250),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
```

### 滤波和边缘检测
```python
# 高斯模糊
blur = cv2.GaussianBlur(img, (5,5), 0)

# Canny 边缘检测
edges = cv2.Canny(gray, 100, 200)
```

### 轮廓提取
```python
img = cv2.imread("shapes.png")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 二值化
ret, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

# 提取轮廓
contours, hierarchy = cv2.findContours(
    thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
)
```

更新日期：2025年9月24日
