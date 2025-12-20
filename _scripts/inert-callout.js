module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const editor = app.workspace.activeLeaf?.view?.editor;
  if (!editor) throw new Error("No active editor");

  // 固定文本库：严格按你给的格式
  const blocks = {
    note: `> [!NOTE] Title\n> Contents`,
    info: `> [!info]\n> Lorem ipsum dolor sit amet`,
    abstract: `> [!abstract]\n> Lorem ipsum dolor sit amet`,
    todo: `> [!todo]\n> Lorem ipsum dolor sit amet`,
    success: `> [!success]\n> Lorem ipsum dolor sit amet`,
    question: `> [!question]\n> Lorem ipsum dolor sit amet`,
    warning: `> [!warning]\n> Lorem ipsum dolor sit amet`,
    failure: `> [!failure]\n> Lorem ipsum dolor sit amet`,
    danger: `> [!danger]\n> Lorem ipsum dolor sit amet`,
    bug: `> [!bug]\n> Lorem ipsum dolor sit amet`,
    example: `> [!example]\n> Lorem ipsum dolor sit amet`,
    quote: `> [!quote]\n> Lorem ipsum dolor sit amet`,
  };

  const options = Object.keys(blocks); // note/info/abstract/...

  const { type } = await quickAddApi.requestInputs([
    { id: "type", label: "Callout type", type: "dropdown", options },
  ]);

  const block = blocks[type];
  if (!block) return;

  // 插入到“当前行的下一行”：移动到当前行末尾，再插入 \n + block
  const cur = editor.getCursor();
  const lineText = editor.getLine(cur.line) ?? "";
  const endPos = { line: cur.line, ch: lineText.length };

  const insertion = `\n${block}\n`;

  // 优先用 replaceRange，不行就退化到 replaceSelection
  if (typeof editor.replaceRange === "function") {
    editor.replaceRange(insertion, endPos);
  } else {
    editor.setCursor(endPos);
    editor.replaceSelection(insertion);
  }
};

