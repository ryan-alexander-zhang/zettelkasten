---
tags:
  - iam
  - key-cloak
  - harbor
id: 20251209103902
created: 2025-12-09
reviewed: false
status:
  - pending
type: fleet-note
---


> [!WARNING] WARNING
> You can change the authentication mode from database to OIDC only if no local users have been added to the database. If there is at least one user other than `admin` in the Harbor database, you cannot change the authentication mode.

结论：**只在 Keycloak 里建用户，Harbor 是不会“自动认识”这个用户的**。你需要先把 Harbor 配置成用 Keycloak 做 OIDC 登录，之后这个用户在 Harbor 登录页点 “Login with Keycloak” 才能直接登录 Harbor。

下面给你一个最小可行步骤，假设你已经有：

* 一个可访问的 Harbor 地址：`https://harbor.example.com`
* 一个可访问的 Keycloak，已经建好了用户

---

## 一、在 Keycloak 里为 Harbor 创建 Client

1. 进入对应 Realm → `Clients` → `Create client`

2. 主要配置（以新版 Keycloak UI 为例）([Makson Lee][1])

   * Client type：`OpenID Connect`
   * Client ID：`harbor`（名字随意，下面要和 Harbor 一致）
   * 启用：

     * Client authentication：开启
     * Standard flow：开启
     * 其他 flow（Device, CIBA, Token Exchange 等）：可以关掉
   * 登录相关：

     * Root URL：`https://harbor.example.com`
     * Valid redirect URIs：`https://harbor.example.com/c/oidc/callback`
     * Web origins：`https://harbor.example.com`

3. 保存后，进入这个 client：

   * 在 `Credentials` 页面拿到 `Client Secret`（后面要填到 Harbor）

到这里 Keycloak 端就算把 Harbor 当作一个 OIDC 客户端注册好了。

---

## 二、在 Harbor 中配置 OIDC = Keycloak

1. 用 Harbor 本地管理员账号登录（`admin` + 安装时设的密码）

2. 进入：`Administration` → `Configuration` → `Authentication`([goharbor.io][2])

3. 配置：

   * Auth Mode：`OIDC`
   * Primary Auth Mode：可以勾选为开启（Harbor 2.13+ 有这个选项）
   * OIDC Provider Name：`keycloak`（显示名，随意）
   * OIDC Provider Endpoint（很关键）：
     `https://<你的-keycloak-host>/realms/<你的-realm-name>`
     例如：`https://keycloak.example.com/realms/harbor`
   * OIDC Client ID：上一步在 Keycloak 里填的，比如 `harbor`
   * OIDC Client Secret：从 Keycloak client 的 Credentials 页面复制的那个
   * OIDC Scope：`openid,profile,email`（需要包含 `openid`，一般加上 `profile,email`）([goharbor.io][2])
   * Username Claim：通常填 `preferred_username`
   * Automatic onboarding：建议勾上，这样用户第一次用 OIDC 登录时，会自动在 Harbor 里创建对应账号
   * Verify Certificate：如果 Keycloak 用自签证书且 Harbor 不信任，就先取消勾选测试用（生产建议配置好 CA 再勾上）

4. 点 `Test OIDC Server` 测试通过后，`Save`

注意底部会显示一个 `Redirect URI`，需要和你在 Keycloak client 里配置的 `Valid redirect URIs` 一致（`https://harbor.example.com/c/oidc/callback`） ([goharbor.io][3])

---

## 三、用户如何“直接在 Harbor 登录”

之后用户要登录 Harbor，不再在 Harbor 登录框里直接输入 Keycloak 用户名和密码，而是：

1. 打开 Harbor 登录页面
2. 点击：`Login via OIDC Provider` 或 `LOGIN WITH keycloak` 这样的按钮（名字取决于你写的 Provider Name）([goharbor.io][2])
3. 浏览器会跳转到 Keycloak 的登录页
4. 在 Keycloak 登录页输入你已经创建好的用户的账号密码
5. Keycloak 验证成功后会跳回 Harbor，此时：

   * 如果是第一次登录，Harbor 会自动为这个 Keycloak 用户“建一个 Harbor 内部用户”（onboarding）
   * 后续再登录就直接进入 Harbor

关键点：

* Harbor 只把 Keycloak 当 OIDC IdP，用的是“跳转 + token”的方式，并不会直接拿你的用户名密码去 Keycloak 做校验。
* 所以“已经在 Keycloak 中创建了用户”之后，**还必须做上面 OIDC 集成配置**，用户才算能在 Harbor 使用这个账号登录。

---

## 四、如果涉及 Docker CLI 登录

你后面很可能还想用这个 Keycloak 用户通过 `docker login` 登录 Harbor：

1. 先用上面的 OIDC 流程登录 Harbor Web UI
2. 点击右上角用户名 → `User Profile` → `Account Settings`
3. 生成一个 `CLI Secret`
4. `docker login harbor.example.com` 时：

   * Username：你的 Harbor 用户名（通常是 Keycloak 的 `preferred_username`）
   * Password：刚才生成的 CLI Secret([Makson Lee][1])

这里不能直接用 Keycloak 的 access token 或密码当 Docker 密码。

---

如果你愿意，可以把你当前的 Harbor URL、Keycloak Realm 名称和你已经配置好的 Client 部分贴出来，我可以帮你对一下关键字段。

[1]: https://www.maksonlee.com/authenticate-harbor-with-keycloak-via-oidc/?utm_source=chatgpt.com "Authenticate Harbor with Keycloak via OIDC - Makson Lee"
[2]: https://goharbor.io/docs/2.13.0/administration/configure-authentication/oidc-auth/?utm_source=chatgpt.com "Configure OIDC Provider Authentication"
[3]: https://goharbor.io/docs/2.6.0/administration/configure-authentication/oidc-auth/?utm_source=chatgpt.com "Configure OIDC Provider Authentication - Harbor docs"


# References

* [Harbor – Configure OIDC Provider Authentication](https://goharbor.io/docs/2.6.0/administration/configure-authentication/oidc-auth/)
* [Harbor Registry with Keycloak OIDC \| by Yuwei Sung \| Medium](https://yuweisung.medium.com/harbor-registry-with-keycloak-oidc-2c344f2d7a8c)
* [Authenticate Harbor with Keycloak via OIDC - Makson Lee](https://www.maksonlee.com/authenticate-harbor-with-keycloak-via-oidc/)

# Link to