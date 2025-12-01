---
tags:
id: 20251120145445
created: 2025-11-20
reviewed: false
status:
  - in_progress
type: fleet-note
---

```java
// SkippedTasks to be added  
Optional.of(pipelineRun).map(PipelineRun::getStatus).map(PipelineRunStatus::getSkippedTasks)  
    .orElse(List.of())  
    .forEach(skippedTask -> {  
      skippedTasks.add(toSkippedTask(skippedTask));  
    });  
  
Optional<Condition> condition = Optional.of(pipelineRun)  
    .map(PipelineRun::getStatus)  
    .map(PipelineRunStatus::getConditions)  
    .orElse(List.of())  
    .stream()  
    .filter(c -> "Succeeded".equals(c.getType()))  
    .findFirst();  
  
condition.ifPresent(c -> {  
  builder.status(c.getStatus());  
  builder.reason(c.getReason());  
  builder.message(c.getMessage());  
});
```

```java
Optional.ofNullable()
```
# References

# Link to