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



# FAQ

## Knative Event Sink HTTPS URL STL Error

```json
 {
  "@timestamp": "2026-01-16T09:44:30.119612129Z",
  "@version": "1",
  "message": "failed to send event to subscriber context={topics=[knative-broker-test06-default], consumerGroup='knative-trigger-test06-url-trigger-01', reference=uuid: \"4d203cbe-6d9b-46b6-88d1-f68955020e3d\"\nnamespace: \"test06\"\nname: \"url-trigger-01\"\nkind: \"Trigger\"\ngroupVersion: \"eventing.knative.dev/v1\"\n} target=https://<url>",
  "logger_name": "dev.knative.eventing.kafka.broker.dispatcher.impl.http.WebClientCloudEventSender",
  "thread_name": "vert.x-eventloop-thread-1",
  "level": "ERROR",
  "level_value": 40000,
  "stack_trace": "javax.net.ssl.SSLHandshakeException: Failed to create SSL connection\n\tat io.vertx.core.net.impl.ChannelProvider$1.userEventTriggered(ChannelProvider.java:136)\n\tat io.netty.channel.AbstractChannelHandlerContext.invokeUserEventTriggered(AbstractChannelHandlerContext.java:398)\n\tat io.netty.channel.AbstractChannelHandlerContext.invokeUserEventTriggered(AbstractChannelHandlerContext.java:376)\n\tat io.netty.channel.AbstractChannelHandlerContext.fireUserEventTriggered(AbstractChannelHandlerContext.java:368)\n\tat io.netty.handler.ssl.SslHandler.handleUnwrapThrowable(SslHandler.java:1403)\n\tat io.netty.handler.ssl.SslHandler.decodeJdkCompatible(SslHandler.java:1384)\n\tat io.netty.handler.ssl.SslHandler.decode(SslHandler.java:1428)\n\tat io.netty.handler.codec.ByteToMessageDecoder.decodeRemovalReentryProtection(ByteToMessageDecoder.java:530)\n\tat io.netty.handler.codec.ByteToMessageDecoder.callDecode(ByteToMessageDecoder.java:469)\n\tat io.netty.handler.codec.ByteToMessageDecoder.channelRead(ByteToMessageDecoder.java:290)\n\tat io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:444)\n\tat io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:420)\n\tat io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:412)\n\tat io.netty.channel.DefaultChannelPipeline$HeadContext.channelRead(DefaultChannelPipeline.java:1357)\n\tat io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:440)\n\tat io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:420)\n\tat io.netty.channel.DefaultChannelPipeline.fireChannelRead(DefaultChannelPipeline.java:868)\n\tat io.netty.channel.nio.AbstractNioByteChannel$NioByteUnsafe.read(AbstractNioByteChannel.java:166)\n\tat io.netty.channel.nio.NioEventLoop.processSelectedKey(NioEventLoop.java:796)\n\tat io.netty.channel.nio.NioEventLoop.processSelectedKeysOptimized(NioEventLoop.java:732)\n\tat io.netty.channel.nio.NioEventLoop.processSelectedKeys(NioEventLoop.java:658)\n\tat io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:562)\n\tat io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:998)\n\tat io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)\n\tat io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)\n\tat java.base/java.lang.Thread.run(Thread.java:1583)\nCaused by: java.lang.RuntimeException: Unexpected error: java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be non-empty\n\tat java.base/sun.security.validator.PKIXValidator.<init>(PKIXValidator.java:97)\n\tat java.base/sun.security.validator.Validator.getInstance(Validator.java:173)\n\tat java.base/sun.security.ssl.X509TrustManagerImpl.getValidator(X509TrustManagerImpl.java:308)\n\tat java.base/sun.security.ssl.X509TrustManagerImpl.checkTrustedInit(X509TrustManagerImpl.java:183)\n\tat java.base/sun.security.ssl.X509TrustManagerImpl.checkTrusted(X509TrustManagerImpl.java:254)\n\tat java.base/sun.security.ssl.X509TrustManagerImpl.checkServerTrusted(X509TrustManagerImpl.java:144)\n\tat java.base/sun.security.ssl.CertificateMessage$T13CertificateConsumer.checkServerCerts(CertificateMessage.java:1265)\n\tat java.base/sun.security.ssl.CertificateMessage$T13CertificateConsumer.onConsumeCertificate(CertificateMessage.java:1164)\n\tat java.base/sun.security.ssl.CertificateMessage$T13CertificateConsumer.consume(CertificateMessage.java:1107)\n\tat java.base/sun.security.ssl.SSLHandshake.consume(SSLHandshake.java:393)\n\tat java.base/sun.security.ssl.HandshakeContext.dispatch(HandshakeContext.java:477)\n\tat java.base/sun.security.ssl.SSLEngineImpl$DelegatedTask$DelegatedAction.run(SSLEngineImpl.java:1273)\n\tat java.base/sun.security.ssl.SSLEngineImpl$DelegatedTask$DelegatedAction.run(SSLEngineImpl.java:1260)\n\tat java.base/java.security.AccessController.doPrivileged(AccessController.java:714)\n\tat java.base/sun.security.ssl.SSLEngineImpl$DelegatedTask.run(SSLEngineImpl.java:1205)\n\tat io.netty.handler.ssl.SslHandler.runDelegatedTasks(SslHandler.java:1695)\n\tat io.netty.handler.ssl.SslHandler.unwrap(SslHandler.java:1541)\n\tat io.netty.handler.ssl.SslHandler.decodeJdkCompatible(SslHandler.java:1377)\n\t... 20 common frames omitted\nCaused by: java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be non-empty\n\tat java.base/java.security.cert.PKIXParameters.setTrustAnchors(PKIXParameters.java:200)\n\tat java.base/java.security.cert.PKIXParameters.<init>(PKIXParameters.java:120)\n\tat java.base/java.security.cert.PKIXBuilderParameters.<init>(PKIXBuilderParameters.java:104)\n\tat java.base/sun.security.validator.PKIXValidator.<init>(PKIXValidator.java:94)\n\t... 37 common frames omitted\n",
  "context": {},
  "target": "https://<url>"
}
 
```







# References

[^1]: [Knative Broker for Apache Kafka - Knative](https://knative.dev/docs/eventing/brokers/broker-types/kafka-broker/#configure-a-kafka-broker)
[^2]: [Configure Broker defaults - Knative](https://knative.dev/docs/eventing/configuration/broker-configuration/#configuring-the-default-broker-class-for-namespaces)
[^3]: [Configure Sugar Controller - Knative](https://knative.dev/docs/eventing/configuration/sugar-configuration/)
[^4]: [Knative Broker for Apache Kafka - Knative](https://knative.dev/docs/eventing/brokers/broker-types/kafka-broker/#additional-information)