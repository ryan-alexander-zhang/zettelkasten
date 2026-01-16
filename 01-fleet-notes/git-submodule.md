---
tags:
  - git
id: 20251204112816
created: 2025-12-04
reviewed: false
status:
  - in_progress
type: fleet-note
---

```shell
git submodule add ./{dir}/{project-name}
```

There's an empty module if you only clone the parent module. You need to init and update the sub-module manually.

```shell
git submodule init
git submodule update

# both
git submodule update --init --recursive

#clone
git clone --recursive-submodules xxx
```
# References

* [Git Submodules 介绍（通俗易懂，总结了工作完全够用的 submodule 命令）-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2136829)
* [Site Unreachable](https://zhuanlan.zhihu.com/p/614299771)

# Link to
* [[git-subtree]]