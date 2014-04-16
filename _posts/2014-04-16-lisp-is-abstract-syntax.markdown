---
layout: post
title: "Lisp is Abstract Syntax"
published: true
other: true
---
# 
# 
### Lisp is Abstract Syntax

I'm currently working through a bit of Andrew W. Appel's <a href="https://www.cs.princeton.edu/~appel/modern/ml/">Modern Compiler Implementation in ML</a> both to help me get more solidly grounded in ML and to help me more deeply understand compilers and interpreters. At the end of the chapter on abstract syntax, in the further reading section, I came across this gem of a quote about Lisp and the origins of abstract syntax. I'm not sure if its a spurious tale or not<a href="#bib1">[1]</a> , but it's too good of a quote not to share:

> "The notion of abstract syntax is due to McCarthy [1963], who designed the abstract syntax for Lisp [McCarthy et al. 1962]. The abstract syntax was intended to be used writing programs until designers could get around to creating a concrete syntax with human-readable punctuation (instead of <b>L</b>ots of <b>I</b>rritating <b>S</b>illy <b>P</b>arentheses), but programmers soon got used to programming directly in abstract syntax."

If this quote reflects reality, it means that the syntax for Lisp was meant to be a stepping stone, but programmers adopting it prevented advancement. Perhaps this was the first time that software engineering and computer science's fundamental differences manifested themselves in a way that impacted future directions of both fields.

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

*Thanks to Tom Santero and Greg Pfeil for corrections.*

#### Works Cited

<a id="bib1">[1]</a>

<a href="#bib1">[1]</a> It's not! I had forgotten about M-Expressions. <a href="http://www.gigamonkeys.com/book/syntax-and-semantics.html">Practical Common Lisp</a> by Peter Seibel has a good bit about this.
