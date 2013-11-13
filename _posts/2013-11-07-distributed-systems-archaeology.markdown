---
layout: post
title: "Distributed Systems Archaeology"
published: false
dsa: true
---
# 
# 
### Distributed Systems Archaeology

*This post presents a narrative form of the talk I gave at Ricon West 2013. The works cited can <a href="http://michaelrbernste.in/2013/11/06/distributed-systems-archaeology-works-cited.html">be found here</a>, and the slides can <a href="https://speakerdeck.com/mrb/distributed-systems-archaeology">be found here</a>. Video is forthcoming.*

### Introduction 

My name is Michael Bernstein, and I’m Obsessed. Not with anything in particular, just in general.

This talk is called "Distributed Systems Archaeology," a phrase I designed to be a catchy talk title before actually thinking through what it meant. The more I thought about it, however, the more I convinced myself that it had meaning, and so here we are.

If Archaeology is "the study of human history through the artifacts," then "Distributed Systems Archaeology" is an attempt to apply an artifact-driven approach to understanding the history of the field of Distributed Systems.

Why would I want to do that?

In order to understand that you’d have to know more than you want to know about me, so I won’t say more than this: during the course of my career as a programmer at startups, I have found it impossible to avoid interacting with and producing distributed systems. They’re everywhere.

In addition to their overwhelming ubiquity, I also found reasoning about distributed systems very difficult. I didn’t understand how the tools worked or even what tools existed, and even worse, no one around me really had any more experience than I did in the matter.

To top it off, the resources available to people in my position, which are practitioners who are trying to help build small companies and turn them into medium sized and hopefully giant companies, are scant. 

There are some merciful exceptions, like Jeff Hodges’ *Notes on Distributed Systems For Young bloods*, which begins with this quote:

> "I've been thinking about the lessons that distributed systems engineers learn on the job."

I read that and thought, "well shit, I've been think a lot about that too!" In this essay Hodges states that while developers will come across literature, they will not come across applicable lessons. This was my experience, and this delta, *between the literature and the lessons* is what I am trying to understand. 

So I saturated myself in the literature in order to get some clarity around what the field was all about, and why it is so challenging to interact with distributed systems precisely at a time when we need them.

To help answer this question, I started out by searching for lists of classic papers and books, reaching out to experts, and absorbing as much as I could. As I started to get a sense for the field, I started to recognize some common threads as I traced the influences and trends.

I’m going to use these threads to tell a story about three influences on the field of distributed systems research and practice:

* The Mind
* The Proof
* The Market

Each of these categories represents a common thread that I have traced through the literature, and each of these threads contained information and wisdom that helped me understand where we started, and how we got to where we are today.

### The Mind: Artificial Intelligence

*The roots of distributed systems research in artificial intelligence*

First, the mind. Around the time I pitched this talk, I was heavily influenced by trawling through the archives of the AI Group at MIT, particularly the insanely rich and amazing group of documents known as the "AI Memos." Amongst these memos there are papers by many of my intellectual heroes, dealing with a very wide range of topics. Since the origins of the research funding for computer research was heavily based in Artificial Intelligence, it makes sense that some of the most forward thinking research and thought at the time was coming out of this laboratory.

AI researchers had access to hardware and also the freedom to dream about what the future of hardware and software, and how they interact, would look like. AI had a heavy influence on the origins of distributed systems and provided the breeding ground for some of its brightest thinkers.

My dream history of distributed systems starts a very long time ago (I’m going to publish an extended bibliography), but for the sake of time, I’ve chosen to focus on three sources: Licklider, Minsky, and Hewitt. Their works is fundamental to the field of artificial intelligence, and in my estimation, to distributed systems. 

Licklider and Minsky each contributed massive amounts of energy and numerous novel ideas to the field of artificial intelligence and computer science in general, helping to provide the foundation for the very definition of hackers, software, networks, the internet, and more. 

One of the best anecdotes about Licklider I’ve heard came from an interview I watched with Tracy Licklider, JCR Licklider’s son. According to Tracy, Licklider was an eccentric. He did eccentric things like drink Coke for breakfast. He did eccentric things like dreaming about connecting the entire human race and abolishing the barriers to knowledge inherent in an unbalanced society. He also did eccentric things like calling that project the *Intergalactic Computer Network* because he knew the scientists he was pitching to would think it was funny. 

- Here is an image from “The computer as a communication device” where Licklider is trying to work out how information could travel through networks
- We see terms like “nodes,” “ports,” “message processor”
- He is using biology as an inspiration for modeling the flow of information

<center>
<img src="http://michaelrbernste.in/images/licklider.png">
<div class="lead">Licklider imagines computational biology</div>
</center>

Licklider spoke of  spoke of *Man-Computer Symbiosis* and truly believed in the distributed future. 

His *The Computer as a Communication Device* was a futuristic take on technology. Licklider spread money around to big thinkers, started programs, and believed, above all, in humanity.

Among the programs that Licklider helped to fund was project MAC at MIT, where Minsky was a teacher and Carl Hewitt was a student. Minsky’s interests were oriented toward understand humanity as well - his obsession was the brain and the mind. Minsky pushed the Artificial Intelligence agenda and inspired the use of computers to help understand and extend the human experience.

- Licklider helped to create Project MAC at MIT that employed people like Marvin Minsky, allowing him to publish amazing works and teach a generation of students
- This progress report covers the depth of the work going on at the MIT lab at the time.
- Work began to transition from purely theoretical, to implementation based, and back
- The primary concern was understanding how computers and humans could interact
- Again, this one slide does Minsky no justice - please read about him to discover more

*1968-1969 Progress Report*

Carl Hewitt’s work is an inflection point for me in the history of distributed systems and his ideas are familiar to many of the people at this conference even if they don’t know it. 

In 1973 he published *A Universal Modular ACTOR Formalism for Artificial Intelligence* which defined the Actor model of Computation and discussed his language PLANNER. The actor model describes computation as being performed by a single kind of object, known as an actor.

Actors have simple rules which allow them to perform general purpose computations, and because of the loosely coupled nature their definition and implementation, they can be inherently distributed.

In 1976 Hewitt published a paper, *Viewing Control Structures as Patterns of Passing Messages* (A.I. memo #410) which discussed the work he had done up to that point with the actor model and message passing. Although there were several technical achievements being pursued and accomplished, the work Hewitt was doing was still primarily framed in human terms - "Modelling an intelligent person" and "Modeling a society of experts" are both stated goals early on in the paper.

The actor model turned out to be one of the most enduring ideas produced from the work done on AI at MIT. Modern programming languages like Erlang have a semantics that is based on the actor model, which has been formalized several times.

Licklider, Minsky, and Hewitt all were inherently concerned with the distributed nature of knowledge and how technology could be used to solve a wide variety of problems. The origins of the field of distributed systems can be found here, at the very intersection of technology and humanity.

- In 1976, Hewitt published “Viewing Control Structures” which discussed his work with the actor model and message passing.
- Hewitt’s work, as I mentioned, is an inflection point for me because of how implementation based it is - there is formalism, there is code, there is hardware
- Even though it is technical, the humanity is not lost
- “Modelling an intelligent person” and “Modeling a society of experts” are stated goals
- The actor model is one of the most enduring ideas produced at the MIT AI lab, it is everywhere - in the semantics of Erlang in the libraries of many other major programming languages
- To recap - the work of Licklider, Minsky, and Hewitt was in inherently concerned with the distributed nature of knowledge and how technology could be used to solve a wide variety of problems
- The origins of the field of Distributed Systems can be found here - at the very intersection of technology and humanity

### The Proof: Formalism

*The role of the proof in the history of distributed systems research*

- So that covers the Mind.
- In parallel with the work on AI at prominent universities around the world, computer science was growing as a field, and the lines between mathematics and its application to technology were being teased out
- As a backdrop, it’s important to state that at the time I started researching this work, I had a hard time grasping how you could formalize something as complex as a distributed system
- It seemed like too many moving parts, like it was too abstract
- I didn’t understand the techniques used to apply something like a mathematical proof, wherein you have to “control the entire universe” to something like distributed systems
- The work of three individuals helped me understand these techniques

In parallel with the work on artificial intelligence at prominent universities around the world, computer science was growing as a field, and the lines between mathematics and its application to technology were being teased out.

Edsger Dijkstra’s place as the most prominent name in the field of distributed systems is both fitting and telling. In 1965 he published a one page paper titled *Solution of a Problem in Concurrent Programming Control* where he describes an algorithm for mutual exclusion (known as a mutex), a technique that had not been well known up until that point.

It is with Dijkstra’s work that we see the beginnings of the thread of the prominence of formalism in the field of distributed systems. Dijkstra authored many important papers and was rigorous and thoughtful about proving the work that he produced, and over the course of his career was very vocal about the importance of formalism to computer science.

Dijkstra published another seminal paper *Self-stabilizing Systems in Spite of Distributed Control* in 1974 which was also ahead of its time, rigorous, and elegant. Self-stabilization became its own area of study in distributed systems research, and Dijkstra set the stage for the next generation of computer scientists, beginning a thread that was picked up by many.

Perhaps chief amongst those are that followed in Dijkstra’s footsteps are Nancy Lynch and Leslie Lamport, both of whom have provided a continuous stream of impressive theoretical work in the field. I want to highlight them specifically because of how closely we still feel the impact of their research, and because the specific results that they produced were incredibly groundbreaking and influential. Unfortunately, they are also often misunderstood.

Nancy Lynch was one of the authors of 1982’s *Impossibility of distributed consensus with one faulty process* which set a major direction in distributed systems research by proving that in an asynchronous network, distributed consensus was "impossible" (for a very specific definition of impossible). The impact of this paper is manifold, and much other work is based on its ideas. It is interesting to consider, and I will bring this up again a bit later, that an impossibility proof, also known as a "negative result" should be so important to defining the work in our field.

> "These results do not show that such problems cannot be ‘solved’ in practice; rather, they point up the need for more refined models of distributed computing."

- The first paper of Nancy Lynch’s that I would like to discuss (actually Lynch et. al.) is “Impossibility...”
- One of the field’s most influential papers
- The result (known as the “FLP impossibility result”) states that in an *asynchronous network,* distributed consensus was *impossible* 
- The type of proof Dr. Lynch offered is also known as a “negative result,” one that proves that something is NOT possible, not that something else IS
- It is interesting to consider what role this *type* of proof has, and how it is perceived, and what impact it has had on the field. I’ll discuss this again a little bit later

In 1989 Lynch published *A Hundred Impossibility Proofs for Distributed Computing* which is an awesome paper that I stumbled upon while digging through the list of publications on Dr. Lynch’s website. As an aside, the publications list on researcher’s pages are some of the best sources of information for archaeological digs. What I found so great about "A hundred impossibility proofs" is how Lynch playfully collects, distills and reports on the work in the field up until that point, a field of which she was a pioneer. 

- In 1989, Lynch published this fantastic paper that collects the work in the intervening years since her 1982 paper
- Stumbled upon this in Dr. Lynch’s list of works on her web page - these pages are invaluable to any budding archaeologists in the room
- What is so great about this paper is how Lynch playfully collects, distills, and reports on the work in a field she helped to pioneer

> "The limitation imposed by local knowledge in a distributed system"

- Amongst the One Hundred proofs that Lynch surveys, she finds that they all have but one thing in common
- In other words, asynchronous networks and the potential for failure in other nodes makes certain assumptions impossible
- By 1989, over 100 papers had been published based on these assumptions
- What kind of impact did that have on the researchers who followed Dr. Lynch?
practice?

Lynch also discusses how "the limitation imposed by local knowledge in a distributed system" is the one thing that all of the proofs she surveyed have in common. In other words, asynchronous networks and the potential for failure in other nodes makes certain assumptions impossible. By 1989, over 100 papers had been published based on these ideas. What kind of influence did that have on those who followed?

In 2002, Lynch published *Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services,* which contained a proof Brewer’s CAP conjecture - it was now known as the CAP theorem. The impact of this paper is still present and in fact many people at this conference will likely be discussing this result, 11 years later. 

- Fast forward 13 years and Lynch publishes this landmark work, which starts with Dr. Brewer’s CAP “conjecture” and turns it into the CAP “theorem” through the application of a so-called “negative result”
- Many speakers at this conference will address this theorem, Lindsey Kuper did a much better job yesterday than I could hope to in explaining it
- By the time I looked into this paper, I was already searching for those assumptions - what are those frozen FACTS about the system that allow the result to be produced?
- The thing to focus on for the purposes of this talk is that the C, A, and P in CAP are *formalized* to be *very specific definitions* of Consistency, Availability, and Partition-Tolerance
- Just as the term “impossible” has its own specific meaning
- Just as ALL formalisms contain tradeoffs between correctness and expressivity
- It’s easy to get confused
- It is an irony that those who actually produce rigorous proofs are often those that are the most misunderstood
- The *proof* gets divorced from the work that went into it - the WHY gets lost
- A game of telephone


The proof in the paper uses the terms Consistency, Availability, and Partition-tolerance, three terms which are very carefully defined as part of a formal model. In other words, the C, A, and P in CAP are to be understood for very specific definitions of those terms and are not to be applied generally. Unfortunately, it turns out that it is very easy to apply these ideas generally and get confused about the meanings of them. You can end up seeing C, A, and P everywhere you look.

The point I am trying to make here is that while the work of Dijkstra and Lynch have been a huge part of establishing an indispensable foundation of theoretical work in the field, it is also very easy to get confused about what these results really *mean.* It is perhaps an irony that those who actually produce rigorous proofs are those that are the targets for the most misunderstanding as a result. When something is "proven," people tend to treat it as gospel, divorcing the result from the proof and the work that went into it.

Even worse, perhaps, is that the elegance and simplicity of the formal models is completely lost to those who hear the information, telephone-style, from bad implementations, misunderstood blog posts, and other misguided studies.

I admit that as I read this work for the first time, the point didn’t really hit home. It was only later, upon reading some more modern work, that I started to form an intuition for the relationship between the underlying formal model assumed in academic work and the applicability of its results to practitioners.

Dijkstra and Lynch, in addition to Leslie Lamport, whose work I am going to cover in the next section, have produced incredible bodies of work that have helped to define the field of distributed systems and hoped to imbue a sense of responsibility on the part of academics to provide a formal model for their work.

Next, I want to discuss the final archaeological thread, The Market.

### The Market 

*The impact of commerce on distributed systems research*

- So far we’ve discussed the philosophical and humanity-based origins of distributed systems research in the work of Licklider, Minsky and Hewitt, and the formal origins in the work of Dijkstra and Lynch
- My job motivated me to be professionally competent in distributed systems programming
- I know many others are in the same position 
- Clearly there is a great commercial interest in distributed systems 
- The existence of this conference helps validate this idea
- It made me wonder - has this always been the case?
- The researchers we have covered up until this point have mostly impacted the field in terms of theory - who had actual industrial involvement?

So far we’ve discussed the philosophical and humanity-based origins of distributed systems research in the work of Licklider, Minsky and Hewitt, and the formal origins in the work of Dijkstra and Lynch.

One of the motivating factors in my decision to study distributed systems more deeply was that I needed to understand how they worked better in order to be professionally competent. From this I can extrapolate (not that I have to, people are complaining about this constantly) that many other developers are in similar situations, suddenly finding themselves interacting with distributed systems as their projects grow, or simply as they have the realization that they have in fact been distributed systems programmers all along.

I think the existence of this conference alone proves that there is great commercial interest in distributed systems in 2013, so an interesting question came to me - has this always been the case?

There were few explicit commercial applications in Minsky and Hewitt’s work, and though it could be argued that Licklider’s money from DARPA that helped to create the lab at MIT did come from somewhere, by all accounts, researchers were free to explore at a time when things seemed new, fresh, and possible. Dijkstra and Lynch also published at the fringe of commercialism for a long time, focusing on the formal and mathematical underpinnings of the field.

I was very happy to find, however, that someone I was very intent on studying, Leslie Lamport, did have very interesting interactions with industrial work on distributed systems early on. As I mentioned before, author’s web pages with lists of published works are goldmines for researchers, and it is worth nothing that Lamport’s deserves to be in the world wide web hall of fame for his. It is amazing.

Amongst the many gems on Lamport’s page is a paper from 1978 called *SIFT: Design and Analysis of a Fault-Tolerant Computer for Aircraft Control.* Lamport annotates this entry with the following quote:

> "When it became clear that computers were going to be flying commercial aircraft, NASA began funding research to figure out how to make them reliable enough for the task.""

- Wow. Let’s stare at this for a second.
- Part of the NASA funding included the SIFT (Software Implemented Fault Tolerance) project
- Lamport helped to theorize and prove the system’s reliability even in the face of malicious (also known as “Byzantine”) faults
- Software was now responsible for safely coordinating hardware that was responsible for HUMAN LIFE. Not advertising revenue, HUMAN LIFE.
- Lamport could have clearly been covered in the last section on Formalism, as he published many works in response to Dijkstra’s
- But his impact, to me, has had influence in other ways

Part of that funding was the SIFT project, which was charged with the task of designing the hardware and software for the aircraft and formally verifying its correctness. Lamport explains that the technology described in this paper is notable because the distributed system that composed the airplanes hardware and software could tolerate malicious, also known as Byzantine faults.

Lamport’s work in SIFT amounted to applying theory to the practical aspects of hardware and software that was in charge of people’s lives. In many ways Lamport and his peers were there at a time and place that made their work indispensable to those who followed.  HIs attention to formalism could have placed him firmly in the last category, and indeed I have not even come close to scratching the surface of the depth of his work - but other archaeologists (Lamport included) have already covered that territory. 

There is one aspect of the lasting influence of his work with industry that I wanted to highlight, however, that I think is seldom discussed.

One of the foundational issues facing the modern developer is the availability of too many tools for too few purposes. As a consequence of a million programming languages with a million libraries to solve many fewer actual problems, developers reach for tools which they do not understand, are too complex, or simply just don’t fit their use case, if they’re lucky enough to have a use case at all.

*High-Level Speciﬁcations: Lessons from Industry*

- A collaboration with an intel engineer he worked with to formally verify multiprocessor memory designs
- Lamport has applied techniques of formal verification to a variety of industrial applications
- This is why he straddles the section on the Market and the section on Formalism
- Lamport claims that high Level Specifications, such as the tools provided by his TLA+ language are essential to verifying industrial systems, concurrent algorithms, and more
- TLA+ allows you to provide specifications which get “compiled” into proofs
- I feel that in the long run, his work on TLA+, which makes proving systems more accessible, will be of great importance - I’ve seen mention of it being used at Amazon, for example
- It shows that Lamport has made the connection between the theory of distributed systems and one form of its practice 
- A form of practice that is very different from what most of us do


Lamport certainly did have a use case, and could not afford to misunderstand even the smallest component of what was involved in the work he was doing. It’s important to remember that Lamport worked with a much smaller, more specifiable system with a much more important workload than the typical software developer faces. It was absolutely necessary for him to have formal assurance of his work, and he was actually capable of doing this. 

Today, many developers simply do not have the option to pursue the formal verification of their work. As a result, they partially understand formal results, reach for very strong consensus when they don’t need it, and opine about acronyms instead of studying them.

Additionally, Lamport’s research for SIFT inspired an enormous amount of academic work of varying amounts of applicability to software practitioners. The strong assumptions necessary in aircraft software do not necessarily hold elsewhere, and the prize of making new strides in consensus algorithms at times feels a bit like trying to make the impossible possible.

Another luminary in the field of distributed systems, Ken Birman, has had quite a bit to say over the years about the mixture of commercialism and research and its impact on practitioners. Birman is noted for his work on Virtual Synchrony and the Isis toolkit, which is very well covered by his own bit of archaeological work in 2010’s *A History of the Virtual Synchrony Replication Model.*

Virtual synchrony is a system for considering work in distributed systems and has had various formulations over the years. Birman’s flirtations with industrial application of distributed systems are storied - his work was used by the New York Stock Exchange, amongst other important clients, for many years. Additionally he is an outspoken, reflective writer who has participated in workshops and produced papers about the history and impact of distributed systems research.

A famous back and forth in the form of academic papers from 1993 between Birman and two other authors in the field, Cheriton and Skeen, can and should be consumed by those interested. Cheriton and Skeen came out with *Understanding the Limitations of Causally and Totally Ordered Communication*, which Birman claimed was a thinly veiled attack against his work on Isis in *A Response to Cheriton and Skeen’s Criticism of Causal and Totally Ordered Communication*.

- A famous exchange in the form of two academic papers from 1993 between Birman and two other authors in the field, Cheriton and Skeen, can and should be consumed by any fellow obsessives
- Cheriton & Skeen published “Understanding...” wherein they critique what they see as the primary thrust of Birman’s work: network level ordered communication - they say it is inefficient and hard to reason about
- Birman fired back, claiming that their work was a thinly veiled attack on Isis, and revealing that all three authors had “skin in the game” with respect to trying to sell systems to industrial clients at the time their work was being developed
- The papers are a fascinating read and they remind us that researchers are living, breathing human beings who have to survive and want to advance their ideas

- Fast forward more than 10 years later, and Birman has some interesting perspectives on the interactions between money, research, and practice, specifically as it pertains to advancements in the field of distributed systems
- In these papers, where he is not coming off a bit bitter for his history, Birman urges his fellow researchers to pursue practical and thus humane solutions to the problems that actual people face. 
- He has many interesting things to say, from the impact of the “impossibility” idea I discussed previously to the blow that the applicability of transactions and database theory had on the field of software reliability.
- As a takeaway, Birman’s main idea seems to be that we need to be aware of the impact that the market has on our work, and thus our lives, both as researchers and practitioners


*A History of the Virtual Synchrony Replication Model*

- Another luminary in the field of distributed systems, Ken Birman, has had quite a bit to say over the years about the the mixture of commerce and research, and its impact on practitioners
- Birman is noted for his work on Virtual Synchrony and the Isis Toolkit, which is very well covered by his own bit of auto-archeology in 2010’s “A History...”
- Virtual Synchrony is a framework for considering work in distributed systems and has had various formulations over the years
- Birman’s flirtations with industrial applications of distributed systems are storied.
- New York Stock Exchange, the French Air Traffic Control System, and more were powered by Isis
- He is also an outspoken, reflective writer who has participated in workshops and produced papers about the history and impact of distributed systems research.

The interesting aspect of this back and forth is that Birman indicts Cheriton and Skeen for having financial skin in the game, and for over-simplifying his work in order to prove a relatively lame point. Fascinating reading, and important in that it reminds us that researchers are living, breathing human beings who have to survive and want to advance their ideas.

Fast forward to the mid 2000’s and two more documents that have Birman’s name on them, 2006’s *How the Hidden Hand Shapes the Market for Software Reliability*, and 2008’s *Towards a Cloud-Computing Research Agenda* both contain critical looks at practitioners, researchers, and the market in general. In these works, where he is not coming off a bit bitter for his history, Birman urges his fellow researchers to pursue practical and thus humane solutions to the problems that actual people face. He has many interesting things to say, from the impact of the "impossibility" idea I discussed above to the blow that the applicability of transactions and database theory had on the field of software reliability.

Overall, however, the take away from his work is that we need to be aware of the impact that the market has on our work, and thus our lives. 

To end the section on the market, I wanted to briefly touch on a phenomenon that has had a prolific impact on the theory and practice of distributed computing that is a direct result of commercialism: modern industrial research, such as the work produced at Google and Microsoft.

Google’s papers in particular have been crucial to the field and many practitioners who I spoke to in preparing for this talk point directly to these papers as the initial sources of interest and access for them. Here you have companies at a scale that most people will never see actually publishing the techniques they use to do the seemingly impossible.

This feedback loop between large companies and academia is seen by some as a mixed blessing, however. If the deep academic work pursued by some is considered inapplicable, how could the average practitioner ever hope to leverage the lessons of a company who counts synchronizing atomic clocks between international data centers among its problem areas?

The answer is that sometimes they are applicable, and sometimes they aren’t, and as usual it is up to the practitioner, who often has no training, to make this determination.

Okay, that was a lot. Now that I’ve covered each of the three threads, and exposed a few obvious sources of tension for the modern practitioner, I have two recommendations in the form of directions for the community to pursue: Language, and Humanity.

- That was a lot.
- I’ve covered each of the main threads that I introduced at the beginning of the talk, and hopefully I have exposed some obvious sources of inspiration and tension for the current state of distributed systems theory and practice 
- To wrap things up, I am going to cover two areas of pursuit that I think can help usher us towards where we need to be, in order to look back 10 years from now and feel confident that we have, as a community, successfully conquered, or at least intelligently considered, the issues at play in designing, implementing, and maintaining distributed systems

### Programming Languages

In pursuing my archaeological project, I came across many many "languages for distributed computation," and I also know of some interesting work going on right now in this field. However the idea that a "language for distributed computing" that isn’t Erlang could possibly exist is not known to many developers, and I think it is high time to destroy this myth.

Two books that I have been very fond of lately that are directly applicable to why I feel that it is important for researchers and practitioners to pursue the advancement of languages for distributed computation are  Van Roy and Haridi’s *Concepts, Techniques, and Models of Computer Programming* and Carlos Varela’s *Programming Distributed Computing Systems: A Foundational Approach*.

Concepts, Techniques and Models, also known as CTM, and its accompanying whitepaper *Teaching Programming With The Kernel Language Approach* is a revolutionary Computer Science textbook that completely changed my brain and finally got me to understand the connection between comptuer programming and computer science, no easy task to be sure - just ask Dijkstra, or anyone unfortunate enough to work with me.

In the paper, Van Roy and Haridi state that *Teaching programming in terms of a single paradigm or language has a detrimental effect on programmer competence and thus on program quality.* and that is indeed how many practitioners are taught. They are taught to bend the will of the languages that are commercially popular to the needs of distributed computing *at the same time that they are expected to learn the foundations of the problems themselves*. This is catastrophic. 

CTM is an important book for many reasons, chief amongst them being that it makes the reader realize that small, simple, understandable languages and formal models that can be evolved into more complex ones are very powerful for forming intuitions of problems in computer science. In the book you are exposed to a basic language with a simple underlying formal model that is made more and less advanced over time as various subjects are treated - state is added here and taken away, distribution is included when it is needed, etc. 

Carlos Varela is an author who is clearly inspired by Van Roy and Haridi’s work, and his excellent book on distributed computation takes the position that *understanding concurrent computation is essential to understanding distributed computation,* and proceeds to elucidate various modern formal process calculi that he argues should be the basis for future languages.

Varela describes the terms *distribution* and *mobility* as essential properties for distributed models. *Distribution* is the idea that computation can occur in different locations and *mobility* is the idea that computation can move between these locations. The combination of distribution and mobility is what most modern developers are actually dealing with, but they simply do not have these tools.

In other words, from both Van Roy and Haridi and Varela’s work we can take the lessons that languages devoted to distribution are necessary to teach the concepts of distribution, and that there is great potential in formal models that encode the ideas of distribution and mobility that have not yet been directly applied in the operational semantics of a programming language.

### Humanity 

The most fruitful work that we have achieved in the field of Computer Science is a direct result of the application of resources towards the ends of furthering and better understanding humanity. It is a simple fact that the longer we ignore this reality, the more it is to our peril.

Two papers will end this talk. The first is *On Proof and Progress in Mathematics* by the mathematician William Thurston. I came across this paper when Thurston died and it was recommended to me by many smart people on the internet, which is the way that I discover most of the interesting things that I read. I wasn’t sure what to expect but I certainly wasn’t prepared. This paper is an absolute brain-breaking work of painful beauty, and I won’t say much about it besides the fact that everyone here should read it, and that it contains keys to the questions I’m trying to bring to your attention in this talk. As a short summary, however, Thurston deals with the idea that "progress" in mathematics is often measured by proof, and attempts to understand the impact that it has. Section 4 "What is a proof," in particular also has direct applicability to computer science researchers and practitioners because of Thurston’s fondness for technology - he often integrated computers into his proofs.

Lastly, a paper that I learned about very recently, Papadamitriou’s *Database metatheory: asking the big queries* hits on many of the notes that I’ve brought up here in a much deeper and more intelligent way. The author discusses the impact of the definition of the field by negative proof and compare’s Kuhn’s theory of revolutions in natural sciences to Computer Science - definitely a worthwhile read. Papadamitriou’s attempts to understand and contextualize the work done by researchers at various points in innovation cycles is a poignant reminder that our place in time impacts what we do and how effectively we do it.

## In Conclusion

<center>
<img src="http://michaelrbernste.in/images/triangle.png">
<div class="lead">The Distributed Systems "community triangle"</div>
</center>

Given all of the lessons above, my hopes for *the future* can be summed up as follows:

- *Practitioners*: To the best of your ability, recognize the formalisms your work is based on, understand the details of the papers you’re reading, and be careful with how you communicate these ideas to your peers.

- *Academics*: Guide the community and strike a balance between alleviating current pain and making the future path clear.

- *Industrial Researchers*: Provide complete implementation details in papers, be generous with your Open Source contributions, try to give advice directly to practitioners.

In conclusion, distributed systems is an incredibly deep and rich field. Studying it has been absolutely thrilling and in addition to a fascinating body of artifacts that are ripe for more archaeological work, the community is generous, motivated, and forward-thinking.

I hope this talk inspires you to be reflective about the challenges of programming and understanding distributed systems regardless of your position in the "triangle" above, and remember, together we can do some amazing things.
