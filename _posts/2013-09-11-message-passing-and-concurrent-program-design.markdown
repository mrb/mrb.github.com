---
layout: post
title: "Message-Passing and Concurrent Program Design"
published: true
ctm: true
---
# 

<div class="lead">This post is part of a series exploring <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models of Computer Programming</a> by Van Roy and Haridi. Check the <a href="/">blog index</a> for more.</div>

# 
### Message-Passing and Concurrent Program Design

After a thorough discussion of the semantics and application of <a href="http://michaelrbernste.in/2013/07/01/concurrency-made-simple.html">declarative concurrency</a> in chapter 4, Van Roy and Haridi turn their attention to an alternative design solution for the same challenging problem space. Chapter 5, "Message-Passing Concurrency" covers the necessary changes to the kernel language to make this kind of programming possible, discusses the design of programs using this paradigm, and takes a brief aside to look at the Erlang language and its OTP framework.

Beyond covering the technical aspects of concurrency, the authors also emphasize the application of these concurrency primitives as design solutions for particular kinds of problems. Concurrent program design, reasoning, and proofs are given a fair amount of treatment, and attention is paid to the realism of applying the ideas as they are presented in the book. The authors advise programmers to keep programs simple, to isolate non-declarative components, and to model all possible states in advance of writing code.

#### Message Passing and Observable Nondeterminism

The concept of studying computation as the passing of messages between independent agents was first explored by Carl Hewitt in his work on the Actor Model.  Primarily concerned with modeling computation for the purposes of exploring Artificial Intelligence, Hewitt realized early on that concurrency was an inevitable area of interest for Computer Science, and the Actor model and his work on Planner were revolutionary in their explorations towards these ends. <a href="#bib2">[2]</a> Van Roy and Haridi introduce message-passing concurrency in part to address limitations in the semantics of the declarative concurrency model presented in chapter 4, which enables concurrent stream programming but does not allow for any observable nondeterminism. Consumers of stream data must know where the next messages will come from, making many-to-one or many-to-many communication impossible in any practical sense.

In the message-passing paradigm, however, programming with streams loses its declarative properties because it allows *observable nondeterminism*. In practical terms this means that since the *name* of a stream can escape the local scope and be accessed by other parts of the computation concurrently, we can no longer rely on the soundness of our computation with respect to knowing its outcomes. Declarativeness is the assurance that computation meaningful to the environment is localized to the extent that you simply *cannot* be surprised by the outcome. Ports are asynchronous and give streams a name that can be embedded in a data structure, passed around between scopes, and written to or read from freely. This is contrary to the kinds of programs we have seen up until this point, which have ardently adhered to the strictness (and resultant sacrifices in clarity and expressiveness) of declarative programming. It is both a welcome relief and a terrifying prospect to gaze into the abyss of state and nondeterminism.

#### Extending The Kernel Language with Ports

The transition from declarative concurrency to message-passing concurrency is small but powerful. To keep the magnitude of these changes in perspective, I find it instructive to take a look at the language specification, which as usual fits in a neat little box:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/message_passing_kernel.png">
<div class="lead">The Message-Passing Concurrency Kernel Language<a href="#bib1">[1]</a></div>
</center>

As succinct as that language looks, we know that Van Roy and Haridi are always good for a pithy quote. Here is how they sum up the changes:

> "The message-passing concurrent model extends the declarative concurrent model by adding just one new concept, an asynchronous communication channel."

The asynchronous communication channel is implemented as an abstract data type which combines a FIFO (first-in, first-out) queue called a *Port* and two operations: `NewPort` and `Send`. A fundamental implementation detail of ports is that they rely on streams to exchange information, giving them a name and allowing other parts of the computation to write to and read from them. Here are more complete definitions of the two new operations:

* `{NewPort ?S ?P}` creates a new port with **entry point** `P` and **stream** `S`.
* `{Send P X}` appends `X` to the stream corresponding to the entry point `P`.

These operations are integrated into the execution state by extending the abstract machine definition inherited from the previous chapters with a Mutable Store μ. That makes the execution state `(MST, σ, μ)` where **MST** is the multiset of semantic stacks, **σ** is the single assignment store, and **μ** is the mutable store (this <a href="http://michaelrbernste.in/2013/06/17/declarative-computation-and-the-abstract-machine.html">earlier post in the series</a> contains an overview of computing with the abstract machine). To illustrate the layout of the concurrent model, the authors provide an excellent illustration:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/message_passing_diagram.png">
<div class="lead">The Message-Passing Concurrent Model, Diagrammatically<a href="#bib1">[1]</a></div>
</center>

This diagram is useful for understanding what role the mutable store plays in the execution state, and what happens when a `NewPort` operation is executed. The two bubbles at the top of the diagram contain program fragments that represent threads of execution. This code is interpreted and the data is combined with the two semantically distinct data stores to create an environment. The **immutable store σ**, well covered in other posts (and also known as the "single-assignment store"), contains most of the data in the environment, while the newly introduced **mutable store μ** contains pairs of the form `x:y` to represent Ports, where `x` and `y` are variables of the single assignment store. The visual separation between the two stores in the diagram is telling with respect to the isolation of the nondeclarative components of the message-passing concurrency model. The combination of the immutable and mutable stores provides a neat, contained mechanism for defining ports.

A line of code containing a `{NewPort ?S p1}` call can be reduced to the semantic statement `({NewPort <x> <y>}, E)`, which does the following:

* Creates a fresh port with identifier or "entry point" *p1*
* Binds `E(<y>)` and *p1* in the immutable store σ
* If binding succeeds, adds `E(<y>):E(<x>)` to the mutable store μ
* Raises an error condition if binding fails

The noteworthy aspect of this computational model is how the mutable store *isolates* the mutability, thus allowing for further isolation of the nondeclarative properties of message-passing. The mutable store binds the name or "entry point" `p1` to the unbound tail element of the stream `?S`, so that other threads of execution may safely read from the tail of the stream in a read-only manner. In order to add elements to the stream, the `Send` operation is used.

A send operation `{Send p1 1}` can be semantically reduced to `({Send <x> <y>}, E)`, which does the following:

* If the activation condition is true `(E(<x>)` is determined, or has a binding):
	* If `(E(<x>)` is not bound to the name of a port, raise an error condition
	* If the mutable store contains `E(<x>):z`, then do the following:
		* Create a new variable `z'` in the immutable store σ
		* Update the mutable store μ to be `E(<x>):z'`
		* Create a new list pair `E(<y>)|z'` and bind `z` with it in the store.
* If the activation condition is false, suspend execution

*Note that changes have to be made to the memory manager to redefine reachability in light of changes to the abstract machine. These changes are simple and are covered in the chapter.*

Between `NewPort` and `Send`, programmers using the message-passing concurrent model have the ability to model a wide range of applications. As is the case with most primitives introduced to the kernel language, there is some nice syntactic sugar we can apply to make the creation and manipulation of ports simpler.

#### From Ports to Port Objects

The authors introduce a new data type called a **port object**, which combines one or more ports and a stream object. Port objects are superior to stream objects in a variety of ways, but the focus in this section is on the means by which they allow for more complex communication and encapsulate state transitions. Streams are limited to communicating with the thread that extended them; semantically this means that streams must always "know where their next message is coming from." Port objects as they are known in the kernel language are known by other names elsewhere - Erlang's **processes** are similar, though they are extended and allow for more sophisticated handling of messages. The authors build up to a sophisticated abstraction with an example program, starting with the existing abstractions, adding a trivial example with the new abstractions, and then showing everything in action.

Here is what a port object built from the existing abstractions might look like:

{% highlight bash %}
declare P in
local S in
	{NewPort S P}
	thread for M in S do {Browse M} end end
end
{% endhighlight %}

The port object `P` can called in the form `{Send P hi}`, which will eventually display `hi` in the Browse window. With the `NewPortObject` abstraction, however, it can be easier and more flexible to program with port objects.

Two port object functions are introduced in this chapter: `NewPortObject` and `NewPortObject2`. `NewPortObject` is used to encapsulate state transitions, and `NewPortObject2` simply executes a given `proc` when a message is received.

`NewPortObject` is called in the form `{NewPortObject Init Fun}`. `Init` is an initial state and `Fun` is the state transition function. The state transition function is of the type `<fun {$ TS TM} : TS>` where `TS` is the state type and `TM` is the message type. We are going to focus on port objects that have no internal state, however, because they are considerably simpler.

`NewPortObject2` is a function that allows the user to specify a `Proc` to be executed each time a message is received, thus maintaining no internal state: 

{% highlight bash %}
fun {NewPortObject2 Proc}
Sin in
	thread for Msg in Sin do {Proc Msg} end end
	{NewPort Sin}
end
{% endhighlight %}

Here is some simple client-server code that the authors use to illustrate **Remote Method Invocation** using `NewPortObject2`. First, the server, which will accept messages from remote clients, perform a polynomial computation (the `proc` passed in to `NewPortObject2`) based on the message received, and then bind the result to a dataflow variable passed in by the client. 

*Note that the `of calc(X Y) then` and `of work(Y) then` syntax below is the notation for matching incoming messages based on a pattern.*

{% highlight bash %}
proc {ServerProc Msg}
	case Msg
	of calc(X Y) then
		Y=X*X+2.0+X*2.0
	end
end
Server={NewPortObject2 ServerProc}
{% endhighlight %}

`Server` is now available for other parts of the program to access, and the nice syntactic sugar added makes for some pretty neat separation of server and client code. 

{% highlight bash %}
proc {ClientProc Msg}
	case Msg
	of work(Y) then Y1 Y2 in
		{Send Server calc(10.0 Y1)}
		{Wait Y1}
		{Send Server calc(20.0 Y2)}
		{Wait Y2}
		Y=Y1+Y2
	end
end
Client={NewPortObject2 ClientProc}
local X in {Send Client work(X)} {Browse X} end
{% endhighlight %}

This allows for us to guarantee that calls are executed sequentially by the server, thus simplifying a lot of the reasoning typically necessary in a complex data interchange situation.

While powerful, the stateless port objects are somewhat limited, and the stateful port objects discussed in Chapter 5 allow for very flexible expressions of complex concurrent programs where `NewPortObject` is used to define distributed state machines. The `NewPortObject` examples are complex and challenging to cover in a blog post, so I recommend seeking out the chapter to see these in action. 

#### Using Message-Passing Primitives Directly

Port objects are one way to program concurrently using the message-passing model in the kernel language, but it is also possible to combine threads and ports to create useful abstractions like this concurrent queue:

{% highlight bash %}
fun {NewQueue}
	Given GivePort={NewPort Given}
	Taken TakePort={NewPort Taken}
	proc {Match Xs Ys}
		case Xs | Ys
		of (X|Xr) | (Y|Yr) then
			X=T {Match Xr Yr}
		[] nil | nil then skip
		end
	end
in
	thread {Match Given Taken} end
	queue(put:proc {$ X} {Send GivePort X} end
		    get:proc {$ X} {Send TakePort X} end)
end
{% endhighlight %}

The `put` and `get` operations on this Queue allow for concurrent access, and even further, can do cool things because they can take advantage of dataflow variables:

{% highlight bash %}
declare Q X in
thread Q={NewQueue} end
{Q.put 1}
{Q.get X}
{Wait X}
end
{% endhighlight %}

The above code instantiates a Queue, puts `1` on it, and then runs a `get` with an unbound variable. Because there is a value to consume on this queue, the 'Wait' will proceed and the call will end. You can similarly run a `put` onto the Queue before the value is bound, allowing your code to synchronize access in a variety of ways.

#### Concurrent Program Design

In addition to providing an exhausting quantity of abstractions and ideas for concurrent programming with message-passing, the authors provide guidelines and wisdom about concurrent program design. Because CTM is a textbook that is aimed at communicating a deep philosophy, the authors know that presenting a well-rounded and practical view to their readers will be persuasive, and in this case they do an admirable job.

> "Designing a concurrent program is more difficult than designing a sequential program, because there are usually many more potential interactions between the different parts. To have confidence that the concurrent program is **correct**, we need to follow a sequence of unambiguous design rules."

The word **correct** above (emphasis mine) refers to <a href="http://en.wikipedia.org/wiki/Correctness_(computer_science)">this type of correctness</a>, and shows a side of reasoning about computer programs that is underrepresented in much modern programming language literature. The authors' pursuit of declarativeness, for example, is toward the end of creating programs which are simpler, thus easier to reason about.

Beginning with a specification and ending with a period of testing and iteration, the methods that the authors advocate might not be revolutionary, but its simplicity and practicality is noteworthy. Here are the steps suggested:

Create an **informal specification** which serves to communicate what the system should do, at varying levels of granularity for various purposes.

Enumerate all forms of concurrent activity in a specification, and label each one as a **component**. These components can be connected and turned into a diagram to understand the flow of data in the specification.

Once components are in place, **message protocols** are required to nail down the implementation of what data will be exchanged and what form the data will take. Augment diagrams with message protocol information.

For each component, create a **state diagram** which describes for each state how the component will react to incoming messages. This should be handled with extreme care.

Finally, the authors sugges to **implement** the program in your "favorite programming language," and to **test and iterate** until the program meets the specification.

There is a demonstration of this method for a design problem given in the chapter, and although the problem itself is fairly simple, it is illustrative in how detail oriented and correctness-obsessed the solution needs to be to truly implement the specification.

#### A Look at Erlang and OTP

Perhaps unsurprisingly given the subject of this chapter, the authors seem to find an affinity in the existing software surrounding <a href="http://www.erlang.org/">Erlang</a> and its <a href="http://learnyousomeerlang.com/what-is-otp">OTP framework</a>. The Erlang equivalent of the book's `Thread` is an Erlang process, which is created with a port object and a mailbox to form a very powerful and flexible unit of concurrent execution. I won't dive too deeply into the chapter's treatment of Erlang and OTP, but like the examination of Haskell earlier in the book, I find an important link between the ideas the authors present and the concrete implementation of Erlang.

The computation model is discussed, and Erlang is characterized as having a "Functional core" with a "Message-passing extension." The term "process independence" is applied to the idea that in Erlang, each running process theoretically has no impact on any other, and nothing is shared between them. According to the authors, "Process independence makes it easier to build highly reliable systems."

Erlang's combination of pattern matching for consuming messages from a process's mailbox, a dedicated location for persistent data and the scheduler to map processes onto system threads provides an excellent framework for the kind of system the authors advocate for. Erlang has declarative properties and favors a functional approach, and there are demonstrations in the text of converting Erlang code to the kernel language that aren't as outrageous as you'd expect.

As far as production-ready systems go, there are a lot of the ideas of the ideal kernel language present in Erlang and the OTP framework. Erlang is known for being highly concurrent and much like the kernel language, it is crucial to understand the impact that the implementation of the units of concurrent execution have on the semantics of the language. The authors present the idea that message-passing is a powerful approach to concurrency and Erlang and its success lends credence to this idea.

My take on it is that as far as all of the options go, if you're looking for a programming language with interesting ideas that you could actually make money using, Erlang is a good choice. Erlang has a good mix of the practical and theoretical, and while there is perhaps a strange beauty to its syntax, there is undoubtedly a ton of elegance in the abstractions it makes available.

#### Conclusions

The expansion from declarative concurrency to message-passing concurrency in the kernel language serve to do far more than illuminate the reader about a *new mechanism* to deal with the challenges of concurrent programs. Rather the chapter gives rare insight into the complexity of concurrent programs at even a small scale. The towers of code and state built from small, mostly declarative units illustrate the interconnectedness of even well thought out programs and the intricacies of timing in a distributed system.

As the limitations of the declarative concurrent system previously presented were extensively discussed in the previous chapters, it is encouraging that the authors are capable of alleviating some of those unappealing aspects by making trade-offs between functionality and expressiveness, declarativeness and statefulness, and so on. Various design solutions and abstractions are introduced that reinforce, to my mind, the importance of the careful consideration of correctness and design in creating flexible, powerful, concurrent software.



#### Works Cited

*All quotes unless otherwise cited from Van Roy and Haridi.*

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, ISBN 0-262-22069-5, March 2004

<a id="bib2">[2]</a> Hewitt, Carl *Viewing Control Structures as Patterns of Passing Messages* Journal of Artificial Intelligence, June 1977
