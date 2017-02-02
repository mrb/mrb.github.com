---
layout: post
title: "The impossible fragility of Dockerfiles"
published: true
---
<br/>
### The impossible fragility of Dockerfiles

Docker has done some amazing things for me, and for businesses that I’ve worked with, even in the very short time that it has existed. Certain large, technically complex problems that I’ve been a part of solving could not have been solved elegantly if it weren’t for Docker. I’ve seen people’s careers made by it, an entire secondary industry even, and yet, I still find their basic unit, the Dockerfile, to be a complete nightmare.

When I first started using Docker, I thought "this is a tough problem now, but it will probably get better." Now, several years later, I'm not so sure. To me, the fundamental problem remains this:

*Dockerfiles attempt to abstract over infrastructure by allowing units to be composed and extended. The fundamental issue is that that’s just not how infrastructure really works.*

As an example, I recently spent time, as a *very experienced Docker user*, attempting to create a Dockerfile for an application which uses the following technology:

- Ruby
- Rails
- MySQL (as in the client, not running a DB server inside this container)

Perhaps the three most vanilla, obvious choices for a language, a web framework, and a database to back them.**[1]** Instead of being straightforward for me to put this together, it was anything but. There is no off the shelf, easy way to "Dockerize" this type of application, and any solution that I found was broken in one way or another, made one or more wrong assumptions, or just straight up didn't work.

While it’s true that once something has been successfully pushed into a Dockerfile it works nicely, it remains, as of the beginning of 2017, to be way, way too difficult and time consuming to make even slight changes to existing Dockerfiles to suit general purpose needs.

Again, I’d like to say something positive sounding like "I'm sure this will be solved eventually, and that this problem will go away," but I’m really not sure that this is possible. What are some possible solutions that can make the Dockerfile problem tractable? How can infrastructure, so fragmented and granular in its natural state, ever become reliably composable? Someone help me out.

For now, I’ll be over here banging my head on a desk over and over again.

<hr/>

**[1]** If your takeaway here is "it's Ruby that's broken, not Docker!" -- that's kind of proving my point. How can Docker be successful when the things it purports to abstract remain so desparately broken?
