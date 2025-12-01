---
tags:
  - llm
  - agent
  - memory
id: 20251118174737
created: 2025-11-18
reviewed: false
status:
  - done
type: fleet-note
---


## **Mem0 Install**

Ensure you use the Docker Compose YAML file located in the server folder.
### Known issue.
#### Dependency error.
[Added psycopg-pool to Rest API Server requirements by shubhampandey3008 · Pull Request #3754 · mem0ai/mem0](https://github.com/mem0ai/mem0/pull/3754)

### Config

```python
DEFAULT_CONFIG = {
    "version": "v1.1",
    "vector_store": {
        "provider": "pgvector",
        "config": {
            "host": POSTGRES_HOST,
            "port": int(POSTGRES_PORT),
            "dbname": POSTGRES_DB,
            "user": POSTGRES_USER,
            "password": POSTGRES_PASSWORD,
            "collection_name": POSTGRES_COLLECTION_NAME,
        },
    },
    "graph_store": {
        "provider": "neo4j",
        "config": {"url": NEO4J_URI, "username": NEO4J_USERNAME, "password": NEO4J_PASSWORD},
    },
    "llm": {"provider": "openai", "config": {"api_key": OPENAI_API_KEY, "temperature": 0.2, "model": "qwen-flash", "openai_base_url":"https://dashscope.aliyuncs.com/compatible-mode/v1/"}},
    "embedder": {"provider": "openai", "config": {"api_key": OPENAI_API_KEY, "model": "text-embedding-v2", "openai_base_url":"https://dashscope.aliyuncs.com/compatible-mode/v1/"}},
    "history_db_path": HISTORY_DB_PATH,
}
```


## **API Test**

### Add memory

```shell
curl -v -X POST http://localhost:8888/memories \
 -H "Content-Type: application/json" \
 -d '{
   "messages": [
     {"role": "user", "content": "I love fresh vegetable pizza."}
   ],
   "user_id": "alice"
 }'
```

### Search memory
```shell
curl -v -X POST http://localhost:8888/search \
  -H "Content-Type: application/json" \
-d '{
  "user_id":"alice",
  "query":"vegetable"
}'
```

## **Features need to be developed

1. Auth.
2. Depends on Vector DB & Neo4j Graph DB （BaaS or supplied by user).

# References
* [Site Unreachable](https://zhuanlan.zhihu.com/p/1918716138671576017)
* [GitHub - topoteretes/awesome-ai-memory: A list of AI memory projects](https://github.com/topoteretes/awesome-ai-memory)
*  [Spring AI Alibaba接入Mem0，给agent 赋予长期记忆回忆过去的相关互动 存储重要的用户偏好和事实背 - 掘金](https://juejin.cn/post/7548653563079311369)
* * [mem0/openmemory/docker-compose.yml at main · mem0ai/mem0](https://github.com/mem0ai/mem0/blob/main/openmemory/docker-compose.yml)

# Link to