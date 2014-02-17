---
layout: post
title: "The Inherent Complexity of Objects"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### The Inherent Complexity of Objects

After introducing the changes to the necessary to model explicit state, Van Roy and Haridi bravely march on. Chapter 7 continues their journey towards covering ground in all possible programming paradigms, and finally it is time for "Object-Oriented Programming" (OOP). The chapter is not meant to be a complete discussion of OOP, which according to the authors would be "impossible" in the relatively short chapter (~80 pages). Instead, they concentrate on the relationship between OOP and other paradigms, weigh the benefits and costs of introducing the style into a codebase, and attempt to define the formal semantics of a subset of the computational model.

The history of OOP is a storied one, and it has been explored in a number of significant languages. The authors discuss Simula, where the paradigm was first seen, Smalltalk-80, an opinionated and interesting implementation of the style, and modern languages like Java and C++, which forced it into the limelight. In comparing the different implementations of objects and attempting to define their semantics, it becomes clear very quickly that while they afford much expressive power seldom found elsewhere, their myriad dimensions can cause painful, mysterious issues in programs.

One of the deeper parts of the chapter for me were the lines Van Roy and Haridi draw between object systems and functional programming. Classes can be defined as higher-order functions, and there are benefits to understanding how you can evolve functions to become objects. This is a powerful pedagogical approach, one that is also taken in <a href="https://leanpub.com/fp-oo">Functional Programming for the Object-Oriented Programmer</a> by Brian Marick. He shows how you can implement a Ruby-style object system from Clojure, building from functions up to classes and their interactions. This connection is also famously demonstrated in <a href="http://mitpress.mit.edu/books/art-metaobject-protocol">The Art of the Metaobject Protocol</a>, which shows an object extension to Common Lisp, illuminating the dark art of language design in the process.

#### Classes as Data Abstractions

#### The Promise and Pain of Inheritance

#### OOP In the Pantheon of Paradigms

#### Mostly Misunderstood

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

https://leanpub.com/fp-oo
