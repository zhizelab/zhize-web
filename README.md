**本网站是基于[vuepress-theme-hope](https://theme-hope.vuejs.press/zh/)主题进行构建的**

**本文本次更新说明**：重新梳理了项目结构，附加了更新说明，更改了提交git方案（.gitignore)，特别强调并更改了推送源码的方法，增加了拉取方法。

## 重点

源码在https://github.com/zhizelab/zhize-web/的main分支

静态挂载在https://github.com/zhizelab/zhizelab.github.io的main分支

## 拉取源代码

### 首次拉取

```powershell
git clone https://github.com/zhizelab/zhize-web.git
cd zhize-web
git checkout main
```

### 再次拉取

先清理`dist`文件夹下的`.git`文件

```powershell
cd zhize-web
git fetch origin
git checkout main
git pull origin main
```


## 本地运行

```bash
cd 路径/my-docs
pnpm install    # 下载库
pnpm docs:dev   # 运行
```

然后启动 http://localhost:8080

## 文件结构

### 结构总览

```txt
my-docs/
└── src/                           主要内容区（Markdown 页面、分栏等）
	└── .vuepress/                 VuePress 站点配置与主题定制区
		├── .temp/                 构建生成的临时文件，不要手动编辑
		└── dist/                  构建输出，不要手动编辑
```

### 内容

在`./src/.vuepress/public/images/*`放图片，引用图片时路径为`/images/*`

```txt
.
└── my-docs/                   
    └── src/
        ├── demo/                     “关于实验室”页
        ├── guide/                    “指南”页
        ├── zh/
        ├── .vuepress/
        │   ├── components/           自定义组件
        │   ├── styles/               自定义样式
        │   ├── public/               公共静态资源
        │   ├── styles/               
        │   │	├── palette.scss      主题“变量/配色”入口。用于覆盖主题色、字号、间距等SCSS变量
        │   │	├── index.scss        全站样式补丁/自定义样式入口
        │   │	└── config.scss       主题样式配置项或变量映射文件
        │   ├── navbar.ts             顶部导航
        │   ├── sidebar.ts            侧边栏
        │   ├── config.ts             VuePress站点入口配置文件
        │   ├── client.ts       VuePress客户端配置入口，用于在浏览器端注册组件、插件或做客户端增强
        │   └── theme.ts              主题配置文件，用于配置 VuePress Theme Hope 的主题功能
        ├── join-us.md                “加入我们”页
        ├── portfolio.md              次页内容（负责老师）
        ├── visitor-dashboard.md      “仪表盘”页
        └── README.md                 首页内容
```

其中`index.scss`由于内容过多，我已经进行拆分到同名兄弟文件夹内



## 如何更新网站

### ts文件的更新

在sidebar.ts文件内：

```ts
import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",                           //此处是主页
    "portfolio",                  //此处是portfolio页
    {                             //这个大括号内是demo页
      text: "关于实验室",
      icon: "laptop-code",
      prefix: "demo/",        //用于拼接网站路径
      link: "demo/", //表示了连接到demo页，即点击了“关于实验室”这一块就会跳转到demo页，若没有这个参数，则无法点击“关于实验室”。当然，由于本文件是侧边栏文件，不会影响手动访问http://localhost:8080/demo/页面
      children: [
        {
          text: "ROS培训",
          icon: "robot",
          prefix: "ROStrain/",
          link: "ROStrain/",     //此页须在ROStrain下的README.md里面编写（即总述）
          children: [
            "environment",
            "nav",
            "imageProcessing",
            "visionTraining",
          ],
        },
        {
          text: "硬件培训",
          icon: "plug",
          prefix: "HardWare/",
          link: "HardWare/",
          children: [

          ],
        }
      ],
    },
    {
      text: "文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    },
  ],
});
```
补充说明：以`demo/HardWare`为例，例如只有`HardWare`这个页面而没有其子页，直接在`demo`文件夹内创建`HardWare.md`文件即可；若有子页，则创建一个`HardWare`文件夹，在本文件夹内的`README.md`文件写入本页内容

### md文件的更新

.md文件内用三个减号围起来的是设置这个网页属性的以及标题的，减号外的是写正文的（注意正文不要用一级标题）

#### 顶部配置快

例如：

```md
---
title: 成员列表
description: 实验室成员介绍
layout: Layout
sidebar: true
---
```

常见字段（Theme Hope）：

- title：页面标题（也影响页面 `<h1>` 和浏览器标题），因此除除配置块的正文不要用一级标题
- description：页面描述
- heroImage / heroText / tagline：首页 Hero 区域配置
- navbar / sidebar：是否显示导航或侧边栏
- icon：导航或卡片中的图标
- order：侧边栏默认排序，当然你可以手动写ts文件而不受默认控制，例如上小节代码
- article / pageInfo：文章页信息控制

#### 其他（附参考文档）

**更多信息，查看文档[Markdown | VuePress](https://v2.vuepress.vuejs.org/zh/guide/markdown.html)**

## 重要提醒

**说明**：静态网页上传到的是`zhizelab.github.io`仓库，源码上传到了`zhize-web`仓库，**一定看清分支！！！**

上传时候base路径记得是空不要有其他的内容，不然会导致网页挂载有路径。（此处base路径即`.vuepress/config.ts`的base参数。）

**更新时**：从源码仓库选择main分支，下载到本地（如果源码不含node分支记得补上），在此基础上修改，然后提交。一般提交时两者静态部署和源码同步提交（参考下文）

## 更新到github上（上传网页）

```powershell
cd 路径\my-docs

pnpm docs:build

cd src/.vuepress/dist
如果没有git库要git init一下   # 大概率没有，不用担心
git add .
git commit -m "更新说明"
git push -f https://github.com/zhizelab/zhizelab.github.io.git main   # 若报错可以先运行git branch -M master main(这取决于你运行git branch是哪个，是master的话会报错)，还有可能是没有开/关梯子的问题，关/开之后就好了，若还没好，重复几次
# 如果上传不上去可以试试开全局模式 
删掉上面git init的 .git （在dist目录下，删不掉的话可以使用pnpm docs:build重新构建进行覆盖），（一定不要删除和my-docs同级别的那个.git）  # 因为这个.git会干扰外层.git
```

然后需要等待几分钟就可以在 https://zhizelab.github.io/ 看到更新后的网页了，此时[setting-github pages](https://github.com/zhizelab/zhizelab.github.io/settings/pages)会有部署记录的

## 更新到github上（上传源文件）

**前置检查**：确保你在项目根目录（和 `my-docs` 同级的那个目录），并且该目录下有 `.git` 仓库。不要进入 `dist` 目录操作。

```powershell
删掉之前git init的 .git （在dist目录下），（一定不要删除和my-docs同级别的那个.git）
cd my-docs上一级路径
# git init     # 一般用不到，除非你删除了和my-docs同级别的那个.git

# 以下@""@包含的这一整块都是.gitignore，作用是提交git的时候忽略node_modules,静态页面等
# 另：这块生成一次就行了，会在my-docs下创建一个.gitignore文件，以后更新就跳过这一块
# 如果克隆的仓库没有.gitignore，就运行这块代码，仍然是一般用不到
# @"
# my-docs/node_modules/
# my-docs/src/.vuepress/dist/
# my-docs/src/.vuepress/.temp/
# my-docs/src/.vuepress/.cache/
# my-docs/.DS_Store                        # 这一行是为Mac用户考虑的
# my-docs/Thumbs.db
# "@ | Set-Content .gitignore

# 1. 确认本地分支名（应该是 main）
git branch

# 2. 提交更改
git add .
git commit -m "更新说明"

# 3. 首次推送（建立本地 main 和远程 main 的关联）
git push -u origin main

# 4. 以后推送（关联建立后可直接 push）
git push
```

**多人协作时（先拉取再推送，避免冲突）**：

```powershell
git fetch origin
git pull origin main   # 先拉取远程最新代码
git push origin main:main   # 再推送
```

**如果遇到 push 失败**：
- 检查网络代理：开/关全局代理试试
- 检查分支：运行 `git branch` 确认本地是 `main`
- 检查远程：运行 `git remote -v` 确认远程地址正确
- 实在不行就重复几次，或者加 `-f` 强制推送（单人开发时可用）



## 建议更新说明：

**注明修改内容，注明修改人，修改时间**

**使用约定式提交格式**（Conventional Commits）：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 样式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具配置