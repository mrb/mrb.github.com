---
layout: post
title: "Types Are The Truth"
published: true
tapl: true
---
# 

<div class="lead">This post is one of a series on <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a> by Benjamin C. Pierce.</div>

# 
### Types Are The Truth

In Chapter 9 of <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a>, Pierce presents his exposition of the Simply typed Lambda-Calculus. It is a truly awesome chapter - each subsection in succession constructs a rich and very well detailed system of computation and Pierce is a master of precision, guiding the reader through the maze of theory very carefully. Exploring the mechanics of the various calculi Pierce presents reveal the hidden connections between this core kernel of an idea to many, many practical applications - type systems, compilers, program optimization, and more draw on these ideas.

On the other hand, studying Chapter 9 of TAPL will have you well on your way to hallucinating these mechanics everywhere. You may see their shapes, in passing, and then lose them. Sounds kind of scary, but we could all use some more hallucinations in our lives, right? Among the various sub-explorations in the chapter, "Section 9.5: Erasure and Typability," grabbed my attention in particular. It contained a new bit of information for me, confirmed some interesting intuitions, and put a name on an idea I was curious about: type erasure. 

#### What is Type Erasure?

Pierce begins the section by pointing out that the evaluation relation as defined on simply typed terms has the property that it carries along the type information in the terms, *but does not actually use them during run-time*. This is in contrast to how things work in "full-scale" programming languages:

"Most compilers for full-scale programming languages actually avoid carrying annotations at run time: they are used during typechecking (and during code generation, in more sophisticated compilers), but do not appear in the compiled form of the program."

That's a really cool idea: *The safety that is guaranteed by type checks at compile time can be removed at run-time with no change in the results.* This process of removal is called type erasure, a new concept to me.

I was previously aware that programs can be compiled down to intermediate representations which may not carry type information, and I knew that in the end the instructions carried out while executing the code have very little to do with my type annotations, but the impact of seeing the mechanics of it and how it actually works was very impactful to me. I think this is because the relationship between fully annotated programs and their "erased" counterparts is echoed in other important place in Computer Science theory. I'll try to elaborate later. First let's see the mechanics.

#### How Does Type Erasure Work?

Pierce explains that in most situations, "programs are converted back to an untyped form before they are evaluated," but that doesn't really speak to how it actually works. <a href="#bib1">[1]</a> A bunch of questions come to mind:

* How can you be sure that the semantics won't change? 
* Is this universally true? 
* Are there exceptions? 
* Is there a theorem? 
* Yes. It's TAPL. Of course there's a theorem. 

With respect to type erased typed terms, Pierce notes that:

> "This style of semantics can be formalized using an *erasure* function mapping simply typed terms into the corresponding untyped terms."

For a term **t**, Pierce gives the following definition of erasure, naming the function `erase`. Rules are given for each of the three types of terms - variables, abstractions, and applications.

    erase(x)         = x                   -- 1 - Variable
    erase(λx:T1. t2) = λx. erase(t2)       -- 2 - Abstraction
    erase(t1 t2)     = erase(t1) erase(t2) -- 3 - Application

For each of these rules in order, here is how I would write it out in english:

1. If you apply the erase function to a variable x, you get x.
2. If you apply the erase function to an abstraction which is annotated (in this case, a function that accepts a term of type T1), it is equivalent to an untyped abstraction with an erased input.
3. If you apply the erase function to the application of a term to another, it is equivalent to erasing them first and then applying them.

In other words:

> "...it doesn't really matter whether we evaluate a typed term directly, or whether we erase it and evaluate the underlying untyped term."

Whoah, that's awesome, and we just saw exactly how it works. While we're at it, here's one more pithy Piercism on erasure:

> "evaluation commutes with erasure"

Let it sink in. That means that the commutative property holds between evaluation and erasure - the order you apply them does not matter. The proof is constructed by induction on the following derivations:

1. If **t -> t'** under the typed evaluation relation, then **erase(t) -> erase(t')**.

2. If **erase(t) -> m'** under the typed evaluation relation, then there is a simply typed term **t'** such that **t -> t'** and **erase(t') = m'**.

It's useful to write down some sample terms that follow this form to get a feel for the mechanics of it, but it's not necessary to understand the proof component at this point to grok the bigger ideas at play.

#### The Implications of Erasure

So what are those echoes that I referred to above? Isn't erasure kind of an obvious idea once you think about it for a moment? While not being the most complex concept with the most tendrils to unravel, I feel that its structure is quite elegant, and I believe that Pierce does too:

> "For more interesting languages and more interesting compilers, it becomes a quite important property: it tells us that a "high-level" semantics, expressed directly in terms of the language that the programmer writes, coincides with an alternative, lower-level evaluation strategy actually used by an implementation of the language."

That makes me wonder what other kinds of transformations you can make to terms in programs that won't change their meaning. The fact that you can assert properties of programs with types, erase them, and have the same guarantees of semantics is fascinating to me. That's the idea I was hinting at with this tweet:

<center><blockquote class="twitter-tweet" lang="en"><p>Types are the truth: they&#39;re there whether you want them to be or not</p>&mdash; mrb (@mrb_bk) <a href="https://twitter.com/mrb_bk/statuses/455736689114492928">April 14, 2014</a></blockquote></center>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Whether your programming language "embraces" types or has a modern type system or not, these concepts are central to how programs execute, because they are a fundamental part of how computation works. Adding types to the lambda calculus is what transformed the primordial ooze of computation into the complex ecosystem of programming, and its mysteries and intricacies are manifold.

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

*All quotes unless otherwise cited from Pierce.*

<a id="bib1">[1]</a> Benjamin C. Pierce. 2002. *Types and Programming Languages*. MIT Press, Cambridge, MA, USA.
