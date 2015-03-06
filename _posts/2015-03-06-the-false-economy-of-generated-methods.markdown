---
layout: post
title: "The False Economy Of Metaprogramming"
published: true
other: true
---
# 
# 
### The False Economy Of Metaprogramming

Modern web frameworks often attempt to provide "convenience" and "expressiveness" to their users by generating code using a technique commonly called either "template programming" or "metaprogramming." It often starts with code like this:

{% highlight ruby %}
class Foo < SomeVeryLargeORMClass
  attribute :bar, Boolean         
  attribute :baz, String
end
{% endhighlight %}

Here we're declaring a class `Foo` which inherits from `SomeVeryLargeORMClass`. We're using the class method `attribute`, which comes from `SomeVeryLargeORMClass` to declare a field named `bar`, which is a `Boolean`, and a field named `baz`, which is a `String`.

There is already a whole lot of functionality being included in our class simply because we inherit from `SomeVeryLargeORMClass`, and much of it is useful. We don't have to connect to the database directly from this class to query it, and it's nice and neat to be able to declare our database using a nice `DSL` like `attribute`. Unfortunately, that's not where it tends to stop.

In addition to getting setter methods like `Foo.new.bar=` and getter methods like `Foo.new.bar` "for free," we also get a lot of other things. Things that might seem nice on the surface, but cross an important axis: they generate more incidental complexity than the convenience they supply is worth.

An example of this is a method like `Foo.new.bar?`. For `Boolean` fields in ORMs, it is common to see "question mark" methods generated alongside other getters. The ORM uses sophisticated reflection and metaprogramming techniques to determine the type of the field and then insert other methods accordingly. This leads to situations where a developer might write the following code inside the `Foo` method:

{% highlight ruby %}
def a_method
  if bar?
    # do something
  else
    # do something else
  end
end
{% endhighlight %}

The method `bar?` is generated for us because `bar` is a `Boolean`. The method is not something you can find by searching through the code base. It is only somethig you can know if you know how all of the underlying machinery of `SomeVeryLargeORMClass` works. After a while, this stops being convenient, and starts being annoying and expensive.

According to everyone's favorite primary source of infalible and always perfect truths, Wikipedia, a false economy is defined as:

> "... an action that saves money at the beginning but which, over a longer period of time, results in more money being spent or wasted than being saved."

If the "money we spend" at the beginning is everything that we get for "free" by inheriting from `SomeVeryLargeORMClass`, then the money "being spent or wasted" is our attention, our ability to know what is going on, to reason about our code easily without having to boot into `SomeVeryLargeORMClass` every time.

So called "question mark" methods are a prime example of code that does nothing more than "look nice" without giving us any other benefit: in fact I feel they cost us more than they provide us with. For code to be "expressive" does not mean that it should "look" or "feel" like "natural language." Code can't look like natural language and anything that goes this far is a costly half-measure that we will regret in the long run.
