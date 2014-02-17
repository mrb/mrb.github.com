---
layout: post
title: "What is a Type System for?"
published: true
tapl: true
---
# 

<div class="lead">This post is one of a series on <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a> by Benjamin C. Pierce.</div>

# 
### What is a Type System for?

Coming from an imperative and mostly dynamic language background, learning my way through the worlds of functional and statically typed programming languages has been a fascinating and intuition destroying exercise. Likewise, <a href="http://michaelrbernste.in/#i-ctm">going knee-deep</a> into the philosophical wonderland of Van Roy and Haridi's <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models</a> and then jumping into Pierce's notoriously intense <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a> (hereafter TAPL) has done way more to make my brain hurt than it has to actually improve how I write or at this point even understand *code*. 

On the other hand, the hazy picture I have had about certain aspects of computation are becoming somewhat sharper, and studying TAPL has reminded me what is at the core of what I'm pursuing in studying Computer Science as a professional programmer. I want to understand more in order to *accurately express programs in a way that will preserve my intended meaning without being too intrusive to construct.*

Whether you prefer to use a programming language with an expressive type system or not, Pierce shows that types provide a way to understand deep constructs in computation. The systems constructed to formalize types as shown in this text have provided some of the deepest insights for me in my Computer Science self-pedagogy and I'm eager to share some of these with you. Before that, however, I thought it had to be asked:

> "What is a type system for?"

This question is sort of central to a lot of other questions that you hear asked more often:

* Why do some programming languages have advanced type systems while others do not? 
* What is the central purpose of a type system?
* Why do I need types?

I'll try to touch on these questions, but first, some symbols.

#### Some Symbols

In this post and the others on Pierce's book, I'll be using the following conventions for referring to terms, Types, and evaluation:

**t** is a *term* - something that we want to be evaluated in  whichever system we're working in.

**T** is a *type* - a dimension of a term that describes its possible values.

**:** is the *typing relation*, and **t : T** reads *t is of type T*

**->** stands for term reduction and **t -> t'** - reads *t reduces to t'*

A **value** is a primitive, or atomic element in a system - numbers and booleans are classic examples.

#### Safety, Progress, and Preservation

And now, on to that question - what is a type system for? Pierce states it nicely, in the context of the first simple type system discussed in TAPL:

> "The most basic property of this type system or any other is safety (also called soundness): well-typed terms do not 'go wrong.'"

That sounds great! I certainly don't like it when my programs go wrong, and believe me, it happens quite often. But now that I think about it, what exactly does 'go wrong' mean in this context?

> "...it means reaching a 'stuck state' that is not designated as a final value but where the evaluation rules do not tell us what to do next."

Earlier in the book, Pierce discusses stuck states in a bit more detail, and equates them with runtime errors. This was a very deep connection for me. Stuck states are terms that are, according to the operational semantics of a given system, meaningless. Powerful stuff. Pierce continues:

> "What we want to know, then, is that well-typed terms do not get stuck. We show this in two steps, commonly known as the progress and preservation theorems."

The proof-heaviness of TAPL scared me off for a long time, and while stepping through the proofs is instructive, it isn't necessary in this case - you can still form a nice intuition for the purpose of a type system without driving the details through your brain a million times.

The purpose of a type system is to provide safety, and safety consists of progress and preservation. So to get to the bottom of our question, we have to look at two theorems:

**Progress**: If t is a well-typed term (that is, t : T for some T), then either t is a value or else there is some t' with t -> t'.

**Preservation**: If t : T and t -> t' then t' : T

In other words, if the program can continue executing, and each execution preserves types properly, then the program is safe. Or as Pierce says it:

> "Safety = Progress + Preservation"

Not the most complex equation on the surface, but its tendrils are myriad. I encourage you to stare at the moon and think about that one for a while.

#### Falling for Types

While many professional programmers have opinions about dynamic vs. static programming languages or the need for expressive type systems, I don't often see the central point of types being discussed. The idea that the purpose of a type system is to prevent undesirable application states eluded me for some time, and I believe this is the case for many other people as well.

As with any other aspect of the discipline, choosing to use a type system or not shouldn't preclude you from learning more about them and understanding the inherent tradeoffs that are involved in their application. It is clear to me that expressive type systems like those found in OCaml and Haskell are rich and well-considered; they definitely have light to shed on problems encountered in almost any modern developers day-to-day work, but whether or not they can be unobtrusive, for me, remains to be seen.

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

*All quotes unless otherwise cited from Pierce.*

<a id="bib1">[1]</a> Benjamin C. Pierce. 2002. *Types and Programming Languages*. MIT Press, Cambridge, MA, USA.
