---
tags:
  - permanent-note
  - spec-driven-development
id: 20260122200324
created: 2026-01-22 20:03:24
Status:
  - In_progress
type: permanent-note
aliases:
  - ai-coding-workflow
---
![ChatGPT Image Jan 23, 2026, 11_19_35 AM.png](https://images.hnzhrh.com/note/20260123111943370.png)

---

![ChatGPT Image Jan 23, 2026, 11_20_23 AM.png](https://images.hnzhrh.com/note/20260123112031556.png)

* [Words Book](http://localhost:3000/)
* [To reads](http://localhost:3002/)

---

![ChatGPT Image Jan 23, 2026, 11_20_53 AM.png](https://images.hnzhrh.com/note/20260123112100529.png)

---

![ChatGPT Image Jan 23, 2026, 11_21_13 AM.png](https://images.hnzhrh.com/note/20260123112119022.png)

---

![ChatGPT Image Jan 23, 2026, 11_21_27 AM.png](https://images.hnzhrh.com/note/20260123112139483.png)


![ChatGPT Image Jan 23, 2026, 11_21_49 AM.png](https://images.hnzhrh.com/note/20260123112156986.png)

![ChatGPT Image Jan 23, 2026, 11_22_03 AM.png](https://images.hnzhrh.com/note/20260123112214376.png)

![ChatGPT Image Jan 23, 2026, 11_14_39 AM.png](https://images.hnzhrh.com/note/20260123112415092.png)

## AI Coding Show

* Vibe Coding
	* [Words Book](http://localhost:3000/)
	* [To reads](http://localhost:3002/)
* SDD
	* Hive Backend (WIP)

## 

* Patience
	* Prompt
	* Review
* Breaking Down
	* Requirement & Feature
	* Module & Package
		* Domain
		* Infra
		* App
* Pass Gate & Constraints
* Code Quality & Review
	* SonarQube -> Constraints
* Record
	* Prompt
		* Awesome Copilot
		* Skill Mackets
		* X
	* Instructions/Rules
* Test & Choose
	* Model
	* Agent
	* Client



> [!NOTE] Git Worktree
> 给 feature/copilot 创建一个工作目录
> git worktree add ../myproj-copilot feature/copilot
> 
> 给 bugfix/test 创建一个工作目录
> git worktree add ../myproj-test bugfix/test


好处:
* 快速 Demo，Idea to Demo cost low.
* 重复、简单的代码高质量完成
* 低成本完成以前觉得麻烦的事情
	* 注释
	* 文档
	* 测试类代码
* 代码补全带来的便捷性

坏处：
* 降低了 Debug 的能力，没有了 Debug 过程中的附加学习，少了深度思考
* 可能提高了风险代码引入的概率

未知：
* 质量问题，改代码的代价可能大于写代码
* SDD （spec-kit, open-kit）带来的文档 review 的成本可能大于写代码的成本
* 整理上下文 + 写提示词的成本可能大于写代码
* 可能出现意向不到的情况 [r/ClaudeAI - Reddit](https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/)