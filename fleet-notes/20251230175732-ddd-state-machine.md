---
tags:
id: 20251230175736
created: 2025-12-30 17:57:36
status:
  - pending
  - done
  - in_progress
type: fleet-note
aliases:
  - "ddd-state-machine"
---
可以是。但不是唯一用法。

## 常见两种用法

### 1) 状态机作为 process manager 或 saga

是的。它通常**订阅领域事件**，把它们当作输入，推进长流程。

例子链路：

* 领域事件 `OrderPaid` 到达（inbox 幂等）
* process manager 找到该订单的 saga 实例
* 映射成状态机事件 `PAY_CONFIRMED`
* 状态迁移 `WAIT_PAY -> WAIT_STOCK`
* 发出命令 `ReserveStock`（写 outbox）
* 下游处理后产生 `StockReserved`，再推进下一步

这种用法适合跨服务，异步，分支，补偿。

### 2) 状态机作为聚合内部的规则引擎

不监听领域事件。它直接被**命令**驱动。

例子链路：

* 命令 `PayOrder`
* 应用服务加载聚合
* 聚合调用状态机校验并迁移
* 产生领域事件 `OrderPaid`

这种用法适合同一聚合内同步状态流转。

## 推荐的关系

* **领域事件**是“事实”。更适合当作 process manager 的输入。
* **命令**是“意图”。更适合驱动聚合内状态变化。
* 状态机可以两边都接，但要选一个主入口，避免“双驱动”导致重复迁移。

## 落地注意点（你之前提到 inbox/outbox）

* 事件进来先 inbox 去重，再交给 process manager。否则重复事件会导致状态机重复推进。
* 状态机实例状态要可恢复（持久化或能重建），否则重启会丢进度。
* 状态机 action 里发命令或写 outbox，和更新自身状态放同一事务里做。

一句话：状态机经常“监听领域事件”来编排流程，但在 DDD 里它更多是应用层的 process manager，而不是领域模型的必备组件。


# References