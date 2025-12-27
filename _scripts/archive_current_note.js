// scripts/archive-current-note.js
module.exports = async (params) => {
  const { app } = params;

  const file = app.workspace.getActiveFile();
  if (!file) return;

  // Obsidian 的 Date & time 存储格式示例是 2020-08-21T10:30:00 :contentReference[oaicite:4]{index=4}
  // 在插件里官方建议 import { moment } from 'obsidian'，避免引入第二份 moment :contentReference[oaicite:5]{index=5}
  // QuickAdd 脚本环境通常可直接用全局 moment()
  const now = moment().format("YYYY-MM-DDTHH:mm:ss");

  const toTagArray = (v) => {
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === "string") {
      return v
        .split(/[,，]\s*|\s+/)
        .map(s => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  await app.fileManager.processFrontMatter(file, (fm) => {
    // 1) archived_at
    fm.archived_at = now;

    // 2) tags += archived（tags 是专用 Tags 属性，格式是 list）:contentReference[oaicite:6]{index=6}
    const tags = toTagArray(fm.tags)
      .map(t => String(t).replace(/^#/, "")) // frontmatter tags 按文档示例不带 #
      .filter(Boolean);

    if (!tags.includes("archived")) tags.push("archived");
    fm.tags = tags;
  });
};

