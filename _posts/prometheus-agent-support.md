---
title: 'Prometheus-Operator v0.64.0 supports Prometheus in Agent mode'
excerpt: 'Prometheus Agent is a deployment mode optimized for remote-write scenarios. Prometheus-Operator has finally released support for this deployment mode! Take a quick look behind the decisions made so this could happen and what it enables.'
coverImage: '/assets/blog/prometheus-agent-support/cover.png'
date: '2023-04-13T00:00:00.000Z'
author:
  name: Arthur Sens
  picture: '/assets/blog/authors/arthursens.jpg'
ogImage:
  url: '/assets/blog/prometheus-agent-support/cover.png'
---

The Prometheus-Operator team has recently released [v0.64.0](https://github.com/prometheus-operator/prometheus-operator/releases/tag/v0.64.0) and with it comes the long wait support for running Prometheus in [Agent mode](https://www.cncf.io/blog/2021/11/16/prometheus-announces-an-agent-to-address-a-new-range-of-use-cases/). With agent mode being [released by the upstream project](https://github.com/prometheus/prometheus/releases/tag/v2.32.0) in late 2021 and support for it [requested in the operator bug tracker even before that](https://github.com/prometheus-operator/prometheus-operator/issues/3989), we can confidently say that this was a long-waited feature!

## What is Prometheus Agent?

Prometheus Agent is a specialized mode that focuses on three parts that have made the success of Prometheus: service discovery, scraping, and remote writing. Built into Prometheus itself, Prometheus Agent behaves like a normal Prometheus server: it is a pull-based mechanism, scraping metrics over HTTP and replicating the data to remote write endpoints. The agent mode has a persistent buffering mechanism, heavily inspired by the existing Prometheus TSDB WAL, with the difference that data is immediately erased after it has been successfully pushed via remote-write.

Without local storage, Prometheus Agent is not able to provide metrics via query APIs, nor to evaluate rules, and therefore can't send them to an Alertmanager cluster either. For the majority of scenarios, this is a fine trade since metrics are queried and evaluated from other Prometheus-compatible tools like Cortex and Thanos.

## What is Prometheus-Operator?

Prometheus-Operator is a Kubernetes Operator that manages Prometheus instances, and their configuration, running in a Kubernetes Cluster. Alongside Prometheus, it can also manage siblings components that often run alongside Prometheus, e.g. Alertmanager and ThanosRuler. Prometheus-Operator accomplishes its job by leveraging the Kubernetes API, using Custom Resource Definitions (CRD). 

With the Prometheus Custom Resource, for example, you can use a Kubernetes manifest to declaratively define the whole Prometheus configuration, e.g. specify remote-write/read endpoints and authentication, configure TSDB retention and block durations, enable feature flags and several other bits that you may need.

One could say that we could just run Prometheus in Agent mode with the following manifest:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
  namespace: monitoring
spec:
  enableFeatures: ["agent"]
  image: quay.io/prometheus/prometheus:v2.43.0
```

## Why not re-use the Prometheus Custom Resource?

To explain why a new CRD was needed, first, we need to explain the differences between running Prometheus in Server and Agent modes. Prometheus Agent was implemented in a way that both the Server and the Agent run from the same binary, with a few differences with runtime configuration through flags and also in the configuration file (that one passed through the required flag `--config.file`). 

The most obvious example is that running Prometheus in Agent mode requires us to enable a feature flag: `--enable-feature=agent`, but there are a few others, although not too relevant for this section of the blog post.

The most relevant part comes from the Prometheus configuration file, which one can see the reference on [Prometheus's website](https://prometheus.io/docs/prometheus/latest/configuration/configuration/). At the time that this blog post was written, the Prometheus website does not tell which parts of the configuration file are supported by both the Agent and Server modes and which ones are supported by Server only. I'm hoping that I can clarify things here 🙂.

Here is a list of differences in the configuration file:

>1. As previously mentioned Agent is not able to evaluate recording and alerting rules, so there is no pointing defining `global.evaluation_interval`
>1. For the same reason, `rule_files` isn't supported.
>1. Still on a similar note, `alerting` isn't needed since there won't be any firing alerts to be sent.
>1. Lastly, `remote_read` also is not supported by the Agent mode.

Now that all of this was explained, **why not re-use the Prometheus Custom Resource?**

There are a few workarounds available to run Prometheus in Agent mode using the Prometheus CR for quite a while now[[1](https://github.com/prometheus-operator/prometheus-operator/issues/3989#issuecomment-974137486)][[2](https://github.com/prometheus-community/helm-charts/issues/2506#issuecomment-1304632868)], but notice how they all involve overriding hardcoded flags and nullifying API fields from the CR. The User Experience(UX) is not great for the maintainer of the monitoring stack. It's easy to get something wrong here and, if not causing a production outage, one will have a battle with their CI system 💩.

After taking a look at the workarounds, a new CRD becomes very appealing. We can simply remove from the API everything that is related to alerting or remote-read, we set the correct flags and it also opens doors to future development that is focused on the Agent mode. Whatever common fields and logic that are handled by both Server and Agent can be shared in a single [pkg](https://github.com/prometheus-operator/prometheus-operator/tree/main/pkg/prometheus).

## Looking for feedback!

Although the `PrometheusAgent` CRD is still in version `v1alpha1`, we encourage people to try it out in non-critical environments and help us track potential bugs and feature requests for operating Prometheus in Agent mode in Kubernetes!

Please open issues in the [Prometheus-Operator bug tracker](https://github.com/prometheus-operator/prometheus-operator/issues)

## What's next for Agent mode?

With PrometheusAgent being released with the alpha API, there are a few rough edges that still need to be sharpened so it can eventually graduate to beta and GA.


### Improve Test coverage

Prometheus-Operator has extensive integration tests for all its GA CRDs, those tests help the team to keep shipping new features with confidence, making sure that previous features do not break with the changes that are made through time.

At the time that this blog post was written, that were no integration tests at all for the PrometheusAgent CRD. Test coverage will be vital for the team to keep improving the user experience.

### Support for different Deployment Patterns [prometheus-operator/prometheus-operator#5495](https://github.com/prometheus-operator/prometheus-operator/issues/5495)

This one gets me very excited! A small and efficient container for Prometheus Agent also brings several new approaches on how to deploy Prometheus.

Today, the common usage pattern for Prometheus is to deploy a chunky Prometheus Server, or a [High-Availabilty setup](https://prometheus-operator.dev/docs/operator/high-availability/) (which is even heavier resource-wise) that is responsible to scrape, collect, and remote-write metrics from all containers running in a Kubernetes Cluster. This pattern is the most common because Prometheus has been known to be a memory-heavy application. Deploying several Prometheus per cluster can increase memory consumption fairly quickly.

The common pattern has a few failure modes that can compromise the metric collection for the whole cluster. 

Cardinality explosion[[1](https://grafana.com/blog/2022/02/15/what-are-cardinality-spikes-and-why-do-they-matter/)][[2](https://chronosphere.io/learn/what-is-high-cardinality/)] is a well-known problem in the Prometheus ecosystem. It happens when, accidentally or not, a new label or metric is added to one or more endpoints that exponentially increase metrics cardinality. The result is also memory consumption increasing exponentially until the container reaches the Pod's memory limits and crashes. Depending on how bad it is, a single container can be responsible for crashing a Prometheus instance that is responsible for scraping thousands of other containers. It seems naive that a single container can be responsible for so much trouble.

If the use case is focused on the remote-write scenario, one can just switch to Agent mode to try to reduce memory consumption a little bit. In a scenario where metrics cardinality increases exponentially, however, it's possible that it won't be enough. 

If we could use the Prometheus-Operator to deploy the Agent as a DaemonSet, i.e. one agent per node that is responsible to scrape metrics from apps running in the same node, we could reduce the blast radius of a potential Cardinality explosion. 

Another pattern that can be explored is the sidecar injection. If a pod contains a particular annotation, the Prometheus-Operator could inject PrometheusAgent as a sidecar container and each Pod that exposes Prometheus metrics could have its very own Prometheus buddy. Cardinality explosion would be minimal since one pod would never affect another.

Of course, this is just me daydreaming without a deeper analysis of how this could be implemented. If you want to participate in this discussion, be sure to follow the related issue: [https://github.com/prometheus-operator/prometheus-operator/issues/5495](https://github.com/prometheus-operator/prometheus-operator/issues/5495)