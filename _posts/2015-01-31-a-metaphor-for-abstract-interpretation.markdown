---
layout: post
title: "A Metaphor For Abstract Interpretation"
published: true
hungry: true
---
# 
# 
### A Metaphor For Abstract Interpretation

Recently, I've been studying a Computer Science concept known as "Abstract Interpretation." Abstract Interpretation is a big idea that subsumes many smaller and more familiar concepts to programmers, one clear example being Static Analysis. But what *is* Abstract Interpretation exactly? How big is it? How do I understand it? Explain it? By reading, naturally!

There are a variety of well known resources about the subject, none of which are squarely aimed at basic understanding for the working programmer. One of the best explanations of the basic idea that I've seen so far comes from a tutorial paper titled "Using an Abstracted Interpreter to Understand Abstract Interpretation" by Daniel P. Friedman and Anurag Mendhekar. Since I'm a big fan of using metaphors as a pedagogical tool, I thoroughly enjoyed the first paragraphs from the paper, so I thought I'd share them here:

> "The goal of abstract interpretation is to allow the user to do program analysis with a set of values that abstract another set of values. We present an example of abstract interpretation from real world experience. Suppose that we wish to travel from Nice to Paris. We are not sure how long the trip will take. Naturally, there is a very simple way to find out. Check the time just before we start our trip and check it again when we arrive and calculate the time based on these two numbers. That works, but we probably wanted to know how long it would be without actually taking the trip. What we needed was an abstract characterization of the road from Nice to Paris. Such things exist. They are called road maps. So, had we looked at such a map and used its scale, we could calculate the distance and by guessing our average speed, we likely would determine a reasonable answer to our question without actually taking the trip.

> We can think about the actual taking of the trip as real computing and the analysis of the road map as abstract computing. What we learn when we do abstract computing can be incorporated into our knowledge when we do real computing. For example, knowing approximately how long the trip will take, will help us plan where we should stop to eat enroute to Paris."

I could go on and on about the intricacies of the concepts involved and the metaphor at hand, but for once, I'm just going to shut up and try to let it sink in. More soon -- stay tuned.
