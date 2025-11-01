<template><div><h2 id="虚拟机补充" tabindex="-1"><a class="header-anchor" href="#虚拟机补充"><span>虚拟机补充</span></a></h2>
<h3 id="好处" tabindex="-1"><a class="header-anchor" href="#好处"><span>好处</span></a></h3>
<ul>
<li>资源隔离：每个虚拟机运行在一个独立的环境中，互不干扰，可以避免软件冲突或安全问题影响到宿主机。</li>
<li>多系统共存：在一台物理机上，可以同时运行多个操作系统（如 Windows、Linux），方便测试、开发和学习。</li>
<li>灵活管理：可以根据需要随时创建、删除、克隆虚拟机，不会像物理机那样受限。（导出为ovf文件）</li>
<li>快照与回滚：可以保存虚拟机当前的状态，当出现错误或系统崩溃时快速恢复，非常适合做实验、测试软件或学习新系统。快照就是在某一时刻保存虚拟机的完整状态（包括内存、磁盘、硬件配置等），相当于一个“时间点的备份”。</li>
</ul>
<h3 id="三种状态" tabindex="-1"><a class="header-anchor" href="#三种状态"><span>三种状态</span></a></h3>
<ul>
<li>1.运行：虚拟机正在运行，就像一台开机的电脑。</li>
<li>2.挂起：类似于笔记本电脑的“休眠”。虚拟机会把内存和运行状态保存到磁盘，下次再启动时可以直接恢复到原来的工作状态。</li>
<li>3.关机：虚拟机完全关闭，处于停止状态，需要重新启动才能使用。</li>
</ul>
<h2 id="项目举例-armbot-nav" tabindex="-1"><a class="header-anchor" href="#项目举例-armbot-nav"><span>项目举例（armbot_nav）</span></a></h2>
<h3 id="git介绍" tabindex="-1"><a class="header-anchor" href="#git介绍"><span>Git介绍</span></a></h3>
<ul>
<li>Git 是一个分布式版本控制系统，是一个代码管理软件、工具。</li>
<li>Github是一个在线云端仓库 + 协作平台。</li>
</ul>
<h3 id="安装编译" tabindex="-1"><a class="header-anchor" href="#安装编译"><span>安装编译</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">cd</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> ~/catkin_ws/src</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">git</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> clone</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> https://github.com/prabinrath/armbot_nav.git</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">catkin</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> build</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_nav</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">source</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> ~/catkin_ws/devel/setup.bash</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>.bashrc文件作用：每次你启动一个 交互式非登录 shell（比如打开一个新的终端窗口）时，Bash 就会自动执行 .bashrc 里的内容。可用于加载环境。</li>
</ul>
<h3 id="建图" tabindex="-1"><a class="header-anchor" href="#建图"><span>建图</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">roslaunch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_nav</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_gazebo.launch</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">roslaunch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_nav</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_gmapping.launch</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rosrun</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_nav</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_nav_teleop.py</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rosrun</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> map_server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> map_saver</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> -f</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> map</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>地图文件.pgm和.yaml：</li>
<li>map.pgm：环境地图的“图像数据”。</li>
<li>map.yaml：地图的“说明书”，定义比例、原点和阈值</li>
</ul>
<h3 id="导航" tabindex="-1"><a class="header-anchor" href="#导航"><span>导航</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">roslaunch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_nav</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_gazebo.launch</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">roslaunch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_nav</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> armbot_offline_nav.launch</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>更新日期：2025年9月22日</p>
</div></template>


