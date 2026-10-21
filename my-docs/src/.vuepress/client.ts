import { defineAsyncComponent, onBeforeUnmount, onMounted } from "vue";
import { defineClientConfig } from "vuepress/client";

// 非核心组件按需加载，避免把所有页面和交互代码放进首屏 bundle。
const GlobalUserAccess = defineAsyncComponent(() => import("./components/global/GlobalUserAccess.vue"));
const GlobalGestureControl = defineAsyncComponent(() => import("./components/global/GlobalGestureControl.vue"));
const GlobalAIAssistant = defineAsyncComponent(() => import("./components/global/GlobalAIAssistant.vue"));
const GlobalMemberMarkdownSync = defineAsyncComponent(() => import("./components/global/GlobalMemberMarkdownSync.vue"));
const LabHomePage = defineAsyncComponent(() => import("./components/pages/LabHomePage.vue"));
const TeamMembersPage = defineAsyncComponent(() => import("./components/pages/TeamMembersPage.vue"));
const SuccessShowcase = defineAsyncComponent(() => import("./components/pages/SuccessShowcase.vue"));
const TeamFootprints = defineAsyncComponent(() => import("./components/pages/TeamFootprints.vue"));
const VisitorDashboard = defineAsyncComponent(() => import("./components/pages/VisitorDashboard.vue"));
const TeachersShowcase = defineAsyncComponent(() => import("./components/teachers/TeachersShowcase.vue"));
const TeacherProfile = defineAsyncComponent(() => import("./components/teachers/TeacherProfile.vue"));
const TeacherProfileLoader = defineAsyncComponent(() => import("./components/teachers/TeacherProfileLoader.vue"));
const MemberProfile = defineAsyncComponent(() => import("./components/members/MemberProfile.vue"));
const MemberProfileLoader = defineAsyncComponent(() => import("./components/members/MemberProfileLoader.vue"));

export default defineClientConfig({
  rootComponents: [GlobalUserAccess, GlobalGestureControl, GlobalAIAssistant, GlobalMemberMarkdownSync],

  enhance({ app }) {
    app.component("VisitorDashboard", VisitorDashboard);
    app.component("LabHomePage", LabHomePage);
    app.component("TeamMembersPage", TeamMembersPage);
    app.component("SuccessShowcase", SuccessShowcase);
    app.component("TeamFootprints", TeamFootprints);
    app.component("TeachersShowcase", TeachersShowcase);
    app.component("TeacherProfile", TeacherProfile);
    app.component("TeacherProfileLoader", TeacherProfileLoader);
    app.component("MemberProfile", MemberProfile);
    app.component("MemberProfileLoader", MemberProfileLoader);
  },

  setup() {
    let cursorLayer: HTMLElement | null = null;
    let cursorElement: HTMLElement | null = null;
    let cursorRaf = 0;
    let cursorTrailStamp = 0;
    let pointerX = 0;
    let pointerY = 0;
    let cursorEnabled = false;

    const renderCursor = (): void => {
      if (!cursorElement) {
        cursorRaf = 0;
        return;
      }

      cursorElement.style.transform = `translate3d(${pointerX - 11}px, ${pointerY - 16}px, 0)`;
      cursorElement.style.opacity = "1";
      cursorRaf = 0;
    };

    const spawnTrailDrop = (x: number, y: number): void => {
      if (!cursorLayer) return;

      const drop = document.createElement("span");
      const size = 5 + Math.random() * 6;
      drop.className = "global-water-cursor-trail";
      drop.style.left = `${x - size * 0.4}px`;
      drop.style.top = `${y + 4 + Math.random() * 6}px`;
      drop.style.setProperty("--trail-size", `${size.toFixed(2)}px`);
      drop.style.setProperty("--trail-drift", `${((Math.random() - 0.5) * 20).toFixed(2)}px`);
      drop.style.setProperty("--trail-duration", `${(0.56 + Math.random() * 0.36).toFixed(2)}s`);

      cursorLayer.appendChild(drop);
      drop.addEventListener("animationend", () => drop.remove(), { once: true });
    };

    const spawnRipple = (x: number, y: number): void => {
      if (!cursorLayer) return;

      const ripple = document.createElement("span");
      ripple.className = "global-water-cursor-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.setProperty("--ripple-size", `${(24 + Math.random() * 18).toFixed(2)}px`);

      cursorLayer.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });

      for (let index = 0; index < 3; index += 1) {
        spawnTrailDrop(x + (Math.random() - 0.5) * 24, y + (Math.random() - 0.5) * 10);
      }
    };

    const hideCursor = (): void => {
      if (cursorElement) {
        cursorElement.style.opacity = "0";
      }
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (!cursorEnabled) return;

      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!cursorRaf) {
        cursorRaf = window.requestAnimationFrame(renderCursor);
      }

      const now = performance.now();
      if (now - cursorTrailStamp > 44) {
        spawnTrailDrop(pointerX, pointerY);
        cursorTrailStamp = now;
      }
    };

    const handlePointerDown = (event: PointerEvent): void => {
      if (!cursorEnabled) return;
      spawnRipple(event.clientX, event.clientY);
    };

    const initGlobalCursor = (): void => {
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cursorEnabled = hasFinePointer && !prefersReducedMotion;

      document.body.classList.toggle("global-water-cursor-enabled", cursorEnabled);
      if (!cursorEnabled) return;

      cursorLayer = document.createElement("div");
      cursorLayer.className = "global-water-cursor-layer";
      cursorElement = document.createElement("span");
      cursorElement.className = "global-water-cursor";
      cursorLayer.appendChild(cursorElement);
      document.body.appendChild(cursorLayer);

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerdown", handlePointerDown, { passive: true });
      window.addEventListener("blur", hideCursor);
      document.addEventListener("mouseleave", hideCursor);
    };

    const destroyGlobalCursor = (): void => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("mouseleave", hideCursor);

      if (cursorRaf) {
        window.cancelAnimationFrame(cursorRaf);
        cursorRaf = 0;
      }

      cursorLayer?.querySelectorAll(".global-water-cursor-trail, .global-water-cursor-ripple").forEach((item) => item.remove());
      cursorLayer?.remove();
      cursorLayer = null;
      cursorElement = null;

      document.body.classList.remove("global-water-cursor-enabled");
    };

    onMounted(() => {
      initGlobalCursor();
    });

    onBeforeUnmount(() => {
      destroyGlobalCursor();
    });
  },
});
