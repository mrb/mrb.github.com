---
layout: post
title: "Representing Numbers and Watching core.logic Work"
published: false
other: true
---
# 
# 
### Representing Numbers and Watching core.logic Work

{% highlight clojure %}
(defn peanoo
  "A relation where n is an Arabic integer and pn is its Peano number"
  [n pn]
  (fd/in n (fd/interval 0 1000))
  (conde
    [(fd/== n 0) (== :z pn)]
    [(fresh [n-1 pn-1]
      (fd/in n-1 (fd/interval 0 1000))
      (fd/- n 1 n-1)
      (== [:s pn-1] pn)
      (peanoo n-1 pn-1))]))
{% endhighlight %}

{% highlight clojure %}
(run* 
  [q]
  (peanoo 4 q))
; ({<lvar:q__348930> [:s <lvar:pn-1__348932>], <lvar:n-1__348931> 3}
; {<lvar:pn-1__348932> [:s <lvar:pn-1__348934>], <lvar:n-1__348933> 2,
;   <lvar:q__348930> [:s <lvar:pn-1__348932>], <lvar:n-1__348931> 3}
; {<lvar:pn-1__348934> [:s <lvar:pn-1__348936>], <lvar:n-1__348935> 1,
;   <lvar:pn-1__348932> [:s <lvar:pn-1__348934>], <lvar:n-1__348933> 2,
;   <lvar:q__348930> [:s <lvar:pn-1__348932>], <lvar:n-1__348931> 3}
; {<lvar:pn-1__348936> [:s <lvar:pn-1__348938>], <lvar:n-1__348937> 0, 
;   <lvar:pn-1__348934> [:s <lvar:pn-1__348936>], <lvar:n-1__348935> 1,
;   <lvar:pn-1__348932> [:s <lvar:pn-1__348934>], <lvar:n-1__348933> 2,
;   <lvar:q__348930> [:s <lvar:pn-1__348932>], <lvar:n-1__348931> 3}
; {<lvar:pn-1__348938> :z, <lvar:pn-1__348936> [:s <lvar:pn-1__348938>],
;   <lvar:n-1__348937> 0, <lvar:pn-1__348934> [:s <lvar:pn-1__348936>],
;   <lvar:n-1__348935> 1, <lvar:pn-1__348932> [:s <lvar:pn-1__348934>],
;   <lvar:n-1__348933> 2, <lvar:q__348930> [:s <lvar:pn-1__348932>],
;   <lvar:n-1__348931> 3}
; [:s [:s [:s [:s :z]]]])
{% endhighlight %}

{% highlight clojure %}
(run*
  [q]
  (peanoo q [:s :z]))
; ({<lvar:pn-1__348844> :z, 
;   <lvar:q__348842> #clojure.core.logic.SubstValue{:v :clojure.core.logic/unbound,
;   :doms {:clojure.core.logic/fd <interval:1..1001>}, :eset nil},
;   <lvar:n-1__348843> #clojure.core.logic.SubstValue{:v :clojure.core.logic/unbound,
;   :doms {:clojure.core.logic/fd <interval:0..1000>}, :eset nil}}
; {<lvar:pn-1__348844> :z, <lvar:q__348842> 1, <lvar:n-1__348843> 0}
; 1)
{% endhighlight %}

{% highlight clojure %}
(run*
  [q]
  (peanoo 0 q))
; ({<lvar:q__348807> :z}
; :z)
{% endhighlight %}

{% highlight clojure %}
(run*
  [q]
  (fd/in q (fd/interval 0 1000))
  (peanoo q :z))
; ({<lvar:q__348827> 0}
; 0)
{% endhighlight %}

*If you like this article, please consider supporting my writing on <a href="https://www.gittip.com/mrb_bk/">gittip.</a>*

#### Works Cited
