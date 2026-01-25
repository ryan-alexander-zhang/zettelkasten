---
tags:
  - git
  - ai-coding
id: 20260125095408
created: 2026-01-25 09:54:08
status:
  - done
type: fleet-note
aliases:
  - ai-coding-git-workflow
---

使用多个 Git Worktree 进行管理

* `copilot/<feature-name>` 用于 AI 编写代码
* `localtest/<feature-name>` 用于本地测试
* `feature/<feature-name>` PR 的分支

流程：
Copilot 分支 Merge 到 localtest 后 Merge 到对应的 feature 分支


# References