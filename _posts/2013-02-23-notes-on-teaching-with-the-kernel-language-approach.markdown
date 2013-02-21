---
layout: post
title: "Learning How To Learn Programming"
published: false
---
# 

### Learning How To Learn Programming: Notes on _Teaching Programming with the Kernel Language Approach_

These are some notes on a paper, <a href="http://www.info.ucl.ac.be/people/PVR/fdpefinalweb.pdf">Teaching Programming with the Kernel Language Approach" (PDF)</a> outlining the teaching techniques used in _Concepts, Techniques, and Models of Computer Programming_ by Van Roy and Haridi, who also wrote this paper.

What techniques to use to bridge the gap between the pure ideas of computer science and the realities of practical programming is impacted by the venue - the workplace, the classroom and the laboratory all have different needs. Van Roy and Haridi present "a new way to teach programming" that exposes and challenges the basic assumptions of typical classroom computer science education, with the goal of empowering the student with a strong grasp of underlying principles balanced by some experience with practical application.

The classroom is the first place many people get exposed to computer science and programming but many professional programmers are self-taught, and regardless of their pedigree, computer science education is a scarce resource. Ultimately I'm interested in how the concepts the Van Roy and Haridi champion can be applied to professional programming. How can we harness the power of kernel language concepts and shine the light on the _deus ex machina_ of "how computers work?"

> "We present the kernel language approach, a new way to teach programming that situates most of the widely-known programming paradigms (including imperative, object-oriented, concurrent, logic, and functional) in a uniform setting that shows their deep relationships and how to use them together."

> "Widely-different practical languages...are explained by straightforward translations into closely-related kernel languages, simple languages that consist of small numbers of programmer-significant concepts."

These two quotes sum up the _what_ and the _how_ of the kernel language approach. At this point it is easy to indulge the "practical" part of your brain that says that there's no point in studying a language that you can't use in production. I often have to remind myself that I didn't learn to program in a language that I ended up using in any professional capacity, and that many around me learned with an entirely different toolchain, an entirely different mindset, an entirely different venue.

According to the text, programming is typically taught in one of three different ways:

__As a Craft__ - You learn one language, deeply. Its paradigms become the lens through which you learn everything practical and theoretical about Computer Science. Your knowledge and experience veer more toward the practical than the theoretical. You end up, for example, being an "Object Oriented Java Developer" or a "Functional Haskell Developer." The authors criticize this method by citing an example of how the defects of a specific language or paradigm may excessively shape the thinking and practice of a student, e.g. believing that "Concurrency is hard" because "Concurrency in Java is hard."

__As a Branch of Mathematics__ - Your practical knowledge is superceded by a deeper understanding of the theoretical underpinnings of programming, typically limited to one language and paradigm. The authors criticize this approach as narrow, citing semi-successful attempts by such luminaries as Dijkstra, but themselves aim to cover a broader range of concepts.

__In Terms of Concepts__ - The style that the authors feel their work is the most in line with, and one that they attribute to _SICP_ (lovingly referred to as "Abelson et. al"). Criticisms are leveled at the single language approach, lack of formal semantics, and missing fundamental concepts of their predecessors in this category, however.

So the question becomes:

> "How can we teach programming as a unified discipline?"

Because it seems apparent that teaching each separate concept through a representative language(some each of Haskell, Java, Erlang, etc.):

> "...multiplies the intellectual effort of the student and instructor (since each language has its own syntax and semantics) but does not show the deep connections between the paradigms."

So the authors want to communicate through concepts, to highlight the _interface_ between the programmer and the raw concepts involved in interpreting and computing results from programs.

For your edification, as there is not an example presented in the paper, ere's the kernel language for relational programming, as presented in the _CTM_ book.

<center><img src="http://michaelrbernste.in/images/relational.png"></center>

The essence of the approach is:

* Encode "programmer significant concepts" such as conditional statements, sequential execution, concurrency in a kernel language which contains the correct combination of features for a given programming paradigm
* Extend this kernel language with _syntactic sugar_ and _functional abstraction_ in order to make it more expressive and powerful
* Translate the kernel language into a _practical programming language_

The following diagram covers the "steps in the kernel language approach," and describes how the approach can be used to describe programming paradigms from the simplest to the most complex:

<center><img src="http://michaelrbernste.in/images/kernel_teaching_diagram.png"></center>

I couldn't help but note that my industry is entirely based on the most complex parts of this diagram, and that many of its practitioners jump straight into that without ever having even been exposed to the idea of the continuum that the above diagram represents.

#### The Creative Extension Principle

An interesting explanation is given as to how the simpler kernel languages are extended to accomadate new paradigms as illustrated in the diagram above.

#### Teaching Experience, Pedagogy, Further Reading

Programming should be taught as

1. Concepts and techniques.
2. Algorithms and data structures.
3. Program design and software engineering.

_CMT_ Covers mostly 1

#### How This Applies to Professional Programmers

* "Teaching programming in terms of a single paradigm or language has a detrimental effect on programmer competence and thus on program quality." - Rubyists don't even attempt threads, Java programmers think they're very difficult and expensive.

* "many of our students who were already proficient Java programmers have told us that they first understood what Java objects really were after following our course."
