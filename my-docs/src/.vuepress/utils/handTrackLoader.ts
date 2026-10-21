export interface HandTrackModelOptions {
  scoreThreshold?: number;
  iouThreshold?: number;
  maxNumBoxes?: number;
  flipHorizontal?: boolean;
  modelType?: string;
  modelSize?: string;
}

export interface HandTrackPrediction {
  bbox?: [number, number, number, number] | number[];
  score?: number | string;
  class?: number | string;
  label?: string;
}

export interface HandTrackModel {
  detect: (input: HTMLVideoElement) => Promise<HandTrackPrediction[]>;
}

export interface HandTrackModule {
  load: (options?: HandTrackModelOptions) => Promise<HandTrackModel>;
}

type HandTrackWindow = Window & { handTrack?: HandTrackModule };

const HAND_TRACK_SCRIPT_ID = "zhize-handtrack-script";
const HAND_TRACK_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/handtrackjs@0.1.5/dist/handtrack.min.js";

let loadingTask: Promise<HandTrackModule> | null = null;

const getGlobalHandTrack = (): HandTrackModule | null => {
  if (typeof window === "undefined") return null;
  return (window as HandTrackWindow).handTrack || null;
};

export const loadHandTrack = async (): Promise<HandTrackModule> => {
  const existing = getGlobalHandTrack();
  if (existing) return existing;
  if (typeof document === "undefined") throw new Error("手势控制只能在浏览器中使用。");

  loadingTask ??= new Promise<HandTrackModule>((resolve, reject) => {
    const finish = (): void => {
      const module = getGlobalHandTrack();
      if (module) {
        resolve(module);
      } else {
        reject(new Error("手势识别脚本加载后未找到 handTrack 模块。"));
      }
    };
    const fail = (): void => {
      document.getElementById(HAND_TRACK_SCRIPT_ID)?.remove();
      reject(new Error("手势识别脚本加载失败。"));
    };

    const currentScript = document.getElementById(HAND_TRACK_SCRIPT_ID) as HTMLScriptElement | null;
    if (currentScript) {
      currentScript.addEventListener("load", finish, { once: true });
      currentScript.addEventListener("error", fail, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = HAND_TRACK_SCRIPT_ID;
    script.src = HAND_TRACK_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    loadingTask = null;
    throw error;
  });

  return loadingTask;
};
