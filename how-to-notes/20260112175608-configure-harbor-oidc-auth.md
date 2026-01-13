---
tags:
  - how-to
  - harbor
id: 20260112175644
created: 2026-01-12 17:56:44
status:
  - in_progress
type: how-to-note
aliases:
  - configure-harbor-oidc-auth
---


> [!warning]
> You can change the authentication mode from database to OIDC only if no local users have been added to the database. If there is at least one user other than `admin` in the Harbor database, you cannot change the authentication mode.


Add groups mapper:
这个的目的主要是为了新增一个 claim 名为 group，指定 group。

![image.png](https://images.hnzhrh.com/note/20260113144414187.png)


Configure the Harbor: 
![image.png](https://images.hnzhrh.com/note/20260113144619422.png)


OIDC Endpoint 要配置为: `https://<base>/realms/<realm>`

确保以下链接可以访问: 

```shell
https://<base>/realms/<realm>/.well-known/openid-configuration
```



# FAQ

## 加密问题

[Add PKCE support for OIDC authentication by reasonerjt · Pull Request #21702 · goharbor/harbor](https://github.com/goharbor/harbor/pull/21702)

登录时报错:
```json
{ "errors": [ { "code": "BAD_REQUEST", "message": "OIDC callback returned error: invalid_request - Missing parameter: code_challenge_method" } ] }
```

这是因为 KeyCloak 配置了 Client 的 PKCE Method，在 Harbor 新版本中已经支持
# References
* [Harbor docs \| Configure OIDC Provider Authentication](https://goharbor.io/docs/main/administration/configure-authentication/oidc-auth/)