---
type: "to-read"
id: 20260116090104
created: 2026-01-16T09:52:04
source:
  - "https://www.cloudamqp.com/blog/message-queues-exaplined-with-analogies.html"
tags:
reviewd: false
---
I find stories and analogies very fascinating and — to explain message queues in a super approachable way, we will use some analogies:*databases, warehouses and post offices.*

Stay with me …

Databases are primarily used for data persistence — think Postgres or MongoDB. Like databases, message queues also perform some storage function.*But why use message queues for data storage when there are databases?*Think of databases and message queues in terms of **warehouses and post offices.**

- *Databases are like warehouses -* they are designed to hold a lot of different things, most times, over a long period of time.
- *Message queues on the other hand are like post offices —* Where letters and packages stop briefly on their way to being delivered. The packages don't stay there long; they're just sorted and sent off to where they need to go.

Essentially, databases are primarily designed for scenarios where you need to store and manage some state over a long period of time. In contrast, you would want to use a message queue for data that you do not want to keep around for very long— A message queue holds information just long enough to send it to the next stop.

If you look at message queues from this post office perspective, then you will begin to appreciate the fact that **a message queue is simply a medium through which data flows from a source system to a destination system.**

![](https://www.cloudamqp.com/img/blog/message-queues/message-queue-data-flow.svg)

Looking at message queues as medium of communication is just one perspective, but it’s sufficient to help you get started with message queues — Let’s double down on that perspective.

A message queue is a technology that simply receives data, formally called **messages** in the message queueing world from a source system(s) **(producer),**lines up these messages in the order they arrive, then sends each message to some final destination, usually another system called the **consumer.**

*Note that both the* **producer** and **consumer** could also just be modules in the same application.

![](https://www.cloudamqp.com/img/blog/message-queues/message-queue-architecture.svg)

Now that we understand the core essence of message queues, let’s explore how they work.

## How a Message Queue Works

Typically, producers and consumers would connect and communicate with a message queue via some protocol that the message queue supports.

In other words, a message queue would implement a protocol or some set of protocols. To communicate with a message queue, a producer or consumer would leverage some client library that also implements the protocol or one of the protocols supported by the broker.

Most message brokers commonly implement at least one of these protocols: AMQP, MQTT and STOMP. You can learn more about these protocols in our [AMQP vs MQTT](https://www.cloudamqp.com/blog/amqp-vs-mqtt.html) guide or the [AMQP, MQTT and STOMP guide.](https://www.cloudamqp.com/blog/rabbitmq-and-websockets-part-1-amqp-mqtt-stomp.html)

## When to Use a Message Queue

We’ve already seen how message queues allow messages to flow from a source system to a destination system. This inherent nature of message queues makes them perfect for communication between systems in a microservice architecture.

What is the microservice architecture? Again, let’s start with something you are familiar with — Monoliths.

A monolith is characterized by the entire codebase being inside one application. This is a great approach for smaller projects, and many new applications start out as a monolith. This is because on a smaller monoliths are faster to develop, easier to test, and easier to deploy.

![](https://www.cloudamqp.com/img/blog/message-queues/monolith.svg)

However when an application starts to grow, the more problems you will see with this architecture. Even with a structured approach, the code often starts to feel messy and the development experience becomes inconvenient. Changes become more difficult to implement, and the risk of introducing bugs is higher.

Many times the solution to these problems is to break up your monolith application into microservices. And microservices are smaller, more modular services that focus on a single area of responsibility.

![](https://www.cloudamqp.com/img/blog/message-queues/monolith-to-microservices.svg)

The microservice approach has some benefits:

- With microservices, there is fault isolation— if one service is buggy, that bug is isolated to just that service. This in turn makes your application more reliable compared to a monolith where a single component error could take down the entire application.
- There is also the opportunity of being able to diversify the technology stack from service to service, which helps you optimize your services for its purpose. For example, a performance critical service has the chance to make certain performance trade-offs, without putting limits to the rest of the services.
- Naturally, scaling becomes much easier because you can just scale one of your services instead of scaling the entire application and save a lot of resources.

Now that we understand what microservices are, let’s cycle back to: Using message queues for communication between systems in a microservice architecture.

But before we get to that, note that message queueing isn’t the only way to get services to communicate — There is one other common way:

**Synchronous communication,**where network requests are sent directly from one service to another via REST API calls, for example. Service A will initiate a request and then wait for Service B to finish handling the request and send a response back before it continues on with the activity it was doing.

![](https://www.cloudamqp.com/img/blog/message-queues/synch-communication.svg)

With message queueing, the communication is asynchronous — In this case, Service A can send messages to a message broker and instead of waiting for Service B, it will receive a super quick acknowledgement back from the broker and then it can carry on doing what it was doing while Service B fetches the message from the queue and handles it.

![](https://www.cloudamqp.com/img/blog/message-queues/asynch-communication.svg)

This will save your service from overloading if there is a suddenly increased workload, instead the messages are buffered by the queue and your services can just handle them when they have the capacity.

There you have it, a very gentle introduction to message queues. Now, let’s do a recap.

## Conclusion

In summary, message queues are like post offices for your data, moving messages from one place to another. They work by receiving messages from producers, lining them up in the order they arrive, and sending them to consumers. This makes them perfect for situations where systems need to communicate without waiting— think microservice architectures.

Understanding how message queues work and when to use them can help you build more reliable and scalable applications.

![DraftKings](https://www.cloudamqp.com/img/customers/logo-draftkings.jpg) ![Mozilla](https://www.cloudamqp.com/img/customers/logo-mozilla.jpg) ![Docker](https://www.cloudamqp.com/img/customers/logo-docker.jpg) ![Heroku](https://www.cloudamqp.com/img/customers/logo-heroku.jpg) ![Discovery](https://www.cloudamqp.com/img/customers/logo-discovery.jpg) ![Salesforce](https://www.cloudamqp.com/img/customers/logo-salesforce.jpg)