---
tags:
  - kubernetes
  - shell
  - cheat-sheet
id: 20251119153737
created: 2025-11-19
reviewed: false
status:
  - in_progress
type: fleet-note
---
## **What can user/sa do?**

```shell
# What can a user do in a namespace?
kubectl auth can-i --list -n {namespace} --as={user}

# What can sa, which in namespace can do in namespace(first)?
kubectl auth can-i --list -n {namespace} --as=system:serviceaccount:{namespace}:{sa}
```

## **Can user/sa do xxx?**

```shell
# Can the user operate the verb of the API group in the namespace?
kubectl auth can-i {verb} {api-group} -n {namespace} --as={user}

# Can the sa of namespace operate the verb of the API group in the namespace?
kubectl auth can-i {verb} {api-group} -n {namespace} --as=system:serviceaccount:{namespace}:{sa}
```

# References

# Link to