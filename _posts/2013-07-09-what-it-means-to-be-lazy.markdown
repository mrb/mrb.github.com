---
layout: post
title: "What It Really Means To Be Lazy"
published: true
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### What It Really Means To Be Lazy

Two extensions to the declarative computation model are made in Chapter 4 of Concepts, Techniques, and Models of Computer Programming (CTM). The first is invoked with the instruction `thread`, and enables concurrency. The second, which is the topic of this post, adds the instruction `ByNeed`, and enables an alternative execution order for statements in programs that is known as *lazy execution* or *demand-driven computation.*<a href="#bib1">[1]</a>

Although more or less restricted to one subsection of Chapter 4, the discussion of laziness is extremely rich. Additionally, laziness is a subject that comes up often in the lexicon of professional programming. Haskell and Clojure for example, both rely on laziness for certain language features. Basically, this material was too complex to stuff into the post about concurrency, and too good to not cover.

We'll define laziness in the concurrent declarative computation model and try to be thorough about clarifying its semantics - interesting questions arise like *when is a variable truly needed?* We'll discuss the impact of alternate execution orders, see how this computation model lends itself to various real world applications, and bring to a close, for now, the posts about declarativeness.

#### What Is Laziness?

What do the authors mean when they talk about laziness? How does it relate to the term *laziness* as it is used in statements like:

> "Haskell is a *lazy* programming language"

or, for any given value of *Programming Language N*:

> "The modules in Programming Language N are *lazily* loaded"

The laziness this post covers is of a general nature, but subsumes both types of laziness above. Laziness can be thought of as a fundamental rethinking of how statements in a given computation are executed. As usual I'd like to let the authors do as much of the defining as possible, and this happens to be one of my favorite quotes in the book so far:

> "Up to now, we have always executed statements in order, from left to right. In a statement sequence, we start by executing the first statement. When it is finished we continue to the next. This fact may seem too obvious to require mentioning. Why should it be any other way? But it is a healthy reflex to question the obvious! Many significant discoveries have been made by people questioning the obvious: it led Newton to discover the spectrum of light and Einstein to discover the postulate of relativity. Let us therefore question the obvious and see where it leads us."

It turns out that this exploration has led some very smart theorists and language designers down some very interesting paths. For a definition, we can use the following:

In **lazy or demand-driven evaluation,** statements are only executed when their results are needed elsewhere in the program. This is in contrast to **eager evaluation** where if a statement is reached, it is executed.

Let's explore the following program fragment to get an intuition for how laziness works:

{% highlight ruby %}
fun lazy {F1 X} 1+X*(3+X*(3+X)) end
fun lazy {F2 X} Y=X*X in Y*Y end
fun lazy {F3 X} (X+1) * (X+1) end

A={F1 10}
B={F2 20}
C={F3 30}

D=A+B
{% endhighlight %}

`F1`, `F2`, and `F3` are `lazy` functions (`lazy` is a syntactic construction on top of the `ByNeed` instruction we mentioned earlier, and is explained below). When these functions are called, as they are with the assignments to `A`, `B`, and `C`, a **stopped execution** is created. The values of these variables are not yet needed, so those *stopped executions* are not *resumed and completed.* The final line of the fragment shows that the assignment to `D` needs the values of `A` and `B`. This call **triggers** the execution of `A` and `B`, and `C` is assigned the sum of `{F1 10}` and `{F2 20}`. `C`, which is still stopped, is never executed, because its value is never needed. In other words, though this program can be read and understood in a sequential way, it is in fact not executed in the traditional *eager* manner.

Laziness changes the way things happen in a program and can be applied *in the small*, as in the above code snippet, or *in the large* as in the "lazily loaded code modules" example above. An entire language can be *lazy* if that is the default means by which execution within computation occurs. This is not the case for our model, which chooses to *extend the kernel with the ability to declare computations as lazy at the discretion of the developer*. With the combination of concurrency, laziness, and declarativeness, we have a powerful set of ideas to explore.

For the sake of completeness it's interesting to see how the `lazy` linguistic abstraction seen here:

{% highlight ruby %}
fun lazy {Generate N} N|{Generate N+1} end
{% endhighlight %}

Is turned into a normal function here:

{% highlight ruby %}
fun {Generate N}
  {ByNeed fun {$} N|{Generate N+1} end}
end
{% endhighlight %}

The function is wrapped in a new zero-argument function that only gets called when the value of `Generate N` is needed.

#### The Semantics of Laziness

<div class="lead">This section builds on the abstract machine <a href="http://michaelrbernste.in/2013/06/17/declarative-computation-and-the-abstract-machine.html">discussed in this earlier post in the series</a>.</div>

Implementing laziness in the kernel language requires a fundamental change to the system on the same order of impact as adding concurrency semantics. A new instruction, `ByNeed`, is added to the kernel language, and the concept of a **by-need trigger** is added to the computation model. `ByNeed` can be understood to be similar to `thread`, with the difference being the scheduling of how the contained computation is executed. `thread` calls will always be executed eventually, where `ByNeed` calls will only be executed if the contained computation is needed. In order to define the semantics of laziness, we need to do the following:

* Extend the execution state with a trigger store ($\tau$)
* Define trigger creation
* Define trigger activation
* Define what it means for a variable to be "needed"

Prior to the introduction of the `trigger`, the execution state of the (declarative, concurrent) abstract machine is represented by the pair **(MST, $\sigma$)**: the multi-set of semantic stacks and the single-assignment store. We add the **by-need trigger** which is a pair `trig(x,y)` of a variable `y` and a one-argument procedure `x`. To accommodate these triggers, we add a **trigger store ($\tau$) ** alongside our **single-assignment store ($\sigma$)**, which contains all of the triggers for the computation and is initially empty. The execution state then becomes the *triple* **(MST, $\sigma$, $\tau$)**: the multi-set of semantic stacks, the single-assignment store, and the trigger store.

**Trigger creation** is represented by the semantic statement `({ByNeed x y}, E)` where `x` is the procedure as noted above, `y` is a dataflow variable, and `E` is the environment. During execution, if `y` is not determined, or unbound, then the trigger `trig(E(x), E(y))` is added to the trigger store, where `E(x)` and `E(y)` represent the value when applied to the given `E` environment. If `y` is determined, or bound, then a new thread is created with the initial semantic statement `({x y}, E)`.

If the trigger store contains `trig(x,y)` and a need for `y` is detected, then **trigger activation** consists of **removing the trigger from $\tau$** and **creating a new thread to execute the computation**.

Finally, we can say that a variable is **needed** if there is a *suspension on the variable* or *if the variable is determined*. Additionally, the authors mention that *being needed is monotonic*: once it is needed, it is needed forever. This is interesting because the monotonicity of being needed turns out to be an essential aspect of the ability to prove that the lazy concurrent model is declarative.

The mechanics of `ByNeed` show how dataflow variables can enable laziness, and this simple implementation strikes me as beautiful in its elegance.

#### A Picture Of Declarative Computation Models

In an interesting but clarifying diversion, section **4.5.2** is devoted to breaking down the declarative computation models that have been discussed through Chapter 4. A contrast is made between concurrency and laziness:

> "Concurrency can make batch computations incremental. Laziness can reduce the amount of computation needed to get a result. A language can have neither, either, or both of these concepts."

Starting from a purely functional kernel, the following elements have been added to the model during the course of the first four chapters:

* Dataflow variables
* Concurrency
* Laziness

From these three additions, there are six possible combinations. They're outlined very nicely in this diagram:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/0707models.png">
<div class="lead">Six practical declarative computation models.<a href="#bib1">[1]</a></div>
</center>

It's a very interesting spectrum of languages to consider: take for example the differences between the dataflow enabled non-sequential laziness of our concurrent, lazy, declarative model and Haskell's sequential laziness. Because dataflow variables allow the separation of declaration (1) and specification (2), a maximum amount of expressiveness can be achieved. The complexity of managing these features however, is not lost on the authors:

> "One way to understand the added expressiveness is to realize that dataflow variables and laziness each add a weak form of state to the model. In both cases, restrictions on using the state ensure the model is still declarative."

Declarativeness is still paramount, and the ability to use these features in a declarative context is fascinating and has deep-reaching consequences.

#### Applications and Theories of Laziness

Laziness as a language construct has the ability to shift the burden of deciding how much computation is necessary from *producer* to *consumer*. Concurrent stream communication, for instance, in an eager setting would default to the producer deciding the rate and amount of computation. Laziness allows resource intensive computation to be executed on a by need basis, which can have advantages in computationally limited settings: while laziness may use the same amount or more overall resources, it can limit usage in a point in time manner. Particularly well-known techniques of this ilk include lazily reading lines from a log file, consuming data from an external feed, etc.

The authors also cover other material to show the usefulness of declarative laziness in various settings. Algorithm design is explored quite deeply, with a focus on how laziness can enable the design and implementation of **persistent data structures** which have similar time/space complexity of their ephemeral, imperative counterparts. Based on the work of Chris Okasaki, various data structures are covered that have surprisingly favorable performance comparisons to implementations in imperative settings. The implementation of **list comprehensions** (introduced as "a notational convenience for defining streams") in the declarative model are also given a mind-bending deepdive. Traditional list comprehension use cases are translated to the declarative model using functions like `LMap` and `LFlatten` (lazy map and lazy flatten) that were built up in an earlier subsection.

The "Advanced Topics" section at the end of Chapter 4 also romps through some quite heavy material which hints at the depth of the ideas wrapped up in laziness. Lazy evaluation exhibits the behavior of normal order reduction, but there are other possible reduction orders. "Reduction orders" here refers to the order in which remaining suspended computations are calculated. A thrilling explanation of <a href="http://en.wikipedia.org/wiki/Church%E2%80%93Rosser_theorem">the Church Rosser theorem</a> follows, along with, believe it or not, one of the most concise and comprehensible explanations of Monads and their use in Haskell that I've ever seen. And I've seen way too many.

#### Conclusions

Laziness is a quality of a programming language's semantics that is often misunderstood by developers. It sounded bizarre and impossible to me when I first encountered it, as a complete novice functional programmer coming from an imperative background. As I began to understand a bit more about its application and philosophy I still did not understand its implementation. After thorough investigation it turns out that laziness, like concurrency, is a tool that can help a developer get the most out of the computational power they have available to them. It is no surprise that it is a pattern to lean on when the simplest plans do not work out, not a solution to all of our engineering problems. Laziness can help us build new and interesting structures, but its application is limited.

Adding laziness to the concurrent declarative model also provides insight into how complexity is introduced into a programming language and its computational model. This language is small and provably correct, but considerably less expressive than a typical production language with many of the same characteristics. Adding laziness meant adding an entirely new concept to the abstract machine, new instructions to the kernel language, new linguistic abstractions, new ways of thinking about time and space complexity, and more. The relationship between laziness and state is also quite compelling. Reading that "laziness is state" is one thing, but seeing the mechanics of how that state is added and passed around in the abstract machine is a whole beautiful other.

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004
