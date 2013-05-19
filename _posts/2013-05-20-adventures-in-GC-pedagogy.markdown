---
layout: post
title: Adventures in Garbage Collection Pedagogy
published: false
---
# 
#### Adventures in Garbage Collection Pedagogy

As I prepare for a <a href="http://goruco.com/speakers/2013/bernstein-mike/">conference talk on Garbage Collection</a> (GC), I continue to scour the internet for information on how to communicate the challenging ideas GC encompasses. GC is taught at the Undergraduate and Graduate levels in varying degrees of granularity, for a wide range of purposes. Some programs merely place GC in the hierarchy of important problems and work areas in Computer Science, ackowledging that it is relied on, but not necessary to thoroughly understand. Other programs attempt to teach students how to implenet GC in the context of Programming Language or Virtual Machine design, accepting the burden and relying on a host of prior knowledge from the student for the material to be comprehensible.

A fascinating paper about a technique employed across a group of institutions, <a href="http://faculty.cs.byu.edu/~jay/static/cooper-sigcse2013.pdf">*Teaching Garbage Collection without Implementing Compilers or Interpreters*</a> proposes an interesting way to get at the heart of the issues that GC represents, allowing students to focus on the implementation details of various GC algorithms and their impact on runtimes without having to endure the pain of "curricular dependencies" (parsing, lexing, program transformation, etc.) normally associated with Virtual Machine construction.

<a href="http://blog.brownplt.org/2013/02/19/teaching-gc.html">This post on the Brown University PLT Blog</a> outlines the technique, which uses the <a href="http://racket-lang.org">Dr. Racket IDE and Racket programming language</a> to teach Garbage Collection the trade-offs and implementation details of GC algorithms. The central concept behind this pedagogy is that students should *focus on the implementation details* of the collector and mutator routines in their runtimes, because...they are learning about Garbage Collection. The authors repeatedly refer to "curricular dependencies" as a deterrent to being able to teach GC thoroughly and deeply, and they cite evidence that their approach leads to students who understand memory management and GC and are excited to use it in practice. The authors make <a href="http://faculty.cs.byu.edu/~jay/courses/2012/fall/330/course/gc.html">some of their course work available</a>, and their approach and implementation is very compelling.

The flexibility and feature-set of Racket makes it possible for students to implement a collector in *ten functions* in order to be able to interface with a mutator that is provided by the framework.

<center>
<table width="600">
<tr align="left">
<th>Function</th>
<th>Arguments</th>
<th>Returns</th>
</tr>
<tr><td>init-allocator</td><td><i>none</i></td><td>void</td></tr>
<tr><td>alloc-flat value</td><td><i>none</i></td><td>location?</td></tr>
<tr><td>cons</td><td>first-addr rest-addr</td><td>location?</td></tr>
<tr><td>cons?</td><td>addr</td><td>boolean?</td></tr>
<tr><td>first</td><td>cons-addr</td><td>location?</td></tr>
<tr><td>set-first!</td><td>cons-addr, first-addr</td><td>void</td></tr>
<tr><td>rest</td><td>cons-addr</td><td>location?</td></tr>
<tr><td>set-rest!</td><td>cons-addr, rest-addr</td><td>void</td></tr>
<tr><td>flat?</td><td>addr</td><td>boolean?</td></tr>
<tr><td>deref</td><td>addr</td><td>heap-value?</td></tr>
</table>
</center>

Here's a breakdown of how the framework functions in practice:

1. Students implement a Garbage Collection algorithm by implementing the functions above. These functions serve as a specification that abstracts GC so that each algorithm, or *collector*, can be implemented.
2. Students write limited Racket programs which are translated by the runtime and executed by a *mutator* which interacts with the system memory through the *student implemented collector.*
3. The provided heap is visualized, giving students access to an interactive map which includes the ability to follow pointer references and see the memory layouts students have implemented in a realized form.

Racket is an excellent choice for this kind of experiment. The authors of the framework have worked dilligently to provide a smooth experience for students, one of the most compelling of which is how they provide automatic <a href="en.wikipedia.org/wiki/A-normal_form">A-normal form</a> program transformation through the use of <a href="http://docs.racket-lang.org/reference/contmarks.html">continuation marks</a> and other language features to "re-route" memory allocations to the student designed *collector*.



{% highlight clojure %}
#lang plai/mutator
(allocator-setup "mrbcollector.rkt" 128)

(define (incr-list lst)
 (if (empty? lst) empty
 (cons (+ 1 (first lst)) (incr-list (rest lst)))))

(incr-list '(1 2 3 4 5))
{% endhighlight %}

{% highlight clojure %}
(module mutator plai/mutator
  (#%module-begin
   (begin
     (require "mrbcollector.rkt")
     (set-collector:deref! gc:deref)
     (set-collector:alloc-flat! gc:alloc-flat)
     (set-collector:cons! gc:cons)
     (set-collector:first! gc:first)
     (set-collector:rest! gc:rest)
     (set-collector:flat?! gc:flat?)
     (set-collector:cons?! gc:cons?)
     (set-collector:set-first!! gc:set-first!)
     (set-collector:set-rest!! gc:set-rest!)
     (init-heap! (#%datum . 128))
     (when (gui-available?)
       (if (<= (#%datum . 128) 500)
         (set-ui! (dynamic-require `plai/private/gc-gui 'heap-viz%))
         (printf "Large heap; the heap visualizer will not be displayed.\n")))
     (init-allocator))
   (mutator-top-interaction define
    (incr-list lst)
    (if (empty? lst) empty (cons (+ 1 (first lst)) (incr-list (rest lst)))))
   (mutator-top-interaction incr-list '(1 2 3 4 5))))
{% endhighlight %}

<img src="http://michaelrbernste.in/heap_layout_racket.png">
