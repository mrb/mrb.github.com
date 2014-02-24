---
layout: post
title: "Translating a Typechecker from 'Math' to OCaml"
published: false
tapl: true
---
# 

<div class="lead">This post is one of a series on <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a> by Benjamin C. Pierce.</div>

# 
### Translating a Typechecker from 'Math' to OCaml

Chapters 9 and 10 of Benjamin C. Pierce's <a href="http://www.cis.upenn.edu/~bcpierce/tapl/">Types and Programming Languages</a> are dedicated to the presentation and implementation of a Simply Typed Lambda-Calculus with booleans. After coming across this idea many times - a Lambda-Calculus with types, it is very satisfying to read a thorough and well-executed explanation in the context of the progression from a Lambda-Caluclus with no types to a full blown typechecked interpreter.

Most impressive and resonant to me amongst the material, however, is one bit that Pierce mentions towards the end of Chapter 10. After describing the calculus and discussing its implementation, Pierce notes that:

> "The typechecking function **typeof** can be viewed as a direct translation of the typing rules for the Simply Typed Lambda-Calculus, or, more accurately, as a transcription of the inversion lemma."

The idea that moving between the mathematical/symbolic expression and code could be so straightforward was 

> "The second view is more accurate because it is the inversion lemma that tells us, for every syntactic form, exactly what conditions must hold in order for a term of this form to be well typed."

*If you'd like to follow along, I suggest at least opening up the <a href="https://gist.github.com/mrb/9105122">full OCaml definition of the typechecking function here</a>, or better yet, download and check out the <a href="http://www.cis.upenn.edu/~bcpierce/tapl/checkers/simplebool/">full source code for the interpreter</a>, as provided by Pierce.*

#### Lemma - Inversion of the Typing Relation

In order to prove the type safety of the Simply Typed Lambda-Calculus, Pierce constructs an *inversion lemma* which 9

**Γ** is known as the *typing context*, which consists of "a sequence of variables and their types." For explicitly typed languages, it is enough to assume that the declared type should hold in order for safety to be preserved.

**⊢** "Turnstile" operator

#### Typing a variable

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

#### Typing functions

Typing functions (or lambda expressions, or Abstractions as they are known in the formalism) is probably the most interesting aspect of constructing a Simply-Typed Lambda Calculus. If you've seen type systems like those in Haskell or OCaml, you may be familiar with function type syntax like the following:

{% highlight ocaml %}
# let square x = x * x;; (* entered by the user *)
-> val square : int -> int = <fun> (* returned by the type inferencer *)
{% endhighlight %}

Above, the user enters the definiton of the `square` function in the repl, and the type inferencer, based on the types for the `*` multiplication function, guesses that it is a function that takes an `int` and returns an `int`, which is written `int -> int`. The formalism for the Simply-Typed Lambda Calculus uses similar notation. The `->` operator is used to denote that a function accepts a value with the type on the left hand side of the arrow, and returns a value with the type on the right hand side of the arrow.

In the initial presentation of these ideas in the book, typing functions actually comes first, and the other definitions follow. Since up until Chapter 9, we have only seen simply typed expressions such as variables with declared types, the typing relation we have no longer holds. As Pierce states:

> "This changes the typing relation from a two-place relation, **t:T**, to a three-place relation **Γ ⊢ t:T**, where **Γ** is a set of assumptions about the types of the free variables in **t**."

The second step of the inversion lemma deals with these, and reads as follows:

{% highlight bash %}
If Γ ⊢ λx:T1.t2:R, then R = T1 -> R2 for some R2 with Γ, x:T1 ⊢ t2:R2.
{% endhighlight %}

> "If a function is declared which expects a variable of type T1, then the function has type T1->R2 for some return type R2, "

{% highlight ocaml %}
TmAbs(fi,x,tyT1,t2) -> (* *)
  let ctx' = addbinding ctx x (VarBind(tyT1)) in
  let tyT2 = typeof ctx' t2 in
  TyArr(tyT1, tyT2)
{% endhighlight %}

When the matched pattern is an **abstraction**, declare an intermediate representation of the typing context, adding the binding 

#### Typing function application

{% highlight bash %}
If Γ ⊢ t1 t2 :R, then there is some type T11 such that Γ ⊢ t1:T11 -> R 
and Γ ⊢ t2:T11.
{% endhighlight %}

{% highlight ocaml %}
TmApp(fi,t1,t2) ->
  let tyT1 = typeof ctx t1 in
  let tyT2 = typeof ctx t2 in
  (match tyT1 with
      TyArr(tyT11,tyT12) ->
        if (=) tyT2 tyT11 then tyT12
        else error fi "parameter type mismatch"
    | _ -> error fi "arrow type expected")
{% endhighlight %}

#### Typing simple Boolean values

Our Simply Typed Lambda-Calclulus has been extended to include boolean values, which is a good thing, because otherwise it would be pretty boring. Typing boolean values is straightforward because they are built into the language. I'll repeat the definitons for true and false for the sake of completeness:

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

After we have typed variables, functions and their application, and booleans, we can type conditional statements. The Simply Typed Lambda-Calclulus has the facility for an `if...then...else` statement, and here is its formal statement, the final step in the inversion lemma:

{% highlight bash %}
If Γ ⊢ if t1 then t2 else t3 : R, then Γ ⊢ t1 : Bool and Γ ⊢ t2, t3 : R.
{% endhighlight %}

> "If t1, t2, and t3 are the three parts of a well typed conditional, then t1 is a boolean and t2 and t3 are the same type."

{% highlight ocaml %}
TmIf(fi,t1,t2,t3) ->
  if (=) (typeof ctx t1) TyBool then
    let tyT2 = typeof ctx t2 in
    if (=) tyT2 (typeof ctx t3) then tyT2
    else error fi "arms of conditional have different types"
  else error fi "guard of conditional not a boolean"
{% endhighlight %}

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited

*All quotes unless otherwise cited from Pierce, all code from <a href="http://www.cis.upenn.edu/~bcpierce/tapl/checkers/">provided implementations</a>.*

<a id="bib1">[1]</a> Benjamin C. Pierce. 2002. *Types and Programming Languages*. MIT Press, Cambridge, MA, USA.
