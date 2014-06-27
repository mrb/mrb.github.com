---
layout: post
title: "The Promise of Relational Programming"
published: true
other: true
---
# 
# 
### The Promise of Relational Programming

Will Byrd's work in programming languages is fascinating and is only getting deeper.<a href="#bib2">[2]</a>  At the end of 2013, Will attended the Code Mesh conference to speak alongside another awesome researcher, Nada Amin, and was interviewed about his research on the side.<a href="#bib3">[3]</a> I have often recommended that people check out <a href="http://minikanren.org/">MiniKanren</a> (the main language of Will's focus) and other areas of relational programming or logic programming research, but I haven't done a good job explaining what I thought was interesting about it.

I think the interview that was recently published at InfoQ is now my go-to resource for a good explanation of why people should care about Will's work and relational programming in general. I recommend <a href="http://www.infoq.com/interviews/byrd-relational-programming-minikanren">watching the video or reading the transcript,</a> and I wanted to highlight a specific quote.

Will starts out this particular section of the inteview discussing program synthesis and ends up describing the big idea behind pursuing relational programming, relating his work to other paradigms in a way that I really enjoyed:

> "It is a similar situation to Scheme or Lisp or ML, these functional languages which have been around for a long time where in theory, you are supposed to do everything purely and you are supposed to write everything in this nice style where you are not doing any mutation, but those languages have mutation that you can change variable state and stuff like that all the time, whenever you get stuck. When Haskell came along and made a commitment to purity because of the laziness of the language required it and because of that, there was a lot of innovation in using monads to represent mutable state in a more pure way. I see a similarity here with what is happening with miniKanren relational programming versus, say, Prolog and logic programming."<a href="#bib1">[1]</a>

I love the connection that Will draws here, and I think that once you witness the magic of relational programs, you can start to see that widespread application of this kind of program facility would be a powerful thing indeed. The ability to apply relational, rule-based logic inside languages of any given paradigm is worth pursuing because that is often where both imperative and functional languages feel clumsy.

I think this is the beginning of an important dialogue from which we can all benefit greatly.



#### Works Cited

<a id="bib1">[1]</a>"William Byrd on Logic and Relational Programming, miniKanren" Interview, William Byrd by Werner Schuster. <a href="http://www.infoq.com/interviews/byrd-relational-programming-minikanren">Available here</a>

<a id="bib2">[2]</a>*William E. Byrd's homepage.* <a href="http://webyrd.net/">http://webyrd.net/</a>

<a id="bib3">[2]</a>*Nada Amin's homepage.* <a href="http://people.csail.mit.edu/namin/">http://people.csail.mit.edu/namin/</a>
