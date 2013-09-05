---
layout: post
title: "Message-Passing and Concurrent Program Design"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Message-Passing and Concurrent Program Design

After a thorough discussion of the semantics and application of <a href="http://michaelrbernste.in/2013/07/01/concurrency-made-simple.html">declarative concurrency</a> in chapter 4, Van Roy and Haridi turn their attention to an alternative design solution for the same challenging problem space. Chapter 5, "Message-Passing Concurrency" covers the necessary changes to the kernel language to make this kind of programming possible, discusses the design of programs using this paradigm, and takes a brief aside to look at the Erlang language and its OTP framework.

Beyond covering the technical aspects of concurrency, the authors also emphasize the application of these concurrency primitives as design solutions for particular kinds of problems. Concurrent program design, reasoning, and proofs are given a fair amount of treatment, and attention is paid to the realism of applying the ideas as they are presented in the book. The authors advise programmers to keep programs simple, to isolate non-declarative components, and to model all possible states in advance of writing code.

#### Message Passing and Observable Nondeterminism

The concept of studying computation as the passing of messages between independant agents was first explored by Carl Hewitt in his work on the Actor Model. <a href="#bib1">[1]</a> Primarily concerned with modeling computation for the purposes of exploring Artificial Intelligence, Hewitt realized early on that concurrency was an inevitable area of interest for Computer Science, and the Actor model and his work on Planner were revolutionary in their explorations towards these ends. <a href="#bib2">[2]</a> Van Roy and Haridi introduce message-passing concurrency in part to address limitations in the semantics of the declarative concurrency model presented in chapter 4, which enables concurrent stream programming but does not allow for any observable nondeterminism. Consumers of stream data must know where the next messages will come from, making many-to-one or many-to-many communication impossible in any practical sense.

In the message-passing paradigm, however, programming with streams loses its declarative properties because it allows *observable nondeterminism*. In practical terms this means that since the *name* of a stream can escape the local scope and be accessed by other parts of the computation concurrently, we can no longer rely on the soundness of our computation with respect to knowing its outcomes. Declarativeness is the assurance that computation impactful to the environment is localized to the extent that you simply *cannot* be surprised by the outcome. Ports give streams a name that can be embedded in a data structure, passed around between scopes, and written to or read from freely. This is contrary to the kinds of programs we have seen up until this point, which have ardently adhered to the strictness (and resutant sacrifices in clarity and expressiveness) of declarative programming. It is both a welcome relief and a terrifying prospect to gaze into the abyss of state and nondeterminism.

#### Extending The Kernel Language with Ports

The transition from declarative concurrency to message-passing concurrency is small but impactful. To keep the magnitude of these changes in perspective, I find it instructive to take a look at the language specification, which as usual fits in a neat little box:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/message_passing_kernel.png">
<div class="lead">The Message-Passing Concurrency Kernel Language<a href="#bib1">[1]</a></div>
</center>

As succinct as that language looks, we know that Van Roy and Haridi are always good for a pithy quote. Here is how they sum up the changes:

> "The message-passing concurrent model extends the declarative concurrent model by adding just one new concept, an asynchronous communication channel."

The asynochronous communication channel is implemented as an abstract data type which combines a FIFO (first-in, first-out) queue called a *Port* and two operations: `NewPort` and `Send`. An important implementation detail of ports is that they rely on streams to exchange information, giving them a name and allowing other parts of the computation to write to and read from them. Here are more complete definitions of the two new operations:

* `{NewPort ?S ?P}` creates a new port with **entry point** `P` and **stream** `S`.
* `{Send P X}` appends `X` to the stream corresponding to the entry point `P`.

These operations are integrated into the execution state by extending the abstract machine definition inherited from the previous chapters with a Mutable Store μ. That makes the execution state (MST, σ, μ) where MST is the multiset of semantic stacks, σ is the single assignment store, and μ is the mutable store.


* Extend the execution state of the declarative model with a mutable store
* Mutable store μ contains ports which are pais of the form x:y where x and y are variables of the signle assignment store

* μ is initially empty

* Execution state becomes (MST, o, μ)

* NewPort operation - ({NewPort <x> <y>}, E)
* Creates a fresh port with a name n
* Binds E(<y>) and n in the store
* If binding succeeds, add E(<y>):E(<x>) to the mutable store μ
* Raise an error condition if binding fails

* Send operation - ({Send <x> <y>}, E)
 

#### From Ports to Port Objects



#### A Look at Erlang and OTP

The Erlang equivalent of the book's `Thread` is an Erlang process, which is created with a port object and a mailbox to form a very powerful and flexible unit of concurrent execution.

{% highlight erlang %}
factorial(0) -> 1;
factorial(N) when N>0 N*factorial(N-1).
{% endhighlight %}

{% highlight bash %}
fun {Factorial N}
  case N
  of 0 then 1
  [] N andthen N>0 then N*{Factorial N-1}
  end
end
{% endhighlight %}

#### Conclusions

The expansion from declarative concurrency to message-passing concurrency in the kernel language serve to do far more than illuminate the reader about a *new mechanism* to deal with the challenges of concurrent programs. Rather the chapter gives rare insight into the complexity of concurrent programs at eeven a small scale. The towers of code built from small, mostly declarative units illustrate the interconnectedness of even well thought out programs and the intricacies of timing in a distributed system.

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

<a id="bib2">[2]</a> Hewitt, Carl *Viewing Control Structures as Patterns of Passing Messages* Journal of Artificial Intelligence, June 1977
