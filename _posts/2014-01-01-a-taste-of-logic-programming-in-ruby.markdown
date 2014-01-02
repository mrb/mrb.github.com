---
layout: post
title: "A Taste of Logic Programming In Ruby"
published: true
other: true
---
# 
# 
### A Taste of Logic Programming In Ruby

In getting recently re-obsessed with Logic Programming and its relationship to the future of both programming and computation (with a healthy dose of obsession for its history, of course), I recalled coming across a few relevant Ruby libraries last year that I wanted to write up a bit after playing with them here and there. I was interested in seeing some small implementations of <a href="http://en.wikipedia.org/wiki/Unification_(computer_science)">unification algorithms</a> and logic programming systems, and bingo, I came across that and more in one person's unassuming profile.

GitHub user <a href="https://github.com/jimwise">jimwise</a> who apparently is in the general part of the world as me but I have no idea who he is (the internet is awesome) has a trio of libraries that implement unification a la Ehud & Shapiro, a small nondeterministic programming library that utilizes Ruby's `callcc` functionality, and a small Prolog system also influenced by **The Art of Prolog**. Since most systems you see that tackle these problems are written in Scheme, Pascal, Haskell, etc, it was nice for me to see them in Ruby, which for better or worse is still very much my code *lingua franca*.

This post is a quick overview of what each of these libraries can do, and I encourage you to check them out if you're curious about what bringing features of other languages to Ruby can look like, or even if you're just interested in language implementation details in general.

### unific - A Unification Engine

Unification is a concept that is at the heart of understanding how logic programming systems work. Toward that end, <a href="https://github.com/jimwise/unific">unific</a> provides an interface to Logic Variables, a flexible Environment, and the ability to chain unifications. Here's a small sample:

{% highlight ruby %}
irb(main):008:0> a = Unific::Var.new("a")
=> #<Unific::Var:0x007f8c5a833ab8 @name="a">
irb(main):009:0> b = Unific::Var.new("b")
=> #<Unific::Var:0x007f8c5a828fa0 @name="b">
irb(main):010:0> e = Unific::unify([a, 1, 2], [0, 1, 2]).unify([a, b, 5], [0, 3, 5])
=> #<Unific::Env:0x007f8c5a0dec40...>
irb(main):014:0> e[a]
=> 0
irb(main):015:0> e[b]
=> 3
{% endhighlight %}

Does this smell like <a href="http://en.wikipedia.org/wiki/Pattern_matching">pattern matching</a> to you? Unification is often described as "double-sided pattern matching," so you're on the right track if so. Also, what is a `Var`? If you've never experienced logic variables, stare at unific for a while, they're an awesome way to think about how data can flow through a program.

You can also `trace` unification calls in unific to see how the engine is working, making the algorithm that much simpler to understand.

### ambit - Nondeterministic Programming

The <a href="https://github.com/jimwise/ambit">ambit</a> library provides a platform for nondeterministic programming in Ruby. This programming paradigm is quite complex and a little bit abstract to be sure, but the the <a href="https://github.com/jimwise/ambit/blob/master/README.rdoc">ambit README</a> has a good introduction. I came across this particular library because it used in the **rulog** library that I talk about below. Also interesting is that ambit relies on MRI's `callcc` functionality to implement nondeterministic choice. The code is interesting, so I've included it here. If you're uninitiated, `callcc` is worthy of your study:

{% highlight ruby %}
  # Given an enumerator, begin a generate-and-test process.
  #
  # Returns with the first member of the enumerator.  A later call to #fail!
  # on the same generator will backtrack and try the next value in the
  # enumerator, continuing from the point of this #choose as if that value
  # had been chosen originally.
  #
  # Multiple calls to #choose will nest, so that backtracking forms
  # a tree-like execution path
  #
  # calling #choose with no argument or an empty iterator 
  # is equivalent to calling #fail!
  def choose choices = []
    ch = choices.clone          # clone it in case it's modified by the caller
    ch.each do |choice|
      callcc do |cc|
        STDERR.print "choosing from " + choices.inspect + ": " if @trace > 0
        @paths.unshift cc
        STDERR.puts choice.inspect if @trace > 0
        return choice
      end
    end
    self.fail!                  # if we get here, we've exhausted the choices
  end

  # Indicate that the current combination of choices has 
  # failed, and roll execution back to the last #choose, 
  # continuing with the next choice.
  def fail!
    raise ChoicesExhausted.new if @paths.empty?
    cc = @paths.shift
    # if it quacks (or can be called) like a duck, call it -- it's either a Proc
    # from #mark or a Continuation from #choose
    cc.call
  end
{% endhighlight %}

If you think you're seeing things, you're probably starting to see how that code works. (*Note:* It's not as scary as it looks, it's scarier.)

### rulog - A Prolog in Ruby

<a href="https://github.com/jimwise/rulog">rulog</a> is a Prolog engine in Ruby that relies on **unific** and **ambit**. I found rulog when searching for an implementation of a logic programming engine, because I needed to see the implementation to understand how it worked, or so I thought. It turns out that I actually needed to learn what the hell I was trying to learn - logic programming is such a foreign paradigm that when I first encountered it I had no idea what I was seeing.

Through exposure to books like **Concepts, Techniques, and Models of Computer Programming,** **The Art of Prolog,** and **The Architecture of Symoblic Computers,** I have started to see real value in exploring declarative programming and how it can intersect with modern, practical approaches to computation. While **rulog** is a simple and somewhat rudimentary Prolog, it is great to be able to see it up close, and the author has made some thoughtful design decisions.

Here is how you can define the rules for <a href="http://mathworld.wolfram.com/PeanosAxioms.html">Peano's Axioms</a> - the number, equal, and plus relations:

{% highlight ruby %}
rs1 = Rulog::rules(
   Rulog::declare{  num(0)  },
   Rulog::declare{  num(s(v(:x))) [ num(v(:x)) ]     },

   Rulog::declare{  equal(0, 0)  },
   Rulog::declare{  equal(s(v(:x)), s(v(:y))) [ equal(v(:x), v(:y)) ] },

   Rulog::declare{  plus(v(:x), 0, v(:x)) },
   Rulog::declare{  plus(v(:x), s(v(:y)), v(:z)) [
                         plus(s(v(:x)), v(:y), v(:z)) ] }
   )
{% endhighlight %}

Here, we turn rulog's tracing to a verbose setting, and ask the engine to solve the equation `x + 2 = 4`:

{% highlight ruby %}
irb(main):030:0> 3.times{ rs1.trace }
irb(main):030:0> rs1.solve(Rulog::declare{  plus(v(:x), s(s(0)), s(s(s(s(0))))) })

# marking!
# choosing!
# chose num(0).
# chose num(s(?x)) :- num(?x).
# chose equal(0, 0).
# chose equal(s(?x), s(?y)) :- equal(?x, ?y).
# chose plus(?x, 0, ?x).
# chose plus(?x, s(?y), ?z) :- plus(s(?x), ?y, ?z).
# marking!
# choosing!
# chose num(0).
# chose num(s(?x)) :- num(?x).
# chose equal(0, 0).
# chose equal(s(?x), s(?y)) :- equal(?x, ?y).
# chose plus(?x, 0, ?x).
# chose plus(?x, s(?y), ?z) :- plus(s(?x), ?y, ?z).
# marking!
# choosing!
# chose num(0).
# chose num(s(?x)) :- num(?x).
# chose equal(0, 0).
# chose equal(s(?x), s(?y)) :- equal(?x, ?y).
# chose plus(?x, 0, ?x).
# finished rule
# finished rule
# finished rule
# 
# goal:
#   plus(?x, s(s(0)), s(s(s(s(0)))))
# answer:
#   plus(s(s(0)), s(s(0)), s(s(s(s(0)))))
{% endhighlight %}

The author's decision to put tracing in is absolutely awesome! We can see how the whole thing works.

### In Conclusion

It is one of my goals in 2014 to get more people excited about logic programming and how we can leverage it in a multi-paradigm context. Embedding pattern matching, non-deterministic choice, and logic programming into an Object-Oriented language like Ruby has many interesting possibilities. We've seen some traction with thise ideas in the Clojure community, and I hope this small tour of some easy to digest libraries by one awesome author helps get you excited about their potential.

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

**Special thanks to Jim Wise, all code from his GitHub repos.**

<a id="bib1">[1]</a> Sterling, Leon and Ehud Shapiro, The Art of Prolog, MIT Press, 1994
