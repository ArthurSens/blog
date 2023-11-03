---
title: "When my Counter Restarted? Addressing Decade-Old Counter Limitation!"
excerpt: "Created timestamps landed in Prometheus v2.49.0! Understand what are created timestamps, what problems it is fixing and how you can enable them in your application!"
coverImage: '/assets/blog/created-timestamps/cover.jpeg'
date: '2023-11-04T00:00:00.000Z'
author:
  name: Arthur Sens
  picture: '/assets/blog/authors/arthursens.jpg'
ogImage:
  url: '/assets/blog/created-timestamps/cover.jpeg'
---

Prometheus v2.49.0 is coming! This version is especially important to me because it will introduce something we call "Created Timestamps Ingestion". This is part of a 6 months project that was developed as part of [Google Summer of Code](https://summerofcode.withgoogle.com/) and it touched so many different aspects of Software development! From design documents and building consensus with the team to coding SDKs and storage systems. It was a terrific learning experience that I'd recommend to any person interested in Open Source development :)

So, what are Created Timestamps? Let me explain it with a little story:

## Monitoring the rabbit vs. turtle race training

Once upon a time, there was a rabbit and a turtle... yes this is a real story... believe us!

The rabbit and the turtle were training for a legendary race. So legendary that there are history books about this tale nowadays. At the time, my mentors and I were there as consultants to their coach. Their coach was training both of them remotely (thanks COVID), and yesssss OF COURSE he was using Prometheus to monitor their training. <u>Prometheus was configured to scrape the training data every 10 seconds</u>. 

The coach wanted to make sure both of them ran at least 30 meters every single day and he also set up alerts to monitor potential lazy students, but the data he was seeing was a bit strange, so he asked for our help.

![Turtle and rabbit outside the track](/assets/blog/created-timestamps/turtle-rabbit-outside-track.png)

One thing that is important to note is that only when each animal crosses the start line, Prometheus can identify that the animal starts the training and needs to be measured. This means we have no time series until that happens.

So yeah, both of them went to the race track, and the turtle immediately started its training. 

![Turtle at 10m mark](/assets/blog/created-timestamps/turtle-at-10m.png)

The rabbit saw how slow the turtle was running and was like "What a clown, I'm gonna take a nap and still do my training before the turtle"

Meanwhile, Prometheus checked the state of the training and the turtle was already 10m away, so Prometheus sees `travel_meters_total` equal to 10. 

The rabbit was competitive even in its sleep, so 10 seconds later it woke up and saw the turtle already 20m away.

Notice how the rabbit still hasn't crossed the start line, so Prometheus checks the state again but has no idea that the rabbit even exists.

![Turtle at 20m mark](/assets/blog/created-timestamps/turtle-at-20m.png)

On the third measurement, Prometheus sees both animals on the 30-meter mark. We were lucky because we were there and saw everything, but the coach could only query Prometheus to know what happened.

![Turtle and rabbit at 30m mark](/assets/blog/created-timestamps/turtle-and-rabbit-at-30m.png)

So, in the eyes of the coach, what happened there?

The coach was showing us his Prometheus instance, and we could see that the data looked weird. We see that the time series representing the rabbit appears only after a few scrapes, and out of nowhere it is already 30 meters.

So technically Prometheus only had a single data point about the rabbit.

Did the rabbit teleport to the finish line? Did it just skip the start line? What happened there?

![Traveled meters without Created Timestamps](/assets/blog/created-timestamps/traveled-meters-without-created-timestamps.png)

Reading the results of the `rate` of `travel_meters_total`, we would say that the rabbit has never left the start line.

The problem here is very clear to my mentors and me:

<u>***What if we ingested the time when they hit the start line for the first time?***</u>

## Created timestamps semantics

When working on the design of created timestamps, we came up with something like this:

> "Created timestamps is a piece of metadata that tells the exact time when a time series first came into existence. Or the precise time when the time series was reset."

We were not the first ones to come up with this idea, of course. Created timestamps were already mentioned by [OpenMetrics specification](https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#:~:text=A%20MetricPoint%20in%20a%20Metric%20with%20the%20type%20Counter%20SHOULD%20have%20a%20Timestamp%20value%20called%20Created.%20This%20can%20help%20ingestors%20discern%20between%20new%20metrics%20and%20long%2Drunning%20ones%20it%20did%20not%20see%20before.) and also by [OpenTelemetry data model](https://opentelemetry.io/docs/specs/otel/metrics/data-model/#:~:text=Every%20OTLP%20metric,in%20the%20stream.).

## Implementing Created Timestamps in Prometheus

As most Prometheus users know, Prometheus is a time series database. It ingests time series samples while associating them with a timestamp. Usually, the timestamp when that particular sample was scraped by Prometheus.

With Prometheus unaware of Created Timestamps, we could represent 3 samples from a particular time series like the image below:

![TSDB Chunk unaware of Created Timestamps](/assets/blog/created-timestamps/chunk-without-created-timestamps.png)

The green dotted lines represent samples of a series with the same created timestamps. Notice how the third sample has a different creation time, which means that a reset happened there. Prometheus reset detection is done by comparing sequential samples: "If the next sample value is lower than the previous one, a reset happened". The third sample value is higher than the second, so Prometheus has no idea that a reset happened between them.

The strategy we came up with was to make client libraries able to expose time series creation time, and Prometheus would ingest a "synthetic zero" between scraped samples where it makes sense:

![TSDB Chunk aware of Created Timestamps](/assets/blog/created-timestamps/chunk-with-created-timestamps.png)

## Back to the training

We kindly asked the coach to use our version of Prometheus, and we immediately saw better results.

Notice on the RIGHT side how `traveled_meters_total` starts in 0 for both the turtle AND the rabbit.

![traveled_meters_total with Created Timestamps](/assets/blog/created-timestamps/traveled-meters-with-created-timestamps.png)

This also reflects on rates, showing how the rabbit was super fast and did not cheat during his training.

![rate(traveled_meters_total) with Created Timestamps](/assets/blog/created-timestamps/rate-traveled-meters-with-created-timestamps.png)

## Enabling Created Timestamps in your workloads

Exposing Created Timestamps is enabled by default by [Prometheus client_golang](https://github.com/prometheus/client_golang) since release [v1.17.0](https://github.com/prometheus/client_golang/releases/tag/v1.17.0), as long as Prometheus Protobuf exposition format is used during content negotiation.

On Prometheus's side, you'll need to make the following changes:
* Upgrade Prometheus version to at least v2.49.0
* Enable feature-flag `--feature-flag=created-timestamp-ingestion` (Beware that this feature flag will change the default scraping protocol to Prometheus Protobuf)

## Future of Created Timestamps (call for action!!!!)

We'd love to see Created Timestamps getting broad adoption in the Prometheus ecosystem! If you are a Prometheus client contributor/maintainer, it would be lovely to see PRs implementing Created Timestamps with Prometheus Protobuf.

We're also working on enabling Created Timestamp ingestion with the OpenMetrics parser, and extending the Remote-Write protocol to push Created Timestamps as part of time series metadata!

## Created Timestamps at PromCon!

This blog is an adaptation of the talk [Bartek](https://www.bwplotka.dev/) and I gave it during our PromCon presentation! It goes even deeper into current pains and how Created Timestamps solves them! Feel free to watch if you prefer it that way :)

Talk from 6:46 until 7:15

[![Created Timestamps at PromCon](https://img.youtube.com/vi/pKYhMTJgJUU/hqdefault.jpg)](https://www.youtube.com/embed/pKYhMTJgJUU?si=qJxk23qKgAvOKiez)

[<img src="https://img.youtube.com/vi/pKYhMTJgJUU/hqdefault.jpg" width="600" height="300"
/>](https://www.youtube.com/embed/pKYhMTJgJUU?si=qJxk23qKgAvOKiez)