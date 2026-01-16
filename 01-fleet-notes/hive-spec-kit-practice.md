---
tags:
  - spec-kit
id: 20251211141126
created: 2025-12-11
reviewed: false
status:
  - in_progress
type: fleet-note
---

Target: Implement the CLI.

Init the project.

```shell
specify init --here --ai copilot --no-git
```

Output:

```shell
Warning: Current directory is not empty (15 items)
Template files will be merged with existing content and may overwrite existing files
Do you want to continue? [y/N]: y

Selected AI assistant: copilot
Selected script type: sh
Initialize Specify Project
Initialize Specify Project
├── ● Check required tools (ok)
├── ● Select AI assistant (copilot)
├── ● Select script type (sh)
├── ● Fetch latest release (release v0.0.90 (59,640 bytes))
├── ● Download template (spec-kit-template-copilot-sh-v0.0.90.zip)
├── ● Extract template
├── ● Archive contents (39 entries)
├── ● Extraction summary (temp 3 items)
├── ● Ensure scripts executable (5 updated)
├── ● Cleanup
├── ○ Initialize git repository (--no-git flag)
└── ● Finalize (project ready)

Project ready.

Some agents may store credentials, auth tokens, or other identifying and private artifacts in the agent folder within your project.                               

Consider adding .github/ (or parts of it) to .gitignore to prevent accidental credential leakage.


Next Steps

1. You're already in the project directory!                                   
2. Start using slash commands with your AI agent:                             
   2.1 /speckit.constitution - Establish project principles                   
   2.2 /speckit.specify - Create baseline specification                       
   2.3 /speckit.plan - Create implementation plan                             
   2.4 /speckit.tasks - Generate actionable tasks                             
   2.5 /speckit.implement - Execute implementation


Enhancement Commands

Optional commands that you can use for your specs (improve quality & confidence) 

 ○ /speckit.clarify (optional) - Ask structured questions to de-risk ambiguous areas before planning (run before /speckit.plan if used)
 ○ /speckit.analyze (optional) - Cross-artifact consistency & alignment report (after /speckit.tasks, before /speckit.implement)
 ○ /speckit.checklist (optional) - Generate quality checklists to validate requirements completeness, clarity, and consistency (after /speckit.plan)
```


## To develop the CLI.
### Consitution

```shell
Create principles focused on code quality, testing standards, user experience consistency, and performance requirements. Include governance for how these principles should guide technical decisions and implementation choices.

AI agents must treat `.specify/templates/*` and `.specify/scripts/*` as read-only infrastructure files. Do not modify them when running `/speckit.*` commands.

Go CLI using Cobra under cli/.
Generated Go SDK from OpenAPI under clients/golang.
The source openapi.json is application/docs/openapi.json.

CLI modules:
* auth module: Keycloak login, token local storage, token refresh.
* service module: create/list/patch/delete/redeploy/status services via SDK
* configuration module: create docker config/create github config/list/delete via SDK.
* log module: query log via SDK.

Rules:
* Implement modules sequentially. The current active module is explicitly specified in /speckit.specify and /speckit.plan
* When planning or implementing, touch only the currently active module unless explicitly told otherwise.
* Always reuse Go SDK from clients/, no duplicate HTTP clients.
* Keep Cobra structure idiomatic and commands grouped by module.
```


### Specify

```shell
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements. Include governance for how these principles should guide technical decisions and implementation choices. AI agents must treat .specify/templates/* and .specify/scripts/* as read-only infrastructure files. Do not modify them when running /speckit.* commands. Go CLI using Cobra under cli/. Generated Go SDK from OpenAPI under clients/golang. The source openapi.json is application/docs/openapi.json. CLI modules: * auth module: Keycloak login, token local storage, token refresh. * service module: create/list/patch/delete/redeploy/status services via SDK * configuration module: create docker config/create github config/list/delete via SDK. * log module: query log via SDK. Rules: * Implement modules sequentially. The current active module is explicitly specified in /speckit.specify and /speckit.plan * When planning or implementing, touch only the currently active module unless explicitly told otherwise. * Always reuse Go SDK from clients/, no duplicate HTTP clients. * Keep Cobra structure idiomatic and commands grouped by module.
```

# References

可以，完全可以按“模块节奏”来用 Spec Kit，让 CLI 按登录 → service 创建一步步走，而不是一口气全部摊开。

给一个可执行方案，分四步，全部是你在 Copilot 里要输入的东西。

---

## 总体思路

* 把 CLI 拆成模块：`auth` 模块（登录、token、refresh）、`service` 模块（service 创建、更新、删除）等。
* 每次只让 Spec Kit 关注一个模块：

  * 当前阶段只做 `auth`。
  * `auth` 做完，再开启 `service` 模块。
* 对每个模块，完整跑一轮：`constitution` 保持不变，`specify` 限定范围，`plan` 只计划这个模块，`tasks` 拆小任务，`implement` 逐个实现。

下面按“模块化 + 节奏可控”的方式拆开。

---

## Step 1：在 constitution 里定义“模块边界”

只需要设置一次，后面所有模块复用。

在 Copilot Chat 输入类似：

> /speckit.constitution
> Project context:
>
> * Go CLI using Cobra under `cli/`.
> * Generated Go SDK from OpenAPI under `clients/`.
>
> CLI modules:
>
> * `auth` module: Keycloak login, token storage, token refresh.
> * `service` module: create/list/update/delete services via SDK.
> * Future modules will be added later, one at a time.
>
> Rules:
>
> * Implement modules sequentially. The current active module is explicitly specified in `/speckit.specify` and `/speckit.plan`.
> * When planning or implementing, touch only the currently active module unless explicitly told otherwise.
> * Always reuse Go SDK from `clients/`, no duplicate HTTP clients.
> * Keep Cobra structure idiomatic and commands grouped by module.

重点是这一句：

> Implement modules sequentially. The current active module is explicitly specified in `/speckit.specify` and `/speckit.plan`.

这样之后每次你说“当前只做 auth module”，它会收敛范围。

---

## Step 2：按模块写 spec（先只做 auth）

现在只做“用户登录模块”。

在 Copilot Chat 输入：

> /speckit.specify
> Active module: `auth` only.
> Other modules (such as `service`) are out of scope for now and should not be specified or implemented yet.
>
> For the `auth` module, define the CLI behavior as follows:
>
> * Commands
>
>   * `mycli auth login`:
>
>     * Use Keycloak to obtain access and refresh tokens.
>     * Support reading Keycloak config (realm, client id, auth url, token url) from a config file.
>     * On success, persist tokens securely on disk.
>   * `mycli auth status`:
>
>     * Show whether the user is logged in.
>     * Show token expiry times and which environment is active.
>   * `mycli auth logout` (optional):
>
>     * Clear stored tokens.
>   * `mycli auth refresh`:
>
>     * Use the refresh token to get a new access token and update stored tokens.
> * Token storage
>
>   * Store tokens in a platform-appropriate config directory.
>   * Keep format simple (JSON/YAML).
>
> Describe only this module in the spec. Do not include `service` commands yet.

这样生成的 spec 只会围绕 `auth`，service 不会出现。

后面 service 模块再开一轮新的 `specify`（可以是补充 spec 或新 spec 文件），届时把 Active module 改成 `service`。

---

## Step 3：针对当前模块跑 plan 和 tasks

### 3.1 /speckit.plan 只规划 auth 模块

> /speckit.plan
> Active module: `auth` only.
> Plan the implementation of the `auth` module for the CLI with these constraints:
>
> * Use Cobra under `cli/cmd/...`.
> * Implement `auth` commands under `cli/cmd/auth_*.go` or `cli/cmd/auth/*.go`.
> * Put Keycloak and token storage logic under `cli/internal/auth`.
> * Read Keycloak config and API base URLs from `cli/internal/config`.
> * Do not plan any `service` module commands yet.
>
> The plan should be incremental and suitable for multiple small PRs.

它会给一个只针对 auth 的实现计划。

### 3.2 /speckit.tasks 拆成小任务

> /speckit.tasks
> Active module: `auth`.
> Generate a list of small, incremental tasks to implement only the `auth` module plan.
> Requirements:
>
> * Tasks must be ordered so they can be implemented one by one.
> * Each task must list which files under `cli/` will be created or modified.
> * Do not create tasks for the `service` module. That will be a separate phase.

你就得到一个“auth 专属”的 task 列表，例如：

1. 在 `cli/` 下初始化 Cobra skeleton
2. 实现 `internal/config` 的最小配置读取
3. 实现 `internal/auth` 的 token 模型和存储
4. 实现 `auth login` 命令
5. 实现 `auth status` 命令
6. 实现 `auth refresh` 命令
   ……

---

## Step 4：用 /speckit.implement 控节奏

你想慢就慢，想快就快，完全由你决定一次实现几个任务。

例子：一次只实现一个任务。

> /speckit.implement
> Active module: `auth`.
> Implement only the first pending task for the `auth` module.
>
> * Do not touch any `service` module code or commands.
> * Show a summary of created and modified files.

它改完，你检查 diff，跑 `go test` 或 `go build`，决定继续还是调整。

你也可以指定具体任务编号，例如：

> /speckit.implement
> Active module: `auth`.
> Implement task 3 from the task list:
>
> * Implement `internal/auth` token structures and file-based storage.
> * No CLI commands yet.
> * Do not modify any files related to the `service` module.

这样你就可以：
登录模块全部完成并验证后，再进入下一个模块。

---

## Step 5：auth 完成后，再开启 service 模块

auth 模块完成后，开始 service 模块时，流程再来一遍，但明确切换 Active module。

例如：

### 5.1 service 模块 spec

> /speckit.specify
> Active module: `service`.
> The `auth` module is already implemented and should be treated as existing infrastructure.
>
> Define CLI behavior for the `service` module:
>
> * Commands (examples):
>
>   * `mycli service create ...`
>   * `mycli service list`
>   * `mycli service get --id <ID>`
> * All service commands must:
>
>   * Use stored tokens from `auth` module.
>   * Use the generated Go SDK under `clients/...` to call the Java REST API.
>   * Fail clearly if the user is not logged in.

### 5.2 service 模块 plan / tasks / implement

再跑一次 `/speckit.plan` 和 `/speckit.tasks`，同样加一句：

> Active module: `service`. Do not modify `auth` module behavior.

然后用 `/speckit.implement` 一条条接着做。

---

## 总结

想要“命令模块化 + 自己控制节奏”，关键有三点：

1. 在 constitution 里声明“模块划分 + 顺序开发”。
2. 每次在 `/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement` 的 prompt 里明确 `Active module`，并写清楚“其他模块 out of scope”。
3. 每次只实现一个或少数几个 task，用 diff 和本地编译来卡质量，再继续下一步。

如果你把现在 `cli/` 的目录结构和一个典型的 OpenAPI SDK 包名贴出来，我可以给一组更具体的中文 prompt，直接包含真实命令名和包名，贴进 Copilot 即用。


# Link to