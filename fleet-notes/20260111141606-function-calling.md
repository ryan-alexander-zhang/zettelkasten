---
tags:
  - llm
  - function-calling
id: 20260111141611
created: 2026-01-11 14:16:11
status:
  - done
type: fleet-note
aliases:
  - function-calling
---

Function calling is a protocol between the developer and the model. The developer provides the function name, description, parameters, and more to the model. The model then determines whether to invoke the function to retrieve relevant data.

[[20260111114605-mcp|MCP]] defines and implements the tools. The reasoning service will select the tools and map them to the function-calling. So that the LLM can determine whether to tell the reasoning service to invoke the function or not. If the LLM tells the reasoning service that you need to do the function calling. Then, the reasoning service will instruct the agent to invoke the MCP tool, allowing it to inject the result into the LLM and proceed.

# References
* [Function calling \| OpenAI API](https://platform.openai.com/docs/guides/function-calling)