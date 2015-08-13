---
layout: post
title: "Meeting J-Bob: Notes on 'The Little Prover' Chapters 1-5"
published: true
other: true
---
# 
# 
### Meeting J-Bob: Notes on "The Little Prover" Chapters 1-5

 <a href="http://www.cs.indiana.edu/~dfried/">Daniel P. Friedman</a> has authored or co-authored an alarming number of Computer Science books that Programming Language enthusiasts would consider classics. Among them are a few members of the series of "Little" books, which started in the 70s with "The Little LISPer," and continues 40 years later, with 2015's "The Little Prover," co-authored with Carl Eastlund.

 All of the "Little" books follow a similar structure and embrace a similar pedagogy: concepts are taught through a series of questions and answers side by side, presented in "frames" separated by lines. I have studied some of the other books before, particularly "The Reasoned Schemer" (which doesn't have the word "Little" in it but is still a part of the 'series'), but have never really clicked with how the information is presented.

 Probably because I had a good reason to feel that I *needed* to understand what they were presenting, the technique finally worked for me with "The Little Prover." Reading the pages over and over again I got into a rhythm and started to absorb the information. Another thing that was blocking me before was a lack of intuitive understanding of Scheme (pairs and lists everywhere confused me, `cons` and `car` and `cdr` irked me). For some reason, that vanished for me too when I started with this book, so yay! It only took me around 8 years to be able to digest Scheme properly. Not too shabby, mrb, not too shabby.

Why was I so compelled to grok this stuff? I committed myself to presenting about Phillip Wadler's "Propositions as Types" at the New York City chapter of Papers We Love, and I wanted to have a concrete, interactive experience to go along with the theory and mechanics I was trying to grasp from the paper. "The Little Prover" coming out around the same time as I was preparing seemed serendipitous - it describes a theorem prover written in Scheme and shows how theorem proving and writing Scheme code can actually be the same thing.

To put a finer point it, I love this book and highly recommend it. It has lots of lessons to teach, which aren't limited to theorem provers. What the authors can do with a 'simple' system written in Scheme is phenomenal and very deep, and importantly, challenging concepts are made fun and easy to access given enough time and patience. I found pieces of some of my favorite aspects of philosophy, math, and Computer Science in the book, and think you can make connections to:

* Compilers
* Static Analysis
* Logic
* Language and truth (what is like, real...man?)
* Kernel languages
* Small things
* Breakfast

And I'm pretty sure if you're reading this, you like at least some of those things.

I decided to write down some notes and musings from each of the 10 chapters in the book in order to bolster my understanding, provide an artifact of my learning in case anything becomes fuzzy to me later (which it certainly will, given historical evidence), and to prove to myself that I can explain this stuff in the context of Wadler's paper. This post covers the first 5 chapters. For each one, I've written down what the "Big ideas" were for me - what resonated, what I think the authors were after, and what I could take away. Here we go!

*Note: There is some Scheme code below that is illustrative, and some that is meant to be executed by the J-Bob proof assistant, the design and implementation of which is one of the central focuses of the book. Understanding which is which is a little bit confusing, but check out <a href="http://github.com/the-little-prover/j-bob">The J-Bob Source Code on GitHub</a> for some clues.*

## Chapter 1 - Old Games, New Rules

*Big ideas:*

* We can know cool things about a program without having to run it
* Rewriting programs according to rules is powerful and pervasive
* You can prove theorems by writing code
* Holy shit I finally understand Scheme

The Scheme code `(car (cons 'ham '(eggs)))` is *equal to* to `'ham`.

Each of the following lines of Scheme code are also *equal to* `'ham`:

{% highlight scheme %}
(car (cons 'ham '(cheese)))
(car (cdr (cons 'eggs '(ham))))
(car (cons (car '(ham')) '(eggs')))
{% endhighlight %}

The Scheme code `(car (cons 'ham '(eggs)))` is *equal to the value* `'ham`. It is not equal to *any other value*.

What value is the Scheme code `(cons a b)` *equal to*? We don't know what `a` and `b` are, so we can't know the value of `(cons a b)`.

An `atom` in Scheme is defined as anything that is not a `pair`, and a `pair` is something that is produced with `cons`. This should give you the idea:

{% highlight scheme %}
(atom? 1) => 't
(atom? 'nil) => 't
(atom? '()) => 't
(atom? '(1)) => 'nil
(atom? '(1 2)) => 'nil
{% endhighlight %}

Play around in your friendly Scheme REPL if you feel like testing more expressions. I've certainly spent long enough doing so, I wouldn't want to begrudge you the fun!

So, back to the question "What is the value of `(atom? (cons a b))`?" 

Even though we don't know *what* `a` and `b` are, we know the value of `(atom? (cons a b))` - why?

Because we know the definition of `atom?`, which returns `'nil` for anything that is the result of a `cons` operation.

So the value of `(atom? (cons a b))` is `'nil`, regardless of the values of `a` and `b`. This is cool, and reminds me of static analysis.

Does the expression `(equal? 'flapjack (atom? (cons a b)))` have a value?

If we know that `(atom? (cons a b))` is `'nil`, does that help us? It does! We can substitute `'nil` for any instance of `(atom? (cons a b))` that we come across. That seems useful.

So `(equal? 'flapjack (atom? (cons a b)))` becomes `(equal? 'flapjack 'nil)` which is `'nil`.

The big idea here is that:

> We can know interesting things about a program without executing it.

The authors are also introducing the idea of a **focus** within a piece of code that is being transformed/evaluated in this strange new way.

Our attention is drawn to the fact that this transformation happens *in discrete steps* and rewriting is applied *to specific, addressable subexpressions* of the term at hand. To follow these steps:

1. Starting from the code `(equal? 'flapjack (atom? (cons a b)))`, the  focus is `(atom? (cons a b))`, which we can rewrite to `'nil`. 
2. After the substitution occurs, the  **focus** is on the whole expression, which is `(equal? 'flapjack 'nil)`. We know this is equal to `'nil`.

So two steps and two focuses later, we have reduced the original expression to a value without having to know everything about that program, e.g. the values of `a` and `b`.

We relied on certain known facts in order to execute the above transformation. These facts are called *axioms*.

> "An axiom is a basic assumption that is presumed to be true."

Here are some axioms:

1. `(atom? (cons x y))` is always equal to `'nil`.
2. `(car (cons x y))` is always equal to `x`.
3. `(cdr (cons x y))` is always equal to `y`.

Stated in code, using the `dethm` construct:

{% highlight scheme %}
(dethm atom/cons (x y)
  (equal? (atom (cons x y)) 'nil))
{% endhighlight %}
When axioms are built up to prove things, that's called a *theorem*:

> "A theorem is an expression that is always true."

And to put a finer point on it:

> "Axioms are theorems that are assumed to be true, whereas other theorems must be shown to be true."

Here are the steps of rewriting the following expression until it becomes `'t`:

{% highlight scheme %}
(car
  (cons (equal (cons x y) (cons x y))
    '(and crumpets)))
{% endhighlight %}
We notice that `(equal (cons x y) (cons x y))` will always be `'t`, regardless of what `x` and `y` are. So, we can replace it with `'t`:

{% highlight scheme %}
(car
  (cons 't
    '(and crumpets)))
{% endhighlight %}
Likewise, the static values `'t` and `'(and crumpets)` can be collapsed using `cons`. Finally:

{% highlight scheme %}
(car '('t and crumpets))
{% endhighlight %}
The `car` of `'('t and crumpets)` will always be `'t`. So we arrive at:

{% highlight scheme %}
't
{% endhighlight %}
Without executing the code, we know that it will always evaluate to `'t`.

The Law of Dethm (initial):

> "For any theorem `(dethm name (x1...xn) body-x)`, the variables `x1...xn` in `body-x` can be replaced with any corresponding expressions `e1...en`. The result, `body-e`, can be used to rewrite a focus `p` to become `q` provided `body-e` is either `(equal? p q)` or `(equal? q p).`"

{% highlight scheme %}
(atom? (car (cons (car a) (cdr b))))

e1 -> (car a)
e2 -> (cdr b)

body-e -> (equal (car (cons (car a) (cdr b))) (car a))

p -> (car (cons (car a) (cdr b)))
q -> (car a)

(atom? (car a))
{% endhighlight %}

That's what it looks like to apply the Law of Dethm to some functions. We're also told that J-Bob, an assistant in the form of a computer program, can help us automatically do some of these transformations.

## Chapter 2 - Even Older Games

*Big ideas:*

* Theorems in the system are written according to the `Law of Dethm`
* Using an abstract example to understand a deep principle is helpful - see `The Jabberwocky`
* We will be able to prove conjectures using a library of axioms

What is `(car (cons a b))` in this code equal to?

{% highlight scheme %}
(if (car (cons a b))
  c
  c)
{% endhighlight %}

`a`, since the `car` of `(cons a b)` is always `a`. This is the result:

{% highlight scheme %}
(if a
  c
  c)
{% endhighlight %}
We know we can do that because of the axiom of `car/cons`. What is the expression above equal to?

The result is `c`, regardless of `a`. Chapter 2 introduces axions around `if` to help us rewrite `if` code the same way that we rewrote with `car/cons` above.

The axioms of If: `if-true`, `if-false`, `if-same`:

{% highlight scheme %}
(dethm if-true (x y)
  (equal (if 't x y) x))
  
(dethm if-false (x y)
  (equal (if 'nil x y) y))
  
(dethm if-same (x y)
  (equal (if x y y) y))
{% endhighlight %}

These axioms each represent very simple ideas that turn out to have very powerful implications.

Every `if` expression has three parts: `(if Q A E)`: The Question, the Answer, and the Else.

The axioms of Equal: `equal-same`, `equal-swap`, `equal-if`.

The Law of Dethm (final)

* For any theorem `(dethm name (x1...xn) body-x)`:
* The variables `x1...xn` in `body-x` can be replaced with any corresponding expressions `e1...en`.
* The result, `body-e`, can be used to rewrite a focus as follows:
  1. `body-e` must contain the *conclusion* 
  2. The *conclusion* must not be found:
    1. in the `Q` of any `if`   
    2. in the argument of any function application
  3. if the *conclusion* can be found in an `if` `A` or `E`, then the *focus* must be found in an `if` `A` or `E` with the same `Q`.

Explaining the "Law of Dethm" with the Jabberwocky example:

> "Sometimes our intuitions get in the way."

The `if-nest` axioms are amazing:

{% highlight scheme %}
(dethm if-nest-A (x y z)
  (if x (equal (if x y z) y) 't))
  
(dethm if-nest-E (x y z)
  (if x (equal (if x y z) z) 't))

{% endhighlight %}

Reminds me of the first time I realized that statically typing terms of certain dynamic languages was possible. Consider the following snippet:

{% highlight scheme %}
function fooTester (foo){
  if (foo > 3){
    return "cool";
  } else {
      return "uncool";
  }
}
{% endhighlight %}

Think about it long enough and you can see that there are both assumptions that can be made about the types in this function, and also some things you know. An assumption is that `foo` is a number. We test it against `3` using the `>` operator, which we know operates on numbers.

Something we  know for sure is that this function returns a `String`. Regardless of the value of `foo`, this `if` expression returns a `String`.

Start to stack these assumptions up, dream of an interactive tool that can tell you the types of these expressions without having to know them, and throw in a type checker that can assert what you annotate, and you can get a sense of a pathway from dynamic to statically typed programming.

In this chapter we also get `The Axioms of Cons`, `atom/cons`, `car/cons`, `cdr/cons`:

{% highlight scheme %}
(dethm atom/cons (x y)
  (equal (atom (cons x y)) 'nil))

(dethm car/cons (x y)
  (equal (car (cons x y)) x))

(dethm cdr/cons (x y)
  (equal (cdr (cons x y)) y)
{% endhighlight %}

More intuitive but not intuitive facts about list construction in Scheme than you knew were useful. This chapter really nails the fluid, bizarre methods of applying rules and rewriting code that goes into creating mechanized proofs on a computer using a programming language.

Through applying some sensical and some nonsensical techniques, the authors illustrate that like programming, you can gain an intuition for the idioms of theorem proving through repetition and deep understanding. Write and read enough programs and you'll learn how to write programs properly. Write and read enough proofs, it seems, and the same will happen. An interesting perspective on the correspondences that make the ideas in this book possible.


## Chapter 3 - What's in a Name?

*Big ideas:*

* A claim is an unproven theorem
* J-Bob can help you prove that your claims are theorems
* J-Bob has a language for describing how to rewrite code

The value of the Scheme code `(pair 'sharp 'cheddar)` is `'(sharp cheddar)`.

The value of `(first-of (pair 'sharp 'cheddar))` is `'sharp`.

The value of `(second-of (pair 'sharp 'cheddar))` is `'cheddar`.

The function `pair` is written like this:

{% highlight scheme %}
(define (pair x y)
  (cons x (cons y '())))
{% endhighlight %}

And here's `first-of` and `second-of`:

{% highlight scheme %}
(define (first-of x)
  (car x))
  
(define (second-of y)
  (car (cdr x)))

{% endhighlight %}

Here's a claim about `first-of`:

{% highlight scheme %}
(dethm first-of-pair (a b)
  (equal (first-of (pair a b) a))))

{% endhighlight %}

> "A claim is an as-yet unproven theorem."

We can make a claim into a theorem! By *proving* it!

> "A proof is a sequence of rewriting steps that ends in `'t`. If we can rewrite a claim, step by step, to `'t`, then that claim is a theorem."

{% highlight scheme %}
(pair x y) -> (cons x (cons y '()))

(pair a b) -> (cons a (cons b '()))

{% endhighlight %}

Defun: Given the non-recursive function `(defun name (x1...xn) body)`, `(name e1...en) = body` where `x1` is `e1,...xn is en`.

In other words, for a non-recursive function, you can replace the `function call` with the `function definition`, substituting the arguments from the definition with those of the function you're proving.


{% highlight scheme %}
(equal (first-of (pair a b) a))
(equal (first-of (cons a (cons b '()))) a)
(equal (car (cons a (cons b '()))) a)
(equal a a)
('t)
{% endhighlight %}

So `first-of-pair` is a theorem, by `Law of Defun`, `car/cons`, and `equal-same`.

Is `second-of-pair` a theorem?

{% highlight scheme %}
(dethm second-of-pair (a b)
  (equal (second-of (pair a b)) b)
{% endhighlight %}

Yes, by `car/cons`, `cdr/cons`, `equal-same`, `second-of`, and `pair`.


For the first three chapters, the authors cleverly use colors in the printed text to show the "focus" of an expression as it is being rewritten.

When you are using the J-Bob prover that the book introduces and shows you how to use and implement, you describe these focuses using a query language of sorts describing the "path" to the part of the expression that needs to be rewritten.

This works because all code is a list. "Code as data" in the Lisp tradition has a lot of awesome applications and the authors of this book, one of whom is easily one of the deepest functional programming thinkers of all time, leverage this property to the fullest in this text.

> "If we can find a proof one way, we can always find it in another. If the second way goes wrong, we can 'back up' to where we started and do it the first way again. But some approaches will find a proof faster than others."

Let's look at `in-pair?`. What does it do?

{% highlight scheme %}
(defun in-pair? (xs)
  (if (equal (first-of xs) '?)
    't
    (equal (second-of xs) '?)))
{% endhighlight %}

It determines whether the two-element list `xs` contains `'?`. Let's try to prove this claim!

{% highlight scheme %}
(dethm in-first-of-pair (b)
  (equal (in-pair? (pair '? b)) 't))
{% endhighlight %}

Is `in-first-of-pair` a theorem? Yes! By `car/cons`, `equal-same`, `if-true`, `pair`, `in-pair?` and `first-of`.

> "Skip irrelevant examples: Rewriting a claim to 't does not have to go in any particular order."

This chapter shows us the mechanics of using code to prove theorems, which are expressed as code. These proofs happen by rewriting code using pre-defined rules to begin with a conjecture and then end with `'t`, which completes the proof.

## Chapter 4 - Part of This Total Breakfast

*Big ideas:*

* J-Bob can be used to prove the totality of functions, recursive or not
* Proving totality of functions with natural recursion uses J-Bob's `size` function, and is a neat way to prove totality
* Partial functions are problematic because they can be used to introduce inconsistencies into a system

We meet a new function - `list0?`. Here's how it works:

{% highlight scheme %}
(list0? 'oatmeal) => 'nil
(list0? '()) => 't
(list0? '(toast)) => 'nil
{% endhighlight %}

What does `list0?` do? It looks like it tells you if something is an empty list. Here is the definition:

{% highlight scheme %}
(defun list0? (x)
  (equal x '()))
{% endhighlight %}

Is `list0?` total? What does total mean?

> "`list0?` is total means that no matter what value `v` is passed to `list0?`, the expression `(list0? v)` has a value."

In other words a function `f` composed of functions `x1...xn` and if statements `if1...ifn` can be total if all of the outcomes of `if1...ifn` produce a value and `x1...xn` are all total.

We learn that, somewhat surprisingly, all built in operators are total. When we're trying to determine if a function is total, we know that all functions used in a function must be total for a function to be total. For example:

{% highlight scheme %}
(defun list1? (x)
  (if (atom x)
  'nil
  (list0? (cdr x))))
{% endhighlight %}
Is total because `atom`, `list0?`, and `cdr` are all total, and the if statements `A` and `E` produce a value. Now that we know what totality is, we can learn about the final `Law of Defun`:

> "Given the total function (defun name (x1...xn) body), (name e1...en) = body where x1 is e1, ..., xn is en."

In other words, we can replace a function's use with it's body (once variable substitutions are performed) if the function is total. Why does it matter if it is total? If it isn't, a function can be used to prove a contradiction. Let's take a look.

We go through the process of trying to prove `list0?`, `list1?`, `list2?`, `list3?`, etc. as total. There must be an easier way, and it sounds like a job for recursion. Can we use recursion like that? What would that look like? How about like this:

{% highlight scheme %}
(defun list? (x)
  (if (atom x)
    (equal x '())
    (list? (cdr x)))))
{% endhighlight %}
The `list?` function produces `'t` if its argument is a list, otherwise it produces `'nil`. So, is `list?` total?

It looks like in order to know if `list?` is total, we need to know if `list?` is total, because the function is recursive. So what can we know about how `list?` is called from within `list?`?

We see that `list?` is always called with `(cdr x)` as its argument. That means that by definition, calls to `list?` from within `list?` always have fewer `conses` than the function started with.

The way that we use this fact to prove that `list?` is total is with a mechanism known as the `measure` of a function.

> "The measure is an expression that is included with a function definition. It may only refer to previously defined, total functions and to the function definition's formal arguments. The measure must produce a natural number that decreases for every recursive call to the function."

So if we definte `list?` with a measure, J-Bob will know how to measure whether or not recursive calls to a function will actually cause the function to terminate and produce a value.

{% highlight scheme %}
(defun list? (x)
  (if (atom x)
    (equal x '())
    (list? (cdr x)))))

measure: (size x)
{% endhighlight %}

The `size` function measures the size of a function's measure. Counting `cons` cells, for example:

{% highlight scheme %}
(size '((10 (A 20)) B)) => '6
(size '(10 (A 20))) => '4
(size '10) => '0
{% endhighlight %}

The way that we make the totality claim for `list?` using a measure is by expressing "If x is not an atom, than `(size x (cdr x))` must be smaller than `(size x)`."

{% highlight scheme %}
(if (natp (size x))
  (if (atom x)
    't
    (< (size (cdr x)) (size x)))
  'nil)
{% endhighlight %}

We are introduced to some `Axioms of Size` which give us certain truths upon which we can rest the burden of our totality claims! Handy.

{% highlight scheme %}
(dethm natp/size (x)
  (equal (natp (size x)) 't))
  
(dethm size/car (x)
  (if (atom x)
      't
        (equal (< (size (car x)) (size x)) 't)))

(dethm size/cdr (x)
  (if (atom x)
        't
        (equal (< (size (cdr x)) (size x)) 't)))
{% endhighlight %}

So using these rules and the rules we've seen before, we can indeed reduce the totality claim above to `'t`. Here's how it looks using J-Bob:

{% highlight scheme %}
(defun defun.list? ()
  (J-Bob/define (defun.list2?)
    '(((defun list? (x)
         (if (atom x) (equal x '()) (list? (cdr x))))
       (size x)
       ((Q) (natp/size x))
       (() (if-true (if (atom x) 't (< (size (cdr x)) (size x))) 'nil))
       ((E) (size/cdr x))
       (() (if-same (atom x) 't))))))

{% endhighlight %}

The totality claim for `partial` is as follows:

{% highlight scheme %}
(if (the (size x))
  (if (< (size x) (size x))
  't
  'nil)
  'nil)
{% endhighlight %}

Which can be reduced to:

{% highlight scheme %}
(if (< (size x) (size x))
  't
  'nil)
{% endhighlight %}

Which can't go any further - certainly `(< (size x) (size x))` could never be true or reconciled within a consistent system. That's why `partial` is partial, and why totality matters - because partial functions can introduce inconsistencies into our system.

## Chapter 5 - Think it Over and Over and Over

*Big ideas:*

* There are techniques you can apply to help produce efficient, straightforward proofs
* Wow proofs really are a lot like programs, aren't they? Wait, which are we writing again?
* This really reminds me a lot of static analysis

We start out looking at `memb?`, a function which looks for `'?` in a list, and `remb`, which removes the first instance of `'?` from a list. Are they total? Let's look at `memb?` with a measure:

{% highlight scheme %}
(defun memb? (xs)
  (if (atom xs)
    'nil
    (if (equal (car xs) '?)
      't
      (memb? (cdr cs)))))

measure: (size xs)
{% endhighlight %}

You can determine if `memb?` is total by proving its totality claim:

{% highlight scheme %}
(if (natp (size xs))
  (if (atom xs)
    't
    (if (equal (car xs) '?)
      't
      (< (size (cdr xs)) (size xs))))
  'nil)
{% endhighlight %}

It is total, and so is `remb`, so we should be able to build theorems out of these functions. Which is exactly what we do next, with `memb?/remb0`, which states that `remb` removes `'?` from a 0-element list. Here's the `dethm`:

{% highlight scheme %}
(dethm memb?/remb0 ()
  (equal (memb? (remb '())) 'nil))
{% endhighlight %}

We can try to prove this using the axioms we've learned so far. The bit to focus on is:

{% highlight scheme %}
(equal (memb?
          (remb '()))
        'nil)
{% endhighlight %}

The first thing we should do is use the definition of `remb`, which we know to be total. We'll replace the `xs` in the definition of `remb` with `'()`.

{% highlight scheme %}
(equal (memb?
          (if (atom '())
              '()
              (if (equal (car '()) '?)
                (remb (cdr '()))
                (cons (car '())
                  (remb (cdr '()))))))
          'nil)
{% endhighlight %}

What can be simplified from this? Quite a bit, it turns out. This expression becomes:

{% highlight scheme %}
(equal (memb?
          '())
        'nil)
{% endhighlight %}

By `atom` and `if-true`, because `'()` is an atom. Now, let's use `memb?`, again replacing `xs` with `'()`:

{% highlight scheme %}
(equal (if (atom '())
           'nil
           (if (equal (car '()) '?)
               't
               (memb? (cdr '())))
           'nil)
{% endhighlight %}

Again we see the expression `atom '()`, which we know is true. So the above becomes:

{% highlight scheme %}
(equal 'nil
       'nil)
{% endhighlight %}

And we know that `memb?/remb0` is indeed a theoreom, by `atom`, `if-true`, and `equal-same`. Here's how the above explanation looks when it's written in J-Bob:

{% highlight scheme %}
(defun dethm.memb?/remb0 ()
  (J-Bob/define (defun.remb)
    '(((dethm memb?/remb0 ()
         (equal (memb? (remb '())) 'nil))
       nil
       ((1 1) (remb '()))
       ((1 1 Q) (atom '()))
       ((1 1)
        (if-true '()
          (if (equal (car '()) '?) (remb (cdr '())) (cons (car '()) (remb (cdr '()))))))
       ((1) (memb? '()))
       ((1 Q) (atom '()))
       ((1) (if-true 'nil (if (equal (car '()) '?) 't (memb? (cdr '())))))
       (() (equal-same 'nil))))))
{% endhighlight %}

This is an executable program that will prove that this function is a theorem - cool!

The authors take us through a similar procedure to prove successive functions on top of `memb?/remb0` - `memb?/remb1`, `memb?/remb2`, etc. They lead up to the question that would occur to anyone paying attention to the book up until this point - couldn't this be generalized? What techniques can we use to perform recursion like proofs? The answer is induction, and it is the big idea for the second half of the book.

While we're shown how proving the successive functions to `memb?/remb0` isn't exactly as straightforward as you'd think, we're given some nice insights into how to effectively write proofs with our system:

**Rewrite from the Inside Out**

Start with the statements "inside" the code, the things that are nested and squirreled away. Simplify them and then the entire proof will become simpler

**If Lifting**

We're shown this technique which really resonated with me as a programmer, because again it reminds me of the kinds of insights you form about programs in a certainly language after writing with it for a decent amount of time. Most experienced programmers will be able to recognize certain simplifications that can be made to code that will preserve its meaning but make its intent clearer, improve performance, etc. Similarly, we're given techniques that simplify proofs without changing their meaning. Pretty sweet.

**Pull Ifs Outward**

This is a piece of wisdom based on the mechanic provided above - that is, use if lifting! It can simplify what you're trying to prove radically.

**Keep Theorems in Mind**

Another piece of advice from the authors which I can't help but draw a parallel to software engineering about. Keeping theorems in mind is about recognizing the patterns in your code that can be simplified using axioms, but also about recognizing when you're *close* to a pattern. When you're close to a pattern, make some minor changes around your statements, and you might reveal that pattern. This reminds me a lot of the ways that software developers apply patterns, and look for "smells" or clues that they might be doing something wrong, or every once in a while, something right.
