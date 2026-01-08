---
tags:
  - git
id: 20251211111706
created: 2025-12-11
reviewed: false
status:
  - done
type: fleet-note
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

Add the `gitconfig` file:

```c
[user]
        signingkey = 857B08F1C095823C
        name = ryan-alexander-zhang
        email = ryan.alexander.zhang@gmail.com
[credential]
        username = ryan-alexander-zhang
```

The other is the same.

Add the username when you clone the repository.

```shell
git clone https://{username}@github.com/{username}/{repo}
```
# References

# Link to

* [[gpg-commands]]