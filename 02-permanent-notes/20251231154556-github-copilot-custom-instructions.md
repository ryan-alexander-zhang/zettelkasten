---
tags:
  - permanent-note
  - github
  - copilot
id: 20251231154608
created: 2025-12-31 15:46:08
Status:
  - Done
type: permanent-note
aliases:
  - github-copilot-custom-instructions
---

## Path

```sh
.github/
├── copilot-instructions.md
├── instructions
│   └── <custom_instruction>.instructions.md
└── prompts
    └── <custom_prompt>.prompt.md
```

## Custom Instructions

```sh
---  
description: 'Guidelines for building Java base applications'  
applyTo: '**/*.java'  
---
```

Here's the official instruction template.[^1]

## Prompts




[^1]: [Using custom instructions to unlock the power of Copilot code review - GitHub Docs](https://docs.github.com/en/copilot/tutorials/use-custom-instructions#recommended-instruction-file-structure)