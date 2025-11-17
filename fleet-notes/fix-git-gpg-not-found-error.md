---
tags:
  - git
  - gpg
  - shell
id: 20251117092811
created: 2025-11-17
reviewed: false
status:
  - done
type: fleet-note
---
需要配置：

```shell
commit.gpgsign=true
tag.gpgsign=true
gpg.program=/opt/homebrew/bin/gpg
user.name=ryan.alexander.zhang
user.email=ryan.alexander.zhang@gmail.com
user.signingkey=857B08F1C095823C
```
# References
* [GitHub Desktop: error: cannot run gpg: No such file or directory · Issue #675 · isaacs/github](https://github.com/isaacs/github/issues/675)
* [将您的签名密钥告知 Git - GitHub 文档](https://docs.github.com/zh/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key)
* [gpg failed to sign the data fatal: failed to write commit object \[Git 2.10.0\]](https://stackoverflow.com/questions/39494631/gpg-failed-to-sign-the-data-fatal-failed-to-write-commit-object-git-2-10-0)

# Link to