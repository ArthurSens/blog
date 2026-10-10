---
title: "Interoperability Through Shared Maintenance"
excerpt: "Compatible protocols are useful. Shared ownership of the difficult implementation work may matter more."
date: '2026-10-10T00:00:00.000Z'
author:
  name: Arthur Sens
  picture: '/assets/blog/authors/arthursens.jpg'
---

The next phase of Prometheus and OpenTelemetry interoperability may be less about translating one wire format into another and more about sharing the engineering underneath it.

That distinction matters.

A Remote Write-compatible sender can still have its own queueing behavior, WAL assumptions, durability rules, retry logic, and recovery semantics. Two components may speak the same protocol and still require two separate groups of people to maintain the difficult parts.

Prometheus documents Remote Write as a path that reads from the WAL, buffers samples in memory, and sends them through a queue. That implementation boundary is not part of the wire protocol. It is operational machinery around the protocol, and it is where many of the hard failure and recovery decisions live.

The PromCon EU 2026 program includes a talk about Prometheus Agent mode, and related Munich Dev Summit discussions explored whether parts of the Remote Write implementation could be made reusable between Prometheus and the OpenTelemetry Collector. The direction is interesting because it changes the question from “Can these systems exchange data?” to “Can they avoid maintaining the same difficult behavior twice?”

That is not a merger announcement. It is not evidence that Agent mode is being retired, that the Collector exporter will embed a Prometheus database, or that a shared package already exists. It is a design direction that still needs precise boundaries.

A useful boundary might be:

- share implementation when the problem is genuinely the same;
- preserve differences where Prometheus and OpenTelemetry have different collection, storage, or pipeline responsibilities;
- make durability and failure guarantees explicit instead of assuming that protocol compatibility implies operational compatibility.

The reusable unit matters. Is it a sender? A queue? A WAL abstraction? A set of retry and backoff policies? A library that can be consumed by both Prometheus and an OpenTelemetry Collector distribution? Each answer carries different consequences for ownership, testing, configuration, and user-visible behavior.

There is also a less glamorous question: who maintains it?

Sharing code can reduce duplication, but it can also create a new coordination boundary. A component used by two ecosystems needs clear compatibility expectations, release discipline, tests that exercise both consumers, and maintainers who can make decisions without turning every change into a cross-project negotiation. Shared maintenance is valuable only when the ownership model is at least as clear as the API.

This is a more demanding definition of interoperability. It asks not only whether two systems can exchange compatible messages, but whether they can share the parts of the implementation that should be shared without hiding the differences that users depend on.

The proposal is promising precisely because it is not simple. A shared Remote Write implementation could be more valuable than another compatibility diagram, but only if the boundary is designed carefully and the resulting guarantees are documented honestly.

## Sources and open validation

- [PromCon EU 2026 schedule](https://promcon.io/2026-munich/schedule/), including Kyle Eckhart's Agent mode talk.
- [Prometheus Remote Write tuning documentation](https://prometheus.io/docs/practices/remote_write/), for the WAL and queue behavior described above.
- [Prometheus Remote Write 2.0 specification](https://prometheus.io/docs/specs/prw/remote_write_spec_2_0/), which remains marked experimental.
- [VALIDATE — technical claim] Add the exact public source for the Munich Dev Summit discussion about reusing Remote Write implementation between Prometheus and the OpenTelemetry Collector.
- [VALIDATE — technical claim] Confirm the exact talk segment and speaker attribution before publication.
