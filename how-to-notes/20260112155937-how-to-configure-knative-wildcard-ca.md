---
tags:
  - how-to
id: 20260112160022
created: 2026-01-12 16:00:22
status:
  - pending
  - done
  - in_progress
type: how-to-note
aliases:
  - "how-to-configure-knative-wildcard-ca"
---

## 1) 先把域名和 DNS 规划对

Knative 默认外部 URL 形态通常是：`<service>.<namespace>.<domain>`。

所以你要的是 **每个 namespace 一条 wildcard 域名**：

* `*.ns-a.example.com`
* `*.ns-b.example.com`
* …

DNS 侧需要给每个 namespace 建一条 wildcard 记录指向 Knative 入口（LB IP 或 CNAME）。Knative 文档示例是 `*.default.knative.dev -> ingress IP`。([knative.dev][2])

同时把 Knative 的默认域名改成你要的后缀（例如 `example.com`）：

```bash
kubectl edit configmap config-domain -n knative-serving
# data 里加：
# example.com: ""
```

Knative 文档就是改 `config-domain` 来替换默认域名。([knative.dev][2])

---

## 2) cert-manager：Cloudflare DNS01 的 ClusterIssuer（指定 token Secret）

### 2.1 Cloudflare API Token Secret（放 cert-manager namespace）

**ClusterIssuer 引用的 Secret 要放在 `cert-manager` namespace**（Knative 文档里也明确提到了 ClusterIssuer 场景下 secret 需要在 cert-manager namespace）。([knative.dev][3])

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-token
  namespace: cert-manager
type: Opaque
stringData:
  api-token: "<CLOUDFLARE_API_TOKEN>"
```

### 2.2 ClusterIssuer（Let’s Encrypt DNS01）

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-dns01
spec:
  acme:
    email: "you@example.com"
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-dns01-account-key
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token
            key: api-token
```

---

## 3) Knative：只启用 external-domain-tls，并改成“每 namespace 一张 wildcard”

### 3.1 配置 Knative 使用哪个 Issuer（只需要 issuerRef）

`config-certmanager` 里 `issuerRef` 就是 **外部域名（ingress）证书**用的。([knative.dev][3])

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: config-certmanager
  namespace: knative-serving
  labels:
    networking.knative.dev/certificate-provider: cert-manager
data:
  issuerRef: |
    kind: ClusterIssuer
    name: letsencrypt-dns01
```

> 你不需要 cluster-local/system-internal，就别配 `clusterLocalIssuerRef` / `systemInternalIssuerRef`。

### 3.2 开启 external-domain-tls

在 `knative-serving/config-network` 里加：

```yaml
data:
  external-domain-tls: Enabled
```

并重启 controller。([knative.dev][4])

### 3.3 启用“每 namespace 1 张 wildcard 证书”

Knative 明确写了：**per-namespace wildcard 只支持 DNS-01，不支持 HTTP-01**。([knative.dev][4])

推荐直接用官方给的 selector（默认全选，允许 namespace 打标签退出）：

```bash
kubectl patch -n knative-serving configmap config-network -p '{
  "data": {
    "external-domain-tls": "Enabled",
    "namespace-wildcard-cert-selector": "{\"matchExpressions\":[{\"key\":\"networking.knative.dev/disableWildcardCert\",\"operator\":\"NotIn\",\"values\":[\"true\"]}]}"
  }
}'
kubectl rollout restart deploy/controller -n knative-serving
```

这些 key、patch 示例、以及需要重启 controller，官方文档都有。([knative.dev][4])

如果你要某个 namespace 不要 wildcard 证书：

```bash
kubectl label ns my-namespace networking.knative.dev/disableWildcardCert=true
```

---

## 4) 验证和排查（你最常用的检查点）

### 4.1 看 Knative URL 是否变成 https

```bash
kubectl get ksvc -n <ns>
```

external-domain-tls 启用后，URL 应该是 `https://...`。 ([knative.dev][4])

### 4.2 看 cert-manager 是否在发单

```bash
kubectl get certificate,order,challenge -A
```

DNS01 失败通常会在 `Challenge` 里看到 Cloudflare 权限或 zone 匹配问题。

---

## 5) 你问的“应该 logs 哪些 pod”（TLS/DNS01 这条链路）

重点就这几类：

**cert-manager（必看）**

* `-n cert-manager deploy/cert-manager`
* `-n cert-manager deploy/cert-manager-webhook`（资源校验/准入相关问题）
* `-n cert-manager deploy/cert-manager-cainjector`（一般少见，但证书注入相关会用到）

**Knative（必看）**

* `-n knative-serving deploy/controller`（external-domain-tls、namespace wildcard 策略、创建证书资源的核心逻辑）([knative.dev][4])

**Ingress 实现（按你装的来）**

* Kourier：看 `kourier-system` 里的 envoy/网关相关 pod（TLS 终止链路问题）
* Istio：`istio-system/istio-ingressgateway`（SDS/证书下发与握手问题）
* Contour：Contour 网关相关 pod

Knative 文档也明确 external TLS 需要 Kourier / Istio SDS / Contour 这类 networking layer。([knative.dev][4])

---

如果你把你当前的：

1. Knative Serving 版本
2. 用的 ingress（Kourier 还是 Istio/Contour）
3. 你的目标域名形态（是否就是 `<svc>.<ns>.<domain>`）
   贴出来，我可以把 **DNS 记录最小集合** 和 **namespace selector** 写成完全贴合你现状的最终版。

[1]: https://knative.dev/blog/releases/announcing-knative-v1-15-release/ "v1.15 release - Knative"
[2]: https://knative.dev/docs/serving/using-a-custom-domain/ "Configure domain names - Knative"
[3]: https://knative.dev/docs/serving/encryption/configure-certmanager-integration/ "Configure cert-manager integration - Knative"
[4]: https://knative.dev/docs/serving/encryption/external-domain-tls/ "Configure external domain encryption - Knative"

# References

* [Overview - Knative](https://knative.dev/docs/serving/encryption/encryption-overview/)