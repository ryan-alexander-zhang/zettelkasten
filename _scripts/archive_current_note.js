// scripts/archive-current-note.js
// 功能：
// 1) frontmatter 增加 archived_at = 当前本地时间
// 2) frontmatter.tags 追加 archived（去重）

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatLocalDateTime(d = new Date()) {
  // 格式：YYYY-MM-DD HH:mm:ss（本地时区）
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  const ss = pad2(d.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function normalizeTagsToArray(tagsValue) {
  // 兼容 tags: "a b" / "a, b" / ["a","b"] / "a"
  if (Array.isArray(tagsValue)) return tagsValue.map(String);

  if (typeof tagsValue === "string") {
    return tagsValue
      .split(/[,，]\s*|\s+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  if (tagsValue == null) return [];
  return [String(tagsValue)];
}

module.exports = async (params) => {
  const { app } = params;

  const file = app.workspace.getActiveFile();
  if (!file) {
    if (typeof Notice !== "undefined") new Notice("No active file.");
    return;
  }

  await app.fileManager.processFrontMatter(file, (fm) => {
    // 1) archived_at
    if (!fm.archived_at) {
      fm.archived_at = formatLocalDateTime();
    }

    // 2) tags += archived
    const raw = fm.tags ?? [];
    const tags = normalizeTagsToArray(raw)
      .map(t => t.replace(/^#/, "")) // 统一去掉前导 #
      .filter(Boolean);

    if (!tags.includes("archived")) tags.push("archived");

    // 可选：排序，稳定输出
    tags.sort((a, b) => a.localeCompare(b));

    fm.tags = tags;
  });

  if (typeof Notice !== "undefined") new Notice("Archived: archived_at + tag=archived");
};

