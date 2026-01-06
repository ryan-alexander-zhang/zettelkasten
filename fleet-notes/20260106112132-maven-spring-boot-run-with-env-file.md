---
tags:
  - maven
  - shell
id: 20260106112137
created: 2026-01-06 11:21:37
status:
  - done
type: fleet-note
aliases:
  - maven-spring-boot-run-with-env-file
---
```sh
 set -a; source .env; set +a; mvn spring-boot:run -pl hive-backend-start
```

