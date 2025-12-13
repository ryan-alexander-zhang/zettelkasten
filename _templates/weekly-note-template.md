---
Type: weekly-note
week_start: <% moment().startOf('isoWeek').format('YYYY-MM-DD') %>
week_end: <% moment().endOf('isoWeek').format('YYYY-MM-DD') %>
week_id: <% moment().format('GGGG-[W]WW') %>
id: <% tp.date.now("YYYYMMDDHHmmss")%>
created: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
Tags:
---
## Weekly Tasks

### Important & Urgent

```tasks
not done
due on or before <% moment().endOf('isoWeek').format('YYYY-MM-DD') %>
priority is above medium
sort by priority, due
```


### Not Important & Urgent

```tasks
not done
due on or before <% moment().endOf('isoWeek').format('YYYY-MM-DD') %>
((priority is none) OR (priority is below high))
sort by priority, due
```

### Not Important & Not Urgent

```tasks
not done
((due after <% moment().endOf('isoWeek').format('YYYY-MM-DD') %>) OR (no due date))
((priority is none) OR (priority is below high))
sort by priority, due
```

## Completed This Week

```tasks
done in <% moment().startOf('isoWeek').format('YYYY-MM-DD') %> <% moment().endOf('isoWeek').format('YYYY-MM-DD') %>
sort by done reverse
```

## Not Completed This Week

### Still Open by Sunday (includes overdue)

```tasks
not done
has due date
due on or before <% moment().endOf('isoWeek').format('YYYY-MM-DD') %>
sort by priority, due
```

### WIP (Work In Progress)

```tasks
status.type is IN_PROGRESS
```

## Review

### Goals vs Results

* Top 1–3 goals for this week
	* Goal 1
	* Goal 2
* What I actually delivered?
	* 1
	* 2

### What Went Well (keep doing)

### What Did Not Go Well (root cause)

### Next Week Plan (most important)