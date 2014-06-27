---
layout: post
title: A Nice Feature in core.logic and Thoughts About A Data Structure
published: true
other: true
---
# 
#### A Nice Feature in core.logic and Thoughts About A Data Structure

<a href="http://github.com/clojure/core.logic">core.logic</a> is a library for the <a href="http://clojure.org/">Clojure programming language</a> that allows the functionality of Relational or Logic Programming to be embedded in your regular Clojure code. The driving force behind core.logic is <a href="http://swannodette.github.io/">David Nolen</a>, who puts a lot of effort into maintaining and improving the codebase of this fascinating library. Recently, David <a href="http://stackoverflow.com/questions/15821718/how-do-i-de-structure-a-map-in-core-logic">responded on Stack Overflow</a> to a very good question:

> How do I de-structure a map in core.logic?

David gives a very nice answer which has a few interesting pieces to it, but I just want to focus on one - the relation called `featurec`. Here's the documentation for it:

{% highlight clojure %}
clojure.core.logic/featurec
([x fs])
  Ensure that a map contains at least the key-value pairs
  in the map fs. fs must be partially instantiated - that is,
  it may contain values which are logic variables to support
  feature extraction.
nil
{% endhighlight %}

I asked David where the name came from, as it seemed kind of strange. He responded with a link to this tweet:

<center><blockquote class="twitter-tweet"><p>Does no Prolog support feature structures (attribute value matrices) as terms?! @<a href="https://twitter.com/swannodette">swannodette</a> <a href="http://t.co/Z9HfCCQ7" title="http://stackoverflow.com/questions/12809075/partial-hash-map-unification">stackoverflow.com/questions/1280…</a></p>&mdash; Chung-chieh Shan (@ccshan) <a href="https://twitter.com/ccshan/status/255802743699161089">October 9, 2012</a></blockquote></center>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Which takes us to yet another Stack Overflow question, this time asked by David himself. It is summed up by Chung-chieh Shan as "Does no Prolog support feature structures (attribute value matrices) as terms!?" The short of it is this: there is a dearth of material concerning Prolog or other logic programming environment's treatment of `records`, `dictionaries`, `hashes`, or whatever you prefer to call them.

After some back and forth in the thread, some attention was drawn to the <a href="http://www.nactem.ac.uk/tsujii/lilfes/">LiLFeS</a> project and its concept of <a href="http://www.nactem.ac.uk/tsujii/lilfes/manual/chap3.html">Feature Structures</a>. LiLFeS is extremely obscure, but it is definitely legitimized by its logo:

<center><img src="http://www.nactem.ac.uk/lilfes/lilfes-ninomi.gif"></center>

LiLFeS is built to be a fast Logic Programming system where a dictionary like data structure, called a "Feature Structure" is a first-class citizen. I found it interesting that this was unique amongst Logic Programming enthusiasts and academics, as dictionary-like structures are the High Fructose Corn Syrup of modern dynamic languages.

This episode highlights one of the differences between the work being done on core.logic, and the "Academic" work being done on the inspiration for core.logic, <a href="http://minikanren.org">miniKanren</a>. Both push boundaries in different and interesting ways, but core.logic's integration with Clojure makes treating maps and other import Clojure Data Structures properly that much more important. Developers who come from dynamic programming backgrounds want feature rich support for associative data structures, and `featurec` is an example of how that can be provided. Let's take a look at some of the tests for it from the <a href="https://github.com/clojure/core.logic/blob/master/src/test/clojure/clojure/core/logic/tests.clj#L3146-L3162">core.logic test suite</a>.

The first test is a very simple three line core.logic program:

{% highlight clojure %}
(is (= (run* [q]
         (featurec q {:foo 1})
         (== q {:foo 1 :bar 2}))
       '({:foo 1 :bar 2})))
{% endhighlight %}

Let's look at it line by line.

{% highlight clojure %}
(run* [q]
{% endhighlight %}

`run*` starts the core.logic engine with the understanding that the program will return as many results as possible given the conditions provided, and the logic variable or lvar `q` is instantiated for use.

{% highlight clojure %}
(featurec q {:foo 1})
{% endhighlight %}

The first condition on `q` is provided in the next line, above. It states that `q` is a map which contains the key value pair `{:foo 1}`. We now know two things about `q` that we didn't after the first line ran - that `q` is a map, and that it contains `{:foo 1}`.

{% highlight clojure %}
(== q {:foo 1 :bar 2}))
{% endhighlight %}

The last line unifies (the `==` operator stands for unification in this context) the partially defined map `q` with the value `{:foo 1 :bar 2}`. Essentially, this program asks the following question:

> When `q` is `{:foo 1 :bar 2}` and `q` contains `{:foo 1}`, what are *all* of the possible values of `q`?

Let's look at another test which puts a finer point on the above:

{% highlight clojure %}
(is (= (run* [q]
         (featurec q {:foo 1})
         (== q {:bar 2}))
       ()))
{% endhighlight %}

We don't need to break this one down quite as far. Let's talk about the two important lines - the `featurec` and the `==` clauses. The `featurec` constrains q to maps which contain the map `{:foo 1}`, and the `==` unifies `q` with the value `{:bar 2}`. This program asks if there are any possible values of `q` where `q` is `{:bar 2}` and `q` contains `{:foo 1}`. Since the answer is no, this program returns the empty list - there are no possible values of `q` which satisfy these conditions.

{% highlight clojure %}
(is (= (run* [q]
         (fresh [x]
           (featurec x {:foo q})
           (== x {:foo 1})))
        '(1)))
{% endhighlight %}

The last test shows more advanced usage of `featurec`, bringing us full circle to map de-structuring. Since the maps passed to the second position of `featurec` do not need to be fully bound, `featurec` can constrain `x` to maps which contain the key value pair `{:foo q}` even though `q` is the output variable provided to `run*` and at this point has no specific value. Simply stated:

> If `x` is a map which contains a key `:foo` and a value `q`, and `x` is also a map with the value `{:foo 1}`, then the unbound variable `q` must have the value of `1`.

`featurec` is an example of a very useful constraint relation that can serve to declaratively describe loose structure in core.logic programs and replace clumsier attempts to use `matche` and pattern matching to unify maps. `featurec` is built on top of the concept of a partial map (`PMap` in the core.logic source) that encapsulates the functionality of maps which play nicely with purely relational functions. This is nicer than pattern matching for the same purpose because you do not need to explicitly specify all of the keys using `featurec` as you do with `matche`.

Clojure programmers often resort to a lot of trickery in core.logic to massage their data structures into lists for compatibility with the classic examples of Prolog, miniKanren, etc. Rich support for maps is one of the things that makes core.logic such an exciting library that is edging ever closer to wider adoption amongst Clojure programmers in non-trivial applications. Drawing on inspiration from a wide array of sources is what makes Clojure so fascinating and vital, and core.logic is clearly following in these footsteps. I hope this blog post helps get you excited enough to `run*` your own.


