<template>
  <span class="member-markdown-sync" aria-hidden="true"></span>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import { usePageData } from "vuepress/client";

interface MemberOverride {
  name?: string;
  title?: string;
  desc?: string;
  markdownContent?: string;
  updatedByUid: number;
  updatedAt: string;
  sourceFile: string;
}

const MEMBER_OVERRIDES_STORAGE_KEY = "zhize-member-overrides";
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
const page = usePageData();

const resolveMemberIdFromPath = (rawPath: string): string => {
  const pathname = (rawPath || "").split("?")[0].replace(/\/+$/, "");
  const matched = pathname.match(/^\/demo\/team\/([^/]+)\/member-(\d+)(?:\.html)?$/);
  if (!matched) return "";
  const section = matched[1];
  const memberNo = matched[2].padStart(2, "0");
  return `${section}-member-${memberNo}`;
};

const loadOverrides = (): Record<string, MemberOverride> => {
  if (!isClient) return {};
  const cachedValue = window.localStorage.getItem(MEMBER_OVERRIDES_STORAGE_KEY);
  if (!cachedValue) return {};
  try {
    return JSON.parse(cachedValue) as Record<string, MemberOverride>;
  } catch {
    return {};
  }
};

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInline = (text: string): string => {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
};

const renderMarkdownToHtml = (markdownText: string): string => {
  const lines = markdownText.replace(/\r\n/g, "\n").split("\n");
  const htmlParts: string[] = [];
  const paragraphBuffer: string[] = [];
  let listType: "" | "ul" | "ol" = "";

  const flushParagraph = (): void => {
    if (!paragraphBuffer.length) return;
    htmlParts.push(`<p>${renderInline(paragraphBuffer.join(" "))}</p>`);
    paragraphBuffer.length = 0;
  };

  const closeList = (): void => {
    if (!listType) return;
    htmlParts.push(`</${listType}>`);
    listType = "";
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    const headingMatched = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatched) {
      flushParagraph();
      closeList();
      const level = headingMatched[1].length;
      htmlParts.push(`<h${level}>${renderInline(headingMatched[2])}</h${level}>`);
      return;
    }

    const unorderedMatched = trimmed.match(/^[-*]\s+(.*)$/);
    if (unorderedMatched) {
      flushParagraph();
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        htmlParts.push("<ul>");
      }
      htmlParts.push(`<li>${renderInline(unorderedMatched[1])}</li>`);
      return;
    }

    const orderedMatched = trimmed.match(/^\d+[.)、]\s+(.*)$/);
    if (orderedMatched) {
      flushParagraph();
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        htmlParts.push("<ol>");
      }
      htmlParts.push(`<li>${renderInline(orderedMatched[1])}</li>`);
      return;
    }

    closeList();
    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
  closeList();
  return htmlParts.join("");
};

const buildFallbackMarkdown = (override: MemberOverride): string => {
  const lines: string[] = [];
  if (override.name) lines.push(`# ${override.name}`);
  if (override.title) lines.push(`## ${override.title}`);
  if (override.desc) lines.push(override.desc);
  return lines.join("\n\n");
};

const updatePageTitle = (name: string): void => {
  const heading = document.querySelector<HTMLElement>(".vp-page-title h1");
  if (heading) {
    const icon = heading.querySelector("iconify-icon");
    heading.textContent = "";
    if (icon) heading.appendChild(icon);
    heading.append(` ${name}`);
  }

  const siteTitleSuffix = " | 河海大学智泽实验室";
  document.title = `${name}${siteTitleSuffix}`;
};

const applyMemberOverride = (): void => {
  if (!isClient) return;

  const memberId = resolveMemberIdFromPath(page.value.path || window.location.pathname);
  if (!memberId) return;

  const overrides = loadOverrides();
  const override = overrides[memberId];
  if (!override) return;

  const markdownRoot = document.querySelector<HTMLElement>("#markdown-content");
  if (!markdownRoot) return;

  const markdownSource = (override.markdownContent || "").trim() || buildFallbackMarkdown(override);
  if (!markdownSource) return;

  markdownRoot.innerHTML = renderMarkdownToHtml(markdownSource);
  markdownRoot.setAttribute("data-member-id", memberId);
  markdownRoot.setAttribute("data-member-overridden", "true");

  if (override.name) {
    updatePageTitle(override.name);
  }
};

const handleStorageChanged = (event: StorageEvent): void => {
  if (event.key !== MEMBER_OVERRIDES_STORAGE_KEY) return;
  applyMemberOverride();
};

const handleLocalOverrideChanged = (): void => {
  applyMemberOverride();
};

watch(
  () => page.value.path,
  async () => {
    if (!isClient) return;
    await nextTick();
    applyMemberOverride();
  },
);

onMounted(async () => {
  if (!isClient) return;
  await nextTick();
  applyMemberOverride();
  window.addEventListener("storage", handleStorageChanged);
  window.addEventListener("zhize-member-overrides-changed", handleLocalOverrideChanged);
});

onBeforeUnmount(() => {
  if (!isClient) return;
  window.removeEventListener("storage", handleStorageChanged);
  window.removeEventListener("zhize-member-overrides-changed", handleLocalOverrideChanged);
});
</script>

<style scoped>
.member-markdown-sync {
  display: none;
}
</style>
