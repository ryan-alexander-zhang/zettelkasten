---
tags:
  - conda
  - archived
id: 20251201111712
created: 2025-12-01
reviewed: false
status:
  - done
type: fleet-note
archived_at: 2026-01-10T22:37:47
---

Inspect the Conda configuration by searching for the auto keyword.

```shell
conda config --show | grep 'auto'
```

Configure it by default.

```shell
vim ~/.condarc

auto_activate: False
```

# References

# Link to