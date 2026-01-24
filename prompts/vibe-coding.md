## 需求


## 技术规范
* 复用组件，避免重复代码
* 遵循 Google 代码规范
## 后端技术栈
* Java 21
* Spring Boot 4.0.2
* Maven 3.6.3 or later
* DDD 架构，start、app、infra、domain、adapter
* MyBatis-Plus
* Reddision
* Kafka 3.7.1
* Redis 7.0
## 前端技术栈 （使用最新版本@latest）
* React
* Next JS 
* TypeScript
* Shadcn UI
* Tailwind CSS
* lucide-react

## Docker

项目必须能够使用 Docker 启动，使用的 Docker Compose Yaml 示例如下，按照如下模板编写：

```yaml
version: '3.8'  
services:  
  mysql:  
    image: mysql:8.0  
    environment:  
      MYSQL_ROOT_PASSWORD: root  
      MYSQL_DATABASE: root  
    ports:  
      - "3406:3306"  
    volumes:  
      - ./.data/mysql:/var/lib/mysql  
  redis:  
    image: redis:7.0  
    ports:  
      - "6479:6379"  
    volumes:  
      - ./.data/redis:/data  
  kafka:  
    image: bitnamilegacy/kafka:3.7.1-debian-12-r9  
    ports:  
      - "9092:9092"  
    environment:  
      # KRaft mode (no Zookeeper)  
      - KAFKA_CFG_NODE_ID=0  
      - KAFKA_CFG_PROCESS_ROLES=controller,broker  
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093  
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,INTERNAL://:29092,CONTROLLER://:9093  
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092,INTERNAL://kafka:29092  
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,INTERNAL:PLAINTEXT  
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL  
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER  
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true  
      - ALLOW_PLAINTEXT_LISTENER=yes  
    volumes:  
      - ./.data/kafka:/bitnami/kafka  
  kafka-ui:  
    image: provectuslabs/kafka-ui:latest  
    ports:  
      - "8080:8080"  
    environment:  
      - KAFKA_CLUSTERS_0_NAME=local  
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:29092  
    depends_on:  
      - kafka
```