---
layout: post
title: "Declarative Computation, Syntactic Sugar, and the Abstract Machine"
published: false
ctm: true
---
# 
*This post is part of a series exploring a massive book known as CTM. Check the <a href="/">blog index</a> for the rest.*

The first kernel language that is explored and expanded upon in Van Roy and Haridi's <a href="http://www.info.ucl.ac.be/~pvr/book.html">Concepts, Techniques, and Models</a> expresses what the authors call the Declarative Computation Model.<a href="#bib1">[1]</a>  Starting with Chapter 2, there is a large amount of material about this computational model in the book, and I hope to cover various aspects of it over the course of a few posts.

In Chapter 2 we see up close how *syntactic sugar* enhances expressivity, and are treated to an in-depth look at the mechanics of the *abstract machine* which we can use to reason about the execution of our code. I'll dive a little bit into each in this post, to lay the ground work for expanding the declarative model to include, for example, the primitives for declarative concurrency.

#### Syntactic Sugar

The declarative kernel language in the second chapter of CTM is very simple. There are few moving parts, and programs can be read and understood in a linear, predictable way. Nearly the entirety of the syntax of the language (excluding the value expression syntax) including everything we need to declare variables, assign values, execute statements, use conditionals, execute procedures, *etc.* fits in this small box:

<center><img src="/images/declarative_kernel.png"></center>

This predictability of the language comes at the cost of reduced expressiveness, but the idea is not to produce a perfect, industrial programming language. The point is to start from the basics, understand their formal foundations, and then progressively expand the expressive capabilities (and therefore the complexity of the underlying semantics) of your kernel language. Using no syntactic shortcuts, here is how we we could define a `Max` function (as it is shown in the book), which given two inputs returns the one that is of greater numerical value. For example, `Max(3,5)` should return `5`.

{% highlight ruby %}
local Max in
  local A in
    local B in
      local C in
        Max = proc {$ X Y Z}
          local T in
            T=(X>=Y)
            if T then Z=X else Z=Y end
          end
        end
      A = 3
      B = 5
      {Max A B C}
      end
    end
  end
end
{% endhighlight %}

Using some shortcuts, the authors then show the following version, which takes advantage of a few different examples of *syntactic sugar*:

* Multiple variables declared per line
* Implicit local variables in proc declaration
* one more

{% highlight ruby %}
local Max C in # declare variables Max (to hold proc) and C (to hold result)
  proc {Max X Y ?Z} # declare the proc, store it in Max, provide two inputs and one output
    if X>=Y then Z=X else Z=Y end # the Max algorithm
  end
  {Max 3 5 C} # call Max with 3 and 5, store the result in C
end
{% endhighlight %}

I wanted to share this simple example for two reasons: first, it illustrates how simple transformation rules, when applied iteratively and in combination can produce complex results very quickly. Secondly, the `Max` expansion 

#### The Abstract Machine

While syntactic sugar is one of the main mechanisms used to extend language functionality, the heart of understanding how the kernel languages operate is in how they execute in the abstract machine. As the authors say:

> "We will define the kernel semantics as an operational semantics, i.e., it defines the meaning of the kernel language through its execution on an abstract machine."

In other words, the abstract machine is the device, or the main metaphor, that is used to explain how the language works. An abstract machine executes the instructions that we give it in a predictable, repeatable way, and gives _formal credence_ to our _programmer's intuition_ for how some basic programs work.

The abstract machine has a few components that need defining before we can examine how a relatively simple bit of code is executed.

**A single assignment store ($\sigma$)** is a set of variables. Variables can be unbound (declared but not assigned a value) or bound (declared and assigned a value). Bound variables can be assigned the value of a number, a data structure, or another variable,

**An environment ($E$)** is a mapping from variables to members of the single assingment store.

**Semantic Statement ($ST$) ** is a pair of $S$ and $E$, where $S$ is a statement to be executed in environment $E$.

**Execution State**

**Computation**

* Program Execution

> "A single transition in a computation is called a computation step. A computation step is atomic, i.e., there are no visible intermediate states. It is as if the step is done 'all at once.'"

The section on program execution demonstrates how the following code is executed by the abstract machine:

{% highlight ruby %}
local X in #<s> begin
  X = 1
  local X in #<s>1 begin
    X = 2
    { Browse X }
  end #<s>1 end
  { Browse X } # <s>2 begin/end
end #<s> end
{% endhighlight %}

The exercise is to read the above code, reason about it, and predict what the execution will look like. The `Browse` function displays the value passed to it.

**(1)**&nbsp;&nbsp;&nbsp;$(ST, \sigma)$

**(2)**&nbsp;&nbsp;&nbsp;$([(\lt s \gt, \emptyset)], \emptyset)$

**(3)**&nbsp;&nbsp;&nbsp;$([(\lt s \gt_1  \lt s \gt_2,\\{X \rightarrow x\\})], \\{x = 1\\})$

**(4)**&nbsp;&nbsp;&nbsp;$([(\lt s \gt_1, \\{X \rightarrow x\\}),  (\lt s \gt_2,\\{X \rightarrow x\\})], \\{x = 1\\})$

**(5)**&nbsp;&nbsp;&nbsp;$([(X=2, \\{Browse \space X\\}, \\{X \rightarrow x'\\}),  (\lt s \gt_2,\\{X \rightarrow x\\})], \\{x', x = 1\\})$

**(6)**&nbsp;&nbsp;&nbsp;$([(\\{Browse \space X\\}, \\{X \rightarrow x'\\}),  (\\{Browse \space X\\}, \\{X \rightarrow x\\})], \\{x' = 2, x = 1\\})$

**(1)**&nbsp; The execution state is represented by a <a href="http://en.wikipedia.org/wiki/Stack_(abstract_data_type)">stack</a> of semantic statements $ST$ and a value store $\sigma$. A semantic statement is a pair $(\lt s \gt,E)$, where $\lt s \gt$ is a statement and $E$ is an environment - a mapping of variables to values stored in $\sigma$.

**(2)**&nbsp; The initial execution state of our program in the abstract machine. $E$ has been substituted by $\lt s \gt$, a statement which represents the outermost $local$ statement in the program, and $\emptyset$, meaning there are not yet any mappings present. The value store has also been replaced with $\emptyset$ - it has no members.

**(3)**&nbsp; The outermost $local$ statement and $X = 1$ are executed. There is a sequential composition $\lt s \gt_1\lt s \gt_2$ remaining, the environment reflects that $X$ refers to the store variable $x$, and one binding ($x=1$) is added to $\sigma$.

**(4)**&nbsp; After executing the sequential composition we see that each statement ends up with its own environment; they are now on the execution stack. We will sequentially execute each statement next.

**(5)**&nbsp; Executing $\lt s \gt_1$ binds a new variable $x'$ and calculates a new environment. This has a clear semantic specification; given an initial $E$ of $\\{X \rightarrow x\\}$, adding $\\{X \rightarrow x'\\}$ to it will yield $\\{X \rightarrow x'\\}$. The second mapping of $X$ overrides the first.

**(6)**&nbsp; $\lt s \gt_2$ is a $Browse$ statment, and $X = 2$ is bound. From this we can tell that we will see $Browse$ run twice - the first will show 2, and the second will show 1.

This simple exercise highlights the scoping semantics of the declarative kernel language. 

To contrast the declarative kernel language with a language like <a href="http://http://www.ruby-lang.org/">Ruby</a>, for example, where it is possible for 

*If you like this kind of content, <a href="http://twitter.com/mrb_bk">follow me on Twitter</a> for more.*

#### Works Cited

<a id="bib1">[1]</a> Van Roy and Haridi. *Concepts, Techniques, and Models of Computer Programming* MIT Press, hardcover, 900pp+xxix, ISBN 0-262-22069-5, March 2004
