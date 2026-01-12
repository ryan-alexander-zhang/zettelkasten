---
type: "to-read"
id: 20260112090126
created: 2026-01-12T09:54:26
source:
  - "https://mp.weixin.qq.com/s/0r1BTRptgjouoF1xohZksw"
tags:
reviewd: false
---
Original FanOne *2026年1月8日 09:20*

## 写在前面

最近接触 agent 开发比较多，这篇文章来讲一下Agent开发中，常用的三种设计范式。 `ReAct、Plan & Execute、Multi-Agent` 。这几种模式主要是 `工作流程` 的不同。

## ReAct (Reasoning + Acting)

**ReAct 原理** ：将 `推理 (Reasoning)` 和 `行动 (Acting)` 交织在一起。

**Agent 在执行每一步动作之前，都会先进行 `思考（Thought）` ，决定下一步 `做什么（Action）` ，然后 `观察结果（Observation）` ，再进行 `下一次思考` ，如果大模型觉得已经完成了，就进行结果的输出。**

![在这里插入图片描述](https://mmbiz.qpic.cn/mmbiz_png/UBiaA4ibmWk2YRVzpC67S6zUE7CXiaN1YKHDV58XtYAK2I81jEWictLial6321EiaFwhKO5016xHmlpcGaVbnRdWiafFg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

How ReAct Works

举个发送邮件的例子：

1. **Input：** 用户请求帮我发邮件给FanOne，让他快点更新视频
2. **Thought 1：** 我需要找到“我”和FanOne的邮箱地址
3. **Action 1：** `Search Email`
4. **Observation 1：** 找到了我的邮箱是 A，FanOne的邮箱是 B
5. **Thought 2：** 我已经知道“我”和FanOne的邮箱地址了，现在需要编辑好Email
6. **Action 2：** `Edit Email`
7. **Observation 2：** 发件人，收件人，Title，Content...
8. **Thought 3：** 我已经编辑好了邮件，就等用户授权同意了
9. **Action 3：** `Ask For Agree`
10. **Observation 3：** 用户授权同意，邮件已发送，并无响应错误
11. **Thought 4 ：** 已经完成发送
12. **Output：** 完成，已为你发送完邮件
![在这里插入图片描述](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

Example For ReAct

ReAct 形式能处理需要 `多步推理` 的需求，并且可以对结果进行修正，容错率高。但 `Token的消耗较大` ，因为中间的步骤多，并且 `容易陷入循环` 。

## Plan & Execute

**P&E原理** ：先把大任务拆解成一个详细的步骤清单 `（Plan）` ，然后按顺序逐一执行这些步骤 `（Execute）` 。通常包含两个角色： `Planner（规划者）和 Executor（执行者）` 。

![在这里插入图片描述](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

How Plan & Execute Works

举个例子：

1. **Input：** 用户输入，“帮我看看哪个平台买iPhone 17便宜”
2. **Planner：列出方法和步骤** 2.1 步骤1：查到有哪些主流的电商平台 2.2 步骤2：对主流平台请求查看优惠价格 2.3 步骤3：计算比较哪个平台的iPhone 17便宜
3. **Executor：执行方法和步骤** 3.1 执行1：查到有某宝、某多多、某东、某猫、某音商城、某鱼等主流电商平台... 3.2 执行2：查询各平台的iPhone 17的商品价格和优惠详情，某宝 X 元，某东 X 元.... 3.3 执行3：计算比较的出结论：某鱼的iPhone 17便宜。
4. **OutPut：** 某鱼的价格便宜，其次某多多，再到某宝....

![在这里插入图片描述](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E) `明确的Plan` ，会让目标更加清晰， `适合复杂且步骤明确的任务` ，避免 Agent 跑偏。但如果计划一开始就错了，后续执行都会错，难以动态调整，除非引入 Replanner 或者 Evaluator 之类的能进行评估回滚进行容错。

## Multi-Agent

**原理** ：多个拥有不同角色和专长的 Agent 互相通信、协作来完成任务。 `通常涉及“管理者 (Manager)”和“执行者 (Worker)”或者“对练 (Debate)”。`  

这里我们先讲一下Debate (辩论/对练) 是 Multi-Agent 系统中的一种 `特殊协作模式` ，核心思想是 `真理越辩越明` 。引入了 `对抗` 或 `互相质疑` 的机制。

**两个或多个 Agent 针对同一个问题提出不同的观点，互相找茬、反驳，最终通过这种高强度的思维碰撞，得出一个更准确、更全面的结论。**

![在这里插入图片描述](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

How Multi-Agent Works

举个例子，用户请求：“帮我写一个贪吃蛇游戏，并确保没有 Bug。”

1. **Manager**: 收到需求，拆解任务。呼叫 `Coder` 写代码，呼叫 `Reviewer` 检查。
2. **Coder Agent**: 编写贪吃蛇的代码。提交给 Manager。
3. **Manager**: 转交给 `Reviewer` 。
4. **Reviewer Agent**: 运行代码，发现蛇撞墙后没有死亡。反馈给 `Coder` 。
5. **Coder Agent**: 修复 Bug，重新提交。
6. **Reviewer Agent**: 再次测试，通过。
7. **Manager**: 将最终代码交付给用户。
![在这里插入图片描述](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

Example For Multi-Agent

这一类设计核心在于 `专业分工` ，让专业的 Agent 做专业的事，能解决单体 Agent 难以处理的超复杂任务， `模拟人类团队工作流。` 但能看出，这样的开发复杂度高，通信成本高，可能出现 **`死循环对话。`**

最后总结一下：

- **ReAct：** 需要 **`实时外部信息或者动态决策` **，并且** 下一步依赖上一步结果任务** 。用大白话来讲就是走一步算一步，这一步完成了，再思考下一步，再执行下一步，进行动态决策。
- **Plan-and-Execute：** `任务目标明确，步骤清晰` ， **适合流程固定、不容出错的长任务** ，类似标准的执行SOP。大白话来讲就是列好需要做的清单，按步执行下去。
- **Multi-Agent：** `任务极其复杂，需要不同领域的专业知识` ，单体 LLM 搞不定的。

继续滑动看下一个

小生凡一

向上滑动看下一个