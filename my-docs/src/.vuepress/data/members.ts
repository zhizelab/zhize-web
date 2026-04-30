export interface MemberItem {
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

const mdFiles = import.meta.glob<string>('../../demo/team/*.md', { eager: true, query: '?raw', import: 'default' });

export const allMembers: MemberItem[] = Object.keys(mdFiles).reduce((acc: MemberItem[], path) => {
    if (path.endsWith('README.md') || path.endsWith('index.md')) return acc;

    const rawContent = mdFiles[path];
    const fm: Record<string, string> = {};

    if (typeof rawContent === 'string' && rawContent.startsWith('---')) {
        const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (match) {
            match[1].split(/\r?\n/).forEach(line => {
                const sepIndex = line.indexOf(':');
                if (sepIndex > 0) {
                    const key = line.slice(0, sepIndex).trim();
                    const value = line.slice(sepIndex + 1).trim();
                    fm[key] = value.replace(/^['"]|['"]$/g, '');
                }
            });
        }
    }

    const fileName = path.split('/').pop() || '';
    const id = fileName.replace('.md', '');

    acc.push({
        id: id,
        name: fm.name || id,
        title: fm.title || "信息待更新",
        desc: fm.desc || "个人简介、研究方向与联系方式待补充。",
        badge: fm.badge || "",
        link: `/demo/team/${id}.html`,
        grade: fm.grade || "未知年级",
        major: fm.major || "未知专业"
    });

    return acc;
}, []);