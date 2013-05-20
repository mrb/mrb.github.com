---
layout: post
title: Adventures in Garbage Collection Pedagogy and an Introduction to Racket
published: true
---
# 
#### Adventures in Garbage Collection Pedagogy and an Introduction to Racket

While preparing for a <a href="http://goruco.com/speakers/2013/bernstein-mike/">conference talk on Garbage Collection algorithms, implementations, and history</a>, I have made a habit of scouring the internet for information on how to communicate the challenging ideas that Garbage Collection (GC) encompasses. During one of these frenzies I came across a fascinating paper, <a href="http://faculty.cs.byu.edu/~jay/static/cooper-sigcse2013.pdf">*Teaching Garbage Collection without Implementing Compilers or Interpreters*</a>, which attempts to provide a framework to teach Computer Science students the finer points of GC through the *constructivist* means of *having them actually implement the algorithms*. This framework is necessary because according to the authors:

> "Many students appear to have a poor grasp of garbage collection."

While it is interesting to me how students learn, I am much more interested in how professionals learn. It's no surprise that this concept isn't discussed much in this paper, as it is clearly beyond its scope, but it is posited that:

> "Beyond the pure pedagogic value, this (approach) could have a salutary impact on the software students write in their careers."

I believe it can. Having tried to <a href="http://michaelrbernste.in/2013/02/23/notes-on-teaching-with-the-kernel-language-approach.html">draw connections between academic and professional practice before</a> with some success, I'm considering taking something very similar to the approach outlined in this paper in the talk I'm preparing, in order to illustrate the concepts at the core of Garbage Collection and leave a lasting impression.

According to the paper and bolstered by my own experience as a Computer Science educator and recruiter for a startup, GC is taught at the Undergraduate and Graduate levels in varying degrees of granularity, for a wide range of purposes. Some programs merely place GC in the hierarchy of important problems and work areas in Computer Science, acknowledging that it is relied on, but not necessary to thoroughly understand. Other programs attempt to teach students how to implement GC in the context of Programming Language or Virtual Machine design, accepting the burden and relying on a host of prior knowledge from the student for the material to be comprehensible.

The authors propose an interesting way to get at the heart of the issues that GC represents, allowing students to focus on the implementation details of various GC algorithms and their impact on runtimes without having to endure the pain of "curricular dependencies" (parsing, lexing, program transformation, etc.) normally associated with Virtual Machine construction.

<a href="http://blog.brownplt.org/2013/02/19/teaching-gc.html">This post on the Brown University PLT Blog</a> outlines the technique, which uses the <a href="http://racket-lang.org">Dr. Racket IDE and Racket programming language</a> to teach the material. The central concept behind this pedagogy is that students should *focus on the implementation details* of the collector and mutator routines in their runtimes *by actually implementing them*, because...they are learning about Garbage Collection. The authors repeatedly refer to "curricular dependencies" as a deterrent to being able to teach GC thoroughly and deeply, and they cite evidence that their approach, which allows students to sehd a number of these dependencies, leads to students who understand memory management and GC and are excited to use it in practice. The authors make <a href="http://faculty.cs.byu.edu/~jay/courses/2012/fall/330/course/gc.html">some of their course work available</a>, including a sample collector that simply throws an error when the heap is out of space, and their approach and implementation is very compelling.

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

Racket is an excellent choice for this kind of experiment and the authors of the framework have worked diligently to provide a smooth experience for students, leveraging some awesome features along the way. An awesome side effect of me diving into this material has been an introduction to this great language and framework up close, which I had only read about in a passive way. One of the most compelling implementation details of the framework is how they provide automatic <a href="en.wikipedia.org/wiki/A-normal_form">A-normal form</a> program transformation for input programs, and through the use of <a href="http://docs.racket-lang.org/reference/contmarks.html">continuation marks</a> and other language features can "re-route" memory allocations to the student designed heap and *collector*. I have provided an example of this below. <a href="http://docs.racket-lang.org/reference/contracts.html">Contracts</a> are also employed to ensure that all of the implemented functions cannot "cheat" by, for example, allocating complex data structures on the student heap directly without laying them out on their own.

{% highlight clojure %}
;; This small program
#lang plai/mutator ;; Tell Racket to use the 'mutator' language
(allocator-setup "mrbcollector.rkt" 128) ;; Set up an allocator with 128 spaces
(define (incr-list lst) ;; A simple function and function call
 (if (empty? lst) empty
 (cons (+ 1 (first lst)) (incr-list (rest lst)))))
(incr-list '(1 2 3 4 5))

;; Expands (partially, at least) to the below. Notice the 'set-collector'
;; calls and the invocation of the gui in particular.
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

<center><i>An example of how Racket macro expansions are used to insert<br/> and reroute allocations to student written collectors</i></center>

# 

<img src="http://michaelrbernste.in/images/heap_layout_racket.png">
<center><i>After executing the above program, the heap layout above is displayed</i></center>

The paper reports a great deal of success with this approach, which leads me to wonder - can I turn it around a bit to help make various schemes clearer to professional developers in a conference setting? There is clearly great power in the simplicity in writing a very small lisp program and seeing your custom memory layout visualized, but will it translate when it is someone else's? Is the power in this approach in the *constructivism* that the authors worked so hard to achieve, or is the interface they provide an equally powerful tool?

{% highlight clojure %}
;; type | value | inuse | x
(define cell-size 4)

(define (gc:alloc-flat p)
 (begin
   (when (> (+ heap-ptr cell-size) (heap-size))
     (map (lambda (s) 
            (print (read-root s))) (get-root-set))
     (error "out of memory"))
{% endhighlight %}
<center><i>In progress work on implementing a mark and sweep collector in #lang plai/collector</i></center>

Knowing the basic concepts behind each of the major GC algorithms is not the same as implementing them or even pondering their implementation. Developers who rely on Garbage Collected programming languages, including Java, Ruby, and JavaScript to name a few, have a lot to gain by understanding the behaviors relative to the workloads they impose on their systems. It is one thing to know that head space is needed in a heap of a certain layout under certain workloads, and quite another to see it visualized and be able to interact with it.

It is relatively simple to get up and running with this system. <a href="http://racket-lang.org/download/">Download Racket</a>, follow the instructions on <a href="http://faculty.cs.byu.edu/~jay/courses/2012/fall/330/course/gc.html">this course page</a>, begin implementing various GC algorithms, and see your favorites in action. If you don't learn something new, at the very least you'll appreciate the implementation of the GC you rely on daily.
