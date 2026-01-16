---
tags:
id: 20251230180316
created: 2025-12-30 18:03:16
status:
  - pending
  - done
  - in_progress
type: fleet-note
aliases:
  - "cola-state-machine"
---
COLA 的 `cola-component-statemachine` 是一个**纯 Java、代码式 DSL 的“状态迁移引擎”**，适合你这种“收到领域事件 → 执行业务逻辑 → 再发布事件”的编排场景，但它**不会帮你做事件监听/消息投递/持久化**，这些要你自己接到 Spring 事件或 MQ（inbox/outbox）上。

## 1) COLA 状态机怎么实现的

核心点就三件事：

* **先 build 一张图**：用 `StateMachineBuilderFactory.create()` 通过 fluent DSL 定义 `from/to/on/when/perform` 的迁移规则。
* **运行时无状态**：引擎不保存“当前状态”，你必须把“当前状态”放在你的业务对象或 Saga/流程实例表里。
* **触发就是一个函数**：`fireEvent(sourceState, event, ctx)` 根据 `(当前状态 + 事件)` 找到 transition，条件 `Condition` 通过后执行 `Action.execute(from,to,event,ctx)`，返回目标状态。

它还有并行版本 `fireParallelEvent`（同一事件命中多个迁移）。

## 2) Spring Boot 3.2.4 能不能用

能用。COLA v5 明确支持 JDK17 和 Spring Boot 3.x。
依赖一般直接加：

```xml
<dependency>
  <groupId>com.alibaba.cola</groupId>
  <artifactId>cola-component-statemachine</artifactId>
  <version>5.0.0</version>
</dependency>
```

注意许可证是 **LGPL-2.1**，如果你们对 LGPL 有合规要求，先过法务或改用其他实现。

## 3) 你要的“监听领域事件→处理→再发事件”，推荐怎么接

把它当成 **Process Manager / Saga（应用层编排器）**：

* **输入**：领域事件（或 MQ 的集成事件，经 inbox 幂等后进入应用层）
* **映射**：把“领域事件”映射成“状态机 event”（不要求 1:1）
* **推进**：加载流程实例（含 currentState）→ `fireEvent` 得到 nextState → 持久化实例
* **输出**：产生新的命令/领域操作，并把要对外发的事件写 outbox

> 结论：状态机不是“自动监听器”。它是你在事件处理器里调用的“决策与迁移函数”。

### 最小代码骨架（贴近 COLA API）

```java
// 1) 状态 + 事件
enum FlowState { INIT, WAIT_PAY, PAID, CLOSED }
enum FlowEvent { ORDER_CREATED, PAID, CANCELLED }

// 2) 上下文：装载领域事件数据、业务ID、幂等信息等
record FlowCtx(Long orderId, Object domainEvent) {}

// 3) 定义状态机（通常在 @Configuration 初始化一次）
@Configuration
class FlowStateMachineConfig {
  static final String MACHINE_ID = "orderFlow";

  @Bean
  StateMachine<FlowState, FlowEvent, FlowCtx> orderFlowSM(FlowActions actions) {
    var b = StateMachineBuilderFactory.<FlowState, FlowEvent, FlowCtx>create();

    b.externalTransition()
      .from(FlowState.INIT).to(FlowState.WAIT_PAY)
      .on(FlowEvent.ORDER_CREATED)
      .perform(actions::onOrderCreated);

    b.externalTransition()
      .from(FlowState.WAIT_PAY).to(FlowState.PAID)
      .on(FlowEvent.PAID)
      .perform(actions::onPaid);

    b.externalTransition()
      .from(FlowState.WAIT_PAY).to(FlowState.CLOSED)
      .on(FlowEvent.CANCELLED)
      .perform(actions::onCancelled);

    return b.build(MACHINE_ID);
  }
}

@Component
class FlowActions {
  // Action 签名：execute(from, to, event, ctx)
  public void onPaid(FlowState from, FlowState to, FlowEvent event, FlowCtx ctx) {
    // 这里写“编排步骤”本身，或调用应用服务做业务操作/写 outbox
  }
}
```

### 事件处理器里“推进流程 + 持久化 + outbox”（关键）

```java
@Service
class FlowProcessManager {

  private final StateMachine<FlowState, FlowEvent, FlowCtx> sm;
  private final FlowInstanceRepository repo; // 你的 JPA 仓储
  private final OutboxService outbox;

  @Transactional
  public void onDomainEvent(Object domainEvent) {
    Long orderId = extractOrderId(domainEvent);
    FlowEvent e = mapToFlowEvent(domainEvent);

    FlowInstance inst = repo.findByOrderId(orderId)
      .orElseGet(() -> FlowInstance.newOne(orderId, FlowState.INIT));

    FlowState next = sm.fireEvent(inst.getState(), e, new FlowCtx(orderId, domainEvent));

    if (next != inst.getState()) {
      inst.setState(next);
      repo.save(inst);

      outbox.enqueue(new FlowAdvancedIntegrationEvent(orderId, next));
    }
  }
}
```

## 4) 领域事件 vs 状态机事件，关系是什么

* **领域事件（Domain Event）**：领域事实，“某事发生了”（不可变，过去式）。
* **状态机事件（Flow/SM Event）**：驱动迁移的输入信号，可能来自领域事件、超时、人工操作、外部回调。

常见关系：

* 领域事件 **触发** process manager
* process manager **映射** 为一个或多个状态机事件
* 状态机迁移后，process manager **决定**后续动作并发布新的事件（领域事件或集成事件）

所以你说的“状态机监听各种领域事件触发操作”，更准确的说法是：
**process manager 监听/消费领域事件，然后调用状态机推进流程。**

## 5) 事务注意点（你很可能会踩）

COLA 的 `Action` 常被用 lambda/new 出来，这样**不走 Spring 代理**，`@Transactional` 可能不生效；通常做法是：让 `Action` 调用一个 Spring 管理的应用服务来完成需要事务的工作。社区也有类似事务不生效的踩坑讨论。

---

如果你告诉我：你的“领域事件”来源是 **Spring 本地发布** 还是 **MQ + inbox**，以及你想持久化的是“业务实体状态”还是“流程实例状态（Saga）”，我可以把上面的骨架改成你当前 DDD 分层里的落点（app 层 handler / process manager / infra 持久化 / outbox）。


# References