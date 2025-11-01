<template><div><h2 id="一、基本概念" tabindex="-1"><a class="header-anchor" href="#一、基本概念"><span>一、基本概念</span></a></h2>
<ul>
<li>
<p><strong>目标检测（Object Detection）</strong><br>
识别画面中有什么，并给出位置坐标（边界框）。如 <strong>YOLO</strong>。</p>
</li>
<li>
<p><strong>分类（Classification）</strong><br>
给整个图像打一个标签，回答“这张图片是什么”。如 <strong>ResNet</strong>。</p>
</li>
<li>
<p><strong>OCR（Optical Character Recognition）</strong><br>
光学字符识别，把字符识别出来，形成字符串。如 <strong>PaddleOCR</strong>。</p>
</li>
</ul>
<h2 id="二、框架介绍" tabindex="-1"><a class="header-anchor" href="#二、框架介绍"><span>二、框架介绍</span></a></h2>
<ul>
<li>
<p><strong>PaddlePaddle</strong><br>
深度学习的“工具箱”，包含各种现成的零件（模型、算子、工具），可快速搭建目标检测、分类、OCR、语音识别、推荐系统等应用。</p>
</li>
<li>
<p><strong>PaddleDetection</strong><br>
基于 PaddlePaddle 的目标检测套件，集成了多种检测模型，提供训练、推理和部署接口。</p>
</li>
<li>
<p><strong>YOLO 等算法模型</strong><br>
一种算法架构，可以基于 <strong>PyTorch</strong>、<strong>PaddlePaddle</strong> 等框架实现。</p>
</li>
</ul>
<h2 id="三、训练-picodet-模型并实现目标检测" tabindex="-1"><a class="header-anchor" href="#三、训练-picodet-模型并实现目标检测"><span>三、训练 PicoDet 模型并实现目标检测</span></a></h2>
<h3 id="_1-环境配置" tabindex="-1"><a class="header-anchor" href="#_1-环境配置"><span>1. 环境配置</span></a></h3>
<ol>
<li>
<p><strong>安装 Anaconda</strong></p>
<ul>
<li>安装成功后重启命令行，路径前出现 <code v-pre>(base)</code>。</li>
</ul>
</li>
<li>
<p><strong>创建虚拟环境</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> create</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> -n</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> paddlepaddle</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> python=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3.10</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>安装 PaddlePaddle-GPU 框架</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> activate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> paddlepaddle</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pip</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> paddlepaddle-gpu==</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2.6.2</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>建议使用稳定版本，新版本可能存在 bug。</p>
</blockquote>
</li>
<li>
<p><strong>下载 PaddleDetection 源码并安装依赖</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">git</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> clone</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> https://github.com/PaddlePaddle/PaddleDetection.git</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">cd</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> PaddleDetection</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pip</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> -r</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> requirements.txt</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h3 id="_2-数据准备" tabindex="-1"><a class="header-anchor" href="#_2-数据准备"><span>2. 数据准备</span></a></h3>
<ol>
<li>
<p><strong>采集数据</strong><br>
通过仿真环境摄像头采集待识别图像，保存为多张图片。</p>
</li>
<li>
<p><strong>数据标注</strong><br>
使用 <strong>PaddleLabel</strong> 导出为 <strong>COCO 格式</strong>。<br>
安装：</p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pip</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> paddlelabel</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pip</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "connexion[flask]==2.14.2"</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "starlette&#x3C;0.27"</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "uvicorn&#x3C;0.20"</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>也可用 <strong>makesense</strong> 导出 VOC 格式，再转换为 COCO。</p>
</blockquote>
<p>示例目录结构：</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>├── anno</span></span>
<span class="line"><span>│   ├── frame1.xml</span></span>
<span class="line"><span>│   ├── frame2.xml</span></span>
<span class="line"><span>│   └── ...</span></span>
<span class="line"><span>├── image</span></span>
<span class="line"><span>│   ├── frame1.png</span></span>
<span class="line"><span>│   ├── frame2.png</span></span>
<span class="line"><span>│   └── ...</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>创建 <code v-pre>label_list.txt</code> 存放类别</li>
<li>编写脚本划分训练集/验证集</li>
<li>使用 <code v-pre>x2coco.py</code> 转换为 COCO 格式：<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">python</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> tools/x2coco.py</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> --dataset_type</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> voc</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_anno_dir</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/anno</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_anno_list</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/train.txt</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_label_list</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/label_list.txt</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_out_name</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/train.json</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">python</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> tools/x2coco.py</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> --dataset_type</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> voc</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_anno_dir</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/anno</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_anno_list</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/val.txt</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_label_list</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/label_list.txt</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">        --voc_out_name</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/test2/val.json</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong>修改 YAML 文件</strong> 以适配数据集。</p>
</li>
</ol>
<h3 id="_3-训练模型" tabindex="-1"><a class="header-anchor" href="#_3-训练模型"><span>3. 训练模型</span></a></h3>
<ul>
<li>
<p>启动训练：</p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">python</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> tools/train.py</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> -c</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> configs/picodet/picodet_s_320_coco_lcnet.yml</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>验证训练的模型：</p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">python</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> tools/infer.py</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> -c</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> configs/picodet/picodet_s_320_coco_lcnet.yml</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">     --infer_dir</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /home/hjc/dataset/zhihuishequ/images</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_4-导出与部署" tabindex="-1"><a class="header-anchor" href="#_4-导出与部署"><span>4. 导出与部署</span></a></h3>
<ol>
<li>
<p><strong>导出模型</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">python</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> tools/export_model.py</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      -c</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> configs/picodet/picodet_l_640_coco_lcnet.yml</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      -o</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> weights=output/model_final.pdparams</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      --output_dir=./inference_model</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>转换为 ONNX</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pip</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> paddle2onnx==</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.0.6</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">paddle2onnx</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> --model_dir</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> inference_model/picodet_l_640_coco_lcnet/</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      --model_filename</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> model.pdmodel</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      --params_filename</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> model.pdiparams</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      --save_file</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> picodet_l_640.onnx</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      --opset_version</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 11</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">      --enable_onnx_checker</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> True</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>安装 ONNX 推理库并运行推理</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pip</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> onnxruntime</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> onnx</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
</div></template>


