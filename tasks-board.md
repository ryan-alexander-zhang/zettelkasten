## Today

### WIP

```tasks
status.type is IN_PROGRESS
```

### High

```tasks
not done
priority is above medium
```

### None repeated due today

```tasks
((not done) AND (due before in 1 day)) OR (done on today)
is not recurring
sort by priority
```

### Repeated due today

```tasks
((not done) AND (due before in 1 day)) OR (done on today)
is recurring
sort by priority
```

### Overdue before today

```tasks
not done
due before today
sort by priority
```

### Today complete

```tasks
done
done on today
```

## Future (no repeat)

### in 1 day

```tasks
not done
due before in 1 day
is not recurring
sort by priority
sort by due
```

### in 3 days

```tasks
not done
due after in 1 day
due before in 3 day
is not recurring
sort by priority
sort by due
```

### in 7 days

```tasks
not done
due after in 3 day
due before in 7 day
is not recurring
sort by priority
sort by due
```

## Singles Tasks

### in 7d(non project x no repeate)

```tasks
not done
status.type is not CANCELLED
NOT (path includes .index)
NOT (path includes .todo)
NOT (path includes .notodo)
due after in 7 days
sort by priority, due
```

### none project x no due x no repeat

```tasks
not done
status.type is not CANCELLED
NOT (path includes .index)
NOT (path includes .todo)
NOT (path includes .notodo)
no due date
sort by priority, due
```

## Projects

TODO

## Help

>[About Queries - Tasks User Guide - Obsidian Publish](https://publish.obsidian.md/tasks/Queries/About+Queries)
>[从 Toodledo 到 Obsidian Tasks - 我的 GTD 最佳实践](https://blog.alswl.com/2023/02/gtd/)
