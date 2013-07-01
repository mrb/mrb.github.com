---
layout: post
title: "To Know A Garbage Collector: GoRuCo 2013"
published: true
gc: true
---
# 
### To Know A Garbage Collector: GoRuCo 2013

After being an attendee of the <a href="http://goruco.com/">Gotham Ruby Conference</a> (better known as GoRuco) for five consecutive years, I was very pleased to get the chance to speak this year, which was my sixth. I have learned a great deal both about programming and community from the New York City Ruby groups that I have been a part of, and GoRuCo is always a highlight of my year conference-wise. As you can see <a href="http://michaelrbernste.in/2013/05/20/adventures-in-GC-pedagogy.html">here</a>, <a href="http://michaelrbernste.in/2013/05/28/a-generation-ago-a-thoroughly-modern-sampling.html">here</a>, and <a href="http://michaelrbernste.in/2013/06/03/real-time-garbage-collection-is-real.html">here</a>, I have tried to be thorough in my research in preparing, and have had a great time learning so much about such a fascinating topic.

The talk was recorded to be released later, and I will add a link here when that happens. In the meantime, I have written up a short summary and embedded <a href="https://speakerdeck.com/mrb/goruco-2013">the slides</a> below.

#### Influences

After introducing myself and making some corny jokes, I spoke a bit about three main influences, material-wise, for my talk.

**Jones et al.'s *The Garbage Collection Handbook* ** - I've written about this book a few times before, but the gist of it is: if you want to know anything about the art of automatic memory management, this is your source. I focused on this a particular quote as my entry point into the wild world of Garbage Collection:

> "The undecidability of liveness is a corollary of the halting problem"

I couldn't possibly do the depth of this quote any justice here but it put the discipline in perspective and made me realize that GC is truly one of the quintessential Computer Science problems.

**Cooper et al.'s *Teaching Garbage Collection without Implementing Compilers or Interpreters*** - I wrote about this paper <a href="http://michaelrbernste.in/2013/05/20/adventures-in-GC-pedagogy.html">in a blog post</a>, so I won't say more than that I specifically mentioned how the framework described in this paper allowed me to see GC algorithms in a concise and clear way that wasn't possible elsewhere.

**Bacon et al.'s *A Unified Theory of Garbage Collection*** - I made sure to play up the important role that this paper played in how I intended to describe some interesting characteristics of the relationship between various Garbage Collection algorithms. I'm going to write a post on this paper, so I won't cover it here, but I highly recommend it.

#### Two Goals

I framed the talk in terms of two goals that I had for the audience. These were to *get excited about GC* and to *think about the connection between programming languages and GC*. I found that after many attempts to form the exposition in other terms, the idea of being very clear up front with the audience with the goals helped focus me and made editing considerably easier.

**Get *excited* about GC** - This was the most challenging aspect of the presentation to put together because I intended to do the following in 30 minutes:

* Define GC in simple terms
* Define some technical terms relating to GC
* Re-Define GC in technical terms
* Talk a little bit about the academic history of GC
* Describe Mark & Sweep (Tracing) GC Algorithms using Ruby pseudo-code
* Describe Reference Counting GC Algorithms using Ruby pseudo-code
* Discuss a few pros and cons about each type of GC
* Introduce the Unified Theory
* Gradually refine the Unified Theory

And that's it. Teaching the basics of 8 technical terms, 2 algorithms, and comparing and contrasting them in that short a period of time is an extremely fun challenge. (*Note that I sort of cheated on this challenge because as a former Middle and High School teacher I often had to teach at a similar pace.*) Looking at the talk as a "lesson" for a group of people that are probably smarter than me guided me; I aimed to satisfy those that had some knowledge or intuition about how Ruby interacts with its GC.

**Think about the connection between programming languages and GC** - I asked some questions about how programming languages are designed and created, segueing from a point in Bacon et al.'s paper about how design of GC can be "made more deliberate." Various Ruby implementations, Java, and Haskell were discussed briefly before I summarized, concluded, answered some questions (great ones! About how Linux copy-on-write behavior impacts GC, what generational GC is, etc.), and said goodbye.

#### In Conclusion

This talk wasn't a "how to guide" for tuning your application's GC. The idea was to give people the technical and critical tools to understand that like most complex problems in programming, the more you make GC selection and tuning decisions based on your domain and requirements, the more successful you will be.

Garbage Collection is designed to be transparent. Your goal should be to control the GC completely independently of your application code, and allow developers to just express business logic with application code, as it was meant to be. I spent some time during the talk discussing the following quote, which I feel is appropriate:

> "GC is not a generic solution for memory leaks, but a (correct) GC is a generic solution for 'dangling pointers'. Just as there is no general solution for 'loops' (due to undecidability), there is no general solution for 'leaks'." -- Henry Baker

Finally, I'd like to thank all of my friends and colleagues for their help preparing for this presentation. During research they helped me with guidance and critiques, and were instrumental in me providing a great experience for the GoRuCo attendees.

#### The Video

<object width="560" height="315"><param name="movie" value="//www.youtube.com/v/NFCsZbtQElk?version=3&amp;hl=en_US&amp;rel=0"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="//www.youtube.com/v/NFCsZbtQElk?version=3&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" width="560" height="315" allowscriptaccess="always" allowfullscreen="true"></embed></object>

#### The Slides
# 

<script async class="speakerdeck-embed" data-id="123a0ac0b2730130eaf05236bfdba4c0" data-ratio="1.2994923857868" src="//speakerdeck.com/assets/embed.js"></script>
