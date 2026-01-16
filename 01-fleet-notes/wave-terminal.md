---
tags:
  - shell
  - dev-tool
  - terminal
id: 20251203173023
created: 2025-12-03
reviewed: false
status:
  - in_progress
type: fleet-note
---

## Workflow

```shell
# Open directory or markdown files
wsh view .
wsh view README.md

# add a -m to open the block in "magnified" mode
wsh view -m README.md

# Start development server in a new block (-m will magnify the block on startup)
wsh run -m -- npm run dev

# Open documentation in a web block
wsh web open http://localhost:3000
```


* ⌃ + ⇧ + left/right Switch block
* ⌘ + ⇧ + [/] Switch tab

![image.png](https://images.hnzhrh.com/note/20251203173026363.png)


![image.png](https://images.hnzhrh.com/note/20251203173055783.png)


# References

* [Wave Terminal — Upgrade Your Command Line](https://www.waveterm.dev/)

# Link to