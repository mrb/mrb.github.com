---
layout: post
title: "The Abstract Machine: Notes on CTM Chapter 02"
published: false
---
# 

*In working my way through Concepts, Techniques, and Models, I realized that the chapters are too dense and rich to cover in one blog post each. I have decided to break up the chapters into smaller, denser pieces that illustrate important ideas. This post covers the mechanics of the abstract machine under the declarative kernel programming language semantics.*

#### The Abstract Machine

The declarative kernel language that this chapter covers is very simple. There are few moving parts, and programs can be read and understood in a linear, predictable way. This predictability comes at the cost of reduced expressiveness, but the idea is not to produce a perfect, industrial programming language. The point is to start from the basics, understand their formal foundations, and then progressively expand the expressive capabilities (and therefore the complexity of the underlying semantics) of your kernel language.

> "We will define the kernel semantics as an operational semantics, i.e., it defines the meaning of the kernel language through its execution on an abstract machine."

In other words, the abstract machine is the device, or the main metaphor, that is used to explain how the language works. An abstract machine executes the instructions that we give it in a predictable, repeatable way, and gives _formal credence_ to our _programmer's intuition_ for how some basic programs work.

The abstract machine has a few components that need defining before we can examine how a relatively simple bit of code is executed.

**A single assignment store ($\sigma$)** is a set of variables. Variables can be unbound (declared but not assigned a value) or bound (declared and assigned a value). Bound variables can be assigned the value of a number, a data structure, or another variable,

**An environment ($E$)** is a mapping from variables to members of the single assingment store.

**Semantic Statement**
**Execution State**
**Computation**

* Definitions
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

The exercise is to read the above code, reason about it, and predict what the execution will look like. The `Browse` function displays the value passed to it. As we've already seen a discussion of scope, it should be clear that the interesting aspects of how this program execute relate to the semantics of the kernel language.

$$(ST, \sigma)(1)$$
$$([(\lt s \gt, \emptyset)], \emptyset)(2)$$
$$([(\lt s \gt_1  \lt s \gt_2,\\{X \rightarrow x\\})], \\{x = 1\\})(3)$$
$$([(\lt s \gt_1, \\{X \rightarrow x\\}),  (\lt s \gt_2,\\{X \rightarrow x\\})], \\{x = 1\\})(4)$$
$$([(X=2, \\{Browse \space X\\}, \\{X \rightarrow x'\\}),  (\lt s \gt_2,\\{X \rightarrow x\\})], \\{x', x = 1\\})(5)$$
$$([(\\{Browse \space X\\}, \\{X \rightarrow x'\\}),  (\\{Browse \space X\\}, \\{X \rightarrow x\\})], \\{x' = 2, x = 1\\})(6)$$

$(1)$ The execution state is represented by a stack of semantic statements $ST$ and a value store $\sigma$. A semantic statement is a pair $(\lt s \gt,E)$, where $\lt s \gt$ is a statement and $E$ is an environment - a mapping of variables to values stored in $\sigma$.

$(2)$ The initial execution state of our program in the abstract machine. $E$ has been substituted by $\lt s \gt$, a statement which represents the outermost $local$ statement in the program, and $\emptyset$, meaning there are not yet any mappings present. The value store has also been replaced with $\emptyset$ - it has no members.

$(3)$ The outermost $local$ statement and $X = 1$ are executed. There is a sequential composition $\lt s \gt_1\lt s \gt_2$ remaining, the environment reflects that $X$ refers to the store variable $x$, and one binding ($x=1$) is added to $\sigma$.

$(4)$ After executing the sequential composition we see that each statement ends up with its own environment; they are now on the execution stack. We will sequentially execute each statement next.

$(5)$ Executing $\lt s \gt_1$ binds a new variable $x'$ and calculates a new environment. This has a clear semantic specification; given an initial $E$ of $\\{X \rightarrow x\\}$, adding $\\{X \rightarrow x'\\}$ to it will yield $\\{X \rightarrow x'\\}$. The second mapping of $X$ overrides the first.

$(6)$ $\lt s \gt_2$ is a $Browse$ statment, and $X = 2$ is bound. From this we can tell that we will see $Browse$ run twice - the first will show 2, and the second will show 1.

This simple exercise highlights the scoping semantics of the declarative kernel language. 

To contrast the declarative kernel language with a language like <a href="http://http://www.ruby-lang.org/">Ruby</a>, for example, where it is possible for 

*This post is part of a series. Check the <a href="/">blog index</a> for the rest. *
