
下面直接给你一套可以复制到 AI 里的模板。按「全局上下文模板」+「具体任务模板」来用。

---

## 一、全局项目上下文模板（固定放在对话最前面）

> 每次让 AI 干活之前，先贴这一段，再补具体任务需求。

```text
你现在是一个 Java 后端工程师助手，协助我在下面这个技术栈下开发业务功能：

【技术栈】
- Java 17（如不同请调整）
- Spring Boot
- DDD + COLA 分层结构
- MyBatis-Plus 作为 ORM
- Swagger/OpenAPI 作为接口文档
- Maven 作为构建工具

【架构与分层约定】
采用 COLA 分层，包结构类似：
- adapter 层：暴露接口，如 REST Controller，外部网关适配
- application 层：用例服务（Service）、Command/Query、组装 DTO
- domain 层：领域模型、领域服务、聚合根、领域事件
- infrastructure 层：持久化实现、MyBatis-Plus Mapper、外部系统适配

基本规则：
- Controller 只做入参校验、权限校验、调用 application 层
- application 层不直接操作 MyBatis-Plus Mapper，只依赖领域仓储接口
- domain 层不依赖 Spring、MyBatis 等框架代码
- infrastructure 层实现 domain 层定义的仓储接口，具体用 MyBatis-Plus

【MyBatis-Plus 使用约定】
- 实体放在 infrastructure 或 domain 的 dataobject 包（根据具体风格）
- Mapper 接口继承 BaseMapper<实体>
- 复杂查询使用 LambdaQueryWrapper、LambdaUpdateWrapper
- 尽量避免在 Service 中写原始 SQL

【Swagger / OpenAPI 约定】
- 使用注解 @Operation、@Parameter、@Schema 维护接口文档
- 所有对外接口都要有明确的请求体、响应体模型
- 返回统一响应包装，例如：CommonResponse<T>，包含 code、message、data

【代码风格】
- 所有新代码需要有必要的单元测试或集成测试
- 异常用自定义业务异常 + 全局异常处理，Controller 不直接抛框架异常
- 接口命名与 HTTP 方法符合语义，查询用 GET，新增用 POST，修改用 PUT/PATCH，删除用 DELETE

在后续回答中：
- 严格按照上述分层与约定给出代码结构与文件路径建议
- 尽量给出完整可编译的类，而不是只给片段
- 对于复杂设计，先给出设计说明，再给出代码实现
```

---

## 二、常用任务提示模板

### 1. 新业务功能 / 用例开发模板

```text
任务：在现有系统中新增一个业务用例。

请按以下步骤输出：

1）给出基于 DDD + COLA 的设计：
- 聚合根、实体、值对象、领域服务的划分
- application 层的 UseCase / Service 设计
- 需要的仓储接口与方法
- adapter 层需要暴露的 API 列表（URI + HTTP 方法）

2）给出建议的包结构与类命名：
- controller 类全限定名
- application service 类全限定名
- domain 聚合与仓储接口全限定名
- infrastructure Mapper 和仓储实现全限定名

3）基于我的技术栈，生成关键代码：
- Controller（带 Swagger 注解）
- application 层 service
- domain 层聚合根、领域服务骨架
- domain 层仓储接口
- infrastructure 层 MyBatis-Plus 实体、Mapper、仓储实现
- 必要的 DTO / Command / Query 类

4）生成对应的测试用例建议：
- 至少包含 application 层的单元测试思路
- 如有必要，给出一个简单的集成测试示例

业务需求如下：
【在这里详细描述业务规则、输入输出、状态流转、边界情况】
```

---

### 2. 已有代码上添加新接口（复用现有领域模型）

```text
任务：在现有模块中增加一个新的 REST 接口，复用当前领域模型和应用服务。

信息：
- 当前模块包路径前缀：`com.xxx.project`
- 相关领域对象与服务类：
  - 列出已有的领域类和 service 类路径（如果知道）

请按以下要求输出：
1）分析应放在哪个 COLA 层，使用哪个现有应用服务或领域服务，如果需要新增，请说明。
2）给出 Controller 方法完整代码：
   - 使用 Swagger 注解
   - 使用统一响应包装类型
   - 参数校验注解
3）如需要新增 application 层方法，给出方法签名和实现。
4）如需要调整 DTO 或 Command，对调整点进行说明并给出代码。
5）给出针对这个接口的最小单元测试或集成测试示例。

具体接口需求如下：
【在这里写清楚 URL 大致形式、输入字段、输出结构、业务规则】
```

---

### 3. MyBatis-Plus 实体与持久化设计模板

```text
任务：为下面这张表设计 MyBatis-Plus 实体和持久化层代码，并融入 DDD + COLA 架构。

表结构：
【贴出建表 SQL 或字段列表】

请按以下要求输出：
1）给出实体类：
   - 使用 MyBatis-Plus 注解（如 @TableName、@TableId、@TableField）
   - 考虑继承公共字段基类（如有 id, gmtCreate, gmtModified 等）

2）给出 Mapper 接口：
   - 继承 BaseMapper<实体>
   - 如有典型查询，给出示例方法声明

3）给出领域仓储接口定义（domain 层）：
   - 以业务语义命名方法，而不是 SQL 语义
   - 说明每个方法的意图

4）给出仓储实现（infrastructure 层）：
   - 使用 MyBatis-Plus 实现领域仓储接口
   - 使用 LambdaQueryWrapper / LambdaUpdateWrapper 的示例

5）说明实体是否应该是领域模型的一部分，还是纯 DataObject，并给出推荐分层方式。
```

---

### 4. 生成测试用例模板（针对已有代码）

```text
任务：为下面的代码生成测试用例，使用 JUnit 和常见的 Spring 测试工具，符合 DDD + COLA 的结构。

代码：
【贴上需要测试的 Service / Domain Service / Controller 代码】

要求：
1）先列出需要覆盖的测试场景清单，包括：
   - 正常路径
   - 业务异常
   - 边界条件
   - 重要的幂等或重复调用场景

2）为 application 层 service 给出单元测试类：
   - 使用 mock 的仓储或依赖服务
   - 不访问真实数据库

3）如有必要，为关键数据库操作给出一个简单的集成测试：
   - 说明需要的测试配置（如 H2 / test profile）
   - 提供一个最小可运行的测试案例代码

4）测试命名规范建议：
   - 类名、方法名命名规则说明
```

---

### 5. 旧代码理解与重构模板

```text
任务：理解并重构一段旧代码，使其更符合 DDD + COLA + 我当前技术栈的规范。

旧代码：
【贴旧代码，可以是 Service、Controller、Repository 等】

请按以下顺序输出：
1）用自然语言解释这段代码当前做了什么，注意：
   - 标出明显的架构或职责混乱点
   - 标出和 DDD + COLA 原则冲突的地方

2）给出重构方案设计：
   - 哪些逻辑应该移动到 domain 层
   - 哪些逻辑属于 application 层
   - 哪些是 adapter 层的职责
   - 仓储接口应该长什么样

3）给出重构后的包结构和类列表：
   - 完整限定名

4）给出核心重构后代码：
   - 重构后的 domain service 或聚合根的关键方法
   - 重构后的 application service
   - 如涉及持久化，也给出对应仓储实现片段

5）给出一条迁移建议：
   - 如何在不影响线上业务的情况下逐步替换旧实现
```

---

### 6. 自动生成接口文档和说明模板

```text
任务：为下面的 Controller 和 DTO 自动补全 Swagger 注解，并生成一段可读性好的 API 文档说明。

代码：
【贴当前 Controller / DTO】

要求：
1）补全或优化 Swagger 注解：
   - @Operation 的 summary、description
   - @Parameter 的描述
   - @Schema 的字段含义说明

2）输出一段自然语言 API 文档：
   - 接口用途
   - 请求方式和 URL
   - 请求参数说明（含校验规则）
   - 返回值结构说明
   - 主要错误码和含义

3）确保文档用语面向调用方，而不是面向实现。
```

---

## 三、一个结合你技术栈的示例 Prompt（可直接改名复用）

以“订单取消”为例，你可以这样下指令：

```text
【全局上下文：按前面的项目上下文模板粘贴】

现在根据以下业务需求，帮我在当前项目中设计并实现“订单取消”功能。

业务需求：
- 用户可以取消处于“待发货”状态的订单
- 已发货或已完成的订单不允许取消
- 取消成功后需要：
  - 回滚库存
  - 记录一条订单操作日志
- 企业版客户还需要发送一条取消通知到外部系统（可以用 domain event + infrastructure 适配）

请按“新业务功能 / 用例开发模板”的流程输出：
- 先给出 DDD + COLA 分层设计
- 然后给出包结构和类命名建议
- 再给出关键代码实现，包含：
  - Controller（带 Swagger）
  - application service
  - domain 聚合或领域服务
  - domain 仓储接口
  - MyBatis-Plus 实体、Mapper、仓储实现
- 最后给出测试场景清单和一个示例测试类
```

---

如果你愿意贴出你现在某个真实模块的包结构和一两段代码，我可以按你的实际目录帮你定制一份完全贴合你项目的 Prompt 模板版本。
