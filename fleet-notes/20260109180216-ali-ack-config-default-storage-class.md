---
tags:
  - kubernetes
  - ack
id: 20260109180226
created: 2026-01-09 18:02:26
status:
  - pending
  - done
  - in_progress
type: fleet-note
aliases:
  - ali-ack-config-default-storage-class
---

```shell
kubectl get sc

kubectl patch storageclass alicloud-disk-essd -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

# References