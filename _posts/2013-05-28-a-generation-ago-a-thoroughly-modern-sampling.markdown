---
layout: post
title: A Generation Ago, A Thoroughly Modern Sampling
published: true
gc: true
---
# 
### A Generation Ago, A Thoroughly Modern Sampling

The <a href="http://www.csail.mit.edu/timeline/timeline.php">Artificial Intelligence Laboratory at the Massachusetts Institute of Technology</a> was a keystone institution responsible for a sizable share of what we now think of as hacker culture, fusing deep Mathematics and Computer Science knowledge with a culture of progress, exploration, and documentation. An astonishing quantity of written material came from the Lab, including the <a href="http://publications.csail.mit.edu/ai/pubs_browse.shtml">*"A.I. Memos,"*</a> a series of papers which cover research topics engaged in by a variety of many of the most brilliant and imaginative minds in Computer Science history.

The origins of Lisp are in these memos, including many written by our field's pioneers like <a href="http://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)">John McCarthy</a>, who was communicating the accomplishments of the language via beautiful, roughly typeset pages with headings like this:

<center><img src="http://michaelrbernste.in/images/aimemo.png"></center>

McCarthy, Minsky, Sussman, Steele, and more all contributed fascinating, groundbreaking insights into their research or the research of their students,
and things remained interesting throughout the long history of the organization. As they tried to build faster, more efficient, and more powerful machines, they continued to publish their findings, curiosities, and musings as memos.

This post couldn't possibly serve as an overview of the breadth or depth of the work done in these memos, but recent research made it possible for me to *have to* read one of them while studying Generational Garbage Collection, and I found a lot of insights and surprises beyond the known bit of innovation I was seeking. I was surprised by many other things, including the influence that Lisp had on the design of the algorithm, the design considerations for modern-for-1981 computers, how instrumenting and tuning the generational GC was invented right alongside the algorithm itself, and how Lieberman and Hewitt are interested in memory management's impact on code style.

#### A Tome From Two Great Minds

*<a href="ftp://publications.ai.mit.edu/ai-publications/pdf/AIM-569a.pdf">"A Real Time Garbage Collector Based on the Lifetimes of Objects"</a>(pdf link)* by Henry Lieberman and Carl Hewitt introduced the concept of generational garbage collection, the algorithm that is used in what is widely considered the fastest and most modern virtual machine for running multi-purpose, object-oriented code, the Java Virtual Machine (JVM).<a href="#bib1">[1]</a> <a href="#bib2">[2]</a>

A multi-sectioned, appendix-heavy monster, A.I. Memo No. 569a was published in October of 1981 with the Keywords:

> "Real time garbage collection, reference counting, Lisp, object-oriented programming, virtual memory, parallel processing"

and touts an algorithm with the following properties:

> "Makes storage for short-lived objects cheaper than storage for long-lived objects; Operates in real time - object creation and access times are bounded; Increases locality of reference, for better virtual memory performance; Works well with multiple processors and a large address space."

At this point it should not be novel for me that authors on the cutting edge of technology one year after my birth, a generation ago, should be concerned with more or less the same exact things that I am, but for some reason, it is. The origin of deep ideas beget generations of implementations, each of them nuanced and purposeful. Plus, I love the style and depth of this paper. I love the way the audience is treated, as knowledgeable and excited, which the authors clearly are.

#### There's Lisp In The Generational GC

Hewitt and Lieberman's main motive in working on a Garbage Collection algorithm was to improve the performance and scalability of Artificial Intelligence programs. While the authors are primarily concerned with Lisp, as their proclivity for name-dropping other obscure programming languages (**AMORD**, **ETHER**, **KRL**, and **OMEGA** to name most of them) proves, they also had their sights set on other pastures.

Artificial Intelligence applications are characterized as long-running and processor intensive, and the authors recognize that existing algorithms for automatic memory management tend to penalize programmers for code that should be faster. A metaphor of "renting vs. buying" is invoked, where there shouldn't be the same amount of overhead paid for short-lived objects as for long-lived ones, and there should be many ways for the system to know if an object will be long lived.

The algorithm is described as an extension of Baker's copying algorithm, which works roughly like this:

0. The heap is divided into two spaces, the *from space* and the *to space*
1. Memory is allocated in the *from space*
2. When the *from space* runs out of memory, the space is scanned in a *scanning* process and objects are *evacuated* to the *to space*
3. A *flip* operation occurs, and the *from space* is now the *to space* and vice versa
4. Objects with references to objects in the *from space* are updated in a *scavenging* process

Hewitt and Lieberman's algorithm strives to make short lived object allocations cheaper, after the observation that most objects die young, and that it is expensive to scan objects on the heap which are known to be long-lived. Adding the consideration for the lifespan of objects is seen as the central contribution of this paper. It turns out that relying on the so-called "weak generational hypothesis" in and of itself is not enough, but the hypothesis  served as a starting point for a direction that is still seen as fruitful today, over 30 years later.

The generational algorithm starts by considering a Baker like algorithm which substitutes *many smaller regions* for the Baker semi-spaces. The same operations *scanning*, *evacuating*, and *scavenging* occur, but on a smaller scale, per region. The paper explains their primary function:

> "We will use these fine divisions of the address space to vary the rate of garbage collection for each region, according to the age of that region. Recently created regions will contain high percentages of garbage, and will be garbage collected frequently. Older regions will contain relatively permanent data, and will be garbage collected very seldom."

One of the challenging aspects of *copying* or *moving garbage collectors* is dealing with objects that hold references to other objects, particularly if older generation objects hold references to younger generation objects. This is an issue because we want to optimize for the fast creation and destruction of young objects, and if older objects hold references, we will have to make sure that they don't get out of sync. The authors propose an *"entry table,"* where references to young objects from the older generations would be stored in an intermediary table that could be updated, without having to scan all of the older generation objects. This concept is the precedent to the modern concept of the *"remembered set*" and *"write barrier"* techniques in modern generational garbage collectors and is a key "hook" or insight that the authors had.

As clever and shockingly effective as the algorithm is, the salient part is that it was directly inspired by Lisp. The concept arose from software created on a completely different architecture and used and measured in radically different ways, but remains a driving force in practical application of garbage collection in today's virtual machines.

The authors say:

> "We intend to exploit some empirically observed properties of heap storage. Most pointers point *backward in time*, that is, objects tend to point to objects that were created earlier. This is because object creation operations like CONS can only create backward pointers, since the components of the object must exist before the object itself is created.

#### Garbage Collector Tuning: Instrumentation and Heuristics

The simple fact that the age of objects are taken into account helps the authors feel confident that their algorithm will be capable of providing efficient performance for a wide variety of programs. However, they are concerned with measuring and demonstrating this efficiency, lamenting that "judging garbage collection algorithms is tricky." Not ones to shy away from a difficult problem, the authors provide a set of guidelines that we can use to measure aspects of our Lisp programs that could then be applied to garbage collection research. This is a really interesting list:

0. How fast are objects created?
1. How fast do objects become inaccessible?
2. How often do pointers point to objects that are younger than themselves, versus pointing to older objects?
3. How much locality is there in the program?

After adding that "Certainly the trends are in the direction of programs with increased locality and toward programs that rely on object creation rather than modification," the authors lay out several ways in which we might be able to tune how our running programs manage memory.

> "Often a sophisticated user is in a position to know whether a particular object is likely to be relatively temporary or more permanent. The system should be able to take advantage of such knowledge to improve the performance of the program. It might be advantageous to supply the user with several different flavors of object creation operations, so that the system can choose the best allocation strategy appropriate for that kind of object."

One example, above, is given for how changing the programming language itself might make things easier. We are also offered examples of a few numbers that can be tweaked, like region size, in order to accommodate certain programs. Both of these concepts, which are echoed in modern day *compiler hinting* and *GC tuning* are very important to how people think about code and running programs to this day. It is amazing to see that they were introduced alongside the algorithm itself, and thrilling to see the authors discuss these ideas as they apply to a variety of different paradigms, as everything is open, possible, and hackable.

#### Multiple Processors and a "Large Address Space"

1981 was clearly an intense time to be a researcher in Artificial Intelligence. It's interesting to try and imagine the disparity between the depth of the technology at the Lab and the speed of information transfer in the world at large. Clearly the authors of this paper had an imperative to consider what the next few computers might look like while developing algorithms that would suffice on existing ones, because the idea that the generational algorithm would function well for computers with multiple processors and a "large address space" comes up multiple times.

> "Since processors are continually getting cheaper, multiprocessor machines will soon appear. The incentive for using multiple processor machines is especially important for AI applications. Our garbage collection scheme has been designed to be suitable for implementation on multiple processor machines."

The authors describe a very interesting sounding system which *eschews shared memory* in favor of processes with their own heaps which get information passed to them via messages. They have considered the challenges in sharing changing object references and come up with some ideas for tables that can be maintained on the borders between processors to make updating these references simpler.

I was struck by this because of the prevalence of message passing semantics and its role in modern programming languages and garbage collection technology. Languages like <a href="http://golang.org/">Go</a> rely on message passing to reduce shared memory, which relieves some pressure on the garbage collector. <a href="http://www.erlang.org/">Erlang</a> also uses message passing semantics and has per-lightweight-process GC Heaps, making system wide GC pauses very rare. Even though I know that these languages are based on old ideas, it's always cool to see how concepts applied in modern software originate in the primordial swamp of early Computer Science.

Throughout the paper the concept of a system with a "Large Address Space," (*translation:* "a lot of memory") are discussed. There are a variety of challenges associated with running programs *at scale,* and the lab was a place where that was possible. Always trying to build and be prepared for the next wave of hardware capability was a crucial skill for an early hacker, a spirit that many 21st century programmers can empathize with.

#### Style Matters

The final section of the paper, "Cheaper short term memory may improve programming style," begins:

> "It is our hope that making the use of short- lived objects cheaper will lead to improvements in program clarity. Often, complications in program structure are motivated by the need to avoid creating short-lived objects for intermediate results."

We see this habit in modern programming languages as well, and it is known to hurt readability. The example that the authors provide (reproduced below, in lowercase, <a href="#app1">as an appendix</a>) shows how the ideal functional implementation of matrix multiplication would allow for a more modular design, while the program that is "considered faster" is more compact, less reusable, and harder to read and understand.

The design of a programming language and the design of the memory management system that supports it have an interesting relationship. It is clear in the provided example that inefficient memory management is used as reasoning for writing programs which are harder to maintain. One of the main reasons for providing a mechanism to create cheap short-lived objects is *stylistic*, to allow for a more expressive ecosystem of usable code. Other ideas including program transformation and a "smart compiler" are tossed around for making it possible for more expressive programs to be more efficient.

#### Generational GC A Generation Later

Modern tunable Garbage Collectors have clear roots in the work Hewitt and Lieberman as presented in this paper. Developers who rely on programming languages with automatically managed memory can learn valuable lessons about the tradeoffs present in their tools by understanding where the ideas they rely on came from, but more than a touchstone for a modern technology workhorse, this paper represents an archeological sampling of a wide swath of deep thought in applied Computer Science that encourages, surprises, and enlightens.

The AI Memos are an extremely fertile ground for modern research. While it's true that what this group of pioneers thought was impossible then may be possible now, it's even clearer that some things we think are impossible now have been possible all along.

# 
*Special thanks to Maciej Katafiasz for correcting some incorrectly transcribed LISP code below.*



<hr/>

# 

#### Works Cited

<a id="bib1">[1]</a> *"A Real-Time Garbage Collector Based on the Lifetimes of Objects"* Henry Lieberman & Carl Hewitt, 1981

<a id="bib2">[2]</a> *"Garbage collection: algorithms for automatic dynamic memory management"* Richard Jones & Rafael Lins, 1996. p. 166

# 
<hr/>

# 

#### Lisp Code Appendix<a id="app1"></a>

The fact that code appeared in this paper is one of the reasons that made me want to write about it. I have become very interested in it as I read the paper over and over again, so I decided to type it out to preserve it, in a non-image format, here. The first section is, according to the authors, clearer but less efficient, both due to the use of creating extra lists and functions for clarity and expressiveness. The functions are composable, which the authors also feel lends to their comprehensibility.

{% highlight clojure %}
(defun dot-product (left-vector right-vector)
  (cond ((or (null left-vector) (null right-vector)) 0)
        ((+ (* (car left-vector) (car right-vector))
          (dot-product
          (cdr left-vector)
          (cdr right-vector))))))

(defun transpose (matrix)
  (cond ((null (car matrix)) nil)
    ((cons (mapcar 'car matrix)
    (transpose (mapcar 'cdr
    matrix))))))

(defun matrix-multiply (left-matrix right-matrix)
  (let ((columns (transpose right-matrix)))
    (mapcar
      '(lambda (row)
               (mapcar
               '(lambda (column)
                        (dot-product row
                         column))
                columns))
                        left-matrix)))
{% endhighlight %}

The second code sample is more efficient because it allocates fewer lists and functions, and performs fewer passes. For this reason, two operations are conflated, making this harder to read, and less reusable.

{% highlight clojure %}
(defun matrix-multiply-without-transposing (left-matrix right-matrix)
  (mapcar
   '(lambda (row)
     (let ((column-index 0)
           (mapcar
             '(lambda (column)
               (prog1 (dot-product-column
                       row
                       right-matrix
                       column-index)
                 (setq column-index
                      (+ column-index 1))))
             (car right-matrix)))))
   left-matrix))

(defun dot-product-column
(row matrix column-index)
  (cond ((null row) 0)
        ((+ (* (car row)
               (nth column-index (car matrix)))
            (dot-product-column
              (cdr row)
              (cdr matrix)
              column-index)))))
{% endhighlight %}
