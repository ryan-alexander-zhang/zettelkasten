---
tags:
  - cert-manager
id: 20260116171837
created: 2026-01-16 17:18:37
status:
  - in_progress
type: fleet-note
aliases:
  - cert-manager-acme-apply-flow
---

Step 1: Pre-create the `Issuer` or `ClusterIssuer`
Step 2: User creates `Certificate`
Step 3: Cert Manager creates a temp private key.
Step 4: Create `CertificateRequest`
Step 5: ACME will create `Order`. Order is unchanged.
Step 6: Challenge for domain.
Step 7: HTTP01 or DNS01
Step 8: Order valid.
Step 9: Input secret. Mark ready.


```mermaid
flowchart TD
  A[Certificate] -->|Secret 不存在 或 需要续期| B[cert-manager: trigger]
  B --> C[临时私钥 Secret]
  B --> D[CertificateRequest]
  D --> E[Issuer或ClusterIssuer ACME]
  E --> EA[ACME账号私钥 Secret]
  D --> F[Order]
  F --> G{每个域名}
  G --> H[Challenge]

  H --> I{Solver 类型}
  I -->|HTTP-01| J[创建 solver Pod]
  J --> K[创建 solver Service]
  K --> L[创建 solver Ingress]
  L --> M[Self-check]
  M --> N[ACME 校验域名控制权]

  I -->|DNS-01  通配符必须| O[创建 TXT 记录 _acme-challenge]
  O --> P[等待DNS传播]
  P --> N

  N --> Q[Finalize Order]
  Q --> R[获取证书链]
  R --> S[写入最终 TLS Secret]
  S --> T[Certificate Ready]
  T --> U[清理 solver 资源或删除 TXT]

```


# References