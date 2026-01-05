---
tags:
  - how-to
  - copilot
id: 20251231160406
created: 2025-12-31 16:04:06
status:
  - pending
  - done
  - in_progress
type: how-to-note
aliases:
  - how-to-use-github-copilot
---
## Directory Structure

```sh
.github/
├── copilot-instructions.md
├── instructions
│   └── <custom_instruction>.instructions.md
└── prompts
    └── <custom_prompt>.prompt.md
```

## Custom Instructions

### Instruction Template[^1]

### How to Create the Path-specific Custom Instructions?[^2]

Add the `applyTo`  keyword to the frontmatter block of the instruction file.

For example:
```md
---
applyTo: "app/models/**/*.rb"
---
```

> [!ERROR]
> It appears that the LLM model will impact the rules of instruction. It functions properly when I switch the model from GPT-4.1 to GPT-5.

## Prompts



# References

[^1]: [Using custom instructions to unlock the power of Copilot code review - GitHub Docs](https://docs.github.com/en/copilot/tutorials/use-custom-instructions#recommended-instruction-file-structure)
[^2]: [Adding repository custom instructions for GitHub Copilot - GitHub Docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions?tool=vscode#creating-path-specific-custom-instructions-1)