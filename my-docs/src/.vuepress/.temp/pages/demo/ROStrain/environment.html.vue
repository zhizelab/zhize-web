<template><div><h2 id="环境准备" tabindex="-1"><a class="header-anchor" href="#环境准备"><span>环境准备</span></a></h2>
<ul>
<li>安装VMware虚拟机软件</li>
<li>下载Ubuntu系统镜像（推荐20.04版本）</li>
<li>使用系统镜像创建虚拟机</li>
<li>安装ROS环境：推荐使用Fishros一键脚本进行安装</li>
</ul>
<h2 id="vmware三种网络模式" tabindex="-1"><a class="header-anchor" href="#vmware三种网络模式"><span>Vmware三种网络模式</span></a></h2>
<h3 id="一、桥接模式" tabindex="-1"><a class="header-anchor" href="#一、桥接模式"><span>一、桥接模式</span></a></h3>
<ul>
<li>虚拟机的网卡直接桥接到物理网卡，就像你宿主机和虚拟机都接在同一个交换机上。</li>
<li>虚拟机和宿主机在同一个局域网，都有独立 IP</li>
</ul>
<h3 id="二、nat模式" tabindex="-1"><a class="header-anchor" href="#二、nat模式"><span>二、NAT模式</span></a></h3>
<ul>
<li>虚拟机通过宿主机的网络进行访问，由 VMware 提供一个虚拟的 NAT 服务。</li>
<li>虚拟机获得的是一个私有子网 IP（通常 <a href="http://192.168.xxx.xxx" target="_blank" rel="noopener noreferrer">192.168.xxx.xxx</a>）。外部设备不能主动访问虚拟机。</li>
</ul>
<h3 id="三、host-only模式" tabindex="-1"><a class="header-anchor" href="#三、host-only模式"><span>三、Host-only模式</span></a></h3>
<ul>
<li>虚拟机和宿主机通过 VMware 的虚拟网卡互连，完全隔离外部网络。</li>
<li>虚拟机和宿主机能互相通信。虚拟机不能直接访问外网。</li>
</ul>
<h2 id="ros安装命令" tabindex="-1"><a class="header-anchor" href="#ros安装命令"><span>Ros安装命令</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">wget</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> http://fishros.com/install</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> -O</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> fishros</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> &#x26;&#x26; </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> Fishros</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="小乌龟验证安装" tabindex="-1"><a class="header-anchor" href="#小乌龟验证安装"><span>小乌龟验证安装</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rosrun</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> turtlesim</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> turtlesim_node</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rosrun</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> turtlesim</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> turtle_teleop_key</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="ros一些概念" tabindex="-1"><a class="header-anchor" href="#ros一些概念"><span>ros一些概念</span></a></h2>
<ul>
<li>节点，包，话题</li>
<li>节点执行某个功能，节点之间通过话题通信等方式通信</li>
<li>包是一个功能模块，包含多个节点</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rostopic</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> list</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rosnode</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> list</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rosnode</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> info</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /节点</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rostopic</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> echo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> /话题</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">rosrun/roslaunch</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>更新日期：2025年9月17日</p>
</div></template>


