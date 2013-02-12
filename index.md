---
layout: default
title: ristrettolo.gy, CoffeeScript Ristretto Online
---

## Introduction to the Online Edition

Some time ago, Benjamin Stein and I rediscovered Haskell's Maybe Monad. Or as we prefer to think of it, we wrote a little Ruby helper called #andand. It was a hack, but it worked and inspired me to want to fix a lot of other "problems" I encountered with Ruby's syntax.

Unfortunately, you can only go so far with meta-programming, and eventually you find yourself confronted with a choice: Take the blue pill, forget about fixing the language, and live a happy life until old age or a passing asteroid claims you. Or take the red pill, and venture into hacking the syntax with parsers, grammars, ASTs, and whatever else you need to make things like `[1..100].map { its.first_name }` work.

> &ldquo;This is your last chance. After this, there is no turning back. You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill—you stay in Wonderland and I show you how deep the rabbit-hole goes.&rdquo;—*Morpheus*

I took the red pill, and wound up writing [rewrite_rails][rr]. The trouble was, Ruby was well-regarded, and the problems that I solved didn't really bother most people. For example, rewrite_rails provides extension methods so you can extend a class without monkey-patching it in the global namespace. Everyone agrees that monkey-patching is a "Bad Idea" in theory, but in practice it seems to suit Ruby programmers just fine.

## Meanwhile, in New York...

> "I particularly enjoyed this small book because I've reached for it a hundred times before and come up empty-handed. Large and heavy manuals on object-oriented programming and JavaScript are all around us, but to find a book that tackles the fundamental features of functions and objects in a brief, strong gulp, is rare indeed."—*Jeremy Ashkenas, creator of the CoffeeScript Language*

Meanwhile, in New York, [Jeremy Ashkenas] also took the red pill. But instead of smoothing over some obscure warts in a language that was otherwise liked and well-regarded, Jeremy took on some annoyances and headaches in a language that was generally reviled as having awkward and error-prone syntax: JavaScript. 

Underneath that syntax, JavaScript is extremely cool. Almost lisp-y: It has excellent support for first-class functions, even better than Ruby. JavaScript is a good language hampered by a syntax that was very, very necessary to capture mindshare in 199x, but is holding it back in 201x. And Jeremy did something about it, he wrote [CoffeeScript].

Yada, yada, and now CoffeeScript could be the best way to write application code targeting JavaScript runtimes. I use pure JavaScript most of the time when writing *libraries*, because lots of pure JavaScript users need to read the code, but when I'm writing code for a team, it's CoffeeScript, CoffeeScript, CoffeeScript.

## CoffeeScript Ristretto

> "The best explanation of closures I've seen yet."—*Jerry Anning*

I like almost all of the books I've read that introduce the CoffeeScript language. They do a great job of teaching you how the syntax works. Some walk you through building something big enough to touch on many features but small enough to fit in a week or two of reading.

But what I hadn't seen was a book that addressed the underlying semantics, the functions, functions, functions orientation of the JavaScript runtime. So I set out to write such a book. Not a book about "functional programming," the world needs another discussion of folds, unfolds, lazy lists, and purely functional data structures like it needs another Haskell or Clojure blog post explaining that "Schrödinger's Cat is a Monad".

But a book about programming with functions as first-class values, a book that embraces the fact that CoffeeScript methods, like JavaScript methods, are functions. A book that dares to start the story at the very beginning but not falter and work from there up to very advanced topics like refactoring to method combinators and decorators. A book that complements what you read elsewhere and already know, a book that acts like a multiplier of your skills.

That was a book I thought was worth writing, and more than three hundred people think it's worth paying for and reading! 

## Is this book for you?

> "I was also seriously caught up by the digression into espresso, ristretto, etc. Worth the purchase just for the intro."—*Chris Smith*

Quite frankly, the audience for a book about "function decorators and method combinators" is tiny. But that isn't really what [CoffeeScript Ristretto][cr] is about, and that isn't who it's for. **This is a book about understanding what CoffeeScript is really capable of and how far you can take it.** Function decorators and method combinators and everything else are just how we get there together.

If you bought a car that could go 240mph and he dealership advertised a long-weekend driving course at a local racetrack, obviously it isn't really for people who want to go street racing. It's for people who want to know how to drive their car safely on the autobahn and for people who want the knowledge and reflexes to know what to do if they find the car drifting in a turn on a slippery road.

[CoffeeScript Ristretto][cr] is for people who appreciate that they're using a high-performance language, one that can be very powerful when necessary. And they who want to know what it's capable of in their hands. If that's you, read on!

The entire text is online, free, although I certainly encourage you to check out the [ebook][cr]. In addition to better formatting and portability to offline formats, you'll also receive free updates and fixes indefinitely, while this web site may not receive updates as often, or at all.

>  "I can't read this! The beautiful images distract me. And it's midnight and I want ristretto."—[Roman Glass](https://twitter.com/_glass)

(*Want to make this even better? [File an issue][issue], or [fork this repository][repo] and send a pull request!*)  

---

![](http://i.minus.com/iL337yTdgFj7.png)[![JavaScript Allongé](http://i.minus.com/iW2E1A8M5UWe6.jpeg)](http://leanpub.com/javascript-allonge "JavaScript Allongé")![](http://i.minus.com/iL337yTdgFj7.png)[![CoffeeScript Ristretto](http://i.minus.com/iMmGxzIZkHSLD.jpeg)](http://leanpub.com/coffeescript-ristretto "CoffeeScript Ristretto")![](http://i.minus.com/iL337yTdgFj7.png)[![Kestrels, Quirky Birds, and Hopeless Egocentricity](http://i.minus.com/ibw1f1ARQ4bhi1.jpeg)](http://leanpub.com/combinators "Kestrels, Quirky Birds, and Hopeless Egocentricity")

---
                    
<a name="start"></a>
                                                                                                                                                                                                                                                                                                                       
## CoffeeScript Ristretto

{% include manuscript/Book.md %}

---

This site uses the [Solarized][solarized] color scheme, is set in Nimbus Sans, and is snarfed wholesale from [Tom Jakubowski][tj] All words are (c) 2012-2013 Reginald Braithwaite.

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/deed.en_US">Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License</a>.

---

## End Notes

[solarized]: http://ethanschoonover.com/solarized
[tj]: http://www.crystae.net/
[rr]: https://github.com/raganwald-deprecated/rewrite_rails
[CoffeeScript]: http://coffeescript.org
[cr]: https://leanpub.com/coffeescript-ristretto
[sample]: http://samples.leanpub.com/coffeescript-ristretto-sample.pdf "Free Sample PDF"
[issue]: https://github.com/ristrettolo-gy/ristrettolo-gy.github.com/issues
[repo]: https://github.com/ristrettolo-gy/ristrettolo-gy.github.com/
[Jeremy Ashkenas]: https://github.com/jashkenas