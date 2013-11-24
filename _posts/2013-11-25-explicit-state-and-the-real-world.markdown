---
layout: post
title: "Explicit State and the Real World"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Explicit State and the Real World

The fact that the authors of *Concepts, Techniques, and Models of Computer Programming* wait until page 407 to introduce the concept and implementation of *explicit state* is a joke that tells itself. Explicit, mutable state is the cause of enough confusion and complexity that entire languages and paradigms are based around the idea of avoiding it. But far from a diatribe, the treatment of the subject is subtle in the hands of Van Roy and Haridi who use introducing explicit state as an opportunity to consider the pure world of declarative programming in the harsh realities of the real-world real-world. Like, meat space, for real. You know, that real world.

The stateful model of computation is introduced, which bears resemblance to the model used in <a href="http://michaelrbernste.in/2013/09/11/message-passing-and-concurrent-program-design.html">Chapter 5's message-passing model</a>. The capabilities of explicit state are explained and used in various contexts, notably data types are introduced and broken down. Software engineering theory and practice are discussed, and then the necessities of the tasteful use of explicit state are reviewed.

Van Roy and Haridi, like <a href="http://mitpress.mit.edu/sicp/">Abelson and Sussman</a> before them, deem it very important to make it clear how the introduction of impure, non-declarative operations and models allow programmers to model reality, but at a cost.

#### The Stateful Model

The mutable store

#### Data Types and Explicit State

Performance and interface

#### Programming in the Large

Software Engineering

#### The real world is parallel / The real world is distributed

"Limitations of stateful programming"

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

*If you like this work, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*
