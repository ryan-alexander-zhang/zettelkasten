---
tags:
  - knative
id: 20260114132542
created: 2026-01-14 13:25:42
status:
  - in_progress
type: fleet-note
aliases:
  - knative-eventing-architecture
---

![image.png](https://images.hnzhrh.com/note/20260114132713772.png)


Trigger is a router. 


> [!quote]
> Knative Eventing uses standard HTTP POST requests to send and receive events between event producers and sinks. These events conform to the [CloudEvents specifications](https://cloudevents.io/), which enables creating, parsing, sending, and receiving events in any programming language.



# References
* [Knative Eventing overview - Knative](https://knative.dev/docs/eventing/)
* [CloudEvents](https://cloudevents.io/)