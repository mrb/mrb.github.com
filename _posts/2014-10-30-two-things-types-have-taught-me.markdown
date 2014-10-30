---
layout: post
title: "Two Things Types Have Taught Me"
published: true
other: true
---
# 
# 
### Two Things Types Have Taught Me

I've been researching and playing around with programming languages with very interesting type systems these days, namely <a href="http://www.idris-lang.org/">Idris</a> and <a href="https://www.haskell.org/haskellwiki/Haskell">Haskell</a>. Since what little code I write professionally these days is entirely in a dynamically checked language with none of the typically touted benefits of an advanced type system, it's been a lot of fun.

After a few years of repeatedly banging my head on being able to express even the simplest programs using Haskell, I've recently had some breakthroughs and am able to construct some modest programs. I've made no bones about the fact that I think types are super cool and a very interesting area of research in Computer Science in general and Programming Languages in particular, but I haven't said that much about what I've learned from using these type systems directly. This post is a start down that road.

## Thing Number One: A type signature is not enough

Though type systems can allow for wonderfully expressive type signatures and programs which are shockingly declarative and almost literal, it is still my opinion that a type signature is not enough. Descriptive names and documentation are still requirements of excellent software and at least in terms of what is currently available to the day to day programmer, the whole package is necessary.

It's (more or less) true in my experience that once you learn the meaning of things like `\\`, `$`, `.`, `>>=`, etc. in Haskell that they eventually become transparent, but two things make this challenging for people learning the language:

1. There are too many instances of these kinds of opaque functions, concepts, etc.
2. The language encourages people to create their own

It takes *a lot of time* to become familiar with all of the idioms of Haskell (I'm not even close in that respect). Excellent documentation in certain places has been the main thing that has made it easier (that, and talking to people) - so in my experience, we'll always need more than types. We need comprehensive, awesome documentation, and people to support the software.

## Thing Number Two: Type systems are excellent for globally enforcing invariants

One thing that gets me excited about type systems are their ability to enforce invariants in a way that is challenging or cumbersome to replicate in other contexts. One example that I have been playing around with is using a type system like the one found in Idris to enforce certain properties of functions statically that have previously only been enforceable at runtime. Because Idris uses dependent types, it is possible to design types which enforce function properties such as idempotence.

This would have awesome impact in the lives of professional programmers because there is increasing evidence that designing data transformations to conform to certain algebraic properties makes reasoning about data considerably easier in the long term. A type system that could tell you statically that your function is not fit in a job class which requires idempotent jobs would be amazing. Something like this is possible in other contexts (certain forms of testing, etc.) but to me it feels challenging or clumsy to generalize.

## Conclusion

I've been thinking a lot about how fancy type systems can impact software development, and these two short thoughts are my first take at writing some of them down. I'd love to hear your thoughts - drop me an email or hit me up on twitter <a href="http://twitter.com/mrb_bk">@mrb_bk</a>.
