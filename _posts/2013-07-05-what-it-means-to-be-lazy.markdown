---
layout: post
title: "What It Really Means To Be Lazy"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### What It Really Means To Be Lazy

Two extensions to the declarative computation model are made in Chapter 4 of Concepts, Techniques, and Models. The first is invoked with the instruction `thread`, and enables concurrency. The second, which is the topic of this post, adds the instruction `ByNeed`, and enables an alternative execution order for statements in programs that is known as *lazy execution* or *demand-driven computation.*<a href="#bib1">[1]</a>

Although more or less restricted to one subsection of Chapter 4, the discussion of laziness is extremely rich. Additionally, laziness is a subject that comes up often in the lexicon of professional programming. Haskell and Clojure for example, both rely on laziness for certain language features. Basically, this material was too complex to stuff into the post about concurrency, and too good to not cover.

We'll define laziness in the concurrent declarative computation model and try to be thorough about clarifying its semantics - interesting questions arise like *when is a variable truly needed?* We'll discuss the impact of alternate execution orders, see how this computation model lends itself to the efficient implementation of certain *persistent data structures*, and bring to a close, for now, the posts about the declarative model.

#### What Is Lazy Execution?

What do the authors mean when they talk about laziness? How does it relate to the type of laziness in statements like:

> "Haskell is a *lazy* programming language"

or, for any given value of *Programming Language N*:

> "The modules in Programming Langauge N are *lazily* loaded"

Essentially, laziness can be thought of as a fundamental rethinking of how statements in a given computation are executed. As usual I'd like to let the authors do the definining and this happens to be one of my favorite quotes in the book so far:

> "Up to now, we have always executed statements in order, from left to right. In a statement sequence, we start by executing the first statement. When it is finished we continue to the next. This fact may seem too obvious to require mentioning. Why should it be any other way? But it is a healthy reflex to question the obvious! Many significant discoveries have been made by people questioning the obvious: it led Newton to discover the spectrum of light and Einstein to discover the postulate of relativity. Let us therefore question the obvious and see where it leads us."

It turns out that this exploration has led some very smart theorists and language designers down some very interesting paths. For a definition, we can use the following:

In **lazy or demand-driven evaluation,** statements are only executed when their results are needed elsewhere in the program. This is in contrast **eager evaluation** where if a statement is reached, it is executed.

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

`F1`, `F2`, and `F3` are `lazy` functions. `lazy` is a syntactic construction that is at a higher level than the `ByNeed` instruction we mentioned earlier. When these functions are called, as they are with the assignments to `A`, `B`, and `C`, a **stopped execution** is created. The values of these variables are not yet needed, so those *stopped executions* are not *resumed and completed.* The final line of the fragment shows that the assignment to `D` needs the values of `A` and `B`. This call **triggers** the execution of `A` and `B`, and `C` is assigned the sum of `{F1 10}` and `{F2 20}`. `C`, which is still stopped, is never executed, because its value is never needed. In other words, though this program can be read and understood in a sequential way, it is in fact not executed in the traditional *eager* manner.

Laziness changes the way things happen in a program and can be applied *in the small*, as in the above code snippet, or *in the large* as in the "lazily loaded code modules" example above. An entire language can be *lazy* if that is the default means by which execution within computation occurs. This is not the case for our model, which chooses to *extend the kernel with the ability to declare computations as lazy at the discretion of the developer*. With the combination of concurrency, laziness, and declarativeness, we have a powerful set of ideas to explore.

#### The Semantics of Laziness

Implementing laziness in the kernel language requires a fundamental change to the system on the same order of impact as adding concurrency semantics. A new instruction, `ByNeed`, is added to the kernel language, and the concept of a **by-need trigger** is added to the computation model. `ByNeed` can be understood to be similar to `thread`, with the difference being the scheduling of how the contained computation is executed. `thread` calls will always be executed eventually, where `ByNeed` calls will only be executed if the contained computation is needed. In order to define the semantics of laziness, we need to do the following:

* Extend the execution state with a trigger store ($\tau$)
* Define trigger creation
* Define trigger activation
* Define what it means for a variable to be "needed"

Prior to the introduction of the `trigger`, the execution state of the (declarative, concurrent) abstract machine is represented by the pair **(MST, $\sigma$)**: the multi-set of semantic stacks and the single-assignment store. We add the **by-need trigger** which is a pair `trig(x,y)` of a variable `y` and a one-argument procedure `x`. To accomodate these triggers, we add a **trigger store ($\tau$) ** alongside our **single-assignment store ($\sigma$)**, which contains all of the triggers for the computation and is initially empty. The execution state then becomes the *triple* **(MST, $\sigma$, $\tau$)**: the multi-set of semantic stacks, the single-assignment store, and the trigger store.

**Trigger creation** is represented by the semantic statement `({ByNeed x y}, E)` where `x` is the procedure as noted above, `y` is a dataflow variable, and `E` is the environment. During execution, if `y` is not determined, or unbound, then the trigger `trig(E(x), E(y))` is added to the trigger store. If `y` is determined, or bound, then a new thread is created with the initial semantic statement `({x y}, E)`.

If the trigger store contains `trig(x,y)` and a need for `y` is detected, then **trigger activation** consists of **removing the trigger from $\tau$** and **creating a new thread to execute the computation**.

Finally, we can say that a variable is **needed** if there is a *suspension on the variable* or *if the variable is determined*. Additionally, the authors mention that *being needed is monotonic*: once it is needed, it is needed forever. This is interesting because the monotonicity of being needed turns out to be an essential aspect of the ability to prove that the lazy concurrent model is declarative.

#### A Picture Of Declarative Computation Models

In an interesting but clarifying diversion, section **4.5.2** is devoted to breaking down the declarative computation models that have been discussed through Chapter 4. A contrast is made between concurrency and laziness:

> "Concurrency can make batch computations incremental. Laziness can reduce the amount of computation needed to get a result. A language can have neither, either, or both of these concepts."

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/0707models.png">
<div class="lead">Six practical declarative computation models.<a href="#bib1">[1]</a></div>
</center>

Variable introduction, binding, execution
Haskell etc

#### Applications of Laziness

What is a persistent data structure
Okasaki, something awesome that declarative concurrency enables - the hook is similar time/space complexity

#### Conclusions

Laziness is dope

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

Okasaki
Friedman and Wand
Hudak
