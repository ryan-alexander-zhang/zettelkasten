---
tags:
  - fleet-note
id: 20251117104202
created: 2025-11-17
reviewed: false
status:
  - done
---

```shell
git remote remove origin
git remote add origin https://{token}@github.com/{user}/{repo}.git
```

等同于：

```shell
git remote set-url origin https://{token}@github.com/{user}/{repo}.git
```

# References
* [使用github token进行push\_github token push-CSDN博客](https://blog.csdn.net/yonggeit/article/details/125268477)
# Link to