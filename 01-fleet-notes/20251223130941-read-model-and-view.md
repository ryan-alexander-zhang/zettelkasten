---
tags:
  - ddd
id: 20251223131003
created: 2025-12-23 13:10:03
reviewed: false
status:
  - pending
  - done
  - in_progress
type: fleet-note
aliases:
  - read-model-and-view
---

CQRS 的 Query 有两种范式：

* `ReadModel` + `XXXReadRepository`  （写侧用 `Projector` 进行更新）
	* 有投影表，写入主表后异步更新到读表，读操作读这张表
	* 同步到 cache、es 等用于查询
* `View` + `XXXQueries` 
	* 纯读，没有对应的模型实体

# References