---
layout: post
title: "Matter, Anti-Matter, and the Unified Theory of Garbage Collection"
published: false
---
# 
### Matter, Anti-Matter, and the Unified Theory of Garbage Collection

Introduced in 1960 by John McCarthy and George Collins respectively, *tracing* and *reference counting* are both forms of the type of automatic memory management known as *garbage collection* (GC).<a href="#bib4">[4]</a> <a href="#bib2">[2]</a> This name is derived from the fact that GC algorithms exist to seek out and reclaim memory that has been allocated, but is no longer needed.

Reference counting and tracing are often viewed as fundamentally different, incompatible forms of memory management. An extraordinarily insightful 2004 paper by Bacon, Cheng, and Rajan, *A Uniﬁed Theory of Garbage Collection* draws incredible parallels between these two approaches to GC.<a href="#bib1">[1]</a> It begins by introducing the insight that tracing and counting are related and goes so far as to formalize and generalize the work done by GC algorithms in order to prove their point: these approaches are in fact "algorithmic duals" of each other which take the same approach from different starting points. In other words, the difference is that:

> "...tracing operates on live objects, or 'matter', while reference counting operates on dead objects, or 'anti-matter'. For every operation performed by the tracing collector, there is a precisely corresponding anti-operation performed by the reference counting collector."

#### The Technique

I'm very interested in this deep insight and thought it would be fun to share the technique that they use to demonstrate their point. While the heart of the paper is actually based on a mathematical formalization known as a *fix-point formulation,* the basic intuition is easily expressed. It is more or less as follows:

1. Explain the basics of naive implementations of tracing and reference counting
2. Introduce small, very commonly applied optimizations to each algorithm which do not impact their complexity
3. Illustrate how these optimizations "pull" each paradigm toward a common center-point
4. Examine *real-world* GCs and illustrate that they are in fact, hybrid counter-tracers

A naive implementation of *reference counting* is very simple. Objects on the heap have an associated *reference count.* References are maintained by a *write barrier* through which all destructive actions are routed. Here's a Ruby pseudocode version of the algorithm, adapted from Jones et al.'s *The Garbage Collection Handbook.*<a href="#bib3">[3]</a>

{% highlight ruby %}
# The program interface to the heap
def new
  ref = allocate
  if ref.nil?
    raise "Out of memory"
  end
  ref.ref_count = 0
  ref
end

# The write barrier - all writes are redefined to include administrative
# duties for reference counts.
def write(src, i, ref)
  add_reference(ref)
  delete_reference(src[i])
  src[i] = ref
end

def add_reference(ref)
  rc.ref_count = rc.ref_count + 1
end

def delete_reference(ref)
  rc.ref_count = rc.ref_count - 1
  if rc.ref_count == 0
    ref.pointers.each do |field|
      delete_reference(field.address)
    end
    free(ref)
  end
end
{% endhighlight %}

The naive mark and sweep implementation is even simpler than reference counting in the respect that no write barrier is involved. When objects are allocated, if no memory is available, the GC is invoked. Starting from a set of objects (the *matter* in Bacon et al.'s formulation) known as the *roots*, the entire reachable heap is scanned, and objects which are referenced are *marked* as alive. The full heap is then scanned and objects which aren't marked are presumed dead, and collected. Here's Ruby pseudocode for a naive mark and sweep, again translated from Jones.

{% highlight ruby %}
# The program interface to the heap
def new
  ref = allocate
  if ref.nil?
    # The following two methods are the GC
    mark_from_roots
    sweep(HEAP_START, HEAP_END)
    ref = allocate
    if ref.nil?
      raise "Out of memory"
    end
  end
  ref
end

def mark_from_roots
  worklist = Worklist.new
  heap_roots.each do |root|
    ref = root.address
    if ref && !ref.is_marked?
      ref.set_marked
      worklist << ref
      # performs mark on the descendents of this ref
      recursive_mark(ref.children, worklist)
    end
  end
end

def sweep(heap_start, heap_end)
  object_cursor = heap_start
  while object_cursor < heap_end
    if object_cursor.is_marked?
      object_cursor.unset_marked
    else
      free(object_cursor.ref)
    end
    object_cursor.next
  end
end
{% endhighlight %}

# 
#### The Tweaks

There are situations in which the way that naive reference counting algorithms allocate and free memory are desirable, but for the most part, it is desirable to offload some of the tax on the *mutator*, or main thread of program execution. While not a recommended optimization, in order to push the two paradigms toward each other, the authors suggest a simple tweak to the reference counting algorithm: buffer decrement operations. Under this algorithm, when space is needed during an allocation, decrement operations which have been buffered in a *work-list* are recursively iterated over. Objects with a zero reference count are collected and objects which reference them are handled appropriately. This work-list contains *anti-matter.*

{% highlight ruby %}
def new
  ref = allocate
end

def collect
  scan_by_counting
  sweep_for_counting
end

def scan_by_counting
  work_list.each do |work|
    work.ref_count = work.ref_count - 1
    if work.ref_count == 0
      recursively_scan(work)
    end
  end
end

def sweep_for_counting
  object_cursor = heap_start
  while object_cursor < heap_end
    if object_cursor.ref_count.zero?
      free(object_cursor.ref)
    end
    object_cursor.next
  end
end

def dec(x)
  work_list << x
end

def inc(x)
  x.ref_count = x.ref_count + 1
end

def assign(a, p)
  old = a
  a = p
  dec(old)
  inc(p)
end
{% endhighlight %}

The mark and sweep algorithm is altered in a similarly interesting way: instead of maintaining a *mark bit* for whether the object is live or not, a true reference count is maintained. This doesn't impact the algorithm in complexity or really change it much, but it does allow the Ruby pseudocode for tracing and counting to look eerily similar. Here they are, based on the work in Bacon.

{% highlight ruby %}
def new
  ref = allocate
end

def collect
  initialize_for_tracing
  scan_by_tracing
  sweep_for_tracing
end

def initialize_for_tracing
  work_list << heap_roots
end

def scan_by_tracing
  work_list.each do |work|
    work.ref_count = work.ref_count + 1
    if work.ref_count == 1
      recursively_scan(work)
    end
  end
end

def sweep_for_tracing
  object_cursor = heap_start
  while object_cursor < heap_end
    if object_cursor.ref_count.zero?
      free(object_cursor.ref)
    else
      object_cursor.ref_count = 0
    end
    object_cursor.next
  end
end
{% endhighlight %}

In this modified form, the heart of each algorithm is very similar. As the authors say:

> "By changing two characters in the heart of the algorithm, we have changed from tracing to reference counting!"

And indeed I applaud their use of an exclamation point. This is truly an amazing insight and the mechanics of explaining it are made very plain in the original paper, which as always I suggest you read. The work-list in one algorithm is full of *matter,* and in the other, *anti-matter.* The heap is swept, counts are maintained, garbage is collected. What do we have to learn from the similarities of these two algorithms? Most compellingly, the authors demonstrate that "realistic" Garbage Collectors that we use every day are all hybrids.

#### Real-World Hybrids

> "...all high-performance garbage collectors are in fact hybrids of tracing and reference counting techniques."

Generational GC, <a href="http://michaelrbernste.in/2013/05/28/a-generation-ago-a-thoroughly-modern-sampling.html">which I have written about elsewhere</a>, is ane excellent example of a class of GC algorithms which are hybrids. Generational GC is based on the hypothesis that most objects "die young," so objects which have survived multiple generations should not be swept before objects which have not. These "generations" are maintained by dividing the heap into a *young* and *mature* space which are each collected at their own rate. There are issues with GCing objects when older generation objects refer to younger generation objects, but not vice versa. In order to avoid safety issues, generational GCs maintain a *remembered set* of objects in the young generation which are pointed to by objects in the mature space. From the paper:

> "The remembered set is maintained by a write barrier which is executed at every heap pointer update. The write barrier checks whether the pointer crosses from mature space to the nursery, and if so adds it to the remembered set. By now, the analogy with previous collectors should be somewhat obvious: the write barrier is the assign function, which we have observed is correlated to the reference counting portion of a collector."

In other words, Generational GCs are hybrid tracer-collectors. Other compelling examples are offered in the paper. Additionally, the cost calculation formula that the authors devised is thoroughly discussed, cycle collection is treated in-depth, and more.

#### Conclusions

This post merely attempts to expose the central most interesting technique used in this paper to illustrate the point of the "algorithmic duality" between reference counting and mark and sweep, or tracing, garbage collection. After implementing various real-world GCs, the authors had formed a deep intuition for the heart of GC algorithms and this insight sprang from this experience. After studying GC heavily in preparation for this blog and a conference talk, I felt that nothing made the abstract concepts at play click for me as well as this paper did. I hope I have been able to share some of this paper's insight if not some of its enthusiasm.

After demonstrating these similarities, the authors also posit that the design of GCs could be "made more deliberate." Instead of choosing between reference counting and tracing, designers should consider the following choices:

> "Partition: divide memory (heap, stack, and global variables) into a set of partitions, within which different strategies may be applied; Traversal: for each partition, decide whether the object graph will be traversed by tracing or reference counting; and Trade-offs: for each partition, choose space-time trade-offs such as semi-space vs. sliding compaction, pointer reversal vs. stack traversal, etc."

This shows that the GCs which are successful in real-world application, thus exhibiting either a great degree of flexibility through tunable parameters or specialization in a field like Real-Time GC, are those which are chosen based on a fine-grained understanding of their operational characteristics.

On a parting note, I am reminded by this paper of the tensions between other "systems," such as Object-Oriented and Functional Programming. While I know it is a bit of a stretch, there are many texts which, using a Lisp implementation for example, stretch a purely functional system until it appears Object Oriented, or torture the Object Oriented principles until they appear functional. A distant, vague connection, perhaps, but that's enough for me.

#### Works Cited

<a id="bib1">[1]</a>David F. Bacon, Perry Cheng, and V. T. Rajan. *A Uniﬁed Theory of Garbage Collection* In OOPSLA 2004 [OOPSLA04], 2004, pages 50-68

<a id="bib2">[2]</a> George E. Collins. *A method for overlapping and erasure of lists.* Communications of the ACM, 3(12):655-657, December 1960.

<a id="bib3">[3]</a>Richard Jones, Antony Hosking, and Eliot Moss. *The Garbage Collection Handbook: The Art of Automatic Memory Management.* CRC Applied Algorithms and Data Structures. Chapman & Hall, August 2012.

<a id="bib4">[4]</a>John McCarthy. *Recursive functions of symbolic expressions and their computation by machine, Part I.* Communications of the ACM, 3(4):184-195, April 1960.

