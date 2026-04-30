/**
 * 扫描 teachers/*.md 的 frontmatter，自动生成 src/.vuepress/data/teachers.ts
 * 用法: node scripts/sync-teachers.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const teachersDir = path.resolve(__dirname, "../src/teachers");
const outputFile = path.resolve(__dirname, "../src/.vuepress/data/teachers.ts");

// 解析 frontmatter，提取 key-value 和数组
function parseFm(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return {};

  const fm = {};
  const lines = m[1].split(/\r?\n/);
  let currentKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // 数组元素：行首是 "- "（允许缩进）
    if (/^\s*-\s/.test(line)) {
      const val = trimmed.replace(/^-\s*/, "").replace(/^["']|["']$/g, "");
      if (currentKey) {
        if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
        fm[currentKey].push(val);
      }
      continue;
    }

    // key: value
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      let val = kv[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      if (val === "" || val === "|" || val === ">") {
        // 值在下面行（数组或多行字符串）
        fm[key] = [];
        currentKey = key;
      } else {
        fm[key] = val;
        currentKey = null;
      }
    }
  }
  return fm;
}

const files = fs.readdirSync(teachersDir).filter((f) => f.endsWith(".md")).sort();

const teachers = files.map((file) => {
  const content = fs.readFileSync(path.join(teachersDir, file), "utf-8");
  const fm = parseFm(content);

  return {
    order: Number(fm.order) || 999,
    id: String(fm.id || file.replace(".md", "")),
    name: String(fm.name || ""),
    title: String(fm.rank || ""),
    role: String(fm.role || ""),
    avatar: String(fm.avatar || ""),
    shortBio: String(fm.shortBio || ""),
    researchAreas: Array.isArray(fm.researchAreas) ? fm.researchAreas : [],
    link: String(fm.link || ""),
  };
});

// 按 frontmatter 中的 order 字段排序（数值越小越靠前）
teachers.sort((a, b) => a.order - b.order);

// 排序后去掉 order 字段，不输出到 teachers.ts
const output = teachers.map(({ order, ...rest }) => rest);

const json = JSON.stringify(output, null, 2);

const tsContent = `/**
 * 教师完整信息接口（用于详情页 TeacherProfile 组件）
 */
export interface Teacher {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
  photo: string;
  shortBio: string;
  researchAreas: string[];
  email: string;
  office: string;
  education: string[];
  bio: string;
  achievements: string[];
  courses: string[];
  publications?: string[];
  projects?: string[];
  awards?: string[];
  students?: string;
  link: string;
}

/**
 * 卡片墙用的轻量信息
 * ⚠️ 本文件由 scripts/sync-teachers.js 自动生成，请勿手动修改
 *    改图片/信息请直接编辑 src/teachers/*.md 的 frontmatter，然后运行同步脚本
 */
export interface TeacherCard {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
  shortBio: string;
  researchAreas: string[];
  link: string;
}

export const allTeachers: TeacherCard[] = ${json};
`;

fs.writeFileSync(outputFile, tsContent, "utf-8");
console.log(`✓ 已同步 ${teachers.length} 位教师数据到 teachers.ts`);
