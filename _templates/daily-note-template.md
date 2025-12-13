---
type: daily-note
id: <% tp.date.now("YYYYMMDDHHmmss")%>
created: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
---

## Just write



## TODO
### **WIP**
```tasks
status.type is IN_PROGRESS
```
### **New tasks**
### **Tasks view - today**

```tasks
((not done) AND (due before {{date}})) OR ((not done) AND (due on {{date}})) OR (done on {{date}})
is not recurring
sort by priority, due
```
### **Tasks view - today(repeated)**
```tasks
((not done) AND (due before {{date}})) OR ((not done) AND (due on {{date}})) OR (done on {{date}})
is recurring
sort by priority, due
```
### **Overdue date**

```tasks
not done
due before {{date}}
sort by priority, due
```
### **Tasks view - today done**

```tasks
done
done on {{date}}
```
