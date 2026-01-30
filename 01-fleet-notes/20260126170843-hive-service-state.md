---
tags:
id: 20260126170851
created: 2026-01-26 17:08:51
status:
  - pending
  - done
  - in_progress
type: fleet-note
aliases:
  - "hive-service-state"
---
**Service 状态机（代码即真相）**
- 状态集合来自 ServiceStatus. Java：`CREATING / UPDATING / READY / FAILED / DELETING / DELETED`
- 核心状态迁移都在聚合根 Service. Java：
  - 创建：`(none) → CREATING`
    - 触发：`CreateServiceCommandHandler`
    - 聚合动作：`Service.create(...)`
    - 发出事件：`service.creation.requested`、`service.spec.accepted`、`service.spec.apply.started`
  - 更新：`READY/FAILED → UPDATING`
    - 触发：`UpdateServiceCommandHandler`
    - 聚合动作：`service.update(...)`（仅允许 READY/FAILED，否则抛 DomainException）
    - 发出事件：`service.update.requested`、`service.spec.accepted`、`service.spec.apply.started`
  - 删除：`READY/FAILED → DELETING`
    - 触发：`DeleteServiceCommandHandler`
    - 聚合动作：`service.markDeleting(...)`（仅允许 READY/FAILED）
    - 发出事件：`service.deletion.requested`、`service.deletion.marked`
  - 收敛成功：`CREATING/UPDATING → READY`
    - 触发：定时观测产出的 `KnativeServiceObserved(ready=true 且 hashMatch=true)` 被消费
    - 聚合动作：`service.confirmConverged(...)`
    - 发出事件：`service.snapshot.updated`、`service.convergence.confirmed`、`service.ready`
  - 收敛失败：`CREATING/UPDATING → FAILED`
    - 触发：定时观测产出的 `KnativeServiceObserved(ready=false 且 hashMatch=true)` 被消费
    - 聚合动作：`service.confirmFailed(...)`
    - 发出事件：`service.snapshot.updated`、`service.convergence.failed`、`service.failed`
    - 备注：当前失败阈值在 KnativeServiceObservedEventHandler. Java 写死 `FAILURE_THRESHOLD = 1`，因此一次 `ready=false`（且 hashMatch）就会进入 FAILED
  - 刷新快照（不改状态）：`任意状态（常见 READY/UPDATING/DELETING） → 原状态`
    - 触发：定时观测 `KnativeServiceObserved(...)` 但不满足“确认收敛/确认失败”分支，或手动刷新命令
    - 聚合动作：`service.refreshSnapshot(...)`
    - 发出事件：`service.snapshot.updated`
  - 删除确认：`DELETING → DELETED`
    - 触发：定时观测发现集群侧“不存在”并发出 `KnativeServiceDeletedObserved` 被消费
    - 聚合动作：`service.confirmDeleted(...)`
    - 发出事件：`service.snapshot.updated`、`service.deleted`

**每个事件的含义（按 outbox 注册表）**
事件类型注册集中在 OutboxEventTypesConfig. Java，下面是当前代码能落地的语义与副作用（“TODO”表示 handler 目前空实现）：

- `service.creation.requested`（ServiceCreationRequested）：聚合创建时发出；当前消费侧 TODO（见 ServiceCreationRequestedEventHandler. Java）
- `service.spec.accepted`（ServiceSpecAccepted）：表示本次 desiredSpecHash 的规格被接受（包含 forceReplace/wait 参数）；当前消费侧 TODO（见 ServiceSpecAcceptedEventHandler. Java）
- `service.spec.apply.started`（ServiceSpecApplyStarted）：编排信号：开始向 Knative apply；被 ServiceSpecApplyStartedEventHandler. Java 消费并调用 `ServingGateway.applyService(...)`
- `service.update.requested`（ServiceUpdateRequested）：更新请求信号；当前消费侧 TODO（见 ServiceUpdateRequestedEventHandler. Java）
- `service.updated`（ServiceUpdated）：更新完成/确认（当前聚合并不会 emit 这个事件；注册了类型与 handler，但 handler 为 TODO，见 ServiceUpdatedEventHandler. Java）
- `service.deletion.requested`（ServiceDeletionRequested）：删除请求信号；当前消费侧 TODO（见 ServiceDeletionRequestedEventHandler. Java）
- `service.deletion.marked`（ServiceDeletionMarked）：编排信号：开始向 Knative delete；被 ServiceDeletionMarkedEventHandler. Java 消费并调用 `ServingGateway.deleteService(...)`
- `service.snapshot.updated`（ServiceSnapshotUpdated）：把最新观测信息写回 read model；被 ServiceSnapshotUpdatedEventHandler. Java 消费并 upsert `ServiceStatusView`
- `service.convergence.confirmed`（ServiceConvergenceConfirmed）：确认 desiredSpecHash 已收敛（READY）；当前消费侧 TODO（见 ServiceConvergenceConfirmedEventHandler. Java）
- `service.convergence.failed`（ServiceConvergenceFailed）：确认收敛失败（FAILED）；当前消费侧 TODO（见 ServiceConvergenceFailedEventHandler. Java）
- `service.ready`（ServiceReady）：状态 READY 的对外通知；被 ServiceReadyEventHandler. Java 消费并写 read model
- `service.failed`（ServiceFailed）：状态 FAILED 的对外通知；被 ServiceFailedEventHandler. Java 消费并写 read model
- `service.deleted`（ServiceDeleted）：状态 DELETED 的对外通知；被 ServiceDeletedEventHandler. Java 消费并写 read model
- `service.spec.applied`（ServiceSpecApplied）：表示 apply 行为已发生（当前 handler TODO，见 ServiceSpecAppliedEventHandler. Java）
- `RevisionCreated`（RevisionCreated）：写 revision read model；见 RevisionCreatedEventHandler. Java
- `RouteAligned`（RouteAligned）：写 route read model；见 RouteAlignedEventHandler. Java
- `service.external.purged`、`service.persisted`、`service.creation.failed`、`service.audit.recorded`、`NamespaceValidated`：均已注册类型，但当前消费侧多为 TODO（可从 ServiceWiringConfig. Java 看到已注入对应 handler）

**流转过程（含定时任务）**
- 命令链路（写模型入口）
  - Create： CreateServiceCommandHandler. Java
  - Update： UpdateServiceCommandHandler. Java
  - Delete： DeleteServiceCommandHandler. Java
  - 共同模式：`serviceRepository.save(aggregate)` 后，把 `service.pullEvents()` 逐个 `append(EventEnvelope)` 到 outbox
- 定时任务 1：Outbox 发布轮询（把 DB outbox 推到消息总线）
  - 入口： OutboxPublisherJob. Java
  - 频率：`${outbox.publisher.fixedDelayMs:2000}`，每 ~2s 取一批发布
  - 重试/退避：在 `OutboxPublishService` 内（指数退避，最多 10 次，最终 DEAD；你之前看到的实现片段就在 infra/common/outbox 目录下）
- 消息消费（Inbox 幂等 + handler 分发）
  - Kafka 模式 listener： KafkaDomainEventListener. Java
  - Spring 进程内 listener： SpringDomainEventListener. Java
  - 幂等分发：`InboxEventDispatcher`（同一 `eventId` + 不同 handler 会形成不同 consumerKey，确保“同消息多处理器”不互相抢幂等）
- 定时任务 2：Service 观测轮询（驱动 READY/FAILED/DELETED 等“最终状态”）
  - 入口： ServiceObservationScheduler. Java
  - 频率：`${hive.service.observation.interval-ms:60000}`（默认 60s）
  - 行为：
    - 扫描所有非 DELETED 服务
    - 对“稳定 READY 且短期内刚观测过、并且 hasMissing=false”的服务跳过（`ready-stale-duration` 默认 15m）
    - 调用 `ServingGateway.observeService(...)` 得到证据
    - 若“有意义变化”才写 outbox：`KnativeServiceObserved`
    - 若服务处于 DELETING 且观测到 “Service not found in cluster”，额外写 outbox：`KnativeServiceDeletedObserved`
  - 观测事件如何落到状态：
    - `KnativeServiceObserved` → KnativeServiceObservedEventHandler. Java → 调用 `confirmConverged/confirmFailed/refreshSnapshot` → 再把聚合新产生的领域事件写回 outbox
    - `KnativeServiceDeletedObserved` → KnativeServiceDeletedObservedEventHandler. Java → 调用 `confirmDeleted` → 发 `service.deleted`


# References