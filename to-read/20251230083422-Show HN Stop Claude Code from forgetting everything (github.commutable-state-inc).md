---
type: "to-read"
id: 20251230081222
created: 2025-12-30T08:34:22
source:
  - "https://news.ycombinator.com/item?id=46426624"
tags:
reviewd: false
---
[https://github.com/mutable-state-inc/ensue-skill](https://github.com/mutable-state-inc/ensue-skill)

I got tired of Claude Code forgetting all my context every time I open a new session: set-up decisions, how I like my margins, decision history. etc.

We built a shared memory layer you can drop in as a Claude Code Skill. It’s basically a tiny memory DB with recall that remembers your sessions. Not magic. Not AGI. Just state.

Install in Claude Code:

```
/plugin marketplace add https://github.com/mutable-state-inc/ensue-skill
  /plugin install ensue-memory
  # restart Claude Code
```
What it does: (1) persists context between sessions (2) semantic & temportal search (not just string grep). Basically git for your Claude brain

What it doesn’t do: - it won’t read your mind - it’s alpha; it might break if you throw a couch at it

Repo: [https://github.com/mutable-state-inc/ensue-skill](https://github.com/mutable-state-inc/ensue-skill)

If you try it and it sucks, tell me why so I can fix it. Don't be kind, tia

---

## Comments

> **ramoz** • [2025-12-30](https://news.ycombinator.com/item?id=46427839)
> 
> I struggle with these abstractions over context windows, esp when anthropic is actively focused on improving things like compaction, and knowing the eventual\* goal is for the models to yave real memory layers baked in. Until then we have to optimize with how agents work best and ephemeral context is a part of that (they weren’t RL’d/trained with memory abstractions so we shouldn’t use them at inference either). Constant rediscovery that is task specific has worked well for me, doesn’t suffer from context decay, though it does eat more tokens.
> 
> Otherwise the ability to search back through history is a valuable simple (rip)grep/jq combo over the session directory. Simple example of mine: [https://github.com/backnotprop/rg\_history](https://github.com/backnotprop/rg_history)
> 
> > **AndyNemmity** • [2025-12-30](https://news.ycombinator.com/item?id=46427888)
> > 
> > There is certainly a level where at any time you could be building some abstraction that is no longer required in a month, or 3.
> > 
> > I feel that way too. I have a lot of these things.
> > 
> > But the reality is, it doesn't really happen that often in my actual experience. Everyone is very slow as a whole to understand what these things mean, so far you get quite a bit of time just with an improved, customized system of your own.

> **ossa-ma** • [2025-12-30](https://news.ycombinator.com/item?id=46427950)
> 
> There are a quadrillion startups (mem0, langmem, zep, supermemory), open source repos (claude-mem, beads), and tools that do this.
> 
> My approach is literally just a top-level, local, git version controlled memory system with 3 commands:
> 
> \- /handoff - End of session, capture into an inbox.md
> 
> \- /sync - Route inbox.md to custom organised markdown files
> 
> \- /engineering (or /projects, /tasks, /research) - Load context into next session
> 
> I didn't want a database or an MCP server or embeddings or auto-indexing when I can build something frictionless that works with git and markdown.
> 
> Repo: [https://github.com/ossa-ma/double](https://github.com/ossa-ma/double) (just published it publicly but its about the idea imo)
> 
> Writeup: [https://ossa-ma.github.io/blog/double](https://ossa-ma.github.io/blog/double)

> **amannm** • [2025-12-30](https://news.ycombinator.com/item?id=46427929)
> 
> There's a lot of people interested in forming some sort of memory layer around vendored LLM services. I don't think they realize how much impact a single error that disappears from your immediate attention can have on downstream performance. Now think of the accrual of those errors over time and your lack of ability to discern if it was service degradation or a bad prompt or a bad AGENTS.md OR now this "long term memory" or whatever. If this sort of feature will ever be viable, the service providers will offer the best solution only behind their API, optimized for their models and their infrastructure.

> **JoshGlazebrook** • [2025-12-29](https://news.ycombinator.com/item?id=46427442)
> 
> Is anyone else just completely overwhelmed with the number of things you \_need\_ for claude code? Agents, sub agents, skills, claud.md, agents.md, rules, hooks, etc.
> 
> We use Cursor where I work and I find it a good medium for still being in control and knowing what is happening with all of the changes being reviewed in an IDE. Claude feels more like a black box, and one with so many options that it's just overwhelming, yet I continue to try and figure out the best way to use it for my personal projects.
> 
> > **\_the\_inflator** • [2025-12-30](https://news.ycombinator.com/item?id=46427848)
> > 
> > I like the finetuning aspect to it quite a lot. It makes sense to me. What I achieved now is a very streamlined process of autonomous work of an agent, which can more and more often be simply managed than controlled on a code review level basis for everything.
> > 
> > I agree that this level of finetuning feels overwhelming and might let yourself doubting whether you do utilize Claude to its optimum and the beauty is, that finetunging and macro usage don't interfere, when you stay in your lane.
> > 
> > For example I now don't use the planing agent anymore instead incorporated this process into the normal agents much to the project's advantage. Consistency is key. Anthropic did the right thing.
> > 
> > Codex is quite a different beast and comes from the opposite direction so to say.
> > 
> > I use both, Codex and Claude Opus especially, in my daily work and found them complementary not mutual exclusive. It is like two different evangelists who are on par exercising with different tools to achieve a goal, that both share.
> > 
> > **dimitri-vs** • [2025-12-30](https://news.ycombinator.com/item?id=46427776)
> > 
> > I'm in Claude Code 30+ hr/wk and always have a at least three tabs of CC agents open in my terminal.
> > 
> > Agree with the other comments: pretty much running vanilla everything and only the Playwright MCP (IMO way better than the native chrome integration) and ccstatusline (for fun). Subagents can be as simple as saying "do X task(s) with subagent(s)". Skills are just self @-ing markdown files.
> > 
> > Two of the most important things are 1) maintaining a short (<250 lines) CLAUDE.md and 2) having a /scratch directory where the agent can write one-off scripts to do whatever it needs to.
> > 
> > **asdev** • [2025-12-29](https://news.ycombinator.com/item?id=46427500)
> > 
> > you really don't need any of this crap. you just need Claude Code and CLAUDE.MD in directories where you need to direct it. complicated AI set ups are mid curve
> > 
> > > **parpfish** • [2025-12-30](https://news.ycombinator.com/item?id=46427961)
> > > 
> > > I refuse to learn all the complicated configuration because none of it will matter when they drop the next model.
> > > 
> > > Things that need special settings now won’t in the future and vice versa.
> > > 
> > > It’s not worth investing a bunch of time into learning features and prompting tricks that will be obsoleted soon
> > > 
> > > **wouldbecouldbe** • [2025-12-30](https://news.ycombinator.com/item?id=46427762)
> > > 
> > > It seems to mostly ignore Claude.md
> > > 
> > > > **AndyNemmity** • [2025-12-30](https://news.ycombinator.com/item?id=46427802)
> > > > 
> > > > It does, Claude.md is the least effective way to communicate to it.
> > > > 
> > > > It's always interesting reading other people's approaches, because I just find them all so very different than my experience.
> > > > 
> > > > I need Agents, and Skills to perform well.
> 
> **austinbaggio** • [2025-12-29](https://news.ycombinator.com/item?id=46427646)
> 
> It feels like Claude is taking more of the Android approach of a less opinionated, but more open stack, so people are bending it to the shape they want to match their workflow. I think of the amnesia problem as pretty agent-agnostic, though, knowing what happens while you're delivering product is more of an agent execution layer problem than a tool problem, and it gets bigger when you have swarms coordinating - Jaya wrote a pretty good article about this [https://x.com/AustinBaggio/status/2004599657520123933?s=20](https://x.com/AustinBaggio/status/2004599657520123933?s=20)
> 
> **eterm** • [2025-12-29](https://news.ycombinator.com/item?id=46427532)
> 
> This isn't necessary. Claude will read CLAUDE.md from both:
> 
> ```
> 1. Current directory ./CLAUDE.md
>   2. User directory ~/.claude/CLAUDE.md
> ```
> I stick general preferences in what it calls "user memory" and stick project specific preferences in the working directory.
> 
> **AndyNemmity** • [2025-12-30](https://news.ycombinator.com/item?id=46427784)
> 
> I'm the opposite, I find it straight forward to use all these things, and am surprised people aren't getting it.
> 
> I've been trying to write blogs explaining it recently, but I don't think I'm very good at making it sound interesting to people.
> 
> What can I explain that you would be interested in?
> 
> Here was my latest attempt today.
> 
> [https://vexjoy.com/posts/everything-that-can-be-deterministi...](https://vexjoy.com/posts/everything-that-can-be-deterministic-should-be-my-claude-code-setup/)
> 
> > **majormajor** • [2025-12-30](https://news.ycombinator.com/item?id=46427830)
> > 
> > You say "My Claude Code Setup" but where is the actual setup there? I generally agree with everything about how LLMs should be called you say, but I don't see any concrete steps of changing Claude Code's settings in there? Where are the "35 agents. 68 skills. 234MB of context."? Is the implementation of the "Layer 4" programs intended to be left to the reader? That's hardly approachable.
> > 
> > > **AndyNemmity** • [2025-12-30](https://news.ycombinator.com/item?id=46427849)
> > > 
> > > I got similar feedback with my first blog post on my do router - [https://vexjoy.com/posts/the-do-router/](https://vexjoy.com/posts/the-do-router/)
> > > 
> > > Here is what I don't get. it's trivial to do this. Mine is of course customized to me and what I do.
> > > 
> > > The idea is to communicate the ideas, so you can use them in your own setup.
> > > 
> > > It's trivial to put for example, my do router blog post in claude code and generate one customized for you.
> > > 
> > > So what does it matter to see my exact version?
> > > 
> > > These are the type of things I don't get. If I give you my details, it's less approachable for sure.
> > > 
> > > The most approachable thing I could do would be to release individual skills.
> > > 
> > > Like I have skills for generating images with google nano banana. That would be approachable and easy.
> > > 
> > > But it doesn't communicate the why. I'm trying to communicate the why.
> 
> **minimaxir** • [2025-12-29](https://news.ycombinator.com/item?id=46427498)
> 
> With Opus 4.5 in Claude Code, I'm doing fine with just a (very detailed) CLAUDE.md.
> 
> > **austinbaggio** • [2025-12-29](https://news.ycombinator.com/item?id=46427599)
> > 
> > Do you find you want to share the .md with the teams you work with? Or is it more for your solo coding?
> 
> **pigpop** • [2025-12-30](https://news.ycombinator.com/item?id=46427701)
> 
> You don't need all that, just have Claude write the same documentation you would (should) write for any project. I find it best to record things chronologically and then have Claude do periodic reviews of the docs and update key design documents and roadmap milestones. The best part is you get a written record of everything that you can review when you need to remember when and why something changed. They also come in handy for plan mode since they act as a guide to the existing code.
> 
> The PMs were right all along!
> 
> **lukev** • [2025-12-30](https://news.ycombinator.com/item?id=46427693)
> 
> A claude.md file will give you 90% of what you need.
> 
> Consider more when you're 50+ hours in and understand what more you want.
> 
> > **AndyNemmity** • [2025-12-30](https://news.ycombinator.com/item?id=46427808)
> > 
> > In my experience, I'm at the most where I entirely ignore Claude.md - so it's very interesting how many people have very different experiences.
> 
> **wouldbecouldbe** • [2025-12-30](https://news.ycombinator.com/item?id=46427753)
> 
> All I use is curse words and it does a damn great job most of the time
> 
> > **anonzzzies** • [2025-12-30](https://news.ycombinator.com/item?id=46427970)
> > 
> > Yep, that usually works best.
> 
> **metadat** • [2025-12-29](https://news.ycombinator.com/item?id=46427611)
> 
> Don't forget about the co-agents.. yeah.
> 
> **animitronix** • [2025-12-30](https://news.ycombinator.com/item?id=46427909)
> 
> Nope, I spend time learning my tools.

> **robertwt7** • [2025-12-30](https://news.ycombinator.com/item?id=46427906)
> 
> Congrats for this! how does this differs from claude-mem? I've been using claude-mem for a while now
> 
> [https://github.com/thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)

> **coffeeboy27** • [2025-12-29](https://news.ycombinator.com/item?id=46427260)
> 
> What's the data retention/deletion policy and is there a self-hosted option planned? I'd prefer not to send proprietary code to third-party servers.
> 
> > **austinbaggio** • [2025-12-29](https://news.ycombinator.com/item?id=46427323)
> > 
> > Honestly, very reasonable ask, you're not the first person to ask for a self-hosted version. We have a privacy policy we've drafted that is up-to-date with the current version of the product [https://www.ensue-network.ai/privacy-policy](https://www.ensue-network.ai/privacy-policy).
> > 
> > The project is still in alpha, so you could shape what we build next - what do you need to see, or what gets you comfortable sending proprietary code to other external services?
> > 
> > > **frumplestlatz** • [2025-12-29](https://news.ycombinator.com/item?id=46427647)
> > > 
> > > \> what do you need to see, or what gets you comfortable sending proprietary code to other external services?
> > > 
> > > Honestly? It just *has* to be local.
> > > 
> > > At work, we have contracts with OpenAI, Anthropic, and Google with isolated/private hosting requirements, coupled with internal, custom, private API endpoints that enforce our enterprise constraints. Those endpoints perform extensive logging of everything, and reject calls that contain even small portions of code if it's identified as belonging to a secret/critical project.
> > > 
> > > There's just no way we're going to negotiate, pay for, and build something like that for every possible small AI tooling vendor.
> > > 
> > > And at home, I feed AI a *ton* of personal/private information, even when just writing software for my own use. I also give the AI relatively wide latitude to vibe-code and execute things. The level of trust I need in external services that insert themselves in that loop is *very* high. I'm just not going to insert a hard dependency on an external service like this -- and that's putting aside the whole "could disappear / raise prices / enshittify at any time" aspect of relying on a cloud provider.

> **AndyNemmity** • [2025-12-30](https://news.ycombinator.com/item?id=46427771)
> 
> I don't understand the use case. I think if you don't use agents, and skills currently effectively, then perhaps this is useful.
> 
> If you're using them though, we no longer have the problem of Claude forgetting things.

> **qudat** • [2025-12-29](https://news.ycombinator.com/item?id=46427362)
> 
> Have you tried [https://github.com/steveyegge/beads](https://github.com/steveyegge/beads)
> 
> > **zyan1de** • [2025-12-29](https://news.ycombinator.com/item?id=46427411)
> > 
> > oh yeah beads is awesome! I'd say this is a bit more general purpose rn especially what is in the skill!

> **dr\_dshiv** • [2025-12-30](https://news.ycombinator.com/item?id=46427756)
> 
> I just ask Claude to look at past conversations where I was working on x… it sometimes thinks it can’t see them, but it can.
> 
> I’ll give this a go though and let you know!
> 
> > **ramoz** • [2025-12-30](https://news.ycombinator.com/item?id=46427869)
> > 
> > Here is a simple skill (markdown instruction only) that instructs a nice ripgrep approach - with utility of discovering current session.
> > 
> > [https://github.com/backnotprop/rg\_history](https://github.com/backnotprop/rg_history)

> **bilbo-b-baggins** • [2025-12-30](https://news.ycombinator.com/item?id=46427793)
> 
> Your site advertises careers in San Francisco/Remote. California law requires compensation disclosures.
> 
> > **austinbaggio** • [2025-12-30](https://news.ycombinator.com/item?id=46427882)
> > 
> > Good flag, we're still pretty early, I think the strict requirement for compensation disclosures is post 15 employees in CA? Did I get this wrong?

> **sabareesh** • [2025-12-30](https://news.ycombinator.com/item?id=46427806)
> 
> Non starter for us, We cant ship propriety data to a third party servers.

> **zyan1de** • [2025-12-29](https://news.ycombinator.com/item?id=46427016)
> 
> I mostly use it during long Claude Code research sessions so I don’t lose my place between days.
> 
> I run it in automatic mode with decent namespacing, so thoughts, notes, and whole conversations just accumulate in a structured way. As I work, it stores the session and builds small semantic, entity-based hypergraphs of what I was thinking about.
> 
> Later I’ll come back and ask things like:
> 
> what was I actually trying to fix here?
> 
> what research threads exist already?
> 
> where did my reasoning drift?
> 
> Sometimes I’ll even ask Claude to reflect on its own reasoning in a past session and point out where it was being reactive or missed connections.

> **altmanaltman** • [2025-12-29](https://news.ycombinator.com/item?id=46427026)
> 
> Thank you for specifying it wasn't magic or AGI.
> 
> > **apublicfrog** • [2025-12-29](https://news.ycombinator.com/item?id=46427622)
> > 
> > \> Not magic. Not AGI. Just state.
> > 
> > Very clearly AI written
> > 
> > > **fragmede** • [2025-12-30](https://news.ycombinator.com/item?id=46427729)
> > > 
> > > You're absolutely right!
> 
> **austinbaggio** • [2025-12-29](https://news.ycombinator.com/item?id=46427193)
> 
> jk it is AGI. First.

> **senshan** • [2025-12-29](https://news.ycombinator.com/item?id=46427186)
> 
> What is the advantage over summarizing previous sessions for the new one?
> 
> Or, over continuing the same session and compacting?
> 
> > **austinbaggio** • [2025-12-30](https://news.ycombinator.com/item?id=46427820)
> > 
> > You can use it with summaries for sure, but summaries often miss edge cases and long sessions drift. This makes it easier to jump between tasks, come back days later, and reorient without missing something that the summarization or compaction might have gotten rid of. I've often found post-compaction, the memory of even the current session feels so much dumber.

> **zyan1de** • [2025-12-29](https://news.ycombinator.com/item?id=46427238)
> 
> maybe you are in a claude code session and think "didn't i already make design doc for system like this one?" Or you could even look at your thought process in a previous session and reflect. but rn i mainly use it for reviewing research and the hypergraph retrieval

> **CPLX** • [2025-12-29](https://news.ycombinator.com/item?id=46427031)
> 
> I absolutely love this concept! It's like the thing that I've been looking for my whole life. Well, at least since I've been using Claude Code, which is this year.
> 
> I'm sold.
> 
> With that said, I can't think of a way that this would work. How does this work? I took a very quick glance, and it's not obvious at first glance.
> 
> The whole problem is, the AI is short on context, it has limited memory. Of course, you can store lots of memory elsewhere, but how do you solve the problem of having the AI not know what's in the memory as it goes from step to step? How does it sort of find the relevant memory at the time that that relevance is most active?
> 
> Could you just walk through the sort of conceptual mechanism of action of this thing?
> 
> > **bredren** • [2025-12-30](https://news.ycombinator.com/item?id=46427710)
> > 
> > I recently released something that runs entirely locally and allows RAG access from Claude Code to your complete Codex and Claude Code chat history, including sidechains.
> > 
> > You call it using a skill by saying: “look over our past conversations for when we talked about caching user profiles” and it lets the frontier model query a database of your conversations locally.
> > 
> > It is incredibly efficient because you only retrieve what you need and it does not rely on embeddings, because the AI can quickly fuzz queries to RAG in on what’s useful. it works.
> > 
> > The skill is called Total Recall, and the CLI is distributed with a macOS app called Contextify.
> > 
> > It works by ingesting all of your text transcripts from your conversations with Claude Code or Codex as they happen, and exposing AI friendly tools for searching them.
> > 
> > I shipped the feature a few days ago, with an intro here: [https://contextify.sh/blog/](https://contextify.sh/blog/)
> > 
> > It can also do some pretty nifty reporting if you ask for reports.
> > 
> > I’ve got a Linux client in development if anyone is not on macOS and wants to give it a try.
> > 
> > **austinbaggio** • [2025-12-29](https://news.ycombinator.com/item?id=46427223)
> > 
> > Appreciate it - yeah, you're right, models don't work well when you just give it a giant dump of memory. We store memories in a small DB - think key/value pair with embeddings Every time you ask Claude something, the skill:
> > 
> > 1\. Embeds the current request.
> > 
> > 2\. Runs a semantic + timestamp-weighted search over your past sessions. Returns only the top N items that look relevant to this request.
> > 
> > 3\. Those get injected into the prompt as context (like extra system/user messages), so Claude sees just enough to stay oriented without blowing context limits.
> > 
> > Think of it like: Attention over your historical work, more so than brute force recall. Context on demand basically giving you an infinite context window. Bookmark + semantic grep + temporal rank. It doesn’t “know everything all the time.” It just knows how to ask its own past: “What from memory might matter for this?”
> > 
> > When you try it, I’d love to hear where the mechanism breaks for you.
> > 
> > **skuenzli** • [2025-12-29](https://news.ycombinator.com/item?id=46427216)
> > 
> > It looks to me like the skill sets up a connection to their MCP server at api.ensue-network.ai during Claude session start via [https://github.com/mutable-state-inc/ensue-skill/blob/main/s...](https://github.com/mutable-state-inc/ensue-skill/blob/main/scripts/session-start.sh)
> > 
> > Then Claude uses the MCP tools according to the SKILL definition: [https://github.com/mutable-state-inc/ensue-skill/blob/main/s...](https://github.com/mutable-state-inc/ensue-skill/blob/main/skills/ensue-memory/SKILL.md)
> > 
> > **zyan1de** • [2025-12-29](https://news.ycombinator.com/item?id=46427134)
> > 
> > yeah so you can run it in automatic mode, or read only mode. In automatic mode it hooks onto the conversation and tool calls so you get the entire conversation stored. If you dont want to get super deep, then read only is safe and only stores what you ask. You could ask it things like "why is my reasoning dumb" by recalling passed conversations, or even give it the claude tool call sequence and ask "how can claude be smarter about next time".
> > 
> > I think of it like a file tree with proper namespacing and keep abstract concepts in separate directories. so like my food preferences will be in like /preferences/sandos. or you can even do things like /system-design preferences and then load them into a relevant conversation for next time.
> > 
> > **DANmode** • [2025-12-29](https://news.ycombinator.com/item?id=46427403)
> > 
> > Total speculation:
> > 
> > Text Index of past conversations, using prompt-like summaries.