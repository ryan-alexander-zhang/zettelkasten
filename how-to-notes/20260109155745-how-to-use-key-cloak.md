---
tags:
  - how-to
  - key-cloak
id: 20260109155750
created: 2026-01-09 15:57:50
status:
  - in_progress
type: how-to-note
aliases:
  - how-to-use-key-cloak
---
# APIs
## Get Client Token By Secret

```shell
curl -s \
  -d "grant_type=client_credentials" \
  -d "client_id=hive-job" \
  -d "client_secret=***" \
  "https://<kc>/realms/<realm>/protocol/openid-connect/token" | jq -r .access_token
```

## Get Client Token By Username & Password

```shell
curl -X POST "https://{base}/realms/{realm}/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id={client id}" \
  -d "grant_type=password" \
  -d "username={username}" \
  -d "password={password}"
```


## Token Configure

`Realm settings` -> `Sessions` and `Tokens`

SSO Session Settings:
* `SSO Session Idle` Refresh token will expire at this time if there's no active action.
* `SSO Session Max` Refresh token must expire at this time.
* 

# References
* [[20260108151813-how-to-deploy-keycloak|how-to-deploy-keycloak]]