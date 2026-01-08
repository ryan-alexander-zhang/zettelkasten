---
tags:
  - how-to
  - key-cloak
id: 20260108151821
created: 2026-01-08 15:18:21
status:
  - pending
  - done
  - in_progress
type: how-to-note
aliases:
  - how-to-deploy-keycloak
---

# Helm

```shell
helm repo add bitnami https://charts.bitnami.com/bitnami

helm repo update

helm pull bitnami/keycloak --version 25.2.0 --untar --destination ./

kubectl create namespace infra-keycloak
```

# References

* 