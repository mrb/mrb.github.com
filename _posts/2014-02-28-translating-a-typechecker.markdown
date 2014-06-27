---
layout: post
title: "Translating a Typechecker from 'Math' to OCaml"
published: true
tapl: true
---
# 

<div class="lead">This post is one of a series on <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a> by Benjamin C. Pierce.</div>

# 
### Translating a Typechecker from 'Math' to OCaml

Chapters 9 and 10 of Benjamin C. Pierce's <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a> are dedicated to the presentation and implementation of a *Simply Typed* Lambda Calculus (STLC). Computation with the Lambda Calculus is extended with a syntactic and semantic type system that allows for the annotation and verification of a term's type, while preserving the <a href="http://michaelrbernste.in/2014/02/17/what-is-a-type-system-for.html">progress and preservation theorems</a> that we discussed last time.

After coming across this idea many times -- a Lambda Calculus with types -- and not really having any idea what that means or why it is of any importance, it is very satisfying to read a thorough and well-executed explanation. My take-away is that the formal basis of the semantics of the Lambda Calculus can be extended to elucidate the fundamental role that types seem to play in how we reason about programs and what they mean. Applying type theory to the Lambda Calculus has provided some of the deepest insights regarding our intuition about questions like "What is computation?"

Most impressive and resonant to me amongst the material, however, is one bit that Pierce mentions towards the end of Chapter 10. After describing the calculus and discussing its implementation, Pierce notes that:

> "The typechecking function **typeof** can be viewed as a direct translation of the typing rules for the Simply Typed Lambda-Calculus, or, more accurately, as a transcription of the inversion lemma."

The idea that moving between the mathematical/symbolic expression and code could be so straightforward appeals to me greatly - I've read positions advocating this way of thinking about programs, researched the idea, and even written and spoken about some of the implications of taking a more foundationally formal approach to program construction and algorithm verification. I wanted to unpack this statement to see what it really meant.

What does it mean to translate a proof into code, though, specifically? Why is a transcription of the inversion lemma alone enough to implement the typechecker?

> "...because it is the inversion lemma that tells us, for every syntactic form, exactly what conditions must hold in order for a term of this form to be well typed."

Well, that's pretty clear. The lemma is a statement of each of the possible forms in the system which defines how to create expressions that are well typed. Pierce provides the code version of the typing rules, dedicating a chapter to describing it. It is very instructive to see it after the system has been thoroughly and formally described, and in the spirit of the book, I'm going to walk through the lemma show the equivalent OCaml code, to see how well the *translation* idea works out, from words to code. The lambda calculus has variables, abstraction, application, boolean, and conditional forms to be typed, so we will see how each of these work - how they look in their formal description, and what the corresponding code looks like.

*If you'd like to follow along, I suggest at least opening up the <a href="https://gist.github.com/mrb/9105122">full OCaml definition of the typechecking function here</a>, or better yet, download and check out the <a href="http://www.cis.upenn.edu/~bcpierce/tapl/checkers/simplebool/">full source code for the interpreter</a>, as provided by Pierce.*

#### The New Typing Relation

There are a few new ideas that are worth noting before walking through the translation, which stem from the question of how to actually apply types to forms like abstraction and application. A new typing relation is introduced, which needs to be able to type forms more complex than `t:T` where `t` is a term and `T` is its type. The new relation appears in terms like this - `Γ ⊢ t1:T1`. I'll describe the symbols now and their meaning through the description of each type of form in the STLC which we will be translating.

**Γ** is known as the *typing context*, which consists of "a sequence of variables and their types." For explicitly typed languages, it is enough to assume that the declared type should hold in order for safety to be preserved. This is essentially the "environment" for type-relations which holds the known facts about types.

The **⊢** "Turnstile" operator reads "under the set of assumptions"

The **:** operator assigns a type to a term, like **t1:T1** for "term t1 has type T1"

So that **Γ ⊢ t1:T1** reads "Under the set of assumptions in Γ, the type of t1 is T1"

#### The typeof function

The function which we are exploring has the job of ensuring that declared programs are well-typed. That means that it upholds the formal rules that are encoded into the type system, and that it is provable that programs that are verified with this typechecker are well-typed. Having an OCaml implementation of this is very interesting because it allows us to see the size and shape of a function with such deeply encoded and knowable semantics. Each of the sections below walks through one of the potential forms that the typechecker will encounter as a program is typechecked. Put all together, it can typecheck any well-formed program in the STLC.

#### Typing variables

The first step toward creating a basic type system for the Lambda-Calculus is to provide a mechanism for the typing of variables. As Pierce explains, there are type systems with different approaches to determining the type safety of their terms. *Explicitly typed* languages, like the Simply Typed Lambda-Calculus, rely on annotations to determine if terms are type safe. *Implicitly typed* languages use analysis and type reconstruction to determine types. In order to keep things basic, we begin with an annotated, or explicit language where variables are declared along with their types.

The first step of the inversion lemma on the typing relation reads as follows:

{% highlight bash %}
If Γ ⊢ x:R, then x:R ∈ Γ.
{% endhighlight %}

First, let's translate this from the propositional form to a less symbolic sentence. 

> "If variable x is declared with type R, then the typing context contains the mapping from x to R."

And now, the line of code in the **typeof** function which deals with variables:

{% highlight ocaml %}
TmVar(fi,i,_) -> getTypeFromContext fi ctx i
{% endhighlight %}

OCaml's pattern matching facilities come in handy to declutter the function a bit. Each step in the inversion lemma will be accompanied by a similarly shaped form:

{% highlight ocaml %}
MatchedPattern(values...) -> ... (* execute when MatchedPattern is matched *)
{% endhighlight %}

When the interpreter happens upon a variable (`TmVar(fi,i,_)`), it can derive its type by looking up the type by index in the typing context. The function which accomplishes this, `getTypeFromContext`, does just this. It's a simple intuition that is matched quite nicely by the code.

#### Typing abstractions

Typing abstractions (or lambda expressions, or functions as they are known in programming languages) is probably the most interesting aspect of constructing a Simply-Typed Lambda Calculus. If you've seen type systems like those in Haskell or OCaml, you may be familiar with function type syntax like the following:

{% highlight ocaml %}
# let square x = x * x;; (* entered by the user *)
-> val square : int -> int = <fun> (* returned by the type inferencer *)
{% endhighlight %}

Above, the user enters the definition of the `square` function in the REPL, and the type inferencer, based on the types for the `*` multiplication function, guesses that it is a function that takes an `int` and returns an `int`, which is written `int -> int`. The formalism for the Simply-Typed Lambda Calculus uses similar notation. The `->` operator is used to denote that a function accepts a value with the type on the left hand side of the arrow, and returns a value with the type on the right hand side of the arrow.

In the initial presentation of these ideas in the book, typing functions actually comes first, and the other definitions follow. Since up until Chapter 9, we have only seen simply typed expressions such as variables with declared types, the typing relation we have no longer holds, as we saw above. As Pierce states:

> "This changes the typing relation from a two-place relation, **t:T**, to a three-place relation **Γ ⊢ t:T**, where **Γ** is a set of assumptions about the types of the free variables in **t**."

The second step of the inversion lemma deals with these, and reads as follows:

{% highlight bash %}
If Γ ⊢ λx:T1.t2:R, then R = T1 -> R2 for some R2 with Γ, x:T1 ⊢ t2:R2.
{% endhighlight %}

> "If a function is declared which expects a term of type T1 and returns a term t2, then the function has type T1->R2 where t2:R2."

It's nice to see the formal construction of the `->` operator, so now let's see the code:

{% highlight ocaml %}
TmAbs(fi,x,tyT1,t2) ->
  let ctx' = addbinding ctx x (VarBind(tyT1)) in
    let tyT2 = typeof ctx' t2 in
      TyArr(tyT1, tyT2)
{% endhighlight %}

When the matched pattern is an **abstraction**, declare an intermediate representation of the typing context, adding the binding declared on the input variable in the abstraction. Calculate the value of the type for t2 by looking it up in the context.

#### Typing application

Application (also known function application) shows how we can compose terms to perform computation. `t1 t2` could be, for example `λx:Boolean.x true`, which would apply the identity function to the value true. Here's how it looks in the lemma:

{% highlight bash %}
If Γ ⊢ t1 t2 :R, then there is some type T11 such that Γ ⊢ t1:T11 -> R 
and Γ ⊢ t2:T11.
{% endhighlight %}

This can be read as:

> "If the application of t1 to t2 has type R, then there is some type T11 where T11 -> R. Additionally, t2 has type T11."

It has taken me quite a bit of time to be able to work through the symbols, but I believe that this captures the intuition. The OCaml implementation can be seen here:

{% highlight ocaml %}
TmApp(fi,t1,t2) ->
  let tyT1 = typeof ctx t1 in
  let tyT2 = typeof ctx t2 in
  (match tyT1 with
      TyArr(tyT11,tyT12) -> (* looking for the Arrow Type for functions *)
        if (=) tyT2 tyT11 then tyT12
        else error fi "parameter type mismatch"
    | _ -> error fi "arrow type expected")
{% endhighlight %}

Here we see that typing function application boils down to checking the types of the two terms in question and looking for appropriate supporting types in the typing context. The types of t1 and t2 are stored and then the left hand side and right hand side of an arrow type for the function t1 are composed and searched for in the typing context. You can follow through by applying arguments to this function mentally and seeing what you arrive at - the errors are useful for guidance.

#### Typing Boolean values

Our Simply Typed Lambda-Calculus has been extended to include boolean values, which is a good thing, because otherwise it would be pretty boring. Typing boolean values is straightforward because they are built into the language. I'll repeat the definitions for true and false for the sake of completeness:

{% highlight bash %}
If Γ ⊢ true : r, then R = Bool.
{% endhighlight %}

> "If term r is true, then its type is Bool."

{% highlight ocaml %}
TmTrue(fi) -> 
  TyBool
{% endhighlight %}

If the interpreter encounters the value `true`, we know it is of type Boolean.

{% highlight bash %}
If Γ ⊢ false : r, then R = Bool.
{% endhighlight %}

> "If term r is false, then its type is Bool."

{% highlight ocaml %}
TmFalse(fi) -> 
  TyBool
{% endhighlight %}

If the interpreter encounters the value `false`, we know it is of type Boolean.

#### Typing conditional statements

After we have typed variables, functions and their application, and booleans, we can type conditional statements. The Simply Typed Lambda-Calculus has the facility for an `if...then...else` statement, and here is its formal statement, the final step in the inversion lemma:

{% highlight bash %}
If Γ ⊢ if t1 then t2 else t3 : R, then Γ ⊢ t1 : Bool and Γ ⊢ t2, t3 : R.
{% endhighlight %}

As often as we have used if statements as programmers, we don't always see them looking like this. Here's an interpretation:

> "If t1, t2, and t3 are the three parts of a well typed conditional, then t1 is a boolean and t2 and t3 are the same type."

And now the code:

{% highlight ocaml %}
TmIf(fi,t1,t2,t3) ->
  if (=) (typeof ctx t1) TyBool then
    let tyT2 = typeof ctx t2 in
    if (=) tyT2 (typeof ctx t3) then tyT2
    else error fi "arms of conditional have different types"
  else error fi "guard of conditional not a boolean"
{% endhighlight %}

We check the type of the first term to make sure it is a boolean and then compare the types of t2 and t3. Again, seeing the error messages helps us see the form of the conditional in the code.

We now have conditionals! Nice. And with that, we can compute quite a bit.

#### Conclusion

Type systems in the wild are often large, scary, unapproachable things. Working through some relatively simple logic in "Math" and seeing how it manifests as code has helped me see that at their core, they are really not very different at all. Understanding the boundaries between theory and application is important for practitioners as well as theorists, and seeing how these systems are implemented is very instructive in this regard.

In my estimation, Pierce is correct and the idea of a *translation* does work. When the inversion lemma is written as OCaml code, it bears the realities of the system it runs on: it has to handle errors with words, use specific names for functions, etc. To me, that's a beautiful thing.



#### Works Cited

*All quotes unless otherwise cited from Pierce, all code from <a href="http://www.cis.upenn.edu/~bcpierce/tapl/checkers/">provided implementations</a>.*

<a id="bib1">[1]</a> Benjamin C. Pierce. 2002. *Types and Programming Languages*. MIT Press, Cambridge, MA, USA.
