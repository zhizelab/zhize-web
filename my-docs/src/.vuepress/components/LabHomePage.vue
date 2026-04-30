<template>
  <div class="lab-home">
    <section id="home" class="banner">
      <img class="banner-image" src="/images/main_img/light-in-main.jpg" alt="实验室首页横幅" />
      <div class="banner-mask"></div>
      <div class="banner-effects" aria-hidden="true">
        <span
          v-for="(drop, index) in heroRainDrops"
          :key="`drop-${index}`"
          class="rain-drop"
          :style="{
            '--rain-left': drop.left,
            '--rain-delay': drop.delay,
            '--rain-duration': drop.duration,
            '--rain-length': drop.length,
            '--rain-opacity': drop.opacity,
          }"
        ></span>
        <span class="water-wave wave-1"></span>
        <span class="water-wave wave-2"></span>
        <span class="water-wave wave-3"></span>
      </div>

      <div class="title-box">
        <img class="hero-logo" src="/images/logos/zhizelab_logo.png" alt="智泽实验室 Logo" />
        <h1 class="hero-title">河海大学智泽实验室</h1>
        <div class="hero-chip-list">
          <span v-for="tag in heroTags" :key="tag">{{ tag }}</span>
        </div>
        <div class="hero-actions">
          <a href="/demo/" class="hero-main-action">了解更多</a>
          <a href="/join-us" class="hero-sub-action">加入我们</a>
        </div>
      </div>

      <button type="button" class="hero-explore-hub" @click="scrollToSection('about')" aria-label="explore zhize lab">
        <span class="explore-shape" aria-hidden="true"></span>
        <span class="explore-body">探索</span>
      </button>
    </section>

    <section id="about" class="mode mode-about">
      <div class="mode-header">
        <h2>关于实验室</h2>
        <a href="/demo/">了解更多</a>
      </div>
      <div class="mode-about-layout">
        <article class="mode-panel intro-text">
          <p class="intro-lead">
            智泽实验室依托河海大学学科优势，围绕“人工智能 + 行业场景”开展持续研究与工程实践，强调从理论到落地的完整闭环。
          </p>
          <p>
            团队以真实问题为牵引，聚焦智慧水利、计算机视觉、机器人系统与工程部署，构建从数据治理、模型训练到系统迭代的全流程能力，
            让科研成果在真实场景中可验证、可复用、可扩展。
          </p>
          <ul class="about-points">
            <li>方向聚焦：人工智能应用、嵌入式系统、ROS 机器人与工程化开发</li>
            <li>组织方式：项目驱动 + 比赛训练 + 技术分享，形成稳定成长路径</li>
            <li>能力目标：解决复杂场景问题，提升成员独立研发与协同交付能力</li>
          </ul>
        </article>
        <aside class="mode-panel about-visual">
          <figure class="about-figure">
            <img src="/images/join-us_img/DSC_4034.JPG" alt="智泽实验室研讨交流" />
            <figcaption>实验室合照</figcaption>
          </figure>
        </aside>
      </div>
    </section>

    <section id="research-activity" class="mode mode-research section-main-dark">
      <div class="mode-header">
        <h2>学习研究与比赛活动</h2>
        <a href="/demo/success">查看全部</a>
      </div>
      <div class="research-activity-layout">
        <div class="research-grid">
          <a v-for="item in researchItems" :key="item.title" class="research-card" :href="item.link">
            <img :src="item.image" :alt="item.title" />
            <span class="research-tag">{{ item.tag }}</span>
            <span class="research-title">{{ item.title }}</span>
            <p class="research-desc">{{ item.desc }}</p>
          </a>
        </div>
        <aside class="mode-panel activity-timeline">
          <h3 class="panel-title">近期活动</h3>
          <ul>
            <li v-for="item in activityItems" :key="item.title">
              <p class="activity-date">{{ item.date }}</p>
              <h4>{{ item.title }}</h4>
              <p class="activity-place">{{ item.place }}</p>
              <a :href="item.link">查看详情</a>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section id="gallery" class="mode mode-gallery">
      <div class="mode-header">
        <h2>光影记录</h2>
        <a href="/join-us">更多记录</a>
      </div>
      <div class="gallery-grid">
        <a v-for="item in galleryItems" :key="item.image" class="gallery-card" :href="item.link">
          <img :src="item.image" :alt="item.title" />
          <span>{{ item.title }}</span>
        </a>
      </div>
    </section>

    <footer class="lab-footer">
      <div class="footer-brand">
        <img src="/images/logos/zhizelab_logo_s.png" alt="智泽实验室图标" />
        <p>河海大学智泽实验室</p>
      </div>
      <div class="footer-links">
        <a v-for="item in footerLinks" :key="item.title" :href="item.link">{{ item.title }}</a>
      </div>
      <div class="footer-contact">
        <p>联系邮箱：暂无</p>
        <p>联系电话：暂无</p>
        <p>地址：人工智能与自动化学院212室</p>
        <p>qq群：963390856</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

let modeObserver: IntersectionObserver | null = null;
let gestureModel: HandTrackModel | null = null;
let gestureModelLoadingTask: Promise<void> | null = null;
let gestureStream: MediaStream | null = null;
let gestureLoopHandle: number | null = null;
let gestureAnchorPoint: { x: number; y: number; at: number } | null = null;
let gestureLostFrameCount = 0;
let gestureCooldownUntil = 0;
let gestureLastHintAt = 0;
let gestureClosedPoseCount = 0;
let gestureOpenPoseCount = 0;

type HandTrackPrediction = {
  bbox?: [number, number, number, number] | number[];
  score?: number | string;
  class?: number | string;
  label?: string;
};

type HandTrackModelOptions = {
  scoreThreshold?: number;
  iouThreshold?: number;
  maxNumBoxes?: number;
  flipHorizontal?: boolean;
  modelType?: string;
  modelSize?: string;
};

type HandTrackModel = {
  detect: (input: HTMLVideoElement) => Promise<HandTrackPrediction[]>;
};

type HandTrackModule = {
  load: (options?: HandTrackModelOptions) => Promise<HandTrackModel>;
};

const gestureClassLabelMap: Record<number, string> = {
  1: "open",
  2: "closed",
  3: "pinch",
  4: "point",
  5: "face",
  6: "pointtip",
  7: "pinchtip",
};
const gestureHandLabelSet = new Set(["open", "closed", "pinch", "point", "pointtip", "pinchtip", "hand"]);
const gestureSwipeThresholdX = 0.06;
const gestureTrackResetAfterMs = 900;
const gestureCooldownMs = 600;
const gestureHintIntervalMs = 680;
const gestureDirectionRatio = 1.02;
const gesturePoseStableFrames = 3;

const gestureVideoRef = ref<HTMLVideoElement | null>(null);
const isGestureControlSupported = ref(false);
const isGestureControlActive = ref(false);
const isGestureControlLoading = ref(false);
const gestureStatusText = ref("正在检查浏览器能力...");

const gestureButtonText = computed(() => {
  if (!isGestureControlSupported.value) return "不可用";
  if (isGestureControlLoading.value) return "加载中...";
  return isGestureControlActive.value ? "关闭" : "开启";
});

const initModeTurnAnimation = (): void => {
  const modes = Array.from(document.querySelectorAll<HTMLElement>(".lab-home .mode"));
  if (!modes.length || typeof window.IntersectionObserver === "undefined") return;

  modeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          element.classList.add("mode-visible");
        } else if (entry.boundingClientRect.top > 0) {
          element.classList.remove("mode-visible");
        }
      });
    },
    {
      threshold: [0.2, 0.38, 0.58],
      rootMargin: "-5% 0px -10% 0px",
    },
  );

  modes.forEach((mode) => modeObserver?.observe(mode));
};

const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (!element) return;

  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const navbar = document.querySelector<HTMLElement>(".vp-navbar");
  const offset = navbar?.offsetHeight ?? 70;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
};

const getPredictionScore = (prediction: HandTrackPrediction): number => {
  if (typeof prediction.score === "number") return prediction.score;
  if (typeof prediction.score === "string") {
    const parsed = Number.parseFloat(prediction.score);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const getPredictionLabel = (prediction: HandTrackPrediction): string => {
  if (typeof prediction.label === "string" && prediction.label.trim()) {
    return prediction.label.trim().toLowerCase();
  }
  if (typeof prediction.class === "number") {
    return gestureClassLabelMap[prediction.class] ?? String(prediction.class);
  }
  if (typeof prediction.class === "string") {
    return prediction.class.trim().toLowerCase();
  }
  return "";
};

const isLikelyHandPrediction = (prediction: HandTrackPrediction): boolean => {
  const bbox = prediction.bbox;
  if (!bbox || bbox.length < 4) return false;

  const label = getPredictionLabel(prediction);
  if (!label) return true;
  if (label.includes("face")) return false;
  if (gestureHandLabelSet.has(label) || label.includes("hand")) return true;

  const labelAsNumber = Number.parseInt(label, 10);
  if (Number.isFinite(labelAsNumber)) {
    return labelAsNumber !== 5;
  }

  return false;
};

const pickHighestPrediction = (predictions: HandTrackPrediction[]): HandTrackPrediction | null => {
  if (!predictions.length) return null;
  return predictions.reduce((bestPrediction, currentPrediction) => {
    return getPredictionScore(currentPrediction) > getPredictionScore(bestPrediction)
      ? currentPrediction
      : bestPrediction;
  });
};

const pickPrimaryHandPrediction = (predictions: HandTrackPrediction[]): HandTrackPrediction | null => {
  const handPredictions = predictions.filter(isLikelyHandPrediction);
  return pickHighestPrediction(handPredictions);
};

const trySetGestureHint = (text: string, now = performance.now()): void => {
  if (now - gestureLastHintAt < gestureHintIntervalMs) return;
  gestureLastHintAt = now;
  gestureStatusText.value = text;
};

const isElementVisible = (element: HTMLElement | null): element is HTMLElement => {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
};

const applyHorizontalGesture = (direction: "left" | "right", source: "gesture" | "keyboard" = "gesture"): void => {
  const themeContainer = document.querySelector<HTMLElement>(".theme-container");
  const label =
    source === "gesture"
      ? direction === "left"
        ? "检测到左挥"
        : "检测到右挥"
      : direction === "left"
        ? "键盘左方向键"
        : "键盘右方向键";

  if (!themeContainer || themeContainer.classList.contains("no-sidebar")) {
    gestureStatusText.value = `${label}：当前页面没有可控侧边栏。`;
    return;
  }

  const mobileToggleButton = document.querySelector<HTMLButtonElement>(".vp-toggle-sidebar-button");
  const desktopToggle = document.querySelector<HTMLElement>(".toggle-sidebar-wrapper");
  const mobileMask = document.querySelector<HTMLElement>(".vp-sidebar-mask");
  const isMobileMode = isElementVisible(mobileToggleButton);
  const isDesktopCollapsibleMode = !isMobileMode && isElementVisible(desktopToggle);
  const isMobileSidebarOpen = themeContainer.classList.contains("sidebar-open");
  const isDesktopSidebarCollapsed = themeContainer.classList.contains("sidebar-collapsed");

  if (direction === "right") {
    if (isMobileMode) {
      if (isMobileSidebarOpen) {
        gestureStatusText.value = `${label}：侧边栏已展开。`;
        return;
      }

      mobileToggleButton.click();
      gestureStatusText.value = `${label}：侧边栏展开。`;
      return;
    }

    if (isDesktopCollapsibleMode) {
      if (!isDesktopSidebarCollapsed) {
        gestureStatusText.value = `${label}：侧边栏已展开。`;
        return;
      }

      desktopToggle.click();
      gestureStatusText.value = `${label}：侧边栏展开。`;
      return;
    }

    gestureStatusText.value = `${label}：当前宽屏侧边栏默认展开。`;
    return;
  }

  if (isMobileMode) {
    if (!isMobileSidebarOpen) {
      gestureStatusText.value = `${label}：侧边栏已收起。`;
      return;
    }

    if (isElementVisible(mobileMask)) {
      mobileMask.click();
    } else {
      mobileToggleButton.click();
    }
    gestureStatusText.value = `${label}：侧边栏收起。`;
    return;
  }

  if (isDesktopCollapsibleMode) {
    if (isDesktopSidebarCollapsed) {
      gestureStatusText.value = `${label}：侧边栏已收起。`;
      return;
    }

    desktopToggle.click();
    gestureStatusText.value = `${label}：侧边栏收起。`;
    return;
  }

  gestureStatusText.value = `${label}：当前宽屏不支持收起侧边栏。`;
};

const applyVerticalGesture = (direction: "up" | "down", source: "gesture" | "keyboard" = "gesture"): void => {
  const scrollStep = Math.round(window.innerHeight * 0.72);
  const amount = direction === "up" ? -scrollStep : scrollStep;
  window.scrollBy({ top: amount, behavior: "smooth" });

  if (source === "gesture") {
    gestureStatusText.value = direction === "up" ? "检测到握拳：页面上移。" : "检测到张开手掌：页面下移。";
  } else {
    gestureStatusText.value = direction === "up" ? "键盘上方向键：页面上移。" : "键盘下方向键：页面下移。";
  }
};

const handleGesturePrediction = (prediction: HandTrackPrediction, video: HTMLVideoElement): void => {
  const bbox = prediction.bbox;
  if (!bbox || bbox.length < 4 || video.videoWidth === 0 || video.videoHeight === 0) return;

  const [x, y, width, height] = bbox;
  const now = performance.now();
  const point = {
    x: (x + width / 2) / video.videoWidth,
    y: (y + height / 2) / video.videoHeight,
    at: now,
  };

  if (!gestureAnchorPoint) {
    gestureAnchorPoint = point;
    gestureStatusText.value = "已检测到手部，准备识别滑动动作。";
    return;
  }

  const anchorAge = point.at - gestureAnchorPoint.at;
  if (anchorAge > gestureTrackResetAfterMs) {
    gestureAnchorPoint = point;
    return;
  }

  const deltaX = point.x - gestureAnchorPoint.x;
  const deltaY = point.y - gestureAnchorPoint.y;

  if (now < gestureCooldownUntil) return;

  if (Math.abs(deltaX) >= gestureSwipeThresholdX && Math.abs(deltaX) > Math.abs(deltaY) * gestureDirectionRatio) {
    gestureCooldownUntil = now + gestureCooldownMs;
    applyHorizontalGesture(deltaX < 0 ? "left" : "right", "gesture");
    gestureAnchorPoint = null;
    gestureClosedPoseCount = 0;
    gestureOpenPoseCount = 0;
    return;
  }

  const label = getPredictionLabel(prediction);
  const isClosedPose = label.includes("closed");
  const isOpenPose = label.includes("open");

  if (isClosedPose) {
    gestureClosedPoseCount += 1;
    gestureOpenPoseCount = 0;
  } else if (isOpenPose) {
    gestureOpenPoseCount += 1;
    gestureClosedPoseCount = 0;
  } else {
    gestureClosedPoseCount = 0;
    gestureOpenPoseCount = 0;
  }

  if (gestureClosedPoseCount >= gesturePoseStableFrames) {
    gestureCooldownUntil = now + gestureCooldownMs;
    applyVerticalGesture("up", "gesture");
    gestureAnchorPoint = point;
    gestureClosedPoseCount = 0;
    gestureOpenPoseCount = 0;
    return;
  }

  if (gestureOpenPoseCount >= gesturePoseStableFrames) {
    gestureCooldownUntil = now + gestureCooldownMs;
    applyVerticalGesture("down", "gesture");
    gestureAnchorPoint = point;
    gestureClosedPoseCount = 0;
    gestureOpenPoseCount = 0;
    return;
  }

  if (
    Math.abs(deltaX) < gestureSwipeThresholdX * 0.36 &&
    Math.abs(deltaY) < gestureSwipeThresholdX * 0.36 &&
    anchorAge > 260
  ) {
    gestureAnchorPoint = point;
  }
};

const clearGestureLoop = (): void => {
  if (gestureLoopHandle !== null) {
    window.cancelAnimationFrame(gestureLoopHandle);
    gestureLoopHandle = null;
  }
};

const stopGestureControl = (statusText?: string): void => {
  clearGestureLoop();
  isGestureControlActive.value = false;
  gestureAnchorPoint = null;
  gestureLostFrameCount = 0;
  gestureCooldownUntil = 0;
  gestureLastHintAt = 0;
  gestureClosedPoseCount = 0;
  gestureOpenPoseCount = 0;

  if (gestureStream) {
    gestureStream.getTracks().forEach((track) => track.stop());
    gestureStream = null;
  }

  const video = gestureVideoRef.value;
  if (video) {
    video.pause();
    video.srcObject = null;
  }

  if (statusText) {
    gestureStatusText.value = statusText;
  } else if (isGestureControlSupported.value) {
    gestureStatusText.value = "手势控制已关闭。";
  }
};

const runGestureLoop = async (): Promise<void> => {
  if (!isGestureControlActive.value || !gestureModel || !gestureVideoRef.value) return;

  const video = gestureVideoRef.value;
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    gestureLoopHandle = window.requestAnimationFrame(() => {
      void runGestureLoop();
    });
    return;
  }

  try {
    const predictions = await gestureModel.detect(video);
    const primaryPrediction = pickPrimaryHandPrediction(predictions);
    const bestPrediction = pickHighestPrediction(predictions);
    const now = performance.now();

    if (!primaryPrediction) {
      gestureLostFrameCount += 1;
      gestureClosedPoseCount = 0;
      gestureOpenPoseCount = 0;
      if (gestureLostFrameCount > 12) {
        gestureAnchorPoint = null;
      }

      if (bestPrediction) {
        const bestLabel = getPredictionLabel(bestPrediction);
        const bestScore = getPredictionScore(bestPrediction).toFixed(2);
        if (bestLabel === "face") {
          trySetGestureHint("当前主要识别到 face，请把手掌放到肩膀附近并张开。", now);
        } else {
          trySetGestureHint(`当前识别到 ${bestLabel || "目标"} (${bestScore})，请将手掌抬高并靠近镜头。`, now);
        }
      } else if (gestureLostFrameCount >= 6) {
        trySetGestureHint("未检测到手部，请把手掌抬到摄像头中上区域并保持光线充足。", now);
      }
    } else {
      gestureLostFrameCount = 0;
      gestureLastHintAt = 0;
      handleGesturePrediction(primaryPrediction, video);
    }
  } catch (error) {
    console.error("handtrack detect failed:", error);
    stopGestureControl("手势识别中断，请重新开启。");
    return;
  }

  if (isGestureControlActive.value) {
    gestureLoopHandle = window.requestAnimationFrame(() => {
      void runGestureLoop();
    });
  }
};

const ensureGestureModelLoaded = async (): Promise<void> => {
  if (gestureModel) return;

  if (!gestureModelLoadingTask) {
    gestureModelLoadingTask = (async () => {
      gestureStatusText.value = "正在加载手势模型（首次加载约几秒）...";
      const handTrack = (await import("handtrackjs")) as unknown as HandTrackModule;
      gestureModel = await handTrack.load({
        scoreThreshold: 0.35,
        iouThreshold: 0.3,
        maxNumBoxes: 5,
        flipHorizontal: true,
        modelType: "ssd320fpnlite",
        modelSize: "medium",
      });
    })().finally(() => {
      gestureModelLoadingTask = null;
    });
  }

  await gestureModelLoadingTask;
};

const startGestureControl = async (): Promise<void> => {
  if (!isGestureControlSupported.value || isGestureControlActive.value || isGestureControlLoading.value) return;

  const video = gestureVideoRef.value;
  if (!video) return;

  isGestureControlLoading.value = true;

  try {
    await ensureGestureModelLoaded();
    gestureStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });

    video.srcObject = gestureStream;
    await video.play();
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      await new Promise<void>((resolve) => {
        const handleLoaded = (): void => {
          resolve();
        };
        video.addEventListener("loadedmetadata", handleLoaded, { once: true });
      });
    }

    video.width = video.videoWidth || 640;
    video.height = video.videoHeight || 480;

    isGestureControlActive.value = true;
    gestureStatusText.value = "手势控制已开启，请在摄像头前挥手。";
    gestureAnchorPoint = null;
    gestureLostFrameCount = 0;
    gestureCooldownUntil = 0;
    gestureClosedPoseCount = 0;
    gestureOpenPoseCount = 0;
    void runGestureLoop();
  } catch (error) {
    console.error("handtrack start failed:", error);
    stopGestureControl("无法开启手势控制，请检查摄像头权限。");
  } finally {
    isGestureControlLoading.value = false;
  }
};

const toggleGestureControl = (): void => {
  if (isGestureControlActive.value) {
    stopGestureControl();
    return;
  }

  void startGestureControl();
};

const shouldIgnoreKeyboardTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select") return true;
  return target.isContentEditable;
};

const handleArrowKeyControl = (event: KeyboardEvent): void => {
  if (shouldIgnoreKeyboardTarget(event.target)) return;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    applyVerticalGesture("up", "keyboard");
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    applyVerticalGesture("down", "keyboard");
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    applyHorizontalGesture("left", "keyboard");
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    applyHorizontalGesture("right", "keyboard");
  }
};

onMounted(() => {
  initModeTurnAnimation();
  isGestureControlSupported.value = Boolean(navigator.mediaDevices?.getUserMedia);
  gestureStatusText.value = isGestureControlSupported.value
    ? "点击“开启”后授权摄像头，即可用手势控制页面。"
    : "当前浏览器不支持摄像头能力，无法使用手势控制。";
});

onBeforeUnmount(() => {
  stopGestureControl();
  if (modeObserver) {
    modeObserver.disconnect();
    modeObserver = null;
  }
});

const heroTags = ["人工智能应用", "工程部署", "嵌入式", "ROS机器人", "大模型"];

const heroRainDrops = Array.from({ length: 44 }, (_, index) => {
  const left = (index * 17.3) % 100;
  return {
    left: `${left.toFixed(2)}%`,
    delay: `${((index * 0.19) % 6.2).toFixed(2)}s`,
    duration: `${(2.35 + (index % 8) * 0.21).toFixed(2)}s`,
    length: `${8 + (index % 8) * 2.6}px`,
    opacity: `${(0.23 + (index % 5) * 0.1).toFixed(2)}`,
  };
});

const metricItems = [
  { value: "12+", label: "在研课题" },
  { value: "6", label: "核心方向" },
  { value: "20+", label: "合作单位" },
  { value: "40+", label: "年度活动" },
];

const researchItems = [
  {
    title: "中国软件杯挑战赛",
    tag: "2024-11-15",
    desc: "构建机器狗在复杂环境中的自主导航与任务执行能力。",
    image: "/images/join-us_img/group-photo_grade21to23.jpg",
    link: "/demo/success",
  },
  {
    title: "智慧社区算法精英赛",
    tag: "2025-12-30",
    desc: "结合真实场景的计算机视觉和机器人应用",
    image: "/images/join-us_img/2025_AIC_group_total.jpg",
    link: "/demo/success",
  },
  {
    title: "全国服务外包大赛",
    tag: "2025-04-20",
    desc: "构建完善的社区识别体系与智能化应用。",
    image: "/images/join-us_img/IMG_20251219_144019.jpg",
    link: "/demo/success",
  },
  {
    title: "计算机设计大赛",
    tag: "2025-09-10",
    desc: "面向计算机的算法与系统设计竞赛，推动技术落地与创新。",
    image: "/images/join-us_img/8700ace640b91a0fd67047b4cdb88ce-scaled.jpg",
    link: "/demo/success",
  },
];

const activityItems = [
  { date: "2025-12-30", title: "智慧社区比赛完赛", place: "江阴", link: "/demo/resources/ROStrain" },
  { date: "2026-01-18", title: "寒假学习计划与任务分配", place: "河海大学", link: "/demo/success"},
  { date: "2026-03-02", title: "寒假学习成果验收", place: "河海大学", link: "/demo/success" },
];

const galleryItems = [
  { title: "实验室团队", image: "/images/join-us_img/2025_AIC_group_total.jpg", link: "/join-us" },
  { title: "校园风景", image: "/images/main_img/hhu-bridge.png", link: "/demo/success" },
  { title: "技术交流", image: "/images/join-us_img/IMG_20251219_143906.jpg", link: "/join-us" },
  { title: "比赛记录", image: "/images/join-us_img/IMG_20251219_141930.jpg", link: "/demo/resources/" },
  { title: "活动剪影", image: "/images/join-us_img/IMG_20251219_143946.jpg", link: "/join-us" },
  { title: "团队合作", image: "/images/join-us_img/IMG_20251219_144019.jpg", link: "/join-us" },
];

const footerLinks = [
  { title: "首页", link: "/" },
  { title: "关于实验室", link: "/demo/" },
  { title: "成员名录", link: "/demo/members-list" },
  { title: "资源库", link: "/demo/resources/" },
  { title: "加入我们", link: "/join-us" },
];
</script>
