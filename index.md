---
layout: default
title: ristrettolo.gy, CoffeeScript Ristretto Online
---

# Introduction

<iframe style="float:right;margin-left:20px;margin-bottom:20px;" width="160" height="400" src="https://leanpub.com/coffeescript-ristretto/embed" frameborder="0" allowtransparency="true"></iframe>

Some time ago, Benjamin Stein and I rediscovered Haskell's Maybe Monad/Groovy's Elvis Operator and wrote a little Ruby helper called AndAnd. It was a hack, but it worked and inspired me to want to fix a lot of other "problems" I encountered with Ruby's syntax.

Unfortunately, you can only go so far with proxy objects, and eventually you find yourself confronted with a choice: Take the blue pill, forget about fixing the language, and live a happy life until old age or a passing asteroid claims you. Or take the red pill, and venture into hacking the syntax with parsers, grammars, ASTs, and whatever else you need to make things like `[1..100].map { its.first_name }` work.

![The choice](assets/images/pills.jpg)

> This is your last chance. After this, there is no turning back. You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland and I show you how deep the rabbit-hole goes.

<iframe style="float:right;margin-left:20px;margin-bottom:20px;" width="160" height="400" src="https://leanpub.com/b/coffee-kestrels-code/embed" frameborder="0" allowtransparency="true"></iframe>

I took the red pill, and wound up writing [rewrite_rails][rr]. The trouble was, Ruby was well-regarded, and the problems that I solved didn't really bother most people. For example, rewrite_rails provides extension methods so you can extend a class without monkey-patching it in the global namespace. Everyone agrees that monkey-patching is a "Bad Idea" in theory, but in practice it seems to suit Ruby programmers just fine. If Rails can do it, how bad can it be?

Meanwhile in New York, Jeremy Ashkenas also took the red pill. But instead of smoothing over some obscure warts in a language that was otherwise liked and well-regarded, Jeremy took on some annoyances and headaches in a language that was generally reviled as having awkward and annoying syntax: JavaScript. 

Underneath its syntax, JavaScript is extremely cool. Almost lisp-y, in fact. I suppose I ought to say that it has excellent support for first-class functions, even better than Ruby. And it does, but what I find interesting isn't that everything is an object in JavaScript, but rather that *everything of interest is a function*. Prototypical inheritance is actually very, very interesting, much more interesting than classist inheritance. Not because anything can be a prototype, but the idea of working with exemplars rather than classes is...

Sorry, I was getting carried away. The point is, JavaScript is a good language hampered by a syntax that was very, very necessary to capture mindshare in 199x, but is holding it back in 201x. And Jeremy did something about it, he wrote [CoffeeScript].

Yada, yada, and now CoffeeScript is possibly the best way to write application code targeting JavaScript runtimes. I use pure JavaScript most of the time when writing *libraries*, because lots of pure JavaScript users need to read the code, but when I'm writing code for a team, it's CoffeeScript, CoffeeScript, CoffeeScript.

# CoffeeScript Ristretto

I like almost all of the books I've read that introduce the CoffeeScript language. They do a great job of teaching you how the syntax works. Some walk you through building something big enough to touch on many features but small enough to fit in a week or two of reading.

But what I hadn't seen was a book that addressed the underlying semantics, the functions, functions, functions orientation of the JavaScript runtime. So I set out to write such a book. Not a book about "functional programming," the world needs another discussion of folds, unfolds, lazy lists, and purely functional data structures like it needs another Haskell or Clojure blog post explaining that Schrödinger's Cat is a Monad.

But a book about programming with functions as first-class values, a book that embraces the fact that CoffeeScript methods, like JavaScript methods, are functions. A book that dares to start the story at the very beginning but not falter and work from there up to very advanced topics like refactoring to method combinators and decorators. A book that complements what you read elsewhere and already know, a book that acts like a multiplier of your skills.

# Is this book for you?

<iframe style="float:right;margin-left:20px;margin-bottom:20px;" width="160" height="400" src="https://leanpub.com/coffeescript-ristretto/embed" frameborder="0" allowtransparency="true"></iframe>

Quite frankly, the audience for a book about "function decorators and method combinators" is tiny. But that isn't really what [CoffeeScript Ristretto][cr] is about, and that isn't who it's for. **This is a book about understanding what CoffeeScript is really capable of and how far you can take it.** Function decorators and method combinators and everything else are just how we get there together.

If you bought a car that could go 240mph and he dealership advertised a long-weekend driving course at a local racetrack, obviously it isn't really for people who want to go street racing. It's for people who want to know how to drive their care safely on the autobahn and for people who want the knowledge and reflexes to know what to do if they find the car drifting in a turn on a slippery road.

[CoffeeScript Ristretto][cr] is for people who appreciate that they're using a high-performance language, one that can be very powerful when necessary. And they who want to know what it's capable of in their hands. If that's you, read on!

The entire text is online, free, although I certainly encourage you to buy the ebook. In addition to better formatting and portability to offline formats, you'll also receive free updates and fixes indefinitely, while this web site may not receive updates as often, or at all.

---

{% include manuscript/Book.md %}

---

This site uses the [Solarized][solarized] color scheme, is set
in Nimbus Sans, and is snarfed wholesale from [Tom Jakubowski][tj].

[solarized]: http://ethanschoonover.com/solarized
[tj]: http://www.crystae.net/
[rr]: https://github.com/raganwald-deprecated/rewrite_rails
[CoffeeScript]: http://coffeescript.org
[cr]: https://leanpub.com/coffeescript-ristretto