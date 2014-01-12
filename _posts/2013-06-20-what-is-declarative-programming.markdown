---
layout: post
title: "What Is Declarative Programming?"
published: true
ctm: true
---
# 

<div class="lead">This post is part of a series exploring a brain-melting epic known as <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a>. Check the <a href="/">blog index</a> for more.</div>

# 
### What Is Declarative Programming?

Van Roy and Haridi have a way with definitions in *Concepts, Techniques, and Models of Computer Programming* (CTM), but interestingly, *declarative computation* and *declarative programming* get thrown around a lot in Chapter 2 before they are properly or even pithily defined. This post provides this definition and also looks closely at declarative programming as a paradigm: its benefits, its limitations, and how it impacts professional developers. We will also see how declarativeness relates to what is commonly understood as functional programming, and consider ways in which we can reach for declarativeness as a tool in our otherwise imperative code.

#### A Definitional and Observational View

In Chapters 1 and 2, before the practical application and programming techniques of declarative programming are discussed, we learn the paradigm through the semantics of a simple kernel language which is defined by its ability to "evaluate functions over partial values."<a href="#bib1">[1]</a> Chapters 3 and 4 cover declarative programming in depth while rounding out the foundational Computer Science knowledge developed in the first few chapters. Declarative programming *as a paradigm* is defined, extended to include concurrency primitives (the subject of our next post), and then used to bridge the gap to a chapter on message passing concurrency.

Back to that definition - what does it mean to be declarative?

> "We say the operation is declarative if, whenever called with the same arguments, it returns the same results independent of any other computation state."

To break that down, declarative computation can be described as having the following properties:

* It is ***independent***: it computes irrespective of other computation state
* It is ***stateless***: each action is unrelated to any previous action
* It is ***deterministic***: the same inputs will return the same outputs

Finally, declarative programming is  described as being necessarily *referentially transparent* if "certain rules are followed." *Referential transparency* is a quality ascribed to code which has mathematical origins. An expression is referentially transparent if it can be replaced with its value without changing the meaning of the program. In mathematical functions, all applications are referentially transparent: a function with a certain input will always produce a certain output, and therefore, it can be replaced by its value. This is a powerful property that allows mathematicians to reason about their "code" in interesting ways. If our code is declarative, it can be referentially transparent, and programmers can leverage the same benefits: ability to easily reason about structure and function, ease of composability, and more.

Reading these definitions of declarativeness sequentially, you may start to see the hazy picture of how the roots of functional programming are formed in the semantics of declarative programming. The authors are somewhat well known for the following diagram, which puts programming languages on a continuum from "more declarative" to "less declarative" and is one of the keys to understanding the system as laid out by CTM.

<center><img width = 600 src="https://dl.dropboxusercontent.com/u/1401061/paradigms.jpg">
<div class="lead">The massive paradigm chart - "More is not better (or worse) than less, just different." (<a href="http://www.info.ucl.ac.be/~pvr/paradigms.html">source</a>)</div>
</center>

 *More declarative* programming languages, including Prolog, Haskell, Oz, and SQL, are part of a sub-group of declarative languages which have the property of using "Unnamed state (sequential or concurrent)." *More declarative* languages are also shown to belong to categories like "Lazy functional programming," "Constraint (logic) programming," and "Declarative concurrent programming."
 
 *Less declarative* languages use "Named state," and prominent examples include Erlang, Pascal, C, and Java. Interestingly, Prolog also appears in this list (due to a Prolog programmer's ability to forgo the maintenance of declarativeness through the use of certain operators) as does Oz, which is a multi-paradigm language. Categories of *less declarative* languages include "Stateful functional programming," "Concurrent object-oriented programming," and "Message passing concurrent programming."

 There is a lesser known and more narrowly scoped illustration in Chapter 3 of CTM which I have recreated here because I think it helps round out the picture of what declarative programming is and how it tends to work:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/declarative.jpg">
<div class="lead">What is Declarative Programming? Diagram based on</br>Van Roy and Haridi's, recreated with stolen imagery.</div>
</center>

In other words, declarative programming is predictable, timeless, and knowable, and the rest of programming is a swirling, galactic vacuum of energy and space. Why is this? According to the paradigm diagram, declarativeness is a continuum resting on a fulcrum of statefulness. The more state we have, the more expressive we can be. Because engineering is always about tradeoffs, however, it is important to remember that state also controls how much more more imperative we become. But declarativeness is more than an intuition - it's a knowable entity. We should be able to *prove* that declarative computation is more knowable and repeatable, and indeed we can. Here's the process:

> "Given any statement in the declarative model, partition the free variable identifiers in the statement into inputs and outputs. Then, given any binding of the input identifiers to partial values and the output variables to unbound variables, executing the statement will give one of three results: some binding of the output variables, suspension, or an exception."

Let's try to apply that process to the following statement:

```
if X>Y then Z=X else Z=Y end
```

This statement can be shown to be declarative by considering the input identifiers `X` and `Y` and the output identifier `Z`. If the input identifiers are bound to any partial values, two possibilities exist: the statement will either block or bind `Z` to a value. Since both of those possibilities are subsumed by the possibilities mentioned above, this illustrates the mechanism by which a statement can be assigned the property of declarativeness and lends concreteness to the notion that *independent,* *stateless,* *deterministic* computation is declarative.

In case you're confused about why it is taken for granted that the statement will block if no binding is made, the technical reason lies in the specification of the kernel language's *single assignment store*. <a href="http://michaelrbernste.in/2013/06/17/declarative-computation-and-the-abstract-machine.html">I covered this mechanism a little bit in this post</a>, but to make it explicit, the semantics of variables in this store are such that:

* Single assignment variables can only be bound once
* If single assignment variables are needed in a computation before they are bound, the computation will block until an assignment is made

The strict scoping rules of the declarative language also come heavily into play here in allowing units of declarative code to be composed in a way which leverages their referential transparency. Since calculating with environments in declarative code has been shown to be extremely straightforward, and it has so many benefits, the natural question arises - when is it not applicable?

#### The Realm Of The Nondeclarative

What kinds of problems cannot be solved declaratively? It is instructive to look above at the list of qualities which declarative code must have, because if you need any of these qualities to disappear, you know you must sacrifice at least some declarativeness. As the authors state in section **4.7.4** with the somewhat heavy name **The Real World,**

> "The real world is not declarative. It has both state (entities have an internal memory) and concurrency (entities evolve independently)."

The classic examples offered include client server applications and video display applications. The inability to easily maintain state in the declarative model available at this point in the book shows that solving these problems in a purely declarative way just isn't realistic. Instead of attempting to pull code from the middle of something more complex, I'll use an example from the book to illustrate a typical challenge posed by purely declarative code. 

#### Example: Code Instrumentation

Consider a defined component in the kernel language to which a developer would like to add *instrumentation,* or a means of measuring aspects of program execution. Given a reusable component `SC`:

{% highlight ruby %}
fun {SC ...}
  proc {P1 ...}
    ...
  end
  proc {P2 ...}
    ...
    {P1 ...}
    {P2 ...}
  end
  proc {P3 ...}
    ...
    {P2 ...}
    {P3 ...}
  end
in
 `export`(p1:P1 p2:P2 p3:P3)
end
{% endhighlight %}

We can see that `SC` encapsulates three operations, `P1`, `P2`, and `P3`, and that the procedures call each other and themselves. Because this code is declarative, it can be used elsewhere in an understandable way, but in order to protect this quality, we sacrifice expressiveness. Demonstrably, in order to do something as simple as add an accumulator to this component for instrumentation purposes, we must add two arguments to each procedure: this means that we must change three procedure definitions and four procedure calls. Here's what the altered code looks like:


{% highlight ruby %}
fun {SC ...}
  proc {P1 ... S1 ?Sn}
    Sn=S1+1
    ...
  end
  proc {P2 ... T1 ?Tn}
    ...
    {P1 ... T1 T2}
    {P2 ... T2 Tn}
  end
  proc {P3 ... U1 ?Un}
    ...
    {P2 ... U1 U2}
    {P3 ... U2 Un}
  end 
in
  `export`(p1:P1 p2:P2 p3:P3)
end
{% endhighlight %}

In a stateful language, the same could be achieved by changing no procedure signatures. Incrementing would be done at the call site, and a variable would be made available globally upon program instantiation. Consider a bit of Ruby code:

{% highlight ruby %}
module Work
  def part_one
    ...
  end

  def part_two
    ...
    part_one(...)
    part_two(...)
  end

  def part_three
    ...
    part_two(...)
    part_three(...)
  end
end
{% endhighlight %}

And the instrumented version:

{% highlight ruby %}
module Work
  @@counter = 0

  def part_one
    @@counter += 1
    ...
  end

  def part_two
    ...
    part_one(...)
    part_two(...)
  end

  def part_three
    ...
    part_two(...)
    part_three(...)
  end
end
{% endhighlight %}

No method signatures change, and significantly, the only places you see change are where you'd expect them.

#### Example: SQL Queries

Professional developers who write applications which interact with traditional databases are familiar with the pattern of embedding declarative nuggets in the screaming abyss of their imperative Java, Ruby, Python, or PHP code. SQL is the "what" without the "how" and has a way of being understandable on its own without needing to understand its surrounding context. Queries which select certain fields from certain rows in a certain way will always do just that.

There is an interesting correspondence between how queries embedded in application code crystallize and come to *represent the data they retrieve* and the referential transparency of mathematical functions. Other tokens in stateful Object Oriented languages, for example are not nearly as reliable. So much more context is necessary to decipher even highly localized pieces of code in what have become the standard for modern Object Oriented applications, particularly in web platforms. Declarativeness is a tool that can be reached for more, a point which the authors drive home quite heavily at the end of Chapter 4.

#### Example: Haskell

One of the more interesting aspects of Chapters 3 and 4 is the extended treatment of the Haskell programming language. According to the authors,

> "Haskell is perhaps the most successful attempt to define a practical, completely declarative language."

The introduction to the language at this point in the book is very interesting, because it serves as a contrast to the available declarative kernel, and illustrates deep connections between Haskell's design and the goals of declarative computation. By showing how compact and powerful Haskell code is, the authors provide another alternative for developers "stuck" in the imperative world - look for services or pieces of your data flow which can be replaced by something declarative - you'll be happy you put in the effort. I also found it fascinating as someone who came to CTM with an understanding of what *functional* meant, but not a very solid understanding of what it means to be *declarative.* Pure functional programming is a specific case of Declarative programming, a fact that has far reaching implications and is precisely the kind of insight that has gotten me so hooked on this book.

#### Conclusions

Declarativeness is a property of code which subsumes what professional developers typically refer to as *functional* and *purely functional* code. While real world applications don't allow us to solely rely on declarative code to solve all of our problems, we can embrace its positive qualities and learn to overcome its shortcomings by following two basic approaches: embedding and extending. As we have shown, we can embed declarative code within our imperative codebases if we are sure to protect the boundaries between the two.

Extending the declarative model to include properties for concurrency, for example, can help make declarative code more realistic for application in real world programs. Declarative concurrency is a fascinating subject which has a deep history, and in covering it with the next post, will pause our in depth study of the declarative paradigm as we move on to Message Passing Concurrency in Chapter 5.

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

*All quotes from:*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

