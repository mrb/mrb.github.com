---
layout: post
title: "Unifying The Ununifiable: The Duality Of GC Algorithms"
published: false
---
# 
### Unifying The Ununifiable: The Duality Of GC Algorithms

Introduced in 1960 by John McCarthy and George Collins respectively, *tracing* and *reference counting* are both forms of the type of automatic memory management known as *garbage collection* (GC).<a href="#bib3">[3]</a> <a href="#bib2">[2]</a> This name is derived from the fact that GC algorithms exist to seek out and reclaim memory that has been allocated, but is no longer needed.

Reference counting and tracing are often viewed as fundamentally different, incompatible forms of memory management. An extraordinarily insightful 2004 paper by Bacon, Cheng, and Rajan, *A unified theory of garbage collection* draws incredible parallels between these two approaches to GC.<a href="#bib1">[1]</a> It begins by introducing the insight that tracing and counting are related and goes so far as to formalize the work done by each algorithm in order to prove their point: these approaches are in fact "algorithmic duals" of each other which take the same approach from different starting points.

#### The Technique

I'm very interested in this deep insight and thought it would be fun to share the technique that they use to demonstrate their point. While the heart of the paper is actually based on a mathematical formalization known as a *fix-point formulation,* the basic intuition is easily expressed. It is more or less as follows:

1. Explain the basics of naive implementations of tracing and reference counting
2. Introduce small, very commonly applied optimizations to each algorithm which do not impact their complexity
3. Illustrate how these optimizations "pull" each paradigm toward a common center-point
4. Examine *real-world* GCs and illustrate that they are in fact, hybrid counter-tracers

A naive implementation of *reference counting* is very simple. As the program execution proceeds and memory is needed, the main thread of execution, or *mutator*, allocates through a *write barrier* which 

#### Works Cited

<a id="bib1">[1]</a>David F. Bacon, Perry Cheng, and V. T. Rajan. *A unified theory of garbage collection.* In OOPSLA 2004 [OOPSLA04], 2004, pages 50-68

<a id="bib2">[2]</a> George E. Collins. *A method for overlapping and erasure of lists.* Communications of the ACM, 3(12):655-657, December 1960.

<a id="bib3">[3]</a>John McCarthy. *Recursive functions of symbolic expressions and their computation by machine, Part I.* Communications of the ACM, 3(4):184-195, April 1960.

