
```markdown
你是资深B2B后台UI/UX设计师 + 了解前端组件体系的产品设计顾问。请基于我提供的“目标UI布局方案”输出一份可直接交付给前端实现的UI改版规格说明。技术栈限定：Next.js + React + shadcn/ui + tailwindcss + lucide-react。重点：优化布局与交互语义，不写任何业务代码或API代码，但要明确建议使用哪些现成shadcn组件与lucide图标。

【现状痛点】
- 列表每行默认Input，编辑语义不清（不知道何时保存）
- 页面密度低，空白多，可视范围能管理的tag少
- 每行一个大红Delete造成视觉噪音且误删风险高
- 新增与管理割裂，操作不收敛
- 缺少搜索、空态、loading、错误提示等状态设计

【目标UI布局方案（必须严格按此方案输出）】
1) 单一主Card承载全部内容（不要分成“Add”和“Manage”两张大卡）
2) Card顶部：左侧标题“Tags”，右侧显示总数（可选）
3) 工具条（同一行收敛操作）：
   - 左侧：Search输入框（带Search图标）
   - 右侧：Add tag（输入框 + Add按钮同一行，支持Enter提交）
4) 列表区域：固定高度 + ScrollArea可滚动（避免页面无限长）
5) 列表行默认是“阅读态文本”不是Input：
   - 左侧显示tag名称（可选用Badge但仍以行列表为主）
   - 右侧动作用 MoreHorizontal（DropdownMenu）或一组ghost icon按钮收纳 Edit/Delete
6) 行内编辑：点击Edit进入“编辑态”
   - 文本替换为Input
   - 右侧出现 Save(Check) 与 Cancel(X)
   - 保存成功toast，失败保留编辑态并显示行内错误
7) 删除：不使用每行大红按钮
   - 使用Trash2 icon按钮（ghost）或在菜单里
   - 必须AlertDialog二次确认
   - destructive样式只用于确认按钮
8) 移动端：工具条分两行（Search一行，Add一行），每行动作用“···”收纳

【输出要求】
请按下面结构输出（必须按序号与标题输出）：
1. 页面结构信息架构（Desktop / Mobile各一份）
   - 用“层级树”描述（例如：Page > Card > Header > Toolbar > List）
2. 组件映射表（仅列组件名与用途）
   - shadcn/ui：Card, Input, Button, ScrollArea, DropdownMenu, AlertDialog, Separator, Tooltip, Toast/Sonner 等
   - lucide-react：Plus, Search, Pencil, Trash2, Check, X, MoreHorizontal
3. 关键交互规格（新增 / 行内编辑 / 删除确认）
   - 每个流程写：触发方式、键盘行为、成功/失败反馈、何处显示校验提示
4. 状态设计
   - Empty（无tag）、Loading、Error（新增/编辑/删除失败）各如何呈现
5. 视觉与排版规范（用tailwind语义描述，不写具体class代码）
   - 最大内容宽度建议、间距层级、行高、按钮样式规则（ghost/destructive使用边界）
6. 文案建议（中文）
   - 删除确认标题与描述、错误提示、空态提示

【硬性限制】
- 不输出任何JS/TS/React代码
- 不改变以上“目标UI布局方案”的骨架
- 不出现多余的设计哲学解释，直接给可落地规格

现在开始输出。
```