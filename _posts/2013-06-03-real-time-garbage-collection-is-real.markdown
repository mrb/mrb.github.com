---
layout: post
title: Real-Time Garbage Collection Is Real
published: true
---
# 
### Real-Time Garbage Collection Is Real

Real-Time Garbage Collection (RTGC) is a concept that tests the limits of what we think is possible in production software. You might hear "Real-Time" and "Garbage Collection" together and think "If you truly need real-time guarantees, why would you use a Garbage Collected language?" or "How is real-time Garbage Collection even possible?" Or if you're like me, you might even want to know "What is Real-Time?" It turns out that RTGC is very real, and research on it is very active. If you want to learn more, there is fantastic coverage of the subject in Jones et al's *The Garbage Collection Handbook,* which heavily influenced the writing of this post: unless otherwise noted, quotes are from Jones.<a href="#bib1">[1]</a>

Garbage Collected languages becoming mainstream means that their benefits are desired in real-time scenarios, and in fact they are applied everywhere from dedicated server applications to embedded devices. <a href="#bib2">[2]</a> In order to be able to discuss some interesting aspects of implementing RTGC, it would be helpful to have some definitions. Here are a few key terms:

* **Garbage Collection** (GC) is a form of *Automatic Memory Management* which gives a program the appearance of infinite memory by reclaiming allocated objects which are no longer in use. The implementation details of GC include how memory is allocated, stored and referred to by program execution, and eventually reclaimed and freed.
* A **real-time system** is "a hardware or software system that is subject to deadlines from event to system response." Some *soft* real-time systems such as video displays can tolerate the occasional failure; a dropped frame isn't the end of the world. There are also *hard* real-time systems such as those running internal combustion engines, which rightly consider even one missed deadline a total system failure: missing a deadline can mean damanging an engine.
* The **mutator** is the part of a running program which executes application code, so called because "from the collector's point of view it simply mutates the graph of objects"
* The **collector** is the part of the running program which handles the duties of GC
* **Mutator utilization** the "fraction of CPU time used by the mutator, as opposed to by the collector"

With those in place, **Real-Time Garbage Collection** is *Automatic Memory Management* capable of:

* Guaranteeing a certain amount of mutator utilization in a given time window
* Accounting precisely for all mutator interruptions
* Ensuring that space bounds are not exceeded

Which is a pretty amazing feat, even once you understand that RTGC isn't a magical formula that somehow makes the tradeoffs present in regular GC go away.

<center><img src="http://michaelrbernste.in/images/real_time_pauses.png"></center>

> "We show both analytically and experimentally that time-based scheduling is superior, particularly at the short intervals that are typically of in- terest in real-time systems. Work-based algorithms may achieve short individual pause times, but are unable to achieve consistent utilization." <a href="#bib3">[3]</a>

#### Works Cited

<a id="bib1">[1]</a> Richard Jones, Antony Hosking, and Eliot Moss. *The Garbage Collection Handbook: The Art of Automatic Memory Management.* CRC Applied Algorithms and Data Structures. Chapman & Hall, August 2012, pages 375-416.

<a id="bib2">[2]</a> Tony Printezis. *On measuring garbage collection responsiveness.* Science of Computer Programming, 62(2):164-183, October 2006

<a id="bib3">[3]</a> David F. Bacon, Perry Cheng, and V.T. Rajan. *A real-time garbage collector with low overhead and consistent utilization.* In POPL 2003 [POPL03], 2003, pages 285-298.

<a id="bib4">[4]</a> Perry Cheng. "A Mostly Non-Copying Real-Time Collector with Low Overhead and Consistent Utilization" PowerPoint presentation. <a href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&ved=0CEIQFjAC&url=http%3A%2F%2Fwww.research.ibm.com%2Fmetronome%2Ftalks%2FCheng03RealtimeTalk.ppt&ei=FISsUalEi_zgA6q_gKgN&usg=AFQjCNENCLDCMhnl7kzKjiOyakYG9SSDwQ&sig2=EQE8W4WNYKbKzAovyrT0ow&bvm=bv.47244034,d.dmg">Available Here</a>

<a id="bib5">[5]</a> David Detlefs. A hard look at hard real-time garbage collection. In ISORC 2004 [ISORC04], 2004, pages 23-32. 
