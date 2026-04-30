<template>
  <div class="global-gesture-control" :class="{ 'is-active': isGestureControlActive }">
    <div class="global-gesture-head">
      <strong>手势操控</strong>
      <button
        type="button"
        class="global-gesture-toggle"
        :disabled="!isGestureControlSupported || isGestureControlLoading"
        @click="toggleGestureControl"
      >
        {{ gestureButtonText }}
      </button>
    </div>
    <p class="global-gesture-status">{{ gestureStatusText }}</p>
    <p class="global-gesture-tips">
      仅识别张开手掌（未张开不计入）｜左右与上下分离识别（防混淆），需连续 5 帧同方向才触发｜左/右切换顶部导航，上/下滚动页面
    </p>
    <video ref="gestureVideoRef" class="global-gesture-video" autoplay muted playsinline></video>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

let gestureModel: HandTrackModel | null = null;
let gestureModelLoadingTask: Promise<void> | null = null;
let gestureStream: MediaStream | null = null;
let gestureLoopHandle: number | null = null;
let gestureAnchorPoint: { x: number; y: number; at: number } | null = null;
let gestureLostFrameCount = 0;
let gestureCooldownUntil = 0;
let gestureLastHintAt = 0;
let gestureDirectionCandidate: GestureDirection | null = null;
let gestureDirectionStableCount = 0;
let gestureNoDirectionFrameCount = 0;

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

type GestureDirection = "left" | "right" | "up" | "down";

const gestureClassLabelMap: Record<number, string> = {
  1: "open",
  2: "closed",
  3: "pinch",
  4: "point",
  5: "face",
  6: "pointtip",
  7: "pinchtip",
};

const gestureOpenHandLabelSet = new Set(["open", "palm", "hand", "openhand", "open_hand"]);
const gestureSwipeThresholdX = 0.042;
const gestureSwipeThresholdY = 0.042;
const gestureTrackResetAfterMs = 900;
const gestureCooldownMs = 520;
const gestureHintIntervalMs = 680;
const gestureHorizontalDominanceRatio = 1.24;
const gestureVerticalDominanceRatio = 1.3;
const gestureHorizontalAngleLimitDeg = 34;
const gestureVerticalAngleMinDeg = 56;
const gestureDirectionMotionMin = 0.016;
const gestureEdgeZoneRatio = 0.14;
const gestureDirectionStableFrames = 5;
const gestureNeutralResetFrames = 2;
const gestureAnchorRefreshAfterMs = 240;
const gestureAnchorRefreshDistance = 0.022;
const gestureVerticalZoneTop = 0.3;
const gestureVerticalZoneBottom = 0.7;
const gestureVerticalZoneMinX = 0.24;
const gestureVerticalZoneMaxX = 0.76;

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

const isOpenHandPrediction = (prediction: HandTrackPrediction): boolean => {
  const bbox = prediction.bbox;
  if (!bbox || bbox.length < 4) return false;

  const label = getPredictionLabel(prediction);
  if (!label) return false;
  if (label.includes("face")) return false;
  if (gestureOpenHandLabelSet.has(label)) return true;
  if (label.includes("open") || label.includes("palm")) return true;

  const labelAsNumber = Number.parseInt(label, 10);
  if (Number.isFinite(labelAsNumber)) {
    return labelAsNumber === 1;
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
  const handPredictions = predictions.filter(isOpenHandPrediction);
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

const directionDisplayMap: Record<GestureDirection, string> = {
  up: "上",
  down: "下",
  left: "左",
  right: "右",
};

const pickEdgeDirection = (point: { x: number; y: number }): GestureDirection | null => {
  const leftDistance = point.x;
  const rightDistance = 1 - point.x;
  const topDistance = point.y;
  const bottomDistance = 1 - point.y;
  const nearestDistance = Math.min(leftDistance, rightDistance, topDistance, bottomDistance);

  if (nearestDistance > gestureEdgeZoneRatio) return null;
  if (nearestDistance === leftDistance) return "left";
  if (nearestDistance === rightDistance) return "right";
  if (nearestDistance === topDistance) return "up";
  return "down";
};

const resetDirectionTracking = (): void => {
  gestureDirectionCandidate = null;
  gestureDirectionStableCount = 0;
  gestureNoDirectionFrameCount = 0;
};

const detectDirectionCandidate = (
  point: { x: number; y: number },
  anchorPoint: { x: number; y: number },
): GestureDirection | null => {
  const deltaX = point.x - anchorPoint.x;
  const deltaY = point.y - anchorPoint.y;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);
  const movement = Math.hypot(deltaX, deltaY);

  const isHorizontalDominant =
    absDeltaX >= gestureSwipeThresholdX && absDeltaX >= absDeltaY * gestureHorizontalDominanceRatio;
  const isVerticalDominant =
    absDeltaY >= gestureSwipeThresholdY && absDeltaY >= absDeltaX * gestureVerticalDominanceRatio;

  if (movement >= gestureDirectionMotionMin) {
    const angleDeg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const absAngle = Math.abs(angleDeg);
    const isNearHorizontal = absAngle <= gestureHorizontalAngleLimitDeg || absAngle >= 180 - gestureHorizontalAngleLimitDeg;
    const isNearVertical = absAngle >= gestureVerticalAngleMinDeg && absAngle <= 180 - gestureVerticalAngleMinDeg;

    if (isHorizontalDominant && isNearHorizontal) {
      return deltaX < 0 ? "left" : "right";
    }

    if (isVerticalDominant && isNearVertical) {
      return deltaY < 0 ? "up" : "down";
    }

    if (isHorizontalDominant) {
      return deltaX < 0 ? "left" : "right";
    }

    if (isVerticalDominant) {
      return deltaY < 0 ? "up" : "down";
    }

    return null;
  }

  const edgeDirection = pickEdgeDirection(point);
  if (edgeDirection) {
    return edgeDirection;
  }

  const isInVerticalControlBand = point.x >= gestureVerticalZoneMinX && point.x <= gestureVerticalZoneMaxX;
  if (isInVerticalControlBand) {
    if (point.y <= gestureVerticalZoneTop) return "up";
    if (point.y >= gestureVerticalZoneBottom) return "down";
  }

  return null;
};

const applyHorizontalGesture = (direction: "left" | "right", source: "gesture" | "keyboard" = "gesture"): void => {
  const label =
    source === "gesture"
      ? direction === "left"
        ? "检测到左挥"
        : "检测到右挥"
      : direction === "left"
        ? "键盘左方向键"
        : "键盘右方向键";

  const navbar = document.querySelector<HTMLElement>(".vp-navbar");
  if (!navbar) {
    gestureStatusText.value = `${label}：未找到顶部导航。`;
    return;
  }

  const selectorCandidates = [".vp-nav-links a[href]", ".vp-nav-item a[href]", ".vp-navbar a[href]"];
  let navLinks: HTMLAnchorElement[] = [];

  for (const selector of selectorCandidates) {
    const foundLinks = Array.from(navbar.querySelectorAll<HTMLAnchorElement>(selector)).filter((link) =>
      isElementVisible(link),
    );
    if (foundLinks.length >= 2) {
      navLinks = foundLinks;
      break;
    }
  }

  if (navLinks.length < 2) {
    gestureStatusText.value = `${label}：顶部导航项不足，无法左右切换。`;
    return;
  }

  const dedupedLinks: HTMLAnchorElement[] = [];
  const linkKeySet = new Set<string>();
  for (const link of navLinks) {
    const key = `${link.textContent?.trim() || ""}::${link.href}`;
    if (linkKeySet.has(key)) continue;
    linkKeySet.add(key);
    dedupedLinks.push(link);
  }

  const normalizePath = (href: string): string => {
    try {
      const url = new URL(href, window.location.origin);
      const pathname = url.pathname.replace(/\/+$/, "");
      return pathname || "/";
    } catch {
      return "/";
    }
  };

  const currentPath = normalizePath(window.location.pathname);
  let activeIndex = dedupedLinks.findIndex((link) => normalizePath(link.pathname) === currentPath);

  if (activeIndex < 0) {
    activeIndex = dedupedLinks.findIndex((link) => {
      const linkPath = normalizePath(link.pathname);
      if (linkPath === "/") return currentPath === "/";
      return currentPath.startsWith(linkPath);
    });
  }

  if (activeIndex < 0) activeIndex = 0;

  const offset = direction === "right" ? 1 : -1;
  const nextIndex = (activeIndex + offset + dedupedLinks.length) % dedupedLinks.length;
  const nextLink = dedupedLinks[nextIndex];
  const targetTitle = nextLink.textContent?.trim() || normalizePath(nextLink.pathname);

  nextLink.click();
  gestureStatusText.value = `${label}：顶部导航切换到 ${targetTitle}。`;
};

const applyVerticalGesture = (direction: "up" | "down", source: "gesture" | "keyboard" = "gesture"): void => {
  const scrollStep = Math.round(window.innerHeight * 0.72);
  const amount = direction === "up" ? -scrollStep : scrollStep;
  window.scrollBy({ top: amount, behavior: "smooth" });

  if (source === "gesture") {
    gestureStatusText.value = direction === "up" ? "检测到上翻手势：页面上移。" : "检测到下翻手势：页面下移。";
  } else {
    gestureStatusText.value = direction === "up" ? "键盘上方向键：页面上移。" : "键盘下方向键：页面下移。";
  }
};

const triggerDirectionalAction = (direction: GestureDirection, source: "gesture" | "keyboard" = "gesture"): void => {
  if (direction === "left" || direction === "right") {
    applyHorizontalGesture(direction, source);
    return;
  }

  applyVerticalGesture(direction, source);
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
    resetDirectionTracking();
    gestureStatusText.value = "已检测到张开手掌，准备识别上下左右动作。";
    return;
  }

  const anchorAge = point.at - gestureAnchorPoint.at;
  if (anchorAge > gestureTrackResetAfterMs) {
    gestureAnchorPoint = point;
    resetDirectionTracking();
    return;
  }

  const deltaX = point.x - gestureAnchorPoint.x;
  const deltaY = point.y - gestureAnchorPoint.y;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  if (now < gestureCooldownUntil) {
    resetDirectionTracking();
    if (anchorAge > gestureAnchorRefreshAfterMs) {
      gestureAnchorPoint = point;
    }
    return;
  }

  const candidateDirection = detectDirectionCandidate(point, gestureAnchorPoint);
  if (candidateDirection) {
    gestureNoDirectionFrameCount = 0;
    if (gestureDirectionCandidate === candidateDirection) {
      gestureDirectionStableCount += 1;
    } else {
      gestureDirectionCandidate = candidateDirection;
      gestureDirectionStableCount = 1;
    }

    const displayDirection = directionDisplayMap[candidateDirection];
    trySetGestureHint(`识别到${displayDirection}方向 (${gestureDirectionStableCount}/${gestureDirectionStableFrames})`, now);

    if (gestureDirectionStableCount >= gestureDirectionStableFrames) {
      gestureCooldownUntil = now + gestureCooldownMs;
      triggerDirectionalAction(candidateDirection, "gesture");
      gestureAnchorPoint = point;
      resetDirectionTracking();
      return;
    }
  } else {
    gestureNoDirectionFrameCount += 1;
    if (gestureNoDirectionFrameCount >= gestureNeutralResetFrames) {
      resetDirectionTracking();
    }
  }

  if (
    absDeltaX < gestureAnchorRefreshDistance &&
    absDeltaY < gestureAnchorRefreshDistance &&
    anchorAge > gestureAnchorRefreshAfterMs
  ) {
    gestureAnchorPoint = point;
    return;
  }

  if (anchorAge > gestureAnchorRefreshAfterMs * 1.7) {
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
  resetDirectionTracking();

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
      resetDirectionTracking();
      if (gestureLostFrameCount > 12) {
        gestureAnchorPoint = null;
      }

      if (bestPrediction) {
        const bestLabel = getPredictionLabel(bestPrediction);
        const bestScore = getPredictionScore(bestPrediction).toFixed(2);
        if (bestLabel === "face") {
          trySetGestureHint("当前主要识别到 face，请把张开手掌放到肩膀附近。", now);
        } else {
          trySetGestureHint(`当前识别到 ${bestLabel || "目标"} (${bestScore})，请张开手掌后再操作。`, now);
        }
      } else if (gestureLostFrameCount >= 6) {
        trySetGestureHint("未检测到张开手掌，请把手掌张开后抬到摄像头中上区域。", now);
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
    resetDirectionTracking();
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
    triggerDirectionalAction("up", "keyboard");
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    triggerDirectionalAction("down", "keyboard");
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    triggerDirectionalAction("left", "keyboard");
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    triggerDirectionalAction("right", "keyboard");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleArrowKeyControl);
  isGestureControlSupported.value = Boolean(navigator.mediaDevices?.getUserMedia);

  gestureStatusText.value = isGestureControlSupported.value
    ? "点击“开启”后授权摄像头，即可用手势控制页面。"
    : "当前浏览器不支持摄像头能力，无法使用手势控制。";
});

onBeforeUnmount(() => {
  stopGestureControl();
  window.removeEventListener("keydown", handleArrowKeyControl);
});
</script>

<style scoped>
.global-gesture-control {
  position: fixed;
  top: calc(var(--navbar-height) + clamp(0.45rem, 1.6vh, 0.95rem));
  right: clamp(0.85rem, 2.8vw, 1.9rem);
  z-index: 132;
  width: min(340px, 40vw);
  max-width: calc(100vw - 1.2rem);
  padding: 0.72rem 0.78rem;
  border-radius: 14px;
  border: 1px solid rgba(150, 188, 220, 0.45);
  background: rgba(5, 16, 34, 0.86);
  color: #eef6ff;
  box-shadow: 0 16px 32px rgba(2, 12, 24, 0.34);
  backdrop-filter: blur(6px);
}

.global-gesture-control.is-active {
  border-color: rgba(172, 221, 255, 0.72);
  box-shadow:
    0 18px 36px rgba(1, 12, 28, 0.44),
    0 0 0 1px rgba(163, 216, 255, 0.25) inset;
}

.global-gesture-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.72rem;
}

.global-gesture-head strong {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.global-gesture-toggle {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 0.32rem 0.75rem;
  background: linear-gradient(110deg, #e7f5ff 0%, #9ed3ff 55%, #69b4ff 100%);
  color: #113667;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.global-gesture-toggle:hover:enabled {
  transform: translateY(-1px);
}

.global-gesture-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.global-gesture-status,
.global-gesture-tips {
  margin: 0.52rem 0 0;
  font-size: 0.74rem;
  line-height: 1.5;
}

.global-gesture-status {
  color: #f4f9ff;
}

.global-gesture-tips {
  color: rgba(212, 236, 255, 0.84);
}

.global-gesture-video {
  display: none;
  width: 100%;
  margin-top: 0.58rem;
  border-radius: 10px;
  border: 1px solid rgba(166, 210, 245, 0.4);
  background: rgba(2, 9, 18, 0.88);
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transform: scaleX(-1);
}

.global-gesture-control.is-active .global-gesture-video {
  display: block;
}

@media (max-width: 760px) {
  .global-gesture-control {
    right: 0.65rem;
    left: 0.65rem;
    width: auto;
    top: auto;
    bottom: 0.64rem;
    padding: 0.64rem 0.66rem;
  }

  .global-gesture-status,
  .global-gesture-tips {
    font-size: 0.7rem;
  }
}
</style>
