---
layout: post
title: "Message Passing, Observable Nondeterminism, and a Look at Erlang"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Message Passing, Observable Nondeterminism, and a Look at Erlang

After a thorough discussion of the semantics and application of <a href="http://michaelrbernste.in/2013/07/01/concurrency-made-simple.html">declarative concurrency</a> in Chapter 4, Van Roy and Haridi turn their attention to an alternative design solution for concurrency. Chapter 5, "Message-Passing Concurrency" covers the necessary changes to the kernel language, discusses the design of programs using this paradigm, and takes a look at the Erlang and its OTP framework.

Throughout the chapter, the authors emphasize the application of these concurrency primitives as design solutions for particular problem sets. Program design, reasoning, and proofs are given a fair amount of treatment, and attention is paid to the realism of applying the ideas as they are presented in the book. The authors advise programmers to keep programs simple, to isolate non-declarative components, and to model state in advance of writing code.

#### Message Passing and Observable Nondeterminism

The concept of studying computation as the passing of messages between independant agents was first explored by Carl Hewitt in his work on the Actor Model. <a href="#bib1">[1]</a> Primarily concerned with modeling computation for the purposes of exploring Artificial Intelligence, Hewitt realized early on that concurrency was an inevitable area of interest for Computer Science, and the Actor model and his work on Planner were revolutionary in their explorations towards these ends. <a href="#bib2">[2]</a> Van Roy and Haridi introduce Message-Passing Concurrency in part to address limitations in the semantics of the Declarative Concurrency Model presented in Chapter 4. This model, which allows for concurrent stream programming, does not allow for any observable nondeterminism - it is truly declarative. Consumers of stream data must know where the next messages will come from, making many-to-one or many-to-many communication impossible in any practical sense.

A carefully architected tradeoff which loosens the declarative strictness and allows a bit of state, makes a flexible, expressive language possible.

#### Extending The Kernel Language with Ports

To keep the magnitude of these changes in perspective, I find it instructive to take a look at the language specification, which as usual fits in a neat little box:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/message_passing_kernel.png">
<div class="lead">The Message-Passing Concurrency Kernel Language<a href="#bib1">[1]</a></div>
</center>

The two new operations are the final two in the list:

* `{NewPort ?S ?P}` creates a new port with **entry point** `P` and **stream** `S`.
* `{Send P X}` appends `X` to the stream corresponding to the entry point `P`.


In order to extend the kernel language from Chapter 4 with the new `Port` abstraction, the execution state must be altered.
A port is an asynchronous FIFO (first-in, first-out) communi new data type with two operations - `NewPort` and `Send`.

 Mutable Store μ (MST, o, μ)

* New model - concept of port, kernel language
* Port is new data type - create and send operations
* Extend the execution state of the declarative model with a mutable store
* Mutable store μ contains ports which are pais of the form x:y where x and y are variables of the signle assignment store
* μ is initially empty
* Execution state becomes (MST, o, μ)
* Port objects
* NewPort operation - ({NewPort <x> <y>}, E)
* Creates a fresh port with a name n
* Binds E(<y>) and n in the store
* If binding succeeds, add E(<y>):E(<x>) to the mutable store μ
* Raise an error condition if binding fails
* Send operation - ({Send <x> <y>}, E)
 
    

#### From Ports to Port Objects



#### A Look at Erlang and OTP

OTP Framework

#### Conclusions

The developments ot the kernel language in this chapter and the designs that the authors tackle present material that is very relevant for modern developers.

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

<a id="bib2">[2]</a> Hewitt, Carl *Viewing Control Structures as Patterns of Passing Messages* Journal of Artificial Intelligence, June 1977
