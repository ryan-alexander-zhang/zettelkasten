---
tags:
  - how-to
  - git
  - github
  - gpg
id: 20260108193854
created: 2026-01-08 19:38:54
status:
  - done
type: how-to-note
aliases:
  - how-to-use-different-github-accounts-in-one-env
---

Modify the `~/.gitconfig` file:

```c
[http]
        proxy = http://127.0.0.1:7890
[https]
        proxy = https://127.0.0.1:7890
[core]
        autocrlf = input
[commit]
        gpgsign = true
[tag]
        gpgSign = true
[credential]
        helper = osxkeychain
[includeIf "gitdir:~/GitHubProjects/ryan-alexander-zhang/"]
        path = ~/.gitconfig-ryan-alexander-zhang
[includeIf "gitdir:~/GitHubProjects/RonghuanZhang/"]
        path = ~/.gitconfig-RonghuanZhang
```

Add the `gitconfig` file. You can use the [[20260108081217-gpg|gpg]] command to configure the private secret fingerprint that you want to use.

```c
[user]
        signingkey = 857B08F1C095823C
        name = ryan-alexander-zhang
        email = ryan.alexander.zhang@gmail.com
[credential]
        username = ryan-alexander-zhang
```

The other is following the same pattern. When you clone the repository, please include the username.

```shell
git clone https://{username}@github.com/{username}/{repo}
```
# References