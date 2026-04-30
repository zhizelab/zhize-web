<template>
  <div class="team-directory">
    <section class="team-hero">
      <img class="team-hero-image" src="/images/main_img/hhu-bridge.png" alt="研究队伍横幅背景" />
      <div class="team-hero-mask"></div>
      <div class="team-hero-content">
        <p class="team-hero-kicker">研究队伍</p>
        <h1>实验室成员</h1>
        <p>"历史会遗忘过客 但不会磨灭先驱"———提利昂 兰尼斯特</p>
      </div>
    </section>

    <section class="team-layout">
      <aside class="team-filter">
        <div class="team-filter-header">
          <h2>{{ category === 'major' ? '专业筛选' : '年级筛选' }}</h2>
          <button class="team-toggle-btn" @click="toggleCategory">
            切换为按{{ category === 'major' ? '年级' : '专业' }}筛选
          </button>
        </div>
        <div class="team-role-tabs-vertical">
          <a v-for="tab in roleTabs" :key="tab.id" :href="`#${tab.id}`">{{ tab.label }}</a>
        </div>
      </aside>

      <main class="team-main">
        <input
          ref="mdUploadInputRef"
          class="team-upload-input"
          type="file"
          accept=".md,.markdown,text/markdown"
          @change="handleMdUpload"
        />

        <section class="team-editor-panel">
          <p>{{ editorStatusText }}</p>
          <p>{{ bindHintText }}</p>
          <div v-if="loggedIn && currentBoundMember" class="team-self-panel">
            <h4>我的成员资料</h4>
            <p><strong>姓名：</strong>{{ currentBoundMember.name }}</p>
            <p><strong>标签：</strong>{{ currentBoundMember.title }}</p>
            <p><strong>简介：</strong>{{ currentBoundMember.desc }}</p>
            <div class="team-self-actions">
              <button type="button" @click="requestUpload(currentBoundMember.id)">重新上传 MD</button>
              <button type="button" class="danger" @click="clearMyOverride">清空已上传资料</button>
            </div>
          </div>
        </section>

        <section v-for="group in memberGroups" :id="group.id" :key="group.id" class="team-group">
          <div class="team-group-title">
            <h3>{{ group.name }}</h3>
            <p>成员资料将持续补充</p>
          </div>
          <div class="team-member-grid">
            <article
              v-for="member in group.members"
              :key="member.id"
              class="team-member-card"
              :class="{
                'is-bound-self': isBoundByCurrentUser(member.id),
                'is-bound-other': isBoundByOtherUser(member.id),
              }"
            >
              <a class="team-member-link" :href="member.link">
                <div class="team-member-avatar">
                  <img v-if="member.badge && (member.badge.includes('/') || member.badge.includes('.'))" :src="member.badge" :alt="member.name" />
                  <span v-else-if="member.badge">{{ member.badge }}</span>
                </div>
                <div class="team-member-body">
                  <h4>
                    {{ member.name }}
                    <span class="team-member-tag">{{ category === 'major' ? member.grade : member.major }}</span>
                  </h4>
                  <p class="team-member-title">{{ member.title }}</p>
                  <p class="team-member-desc">{{ member.desc }}</p>
                </div>
              </a>
              <div class="team-member-actions">
                <button
                  v-if="loggedIn"
                  type="button"
                  class="team-member-upload"
                  :disabled="!canUploadForMember(member.id)"
                  @click="requestUpload(member.id)"
                >
                  {{ uploadButtonText(member.id) }}
                </button>
                <p v-if="member.updatedMeta" class="team-member-meta">{{ member.updatedMeta }}</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { allMembers } from "../data/members";

import { authState, initAuthSession, isLoggedIn } from "../utils/authSession";

interface MemberItem {
  id: string;
  name: string;
  title: string;
  desc: string;
  badge: string;
  link: string;
  grade: string;
  major: string;
  updatedMeta?: string;
}

interface MemberGroup {
  id: string;
  name: string;
  members: MemberItem[];
}

interface MemberOverride {
  name?: string;
  title?: string;
  desc?: string;
  markdownContent?: string;
  updatedByUid: number;
  updatedAt: string;
  sourceFile: string;
}

const MEMBER_BINDINGS_STORAGE_KEY = "zhize-member-bindings";
const MEMBER_OVERRIDES_STORAGE_KEY = "zhize-member-overrides";
const isClient = typeof window !== "undefined";

const category = ref<"grade" | "major">("grade");

const toggleCategory = () => {
  category.value = category.value === "major" ? "grade" : "major";
  // optional: update URL
  if (isClient) {
    const url = new URL(window.location.href);
    url.searchParams.set("category", category.value);
    window.history.pushState({}, "", url);
  }
};

const uniqueGrades = computed(() => Array.from(new Set(allMembers.map(m => m.grade))).sort());
const uniqueMajors = computed(() => Array.from(new Set(allMembers.map(m => m.major))).sort());

const centerFilters = null; // Unused, keeping reference in case it was used elsewhere.

const roleTabs = computed(() => {
  const tabs = category.value === "major" ? uniqueMajors.value : uniqueGrades.value;
  return tabs.map(tab => ({
    id: `tab-${tab.replace(/\s+/g, "-")}`,
    label: tab
  }));
});

const baseMemberGroups = computed<MemberGroup[]>(() => {
  const groups: Record<string, MemberGroup> = {};
  
  allMembers.forEach(member => {
    const groupKey = category.value === "major" ? member.major : member.grade;
    const groupId = `tab-${groupKey.replace(/\s+/g, "-")}`;
    
    if (!groups[groupId]) {
      groups[groupId] = {
        id: groupId,
        name: groupKey,
        members: []
      };
    }
    groups[groupId].members.push(member);
  });
  
  return roleTabs.value.map(tab => groups[tab.id] || { id: tab.id, name: tab.label, members: [] });
});

const memberBindings = ref<Record<string, string>>({});
const memberOverrides = ref<Record<string, MemberOverride>>({});
const editorStatusText = ref("成员资料维护：上传 MD 后将即时覆盖卡片展示。");
const mdUploadInputRef = ref<HTMLInputElement | null>(null);
const uploadTargetMemberId = ref("");

const loggedIn = computed(() => isLoggedIn() && Boolean(authState.user?.uid));
const currentUid = computed(() => (authState.user?.uid ? String(authState.user.uid) : ""));
const currentBoundMemberId = computed(() => {
  if (!currentUid.value) return "";
  return memberBindings.value[currentUid.value] || "";
});

const memberLabelMap = computed(() => {
  const map: Record<string, string> = {};
  baseMemberGroups.value.forEach((group) => {
    group.members.forEach((member) => {
      map[member.id] = member.name;
    });
  });
  return map;
});

const getMemberLabel = (memberId: string): string => {
  return memberLabelMap.value[memberId] || memberId;
};

const bindHintText = computed(() => {
  if (!loggedIn.value) return "登录后可绑定 1 个成员，并上传 MD 更新资料。";
  if (!currentBoundMemberId.value) return "当前账号未绑定成员。点击“绑定并上传 MD”即可开始维护。";
  return `当前账号已绑定：${getMemberLabel(currentBoundMemberId.value)}（每个账号仅可绑定一个成员）`;
});

const findOwnerUid = (memberId: string): string => {
  const ownerEntry = Object.entries(memberBindings.value).find(([, boundMemberId]) => boundMemberId === memberId);
  return ownerEntry?.[0] || "";
};

const isBoundByCurrentUser = (memberId: string): boolean => {
  return Boolean(currentBoundMemberId.value && currentBoundMemberId.value === memberId);
};

const isBoundByOtherUser = (memberId: string): boolean => {
  const ownerUid = findOwnerUid(memberId);
  return Boolean(ownerUid && ownerUid !== currentUid.value);
};

const canUploadForMember = (memberId: string): boolean => {
  if (!loggedIn.value || !currentUid.value) return false;
  if (isBoundByCurrentUser(memberId)) return true;
  if (currentBoundMemberId.value && currentBoundMemberId.value !== memberId) return false;
  if (isBoundByOtherUser(memberId)) return false;
  return true;
};

const uploadButtonText = (memberId: string): string => {
  if (!loggedIn.value) return "登录后可上传";
  if (isBoundByCurrentUser(memberId)) return "上传 MD 更新";
  if (isBoundByOtherUser(memberId)) return "该成员已绑定其他账号";
  if (currentBoundMemberId.value && currentBoundMemberId.value !== memberId) return "当前账号已绑定其他成员";
  return "绑定并上传 MD";
};

const normalizeText = (text: string, maxLength = 120): string => {
  const cleaned = text
    .replace(/^[\"']+|[\"']+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}...`;
};

const normalizeMarkdownContent = (markdownText: string, maxLength = 20000): string => {
  const normalized = markdownText.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength).trim();
};

const normalizeFrontmatterKey = (key: string): string => {
  return key.trim().toLowerCase().replace(/\s+/g, "");
};

const pickFrontmatterValue = (
  frontmatter: Record<string, string>,
  keyCandidates: string[],
): string => {
  for (const key of keyCandidates) {
    const normalizedKey = normalizeFrontmatterKey(key);
    const value = frontmatter[normalizedKey];
    if (value) return value;
  }
  return "";
};

const parseFrontmatter = (markdownText: string): Record<string, string> => {
  const content = markdownText.replace(/\r\n/g, "\n");
  if (!content.startsWith("---\n")) return {};
  const endIndex = content.indexOf("\n---", 4);
  if (endIndex < 0) return {};

  const frontmatterContent = content.slice(4, endIndex);
  const result: Record<string, string> = {};
  frontmatterContent.split("\n").forEach((line) => {
    const lineMatch = line.match(/^([^:：\s]+)\s*[:：]\s*(.+)$/);
    if (!lineMatch) return;
    result[normalizeFrontmatterKey(lineMatch[1])] = normalizeText(lineMatch[2], 80);
  });
  return result;
};

const removeFrontmatter = (markdownText: string): string => {
  const content = markdownText.replace(/\r\n/g, "\n");
  if (!content.startsWith("---\n")) return content;
  const endIndex = content.indexOf("\n---", 4);
  if (endIndex < 0) return content;
  return content.slice(endIndex + 4).trim();
};

const parseMarkdownToOverride = (markdownText: string): Pick<MemberOverride, "name" | "title" | "desc"> => {
  const frontmatter = parseFrontmatter(markdownText);
  const contentBody = removeFrontmatter(markdownText);
  const contentLines = contentBody.split("\n").map((line) => line.trim()).filter(Boolean);

  const headingLines = contentLines
    .filter((line) => /^#{1,6}\s*/.test(line))
    .map((line) => line.replace(/^#{1,6}\s*/, "").trim())
    .filter(Boolean);

  const headingLine = headingLines[0] || "";
  const paragraphLine =
    contentLines.find((line) => !/^#/.test(line) && !/^[-*]\s+/.test(line) && !/^[0-9]+[.)、]/.test(line)) || "";
  const bulletLines = contentLines
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, ""))
    .slice(0, 3);

  const professionalLine = bulletLines.find((line) => /^专业[：:]/.test(line));
  const directionLine = bulletLines.find((line) => /^研究方向[：:]/.test(line));
  const normalizedLines = contentLines
    .map((line) =>
      line
        .replace(/^#{1,6}\s*/, "")
        .replace(/^[-*]\s+/, "")
        .replace(/^[0-9]+[.)、]\s*/, "")
        .trim(),
    )
    .filter(Boolean);
  const headingLongTail = headingLines.slice(1).sort((left, right) => right.length - left.length);

  const nameCandidate =
    pickFrontmatterValue(frontmatter, ["memberName", "name", "姓名", "成员", "成员姓名", "昵称", "title"]) ||
    headingLine ||
    normalizedLines[0] ||
    "";

  const titleCandidate =
    pickFrontmatterValue(frontmatter, ["role", "title", "专业", "研究方向", "职位", "年级"]) ||
    professionalLine ||
    directionLine ||
    headingLongTail[0] ||
    normalizedLines[1] ||
    "";

  const descParts: string[] = [];
  if (paragraphLine) descParts.push(paragraphLine);
  if (bulletLines.length) descParts.push(bulletLines.join("；"));
  if (!descParts.length && normalizedLines.length > 2) {
    descParts.push(normalizedLines.slice(1, 4).join("；"));
  }
  if (!descParts.length && normalizedLines.length > 1) {
    descParts.push(normalizedLines.slice(0, 3).join("；"));
  }
  const frontmatterDesc = pickFrontmatterValue(frontmatter, ["desc", "description", "bio", "简介", "介绍"]);
  if (frontmatterDesc) descParts.unshift(frontmatterDesc);
  const descCandidate = descParts.join("；");

  return {
    name: normalizeText(nameCandidate, 40),
    title: normalizeText(titleCandidate, 56),
    desc: normalizeText(descCandidate, 140),
  };
};

const formatUpdateTime = (rawTime: string): string => {
  const date = new Date(rawTime);
  if (Number.isNaN(date.getTime())) return rawTime;
  return date.toLocaleString("zh-CN", { hour12: false });
};

const memberGroups = computed<MemberGroup[]>(() => {
  return baseMemberGroups.value.map((group) => ({
    ...group,
    members: group.members.map((member) => {
      const override = memberOverrides.value[member.id];
      if (!override) return member;
      return {
        ...member,
        name: override.name || member.name,
        title: override.title || member.title,
        desc: override.desc || member.desc,
        updatedMeta: `最近更新：${formatUpdateTime(override.updatedAt)} · UID:${override.updatedByUid}`,
      };
    }),
  }));
});

const currentBoundMember = computed<MemberItem | null>(() => {
  if (!currentBoundMemberId.value) return null;
  for (const group of memberGroups.value) {
    const foundMember = group.members.find((member) => member.id === currentBoundMemberId.value);
    if (foundMember) return foundMember;
  }
  return null;
});

const persistBindings = (): void => {
  if (!isClient) return;
  window.localStorage.setItem(MEMBER_BINDINGS_STORAGE_KEY, JSON.stringify(memberBindings.value));
};

const persistOverrides = (): void => {
  if (!isClient) return;
  window.localStorage.setItem(MEMBER_OVERRIDES_STORAGE_KEY, JSON.stringify(memberOverrides.value));
  window.dispatchEvent(new CustomEvent("zhize-member-overrides-changed"));
};

const loadBindingsFromStorage = (): Record<string, string> => {
  if (!isClient) return {};
  const cachedValue = window.localStorage.getItem(MEMBER_BINDINGS_STORAGE_KEY);
  if (!cachedValue) return {};
  try {
    const parsedValue = JSON.parse(cachedValue) as Record<string, unknown>;
    const result: Record<string, string> = {};
    Object.entries(parsedValue).forEach(([uid, memberId]) => {
      if (typeof memberId === "string" && memberId.trim()) {
        result[uid] = memberId.trim();
      }
    });
    return result;
  } catch {
    return {};
  }
};

const loadOverridesFromStorage = (): Record<string, MemberOverride> => {
  if (!isClient) return {};
  const cachedValue = window.localStorage.getItem(MEMBER_OVERRIDES_STORAGE_KEY);
  if (!cachedValue) return {};
  try {
    const parsedValue = JSON.parse(cachedValue) as Record<string, unknown>;
    const result: Record<string, MemberOverride> = {};
    Object.entries(parsedValue).forEach(([memberId, overrideValue]) => {
      if (!overrideValue || typeof overrideValue !== "object") return;
      const source = overrideValue as Partial<MemberOverride>;
      if (typeof source.updatedByUid !== "number" || typeof source.updatedAt !== "string") return;
      result[memberId] = {
        name: typeof source.name === "string" ? normalizeText(source.name, 40) : "",
        title: typeof source.title === "string" ? normalizeText(source.title, 56) : "",
        desc: typeof source.desc === "string" ? normalizeText(source.desc, 140) : "",
        markdownContent:
          typeof source.markdownContent === "string" ? normalizeMarkdownContent(source.markdownContent) : "",
        sourceFile: typeof source.sourceFile === "string" ? normalizeText(source.sourceFile, 60) : "unknown.md",
        updatedByUid: source.updatedByUid,
        updatedAt: source.updatedAt,
      };
    });
    return result;
  } catch {
    return {};
  }
};

const requestUpload = (memberId: string): void => {
  if (!loggedIn.value || !currentUid.value) {
    editorStatusText.value = "请先登录后再上传成员资料。";
    return;
  }

  if (!canUploadForMember(memberId)) {
    if (isBoundByOtherUser(memberId)) {
      editorStatusText.value = "该成员已绑定其他账号，无法上传。";
      return;
    }
    editorStatusText.value = "当前账号已绑定其他成员，无法重复绑定。";
    return;
  }

  if (!currentBoundMemberId.value) {
    const ownerUid = findOwnerUid(memberId);
    if (ownerUid && ownerUid !== currentUid.value) {
      editorStatusText.value = "该成员已绑定其他账号，无法绑定。";
      return;
    }
    memberBindings.value[currentUid.value] = memberId;
    persistBindings();
    editorStatusText.value = `已绑定 ${getMemberLabel(memberId)}，请选择要上传的 MD 文件。`;
  } else {
    editorStatusText.value = `正在更新 ${getMemberLabel(memberId)}，请选择 MD 文件。`;
  }

  uploadTargetMemberId.value = memberId;
  if (mdUploadInputRef.value) {
    mdUploadInputRef.value.value = "";
    mdUploadInputRef.value.click();
  }
};

const clearMyOverride = (): void => {
  if (!loggedIn.value || !currentUid.value || !currentBoundMemberId.value) {
    editorStatusText.value = "当前账号未绑定成员，无法清空。";
    return;
  }

  const boundMemberId = currentBoundMemberId.value;
  if (!memberOverrides.value[boundMemberId]) {
    editorStatusText.value = `当前 ${getMemberLabel(boundMemberId)} 还没有上传记录。`;
    return;
  }

  delete memberOverrides.value[boundMemberId];
  persistOverrides();
  editorStatusText.value = `已清空 ${getMemberLabel(boundMemberId)} 的上传资料。可重新上传 MD。`;
};

const handleMdUpload = async (event: Event): Promise<void> => {
  const inputElement = event.target as HTMLInputElement;
  const selectedFile = inputElement.files?.[0];
  if (!selectedFile) return;

  const memberId = uploadTargetMemberId.value;
  if (!memberId) {
    editorStatusText.value = "未识别目标成员，请重新点击上传按钮。";
    inputElement.value = "";
    return;
  }

  if (!loggedIn.value || !currentUid.value) {
    editorStatusText.value = "登录状态失效，请重新登录。";
    inputElement.value = "";
    return;
  }

  const isMarkdownFile = /\.md$/i.test(selectedFile.name) || /markdown|text/i.test(selectedFile.type);
  if (!isMarkdownFile) {
    editorStatusText.value = "仅支持上传 .md 文件。";
    inputElement.value = "";
    return;
  }

  try {
    const fileText = await selectedFile.text();
    const markdownContent = normalizeMarkdownContent(removeFrontmatter(fileText));
    const parsedOverride = parseMarkdownToOverride(fileText);
    if (!parsedOverride.name && !parsedOverride.title && !parsedOverride.desc && !markdownContent) {
      editorStatusText.value = "未从 MD 中提取到有效成员信息，请检查文件内容。";
      inputElement.value = "";
      return;
    }

    memberOverrides.value[memberId] = {
      ...memberOverrides.value[memberId],
      ...parsedOverride,
      markdownContent,
      updatedByUid: Number(currentUid.value),
      updatedAt: new Date().toISOString(),
      sourceFile: selectedFile.name,
    };
    persistOverrides();
    editorStatusText.value = `已更新 ${getMemberLabel(memberId)}，来源文件：${selectedFile.name}`;
  } catch (error) {
    editorStatusText.value = error instanceof Error ? error.message : "MD 解析失败，请重试。";
  } finally {
    uploadTargetMemberId.value = "";
    inputElement.value = "";
  }
};

onMounted(async () => {
  if (isClient) {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat === "major" || cat === "grade") {
      category.value = cat;
    }
  }

  await initAuthSession();
  memberBindings.value = loadBindingsFromStorage();
  memberOverrides.value = loadOverridesFromStorage();
});
</script>

<style scoped>
.team-filter-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.team-toggle-btn {
  padding: 6px 12px;
  background-color: var(--c-brand, #3eaf7c);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.team-toggle-btn:hover {
  background-color: var(--c-brand-light, #4abf8a);
}

.team-role-tabs-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-role-tabs-vertical a {
  display: block;
  padding: 8px 12px;
  background: var(--c-bg-light, #f8f9fa);
  text-decoration: none;
  color: var(--c-text, #2c3e50);
  border-radius: 6px;
  transition: all 0.2s;
}

.team-role-tabs-vertical a:hover {
  background: var(--c-brand, #3eaf7c);
  color: white;
}

.team-member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-member-tag {
  font-size: 13px;
  color: var(--c-text-light, #666);
  background: var(--c-bg-light, #f0f0f0);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: normal;
  vertical-align: middle;
}
</style>
