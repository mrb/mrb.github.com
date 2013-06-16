---
layout: post
title: Real-Time Garbage Collection Is Real
published: true
gc: true
---
# 
### Real-Time Garbage Collection Is Real

Real-Time Garbage Collection (RTGC) tests the limits of what we typically think is possible in production software. You might hear "Real-Time" and "Garbage Collection" together and think "If you truly need real-time guarantees, why would you use a garbage collected language?" or "How is real-time Garbage Collection even possible?" Or if you're like me, you might even want to know "What is Real-Time?" It turns out that RTGC is very real, and research on it is very active. If you want to learn more, there is fantastic coverage of the subject in Jones et al's *The Garbage Collection Handbook,* which heavily influenced the writing of this post: unless otherwise noted, quotes are from Jones.<a href="#bib5">[5]</a>

This post is a brief introduction to the concepts of RTGC with a focus on how the *work* in such a system is scheduled. Along the way, the casual observer can maybe learn a lesson about the ever-present trade-offs that stretch our limits as programmers and thinkers, and make insane ideas like RTGC possible.

#### What is Real-Time?

Since Garbage Collected languages have conquered the enterprise and are thoroughly mainstream, their benefits are desired in real-time scenarios. These days, Real-Time Garbage Collected software can be found running everywhere from dedicated server applications to embedded devices.<a href="#bib6">[6]</a> In order to be able to discuss some interesting aspects of implementing RTGC, it would be helpful to have some definitions. Here are a few key terms:

* **Garbage Collection** (GC) is a form of *Automatic Memory Management* which gives a program the appearance of infinite memory by reclaiming allocated objects which are no longer in use. The implementation details of GC include how memory is allocated, stored and referred to during program execution, and eventually reclaimed and freed.
* A **real-time system** is "a hardware or software system that is subject to deadlines from event to system response." Some *soft* real-time systems such as video displays can tolerate the occasional failure; a dropped frame isn't the end of the world. There are also *hard* real-time systems such as those running internal combustion engines, which rightly consider even one missed deadline a total system failure: missing a deadline can mean damaging an engine.
* The **mutator** is the part of a running program which executes application code, so called because "from the collector's point of view it simply mutates the graph of objects"
* The **collector** is the part of the running program which handles the duties of GC
* **Mutator utilization** is the "fraction of CPU time used by the mutator, as opposed to by the collector"

With those in place, **Real-Time Garbage Collection** is *Automatic Memory Management* capable of:

* Guaranteeing a certain amount of mutator utilization in a given time window
* Accounting precisely for all mutator interruptions
* Ensuring that space bounds are not exceeded

Which is a pretty amazing feat, even once you understand that RTGC isn't a magical formula that somehow makes the trade-offs present in regular GC go away. In order to put a finer point on the requirements listed above, consider the following illustration of program execution and GC behavior:

<center><img src="http://michaelrbernste.in/images/real_time_pauses.png"></center>
<center><b><i>Mutator (white) and Collector (non-white) timings<br/>during normal execution and two GC runs.<br/>
        Top: Stop the World, Middle: Incremental, Bottom: Real-Time <a href="#bib4">[3]</a></i></b></center>

The top band shows two long GC pauses which reflect normal behavior of *Stop the World* GC such as vanilla Mark-and-Sweep. While the pauses appear consistent, they are each too long. For this reason, RTGC is not often pursued in a non-incremental context: it is too difficult to keep pause times below a desired threshold. The middle band, which shows shorter but more irregular GC pauses over two collections, illustrates a normal incremental GC such as a Baker copying collector. While the lengths are better, the pauses are simply too irregular. This prompted Jones to say, in the last chapter of a textbook which covers every classic and most well-known modern collectors:

> "...as real-time systems are now understood, none of the previous algorithms live up to the promise of supporting true real-time behavior."

The bottom band above shows ideal behavior for RTGC. Pauses are short and regularly spaced out - in a word, predictable. I was drawn to this means of visualizing GC behavior by the authors of a very interesting approach to RTGC, known as *The Metronome.*<a href="#bib1">[1]</a> <a href="#bib3">[3]</a> The algorithm is interesting for a number of reasons, but I found one detail particularly striking, as a tweak to the algorithm is made in an area not often explored in GC. The authors suggest that a different means of *scheduling* the collector execution is key to guaranteeing sufficient mutator utilization.

#### Scheduling Real-Time Garbage Collection

In order to satisfy the guarantees described above, RTGC algorithms need to pay special attention to how the collector will be called to do its work. There are three primary ways of describing how RTGC can schedule the work for its collector:

* **Work based scheduling** executes small amounts of collector work each time the mutator does work
* **Slack based scheduling** runs the collector when the mutator is not working
* **Time based scheduling** periodically schedules and runs the collector according to an interval

The *Metronome* authors made some headway in the area of RTGC scheduling. As they state:

> "We show both analytically and experimentally that time-based scheduling is superior, particularly at the short intervals that are typically of interest in real-time systems. Work-based algorithms may achieve short individual pause times, but are unable to achieve consistent utilization." <a href="#bib2">[2]</a>

I found this to be fascinating - it's true that work and slack based scheduling approaches can provide predictably short pause times, but they do not have the ability to make the decision to also guarantee an acceptable amount of mutator utilization. Jones brings up another very interesting paper, *A hard look at hard real-time garbage collection* where the author concurs:

> "I see a growing consensus that time-based methods, in which the garbage collector is treated as a separate task in the real-time scheduling problem, allow more realistic timing analysis of the real-time code, by decreasing GC “taxes” on mutator operations." <a href="#bib4">[4]</a>

That's just how the Metronome functions when it is run with the time-based scheduler. During programming execution, many times per second, a *heartbeat* runs which causes the system to schedule small units of collector work if necessary. The algorithm can target a particular percentage of mutator utilization and guarantee that it will be preserved over a sliding window, scheduling even sized slices of time for either the mutator or the collector.

#### A Trade-Off and a Send-Off

Just to remind you that I'm not lying, Real-Time Garbage Collection is real, and this is not magical: **there are trade-offs to be made**. In order to be able to provide a consistently scheduled amount of memory, we have to ease off on our requirements for space bounds - our running programs may exceed the amount of space we want them to take (but not the amount of space that we estimate they could possibly take).

While reading the literature about RTGC, I was struck again and again by how the basic principles that non real-time software developers operate by are invalid in a world of such strict guarantees. In order to consider deploying real-time code, an enormous amount of testing, measurement, prediction, proof, etc. has to occur. The Garbage Collector can operate with the knowledge that it can expect a consistent amount of work, within a reasonable degree. Jones points out that work-based scheduling can guarantee our requirements as long as the amount of work done can be properly estimated. Time-based scheduling can provide stronger time guarantees but will have to use more space during times of heavy use if the system is not expecting it. Trade-offs. Always trade-offs.

*Thanks to James Golick for his proofreading and Computology expertise.*

#### Works Cited

<a id="bib1">[1]</a> David F. Bacon, Perry Cheng, and V.T. Rajan. *The Metronome: A simpler approach to garbage collection in real-time systems.* In On The Move to Meaningful Internet Systems 2003: OTM 2003 Workshops, volume 2889 of Lecture Notes in Computer Science, pages 466-478, Catania, Sicily, Italy, November 2003. Springer-Verlag

<a id="bib2">[2]</a> David F. Bacon, Perry Cheng, and V.T. Rajan. *A real-time garbage collector with low overhead and consistent utilization.* In POPL 2003 [POPL03], 2003, pages 285-298.

<a id="bib3">[3]</a> Perry Cheng. *A Mostly Non-Copying Real-Time Collector with Low Overhead and Consistent Utilization* PowerPoint presentation. <a href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&ved=0CEIQFjAC&url=http%3A%2F%2Fwww.research.ibm.com%2Fmetronome%2Ftalks%2FCheng03RealtimeTalk.ppt&ei=FISsUalEi_zgA6q_gKgN&usg=AFQjCNENCLDCMhnl7kzKjiOyakYG9SSDwQ&sig2=EQE8W4WNYKbKzAovyrT0ow&bvm=bv.47244034,d.dmg">Available Here</a>

<a id="bib4">[4]</a> David Detlefs. *A hard look at hard real-time garbage collection.* In ISORC 2004 [ISORC04], 2004, pages 23-32.

<a id="bib5">[5]</a> Richard Jones, Antony Hosking, and Eliot Moss. *The Garbage Collection Handbook: The Art of Automatic Memory Management.* CRC Applied Algorithms and Data Structures. Chapman & Hall, August 2012, pages 375-416.

<a id="bib6">[6]</a> Tony Printezis. *On measuring garbage collection responsiveness.* Science of Computer Programming, 62(2):164-183, October 2006
