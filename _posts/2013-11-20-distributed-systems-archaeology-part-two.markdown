---
layout: post
title: "Distributed Systems Archaeology, Part Two"
published: true
dsa: true
---
# 
# 
### Distributed Systems Archaeology, Part Two

*This post presents the second part of a narrative form of the talk I gave at Ricon West 2013. <a href="http://michaelrbernste.in/2013/11/19/distributed-systems-archaeology-part-one.html">Part one can be found here</a>. The works cited can <a href="http://michaelrbernste.in/2013/11/06/distributed-systems-archaeology-works-cited.html">be found here</a>, and the slides can <a href="https://speakerdeck.com/mrb/distributed-systems-archaeology">be found here</a>. Video is forthcoming.*

### The Proof: Formalism

*The role of the proof in the history of distributed systems research*

In parallel with the work on artificial intelligence at prominent universities around the world, computer science was growing as a field, and the lines between mathematics and its application to technology were being teased out.

As a backdrop, it’s important to state that at the time I started researching this work, I had a hard time grasping how you could formalize something as complex as a distributed system. It seemed like too many moving parts, like it was too abstract. I didn’t understand the techniques used to apply something like a mathematical proof, wherein you have to "reinvent the entire universe" to something like distributed systems. The work of three individuals helped me understand these techniques. 

* Edsger Dijkstra
* Leslie Lamport
* Nancy Lynch

I'll discuss Dijkstra and Lynch in this section, and move on to Leslie Lamport in a little while.

Edsger Dijkstra’s place as the most prominent name in the field of distributed systems is both fitting and telling. In 1965 he published a one page paper titled *Solution of a Problem in Concurrent Programming Control* where he describes an algorithm for mutual exclusion (known as a mutex), a technique that had not been well known up until that point.

It is with Dijkstra’s work that we see the beginnings of the thread of the prominence of formalism in the field of distributed systems. Dijkstra authored many important papers and was rigorous and thoughtful about proving the work that he produced, and over the course of his career was very vocal about the importance of formalism to computer science.

Dijkstra published another seminal paper *Self-stabilizing Systems in Spite of Distributed Control* in 1974 which was also ahead of its time, rigorous, and elegant. Self-stabilization became its own area of study in distributed systems research, and Dijkstra set the stage for the next generation of computer scientists, beginning a thread that was picked up by many.

Perhaps chief amongst those are that followed in Dijkstra’s footsteps are Nancy Lynch and Leslie Lamport, both of whom have provided a continuous stream of impressive theoretical work in the field. I want to highlight them specifically because of how closely we still feel the impact of their research, and because the specific results that they produced were incredibly groundbreaking and influential. Unfortunately, they are also often misunderstood.

Nancy Lynch was one of the authors of 1982’s *Impossibility of distributed consensus with one faulty process* which set a major direction in distributed systems research by proving that in an asynchronous network, distributed consensus was "impossible" (for a very specific definition of impossible). The impact of this paper is manifold, and much other work is based on its ideas. It is interesting to consider, and I will bring this up again a bit later, that an impossibility proof, also known as a "negative result" should be so important to defining the work in our field.

Towards the end of the paper, Dr. Lynch states that:

> "These results do not show that such problems cannot be ‘solved’ in practice; rather, they point up the need for more refined models of distributed computing."

It would seem to me that not many people make it this far, because this is hardly the subtle point that is made when this paper is discussed.

In 1989 Lynch published *A Hundred Impossibility Proofs for Distributed Computing* which is an awesome paper that I stumbled upon while digging through the list of publications on Dr. Lynch’s website. As an aside, the publications list on researcher’s pages are some of the best sources of information for archaeological digs. What I found so great about "A hundred impossibility proofs" is how Lynch playfully collects, distills and reports on the work in the field up until that point, a field of which she was a pioneer. Amongst the One Hundred proofs that Lynch surveys, she finds that they all have but one thing in common. They are all concerned with,

> "The limitation imposed by local knowledge in a distributed system"

In other words, asynchronous networks and the potential for failure in other nodes makes certain assumptions impossible. By 1989, over 100 papers had been published based on these ideas. What kind of influence did that have on those who followed?

In 2002, Lynch published *Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services,* which contained a proof Brewer’s CAP conjecture - it was now known as the CAP theorem. The impact of this paper is still present and in fact many people at this conference will likely be discussing this result, 11 years later. 

By the time I looked into this paper, I was already searching for those assumptions - what are those frozen FACTS about the system that allow the result to be produced? The proof in the paper uses the terms Consistency, Availability, and Partition-tolerance, three terms which are very carefully defined as part of a formal model. In other words, the C, A, and P in CAP are to be understood for very specific definitions of those terms and are not to be applied generally. Unfortunately, it turns out that it is very easy to apply these ideas generally and get confused about the meanings of them. You can end up seeing C, A, and P everywhere you look.

The point I am trying to make here is that while the work of Dijkstra and Lynch have been a huge part of establishing an indispensable foundation of theoretical work in the field, it is also very easy to get confused about what these results really *mean.* It is perhaps an irony that those who actually produce rigorous proofs are those that are the targets for the most misunderstanding as a result. When something is "proven," people tend to treat it as gospel, divorcing the result from the proof and the work that went into it.

Even worse, perhaps, is that the elegance and simplicity of the formal models is completely lost to those who hear the information, telephone-style, from bad implementations, misunderstood blog posts, and other misguided studies.

I admit that as I read this work for the first time, the point didn’t really hit home. It was only later, upon reading some more modern work, that I started to form an intuition for the relationship between the underlying formal model assumed in academic work and the applicability of its results to practitioners.

Dijkstra and Lynch, in addition to Leslie Lamport, whose work I am going to cover in the next section, have produced incredible bodies of work that have helped to define the field of distributed systems and hoped to imbue a sense of responsibility on the part of academics to provide a formal model for their work.

*Next, we will look at 'The Market: The impact of commerce on distributed systems research, and I'll wrap things up. Stay tuned.*

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*
