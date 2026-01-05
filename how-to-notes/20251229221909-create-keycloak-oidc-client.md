---
tags:
  - how-to
  - iam
  - oidc
  - key-cloak
id: 20251229221926
created: 2025-12-29 22:19:26
status:
  - done
type: how-to-note
aliases:
  - create-keycloak-oidc-client
---


Step 1: Create the Admin client.

![image.png](https://images.hnzhrh.com/note/20251208102838621.png)

Step 2: Configure Client Authentication.

> [!question] What's the diff between client authentication on and off?
> You need to add the secret if you have the configured client authentication. For the end-use CLI, you shouldn't set the secret. The keycloak can prove the client is the client by the secret. 

Get the token:
```shell
curl -X POST "https://{base}/realms/{realm}/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id={client id}" \
  -d "grant_type=password" \
  -d "username={username}" \
  -d "password={password}"
```

Result:
```shell
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjSTVBbzI3c2hETmZxaUtuYlVzLURHZzA5TDM1enBzV214R1Brc0xOR1ZvIn0.eyJleHAiOjE3NjUxNjUxNDUsImlhdCI6MTc2NTE2NDg0NSwianRpIjoib25ydHJvOmY0MzFhODNjLTA0NGMtNzhmOS1jY2FkLWM3NjAxOTFjZTZlNSIsImlzcyI6Imh0dHBzOi8vc3RhZ2luZy1oaXZlLWtleWNsb2FrLnNhaGFyYWFpLmlvL3JlYWxtcy9oaXZlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjA5NDU2NjA4LTU2MzUtNGY3Yi1iMDhkLTc3ZTU0MzE1MDAxNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImhpdmUtY2xpIiwic2lkIjoiNDdkMjE0MmUtNGIxMS00NzViLWE1MzUtN2U0YjJhYTAyNzI1IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWhpdmUiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6ImVycGFuZ0YgZXJwYW5nTCIsInByZWZlcnJlZF91c2VybmFtZSI6ImVycGFuZyIsImdpdmVuX25hbWUiOiJlcnBhbmdGIiwiZmFtaWx5X25hbWUiOiJlcnBhbmdMIiwiZW1haWwiOiJlcnBhbmdAZ21haWwuY29tIn0.XktbGmjRj6zkXbgd5LvL30F8M8RpAYo0-sNBlNBWRhqhjd2IBSs9TiYc_dRy4Zso4ew8-uP9azCGBExY6rviiDSvoSJly4f4XeKkm99RTgg-0MF8qQ09WECOw5KW-iLFM8iu_mWTSKAA8jH4x8gfiNlZtv16tcige_GnpCvTBORt8_UVIbfzFXDgcbSl0A_lQ5UsvtPWvfJSx90T4yXWBjGfgN3mgWRu39rpDLfkppnz60OoSU2Biprd4VTZ1Dabv2pdUvVe-Yxaz9FSGjb9m5KE3g_GyAlhwV_tjrrk6VI1fAuZFwz9Rmi65vpgmBQ1oH8KDI6cT9F7EPWAhZ6Nxw",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0ZDY2ZTJhZC02NjhiLTQzYTMtOWQ1Yy0xMzE2YzgwNTBmNjMifQ.eyJleHAiOjE3NjUxNjY2NDUsImlhdCI6MTc2NTE2NDg0NSwianRpIjoiMGU4OGM4MTctNWY5Ny1kNjFiLWRlMWEtN2YyZGM4MzNhMzJkIiwiaXNzIjoiaHR0cHM6Ly9zdGFnaW5nLWhpdmUta2V5Y2xvYWsuc2FoYXJhYWkuaW8vcmVhbG1zL2hpdmUiLCJhdWQiOiJodHRwczovL3N0YWdpbmctaGl2ZS1rZXljbG9hay5zYWhhcmFhaS5pby9yZWFsbXMvaGl2ZSIsInN1YiI6IjA5NDU2NjA4LTU2MzUtNGY3Yi1iMDhkLTc3ZTU0MzE1MDAxNiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJoaXZlLWNsaSIsInNpZCI6IjQ3ZDIxNDJlLTRiMTEtNDc1Yi1hNTM1LTdlNGIyYWEwMjcyNSIsInNjb3BlIjoid2ViLW9yaWdpbnMgcm9sZXMgcHJvZmlsZSBlbWFpbCBiYXNpYyBhY3IifQ.6vQd5lEus8LnLWkOjHF3fLVEOZYoLjCmGsD5nhIQENuI2hgxSYC8doKwsLQCYzTBQuiJ9dlbyDs8ruWgEr4p9Q",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "47d2142e-4b11-475b-a535-7e4b2aa02725",
  "scope": "profile email"
}
```

Decode:
```json
{
  "exp": 1765165145,
  "iat": 1765164845,
  "jti": "onrtro:f431a83c-044c-78f9-ccad-c760191ce6e5",
  "iss": "https://staging-hive-keycloak.saharaai.io/realms/hive",
  "aud": "account",
  "sub": "09456608-5635-4f7b-b08d-77e543150016",
  "typ": "Bearer",
  "azp": "hive-cli",
  "sid": "47d2142e-4b11-475b-a535-7e4b2aa02725",
  "acr": "1",
  "allowed-origins": [
    "/*"
  ],
  "realm_access": {
    "roles": [
      "offline_access",
      "default-roles-hive",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "profile email",
  "email_verified": false,
  "name": "erpangF erpangL",
  "preferred_username": "erpang",
  "given_name": "erpangF",
  "family_name": "erpangL",
  "email": "erpang@gmail.com"
}
```
