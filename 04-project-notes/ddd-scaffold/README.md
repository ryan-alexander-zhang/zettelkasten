
## domain 模块（纯领域）

`com.yourcompany.yourapp.domain`

* `domain.model`（或按子域拆：`domain.order` / `domain.customer`）

  * `domain.model.<bc>.aggregate`（聚合根）
  * `domain.model.<bc>.entity`
  * `domain.model.<bc>.vo`（值对象）
  * `domain.model.<bc>.enum`（状态枚举）
* `domain.service`（领域服务：纯业务协作）
* `domain.policy`（策略/规格/规则对象，可选）
* `domain.specification`（Specification，可选）
* `domain.event`（领域事件：`OrderPaid` 等）
* `domain.factory`（工厂/创建逻辑，可选）
* `domain.repository`（仓储端口接口：`OrderRepository`）
* `domain.gateway`（外部能力端口接口：`PaymentGateway`/`RiskGateway`）
* `domain.exception`（领域异常：`DomainException`）
* `domain.common`（通用基类：`AggregateRoot`、`Entity`、`DomainEvent`、`Identifier`）

> `<bc>` 建议按 bounded context：`order` / `inventory` / `user`。

---

## app 模块（Use Case / 应用编排）

`com.yourcompany.yourapp.app`

* `app.command`

  * `app.command.<bc>`

    * `app.command.<bc>.dto`（Command 入参 DTO：`CreateOrderCommand`）
    * `app.command.<bc>.handler`（命令处理：`CreateOrderHandler`/`ApplicationService`）
    * `app.command.<bc>.assembler`（DTO ↔ 领域对象映射，可选）
* `app.query`（如果你把 Query 放 app）

  * `app.query.<bc>.dto`（Query/ReadModel DTO）
  * `app.query.<bc>.service`（QueryService 接口/用例）
* `app.port`（可选：应用层端口；若你坚持端口都放 domain，可为空）

  * `app.port.out`（例如 query 端口接口：`OrderReadDao`）
* `app.event`

  * `app.event.publisher`（发布领域事件/集成事件的应用服务接口）
  * `app.event.handler`（应用层事件处理器，可选）
* `app.transaction`（事务边界抽象/模板，可选）
* `app.exception`（用例异常：`UseCaseException`）
* `app.common`（通用：返回包装、分页对象等，不要下沉到 domain）

---

## adapter 模块（入站适配：HTTP/RPC/MQ/Job）

`com.yourcompany.yourapp.adapter`

* `adapter.web`

  * `adapter.web.<bc>.controller`
  * `adapter.web.<bc>.dto`（Request/Response DTO）
  * `adapter.web.<bc>.assembler`（DTO ↔ app/domain）
  * `adapter.web.common`（全局异常处理、鉴权拦截、参数校验）
* `adapter.rpc`（可选：Dubbo/gRPC）

  * `adapter.rpc.<bc>.provider`
  * `adapter.rpc.<bc>.dto`
* `adapter.mq`（可选：消息入站）

  * `adapter.mq.<bc>.consumer`
  * `adapter.mq.<bc>.message`
* `adapter.scheduler`（可选：定时任务入口）

  * `adapter.scheduler.<bc>.job`

> adapter 只负责协议/传输层语义，不做持久化实现。

---

## infra 模块（出站适配：端口实现 + 技术细节）

`com.yourcompany.yourapp.infra`

* `infra.repository`（实现 `domain.repository.*`）

  * `infra.repository.<bc>`

    * `infra.repository.<bc>.po`（持久化对象/DO）
    * `infra.repository.<bc>.mapper`（MyBatis Mapper）/`jpa`（JPA Repo）
    * `infra.repository.<bc>.converter`（PO ↔ Domain）
    * `infra.repository.<bc>.impl`（`OrderRepositoryImpl`）
* `infra.gateway`（实现 `domain.gateway.*`）

  * `infra.gateway.<system>`（如 `payment` / `risk`）

    * `infra.gateway.<system>.client`（HTTP/RPC client）
    * `infra.gateway.<system>.dto`
    * `infra.gateway.<system>.impl`
* `infra.query`（如果 CQRS 读侧实现放 infra）

  * `infra.query.<bc>`

    * `infra.query.<bc>.mapper`（SQL/Projection）
    * `infra.query.<bc>.dto`（ReadModel）
    * `infra.query.<bc>.impl`（实现 `app.query` 或 `app.port.out` 的接口）
* `infra.event`

  * `infra.event.outbox`（Outbox 表、发布器实现）
  * `infra.event.mq`（Kafka/Rabbit 生产者）
* `infra.config`（数据源、序列化、HTTP client、缓存等配置）
* `infra.cache`（Redis 等）
* `infra.lock`（分布式锁，可选）
* `infra.common`（基础设施通用：时间、ID 生成、序列化工具等）

---

## start 模块（装配/启动）

`com.yourcompany.yourapp.start`

* `start.bootstrap`（`Application` main）
* `start.config`

  * `start.config.bean`（装配 domain 端口实现、应用服务）
  * `start.config.scan`（组件扫描边界）
* `start.profile`（环境差异配置，可选）

---

## 推荐的“按业务拆包”方式

上面每个模块都建议按 `<bc>`（业务子域/限界上下文）再分一层，避免横向按技术堆满一个包导致可维护性差。

---

如果你希望我按你的项目名/业务域（例如 order、user、inventory）直接生成一份“可复制粘贴”的完整包树（含每个包应该放哪些类），把业务域列表发我即可。
