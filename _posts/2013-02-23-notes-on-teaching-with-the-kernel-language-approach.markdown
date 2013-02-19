---
layout: post
title: "Notes On 'Teaching With The Kernel Language Approach'"
published: false
---
## Notes on "Teaching Programming with the Kernel Language Approach"

These are some notes on a paper, <a href="http://www.info.ucl.ac.be/people/PVR/fdpefinalweb.pdf">Teaching Programming with the Kernel Language Approach" (PDF)</a> outlining the teaching techniques used in _Concepts, Techniques, and Models of Computer Programming_ by Van Roy and Haridi, which I am <a href="http://michaelrbernste.in/2013/02/19/CTM-chapter-01.html">currently studying</a>. As a former Computer Science educator I am intrigued by the approach that the book takes, and as a Functional Programming and Computer Science History fan I am intrigued by how it positions itself as an improvement on the techniques in _The Structure and Interpretation of Computer Programs_. Browsing around on the book's <a href="http://www.info.ucl.ac.be/~pvr/book.html">rather dense web site</a>, I found a link to this paper, which seemed to provide an interesting link between the book and the classroom. Here's a bit from the abstract:

>"We present the kernel language approach, a new way to teach programming that situates most of the widely-known programming paradigms (including imperative, object-oriented, concurrent, logic, and functional) in a uniform setting that shows their deep relationships and how to use them together. Widely-different practical languages (exemplified by Java, Haskell, Prolog, and Erlang) with their rich panoplies of abstractions and syntax are explained by straightforward translations into closely-related kernel languages, simple languages that consist of small numbers of programmer-significant concepts."

> "How can we teach programming as a unified discipline? There are simply too many programming languages to teach them all. Teaching a few carefully- selected languages, say one per paradigm (for example Java, Prolog, and Haskell), is a stopgap solution. It multiplies the intellectual effort of the stu- dent and instructor (since each language has its own syntax and semantics) but does not show the deep connections between the paradigms."

The kernel language approach is presented as being in in line with Ableson and Sussman's use of underlying concepts of programming to teach, but kernel languages both abstract these concepts from a specific programming language and allow programmers to learn their language of choice more deeply.

The following diagram covers the "steps in the kernel language approach," and describes how the approach can be used to describe programming paradigms from the simplest to the most complex:

<img src="http://michaelrbernste.in/images/kernel_teaching_diagram.png">

I couldn't help but note that my industry is entirely based on the most complex parts of this diagram, and that many of its practitioners jump straight into that without ever having even been exposed to the idea of the continuum that the above diagram represents.

### The Creative Extension Principle

### Teaching Experience, Pedagogy, Further Reading

Programming should be taught as

1. Concepts and techniques.
2. Algorithms and data structures.
3. Program design and software engineering.

## Notes and Quotes

* "For the purposes of this paper, let us consider a broad definition of computer programming as bridging the gap between specification and running program."
* "Teaching programming in terms of a single paradigm or language has a detrimental effect on programmer competence and thus on program quality."
* Programming is taught in three different ways:
  * As a Craft
  * As a Branch of Mathematics
  * In Terms of Concepts
