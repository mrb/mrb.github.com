---
layout: post
title: "Why We Need Explicit State"
published: true
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Why We Need Explicit State

The fact that the authors of *Concepts, Techniques, and Models of Computer Programming* wait until page 405 (about halfway through the book) to introduce the concept and implementation of *explicit state* is a joke that tells itself. Many beginning professional programmers and computer science students learn with explicit state up front, even though it is technically more complicated to implement and reasonably more difficult to reason about. Unfortunately, in the long run, the joke is often on these beginners, who struggle in a sea of complexity. Explicit, mutable state is the cause of enough confusion and complexity that entire languages and paradigms are based around the idea of avoiding it.

"Explicit State" is the title of Chapter 6 of Concepts, Techniques, and Models of Computer Programming. Far from a diatribe, the treatment of the subject is subtle in the hands of Van Roy and Haridi who use introducing explicit state as an opportunity to consider the pure world of declarative programming in the harsh realities of the real-world real-world. Like, meat space, for real. You know, that "real world" you hear so much about.

CTM is a book that is distinguished amongst the Computer Science textbooks that preceeded it in a variety of ways. Certain aspects of this radical departure from previous literature at times seems like a direct reaction to certain books in particular, one of them being Abelson and Sussman's epic *The Structure and Interpretation of Computer Programs* (SICP). Interestingly, in holding off on the discussion of state and trying to balance a description of its importance with warnings about its cost, the two books take very similar approaches. I'll cover a bit of SICP's approach as a way of reinforcing some of Van Roy and Haridi's ideas in this post.

During the course of this tour of explicit state, the *stateful model of computation* is introduced, which bears a strong resemblance to the model used in <a href="http://michaelrbernste.in/2013/09/11/message-passing-and-concurrent-program-design.html">Chapter 5's message-passing model</a>. The capabilities of explicit state are explained and used in various contexts, notably various abstract data types are introduced and broken down. Software engineering theory and practice are discussed, and then the necessities of the tasteful use of explicit state (and its accompanying inherent complexity) are thoroughly reviewed.

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

Here we can see a new `Cell` being created and used within the scope of a function. Repeated calls to `SumLis`t in the program will encapsulate the state of the `Cell`, allowing the consumer of the function to worry only about the value, and not the implementation details of the function.

This is the essence of the power available to us, and the reason that almost every practical programming languages is willing to pay the cost of introducing a technique that requires a radical rethinking of the implementation of the mechanics of computation.

One way to think of it is that as we "don't care" about the implementation details of the `SumList` above, we also don't have access to change it in a fundamental way. This tradeoff is something that is very well covered in Abelson and Sussman's treatment of the same topic, so I'm going to take an opportunity to indulge a tangent in that direction.

#### The SICP Perspective

SICP is a book which is primarily concerned with teaching functional programming through the use of the Scheme programming language. Similarly to CTM, it spends a lot of time explicating the mechanics of computation, but through the lens of one paradigm, and primarily from a mathematical perspective. Up until the point in the book where state is introduced, one mechanic (the substitution model) had been used to compute programs. The authors of SICP are quick to praise the transparency and simplicity of the subsitution model, and once state is introduced, they wax poetic about its loss. The following quote is from a lecture series the authors gave using SICP as a textbook. After demonstrating how encapsulated explicit state can behave as the function above does, Sussman relates that:

> "And what we see is the same expression leads to two different answers, depending upon time. So demo is not a function, does not compute a mathematical function. In fact, you could also see why now, of course, this is the first place where the substitution model isn't going to work. This kills the substitution model dead."<a href="#bib3">[3]</a>

The Scheme code for a similar comparison is shown here for comparison. Her

{% highlight scheme %}
(define (factorial n)
  (define (iter product counter)
    (if (> counter n)
        product
        (iter (* counter product)
              (+ counter 1))))
  (iter 1 1))
{% endhighlight %}

Instead of passing arguments in the internal iterative loop, we could adopt a more imperative style by using explicit assignment to update the values of the variables product and counter:

{% highlight scheme %}
(define (factorial n)
  (let ((product 1)
        (counter 1))
    (define (iter)
      (if (> counter n)
          product
          (begin (set! product (* counter product))
                 (set! counter (+ counter 1))
                 (iter))))
    (iter)))
{% endhighlight %}

And for fun, a gratuitous shot of Sussman dressed up as a Mystic from the video series, a little bit later on after he demonstrates the metacircular interpreter:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/sussman.jpg" width="480px">
<div class="lead">The Mystic: Gerald Sussman<a href="#bib2">[2]</a></div>
</center>

#### Abstract Data Types

As demonstrated by Abelson and Sussman's explanation added complexity of the language and computational model provide many of the advantages Descriptions of the capabilities of Abstract Data Types (ADTs)

> "Now that we have added explicit state to the model, we can present a more complete set of techniques for doing data abstraction."

Stateful collections

*Tuples*  

*Records*

*Arrays*

*Dictionaries*

Although a lot of what we need out of ADTs "can be done with higher-order programming alone"

#### State And System Building

After several chapters discussing the nuance of declarative programming, it is refreshing to see the authors embrace the reality of real-world program and discuss the inherent flaws in the declarative model. After discussing the principle of abstraction, the section *Systems that grow* contains the following nugget of wisdom:

> "Declarative programming is like an organism that keeps all its knowledge outside of itself, in its environment...We conclude that the principle of abstraction is not well supported by declarative programming, because we cannot put new knowledge inside a component."

#### The real world is parallel / The real world is distributed

"Limitations of stateful programming"

> "In view of this, it is ironic that introductory programming is most often taught in a highly imperative style. This may be a vestige of a belief, common throughout the 1960s and 1970s, that programs that call procedures must inherently be less efficient than programs that perform assignments. (Steele 1977<a href="#bib4">[4]</a> debunks this argument.)"<a href="#bib5">[5]</a>


*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

<a id="bib2">[2]</a> Abelson, Harold and Sussman, Gerald Jay. *Structure and Interpretation of Computer Programs Lecture Series 5A: Assignment, State, and Side-effects* <a href="http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-001-structure-and-interpretation-of-computer-programs-spring-2005/video-lectures/5a-assignment-state-and-side-effects/">Available online here</a>

<a id="bib3">[3]</a> Eric Grimson, Peter Szolovits, and Trevor Darrell, 6.001 Structure and Interpretation of Computer Programs, Spring 2005. (Massachusetts Institute of Technology: MIT OpenCourseWare). http://ocw.mit.edu (accessed 12 02, 2013. License: Creative Commons Attribution-Noncommercial-Share Alike. <a href="http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-001-structure-and-interpretation-of-computer-programs-spring-2005/video-lectures/5a-assignment-state-and-side-effects/lec5a_512kb.pdf">PDF Of Lecture Transcript</a>

<a id="bib4">[4]</a> Steele, Guy. *Debunking the 'Expensive Procedure Call' Myth, or, Procedure Call Implementations Considered Harmful, or, Lambda: The Ultimate GOTO* MIT AI Memo #443 <a href="http://repository.readscheme.org/ftp/papers/ai-lab-pubs/AIM-443.pdf">PDF available here</a>

<a id="bib5">[5]</a> Abelson, Harold and Sussman, Gerald Jay. *Structure and Interpretation of Computer Programs, second edition.* MIT Press, 1996. <a href="http://mitpress.mit.edu/sicp/">Available online here</a>.
