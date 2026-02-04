---
tags:
  - how-to
  - cert-manager
id: 20260109103620
created: 2026-01-09 10:36:20
status:
  - done
type: how-to-note
aliases:
  - how-to-use-cert-manager
---

## ACME[^1]

> [!quote]
> The ACME Issuer type represents a single account registered with the Automated Certificate Management Environment (ACME) Certificate Authority server. When you create a new ACME `Issuer`, cert-manager will generate a private key which is used to identify you with the ACME server.
> 
> Certificates issued by public ACME servers are typically trusted by client's computers by default. This means that, for example, visiting a website that is backed by an ACME certificate issued for that URL, will be trusted by default by most client's web browsers. ACME certificates are typically free.

### HTTP01 Challenge

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    # You must replace this email address with your own.
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account.
    email: user@example.com
    # If the ACME server supports profiles, you can specify the profile name here.
    # See #acme-certificate-profiles below.
    profile: tlsserver
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      # Secret resource that will be used to store the account's private key.
      # This is your identity with your ACME provider. Any secret name may be
      # chosen. It will be populated with data automatically, so generally
      # nothing further needs to be done with the secret. If you lose this
      # identity/secret, you will be able to generate a new one and generate
      # certificates for any/all domains managed using your previous account,
      # but you will be unable to revoke any certificates generated using that
      # previous account.
      name: example-issuer-account-key
    # Add a single challenge solver, HTTP01 using nginx
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
```

### DNS01  Challenge

Here's a `Cloudflare` demo:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-token-secret
type: Opaque
stringData:
  api-token: <API Token>
```

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
```

## CRD


```shell
# CRD
kubectl get certificat, certificaterequest -n <ns>

# ACME
kubectl get order,challenge -n <ns>
kubectl describe order <order-name> -n <ns>
kubectl describe challenge <challenge-name> -n <ns>
```

## 404 Error

DNS01 方式签发证书失败：

```shell
kubectl get certificate 
kubectl describe certificate <name>
kubectl get certificaterequest
kubectl get order

output:
Events:
  Type     Reason     Age   From                                       Message
  ----     ------     ----  ----                                       -------
  Normal   Issuing    50m   cert-manager-certificates-trigger          Issuing certificate as Secret does not exist
  Normal   Generated  50m   cert-manager-certificates-key-manager      Stored new private key in temporary Secret resource "<url>-f2rlw"
  Normal   Requested  50m   cert-manager-certificates-request-manager  Created new CertificateRequest resource "<url>-1"
  Warning  Failed     50m   cert-manager-certificates-issuing          The certificate request has failed to complete and will be retried: Failed to wait for order resource "<url>-1-3410080450" to become ready: order is in "errored" state: Failed to fetch authorization: 404 urn:ietf:params:acme:error:malformed: No such authorization
```

可以看到 404 错误

查看 Order 和 Certificaterequest

参考官网，这是一个 Let's Encrypt 时序不同步的罕见 Bug：
[Certbot says no such authorization when trying to authorize domain](https://community.letsencrypt.org/t/certbot-says-no-such-authorization-when-trying-to-authorize-domain/242721)

[Error while trying to renew my cert on FortiGate](https://community.letsencrypt.org/t/error-while-trying-to-renew-my-cert-on-fortigate/209979/2)

这种错误 Cert Manager 不会重试[^2] , 要等 1h 以上。

> [!quote] What happens if issuance fails? Will it be retried?
> cert-manager will retry a failed issuance except for a few rare edge cases where manual intervention is needed.
> 
> If an issuance fails because of a temporary error, it will be retried again with a short exponential backoff (currently 5 seconds to 5 minutes). A temporary error is one that does not result in a failed CertificateRequest.
> 
> If the issuance fails with an error that resulted in a failed CertificateRequest, it will be retried with a longer binary exponential backoff (1 hour to 32 hours) to avoid overwhelming external services.
> 
> You can always trigger immediate renewal using the cmctl renew command

# References

[^1]: [ACME](https://cert-manager.io/docs/configuration/acme/)
[^2]: [FAQ](https://cert-manager.io/v1.9-docs/faq/)