---
tags:
  - git
id: 20251204131252
created: 2025-12-04
reviewed: false
status:
  - pending
  - done
  - in_progress
type: fleet-note
---

```shell
git subtree add --prefix=<subtree-directory> <remote-url> <branch> --squash
```

Or
```shell
git remote add frontend {git}
git subtree add --prefix={dir}/{project} {remote} {branch} --squash
```
# References

# Link to
* [[git-submodule]]