---
id: 20251213162205
created: 2025-12-13 16:22:05
type: sop-note
---
# Writing Learning Objective 
## Step 1: 确定满足 SMART 原则的学习目标

> [!EXAMPLE] 在一个月内搭建一个使用 RAG MCP Agent 的 LLM 编程助手应用

## Step 2: 使用 MECE 拆解出子模块 (mindmap) (remember + understand)

> [!TIP] 不要拆超出 5 个的子结构

> [!EXAMPLE] LLM Application
> * 模型与推理策略
> * 提示词与编排
> * RAG 检索增强
> * 工具与 Agent

## Step 3: 对每个模块制定 KR (okr.md)

* O 满足 SMART
* KR 满足 Bloom's Taxonomy
> [!TIP] 优先 Apply 级别，项目驱动学习

## Step 4: 执行并输出 (GTD + Zettelkasten )

> [!TIP] 卡片盒笔记法记录并产生输出

## Step 5: 复盘


# Flow

```mermaid
graph TD
  A([开始：制定学习目标 SO]) --> B["Step 1<br/>确定学习目标<br/>满足 SMART"]
  B --> C{"SMART 检查通过？<br/>S M A R T"}
  C -- "否" --> B1["调整目标约束<br/>时间范围 里程碑 指标"] --> B
  C -- "是" --> D["Step 2<br/>MECE 拆解子模块<br/>Remember 与 Understand"]
  D --> E{"子模块数量不超过 5？"}
  E -- "否" --> D1["合并或提升抽象层级<br/>保证互斥且完全穷尽"] --> D
  E -- "是" --> F["Step 3<br/>为每个模块制定 OKR<br/>O: SMART<br/>KR: Bloom 优先 Apply<br/>写入 okr.md"]
  F --> G{"KR 可验证？<br/>可交付 可测试 可复现"}
  G -- "否" --> F1["重写 KR<br/>动词 对象 标准 证据"] --> F
  G -- "是" --> H["Step 4<br/>执行并输出<br/>GTD 执行流<br/>Zettelkasten 记录"]
  H --> I{"达到 KR 证据？<br/>Demo 代码 笔记 报告"}
  I -- "否" --> H1["补齐行动项<br/>收集 整理 执行 回顾<br/>迭代学习与输出"] --> H
  I -- "是" --> J["Step 5<br/>复盘<br/>对照 SMART 与 OKR<br/>记录改进点"]
  J --> K([结束：沉淀下一轮 SO 模板])

```
# References
* [[okr]]
* [[bloom's-taxonomy]]
* [[smart]]
