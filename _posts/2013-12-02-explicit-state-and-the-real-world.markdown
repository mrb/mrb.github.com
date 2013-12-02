---
layout: post
title: "Explicit State and the Real World"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Explicit State and the Real World

The fact that the authors of *Concepts, Techniques, and Models of Computer Programming* wait until page 407 to introduce the concept and implementation of *explicit state* is a joke that tells itself. Explicit, mutable state is the cause of enough confusion and complexity that entire languages and paradigms are based around the idea of avoiding it. But far from a diatribe, the treatment of the subject is subtle in the hands of Van Roy and Haridi who use introducing explicit state as an opportunity to consider the pure world of declarative programming in the harsh realities of the real-world real-world. Like, meat space, for real. You know, that "real world" you hear so much about.

The *stateful model of computation* is introduced, which bears a strong resemblance to the model used in <a href="http://michaelrbernste.in/2013/09/11/message-passing-and-concurrent-program-design.html">Chapter 5's message-passing model</a>. The capabilities of explicit state are explained and used in various contexts, notably various abstract data types are introduced and broken down. Software engineering theory and practice are discussed, and then the necessities of the tasteful use of explicit state are reviewed.

Van Roy and Haridi, like <a href="http://mitpress.mit.edu/sicp/">Abelson and Sussman</a> before them, deem it very important to make it clear how the introduction of impure, non-declarative operations and models allow programmers to model reality, but at a cost that needs to be understood.

#### What is State?

Before explaining the new techniques we have at our disposal, the authors want us to ask ourselves: What is State? Or maybe more specificially, What is *a* state?

> "A state is a sequence of values in time that contains the intermediate results of a desired computation."

The authors explain that there are two types of state - *implicit* or declarative state, and *explicit state*. We have seen implicit state before in the book, such as recursive functions that encapsulate values over time. However, the authors distinguish this type of state as implicit because the consumer of the function in that case is not concerned with the implementation detail as being stateful, it simpley produces the desired computation.

Explicit state, on the other hand, is defined as:

> "An explicit state in a procedure is a state whose lifetime extends over more than one procedure call without being present in the procedure's arguments"

This kind of state wasn't possible in other models that we've seen, and we have been warned repeatedly about the potential for complexity that allowing this semantics can introduce. Still, this type of programming with explicit state is ubiquitous and necessary, so understanding how it works is important.

#### The Stateful Model

The stateful model is a tweak on the declarative model of computation that adds a mutable store alongside the immutable store and the semantic stack that we see in the most basic kernel language implementation:

<center>
<img src="http://michaelrbernste.in/images/explicit_state_computational_model.png">
<div class="lead">The Stateful Model of Computation<a href="#bib1">[1]</a></div>
</center>

Stateful programs in this model are always sequential. The "Semantic Stack" above represents the ordered operations that comprise a program written in the kernel language. The "Immutable Store" is present in all of the kernel languages we have seen so far, and is the main "environment" which preserves the stated relationships between immutable variables and values. New here is the "Mutable store" which allow a new syntactic construct enabling a powerful semantic addition to the language: mutable state. This requires the addition of a minimal number of operations to the kernel language:

<center>
<img src="http://michaelrbernste.in/images/explicit_state_stateful_model.png">
<div class="lead">The Stateful Model Kernel Language<a href="#bib1">[1]</a></div>
</center>

Two convenience methods for manipulating cells can make the language even more expressive, but amount to syntactic sugar for the `Exchange` operation:

<center>
<img src="http://michaelrbernste.in/images/explicit_state_cell_operations.png">
<div class="lead">The Stateful Model Kernel Language: Cell Operations<a href="#bib1">[1]</a></div>
</center>

With this new sematic device (the mutable store), we can create, assign value to, read value from, and swap the values of the contents of mutable *cells.* Here is a simple program that uses these new constructs:

{% highlight bash %}
local
  C ={NewCell 0}
in
  fun {SumList Xs S}
    C:=@C+1
    case Xs
    of nil then S
    [] X|Xr then {SumList Xr X+S}
    end
  end
  fun {SumCount} @C end
end
{% endhighlight %}

#### State And System Building

After several chapters discussing the nuance of declarative programming, it is refreshing to see the authors embrace the reality of real-world program and discuss the inherent flaws in the declarative model. After discussing the principle of abstraction, the section *Systems that grow* contains the following nugget of wisdom:

> "Declarative programming is like an organism that keeps all its knowledge outside of itself, in its environment...We conclude that the principle of abstraction is not well supported by declarative programming, because we cannot put new knowledge inside a component."

#### The real world is parallel / The real world is distributed

"Limitations of stateful programming"

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

*If you like this work, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*
