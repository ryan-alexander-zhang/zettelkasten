---
tags:
  - mermaid
  - cheat-sheet
id: 20251225223854
created: 2025-12-25 22:38:54
reviewed: false
status:
  - pending
  - done
  - in_progress
type: fleet-note
aliases:
  - mermaid-uml-cheat-sheet
---

```mermaid
classDiagram

class Service {
	<<interface>>
	+run() void
}

class ServiceImpl {
	+run() void
}

class Parent {
	+hi() void
}

class Son {
	+hi(girfriend: Girl) void
}

class Girl {
	-name String
	+legs Leg
}

class Leg {
	-length Int
}

ServiceImpl ..|> Service : implement
Son --|> Parent : extend
Son ..> Girl
Girl *-- "1..*" Leg
```

聚合关系: `o--`

记忆口诀：
* 菱形是拥有者
* 空心聚合 `o--`
* 实心组合 `*--`
* 点是实现 `..|>`
* 线是继承 `--|>`
# References