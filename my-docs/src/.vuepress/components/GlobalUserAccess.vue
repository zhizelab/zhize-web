<template>
  <div v-if="mounted" class="global-user-access">
    <div v-if="!loggedIn" class="entry-row">
      <button class="entry-btn" type="button" @click="showLogin = true">登录</button>
      <button class="entry-btn ghost" type="button" @click="openTool('posts')">动态广场</button>
    </div>

    <div v-else class="entry-row user-entry">
      <button class="entry-btn" type="button" @click.stop="showMenu = !showMenu">{{ displayName }}</button>
      <div v-if="showMenu" class="entry-menu" @click.stop>
        <button type="button" @click="openTool('profile')">用户信息</button>
        <button type="button" @click="openMembersDirectory">成员名录</button>
        <button type="button" @click="openTool('posts')">社交广场</button>
        <button type="button" @click="openVisitorDashboard">访客看板</button>
        <button type="button" @click="checkLoginNow">校验登录状态</button>
        <button type="button" class="danger" @click="handleLogout">退出登录</button>
      </div>
    </div>

    <div v-if="showLogin" class="mask" @click.self="showLogin = false">
      <section class="dialog">
        <header class="head">
          <h3>账号入口</h3>
          <button type="button" class="close-btn" @click="showLogin = false">关闭</button>
        </header>
        <form class="auth-form" @submit.prevent="submitLogin">
          <label>用户名<input v-model.trim="loginForm.username" type="text" placeholder="请输入用户名" /></label>
          <label>密码<input v-model="loginForm.userPwd" type="password" placeholder="请输入密码" /></label>
          <p class="status">{{ loginStatus }}</p>
          <button class="primary-btn" type="submit" :disabled="loginSubmitting">
            {{ loginSubmitting ? "登录中..." : "登录" }}
          </button>
        </form>
      </section>
    </div>

    <div v-if="activeTool" class="mask" :class="{ dark: activeTool === 'posts' }" @click.self="closeTool">
      <section class="panel" :class="{ fullscreen: activeTool === 'posts' }">
        <header class="head">
          <h3>{{ activeTool === "profile" ? "用户信息" : "动态广场" }}</h3>
          <div class="head-actions">
            <button
              v-if="activeTool === 'posts' && postView === 'square'"
              type="button"
              class="ghost-btn"
              :disabled="loadingPosts"
              @click="loadPosts()"
            >
              {{ loadingPosts ? "刷新中..." : "刷新动态" }}
            </button>
            <button type="button" class="close-btn" @click="closeTool">关闭</button>
          </div>
        </header>
        <p class="status">{{ toolStatus }}</p>

        <div v-if="activeTool === 'profile'" class="profile-card">
          <p><strong>UID：</strong>{{ authState.user?.uid ?? "-" }}</p>
          <p><strong>用户名：</strong>{{ authState.user?.username ?? "-" }}</p>
          <p><strong>昵称：</strong>{{ authState.user?.nickName ?? "-" }}</p>
          <button class="primary-btn" type="button" :disabled="loadingProfile" @click="loadProfile">
            {{ loadingProfile ? "刷新中..." : "刷新用户信息" }}
          </button>
        </div>

        <div v-else class="plaza">
          <aside class="feed-col">
            <div class="tabs">
              <button type="button" :class="{ active: postView === 'square' }" @click="postView = 'square'">社交广场</button>
              <button type="button" :class="{ active: postView === 'publish' }" @click="postView = 'publish'">发布动态</button>
            </div>

            <section v-if="postView === 'square'" class="feed-list">
              <article
                v-for="post in posts"
                :key="post.id"
                class="post-card"
                :class="{ active: selectedPostId === post.id }"
                @click="selectPost(post.id)"
              >
                <header class="post-head">
                  <strong>{{ post.nickName || post.username }}</strong>
                  <span>#{{ post.id }}</span>
                </header>
                <p v-if="post.textContent" class="post-text">{{ post.textContent }}</p>
                <img
                  v-if="canShowImage(post)"
                  class="post-image"
                  :src="resolveAssetUrl(post.imageUrl)"
                  :alt="`动态图片-${post.id}`"
                  @error="markImageBroken(post.id)"
                />
                <p v-else-if="post.imageUrl" class="img-tip">图片加载失败，请刷新重试。</p>
                <p class="post-meta">点赞 {{ post.likeCount || 0 }} · 评论 {{ post.commentCount || 0 }}</p>
                <div v-if="loggedIn" class="post-actions" @click.stop>
                  <button type="button" @click="toggleLike(post)">{{ post.liked ? "取消点赞" : "点赞" }}</button>
                  <button type="button" @click="selectPost(post.id)">聊天</button>
                </div>
              </article>
              <p v-if="posts.length === 0" class="empty">暂无动态，来发布第一条吧。</p>
            </section>

            <section v-else class="publish-card">
              <p v-if="!loggedIn" class="empty">请先登录后发布动态。</p>
              <template v-else>
                <textarea v-model.trim="publishForm.textContent" rows="5" placeholder="说点什么，展示你的专业观点"></textarea>
                <label class="file-row">照片附件<input type="file" accept="image/*" @change="onImageChange" /></label>
                <label class="file-row">文件附件<input type="file" @change="onCodeChange" /></label>
                <p class="tip">{{ publishSummary }}</p>
                <button class="primary-btn" type="button" :disabled="loadingAction" @click="publishPost">
                  {{ loadingAction ? "发布中..." : "发布到社交广场" }}
                </button>
              </template>
            </section>
          </aside>

          <section class="chat-col">
            <div class="chat-head">
              <h4>社交会话</h4>
              <button v-if="selectedPost" type="button" class="ghost-btn" :disabled="loadingDetail" @click="loadSelectedDetail">
                {{ loadingDetail ? "刷新中..." : "刷新聊天" }}
              </button>
            </div>
            <div class="chat-body">
              <template v-if="selectedPost">
                <div class="chat-topic">
                  <strong>{{ selectedPost.nickName || selectedPost.username }}</strong>
                  <span>{{ formatDate(selectedPost.createTime) }}</span>
                  <p v-if="selectedPost.textContent">{{ selectedPost.textContent }}</p>
                  <img
                    v-if="canShowImage(selectedPost)"
                    class="post-image chat-image"
                    :src="resolveAssetUrl(selectedPost.imageUrl)"
                    :alt="`动态图片-${selectedPost.id}`"
                    @error="markImageBroken(selectedPost.id)"
                  />
                </div>
                <div class="chat-list">
                  <article
                    v-for="reply in replies"
                    :key="reply.id"
                    class="reply-item"
                    :class="{ mine: reply.userId === authState.user?.uid }"
                  >
                    <p class="reply-user">{{ reply.nickName || reply.username }}</p>
                    <p class="reply-content">{{ reply.content }}</p>
                    <p class="reply-time">{{ formatDate(reply.createTime) }}</p>
                  </article>
                  <p v-if="replies.length === 0" class="empty">还没有聊天消息，来发表第一条观点。</p>
                </div>
                <div v-if="loggedIn" class="compose">
                  <textarea v-model.trim="chatText" rows="3" placeholder="输入消息，参与讨论"></textarea>
                  <button class="primary-btn" type="button" :disabled="loadingAction || !chatText" @click="sendReply">
                    {{ loadingAction ? "发送中..." : "发送消息" }}
                  </button>
                </div>
                <p v-else class="empty">登录后可发送聊天消息。</p>
              </template>
              <div v-else class="chat-empty">请先从左侧选择一条动态查看聊天。</div>
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

import {
  apiGetPostDetail,
  apiGetPublicPosts,
  apiLikePost,
  apiPublishPost,
  apiReplyPost,
  apiUnlikePost,
  getApiBase,
  getStatusTextByCode,
  type PostItem,
  type ReplyItem,
} from "../utils/backendApi";
import {
  authState,
  initAuthSession,
  isLoggedIn,
  loginByPassword,
  logoutSession,
  refreshCurrentUser,
  validateLogin,
} from "../utils/authSession";

type ToolType = "" | "profile" | "posts";
type PostViewType = "square" | "publish";

const mounted = ref(false);
const showMenu = ref(false);
const showLogin = ref(false);
const loginSubmitting = ref(false);
const loginStatus = ref("请输入用户名和密码");

const activeTool = ref<ToolType>("");
const postView = ref<PostViewType>("square");
const toolStatus = ref("");
const loadingProfile = ref(false);
const loadingPosts = ref(false);
const loadingDetail = ref(false);
const loadingAction = ref(false);

const posts = ref<PostItem[]>([]);
const replies = ref<ReplyItem[]>([]);
const selectedPostId = ref<number | null>(null);
const chatText = ref("");
const brokenImages = reactive<Record<number, boolean>>({});

let refreshTimer: number | null = null;

const loginForm = reactive({
  username: "",
  userPwd: "",
});

const publishForm = reactive({
  textContent: "",
  imageFile: null as File | null,
  codeFile: null as File | null,
});

const loggedIn = computed(() => isLoggedIn());
const displayName = computed(() => authState.user?.nickName || authState.user?.username || "用户中心");
const selectedPost = computed(() => posts.value.find((item) => item.id === selectedPostId.value) || null);
const publishSummary = computed(() => {
  const imageName = publishForm.imageFile?.name || "未选择";
  const fileName = publishForm.codeFile?.name || "未选择";
  return `图片文件：${imageName} ｜ 附件文件：${fileName}`;
});

const stopAutoRefresh = (): void => {
  if (refreshTimer === null) return;
  window.clearInterval(refreshTimer);
  refreshTimer = null;
};

const startAutoRefresh = (): void => {
  stopAutoRefresh();
  refreshTimer = window.setInterval(() => {
    if (activeTool.value !== "posts" || postView.value !== "square") return;
    void loadPosts(true);
  }, 15000);
};

const formatDate = (rawValue: string): string => {
  if (!rawValue) return "-";
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return rawValue;
  return date.toLocaleString("zh-CN", { hour12: false });
};

const resolveAssetUrl = (rawUrl?: string | null): string => {
  const cleaned = (rawUrl || "").trim();
  if (!cleaned) return "";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (cleaned.startsWith("//")) return `${window.location.protocol}${cleaned}`;

  const path = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  if (path.startsWith("/api/")) return path;
  if (/^\/(images|assets)\//i.test(path)) return path;

  if (window.location.port === "4399") return `/api${path}`;
  return `${getApiBase()}${path}`;
};

const canShowImage = (post: PostItem): boolean => {
  return Boolean((post.imageUrl || "").trim()) && !brokenImages[post.id];
};

const markImageBroken = (postId: number): void => {
  brokenImages[postId] = true;
};

const getTokenOrPrompt = (): string | null => {
  if (!authState.token) {
    toolStatus.value = "登录已失效，请重新登录。";
    showLogin.value = true;
    return null;
  }
  return authState.token;
};

const resetPublishForm = (): void => {
  publishForm.textContent = "";
  publishForm.imageFile = null;
  publishForm.codeFile = null;
};

const closeTool = (): void => {
  stopAutoRefresh();
  activeTool.value = "";
  chatText.value = "";
};

const submitLogin = async (): Promise<void> => {
  if (!loginForm.username || !loginForm.userPwd) {
    loginStatus.value = "用户名和密码不能为空";
    return;
  }

  loginSubmitting.value = true;
  loginStatus.value = "正在登录...";
  try {
    const result = await loginByPassword(loginForm.username, loginForm.userPwd);
    if (result.code === 200 && isLoggedIn()) {
      loginStatus.value = "登录成功";
      showLogin.value = false;
      loginForm.userPwd = "";
      return;
    }
    loginStatus.value = getStatusTextByCode(result.code, result.message || "登录失败");
  } catch (error) {
    loginStatus.value = error instanceof Error ? error.message : "登录失败";
  } finally {
    loginSubmitting.value = false;
  }
};

const loadProfile = async (): Promise<void> => {
  const token = getTokenOrPrompt();
  if (!token) return;
  loadingProfile.value = true;
  try {
    const result = await refreshCurrentUser();
    if (!result) {
      toolStatus.value = "未获取到用户信息";
      return;
    }
    toolStatus.value = result.code === 200 ? "用户信息已刷新" : getStatusTextByCode(result.code);
  } catch (error) {
    toolStatus.value = error instanceof Error ? error.message : "用户信息刷新失败";
  } finally {
    loadingProfile.value = false;
  }
};

const patchPostByDetail = (detailPost: PostItem, liked?: boolean): void => {
  const index = posts.value.findIndex((item) => item.id === detailPost.id);
  if (index < 0) return;
  const current = posts.value[index];
  posts.value[index] = {
    ...current,
    ...detailPost,
    liked: typeof liked === "boolean" ? liked : current.liked,
  };
};

const loadDetailById = async (postId: number): Promise<void> => {
  loadingDetail.value = true;
  try {
    const result = await apiGetPostDetail(postId, authState.token || undefined);
    if (result.code !== 200) {
      toolStatus.value = getStatusTextByCode(result.code, result.message || "聊天记录加载失败");
      replies.value = [];
      return;
    }
    if (result.data?.post) patchPostByDetail(result.data.post, result.data.liked);
    replies.value = result.data?.replies || [];
  } catch (error) {
    toolStatus.value = error instanceof Error ? error.message : "聊天记录加载失败";
    replies.value = [];
  } finally {
    loadingDetail.value = false;
  }
};

const loadSelectedDetail = async (): Promise<void> => {
  if (!selectedPostId.value) return;
  await loadDetailById(selectedPostId.value);
};

const selectPost = async (postId: number): Promise<void> => {
  if (selectedPostId.value === postId && replies.value.length > 0) return;
  selectedPostId.value = postId;
  chatText.value = "";
  await loadDetailById(postId);
};

const loadPosts = async (silent = false): Promise<void> => {
  if (loadingPosts.value) return;
  loadingPosts.value = true;
  try {
    const result = await apiGetPublicPosts({
      pageNum: 1,
      pageSize: 20,
      token: authState.token || undefined,
    });
    if (result.code !== 200) {
      toolStatus.value = getStatusTextByCode(result.code, result.message || "公共动态加载失败");
      return;
    }

    const list = result.data?.pageInfo?.pageData || [];
    posts.value = list;
    if (!list.length) {
      selectedPostId.value = null;
      replies.value = [];
      if (!silent) toolStatus.value = "暂无公共动态";
      return;
    }

    const stillExists = selectedPostId.value && list.some((item) => item.id === selectedPostId.value);
    if (!stillExists) selectedPostId.value = list[0].id;
    if (selectedPostId.value) await loadDetailById(selectedPostId.value);
    if (!silent) toolStatus.value = "公共动态加载完成";
  } catch (error) {
    toolStatus.value = error instanceof Error ? error.message : "公共动态加载失败";
  } finally {
    loadingPosts.value = false;
  }
};

const toggleLike = async (post: PostItem): Promise<void> => {
  const token = getTokenOrPrompt();
  if (!token) return;

  const nextLiked = !post.liked;
  try {
    const result = nextLiked ? await apiLikePost(token, post.id) : await apiUnlikePost(token, post.id);
    if (result.code !== 200) {
      toolStatus.value = getStatusTextByCode(result.code, result.message || "点赞操作失败");
      return;
    }
    post.liked = nextLiked;
    post.likeCount = Math.max(0, (post.likeCount || 0) + (nextLiked ? 1 : -1));
    toolStatus.value = nextLiked ? "点赞成功" : "已取消点赞";
  } catch (error) {
    toolStatus.value = error instanceof Error ? error.message : "点赞操作失败";
  }
};

const sendReply = async (): Promise<void> => {
  const token = getTokenOrPrompt();
  if (!token) return;
  if (!selectedPostId.value) {
    toolStatus.value = "请先选择一条动态后再发送消息。";
    return;
  }
  const content = chatText.value.trim();
  if (!content) {
    toolStatus.value = "消息内容不能为空";
    return;
  }

  loadingAction.value = true;
  try {
    const result = await apiReplyPost(token, selectedPostId.value, content);
    if (result.code !== 200) {
      toolStatus.value = getStatusTextByCode(result.code, result.message || "消息发送失败");
      return;
    }
    chatText.value = "";
    toolStatus.value = "消息发送成功";
    await loadSelectedDetail();
  } catch (error) {
    toolStatus.value = error instanceof Error ? error.message : "消息发送失败";
  } finally {
    loadingAction.value = false;
  }
};

const publishPost = async (): Promise<void> => {
  const token = getTokenOrPrompt();
  if (!token) return;

  const hasText = Boolean(publishForm.textContent.trim());
  const hasImage = Boolean(publishForm.imageFile);
  const hasFile = Boolean(publishForm.codeFile);
  if (!hasText && !hasImage && !hasFile) {
    toolStatus.value = "请至少填写文字、图片或附件中的一项。";
    return;
  }

  loadingAction.value = true;
  try {
    const result = await apiPublishPost(token, {
      textContent: publishForm.textContent,
      imageFile: publishForm.imageFile,
      codeFile: publishForm.codeFile,
    });
    if (result.code !== 200) {
      toolStatus.value = getStatusTextByCode(result.code, result.message || "发布失败");
      return;
    }
    toolStatus.value = `发布成功，postId=${result.data?.postId ?? "-"}`;
    resetPublishForm();
    postView.value = "square";
    startAutoRefresh();
    await loadPosts(true);
  } catch (error) {
    toolStatus.value = error instanceof Error ? error.message : "发布失败";
  } finally {
    loadingAction.value = false;
  }
};

const openTool = async (tool: ToolType): Promise<void> => {
  showMenu.value = false;
  activeTool.value = tool;
  toolStatus.value = "加载中...";

  if (tool === "profile") {
    stopAutoRefresh();
    await loadProfile();
    return;
  }

  postView.value = "square";
  startAutoRefresh();
  await loadPosts();
  if (!loggedIn.value) toolStatus.value = "当前为游客模式，可查看社交广场和聊天记录。";
};

const checkLoginNow = async (): Promise<void> => {
  showMenu.value = false;
  try {
    const result = await validateLogin();
    if (!result) {
      toolStatus.value = "当前无登录状态";
      return;
    }
    if (result.code === 200) {
      toolStatus.value = "登录状态有效";
      return;
    }
    toolStatus.value = getStatusTextByCode(result.code, result.message || "登录状态失效");
    showLogin.value = true;
  } catch (error) {
    toolStatus.value = error instanceof Error ? error.message : "登录校验失败";
  }
};

const openVisitorDashboard = (): void => {
  showMenu.value = false;
  window.location.href = "/visitor-dashboard.html";
};

const openMembersDirectory = (): void => {
  showMenu.value = false;
  window.location.href = "/demo/members-list.html";
};

const handleLogout = (): void => {
  logoutSession();
  showMenu.value = false;
  closeTool();
  toolStatus.value = "已退出登录";
};

const onImageChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  publishForm.imageFile = input.files?.[0] || null;
};

const onCodeChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  publishForm.codeFile = input.files?.[0] || null;
};

const handleDocumentClick = (event: MouseEvent): void => {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  if (target.closest(".global-user-access")) return;
  showMenu.value = false;
};

onMounted(async () => {
  mounted.value = true;
  document.addEventListener("click", handleDocumentClick);
  await initAuthSession();
});

onBeforeUnmount(() => {
  stopAutoRefresh();
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<style scoped>
.global-user-access {
  position: fixed;
  top: calc(var(--navbar-height) + 0.55rem);
  left: clamp(0.65rem, 2.4vw, 1.25rem);
  z-index: 170;
  pointer-events: none;
}

.global-user-access > * {
  pointer-events: auto;
}

.entry-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.user-entry {
  position: relative;
}

.entry-btn {
  border: 1px solid rgba(114, 155, 198, 0.54);
  border-radius: 999px;
  padding: 0.36rem 0.8rem;
  background: rgba(8, 30, 56, 0.9);
  color: #eff7ff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.entry-btn.ghost {
  background: rgba(12, 39, 70, 0.86);
}

.entry-menu {
  position: absolute;
  top: calc(100% + 0.36rem);
  left: 0;
  width: 220px;
  border-radius: 12px;
  border: 1px solid rgba(126, 170, 210, 0.54);
  background: rgba(5, 18, 36, 0.94);
  overflow: hidden;
}

.entry-menu button {
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgba(124, 167, 209, 0.2);
  padding: 0.56rem 0.72rem;
  background: transparent;
  color: #edf6ff;
  text-align: left;
  font-size: 0.74rem;
  cursor: pointer;
}

.entry-menu button:hover {
  background: rgba(151, 206, 255, 0.16);
}

.entry-menu button.danger {
  color: #ffd6df;
}

.mask {
  position: fixed;
  inset: 0;
  z-index: 175;
  display: grid;
  place-items: center;
  background: rgba(4, 11, 21, 0.56);
}

.mask.dark {
  background: rgba(3, 10, 19, 0.8);
}

.dialog,
.panel {
  width: min(94vw, 780px);
  max-height: min(90vh, 900px);
  border-radius: 14px;
  border: 1px solid rgba(130, 175, 216, 0.54);
  background: #f7fbff;
  overflow: auto;
}

.panel.fullscreen {
  width: min(98vw, 1500px);
  height: calc(100vh - 0.8rem);
  max-height: calc(100vh - 0.8rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.66rem 0.88rem;
  border-bottom: 1px solid #dde8f5;
}

.head h3 {
  margin: 0;
  font-size: 0.92rem;
  color: #12375d;
}

.head-actions {
  display: flex;
  gap: 0.45rem;
}

.close-btn,
.ghost-btn,
.primary-btn {
  border: 0;
  border-radius: 9px;
  padding: 0.34rem 0.7rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.close-btn {
  background: #dcecff;
  color: #1c4c7c;
}

.ghost-btn {
  background: #eef5ff;
  color: #285885;
}

.primary-btn {
  background: linear-gradient(120deg, #dbeeff 0%, #9ecdf8 100%);
  color: #194570;
  font-weight: 700;
}

.auth-form {
  display: grid;
  gap: 0.58rem;
  padding: 0.72rem 0.88rem 0.88rem;
}

.auth-form label {
  display: grid;
  gap: 0.24rem;
  color: #33567b;
  font-size: 0.76rem;
}

.auth-form input,
.publish-card textarea,
.publish-card input,
.compose textarea {
  border: 1px solid #bfd6ef;
  border-radius: 9px;
  padding: 0.42rem 0.52rem;
  font-size: 0.75rem;
  background: #fff;
  color: #1e3d5f;
}

.status {
  margin: 0;
  padding: 0.56rem 0.88rem 0;
  color: #4d6782;
  font-size: 0.74rem;
}

.profile-card {
  margin: 0.68rem 0.88rem 0.88rem;
  border: 1px solid #d4e6f9;
  border-radius: 12px;
  padding: 0.66rem;
  display: grid;
  gap: 0.45rem;
}

.profile-card p {
  margin: 0;
  color: #244a70;
  font-size: 0.76rem;
}

.plaza {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(360px, 1.2fr) minmax(320px, 0.9fr);
  gap: 0.72rem;
  padding: 0.68rem 0.88rem 0.88rem;
}

.feed-col,
.chat-col {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.62rem;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.44rem;
}

.tabs button {
  border: 1px solid #bfd6ef;
  border-radius: 9px;
  padding: 0.36rem 0.5rem;
  background: #edf5ff;
  color: #194875;
  font-size: 0.75rem;
  cursor: pointer;
}

.tabs button.active {
  border-color: #7cb1e7;
  background: #d8ebff;
  font-weight: 700;
}

.feed-list,
.publish-card,
.chat-head,
.chat-body {
  border: 1px solid #d4e6f9;
  border-radius: 12px;
  background: #fafdff;
}

.feed-list,
.publish-card,
.chat-body {
  padding: 0.62rem;
}

.feed-list {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.post-card {
  border: 1px solid #dceaf8;
  border-radius: 10px;
  padding: 0.56rem;
  margin-top: 0.52rem;
  background: #fff;
  cursor: pointer;
}

.post-card.active {
  border-color: #5f9fd9;
  box-shadow: 0 0 0 2px rgba(95, 159, 217, 0.18);
}

.post-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  color: #214b74;
  font-size: 0.75rem;
}

.post-text {
  margin: 0.42rem 0;
  color: #1f4062;
  font-size: 0.76rem;
  line-height: 1.5;
}

.post-image {
  display: block;
  width: 100%;
  max-height: 340px;
  object-fit: contain;
  border: 1px solid #d8e7f6;
  border-radius: 10px;
  background: #f2f7fd;
}

.chat-image {
  max-height: 220px;
}

.img-tip,
.tip {
  margin: 0.35rem 0;
  color: #8a5d4f;
  font-size: 0.72rem;
}

.post-meta {
  margin: 0.4rem 0 0;
  color: #5a7896;
  font-size: 0.7rem;
}

.post-actions {
  margin-top: 0.45rem;
  display: flex;
  gap: 0.4rem;
}

.post-actions button {
  border: 0;
  border-radius: 8px;
  padding: 0.3rem 0.62rem;
  background: #e7f3ff;
  color: #1f4a76;
  font-size: 0.7rem;
  cursor: pointer;
}

.publish-card {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  align-content: start;
  gap: 0.55rem;
}

.file-row {
  display: grid;
  gap: 0.28rem;
  color: #325577;
  font-size: 0.74rem;
}

.chat-head {
  padding: 0.56rem 0.62rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.chat-head h4 {
  margin: 0;
  color: #1f4c76;
  font-size: 0.8rem;
}

.chat-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.56rem;
}

.chat-topic {
  border: 1px solid #dbe9f7;
  border-radius: 10px;
  padding: 0.52rem;
  background: #fff;
  display: grid;
  gap: 0.25rem;
  color: #284c72;
  font-size: 0.74rem;
}

.chat-list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reply-item {
  width: fit-content;
  max-width: 88%;
  border: 1px solid #d5e7fa;
  border-radius: 10px;
  padding: 0.42rem 0.5rem;
  background: #fff;
}

.reply-item.mine {
  margin-left: auto;
  border-color: #afcff0;
  background: #e8f4ff;
}

.reply-user,
.reply-content,
.reply-time {
  margin: 0;
}

.reply-user {
  color: #1f4a75;
  font-size: 0.7rem;
  font-weight: 700;
}

.reply-content {
  margin-top: 0.18rem;
  color: #2d4f70;
  font-size: 0.75rem;
  white-space: pre-wrap;
}

.reply-time {
  margin-top: 0.2rem;
  color: #6f8ba8;
  font-size: 0.66rem;
}

.compose {
  display: grid;
  gap: 0.42rem;
}

.empty,
.chat-empty {
  color: #63819f;
  font-size: 0.74rem;
}

@media (max-width: 1080px) {
  .panel.fullscreen {
    width: calc(100vw - 0.5rem);
    height: calc(100vh - 0.5rem);
    max-height: calc(100vh - 0.5rem);
  }

  .plaza {
    grid-template-columns: 1fr;
  }

  .chat-col {
    min-height: 42vh;
  }
}

@media (max-width: 760px) {
  .global-user-access {
    top: calc(var(--navbar-height) + 0.45rem);
    left: 0.55rem;
  }

  .entry-row {
    flex-wrap: wrap;
  }

  .dialog,
  .panel {
    width: calc(100vw - 0.9rem);
    max-height: calc(100vh - 0.9rem);
  }

  .panel.fullscreen {
    width: calc(100vw - 0.45rem);
    height: calc(100vh - 0.45rem);
    max-height: calc(100vh - 0.45rem);
    border-radius: 12px;
  }

  .reply-item {
    max-width: 100%;
  }
}
</style>
