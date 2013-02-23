---
layout: post
title: "Learning How To Learn Programming"
published: true
---
# 

### Learning How To Learn Programming: Notes on _Teaching Programming with the Kernel Language Approach_

_These are some notes on Van Roy and Haridi's <a href="http://www.info.ucl.ac.be/people/PVR/fdpefinalweb.pdf">Teaching Programming with the Kernel Language Approach" (PDF)</a> outlining the pedagogy employed in the pair's landmark work __Concepts, Techniques, and Models of Computer Programming__. I will walk through some of the key concepts of the paper, and hypothesize that the same techniques that the authors advocate for classroom use are applicable in professional settings._

#### Bridging The Gap

What techniques to use to bridge the gap between the pure ideas of computer science and the realities of practical programming is impacted by the venue - the workplace, the classroom and the laboratory all have different needs. Van Roy and Haridi present "a new way to teach programming" that exposes and challenges the basic assumptions of typical classroom computer science education, with the goal of empowering the student with a strong grasp of underlying principles balanced by some experience with practical application.

The classroom is the first place many people get exposed to computer science and programming but many professional programmers are self-taught, and regardless of their pedigree, computer science education is a scarce resource. Ultimately I'm interested in how the concepts that Van Roy and Haridi champion can be applied to professional programming. How can we harness the power of kernel language concepts and shine the light on the _deus ex machina_ of "how do computers work?"

> "We present the kernel language approach, a new way to teach programming that situates most of the widely-known programming paradigms (including imperative, object-oriented, concurrent, logic, and functional) in a uniform setting that shows their deep relationships and how to use them together."

> "Widely-different practical languages...are explained by straightforward translations into closely-related kernel languages, simple languages that consist of small numbers of programmer-significant concepts."

These two quotes sum up the _what_ and the _how_ of the kernel language approach. At this point it is easy to indulge the "practical" part of your brain that says that there's no point in studying a language that you can't use in production. I often have to remind myself that I didn't learn to program in a language that I ended up using in any professional capacity, and that many around me learned with an entirely different toolchain, an entirely different mindset, an entirely different venue.

#### The Kernel Language Approach

According to the text, programming is typically taught in one of three different ways:

__As a Craft__ - You learn one language, deeply. Its paradigms become the lens through which you learn everything practical and theoretical about Computer Science. Your knowledge and experience veer more toward the practical than the theoretical. You end up, for example, being an "Object Oriented Java Developer" or a "Functional Haskell Developer." The authors criticize this method by citing an example of how the defects of a specific language or paradigm may excessively shape the thinking and practice of a student, e.g. believing that "Concurrency is hard" because "Concurrency in Java is hard." This is how most professional programmers that I have met learned the language that they use professionally.

__As a Branch of Mathematics__ - Your practical knowledge is superseded by a deeper understanding of the theoretical underpinnings of programming, typically limited to one language and paradigm. The authors criticize this approach as narrow, citing semi-successful attempts by such luminaries as Dijkstra, but themselves aim to cover a broader range of concepts.

__In Terms of Concepts__ - The style that the authors feel their work is the most in line with, and one that they attribute to _SICP_ (lovingly referred to as "Abelson et. al"). Criticisms are leveled at the single language approach, lack of formal semantics, and missing fundamental concepts of their predecessors in this category, however.

Considering the pitfalls of the above approaches, the central question of the text becomes:

> "How can we teach programming as a unified discipline?"

Because it seems apparent that teaching each separate concept through a representative language(some each of Haskell, Java, Erlang, etc.):

> "...multiplies the intellectual effort of the student and instructor (since each language has its own syntax and semantics) but does not show the deep connections between the paradigms."

So the authors want to communicate through concepts, to highlight the _interface_ between the programmer and the raw concepts involved in interpreting and computing results from programs. In other words:

> "In the kernel language approach, programming paradigms and their requisite languages are emergent phenomena"

This is a very powerful concept. It highlights the interconnectedness of programming languages by placing them on something like a continuum. Instead of using a practical programming language to learn concepts, you use concepts to learn programming languages, with a reasonable intermediate representation to boot.

This diagram shows the steps for extending the initial kernel language to become more expressive by adding functional abstractions and syntactic sugar:

<center><img src="http://michaelrbernste.in/images/kernel_teaching_diagram.png"></center>

The simplest core of the language is a functional. Various types of state are added, cautiously, as are concurrency, object systems, and more. The authors are very clear, especially with respect to state and concurrency, that these powerful concepts have to be added and treated seriously. In my opinion the semantics they lay out for each successively more complex language are a very clear, insightful representation of the essence of what these languages can express. The progression from one kernel language to another is simple and easy to follow.

One of the more interesting sections of the paper is where the authors outline the approach known as the "Creative Extension Principle" which they use to systematize the means by which kernel languages are extended.

I thought I would include an example kernel language, in this case the language for relational programming, as presented in the _CTM_ book. It's not necessary to explain any of it here, but if you're just experiencing these ideas for the first time, it's nice to be able to see some context.

<center><img src="http://michaelrbernste.in/images/relational.png"></center>

You can get a sense of the limited number of forms that the language has, of its capabilities syntax wise, and a basic sense of the semantics.

The essence of the approach is:

* Encode "programmer significant concepts" such as conditional statements, sequential execution, and concurrency in a kernel language which contains the correct combination of features for a given programming paradigm
* Extend this kernel language with _syntactic sugar_ and _functional abstraction_ in order to make it more expressive and powerful
* Translate localized examples, algorithms, etc. written in the practical programming language to kernel language, and vice versa

## 

#### From the Classroom to the Workplace

The authors do not concern themselves with many of the practical aspects of professional programming by virtue of the fact that they're trying to teach concepts, not design. However the novelty of the kernel language approach does apply to at least a few different professional scenarios:

* The kernel language can give developers a common language to discuss algorithms when they may themselves specialize in different practical programming languages. It is not uncommon for Objective-C, Ruby, and JavaScript developers to work closely with each other, and discussing algorithms and data structures can be difficult because of the impedance mismatches encouraged by speaking in terms of one language or paradigm.
* The popularity of various programming paradigms tends to change over time. Functional programming is seeing a resurgence, for example, and transitioning developers from imperative Object Oriented paradigms to functional languages can be a challenge. The kernel language approach offers a potential transition point for these and other developers in a similar position.
* College students who want to work professionally in a field in which they did not get proper exposure during their coursework or internships can use the kernel language approach to gauge their competencies and forge pathways towards deeper understanding that crosses paradigm boundaries.

There is often an artificial line drawn between the professional and the academic, but this isn't necessary. The formal aspects of the kernel language approach may seem intimidating at first but are very much digestible.

#### Conclusions

Many professional programmers jump straight into the most complex form of programming without ever having even been exposed to the idea of the continuum that the kernel language approach encompasses.

There is an interesting amount of exchange between academia and professional programmers that hasn't been seen for quite some time. I myself have no stake or direct participation in academia - I simply acknowledge that we still have quite a bit to learn about how we understand and teach programming. Ultimately, its all about the quality of our communication.
