---
layout: post
title: "Concurrency Made Simple"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Concurrency Made Simple

Chapters 3 and 4 of Concepts, Techniques, and Models of Computer Programming (CTM) cover the definition of declarativeness and its application in concurrent programing. <a href="http://michaelrbernste.in/2013/06/20/what-is-declarative-programming.html">We saw in the last post</a>, which mostly covered Chapter 3, that one of the limitations of the declarative paradigm is its inability to deal with the "real world."<a href="#bib3">[3]</a> Declarative programming is *pure*, but not always *realistic.* The "real world" includes concurrency, the basic definition of which is "A set of activities that execute independently." In other words, in the real world, things operate both in tandem with and independently from each other. Not everything can be neatly partitioned as declarative programming can sometimes require. Dealing with concurrency in programs is notoriously challenging, but not by necessity. The authors claim is easy to grasp:

> "Concurrency can be simple."

This post will cover the parts of Chapter 4 which define concurrency and its application to declarative programming. We will see the semantics of threads in the extended kernel language, get a glimpse at programming with streams, and I will tie the lessons of declarative concurrency to the curent state of programming tools. Our next post will finish out Chapter 4 by taking a look at Declarative concurrency and its interaction with a fascinating language construct known as *laziness*.

#### What is Concurrency?

Declarativeness is shown to be a surprisingly rich and capable paradigm which can be applied in a variety of circumstances if the developer is aware of the involved tradeoffs. The declarative kernel language is small and flexible enough that adding the ability to execute code concurrently ends up being simple, at least from a programming language design standpoint.

> "Our approach to concurrency is a simple extension to the declarative model that allows more than one executing statement to reference the store."

A new instruction, `thread`, is added to the existing kernel, which gives us the following language:

<center><img src="https://dl.dropboxusercontent.com/u/1401061/declarativeconcurrency.png">
<div class="lead">The entire data-driven concurrent kernal language, including the new thread instruction. <a href="#bib3">[3]</a></div></center>


The ability for the kernel language to express concurrent programs means that under the right conditions, things can be happening at the same time. The authors do an excellent job of describing what "at the same time" really means, and it's worth going through the terminology so that we can thoroughly understand the implications of declarative concurrency.

It is said that all operations in a program have a **gloabal sequence** and that threads do an **interleaving execution** over this sequence. A **scheduler** is responsible for choosing work for threads. Concurrency in the kernel language relies on the existence of **dataflow variables**, whose single assignment properties provide both immutability guarantees and a coordination point for external computation with respect to their bound state.

**Causal Order**

**Nondeterminism**

**Scheduling**


#### The Semantics of Threads

Adding threads to the existing declarative kernel language is a matter of adding a `thread` operation which extends the kernel by allowing multiple "frames" to have access to the same data store.

p.239

**Single assignment store ($\sigma$)**

**Environment ($E$)**

**Semantic Statement ($ST$)**

**Execution State**

#### What is Declarative Concurrency

Concurrency with no observable nondeterminism.

> "A concurrent program is declarative if the following holds for all possible inputs. All executions with a given set of inputs have one of two results: (1) they all do not terminate or (2) they all eventually reach partial termination and give results that are logically equivalent.""

**Partial termination**

**Logical equivalence**


#### Programming With Streams

Streams are given extensive treatment by the authors in Chapter 4 and are referred to as one of the most convenient and reasonable ways to program with declarative concurrency. Streams are a very simple idea which fit very nicely with the semantics of dataflow variables.

#### Where We Get It Wrong

Concurrency and its application in modern software design is of paramount importance as our "free lunch" has long been over but we struggle in denial against its reality, often wielding primitive, wasteful tools.<a href="#bib2">[2]</a> Our tools rely on syntactic and semantic constructions which force us to amortize the costs of writing our programs over a very long period of time - they are easy to create, but difficult to maintain. Some of these constructions include (faux, overloaded) Object Orientation, global state, and mutability.

*Mutability* refers to the ability of the programmer to change the value of an *object* after it has been instantiated (*object* is an abstract name given to any assignable quantity that developers have access to). Much discussion has been raised specifically surrounding the connection between mutability and the inability for our tools to properly handle concurrency in a reasonable way, and in fact we are making progress.<a id="bib1">[1]</a> Several active programming languages, including the Mozart platform that the CTM book constructs, Clojure, which runs on the Java Virtual Machine, and Haskell all have embraced the value of immutability and the leverage it gives programming language designers in providing *simple concurrency*. 

This point has particular impact for me because <a href="http://michaelrbernste.in/2013/02/23/notes-on-teaching-with-the-kernel-language-approach.html">after writing about a related article by the same authors</a>,  *Teaching Programming with the Kernel Language Approach*, I keep coming back to a simple idea that they present. Beginning professional developers who jump right in to programming with mutable, global state, objects, and concurrency rightfully believe that "concurrency in Java is Hard." Unfortunately, many people extend that to "programming with concurrency is Hard." They don't seek other paradigms because they think that the complexity is necessary. They think it is capital-H Hard and the truth is that it doesn't have to be, asl long as you're willing to give up some of the expressiveness proffered by the constructs above.


#### Conclusion



#### Works Cited

*All quotes from unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Hickey, Rich. *Index of Published Talks* <a href="http://www.infoq.com/author/Rich-Hickey">HTML Page</a>

<a id="bib1">[2]</a> Sutter, Herb. *A Fundamental Turn Toward Concurrency in Software* Dr. Dobbs Software Journal. <a href="http://www.drdobbs.com/article/print?articleId=184405990&siteSectionName=web-development/">Available here.</a>

<a id="bib2">[3]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004
