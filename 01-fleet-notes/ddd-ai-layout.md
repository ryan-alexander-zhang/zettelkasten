---
tags:
  - ddd
id: 20251219164744
created: 2025-12-19 16:47:44
reviewed: false
status:
  - pending
type: fleet-note
---
# Layout

## DDD + COLA Project Structure (LLM-Friendly)

This layout follows COLA layers: **Start → Adapter → App → Domain → Infra** (Domain is the core).

```text
project-root/
  README.md
  docs/
    architecture/
      ddd-cola-rules.md          # Non-negotiable dependency + layering rules for humans + LLMs
      context-map.md             # Bounded contexts, integrations, upstream/downstream notes
      ubiquitous-language.md     # Canonical terms, enums, wording

  scripts/                       # Dev scripts only (no business logic)

  modules/
    <bounded-context>/           # e.g., tenant, service, billing
      start/                     # Application bootstrap and wiring
        src/...                  # DI config, module assembly, main entry (no business logic)

      adapter/                   # Interface adapters (driving side)
        api/                     # REST/GraphQL controllers, request/response DTOs, validation
        consumer/                # MQ/event consumers, schedulers (input endpoints)
        presenter/               # View models, formatting, mapping for outputs
        src/...

      app/                       # Application layer (use cases)
        command/                 # Command handlers, transactions, orchestration
        query/                   # Query handlers, read models, projections access
        service/                 # Application services (thin orchestration)
        assembler/               # DTO <-> domain conversion (no persistence)
        src/...

      domain/                    # Domain model (pure business)
        model/                   # Aggregates, entities, value objects
        repository/              # Repository interfaces (ports)
        gateway/                 # External service ports (interfaces)
        event/                   # Domain events
        service/                 # Domain services (invariant-heavy logic)
        policy/                  # Domain rules/specifications
        src/...

      infra/                     # Infrastructure (driven side implementations)
        persistence/             # ORM, mappers, repo implementations
        client/                  # HTTP/GRPC/SaaS clients implementing domain gateways
        messaging/               # Producers, outbox, event bus adapters
        config/                  # Infra configuration (datasource, mq, cache)
        src/...

      test/                      # Context-level tests (integration, contract, fixtures)

  shared/                        # Only cross-context primitives (keep tiny)
    kernel/                      # IDs, time, errors, Result, base types (no business rules)
    src/...

  build/                         # Build config (Gradle/Maven/Go workspace/etc.)
```

## Dependency Rules (must be enforced)

**Allowed dependencies (single bounded context):**

```text
start  -> adapter, app, domain, infra
adapter -> app, domain
app    -> domain
infra  -> domain (and app only if implementing app ports explicitly)
domain -> (no project modules; only standard libs + shared/kernel)
shared/kernel -> (no business dependencies)
```

**Hard bans:**

- `domain` must not import `adapter`, `app`, or `infra`.
    
- `adapter` must not call `infra` directly (go through `app` or domain ports).
    
- No cyclic dependencies. No “common” dumping ground.
    

## Core Purpose of Each Layer (one-liners)

- **domain**: business invariants, aggregate state changes, domain events.
    
- **app**: use case orchestration, transactions, authorization hooks, CQRS handlers.
    
- **adapter**: inbound endpoints and presenters (HTTP, CLI, MQ consumers).
    
- **infra**: outbound implementations (DB, cache, MQ, external APIs).
    
- **start**: wiring only (DI, bootstrap, module assembly).
    
- **shared/kernel**: cross-cutting primitives only, not business rules.
    

## Copy-Paste Prompt Snippet for AI (put into your LLM instructions)

```text
You are generating code for a DDD + COLA project.

Directory rules:
- modules/<context>/{start,adapter,app,domain,infra} as defined in docs/architecture/ddd-cola-rules.md
- Domain is pure. No imports from adapter/app/infra. Only standard libs + shared/kernel.
- App depends only on domain. Adapter depends on app/domain. Infra implements domain repository/gateway ports.
- Start is wiring only. No business logic.

When adding a feature:
1) Define/extend domain model (aggregate/value objects/events) in domain/.
2) Add use case handler in app/command or app/query.
3) Expose entrypoint in adapter/ (controller/consumer) using DTOs + assembler.
4) Implement persistence/client in infra/ behind domain ports.
5) Add tests under modules/<context>/test.

Never introduce cyclic dependencies. Never put business logic in start/adapter/infra.
```

If you tell me your language/runtime (Java Spring Boot, Go, Node, etc.), I can output a concrete scaffold with build files and a minimal example bounded context wired end-to-end.

# CQRS

有。你现在的目录里 **app/command** 和 **app/query** 只是“暗示”了 CQRS。要显式体现 CQRS，需要把 **写模型**、**读模型**、**投影/事件处理**、以及（可选）**独立 read-store** 的位置固定下来，并写清依赖规则。

## Add CQRS to the Structure

```text
modules/
  <bounded-context>/
    adapter/
      api/
        command/                 # Write endpoints: POST/PUT/DELETE
        query/                   # Read endpoints: GET
      consumer/
        command/                 # Consumes commands (optional)
        event/                   # Consumes events to build projections (read side)
      presenter/                 # Query DTO/ViewModel formatting

    app/
      command/
        handler/                 # Use case handlers for writes (transaction boundary)
        dto/                     # Command DTOs
        assembler/               # Command DTO -> domain conversion
      query/
        handler/                 # Use case handlers for reads (no domain mutation)
        dto/                     # Query params DTOs + result DTOs
        assembler/               # Read model -> DTO mapping
        readmodel/               # Read models (denormalized views)
        repository/              # Read repository ports (interfaces) for read side
      eventhandler/
        projection/              # Event -> projection updater (read side)
        integration/             # Integration event handlers (optional)
      outbox/                    # Outbox publisher (write side, optional)

    domain/
      model/                     # Aggregates/entities/value objects (write model)
      event/                     # Domain events
      repository/                # Write repository ports (interfaces)
      gateway/                   # External service ports (interfaces)
      service/                   # Domain services

    infra/
      persistence/
        write/
          repo/                  # Implements domain.repository (write store)
          mapper/                # ORM mappings for write model
        read/
          repo/                  # Implements app.query.repository (read store)
          mapper/                # Mapping for read models
      messaging/
        publisher/               # Publishes domain/integration events (often from outbox)
        consumer/                # Infra-level consumers wiring (optional)
      client/                    # External clients implementing domain.gateway
```

## CQRS Dependency Rules (explicit)

```text
Write path:
adapter/api/command -> app/command -> domain -> (infra/persistence/write implements ports)

Read path:
adapter/api/query -> app/query -> (infra/persistence/read implements read ports)
app/query must NOT call domain aggregates for business mutations.

Projection path:
domain event -> app/eventhandler/projection -> app/query/readmodel -> infra/persistence/read
```

Hard rules:

- **domain.repository** = write-side repository ports only.
    
- **app.query.repository** = read-side repository ports only.
    
- **infra/persistence/write** must not be used by query handlers.
    
- **infra/persistence/read** must not be used by command handlers.
    
- Query handlers are **side-effect free**. No domain mutation. No outbox publish.
    

## LLM Prompt Snippet (CQRS-aware)

```text
CQRS rules:
- Commands live in app/command, queries live in app/query.
- Command handlers mutate domain aggregates and persist via domain.repository ports.
- Query handlers read via app.query.repository ports and return readmodel DTOs.
- Read models are updated by projection handlers in app/eventhandler/projection from domain events.
- Infra has separate implementations for persistence/write and persistence/read.
- Never mix read repo in command handlers or write repo in query handlers.
```

如果你要更“硬”的 CQRS（独立数据库、独立部署读服务），把 `infra/persistence/read` 拆成一个单独模块 `modules/<context>-read/`，依赖规则保持不变。

# Infra -> domain

它的含义是。**Infra 是最外层。它只负责“实现接口”。不负责定义业务规则。**

### 1) `infra -> domain` 表示什么

* **domain 定义“端口”**：`domain.repository.*`、`domain.gateway.*` 这些是接口。
* **infra 提供“适配器实现”**：例如 `MysqlTenantRepository implements TenantRepository`，`KeycloakGatewayImpl implements KeycloakGateway`。
* 所以 infra 必然要 **import domain**，因为它要实现 domain 里的接口，并使用 domain 的类型（Aggregate、Value Object、Domain Event）。

一句话：**domain 说“我需要什么能力”，infra 说“我来用 DB/HTTP/MQ 实现它”。**

### 2) “and app only if implementing app ports explicitly” 是什么意思

有些团队会让 **app 层也定义端口**，尤其是 CQRS 的读侧：

* `app.query.repository.ReadModelRepository`（读模型仓储接口）
* `app.command.port.IdempotencyStore`（幂等/锁等应用级端口）

如果你把这些接口放在 app 层，那么 infra 要去实现它们，就必须 `infra -> app`。

但这是可选的。更推荐的做法是：

* **写侧端口放 domain**（repository/gateway）
* **读侧端口放 app.query.repository**（因为读模型不是领域模型）

所以这句的真实约束是：

* 默认：`infra` 只依赖 `domain`
* 只有当你在 `app` 里定义了必须由 infra 实现的接口时，`infra` 才允许依赖 `app`

### 3) 这条依赖规则在保护什么

* 防止 domain 被污染：domain 不知道 MySQL、Redis、HTTP、Kafka。
* 防止“反向调用”：不允许 domain/app 去 import infra，避免业务逻辑被基础设施绑死。
* 让替换实现变简单：把 MySQL 换成 Postgres，只改 infra。

### 4) 一个最小例子

**domain**

```go
// domain/repository/tenant_repository.go
type TenantRepository interface {
  Save(ctx context.Context, t Tenant) error
}
```

**infra**

```go
// infra/persistence/write/repo/mysql_tenant_repo.go
type MysqlTenantRepository struct { db *sql.DB }

func (r *MysqlTenantRepository) Save(ctx context.Context, t domain.Tenant) error {
  // mysql insert...
  return nil
}
```

这里 infra 必须 import domain。domain 不需要也不允许 import infra。

如果你愿意，我可以把你现在的规则整理成一张“允许/禁止依赖表”，用于放进 `docs/architecture/ddd-cola-rules.md` 给 AI 和团队统一执行。


# Demo Code
## Final DDD + COLA + CQRS Layout (Java / Spring Boot)

Assume base package: `com.acme.hive`
Example bounded context: `tenant`

### Root layout

```text
project-root/
  pom.xml (or build.gradle)
  README.md

  docs/
    architecture/
      ddd-cola-cqrs-rules.md
      context-map.md
      ubiquitous-language.md
    ai/
      llm-instructions.md

  shared/
    kernel/
      src/main/java/com/acme/hive/shared/kernel/
        id/                    # Strongly-typed IDs, generators
        time/                  # Clock abstractions
        error/                 # DomainError, Result, ErrorCode
        tx/                    # Transaction boundary helpers (thin)
        event/                 # Base DomainEvent marker

  modules/
    tenant/
      tenant-start/
      tenant-adapter/
      tenant-app/
      tenant-domain/
      tenant-infra/
```

---

## Tenant bounded context module layout (class-level paths)

### `modules/tenant/tenant-domain` (pure domain, write model)

```text
tenant-domain/src/main/java/com/acme/hive/tenant/domain/
  model/
    Tenant.java                          # Aggregate root
    TenantId.java                        # Value object
    TenantName.java                      # Value object
  event/
    TenantCreated.java                   # Domain event
  repository/
    TenantRepository.java                # Write-side port
  gateway/
    (empty in this example)
  service/
    (optional domain services)
```

### `modules/tenant/tenant-app` (use-cases, CQRS split)

```text
tenant-app/src/main/java/com/acme/hive/tenant/app/
  command/
    dto/
      CreateTenantCommand.java
    handler/
      CreateTenantCommandHandler.java    # @Transactional write use case
  query/
    dto/
      GetTenantSummaryQuery.java
      TenantSummaryDTO.java
    handler/
      GetTenantSummaryQueryHandler.java  # Redis->MySQL read path
    readmodel/
      TenantSummaryReadModel.java        # Read model type
    repository/
      TenantSummaryReadRepository.java   # Read-side port (CQRS)
  eventhandler/
    projection/
      TenantProjectionHandler.java       # Updates MySQL read table + Redis after commit
```

### `modules/tenant/tenant-adapter` (inbound APIs, DTOs, validation)

```text
tenant-adapter/src/main/java/com/acme/hive/tenant/adapter/
  api/
    command/
      TenantCommandController.java
      request/
        CreateTenantRequest.java
      response/
        CreateTenantResponse.java
    query/
      TenantQueryController.java
      response/
        TenantSummaryResponse.java
  assembler/
    TenantApiAssembler.java              # Request/Response <-> app DTO mapping
```

### `modules/tenant/tenant-infra` (outbound implementations: MySQL, Redis)

```text
tenant-infra/src/main/java/com/acme/hive/tenant/infra/
  persistence/
    write/
      entity/
        TenantJpaEntity.java
      mapper/
        TenantJpaMapper.java
      repo/
        TenantJpaRepository.java         # Spring Data JPA
        TenantRepositoryImpl.java        # implements domain.repository.TenantRepository
    read/
      entity/
        TenantSummaryJpaEntity.java
      repo/
        TenantSummaryJpaRepository.java  # Spring Data JPA for read table
        TenantSummaryReadRepositoryImpl.java # implements app.query.repository.TenantSummaryReadRepository
  cache/
    redis/
      TenantSummaryRedisRepository.java  # Redis access for read model
  config/
    TenantInfraConfig.java               # Beans (RedisTemplate, mappers)
```

### `modules/tenant/tenant-start` (wiring only)

```text
tenant-start/src/main/java/com/acme/hive/tenant/start/
  TenantApplication.java                 # SpringBootApplication
  config/
    TenantModuleConfig.java              # Component scan / imports only
```

---

## Dependency rules (DDD + COLA + CQRS)

### Allowed dependencies (single bounded context)

```text
tenant-start   -> tenant-adapter, tenant-app, tenant-domain, tenant-infra
tenant-adapter -> tenant-app, tenant-domain
tenant-app     -> tenant-domain
tenant-infra   -> tenant-domain, tenant-app   (ONLY to implement read ports defined in app/query/repository)
tenant-domain  -> shared/kernel only
shared/kernel  -> standard libs only
```

### CQRS hard rules

* **Write ports** live in `tenant-domain/repository/*`.
* **Read ports** live in `tenant-app/query/repository/*`.
* `command/*` must not call read repositories.
* `query/*` must not mutate aggregates or call write repositories.
* Read models live under `tenant-app/query/readmodel/*` and are persisted by projection handlers.

### Transaction + event rule

* Command handler is the transaction boundary.
* Domain events are published inside the transaction.
* Projections run `AFTER_COMMIT` to keep read side consistent with committed writes.

---

## LLM instructions (drop into `docs/ai/llm-instructions.md`)

```text
You are generating code for a Java Spring Boot project using DDD + COLA + CQRS.

1) Layers and responsibilities
- domain: pure business model. Aggregates, value objects, domain events, ports (write-side repository/gateway interfaces).
- app: use cases. CQRS split into app/command and app/query. Defines read-side ports in app/query/repository.
- adapter: inbound. REST controllers, request/response DTOs, validation, assemblers.
- infra: outbound. Implements domain ports and app read ports. Contains MySQL JPA entities/repos/mappers and Redis repositories.
- start: wiring only. Spring Boot main class and module configuration. No business logic.

2) Dependency rules (never violate)
- domain must not import app/adapter/infra.
- app imports domain only.
- adapter imports app + domain, never infra.
- infra imports domain, and imports app ONLY to implement app/query read ports.
- no cyclic dependencies.

3) CQRS rules
- Writes: adapter/api/command -> app/command/handler -> domain aggregate -> domain.repository -> infra/persistence/write.
- Reads: adapter/api/query -> app/query/handler -> app.query.repository -> infra/persistence/read + redis cache.
- Projections: domain event -> app/eventhandler/projection -> infra/persistence/read + redis.

4) Naming conventions
- Command: <Verb><Aggregate>Command, handler: <Verb><Aggregate>CommandHandler
- Query: Get<Something>Query, handler: Get<Something>QueryHandler
- Domain event: <Aggregate><PastTense> (e.g., TenantCreated)
- Infra impl: XxxRepositoryImpl, XxxGatewayImpl, with clear mapper classes.

5) Transactions and events
- Command handlers use @Transactional.
- Projection handlers use @TransactionalEventListener(phase = AFTER_COMMIT).
- Reads use @Transactional(readOnly = true) if needed.
```

---

# End-to-end code example (write + read, MySQL + Redis + events + transactions)

Below shows one write API (Create Tenant) and one read API (Get Tenant Summary).
MySQL stores both the **write table** (`tenant`) and **read projection table** (`tenant_summary`).
Redis caches the read model. Projection updates MySQL read table + Redis after commit.

---

## 1) Domain layer (tenant-domain)

### `modules/tenant/tenant-domain/src/main/java/com/acme/hive/tenant/domain/model/TenantId.java`

```java
package com.acme.hive.tenant.domain.model;

import java.util.UUID;

public record TenantId(String value) {
    public static TenantId newId() {
        return new TenantId(UUID.randomUUID().toString());
    }
}
```

### `modules/tenant/tenant-domain/src/main/java/com/acme/hive/tenant/domain/model/TenantName.java`

```java
package com.acme.hive.tenant.domain.model;

public record TenantName(String value) {
    public TenantName {
        if (value == null || value.isBlank()) throw new IllegalArgumentException("tenant name is blank");
    }
}
```

### `modules/tenant/tenant-domain/src/main/java/com/acme/hive/tenant/domain/event/TenantCreated.java`

```java
package com.acme.hive.tenant.domain.event;

import com.acme.hive.tenant.domain.model.TenantId;
import com.acme.hive.tenant.domain.model.TenantName;

import java.time.Instant;

public record TenantCreated(TenantId tenantId, TenantName name, Instant occurredAt) {}
```

### `modules/tenant/tenant-domain/src/main/java/com/acme/hive/tenant/domain/model/Tenant.java`

```java
package com.acme.hive.tenant.domain.model;

import com.acme.hive.tenant.domain.event.TenantCreated;

import java.time.Instant;

public final class Tenant {
    private final TenantId id;
    private TenantName name;

    private Tenant(TenantId id, TenantName name) {
        this.id = id;
        this.name = name;
    }

    public static Tenant create(TenantName name) {
        return new Tenant(TenantId.newId(), name);
    }

    public TenantCreated createdEvent() {
        return new TenantCreated(id, name, Instant.now());
    }

    public TenantId id() { return id; }
    public TenantName name() { return name; }
}
```

### `modules/tenant/tenant-domain/src/main/java/com/acme/hive/tenant/domain/repository/TenantRepository.java`

```java
package com.acme.hive.tenant.domain.repository;

import com.acme.hive.tenant.domain.model.Tenant;
import com.acme.hive.tenant.domain.model.TenantId;

import java.util.Optional;

public interface TenantRepository {
    void save(Tenant tenant);
    Optional<Tenant> findById(TenantId id);
}
```

---

## 2) Application layer (tenant-app)

### Command DTO and handler (write path)

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/command/dto/CreateTenantCommand.java`

```java
package com.acme.hive.tenant.app.command.dto;

public record CreateTenantCommand(String name) {}
```

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/command/handler/CreateTenantCommandHandler.java`

```java
package com.acme.hive.tenant.app.command.handler;

import com.acme.hive.tenant.app.command.dto.CreateTenantCommand;
import com.acme.hive.tenant.domain.model.Tenant;
import com.acme.hive.tenant.domain.model.TenantName;
import com.acme.hive.tenant.domain.repository.TenantRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateTenantCommandHandler {
    private final TenantRepository tenantRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CreateTenantCommandHandler(TenantRepository tenantRepository, ApplicationEventPublisher eventPublisher) {
        this.tenantRepository = tenantRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public String handle(CreateTenantCommand cmd) {
        Tenant tenant = Tenant.create(new TenantName(cmd.name()));
        tenantRepository.save(tenant);

        // Publish inside tx, projection listens AFTER_COMMIT
        eventPublisher.publishEvent(tenant.createdEvent());

        return tenant.id().value();
    }
}
```

### Query DTOs and handler (read path)

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/query/readmodel/TenantSummaryReadModel.java`

```java
package com.acme.hive.tenant.app.query.readmodel;

public record TenantSummaryReadModel(String tenantId, String name) {}
```

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/query/repository/TenantSummaryReadRepository.java`

```java
package com.acme.hive.tenant.app.query.repository;

import com.acme.hive.tenant.app.query.readmodel.TenantSummaryReadModel;

import java.util.Optional;

public interface TenantSummaryReadRepository {
    Optional<TenantSummaryReadModel> findByTenantId(String tenantId);
}
```

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/query/dto/GetTenantSummaryQuery.java`

```java
package com.acme.hive.tenant.app.query.dto;

public record GetTenantSummaryQuery(String tenantId) {}
```

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/query/dto/TenantSummaryDTO.java`

```java
package com.acme.hive.tenant.app.query.dto;

public record TenantSummaryDTO(String tenantId, String name) {}
```

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/query/handler/GetTenantSummaryQueryHandler.java`

```java
package com.acme.hive.tenant.app.query.handler;

import com.acme.hive.tenant.app.query.dto.GetTenantSummaryQuery;
import com.acme.hive.tenant.app.query.dto.TenantSummaryDTO;
import com.acme.hive.tenant.app.query.readmodel.TenantSummaryReadModel;
import com.acme.hive.tenant.app.query.repository.TenantSummaryReadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetTenantSummaryQueryHandler {
    private final TenantSummaryReadRepository readRepository;

    public GetTenantSummaryQueryHandler(TenantSummaryReadRepository readRepository) {
        this.readRepository = readRepository;
    }

    @Transactional(readOnly = true)
    public TenantSummaryDTO handle(GetTenantSummaryQuery q) {
        TenantSummaryReadModel rm = readRepository.findByTenantId(q.tenantId())
                .orElseThrow(() -> new IllegalArgumentException("tenant not found: " + q.tenantId()));
        return new TenantSummaryDTO(rm.tenantId(), rm.name());
    }
}
```

### Projection handler (event -> read model update)

#### `modules/tenant/tenant-app/src/main/java/com/acme/hive/tenant/app/eventhandler/projection/TenantProjectionHandler.java`

```java
package com.acme.hive.tenant.app.eventhandler.projection;

import com.acme.hive.tenant.domain.event.TenantCreated;
import com.acme.hive.tenant. infra.cache.redis.TenantSummaryRedisRepository;
import com.acme.hive.tenant.infra.persistence.read.repo.TenantSummaryJpaRepository;
import com.acme.hive.tenant.infra.persistence.read.entity.TenantSummaryJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
public class TenantProjectionHandler {
    private final TenantSummaryJpaRepository mysqlReadRepo;
    private final TenantSummaryRedisRepository redisRepo;

    public TenantProjectionHandler(TenantSummaryJpaRepository mysqlReadRepo, TenantSummaryRedisRepository redisRepo) {
        this.mysqlReadRepo = mysqlReadRepo;
        this.redisRepo = redisRepo;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void on(TenantCreated e) {
        // 1) Update MySQL read model table
        TenantSummaryJpaEntity entity = new TenantSummaryJpaEntity(e.tenantId().value(), e.name().value());
        mysqlReadRepo.save(entity);

        // 2) Update Redis cache for fast queries
        redisRepo.put(entity.getTenantId(), entity.getName());
    }
}
```

---

## 3) Adapter layer (tenant-adapter)

### API assembler

#### `modules/tenant/tenant-adapter/src/main/java/com/acme/hive/tenant/adapter/assembler/TenantApiAssembler.java`

```java
package com.acme.hive.tenant.adapter.assembler;

import com.acme.hive.tenant.adapter.api.command.request.CreateTenantRequest;
import com.acme.hive.tenant.adapter.api.command.response.CreateTenantResponse;
import com.acme.hive.tenant.adapter.api.query.response.TenantSummaryResponse;
import com.acme.hive.tenant.app.command.dto.CreateTenantCommand;
import com.acme.hive.tenant.app.query.dto.TenantSummaryDTO;
import org.springframework.stereotype.Component;

@Component
public class TenantApiAssembler {
    public CreateTenantCommand toCommand(CreateTenantRequest req) {
        return new CreateTenantCommand(req.name());
    }

    public CreateTenantResponse toCreateResponse(String tenantId) {
        return new CreateTenantResponse(tenantId);
    }

    public TenantSummaryResponse toQueryResponse(TenantSummaryDTO dto) {
        return new TenantSummaryResponse(dto.tenantId(), dto.name());
    }
}
```

### Command API (write)

#### `modules/tenant/tenant-adapter/src/main/java/com/acme/hive/tenant/adapter/api/command/request/CreateTenantRequest.java`

```java
package com.acme.hive.tenant.adapter.api.command.request;

public record CreateTenantRequest(String name) {}
```

#### `modules/tenant/tenant-adapter/src/main/java/com/acme/hive/tenant/adapter/api/command/response/CreateTenantResponse.java`

```java
package com.acme.hive.tenant.adapter.api.command.response;

public record CreateTenantResponse(String tenantId) {}
```

#### `modules/tenant/tenant-adapter/src/main/java/com/acme/hive/tenant/adapter/api/command/TenantCommandController.java`

```java
package com.acme.hive.tenant.adapter.api.command;

import com.acme.hive.tenant.adapter.assembler.TenantApiAssembler;
import com.acme.hive.tenant.adapter.api.command.request.CreateTenantRequest;
import com.acme.hive.tenant.adapter.api.command.response.CreateTenantResponse;
import com.acme.hive.tenant.app.command.handler.CreateTenantCommandHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenants")
public class TenantCommandController {
    private final CreateTenantCommandHandler handler;
    private final TenantApiAssembler assembler;

    public TenantCommandController(CreateTenantCommandHandler handler, TenantApiAssembler assembler) {
        this.handler = handler;
        this.assembler = assembler;
    }

    @PostMapping
    public CreateTenantResponse create(@RequestBody CreateTenantRequest req) {
        String tenantId = handler.handle(assembler.toCommand(req));
        return assembler.toCreateResponse(tenantId);
    }
}
```

### Query API (read)

#### `modules/tenant/tenant-adapter/src/main/java/com/acme/hive/tenant/adapter/api/query/response/TenantSummaryResponse.java`

```java
package com.acme.hive.tenant.adapter.api.query.response;

public record TenantSummaryResponse(String tenantId, String name) {}
```

#### `modules/tenant/tenant-adapter/src/main/java/com/acme/hive/tenant/adapter/api/query/TenantQueryController.java`

```java
package com.acme.hive.tenant.adapter.api.query;

import com.acme.hive.tenant.adapter.assembler.TenantApiAssembler;
import com.acme.hive.tenant.adapter.api.query.response.TenantSummaryResponse;
import com.acme.hive.tenant.app.query.dto.GetTenantSummaryQuery;
import com.acme.hive.tenant.app.query.handler.GetTenantSummaryQueryHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenants")
public class TenantQueryController {
    private final GetTenantSummaryQueryHandler handler;
    private final TenantApiAssembler assembler;

    public TenantQueryController(GetTenantSummaryQueryHandler handler, TenantApiAssembler assembler) {
        this.handler = handler;
        this.assembler = assembler;
    }

    @GetMapping("/{tenantId}/summary")
    public TenantSummaryResponse summary(@PathVariable String tenantId) {
        return assembler.toQueryResponse(handler.handle(new GetTenantSummaryQuery(tenantId)));
    }
}
```

---

## 4) Infra layer (tenant-infra)

### Write-side MySQL (JPA entity + repo + mapper + adapter)

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/persistence/write/entity/TenantJpaEntity.java`

```java
package com.acme.hive.tenant.infra.persistence.write.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tenant")
public class TenantJpaEntity {
    @Id
    private String id;
    private String name;

    protected TenantJpaEntity() {}

    public TenantJpaEntity(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() { return id; }
    public String getName() { return name; }
}
```

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/persistence/write/repo/TenantJpaRepository.java`

```java
package com.acme.hive.tenant.infra.persistence.write.repo;

import com.acme.hive.tenant.infra.persistence.write.entity.TenantJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantJpaRepository extends JpaRepository<TenantJpaEntity, String> {}
```

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/persistence/write/mapper/TenantJpaMapper.java`

```java
package com.acme.hive.tenant.infra.persistence.write.mapper;

import com.acme.hive.tenant.domain.model.Tenant;
import com.acme.hive.tenant.domain.model.TenantId;
import com.acme.hive.tenant.domain.model.TenantName;
import com.acme.hive.tenant.infra.persistence.write.entity.TenantJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class TenantJpaMapper {
    public TenantJpaEntity toEntity(Tenant t) {
        return new TenantJpaEntity(t.id().value(), t.name().value());
    }

    // If you need re-hydration for domain reads (usually not in CQRS reads):
    public Tenant toDomain(TenantJpaEntity e) {
        // minimal, avoids setters; in real code use factory method
        return Tenant.create(new TenantName(e.getName())); // creates new ID, so not used here
    }
}
```

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/persistence/write/repo/TenantRepositoryImpl.java`

```java
package com.acme.hive.tenant.infra.persistence.write.repo;

import com.acme.hive.tenant.domain.model.Tenant;
import com.acme.hive.tenant.domain.model.TenantId;
import com.acme.hive.tenant.domain.repository.TenantRepository;
import com.acme.hive.tenant.infra.persistence.write.mapper.TenantJpaMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class TenantRepositoryImpl implements TenantRepository {
    private final TenantJpaRepository jpa;
    private final TenantJpaMapper mapper;

    public TenantRepositoryImpl(TenantJpaRepository jpa, TenantJpaMapper mapper) {
        this.jpa = jpa;
        this.mapper = mapper;
    }

    @Override
    public void save(Tenant tenant) {
        jpa.save(mapper.toEntity(tenant));
    }

    @Override
    public Optional<Tenant> findById(TenantId id) {
        // In strict CQRS, queries should not use this path.
        return Optional.empty();
    }
}
```

### Read-side MySQL projection table + Redis cache

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/persistence/read/entity/TenantSummaryJpaEntity.java`

```java
package com.acme.hive.tenant.infra.persistence.read.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tenant_summary")
public class TenantSummaryJpaEntity {
    @Id
    private String tenantId;
    private String name;

    protected TenantSummaryJpaEntity() {}

    public TenantSummaryJpaEntity(String tenantId, String name) {
        this.tenantId = tenantId;
        this.name = name;
    }

    public String getTenantId() { return tenantId; }
    public String getName() { return name; }
}
```

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/persistence/read/repo/TenantSummaryJpaRepository.java`

```java
package com.acme.hive.tenant.infra.persistence.read.repo;

import com.acme.hive.tenant.infra.persistence.read.entity.TenantSummaryJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantSummaryJpaRepository extends JpaRepository<TenantSummaryJpaEntity, String> {}
```

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/cache/redis/TenantSummaryRedisRepository.java`

```java
package com.acme.hive.tenant.infra.cache.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;

@Repository
public class TenantSummaryRedisRepository {
    private static final Duration TTL = Duration.ofMinutes(30);
    private final StringRedisTemplate redis;

    public TenantSummaryRedisRepository(StringRedisTemplate redis) {
        this.redis = redis;
    }

    private String key(String tenantId) {
        return "tenant:summary:" + tenantId;
    }

    public Optional<String> getName(String tenantId) {
        return Optional.ofNullable(redis.opsForValue().get(key(tenantId)));
    }

    public void put(String tenantId, String name) {
        redis.opsForValue().set(key(tenantId), name, TTL);
    }
}
```

#### `modules/tenant/tenant-infra/src/main/java/com/acme/hive/tenant/infra/persistence/read/repo/TenantSummaryReadRepositoryImpl.java`

```java
package com.acme.hive.tenant.infra.persistence.read.repo;

import com.acme.hive.tenant.app.query.readmodel.TenantSummaryReadModel;
import com.acme.hive.tenant.app.query.repository.TenantSummaryReadRepository;
import com.acme.hive.tenant.infra.cache.redis.TenantSummaryRedisRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class TenantSummaryReadRepositoryImpl implements TenantSummaryReadRepository {
    private final TenantSummaryRedisRepository redisRepo;
    private final TenantSummaryJpaRepository mysqlRepo;

    public TenantSummaryReadRepositoryImpl(TenantSummaryRedisRepository redisRepo, TenantSummaryJpaRepository mysqlRepo) {
        this.redisRepo = redisRepo;
        this.mysqlRepo = mysqlRepo;
    }

    @Override
    public Optional<TenantSummaryReadModel> findByTenantId(String tenantId) {
        // 1) Redis cache
        Optional<String> cachedName = redisRepo.getName(tenantId);
        if (cachedName.isPresent()) {
            return Optional.of(new TenantSummaryReadModel(tenantId, cachedName.get()));
        }

        // 2) MySQL read model table
        return mysqlRepo.findById(tenantId).map(e -> {
            redisRepo.put(e.getTenantId(), e.getName());
            return new TenantSummaryReadModel(e.getTenantId(), e.getName());
        });
    }
}
```

---

## 5) Start layer (tenant-start)

#### `modules/tenant/tenant-start/src/main/java/com/acme/hive/tenant/start/TenantApplication.java`

```java
package com.acme.hive.tenant.start;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.acme.hive")
public class TenantApplication {
    public static void main(String[] args) {
        SpringApplication.run(TenantApplication.class, args);
    }
}
```

---

## What this example proves (DDD + CQRS + middleware)

* **Write**: REST command → `@Transactional` command handler → domain aggregate → MySQL write store → publish domain event.
* **Event**: `@TransactionalEventListener(AFTER_COMMIT)` projection handler.
* **Read model**: Projection updates MySQL `tenant_summary` and Redis cache.
* **Read**: REST query → query handler → read repository → Redis first, fallback to MySQL read table.

If you want stricter reliability, replace in-process event publishing with an **Outbox table + background publisher**. The layout above already has the correct seams for that (add `infra/messaging/outbox/*` and a scheduled publisher).


# References

# Link to