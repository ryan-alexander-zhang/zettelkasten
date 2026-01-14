---
type: "to-read"
id: 20260114140111
created: 2026-01-14T14:01:11
source:
  - "https://mp.weixin.qq.com/s/ck1aA-FBgI1ztF5xW63JUw"
tags:
reviewd: false
---
Original Balakumaran *2026年1月14日 13:14*

## 为什么幂等性(Idempotency)在实际系统中会失效

现代分布式系统暴露的API会触发状态变更操作，如支付、订单、账户获取流程或账户更新。在这样的环境中，由于 `网络重试` 、 `Kafka重平衡器发出多个请求` 、 `负载均衡器` 等因素， `启动重复事务的概率相当高且无法避免` 。如果没有适当的防护措施，这些 `重复事务/请求` 可能导 `致数据不一致、财务差异和业务不变量的变化` 。

**幂等性(Idempotency)** 是一种成熟的技术，用于确保同一请求的重复执行产生单一、一致的结果。虽然幂等性可以在应用层使用内存缓存或请求去重逻辑来强制执行，但这些方法在水平扩展的微服务架构中会失效，因为多个应用实例可能同时处理请求，并且跨越多个不同区域。

像MySQL（使用InnoDB存储引擎）这样的关系数据库提供了事务保证和行级锁定机制，可用于实现健壮的、跨实例的幂等性。通过持久化幂等键并通过悲观锁定强制执行独占访问，系统可以确保只允许一个请求执行业务逻辑，而后续的重复请求会优雅地失败。

## 问题陈述

### 幂等性的常见方法

  
- **内存标志/同步块** \- 在多实例并发环境下仍然会出现重复。
- **本地缓存（Ehcache、Caffeine）** \- 在多实例并发环境下仍然会出现重复。
- **"只是检查是否存在"是不安全的** \- 在多实例并发环境下仍然会出现重复。
- **数据库中的唯一约束** \- 通常会导致必须处理的异常，并且不能防止失败前的部分执行。
- **分布式锁（Redis/Zookeeper）** \- 增加了操作复杂性并引入了新的故障模式。
  

上述大多数实现在分布式系统中都是不充分的，因为它们不能跨应用实例协调状态，并且在崩溃恢复或重新部署时会失效。

因此，本设计要解决的问题是 `实现一个数据库支持的幂等性检查` ，使用 `MySQL行级锁定通过幂等键进行识别` ，确保在分布式Spring Boot应用实例中保持精确一次的业务执行语义。

## 为什么MySQL行级锁定效果很好

关系数据库已经通过事务和行级锁定提供了强大的一致性保证。

通过利用以下语义：

- 选择 `... FOR UPDATE`
- 事务边界
- 唯一幂等键
  

通过使用这种机制，我们构建了：

  
- 强一致性
- 在并发下安全
- 简单易懂
- 易于操作
- 云原生友好
- 依赖数据库一致性处理并发
  

这种方法在支付、钱包和账户获取等事务敏感领域以及许多其他用例中都能完美工作。

## 高层设计

核心思想：

- 每个请求携带一个幂等键（如唯一的UUID）。
- 应用在幂等表中存储该键。
- 处理在单个数据库事务内发生。
- 幂等记录在处理期间被行锁定。
- 重复请求检测到现有键并安全退出。
  

### 幂等键设计示例

  
```
CREATE TABLE idempotency_key (
       idem_key      VARCHAR(128) NOTNULL,
       status        ENUM('IN_PROGRESS','COMPLETED','FAILED') NOTNULL,
       request_hash  CHAR(64) NULL,
       response_json JSONNULL,
       created_at    TIMESTAMPNOTNULLDEFAULTCURRENT_TIMESTAMP,
       updated_at    TIMESTAMPNOTNULLDEFAULTCURRENT_TIMESTAMPONUPDATECURRENT_TIMESTAMP,
       PRIMARY KEY (idem_key)
) ENGINE=InnoDB;
```
  

工作原理：

- 主键（ `idem_key` ）保证每个幂等键只有一行。
- `PESSIMISTIC_WRITE` 在MySQL（InnoDB）中变成 `SELECT .. FOR UPDATE` ，在提交/回滚前阻止同一键上的并发调用者。
- 跨线程和多个应用实例工作，因为锁在MySQL中。
  

重要考虑：

- 使用InnoDB。
- 保持锁定窗口小：在持有锁时只做最小的检查 + 状态转换。
- 考虑设置 `innodb_lock_wait_timeout` 行为；决定如果请求已经是 `IN_PROGRESS` 是否返回409/429/422。
  

## 事务流程

**步骤1** ：开始事务。

- 所有逻辑将在单个事务内运行。

**步骤2** ：锁定或插入幂等记录。

- `SELECT * FROM idempotency_keys WHERE key = ? FOR UPDATE`;
- 如果记录存在且处于" `COMPLETED` "状态，返回存储的记录。
	- 如果记录是 `IN_PROGRESS` ，根据策略阻止或拒绝。
- 如果记录不存在：
- 插入状态为" `IN_PROGRESS` "的新记录。

**步骤3** ：执行业务逻辑。

**步骤4** ：将记录标记为已完成。

- 将幂等记录更新为" `COMPLETED` "状态，并可选择在表中存储响应引用

**步骤5** ：提交事务。

- 此时：
- 锁被释放
	- 数据一致
	- 任何并发重复请求都会被阻止，在看到" `COMPLETED` "状态后会恢复（如果被阻止）
  

安全处理并发请求：

当两个相同的请求同时到达时：

- 第一个请求获取行锁
- 第二个请求在 `SELECT FOR UPDATE` 上被阻止/拒绝
- 一旦第一个提交，第二个会看到更新的状态（如果被阻止）
- 防止重复执行。
  

这保证了业务级别的精确一次行为语义。

## Spring Boot实现

策略：

- 服务层的 `@Transactional`
- JPA或JDBC仓库
- 显式锁定查询（ `FOR UPDATE` ）
- 关注点清晰分离

要实现的典型组件：

- `IdempotencyEntity`
- `IdempotencyRepository`
- `IdempotencyService`
- 调用幂等性检查的业务服务

这种方法与现有的Spring事务管理自然集成。

### Spring应用属性

  
```
spring.application.name=IdempotencyCheck

spring.datasource.url=jdbc:mysql://localhost:3306/product?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

spring.datasource.hikari.auto-commit=false
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.max-lifetime=1800000
```
  

这里有两个重要的属性需要考虑：

  
- open-in-view 避免"在web响应期间延迟加载"（对REST更干净）
- auto-commit = false 确保池不会在背后自动提交（对 `SELECT ... FOR UPDATE` 模式有好处）
  

### JPA实体

包含一个枚举来保存表的当前状态： `IN_PROGRESS` 、 `COMPLETED` 或 `FAILED` ，供调用者采取进一步操作。对于本文，我们将抛出一个冲突异常以简化。

  
```
package repository;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "idempotency_key")
@Getter@Setter
publicclass IdempotencyKeyEntity {

    @Id
    @Column(name="idem_key", length = 128)
    private String key;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "request_hash", length = 64)
    private String requestHash;

    @Column(name = "response_json", columnDefinition = "json")
    private String responseJson;

    publicenum Status { IN_PROGRESS, COMPLETED, FAILED }

}
```
  

### 幂等DAO库实现

该方法通过获取相应数据库行的悲观写锁来检索幂等记录。该锁确保一次只有一个事务可以读取或修改记录，防止并发请求同时处理相同的幂等键。

  
```
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
publicinterface IdempotencyRepositoryImpl {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select idem from IdempotencyKeyEntity idem where idem.key = :key")
    Optional<IdempotencyKeyEntity> lockByKey(@Param("key") String key);

}
```
  

### 服务实现

  

根据状态从数据库获取锁，如果行已经有完成状态，从哈希返回响应。

  
```
@Transactional
public Optional<String> getCompletedResponse(String key, String requestHash){

    //Find the key or else create a record and insert it into the database and return the entity
    repo.findById(key).orElseGet(() -> {

        IdempotencyKeyEntity entity = new IdempotencyKeyEntity();
        entity.setKey(key);
        entity.setStatus(IdempotencyKeyEntity.Status.IN_PROGRESS);
        entity.setRequestHash(requestHash);
        try{
            return repo.saveAndFlush(entity);
        }catch (DataIntegrityViolationException exception){
            returnnull;
        }
    });

    //Lock the row only one thread at a time
    IdempotencyKeyEntity locked = repo.lockByKey(key)
            .orElseThrow(() -> new IllegalStateException("Row must exist"));

    //If already completed return the cached response
    if (locked.getStatus() == IdempotencyKeyEntity.Status.COMPLETED) {
        if (!Objects.equals(locked.getRequestHash(), requestHash)) {
            thrownew ResponseStatusException(HttpStatus.CONFLICT,
                    "Idempotency-Key reuse with different request");
        }
        return Optional.ofNullable(locked.getResponseJson());
    }

    // If in progress and hash differs conflict (Not blocking here)
    if (locked.getRequestHash() != null &&
            !Objects.equals(locked.getRequestHash(), requestHash)) {
        thrownew ResponseStatusException(HttpStatus.CONFLICT,
                "Idempotency-Key reuse with different request");
    }

    //Not yet completed, the caller should do the work and mark it completed
    return Optional.empty();
}
```
  

代码块将记录标记为已完成：

```
@Transactional
public void completed(String key, String responseJson) {
    IdempotencyKeyEntity locked = repo.lockByKey(key)
            .orElseThrow(() -> new IllegalStateException("Row must exist"));
    locked.setStatus(IdempotencyKeyEntity.Status.COMPLETED);
    locked.setResponseJson(responseJson);
    repo.save(locked);
}
```
  

如果事务失败，其他等待的线程可以做这项工作。

  
```
@Transactional
public void failed(String key) {
    IdempotencyKeyEntity locked = repo.lockByKey(key)
            .orElseThrow(() -> new IllegalStateException("Row must exist"));
    locked.setStatus(IdempotencyKeyEntity.Status.FAILED);
    repo.save(locked);
}
```
  

### 控制器实现

  
```
@RestController
@RequiredArgsConstructor
publicclass IdempotentController {

    privatefinal IdempotencyService idempotencyService;

    @PostMapping("/payments")
    public ResponseEntity<String> createPayments(@RequestHeader("Idempotency-Key") String idemKey,
                                                 @RequestBody PaymentRequest req){

        //Using Google Guava for 256 hashing
        String hashReq = Hashing.sha256()
                .hashString(req.toString(), StandardCharsets.UTF_8)
                .toString();

        //check for cachedInDB
        Optional<String> cachedInDB = idempotencyService.getCompletedResponse(idemKey, hashReq);
        if(cachedInDB.isPresent()){
            return ResponseEntity.ok(cachedInDB.get());
        }

        //Do the business logic
        try{
            String results = idempotencyService.doWork();
            //Mark the state as completed for the idempotent key
            idempotencyService.completed(idemKey, results);

            return ResponseEntity.ok(results);
        }catch (Exception ex){
            //if the transaction fails, mark the idempotent key as failed to be processed later by other threads
            idempotencyService.failed(idemKey);
            throw ex;
        }
    }
}
```
  
- 这个REST控制器演示了如何在API层使用 `Idempotency-Key` 头处理幂等请求。控制器本身保持最小化，将所有并发和状态管理控制委托给 `IdempotentService` 。
- 当收到请求时，控制器首先使用Google Guava库计算请求负载的256位哈希。这个哈希用于检测是否正在使用不同的请求体重用相同的幂等键，这是支付等事务敏感API中的关键保护措施。
- 在执行任何业务逻辑之前，控制器检查给定幂等键是否已存在完成的响应。如果找到缓存的响应，它会立即返回给客户端，确保重复请求不会触发重复的副作用。
- 如果没有完成的响应存在，控制器继续执行业务操作。成功执行后，幂等键被标记为 `COMPLETED` ，响应被持久化以便在未来的重试中安全重放。如果失败，键被标记为 `FAILED` ，允许后续请求安全地重试操作。

通过将幂等性强制执行隔离在服务层，并保持控制器专注于HTTP请求，这种设计确保并发请求被连贯处理，并根据需要在分布式Spring Boot实例中重试。

### 用例

  
- 支付处理
- 钱包和余额管理
- 账户开通
- 订单创建
- 需要强一致性的财务工作流

注意：对于简单的读密集型或最终一致的工作负载可能过于复杂

## 性能考虑

- 行级锁定是轻量级的，作用于单个键
- 不需要全局锁或分布式协调
- 在高并发下表现良好
- 随数据库水平扩展

对于极高吞吐量的系统，分区策略或短命事务可以帮助保持性能

## 结论

幂等性是可靠分布式系统的基础要求。通过利用MySQL行级锁定和事务保证，Spring Boot应用可以安全地处理重试、重复和并发请求，而不会引入不必要的复杂性。

这种模式在简单性、正确性和操作可靠性之间取得了平衡，使其成为事务敏感云原生应用的强有力选择。

Github链接：https://github.com/balakumaran-sugumar/idempotency

`翻译：https://dzone.com/articles/implementing-idempotency-spring-boot-mysql`

作者提示: 个人观点，仅供参考

[Read more](https://mp.weixin.qq.com/s/)

继续滑动看下一个

认知科技技术团队

向上滑动看下一个