---
type: "to-read"
id: 20251217211244
created: 2025-12-17T21:44:44
source:
  - "https://mp.weixin.qq.com/s/cIg3wbGnNi2mPxmf0Ib3Tw"
tags:
reviewd: false
---
Original 希里安 *2025年11月30日 17:23*

### 希里安近日见闻

11月过去了，迎来今年最后一个月，马上2025年又要过去了，希望各位读者身体健康，一切顺利！

最近在开发CiliKube过程中，在想如果部署了CRD资源，应该要怎么展示到前端界面进行操作，所以开发了一个Monitor Operator作为测试，但是Oprator具体应该怎么开发呢，这里就记录写一下，希里安也是学习者，边学边用，写的有问题的，欢迎各位读者一起交流！

![Image](https://mmbiz.qpic.cn/mmbiz_png/3fdeQLoQfqHJlJAo3984wXXvVXJib2NLYZwv3RGm9QC976UpQfLKDPBtDWgXkEmPm9SPr2aSecwJveYxiavelKxg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

## Kubernetes Operator

可能有些人实际工作中在k8s集群中已经用了很多Operator，但是可能不太了解具体是怎么开发，不要着急，今天希里安就先和大家一起研究学习下，看看Operator到底是怎么回事,弄明白了再开发也不迟。

### Operator 模式

官方解释是这样的,链接在这里  
Operator 模式 <sup><span>[1]</span></sup>  
`https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/operator/`

> Operator 是 Kubernetes 的 **扩展软件** ， 它利用定制资源管理应用及其组件。 Operator 遵循 Kubernetes 的理念，特别是在控制器方面。

**扩展软件，那么可以扩展那些呢？**

Operator 主要通过 新增 API（CRD）+ 控制器逻辑 来扩展 Kubernetes，但真实可触及的点远不止 API，几乎能在API 层、控制回路、接入点、节点插件、运维体验等多层扩展 Kubernetes 的能力与行为

**1.API 层 — 新的资源类型与子资源**

> 把业务概念变成 k8s 对象

**2\. 控制平面行为 — 自定义控制器 / reconcile 逻辑**

> 例如实现主从选举、滚动升级、自动修复故障等

**3\. 入站/出站钩子 — Admission 与 Webhook**

> 创建/更新资源时拦截、自动注入、参数校验

**4.节点与插件层-Device Plugin + CSI + CNI**

> 自动部署 CSI 驱动、安装 node-agent、管理 GPU、RDMA、DPU、存储、网络插件

**5.Scheduler 扩展**

> 自定义调度器或 Scheduler Plugin（Framework）

**6.XXX...**

光看以上这些解释，大概还是云里雾里，我来举个例子吧！

想象你是一个经验丰富的运维或者DBA，你知道如何：

- • 安装和配置数据库
- • 监控数据库健康状态
- • 执行备份和恢复
- • 处理故障和扩容
- • 优化性能

现在，如果你要去度假一个月，你会怎么办？你大概率可能会：

1. 1\. 写一份详细的SOP操作手册
2. 2\. 培训一个临时替代者把你活都干了（那估摸你也不用再来上班了）
3. 3\. 设置监控和自动化脚本

**Operator 就是这样一个"数字化运维专家"** ，它把人类运维专家的知识和经验和操作逻辑编码成软件，让 Kubernetes 无需人工干预，就能自动化、标准化地管理这类复杂应用

## 核心概念

**Operator = 自定义资源定义（CRD）+ 控制器 + 运维知识**  
![Image](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

Brandon Philips (CoreOS CTO) 在 2016 年的博客中首次定义了 Operator：

> "An Operator is a method of packaging, deploying and managing a Kubernetes application"

![Introducing Operators: Putting Operational Knowledge into Software](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

Introducing Operators: Putting Operational Knowledge into Software

核心思想：

- • 将运维专家的知识编码到软件中
- • 使用 Kubernetes API 扩展机制
- • 实现应用程序的自动化管理

### Custom Resource（CR / CRD）声明式管理

K8s 默认有 Deployment、Service、Pod 等资源，但要管理一个业务资源比如数据库、监控等，这叫 CR（自定义资源）定义 CR 类型的 schema 的 YAML 就叫 CRD

```
apiVersion: mysql.example.com/v1
kind: MySQLCluster
spec:
  replicas: 3
  version: "8.0.35"
```

**CRD** ： CRD 允许你定义自己的 Kubernetes 资源类型。它扩展了 Kubernetes API，使你能够创建和管理自定义对象

> 定义 “想要的应用状态”（比如 “我要一个 3 节点的 PGSQL 集群”），是 Operator 的 “配置入口”

核心作用：定义 “期望状态”

### Controller-控制循环

**控制器** ：控制器是一个控制循环，它监视资源的当前状态，并采取行动使当前状态与期望状态匹配

监听 CR 的变化，对比期望状态（spec）与实际状态（status），自动执行“修正动作”（reconcile）

1. 1\. 获取期望状态
2. 2\. 观察当前状态
3. 3\. 计算差异并执行调和
	> 用户创建/更新资源或者Pod 状态变化以及配置变化触发事件队列，控制器就开始调和逻辑
```
1. 用户 apply 一个 MySQLCluster
2. Controller 收到事件
3. Controller 读取集群当前状态
4. 判断是否达到 spec 的期望
5. 如果不一致 → 执行修复操作
6. 更新 status（当前状态）
7. 持续监听下一次变化
```

> 核心执行单元，持续对比 “实际状态” 和 “期望状态”，自动触发操作让二者一致（比如发现集群只有 2 节点时，自动创建第 3 个节点）

### 领域经验

**领域经验** ：嵌入控制器的业务逻辑（比如数据库的备份策略、故障切换规则），是 Operator 区别于普通控制器的核心

> 调和（Reconciliation）  
> 调和是控制器的核心逻辑，它比较资源的当前状态和期望状态，然后执行必要的操作来消除差异

Operator 模式代表了云原生应用管理的未来方向，它将人类的运维经验转化为代码，实现了真正的自动化运维。

看到这，估计大家有一个大概的印象了吧，Operator 是一种 Kubernetes 的扩展模式，它使用自定义资源定义（CRD）来管理应用程序及其组件。Operator 遵循控制器模式，持续监控集群状态并采取行动以达到期望状态。通过理解这些核心概念和模式，就可以尝试设计和实现出色的 Kubernetes Operator了

## Operator 的演变过程

### 第一代：脚本化运维

纯手动或者版手动操作，依赖运维人员进行基础操作

```
#!/bin/bash
# 传统的部署脚本
kubectl apply -f database-deployment.yaml
kubectl apply -f database-service.yaml
kubectl apply -f database-configmap.yaml

# 等待部署完成
kubectl wait --for=condition=available deployment/database

# 手动检查状态
kubectl get pods -l app=database
```

**问题：**

- • 无法处理意外情况
- • 不能自动恢复
- • 缺乏状态管理
- • 难以扩展，脚本复用性差

### 第二代：Helm Charts

```
# values.yaml
database:
  image: postgres:14
  replicas: 1
  storage: 10Gi
  
# 使用 Helm 部署
helm install my-db ./database-chart
```

**改进：**

- • 模板化配置
- • 版本管理
- • 参数化一键部署

**仍然存在的问题：**

- • 静态配置，部署后还得人工修改配置
- • 无法自动运维，仅解决部署问题
- • 缺乏智能决策，无法根据状态自动干预

### 第三代：Operator

```
# 声明期望状态
apiVersion: database.example.com/v1
kind: PostgreSQL
metadata:
  name: my-database
spec:
  version: "13"
  replicas: 3
  storage: 100Gi
  backup:
    schedule: "0 2 * * *"
    retention: "30d"
  monitoring:
    enabled: true
```

**优势：**

- • 声明式管理，opertor负责实现
- • 全生命周期自动化运维
- • 智能决策，嵌入业务逻辑，自主应对异常
- • 持续调和，持续对比 “实际状态” 与 “期望状态”

看完这个就知道为什么需要学习开发Operator了，但也不是没有缺点

- • 开发 / 维护成本高，需要一定时间
- • 学习门槛高，得涉及k8s、Go开发基础等
- • 通用性弱，一般是特定应用定制，通用性不咋地
- • 故障风险，Operator 自身故障会直接导致应用管理失效

## 应用场景

### 1\. 数据库管理

- • **MySQL Operator**: 自动化 MySQL 集群管理
- • **PostgreSQL Operator**: 处理主从复制、备份恢复
- • **Redis Operator**: 管理 Redis 集群和哨兵模式

### 2\. 中间件管理

- • **Kafka Operator**: 管理 Kafka 集群、Topic 和分区
- • **Elasticsearch Operator**: 处理索引管理和集群扩缩容
- • **RabbitMQ Operator**: 管理消息队列集群

### 3\. 应用程序管理

- • **Prometheus Operator**: 监控系统的自动化部署和配置
- • **Istio Operator**: 服务网格的生命周期管理
- • **Cert-Manager**: 自动化 TLS 证书管理

### 4\. 机器学习和大数据

- • **Spark Operator**: 管理 Spark 作业和集群
- • **TensorFlow Operator**: 分布式机器学习训练
- • **Airflow Operator**: 工作流调度管理

## 开发工具选择

官方列举有这些工具和库，可以用于编写自己的云原生operator，这里挑几个常用的来看看

编写你自己的 Operator <sup><span>[2]</span></sup>  
![Image](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

### 1\. Kubebuilder

- • **优势**: Go 语言，性能好，社区活跃
- • **适用**: 复杂业务逻辑，高性能要求
- • **学习曲线**: 中等

### 2\. Operator SDK

- • **优势**: 支持多语言 (Go/Ansible/Helm)
- • **适用**: 快速原型开发，多样化需求
- • **学习曲线**: 较低

### 3\. KOPF (Python)

- • **优势**: Python 语言，简单易学
- • **适用**: 快速开发，脚本化运维
- • **学习曲线**: 低

### 4\. Java Operator SDK

- • **优势**: Java 生态，企业级应用
- • **适用**: Java 技术栈团队
- • **学习曲线**: 中等

了解了以上内容，如果你不想开发，也可以在 OperatorHub.io <sup><span>[3]</span></sup> 上找到现成的、适合你的 Operator

![Image](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

## 开发阶段

以上先介绍这些，下一篇希里安将介绍如何使用Operator工具去开发一个只需部署一个自定义资源就能同时启动prometheus和grafana的简单示例Operator，欢迎各位读者关注和交流

> Monitor Operator 是一个 Kubernetes Operator，用于自动化管理 Prometheus 和 Grafana 监控栈的完整生命周期。它能够：
> 
> - • 自动部署和配置 Prometheus
> - • 自动部署和配置 Grafana
> - • 管理 Prometheus 的存储和配置
> - • 自动配置 Grafana 数据源
> - • 监控组件的健康状态
> - • 自动恢复故障组件

### 5 分钟快速体验

如果已经有相关经验的读者，可以直接拉取仓库代码进行优化或者部署这个示例Opertaor到自己的集群尝试一下再交流！

仓库地址（欢迎贡献交流）： `https://github.com/ciliverse/monitor-operator`

这里可以通过预构建镜像、源码构建以及helm部署、建议直接用 Helm部署 <sup><span>[4]</span></sup>

![Image](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

#### 1\. 添加 Helm 仓库

```
# 添加 Ciliverse Charts 仓库
helm repo add ciliverse https://charts.cillian.website

# 更新仓库
helm repo update

# 搜索可用的 Charts
helm search repo ciliverse
```

#### 2\. 安装 Monitor-Operator

```
# 基础安装
helm install monitor-operator ciliverse/monitor-operator \
  --namespace monitoring \
  --create-namespace
```

#### 3\. 最简配置

适用于快速测试和开发环境：

```
# simple-monitoring.yaml
apiVersion: monitoring.cillian.website/v1
kind: MonitorStack
metadata:
  name: simple-monitoring
  namespace: default
spec:
  prometheus:
    enabled: true
  grafana:
    enabled: true
    adminPassword: "admin123"
    datasources:
      - name: prometheus
        type: prometheus
        url: http://simple-monitoring-prometheus:9090
```
```
# 应用配置
kubectl apply -f simple-monitoring.yaml

# 查看状态
kubectl get monitorstack simple-monitoring
```
![Image](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

访问Grafana界面  
![Image](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

**安装使用只是第一步，通过工具的学习使用，让他人受益才能发挥工具的价值！**

感兴趣的读者可以 **关注公众号“希里安”，获取项目最新动态和技术分享！**

#### 推荐阅读

#### Ingress-Nginx 26年3月正式退役！那以后用什么？当然是 Gateway API！

#### 什么是 API 网关？5 分钟看懂 APISIX 核心概念！

#### 开源新星CILIKUBE，专为小白设计，玩转Vue3+Go全栈与云原生，Helm部署轻松上手！

#### 引用链接

`[1]` Operator 模式: *https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/operator/*  
`[2]` 编写你自己的 Operator: *https://kubernetes.io/docs/concepts/extend-kubernetes/operator/*  
`[3]` OperatorHub.io: *https://operatorhub.io/*  
`[4]` Helm部署: *https://charts.cillian.website/*  

  

作者提示: 个人观点，仅供参考

继续滑动看下一个

希里安

向上滑动看下一个