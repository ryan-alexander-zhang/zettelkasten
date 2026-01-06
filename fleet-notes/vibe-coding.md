---
tags:
  - vibe-coding
id: 20251217214913
created: 2025-12-17 21:49:13
reviewed: false
status:
  - done
type: fleet-note
---
Agent 不一定能拉到网页内容，比如 GitHub 的一些 Markdown，建议下载下来手动喂

使用 copilot 试验，GoLand

## 使用总结

* breaking down 很重要
* 沉淀工程提示词、规则
* 明确指定代码可编译，可测试的步骤
* 要有耐心，review 文档、output、code 也是很耗费心力的
* 一些高级技巧跟编辑器、IDE、插件、模型等等都有关系，相当得坑，可以使用最简单的办法，一套模板替换关键词重复使用

## 个人感受

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
* 提高了风险代码引入的概率

未知：
* 质量问题，改代码的代价可能大于写代码
* SDD （spec-kit, open-kit）带来的文档 review 的成本可能大于写代码的成本
* 整理上下文 + 写提示词的成本可能大于写代码
* 可能出现意向不到的情况 [r/ClaudeAI - Reddit](https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/)


> [!INFO] 这个写代码指的是 AI Assists 的 Coding


## 个人使用技巧

### 自定义指令做约束
自定义指令：[[github-copilot-custom-instructions]]

### 提示词沉淀+使用+约束

保留prompts 方便以后review 也方便沉淀提示词

```shell
./prompts/
├── 01-auth.prompt.md
├── 02-ui-components.prompt.md
├── 03-ui-textinput.prompt.md
├── 04-service-list.prompt.md
├── 05-configuration-list.prompt.md
├── 06-configuration-create.prompt.md
├── 07-configuration-delete.prompt.md
├── 08-service-describe.prompt.md
├── 09-service-create.prompt.md
├── 10-service-create-param-rules.prompt.md
└── 11-service-delete.prompt.md
```


提示词复用，在Input Bod 使用 Slash 就可触发，目录 `.github/prompts/` ，文件名为 `*.prompt.md`

可以将一些可以复用的参考、约束

比如：生成README，[awesome-copilot/prompts/create-readme.prompt.md at main · github/awesome-copilot](https://github.com/github/awesome-copilot/blob/main/prompts/create-readme.prompt.md)
比如：统一生成工程目录，比如demo 仓库里的这个prompt：[awesome-copilot/prompts/create-spring-boot-java-project.prompt.md at main · github/awesome-copilot](https://github.com/github/awesome-copilot/blob/main/prompts/create-spring-boot-java-project.prompt.md#download-spring-boot-project-template)

包括一些自定义的，比如为了满足使用OpenAPI 的规范，提示词可以加去生成接口和DTO 的Swagger 注解（但我感觉也可以通过路径去写custom instructions 做约束）
```java
@Operation(summary = "Create a new service", description = "Creates a new service for the specified tenant.", operationId = "createService")  
@ApiResponses(  
    {        @ApiResponse(responseCode = "201", description = "Service created successfully"),  
        @ApiResponse(responseCode = "409", description = "Service already exists", content = @Content(  
            mediaType = "application/json",  
            schema = @Schema(implementation = Response.class)  
        ))  
    })  
@PostMapping("/{tenant}/services")  
public ResponseEntity<SingleResponse<CreateServiceDTO>> create(  
    @Parameter(description = "Tenant name", example = "tenant-001", required = true)  
    @PathVariable("tenant") @NotNull(message = "The tenant name is required.") @Length(max = 16) String tenant,  
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Service creation command", required = true)  
    @RequestBody @Validated ServiceCreateCmd cmd) {  
  SingleResponse<CreateServiceDTO> response = serviceI.create(tenantAuthHelper.getLoginId(tenant),  
      cmd);  
  return ResponseEntity.ok(response);  
}
```



# References
* [[github-copilot-custom-instructions]]
