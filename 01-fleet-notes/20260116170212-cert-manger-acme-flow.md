---
tags:
  - cert-manager
id: 20260116170222
created: 2026-01-16 17:02:22
status:
  - pending
  - done
  - in_progress
type: fleet-note
aliases:
  - cert-manger-acme-flow
---
## 入口对象

你触发签发通常有两种入口：

1. **你手工创建 `Certificate`**（`cert-manager.io/v1`）。  
    `Certificate` 描述你想要的域名、Issuer、最终要写入的 Secret 名等。cert-manager 会基于它生成私钥和 `CertificateRequest`，最终把证书+私钥写进 `spec.secretName` 指定的 Secret。 ([cert-manager](https://cert-manager.io/docs/usage/certificate/ "Certificate resource - cert-manager Documentation"))
    
2. **你只给 Ingress 加注解**，由 **ingress-shim** 自动创建 `Certificate`（证书名通常等于 `tls.secretName`）。 ([cert-manager](https://cert-manager.io/docs/usage/ingress/ "Annotated Ingress resource - cert-manager Documentation"))
    

---

## ACME 证书申请全流程与资源清单

### Step 0. Issuer 侧的 ACME 账号（一次性）

- 资源：`Issuer` / `ClusterIssuer`
    
- 资源：**ACME 账号私钥 Secret**（`spec.acme.privateKeySecretRef.name` 指定的那个）  
    首次注册 ACME 账号时会生成账号私钥并存入该 Secret。 ([cert-manager](https://cert-manager.io/docs/tutorials/acme/http-validation/ "HTTP Validation - cert-manager Documentation"))
    

### Step 1. 触发签发

- 入口：`Certificate` 需要签发或续期（例如目标 Secret 不存在、快过期、spec 变化）。 ([cert-manager](https://cert-manager.io/docs/usage/certificate/ "Certificate resource - cert-manager Documentation"))
    

你看到的事件：

- `Issuing certificate as Secret does not exist` 就是这里触发的。
    

### Step 2. 生成私钥（key-manager）

- 资源：**临时私钥 Secret**（名字通常是 `<cert-name>-<随机>`）  
    cert-manager 会先把新私钥放进一个临时 Secret，再在成功后写入最终 Secret。很多官方教程输出里也能看到这个临时 Secret 事件。 ([cert-manager](https://cert-manager.io/docs/tutorials/getting-started-with-cert-manager-on-google-kubernetes-engine-using-lets-encrypt-for-ingress-ssl/?utm_source=chatgpt.com "Deploy cert-manager on Google Kubernetes Engine (GKE) ..."))
    

你看到的事件：

- `Stored new private key in temporary Secret resource "xxx"` 就是这一步。
    

### Step 3. 创建 `CertificateRequest`

- 资源：`CertificateRequest`（`cert-manager.io/v1`）  
    内含 CSR（base64 PEM），引用 Issuer。一般由 cert-manager 自动创建并管理。 ([cert-manager](https://cert-manager.io/docs/usage/certificaterequest/ "CertificateRequest resource - cert-manager Documentation"))
    

你看到的事件：

- `Created new CertificateRequest resource "…-1"` 就是这一步。
    

### Step 4. ACME 下单：创建 `Order`

- 资源：`Order`（`acme.cert-manager.io`）  
    **每个引用 ACME Issuer 的 `CertificateRequest` 会自动创建一个 `Order`**。Order 创建后**不可变**，要重来就要新建 Order（通常靠删旧 Order/CR 触发）。 ([cert-manager](https://cert-manager.io/docs/concepts/acme-orders-challenges/ "ACME Orders and Challenges - cert-manager Documentation"))
    

### Step 5. 为每个域名创建 `Challenge`

- 资源：`Challenge`（`acme.cert-manager.io`）  
    Order controller 会为每个要授权的 DNS name 创建 Challenge。 ([cert-manager](https://cert-manager.io/docs/concepts/acme-orders-challenges/ "ACME Orders and Challenges - cert-manager Documentation"))
    

### Step 6. “呈现挑战”与自检（HTTP01 或 DNS01）

这里才分叉，决定会额外创建哪些 K8s 资源。

#### 6A) HTTP-01

- 额外资源：**Pod + Service + Ingress**（solver 资源）  
    cert-manager 会创建一个小 web server 来提供 `/.well-known/acme-challenge/...`，并通过 Ingress 路由到它。 ([cert-manager](https://cert-manager.io/docs/tutorials/acme/http-validation/ "HTTP Validation - cert-manager Documentation"))
    
- 自检：cert-manager 会先做 self-check，确认集群内外访问链路已生效，再通知 ACME 服务端去校验。 ([cert-manager](https://cert-manager.io/docs/concepts/acme-orders-challenges/ "ACME Orders and Challenges - cert-manager Documentation"))
    

#### 6B) DNS-01（通配符必选）

- 额外资源：一般 **不会额外创建 Pod/Service/Ingress**
    
- 动作：使用 Issuer 配置的 DNS provider 凭据，创建 `_acme-challenge` 的 **TXT 记录**，并在验证完成后清理。 ([cert-manager](https://cert-manager.io/docs/tutorials/acme/dns-validation/ "DNS Validation - cert-manager Documentation"))
    

> 你的通配符证书走的就是 DNS-01 这条线。

### Step 7. Finalize，获取证书链

- Order 变为 valid，issuer 会向 ACME finalize，拿到证书（含链）。
    

### Step 8. 回填最终 Secret，标记 Ready

- 资源：最终 `Secret`（`type: kubernetes.io/tls`）写入 `tls.key` / `tls.crt`
    
- `CertificateRequest` / `Certificate` 状态变为 Ready。 ([cert-manager](https://cert-manager.io/docs/usage/certificate/ "Certificate resource - cert-manager Documentation"))
    
- 清理：HTTP01 的 solver Pod/Service/Ingress 会被删除；DNS01 的 TXT 记录会被清理。 ([cert-manager](https://cert-manager.io/docs/tutorials/acme/http-validation/ "HTTP Validation - cert-manager Documentation"))
    

---

## 快速对照：你应该能在集群里看到哪些对象

在证书所在 namespace（如 `test07`）：

```bash
kubectl -n test07 get certificate,certificaterequest,order,challenge,secret
```

- 一定有：`Certificate`、最终 `Secret`、`CertificateRequest`、`Order`、`Challenge`。 ([cert-manager](https://cert-manager.io/docs/concepts/acme-orders-challenges/ "ACME Orders and Challenges - cert-manager Documentation"))
    
- HTTP01 才会额外有：solver `Pod/Service/Ingress`。 ([cert-manager](https://cert-manager.io/docs/tutorials/acme/http-validation/ "HTTP Validation - cert-manager Documentation"))
    
- DNS01 会在外部 DNS 里出现：`_acme-challenge` TXT 记录。 ([cert-manager](https://cert-manager.io/docs/tutorials/acme/dns-validation/ "DNS Validation - cert-manager Documentation"))
    

---

## cert-manager 官方文档（直接给链接）

```text
https://cert-manager.io/docs/usage/certificate/
https://cert-manager.io/docs/usage/certificaterequest/
https://cert-manager.io/docs/concepts/acme-orders-challenges/
https://cert-manager.io/docs/configuration/acme/
https://cert-manager.io/docs/tutorials/acme/http-validation/
https://cert-manager.io/docs/tutorials/acme/dns-validation/
https://cert-manager.io/docs/usage/ingress/
https://cert-manager.io/docs/troubleshooting/acme/
```

如果你愿意，我可以按你当前这张证书（`test07.staging-ali.hiverun.io`）把实际创建的资源树（ownerReferences 链：Certificate → CertificateRequest → Order → Challenge）用 `kubectl get -o yaml` 的关键字段串起来，方便你做排障 SOP。
# References