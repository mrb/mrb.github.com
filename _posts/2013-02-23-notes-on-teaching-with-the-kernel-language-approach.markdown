---
layout: post
title: "Learning How To Learn Programming"
published: true
---
# 

### Learning How To Learn Programming: Notes on _Teaching Programming with the Kernel Language Approach_

These are some notes on a paper, <a href="http://www.info.ucl.ac.be/people/PVR/fdpefinalweb.pdf">Teaching Programming with the Kernel Language Approach" (PDF)</a> outlining the teaching techniques used in _Concepts, Techniques, and Models of Computer Programming_ by Van Roy and Haridi, which I am <a href="http://michaelrbernste.in/2013/02/19/CTM-chapter-01.html">currently studying</a>. As a former Computer Science educator I am intrigued by the approach that the book takes, and as a Functional Programming and Computer Science history fan I am intrigued by how it positions itself as an improvement on the techniques in _The Structure and Interpretation of Computer Programs_. Browsing around on the book's <a href="http://www.info.ucl.ac.be/~pvr/book.html">rather dense web site</a>, I found a link to this paper, which seemed to provide an interesting link between the book and the classroom.

>"We present the kernel language approach, a new way to teach programming that situates most of the widely-known programming paradigms (including imperative, object-oriented, concurrent, logic, and functional) in a uniform setting that shows their deep relationships and how to use them together."

Right away I start to imagine what this _kernel language approach_ could be, since I know that this does not reflect typical Computer Science education in any form that I had seen before. The technique can be summed up as follows:

> "Widely-different practical languages...are explained by straightforward translations into closely-related kernel languages, simple languages that consist of small numbers of programmer-significant concepts."

Another common way to learn how to program is to be given a survey of various programming languages over the course of a Semester or two. According to the authors, this practice:

> "...multiplies the intellectual effort of the student and instructor (since each language has its own syntax and semantics) but does not show the deep connections between the paradigms."

The kernel language approach is presented as being in in line with Ableson and Sussman's use of underlying concepts of programming to teach, but kernel languages both abstract these concepts from a specific programming language and allow programmers to learn their language of choice more deeply.

According to the text, programming is typically taught in one of three different ways:

__As a Craft__ - You learn one language, deeply. Its paradigms become the lens through which you learn everything practical and theoretical about Computer Science. Your knowledge and experience veer more toward the practical than the theoretical. You end up, for example, being an "Object Oriented Java Developer" or a "Functional Haskell Developer."

__As a Branch of Mathematics__ - Your practical knowledge is superceded by a deeper understanding of the theoretical underpinnings of programming, typically limited to one language and paradigm.

__In Terms of Concepts__ - The style that the authors feel their work is the most in line with, and one that they attribute to _SICP_ (lovingly referred to as "Abelson et. al"). Criticisms are leveled at the single language approach, lack of formal semantics, and missing fundamental concepts of their predecessors in this category, however.

The following diagram covers the "steps in the kernel language approach," and describes how the approach can be used to describe programming paradigms from the simplest to the most complex:

<center><img src="http://michaelrbernste.in/images/kernel_teaching_diagram.png"></center>

I couldn't help but note that my industry is entirely based on the most complex parts of this diagram, and that many of its practitioners jump straight into that without ever having even been exposed to the idea of the continuum that the above diagram represents.

#### The Creative Extension Principle

An interesting explanation is given to how the simpler kernel languages are extended to accomadate new paradigms as illustrated in the diagram above.

#### Teaching Experience, Pedagogy, Further Reading

Programming should be taught as

1. Concepts and techniques.
2. Algorithms and data structures.
3. Program design and software engineering.


#### Notes and Quotes


* "For the purposes of this paper, let us consider a broad definition of computer programming as bridging the gap between specification and running program."
* "Teaching programming in terms of a single paradigm or language has a detrimental effect on programmer competence and thus on program quality."

