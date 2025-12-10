
短结论：
对你这种后端（DDD+COLA + Spring Boot + MyBatis-Plus），把上面那些“零散 prompt 模板”收敛到 Spec Kit 里，会更好、更稳定。
Spec Kit 把「全局约束 + 需求规格 + 技术方案 + 任务拆解」固化成文件和指令，正好对应我们刚才的那些模板。([GitHub][1])

下面按 **Spec Kit 全流程**，逐步把你前面的模板映射成可以直接用的 `/speckit.*` 规范。

---

## 0. Spec Kit 流程总览（和你刚才那些模板的对应关系）

Spec Kit 推荐的基本步骤：([GitHub][1])

1. `/speckit.constitution`：项目「宪法」+ 开发规范
2. `/speckit.specify`：业务规格，写“做什么 / 为什么”
3. `/speckit.plan`：技术实现计划（栈、架构、分层）
4. `/speckit.tasks`：自动拆成任务列表
5. `/speckit.implement`：按任务执行实现

和我之前给你的内容对应关系：

* 我给你的「全局上下文模板」 → 放进 `/speckit.constitution`
* 「新业务功能 / 用例开发模板」 → 拆成 `/speckit.specify` + `/speckit.plan`
* 测试/文档/重构模板 → 写在 constitution 的“质量规范” + 每个 feature 的“验收标准”里

下面逐步给出 **每个步骤具体该写什么**，都按你的技术栈定制。

---

## 1. `/speckit.constitution`：项目宪法（放全局规则）

用途：把你刚才说的「我用 Swagger, Spring Boot, MyBatis-Plus, DDD+COLA, Maven」变成项目级规则，让所有后续 `/speckit.*` 和 agent 都遵守。([GitHub][1])

在你的 agent 里输入类似：

```text
/speckit.constitution

你是一個後端專案的 AI 協作者，請為本專案建立一份「專案憲法 (Constitution)」，內容包含：

# 技術棧
- Java 17
- Spring Boot
- Maven
- DDD + COLA 分層架構
- MyBatis-Plus 做 ORM
- Swagger / OpenAPI 做接口文件

# 分層規範（DDD + COLA）
- adapter 層：REST Controller + API DTO，負責 HTTP、驗證、Swagger 註解
- application 層：用例服務、Command/Query，組裝 DTO，不直接操作 MyBatis-Plus
- domain 層：聚合根、領域服務、領域事件，不依賴 Spring / MyBatis 等框架
- infrastructure 層：MyBatis-Plus Entity / Mapper、Repository 實作、對外系統適配

# MyBatis-Plus 使用規範
- Mapper 需繼承 BaseMapper<Entity>
- 優先使用 LambdaQueryWrapper / LambdaUpdateWrapper
- 複雜查詢如有必要再用 XML / 自訂 SQL
- 禁止在 Controller 直接調用 Mapper

# API / Swagger 規範
- 所有 REST API 使用統一 Response 包裝，如 CommonResponse<T>
- Controller 使用 @Operation, @Parameter, @Schema 補完整文件
- HTTP 方法語義：
  - GET 查詢
  - POST 創建
  - PUT/PATCH 修改
  - DELETE 刪除

# 測試規範
- Application 層須有單元測試（mock repository）
- 關鍵領域服務須有單元測試
- 關鍵流程須有至少一個 Spring Boot 整合測試
- 每個新 feature 要定義可驗證的驗收條件

# 代碼品質
- 例外使用自訂業務例外 + 全域 Exception Handler
- DDD 原則：貫徹聚合、限界上下文，禁止貧血模型
- 新代碼優先使用已存在的領域模型，而非重複造輪子

請用 Markdown 條列方式輸出，作為本專案的長期開發指南。
```

后续所有 `/speckit.*` 命令会把这个当成全局背景。

---

## 2. `/speckit.specify`：业务规格（代替“乱聊需求”）

用途：写“做什么 / 为什么”，不要写实现细节。Spec Kit 官方建议这里聚焦需求而非技术堆栈。([GitHub][1])

示例：为“订单取消”功能写 `/speckit.specify`：

```text
/speckit.specify

請為「訂單取消」功能建立一份規格說明，格式請包含以下段落：

# 1. 背景與目標
- 說明為什麼需要「訂單取消」功能
- 服務對象（一般用戶 / 管理員 / 企業客戶）

# 2. 用戶故事
- 作為「一般用戶」，我可以在訂單尚未出貨時取消訂單
- 作為「企業客戶」，取消訂單時需要額外觸發對外通知
- 如有其他角色，一併列出

# 3. 業務規則
- 只有狀態為「待出貨」的訂單可以取消
- 已出貨或已完成的訂單不可取消，需回傳對應錯誤碼
- 取消成功時：
  - 回補商品庫存
  - 寫入訂單操作日誌
  -（企業客戶）發送一則取消通知給外部系統
- 禁止的行為與例外情況

# 4. 非功能性需求
- 取消操作必須是冪等的：同一筆訂單重複取消不會造成重複回補庫存
- 在高併發情況下，不能出現庫存負數
- 操作須被完整稽核記錄：誰在何時取消了哪一筆訂單

# 5. 驗收條件 (Acceptance Criteria)
- 提供 5~10 個可機器驗證的條件，例如：
  - 給定一筆狀態為「待出貨」的訂單，當用戶請求取消時，訂單狀態變為「已取消」，庫存恢復
  - 給定一筆狀態為「已出貨」的訂單，取消請求會被拒絕並返回特定錯誤碼
  - 對同一訂單連續發送兩次取消請求，不會造成庫存被重複回補
```

这一步就是把“新业务功能 / 用例开发模板”的业务部分放进 Spec Kit。

---

## 3. `/speckit.plan`：技术实现计划（对应你的架构 / 分层）

用途：把“如何用 Spring Boot + COLA + MyBatis-Plus 实现”写清楚，Spec Kit 建议在这里说明技术栈和架构选择。([GitHub][1])

示例：

```text
/speckit.plan

根據目前專案憲法與「訂單取消」的規格說明，請制定一份技術實作計畫，內容請包含：

# 1. 技術棧與架構選擇
- 使用 Spring Boot + Maven
- 使用 DDD + COLA 分層
- 使用 MyBatis-Plus 操作訂單與庫存資料表
- 使用 Swagger 暴露 REST API 文件
- 取消流程內部使用領域事件觸發庫存回補與對外通知

# 2. 分層設計
請明確列出將新增或修改的類別與分層：

- adapter 層
  - REST Controller：`com.xxx.order.adapter.api.OrderCancelController`
  - 輸入/輸出 DTO 類別

- application 層
  - Application Service：`com.xxx.order.application.service.OrderCancelService`
  - Command 物件：`CancelOrderCommand`（包含 orderId, operatorId, tenantType 等）

- domain 層
  - 聚合根：`Order`（新增 cancel() 行為）
  - 值物件或領域服務：例如 `InventoryService`, `OrderLogService`
  - 領域事件：`OrderCanceledEvent`

- infrastructure 層
  - MyBatis-Plus Entity：`OrderDO`, `InventoryDO`
  - Mapper：`OrderMapper`, `InventoryMapper`
  - Repository 實作：`OrderRepositoryImpl`, `InventoryRepositoryImpl`
  - 外部通知適配器：例如 `ExternalNotificationClient`

# 3. 資料模型與資料表
- 描述訂單與庫存相關的主要欄位
- 需要新增的欄位（例如取消原因、取消時間等）

# 4. 交易與一致性
- 取消訂單與庫存回補是否在同一個交易中完成
- 對外通知是否透過 Outbox Pattern 或領域事件非同步發送

# 5. 測試計畫
- Application 層單元測試：模擬 repository 與外部服務
- Domain 層測試：對 Order.cancel() 行為的單元測試
- 整合測試：從 REST API 觸發取消，檢查資料庫與日誌是否正確

請以條列清單與小節方式輸出，重點在「類別清單 + 責任分配」，不要直接生成程式碼。
```

这一步就是把之前“新功能模板”里关于架构、包结构、类名的部分，变成 spec-kit 的 `plan`。

---

## 4. `/speckit.tasks`：任务拆解（你主要负责审阅）

用途：Spec Kit 会根据 `specify` + `plan` 自动拆任务，命令本身通常不需要额外 prompt。([GitHub][1])

你只需要在 agent 里调用：

```text
/speckit.tasks
```

然后：

* 检查任务列表是否按 **COLA 层次**拆开
* 看有没有缺少：

  * Domain 行为实现
  * Repository 实作
  * 测试任务（单元/集成）
  * Swagger 文档和异常处理

如果不满意，可以再加一段指示让它重新生成任务，例如：

```text
/speckit.tasks

重新產生任務列表，要求：
- 以「adapter / application / domain / infrastructure / test」分組
- 每個任務標明輸出檔案或類別名稱
- 測試任務必須覆蓋 Application 與 Domain 層
```

---

## 5. `/speckit.implement`：执行实现（结合你栈的约束）

用途：让 agent 按任务逐项实现。官方示例是直接 `/speckit.implement`，但你可以加入质量要求。([GitHub][1])

建议你这样用：

```text
/speckit.implement

依照目前的任務列表開始實作，請遵守以下規範：
- 代碼需符合專案憲法中的 DDD + COLA 分層約定
- Repository 只出現在 domain 接口與 infrastructure 實作，不得出現在 Controller
- 所有公開 REST API 需要補齊 Swagger 註解
- 為 Application 層 service 產生單元測試；為關鍵流程（訂單取消）產生 1 個整合測試
- 優先完成 Domain 行為與測試，再完成 Controller 層

實作時請分階段輸出：
1）先生成 Domain + Repository 相關代碼
2）再生成 Application 層
3）最後生成 Controller + 測試
每個階段結束前先列出將要新增或修改的檔案清單，再給出代碼。
```

你在这个阶段要做的是：

* Review 代码
* 提出具体修改，让 agent 按任务修正，而不是自己从头重写

---

## 6. 把“测试 / 文档 / 重构模板”固化到 Constitution 和 Spec

你之前问的那些测试、Swagger 文档、重构规范，不需要每次都写大段 prompt，可以：

1. 放到 `/speckit.constitution` 的固定段落：

   * “測試策略”
   * “文件與 Swagger 規範”
   * “重構與舊代碼處理策略”

2. 在每个 `/speckit.specify` 的尾部加 “驗收條件”

   * 用接近 BDD 的语句写清楚预期行为
   * 让后续 `/speckit.tasks` 自动生成对应测试任务

这样你以后只需要写：

* 业务规则
* 少量特例
  其他重复的工程规范都由 Spec Kit + 憲法来保证。

---

## 7. 是否“绝对更好”的真实答案

现实反馈里，有人发现 Spec Kit 会多花时间写 Markdown，但不一定总是带来更少 bug，这是目前讨论点。([Scott Logic][2])

对你这种情况的结论：

* **长期维护项目 / 多人协作 / DDD 架构**：用 Spec Kit，把规范固定下来，是值得的。
* **一次性的 POC / spike / 小脚本**：直接用我前面那种大 prompt 模板就行，Spec Kit 的开销可能不划算。

你如果想，我可以帮你把一个真实的业务功能，完整写成：

* 一份 `/speckit.constitution` 片段
* 一份针对该功能的 `/speckit.specify`
* 一份 `/speckit.plan`

你只要给我：**这个功能的业务描述 + 当前模块的包名前缀**。

[1]: https://github.com/doggy8088/spec-kit "GitHub - doggy8088/spec-kit:  幫助您開始規格驅動開發的工具包"
[2]: https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html?utm_source=chatgpt.com "Putting Spec Kit Through Its Paces: Radical Idea or ..."
