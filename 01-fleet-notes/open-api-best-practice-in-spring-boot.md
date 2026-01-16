---
tags:
id: 20251209175849
created: 2025-12-09
reviewed: false
status:
  - pending
  - done
  - in_progress
type: fleet-note
---
目标很明确：让 OpenAPI Generator 拿到的信息足够“完整、稳定、可读”。可以按三个层级处理：
1）接口本身 2）参数 3）请求/响应模型与全局配置。

下面都是基于 springdoc-openapi 的用法。

---

## 1. 接口本身需要的注解

在每个接口方法上建议统一做到：

1. `@Operation`

   * `operationId`：生成代码时的方法名来源，必须唯一且稳定
   * `summary`：一句话概述
   * `description`：补充说明（业务语义、注意事项）
   * `tags`：接口分组，生成的客户端会按 tag 分包或分类
   * `deprecated`：废弃接口标识
   * `security`：和你的认证方案对应

示例：

```java
@Operation(
    operationId = "getUserById",
    summary = "查询用户详情",
    description = "根据用户ID查询单个用户的详细信息",
    tags = {"User"},
    security = {@SecurityRequirement(name = "BearerAuth")}
)
```

2. `@ApiResponses` / `@ApiResponse`
   对成功和失败响应都写清楚，让生成的客户端能区分返回模型：

```java
@ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "查询成功",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = UserDetailResponse.class)
        )
    ),
    @ApiResponse(
        responseCode = "400",
        description = "请求参数错误",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    ),
    @ApiResponse(
        responseCode = "404",
        description = "用户不存在",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    )
})
```

注意：

* 有 `204 No Content` 的场景可以用 `responseCode = "204"` 且 `content = @Content()`，告诉生成器返回体为空。
* 所有错误响应尽量用统一的 `ErrorResponse` 模型，便于客户端统一处理。

---

## 2. 参数层面的注解

目标：所有入参都有明确来源、类型、必填性、示例和约束。

### 2.1 路径参数

```java
@GetMapping("/users/{id}")
public UserDetailResponse getUserById(
    @Parameter(
        name = "id",
        in = ParameterIn.PATH,
        description = "用户ID",
        required = true,
        example = "123"
    )
    @PathVariable("id")
    Long id
) { ... }
```

要点：

* `@PathVariable` + `@Parameter(in = PATH)`
* `required = true` 与示例值

### 2.2 查询参数（分页等）

```java
@GetMapping("/users")
@Operation(
    operationId = "listUsers",
    summary = "分页查询用户列表",
    tags = {"User"}
)
@ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "查询成功",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = PageResponseUserSummary.class)
        )
    )
})
public PageResponseUserSummary listUsers(
    @Parameter(
        in = ParameterIn.QUERY,
        description = "页码，从1开始",
        example = "1"
    )
    @RequestParam(name = "page", defaultValue = "1")
    @Min(1)
    Integer page,

    @Parameter(
        in = ParameterIn.QUERY,
        description = "分页大小",
        example = "20"
    )
    @RequestParam(name = "size", defaultValue = "20")
    @Min(1) @Max(100)
    Integer size,

    @Parameter(
        in = ParameterIn.QUERY,
        description = "模糊匹配用户名",
        example = "alice"
    )
    @RequestParam(name = "username", required = false)
    String username
) { ... }
```

要点：

* `@RequestParam` + `@Parameter(in = QUERY)`
* 使用 Bean Validation 注解（`@Min/@Max/@Size/@NotBlank` 等）让 springdoc 把约束带入 OpenAPI
* 默认值建议用 `defaultValue`，生成器会映射成客户端默认值

### 2.3 Header 参数（除认证外）

```java
public ResponseEntity<Void> demo(
    @Parameter(
        in = ParameterIn.HEADER,
        name = "X-Request-Id",
        description = "请求唯一标识，用于追踪",
        required = false,
        example = "req-20240101-0001"
    )
    @RequestHeader(name = "X-Request-Id", required = false)
    String requestId
) { ... }
```

### 2.4 请求体参数

只要是 JSON 体，使用 `@RequestBody`，并确保 DTO 上有完整的 `@Schema`：

```java
@PostMapping("/users")
@Operation(
    operationId = "createUser",
    summary = "创建用户",
    tags = {"User"},
    security = {@SecurityRequirement(name = "BearerAuth")}
)
@ApiResponses({
    @ApiResponse(
        responseCode = "201",
        description = "创建成功",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = UserDetailResponse.class)
        )
    ),
    @ApiResponse(
        responseCode = "400",
        description = "参数校验失败",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    )
})
public ResponseEntity<UserDetailResponse> createUser(
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "创建用户请求体",
        required = true
    )
    @Valid
    @RequestBody
    CreateUserRequest request
) { ... }
```

---

## 3. 模型（DTO、List、枚举）的注解与约束

### 3.1 DTO 类本身

```java
@Schema(name = "CreateUserRequest", description = "创建用户的请求参数")
public class CreateUserRequest {

    @Schema(description = "用户名", example = "alice", maxLength = 32)
    @NotBlank
    private String username;

    @Schema(description = "邮箱地址", example = "alice@example.com")
    @Email
    private String email;

    @Schema(description = "用户年龄", example = "18", minimum = "0", maximum = "150")
    @Min(0)
    @Max(150)
    private Integer age;

    @ArraySchema(                 // 你自己的 List 规则
        schema = @Schema(
            description = "标签",
            example = "这儿不要写example" // 按你之前的规则，不在 ArraySchema 里写 example
        )
    )
    private List<@Schema(description = "单个标签", example = "vip") String> tags;

    @Schema(description = "用户状态", example = "ENABLED")
    private UserStatus status;
}
```

根据你之前的要求：

* List 字段用 `@ArraySchema`，不要在 `@ArraySchema` 里写 `example`
* List 的泛型类型本身再加 `@Schema`
* 字段用 Bean Validation 注解标识约束，springdoc 会带入 OpenAPI

### 3.2 分页响应模型

让生成器产出的客户端能直接拿到分页结构：

```java
@Schema(name = "PageResponseUserSummary", description = "用户列表分页响应")
public class PageResponseUserSummary {

    @Schema(description = "当前页码", example = "1")
    private Integer page;

    @Schema(description = "每页大小", example = "20")
    private Integer size;

    @Schema(description = "总记录数", example = "100")
    private Long total;

    @ArraySchema(
        arraySchema = @Schema(description = "用户列表"),
        schema = @Schema(implementation = UserSummary.class)
    )
    private List<UserSummary> records;
}
```

### 3.3 枚举

你之前问过，这里给一个更贴近生成器使用的写法：

```java
@Schema(description = "用户状态枚举", example = "ENABLED")
public enum UserStatus {
    ENABLED,
    DISABLED,
    LOCKED
}
```

如果你用 Jackson 的 `@JsonValue` 自定义序列化（例如转成数字或 code），要保证 OpenAPI 里描述的例子和真实返回一致。

### 3.4 统一错误响应模型

让 OpenAPI Generator 生成一个稳定的错误类型，方便客户端统一处理异常：

```java
@Schema(name = "ErrorResponse", description = "统一错误响应")
public class ErrorResponse {

    @Schema(description = "错误码", example = "USER_NOT_FOUND")
    private String code;

    @Schema(description = "错误信息", example = "用户不存在")
    private String message;

    @Schema(description = "请求ID，便于排查问题", example = "req-20240101-0001")
    private String requestId;
}
```

所有可能返回错误的接口都在 `@ApiResponse` 里引用这个模型即可。

---

## 4. 全局配置层面（OpenAPI / 安全 / Server 信息）

1. 安全方案（你之前提到的认证头）：

```java
@SecurityScheme(
    name = "BearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
@Configuration
public class OpenApiSecurityConfig {
}
```

2. 可选：声明全局的 `OpenAPI` bean，设置服务器地址和全局信息，方便生成器识别 base url：

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("Hive Application API")
            .version("v1")
            .description("Hive 后台服务接口"))
        .servers(List.of(
            new Server().url("https://api.example.com").description("生产环境"),
            new Server().url("https://staging-api.example.com").description("预发布环境")
        ));
}
```

生成的客户端通常会用第一个 server 作为默认 base URL。

---

## 5. 面向 OpenAPI Generator 的“实用检查清单”

在你希望生成“生产可用客户端/CLI”的接口上，可以按这个清单检查：

1. 每个接口是否有：

   * 稳定唯一的 `operationId`
   * 合理的 `tags`
   * 完整的 `@ApiResponses`（成功 + 统一错误类型）
   * 正确的 `security` 引用

2. 所有参数是否：

   * 明确标明来源（PATH / QUERY / HEADER / COOKIE / BODY）
   * 设置了 `required` 或对应的默认值
   * 有清晰的 `description` 和合理的 `example`
   * 关键数值参数有 Bean Validation 约束

3. 所有请求/响应模型是否：

   * 类上有 `@Schema(name, description)`
   * 字段上有 `@Schema` 或 `@ArraySchema`（遵守你 List 的规则）
   * 枚举有 `@Schema` 描述和示例
   * 错误响应统一用一个模型

4. 全局是否：

   * 配置了 `@SecurityScheme`
   * 有 `OpenAPI` bean 指定 server url（可选但推荐）

只要做到这些，用 OpenAPI Generator 生成 Golang 客户端或你后续封装的 CLI，一般就已经达到“生产可用”的信息完备度。


# References

# Link to