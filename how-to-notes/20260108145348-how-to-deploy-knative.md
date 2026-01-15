---
tags:
  - how-to
  - knative
id: 20260108145405
created: 2026-01-08 14:54:05
status:
  - in_progress
type: how-to-note
aliases:
  - how-to-deploy-knative
---
# Deploy Knative



# Configure Knative

## Configure Knative Eventing

### Configure kafka-broker-config [^1]

> [!info] Configure How to Connect with Kafka Cluster

```yaml
apiVersion: v1
data:
  bootstrap.servers: my-cluster-kafka-bootstrap.kafka:9092
  default.topic.partitions: "10"
  default.topic.replication.factor: "3"
kind: ConfigMap
metadata:
  labels:
    app.kubernetes.io/version: 1.20.1
  name: kafka-broker-config
  namespace: knative-eventing
```

### Configure config-br-defaults [^2]

> [!info] Default Configuration of Broker

```yaml
apiVersion: v1
data:
  default-br-config: |
    clusterDefault:
      brokerClass: MTChannelBasedBroker
      apiVersion: v1
      kind: ConfigMap
      name: config-br-default-channel
      namespace: knative-eventing
      delivery:
        retry: 10
        backoffPolicy: exponential
        backoffDelay: PT0.2S
kind: ConfigMap
metadata:
  annotations: {}
  labels:
    app.kubernetes.io/name: knative-eventing
    app.kubernetes.io/version: 1.20.0
  name: config-br-defaults
  namespace: knative-eventing
```

Can use `KafkaBroker` class to replace the `MTChannelBasedBroker`. And you need to change the ConfigMap to refer to the `kafka-borker-config`.

WARNING: The document used the `KafkaBroker`. But it's the `Kafka` actually. And if you use the Kafka Broker, there's no need to use the default channel config.

```yaml
apiVersion: v1
data:
  default-br-config: |
    clusterDefault:
      brokerClass: Kafka
      apiVersion: v1
      kind: ConfigMap
      name: kafka-broker-config
      namespace: knative-eventing
      delivery:
        retry: 10
        backoffPolicy: exponential
        backoffDelay: PT1S
kind: ConfigMap
```
### Configure sugar [^3]

配置给 Namespace 打 Label 后自动创建一个 Broker：

```yaml
apiVersion: v1
data:
  _example: |
    ################################
    #                              #
    #    EXAMPLE CONFIGURATION     #
    #                              #
    ################################
    # This block is not actually functional configuration,
    # but serves to illustrate the available configuration
    # options and document them in a way that is accessible
    # to users that `kubectl edit` this config map.
    #
    # These sample configuration options may be copied out of
    # this example block and unindented to be in the data block
    # to actually change the configuration.

    # namespace-selector specifies a LabelSelector which
    # determines which namespaces the Sugar Controller should operate upon
    # Use an empty value to disable the feature (this is the default):
    namespace-selector: ""

    # Use an empty object as a string to enable for all namespaces
    namespace-selector: "{}"

    # trigger-selector specifies a LabelSelector which
    # determines which triggers the Sugar Controller should operate upon
    # Use an empty value to disable the feature (this is the default):
    trigger-selector: ""

    # Use an empty object as string to enable for all triggers
    trigger-selector: "{}"
  namespace-selector: |
    matchExpressions:
    - key: "eventing.knative.dev/injection"
      operator: "In"
      values: ["enabled"]
kind: ConfigMap
metadata:
  annotations:
    knative.dev/example-checksum: 62dfac6f
  labels:
    app.kubernetes.io/name: knative-eventing
    app.kubernetes.io/version: 1.20.0
  name: config-sugar
  namespace: knative-eventing
```

手动触发：

```sh
kubectl label ns tenant-a eventing.knative.dev/injection=enabled --overwrite
```

### Configure Namespaced Kafka Broker [^4]

```yaml
apiVersion: eventing.knative.dev/v1
kind: Broker
metadata:
  name: default
  namespace: tenant-a
  annotations:
    eventing.knative.dev/broker.class: KafkaNamespaced  # 大小写敏感
spec:
  config:
    apiVersion: v1
    kind: ConfigMap
    name: kafka-broker-config
    # namespace: tenant-a  # 省略，默认就是 Broker 的 namespace
```

这里有个问题：必须创建一个 kafka-broker-config 到 Broker 的 Namespace 中，如果使用数据面隔离就不能复用 `knative-eventing` namespace 下的 `kafka-broker-config`。


Refer to the blog：[Knative Apache Kafka Broker with Isolated Data Plane - Knative](https://knative.dev/blog/articles/kafka-broker-with-isolated-data-plane/#isolated-data-plane)

# References

[^1]: [Knative Broker for Apache Kafka - Knative](https://knative.dev/docs/eventing/brokers/broker-types/kafka-broker/#configure-a-kafka-broker)
[^2]: [Configure Broker defaults - Knative](https://knative.dev/docs/eventing/configuration/broker-configuration/#configuring-the-default-broker-class-for-namespaces)
[^3]: [Configure Sugar Controller - Knative](https://knative.dev/docs/eventing/configuration/sugar-configuration/)
[^4]: [Knative Broker for Apache Kafka - Knative](https://knative.dev/docs/eventing/brokers/broker-types/kafka-broker/#additional-information)