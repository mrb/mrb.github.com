---
layout: post
title: "Concurrency Made Simple"
published: false
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Concurrency Made Simple

Chapters 3 and 4 of Concepts, Techniques, and Models of Computer Programming (CTM) cover the definition of declarativeness and its application in concurrent programing. <a href="http://michaelrbernste.in/2013/06/20/what-is-declarative-programming.html">We saw in the last post</a>, which mostly covered Chapter 3, that one of the limitations of the declarative paradigm is its inability to deal with the "real world."<a href="#bib3">[3]</a> Declarative programming is *pure*, but not always *realistic.* The "real world" includes concurrency, the basic definition of which is "A set of activities that execute independently." In other words, in the real world, things operate both in tandem with and independently from each other. Not everything can be neatly partitioned as declarative programming can sometimes require. Dealing with concurrency in programs is notoriously challenging, but not by necessity. The authors have developed a simple mantra:

> "Concurrency can be simple."

They demonstrate the basic means by which a program can be made concurrent as follows. Consider this simple program in the declarative kernel language:

{% highlight ruby %}
fun {Gen L H} 
	{Delay 100} 
	if L>H then nil else L|{Gen L+1 H} end
endXs={Gen 1 10} 
Ys={Map Xs fun {$ X} X*X end}
{Browse Ys}
{% endhighlight %}

A function `Gen` takes two variables `L` and `H`. It waits 100 miliseconds. It terminates if `L` is greater than `H`, else it recurs on a constructed list with `L` as the head and a new list beginning with `L+1` as the tail. When run with `{Gen 1 10}`, it would return a list `[1 2 3 4 5 6 7 8 9 10]` Below the function definition, the `1..10` list is bound to `Xs`, and `Ys` is bound to the results of mapping over the elements of `Xs` and squaring them. The results of the list are then shown with `Browse`.

The concurrent or threaded version uses the same definition for Gen, and only adds the `thread` keyword:
{% highlight ruby %}thread Xs={Gen 1 10} endthread Ys={Map Xs fun {$ X} X*X end}
{Browse Ys}
{% endhighlight %}

The result is that the results are *incrementally* displayed in `Browse` as they are calculated. The reason to put a `Delay` call in `Gen` is to illustrate the point that *concurrency has the effect of making 'atomic' calculations 'incremental'*. Note that nothing about the program needed to change in order to make it concurrent - this is the dream of concurrent programming.

This post will cover the parts of Chapter 4 which define concurrency and its application to declarative programming. We will see the semantics of threads in the extended kernel language, get a glimpse at programming with streams, and I will attempto to tie the lessons of declarative concurrency to the curent state of programming tools. I'm not covering everything in this chapter by a long shot - it is very dense. I'm intentionally not covering error handling or exceptions, which might rankle some, especially in the context of streams. If you want to know more about this, I suggest that you read the chapter: the authors have some good answers for you. Our next post will finish out Chapter 4 by taking a look at Declarative concurrency and its interaction with a fascinating language construct known as *laziness*.

#### What is Concurrency?

Declarativeness is shown to be a surprisingly rich and capable paradigm which can be applied in a variety of circumstances if the developer is aware of the involved tradeoffs. The declarative kernel language is small and flexible enough that adding the ability to execute code concurrently ends up being simple, at least from a programming language design standpoint.

> "Our approach to concurrency is a simple extension to the declarative model that allows more than one executing statement to reference the store."

A new instruction, `thread`, is added to the existing kernel, which gives us the following language:

<center><img src="https://dl.dropboxusercontent.com/u/1401061/declarativeconcurrency.png">
<div class="lead">The entire data-driven concurrent kernal language, including the new thread instruction. <a href="#bib3">[3]</a></div></center>

The ability for the kernel language to express concurrent programs means that under the right conditions, things can be happening at the same time. The authors do an excellent job of describing what "at the same time" really means, and it's worth going through the terminology so that we can thoroughly understand the implications of declarative concurrency.

It is said that all operations in a program have a **gloabal sequence** and that threads do an **interleaving execution** over this sequence. A **scheduler** is responsible for choosing work for threads. Concurrency in the kernel language relies on the existence of **single assignment** or **dataflow variables**, the properties of which provide both immutability guarantees and a coordination point for external computation with respect to their **bound/unbound state**.

An execution is **nondeterministic** if the choice of which thread to execute becomes visible to the programmer. In the concurrent declarative kernel language, *nondeterminism is never visible.*  Simply put, this lack of visible nondeterminism can be attributed to the fact that there is simply no choice but to wait if a variable is not yet bound. There is no chance that two threads will write to the same variable, since variables can only be assigned a value once. Therefore all "reads" will be deterministic and at worse you cannot predict exactly when "writes" will happen.

The **scheduler** which runs the concurrent kernel language is assumed to **fairly** select threads to do work, and never lets any thread **starve**. Threads can be either be **ready** or **suspended**, depending on if they have work to do, or are waiting on other calculations to be complete before their work can proceed. Let's take a closer look at how threads integrate into the semantics of the kernel language and how it executes in our abstract machine.

#### The Semantics of Threads
####  &nbsp;
<div class="lead">This section builds on the abstract machine <a href="http://michaelrbernste.in/2013/06/17/declarative-computation-and-the-abstract-machine.html">discussed in this earlier post in the series</a>.</div>

Adding threads to the existing declarative kernel language is a matter of adding a `thread` operation. This operation extends the abstract machine by allowing multiple semantic stacks to have access to the same data store. 

Intuitively, the difference between a sequential and a concurrent program is reflected in how we introduce concurrency into the abstract machine: before, one total order was possible because only one environment was executed. After, a causal order is guaranteed by the scheduling algorithm and the existence of multiple stacks, each represented by a thread.

We still have the concepts of a **single assignment store ($\sigma$)**, an **environment ($E$)**, a **semantic statement ($< S >, E$)**, and a semantic stack ($ST$). We extend the concept of an **execution state** and and **computation** to allow for multiple semantic stacks. An execution state becomes a pair ($MST,\sigma$) where MST is a multiset (which we can think of as a list for our purposes) of semantic stacks and $\sigma$ is the single assignment store. A computation becomes a sequence of execution states which starts at the beginning of the list of semantic stacks, and ends at its end. The choice of which semantic stack to evaluate is up to the scheduler.

Consider the following small sample concurrent program:

{% highlight ruby %}
local B in	thread B=true end	if B then {Browse yes} endend{% endhighlight %}
This program only has one place to begin, on the first line. `B` is introduced into an environment in a semantic stack and then the next line is reached. `thread` never blocks, but peels off the work into its own semantic stack to be executed at the scheduler's convenience. The next line is reached. If `B` has been bound by the work done in the computation in the previous step, then this line will display `yes` and the program will be complete. There are no circumstances under which this program would behave in any other way under the given semantics.

#### What is Declarative Concurrency?

It has been shown that the "threadless" programs in the preceeding chapters are declarative, and we have defined what concurrency means. So what does it mean for a program to be both declarative and concurrent? We know that the basis of declarativeness is that the output of a program should be a mathematical function of its input. Two issues arise with concurrent programming, however - termination is not guaranteed thus output is difficult to measure, and definition as *functional* is challenging, because programs inputs and outputs can both contain unbound variables. Simply put, we can think of declarative concurrency as *concurrency with no observable nondeterminism,* but lets spend some time with the technical definition:

> "A concurrent program is declarative if the following holds for all possible inputs. All executions with a given set of inputs have one of two results: (1) they all do not terminate or (2) they all eventually reach partial termination and give results that are logically equivalent.""

For programs which do not terminate, we don't need to illustrate much -- they just won't terminate.

What does **partial termination** mean? Since we cannot rely on **total termination** in a programming paradigm with streams that can grow indefinitely, we can rely on a partial termination, defined as a stopping point when calculations are temporarily exhausted. Consider the following program:

{% highlight ruby %}
fun {Double Xs}
	case Xs of X|Xr then 2*X|{Double Xr} end
end

Ys = {Double Xs}
{% endhighlight %}

This program will run as long as there are values in `Xs` to be processed. If there are none, the program will simply be in a state of partial termination. How can we assert the **logical equivalence** of the results of a program such as this?



#### Programming With Streams

Streams are given extensive treatment by the authors in Chapter 4 and are referred to as one of the most convenient and reasonable ways to program with declarative concurrency. A special case of stream programming is covered, known as *deterministic stream programming*, where "each stream object always knows for each input where the next message will come from." This is a declarative means of stream programming - non-deterministic stream programming is covered in Chapter 5, *Message-Passing Concurrency.* Though this sounds limiting, some very interesting examples are covered.

The concept behind streams are that they are convenient ways to declaratively express computation as communication between threads. The authors description, as usual, is compact and thorough:

> "A stream is a potentially unbounded list of messages, i.e., it is a list whose tail is an unbound dataflow variable. Sending a message is done by extending the stream by one element: bind the tail to a list pair containing the message and a new unbound tail. Receiving a message is reading a stream element."

Streams and dataflow variables have a natural affinity and the authors capitalize on this insight. They give a nice definition and demonstration of basic use of streams, and begin to explore patterns useful in stream programming, even using streams to perform digital logic simulations.

Declaring a stream looks like this:

{% highlight ruby %}
declare Xs Xs2 in
Xs = 0|1|2|3|Xs2
{% endhighlight %}

Here is how you incrementally extend a stream:

{% highlight ruby %}
declare Xs3 in
X2 = 0|1|2|3|Xs3
{% endhighlight %}

And a program that combines these concepts to form a **Basic producer/consumer** pattern:

{% highlight ruby %}
fun {Generate N Limit}
	if N<Limit then		N|{Generate N+1 Limit} 
	else nil endendfun {Sum Xs A}	case Xs	of X|Xr then {Sum Xr A+X}
	[] nil then Aendendlocal Xs S in	# Producer thread	thread Xs={Generate 0 150000} end 	# Consumer thread
	thread S={Sum Xs 0} end 
	# Display results				  
	{Browse S}end
{% endhighlight %}

Producer and consumer each run in their own threads, operating on the shared dataflow variable `Xs`. As data is appended to the stream by `Generate`, it is consumed by `Sum`.  The `case` statement in `Sum` blocks when there are no available values to bind, and calculates values when they are there to be read. As the authors say, "Waiting for a dataflow variable to be bound is the basic mechanism for synchronization and communication in the declarative concurrent model."

You can use this same basic program to have multiple consumers and producers, or create a *pipleline* of filters:

{% highlight ruby %}
local Xs Ys S in
	thread Xs={Generate 0 15000} end
	thread Ys={Filter Xs IsOdd} end
	thread S={Sum Ys 0 } end
	{Browse S}
end
{% endhighlight %}

And when streams are generalized to "a recursive procedure that executes in its own thread and communicates with other stream objects through input and output streams," things really start to get wild: simple declarative concurrency primitives when combined can produce powerful results.

#### Conclusion

Concurrency and its application in modern software design is of paramount importance as our "free lunch" has long been over but we struggle in denial against its reality, often wielding primitive, wasteful tools.<a href="#bib2">[2]</a> Our tools rely on syntactic and semantic constructions which force us to amortize the costs of writing our programs over a very long period of time - they are easy to create, but difficult to maintain. Some of these constructions include (faux, overloaded) Object Orientation, global state, and mutability.

*Mutability* refers to the ability of the programmer to change the value of an *object* after it has been instantiated (*object* is an abstract name given to any assignable quantity that developers have access to). Much discussion has been raised specifically surrounding the connection between mutability and the inability for our tools to properly handle concurrency in a reasonable way, and in fact we are making progress.<a id="bib1">[1]</a> Several active programming languages, including the Mozart platform that the CTM book constructs, Clojure, which runs on the Java Virtual Machine, and Haskell all have embraced the value of immutability and the leverage it gives programming language designers in providing *simple concurrency*. 

This point has particular impact for me because <a href="http://michaelrbernste.in/2013/02/23/notes-on-teaching-with-the-kernel-language-approach.html">after writing about a related article by the same authors</a>,  *Teaching Programming with the Kernel Language Approach*, I keep coming back to a simple idea that they present. Beginning professional developers who jump right in to programming with mutable, global state, objects, and concurrency rightfully believe that "concurrency in Java is Hard." Unfortunately, many people extend that to "programming with concurrency is Hard." They don't seek other paradigms because they think that the complexity is necessary. They think it is capital-H Hard and the truth is that it doesn't have to be, asl long as you're willing to give up some of the expressiveness proffered by the constructs above.


#### Works Cited

*All quotes from unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Hickey, Rich. *Index of Published Talks* <a href="http://www.infoq.com/author/Rich-Hickey">HTML Page</a>

<a id="bib1">[2]</a> Sutter, Herb. *A Fundamental Turn Toward Concurrency in Software* Dr. Dobbs Software Journal. <a href="http://www.drdobbs.com/article/print?articleId=184405990&siteSectionName=web-development/">Available here.</a>

<a id="bib2">[3]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004
