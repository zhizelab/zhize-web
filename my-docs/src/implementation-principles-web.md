---
title: 技术实现原理说明
icon: laptop-code
---

# 技术实现原理说明（鼠标 / 手势 / AI 对话 / 用户系统等）

这份文档按你现在项目里的真实代码来讲，不是泛泛而谈。重点解释三个问题：

1. 这个功能是怎么被挂到页面里的？
2. 运行时的数据和状态怎么流动？
3. 关键逻辑为什么这样设计？

## 1. 项目整体架构（先看这一段最不容易迷路）

### 1.1 技术栈

- 文档站框架：`VuePress 2 + vuepress-theme-hope`
- 前端框架：`Vue 3 (script setup + Composition API)`
- 语言：`TypeScript`
- 打包与开发：`Vite`
- 图表：`echarts + echarts-wordcloud`
- 手势识别：`handtrackjs`

### 1.2 全局功能是如何注入到所有页面的

入口在 `src/.vuepress/client.ts`：

- `rootComponents` 注册了 4 个全局组件（所有页面都会挂载）：
  - `GlobalUserAccess`（登录/用户中心/社交广场）
  - `GlobalGestureControl`（手势控制）
  - `GlobalAIAssistant`（AI 页面讲解与问答）
  - `GlobalMemberMarkdownSync`（成员页 Markdown 覆盖同步）
- `setup()` 里还直接注入了全局“鼠标水滴光标”逻辑。

所以你看到的这些功能不是某个单页独有，而是“全站悬浮层能力”。

### 1.3 前后端通信路径

`src/.vuepress/utils/backendApi.ts` 统一封装请求：

- 开发环境（端口 `4399`）：请求走 `/api`，由 `config.ts` 代理到 `http://127.0.0.1:8080`
- 生产环境：默认直连 `http://<当前主机>:8080`

这就是为什么你在代码里会看到一堆 `/api` 和 `getApiBase()` 的判断。

---

## 2. 鼠标水滴效果（Mouse）

代码核心：`src/.vuepress/client.ts` + `src/.vuepress/styles/index/_base.scss`

### 2.1 启用条件

只有同时满足才启用：

- 设备是精确指针：`(pointer: fine)`（通常是鼠标）
- 用户没有开启“减少动态效果”：`(prefers-reduced-motion: reduce)` 为 false

目的：移动端触控不强行启用，自带可访问性兼容。

### 2.2 运行机制

- 监听 `pointermove`
  - 更新 `pointerX/pointerY`
  - 用 `requestAnimationFrame` 移动自定义光标元素（避免每次事件都直接改 DOM）
  - 每约 44ms 生成一个拖尾水滴（节流）
- 监听 `pointerdown`
  - 在点击位置生成一圈涟漪 + 额外几滴水珠
- 监听 `blur/mouseleave`
  - 光标隐藏

### 2.3 样式机制

在 `body` 加类 `global-water-cursor-enabled` 后：

- 系统原生光标被隐藏（`cursor: none`）
- 覆盖层 `global-water-cursor-layer` 固定定位、`pointer-events: none`
- 水滴和涟漪完全靠 CSS 动画（`@keyframes`）执行，动画结束自动删节点

### 2.4 为什么这样写

- JS 负责“时机与坐标”，CSS 负责“视觉动画”，职责分离
- `requestAnimationFrame` 减少抖动和重排成本
- 组件卸载时彻底清理事件和 DOM，防内存泄漏

---

## 3. 手势控制（Gesture）

代码核心：`src/.vuepress/components/GlobalGestureControl.vue`

> 说明：`LabHomePage.vue` 里也有一套旧的手势逻辑，但当前全站实际使用的是 `GlobalGestureControl.vue` 这套（因为它在 `client.ts` 被 rootComponents 全局挂载）。

### 3.1 启动流程

1. 点“开启”按钮
2. 动态加载 `handtrackjs` 模型（首次较慢）
3. 申请摄像头权限 `getUserMedia`
4. 视频就绪后进入识别循环 `runGestureLoop()`

### 3.2 每帧做什么

- 调 `gestureModel.detect(video)` 得到预测框列表
- 只保留“张开手掌”相关标签（open/palm/hand 等）
- 取置信度最高的一个作为主目标
- 基于边界框中心点，换算成归一化坐标（0~1）

### 3.3 方向判定逻辑（重点）

它不是“单帧立即触发”，而是“稳定判定”：

- 用一个锚点 `gestureAnchorPoint` 做位移参照
- 算 `deltaX/deltaY`、主导方向、运动角度
- 得到候选方向后，必须连续 `5` 帧同方向才触发
- 触发后有冷却时间（`~520ms`）防连发
- 丢失手掌若干帧后重置锚点，防漂移

### 3.4 动作映射

- 左/右：切换顶部导航链接（自动找当前激活项，再切到前/后一个）
- 上/下：平滑滚动页面（按视窗高度比例滚动）

### 3.5 键盘兜底

即使不开摄像头，也支持方向键触发同样动作：

- `ArrowLeft/ArrowRight` -> 导航切换
- `ArrowUp/ArrowDown` -> 页面滚动
- 在输入框/文本域中会忽略，避免干扰输入

### 3.6 为什么这样写

- “连续多帧 + 冷却”是抗抖关键
- “只识别张开手掌”降低误识别（比如识别到脸）
- 键盘兜底保证可用性和可测试性

---

## 4. AI 对话与自动讲解（AI Chat）

代码核心：`src/.vuepress/components/GlobalAIAssistant.vue`

### 4.1 UI 与状态

主要状态：

- `isOpen`：面板开关
- `messages`：消息历史（用户/AI）
- `unreadCount`：未读计数
- `statusText`：当前执行状态（思考中、完成、失败）
- `showAutoDialog`：页面角落自动讲解弹层

### 4.2 自动讲解触发时机

- 监听 `page.value.path`（路由变化）
- 页面切换后延迟一点点（等 DOM 稳定），再自动请求 AI
- 用 `lastExplainedPath` 防止重复讲同一页面

### 4.3 页面上下文如何喂给模型

每次提问都会构建上下文：

- 页面路径、标题
- 页面目录（headers）
- 页面正文提取（从 `main` 等容器抽文本，截断到 3200 字符）
- 最近几轮聊天记录（最多取近 8 条）

然后一起拼到 prompt 发给模型。

### 4.4 请求模型方式

- 接口：`https://api.deepseek.com/chat/completions`
- 模型：`deepseek-chat`
- 自动讲解模式：要求“2~3 句、口语化、不要列表”
- 手动问答模式：优先结合当前页面再给建议

### 4.5 并发与过期响应保护

用 `activeRequestToken` 防止响应乱序：

- 新请求发出会递增 token
- 老请求晚回来时 token 不匹配，结果会被丢弃

这是典型的“竞态保护”写法。

### 4.6 当前最需要注意的问题

`AI_API_KEY` 现在写死在前端源码里，这在生产环境是不安全的：

- 打包后用户可在浏览器里看到 key
- 可能被盗用并产生费用

正确做法是：前端只请求你自己的后端，由后端安全持有和转发 API Key。

---

## 5. 登录、权限、用户中心与社交广场

代码核心：

- `src/.vuepress/components/GlobalUserAccess.vue`
- `src/.vuepress/utils/authSession.ts`
- `src/.vuepress/utils/backendApi.ts`

### 5.1 登录态管理（authSession）

`authState` 是全局响应式对象：

- `token`
- `user`
- `loading`
- `ready`

启动时 `initAuthSession()` 会：

1. 从 `localStorage` 读 token
2. 调 `apiCheckLogin` 校验
3. 再调 `apiGetUserInfo` 拉用户资料
4. 同步到 `authState`

并发方面用了 `initTask`，避免重复初始化请求。

### 5.2 用户入口组件（GlobalUserAccess）

未登录：

- 显示“登录”和“动态广场”

已登录：

- 显示用户菜单（用户信息、成员名录、社交广场、看板、校验登录、退出）

### 5.3 社交广场核心逻辑

- 公共动态列表：`apiGetPublicPosts`
- 动态详情+回复：`apiGetPostDetail`
- 点赞/取消：`apiLikePost` / `apiUnlikePost`
- 发送聊天：`apiReplyPost`
- 发布动态：`apiPublishPost`（`FormData`，支持文字/图片/附件）

并且在“广场列表”模式下每 15 秒自动刷新一次，关闭面板会停止定时器。

### 5.4 游客与登录用户差异

- 游客可以看广场和聊天历史
- 只有登录用户可点赞、发帖、回复
- 需要 token 的动作统一先走 `getTokenOrPrompt()`，失效就弹登录

### 5.5 图片地址处理逻辑

`resolveAssetUrl()` 会兼容：

- 完整 `http/https` URL
- `//` 协议相对 URL
- 本地静态资源 `/images` `/assets`
- 后端资源路径在开发环境自动补 `/api`

---

## 6. API 封装与状态码策略

代码：`src/.vuepress/utils/backendApi.ts`

### 6.1 封装点

- 统一 `requestApi<T>()` 处理 method/header/body/query
- JSON 与 FormData 两种 body 自动分流
- 统一错误抛出（网络失败 / JSON 解析失败 / 格式异常）

### 6.2 业务状态码映射

内置了 `STATUS_TEXT_MAP`（比如 501 用户名错误、503 密码错误、504 未登录等），UI 可直接复用 `getStatusTextByCode` 显示友好文案。

---

## 7. 成员资料 Markdown 上传与页面同步

代码核心：

- `src/.vuepress/components/TeamMembersPage.vue`
- `src/.vuepress/components/GlobalMemberMarkdownSync.vue`

### 7.1 目标

让用户在“成员名录页”上传 `.md`，然后成员详情页实时显示覆盖后的内容。

### 7.2 绑定与权限规则

- 一个账号只能绑定一个成员
- 一个成员只能被一个账号绑定
- 绑定关系保存在 `localStorage`（`zhize-member-bindings`）

### 7.3 Markdown 解析策略

上传后会做：

- frontmatter 解析（name/title/desc 等候选字段）
- 标题/段落/列表提取与清洗
- 生成 `name/title/desc/markdownContent`

然后保存到 `zhize-member-overrides`。

### 7.4 详情页实时覆盖机制

`GlobalMemberMarkdownSync` 是全局组件，会在成员详情页：

- 根据路径计算 memberId
- 读取本地 overrides
- 把 `#markdown-content` 直接替换成渲染后的 HTML
- 同步更新页面标题

并监听两类变化：

- 浏览器 `storage` 事件（多标签同步）
- 自定义事件 `zhize-member-overrides-changed`（当前标签内同步）

---

## 8. 访客看板（数据可视化）

代码：`src/.vuepress/components/VisitorDashboard.vue`

### 8.1 访问控制

页面挂载后先 `initAuthSession + validateLogin`：

- 成功才展示看板
- 失败显示“需要登录”卡片

### 8.2 数据来源

当前实现是前端本地记录：

- 每次访问追加一条 `VisitorRecord` 到 localStorage
- 数据字段：时间、IP、路径、浏览器、系统
- IP 通过 `api.ipify.org` 获取（失败则回退本地值）

### 8.3 图表渲染

为 SSR 安全，在 `onMounted` 后动态导入：

- `echarts`
- `echarts-wordcloud`

再按筛选范围计算 KPI 与图表数据：

- 仪表盘（转化率）
- 趋势图
- 设备/浏览器环图
- 热词云
- 日历热力图

并绑定 `window.resize` 做图表自适应。

---

## 9. 你最容易混淆的几个点（直接回答）

### 9.1 “鼠标效果”和“手势”有关系吗？

没有直接关系。

- 鼠标效果：纯前端 UI 特效（`client.ts` + CSS）
- 手势控制：摄像头 + 模型识别 + 页面控制（`GlobalGestureControl.vue`）

### 9.2 “AI 对话”会直接读取后端数据库吗？

不会。当前是“页面文本上下文 + 聊天历史”发给大模型，不直接读你业务数据库。

### 9.3 “用户系统”和“AI 对话”是一套权限吗？

不是同一套。

- 用户系统依赖后端 token
- AI 对话当前直接调第三方模型接口（且 key 在前端）

### 9.4 手势为什么有时不灵敏？

主要由这几类因素决定：

- 光线和摄像头质量
- 手掌是否张开、是否在有效区域
- 稳定帧阈值和冷却时间（为了防误触，故意加了门槛）

---

## 10. 建议你下一步优先做的优化

1. 把 AI Key 从前端移到后端代理（最高优先级）
2. 给手势阈值做可视化调参面板（便于现场调试）
3. 给社交广场加分页/增量刷新，减少全量轮询开销
4. 让成员 Markdown 覆盖走后端持久化（避免 localStorage 丢失）
5. 给看板接入真实后端日志，而不是仅本地样例数据

---

如果你愿意，我下一步可以再给你生成一份“按时序图讲解”的版本（例如：登录一次到底调用了哪些函数、按什么顺序返回）。
