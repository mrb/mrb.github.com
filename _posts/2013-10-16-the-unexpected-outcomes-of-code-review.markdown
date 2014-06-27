---
layout: post
title: The Unexpected Outcomes Of Code Review
published: true
other: true
---
# 
<div class="lead">This post originally appeared on the Code Climate blog, <a href="http://blog.codeclimate.com/blog/2013/10/09/unexpected-outcomes-of-code-reviews">follow this link to join the discussion there.</a></div>
#  
#  
# The Unexpected Outcomes Of Code Review

Modern software developers have many tools at their disposal to help them feel confident that the code that they produce is high-quality and defect free. Amongst the most valuable of these tools are those that aid in inspecting source code written by another developer, a practice known as *code review*. 

While these tools are becoming more pervasive, their value is difficult to quantify and the motivations of those who use them are not well known. Alberto Bacchelli and Christian Bird of Microsoft Research recently published a paper, *"Expectations, Outcomes, and Challenges of Modern Code Review"* which concluded that while most developers feel that code review is meant to find bugs in code, the process reveals that other outcomes are more prevalent, as this chart from the paper illustrates:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/20131014_blogcc_comments.png">
<br/>
<b>The 'Outcomes' chart: ranked categories extracted <br/>from a sampling of code review data.</b>
</center>

In this blog post I will briefly introduce the authors' concept of "modern code review," discuss the techniques and findings of this fascinating study, and discuss the unseen benefits of this process.

### What is “modern code review?”

Code review has its origins in the formal practice known as a *code inspection*, introduced by Fagan in 1976 and described by Bachhelli and Bird as "cumbersome, time-consuming, and synchronous." It involved line-by-line break-downs of code, lengthy explanations, people in suits, and other undesirable traits. 

In contrast, the authors define *modern code review* as a form of code inspection which has the qualities of being *informal*, *tool-based*, and *frequent*. The most well-known engineering organizations today typically participate in a whole lot of modern code review: Microsoft, Google, and Facebook not only advocate this practice but have all authored their own tools for the purpose.

### How the study was conducted

The study sets out to answer two primary questions:

1. What motivates developers to participate in (or managers to advocate for) code review?
2. How does code review actually benefit those who participate in or advocate for it?

Bachhelli and Bird relied on access to employees, previous work, and data from Microsoft to conduct their study. They dealt with the use of one specific tool: Microsoft CodeFlow, an internal interactive tool that creates a central location where the discussion of code and the subsequent fixes can be discussed either in real-time or asynchronously. CodeFlow also indexes data for searchability, a fact the authors relied on heavily in determining their findings.

In addition to using data from a previous study, the authors observed and interviewed "17 developers with various degrees of experience and seniority across 16 separate product teams with distinct reviewing cultures and policies." Additionally they "manually inspected and classified the content of 570 comments" from CodeFlow, and surveyed 165 managers and 873 programmers.

### Code improvements vs. finding defects

What the authors found was that while a large portion of developers, managers, and testers are motivated to perform code review because they hope to find bugs, the results of the study show otherwise. After categorizing the discussions in actual code reviews, finding defects ranks fourth, as shown in the chart above. To contrast the outcomes with the motivations, here is a graph that shows the motivations of the developer segment of those interviewed:

<center>
<img src="https://dl.dropboxusercontent.com/u/1401061/20131014_blogcc_motivation.png">
<br/>
<b>The 'Motivations' chart: the ranked motivation categories <br/>from the developer segment of the interviews.</b>
</center>

The top answer for the largest number of developers was "Finding defects," and it ranked second overall amongst developers. The most prevalent topic discussed in code reviews ostensibly pertains to "code improvements:” comments  or changes about code in terms of readability, commenting, consistency, dead code removal, etc. 

This mismatch naturally led the researchers to wonder why this delta was so severe. The paper points to the idea that the challenges in finding bugs in other’s code essentially boils down to one idea: *understanding.* 

Being capable of internalizing and understanding code is essential to being able to review code properly and find bugs, yet today’s large codebases and fragmented engineering organization make this difficult. As a result, an impedance mismatch is created that prevents decent overarching defect detection from occurring.

#### Conclusion

While there is a significant difference across the Microsoft organization between the expectations and outcomes of code review, this is not an entirely negative thing. Although we don’t seem to be getting the exact value from code reviews that we expect, we may be getting quite a bit more. 

The paper states that in addition to a modicum of somewhat superficial bug fixes, teams get benefits such as “knowledge transfer, team awareness, and improved solutions to problems" from participating in modern code reviews. Additionally, the idea that code review is good at "educating new developers about code writing” is a compelling point.

So without knowing it, developers, managers, and testers rely on code review for a wide variety of  purposes including communicating the design goals of implementations, enforcing style, and more. If we tweak our expectations and prepare for the inevitable outcomes, over time we can improve our code and use our tools to maximum effect.



#### Works Cited

All quotes and figures from:

[1] Alberto Bacchelli and Christian Bird *"Expectations, Outcomes, and Challenges of Modern Code Review"*  May 2013, Proceedings of the International Conference on Software Engineering.

<a href="http://research.microsoft.com/apps/pubs/default.aspx?id=180283">Available online here.</a>
