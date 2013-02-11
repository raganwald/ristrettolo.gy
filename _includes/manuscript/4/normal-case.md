
## Normal Variables

Now that we've discussed reassignment, it's time to discuss *assignment*.

A> It sounds odd to say we've reassigned things without assigning them. Up to now, we've *bound* values to names through arguments, and `do`, which is really syntactic sugar for the `let` pattern.

In CoffeeScript, the syntax for assignment is identical to the syntax for reassignment:

    birthday = { year: 1962, month: 6, day: 14 }
    
The difference comes when there is no value bound to the name `birthday` in any of the user-defined environments. In that case, CoffeeScript creates one in the current function's environment. The current function is any of the following:

1. A function created with an arrow operator (`->` that we've seen, and `=>` that we'll see when we look at objects [in more detail](#methods)).
2. A function created with the `do` syntax.
3. When compiling CoffeeScript in files, an empty `do ->` is invisibly created to enclose the entire file.

One good consequence of this feature is that you can dispense with all of the nested `do (...) ->` expressions you've seen so far if you wish. You can boldly write things like:

    identity = (x) -> x
    kestrel = (x) -> (y) -> x
    truth = kestrel
    falsehood = kestrel(identity)

You can also do your assignments wherever you like in a function, not just at the top. Some feel this makes code more readable by putting variable definitions closer to their use.
    
There are two unfortunate consequences. The first is that a misspelling creates a new binding rather than resulting in an error:

    do (age = 49) ->
      # ...
      agee = 50
      # ...
      age
      #=> 49, not 50
      
The second is that you may accidentally alias an existing variable if you are not careful. If you're in the habit of creating a lot of your variables with assignments rather than with `do`, you must be careful to scan the source of all of your function's parents to ensure you haven't accidentally reused the name of an existing binding.[^worse]

[^worse]: It could be worse. One very popular language assumes that if you haven't otherwise declared a variable local to a function, you must want a global variable that may clobber an existing global variable used by any piece of code in any file or module.

A> CoffeeScript calls creating new bindings with assignment "normal ," because it's how most programmers normally create bindings. Just remember that if anyone criticizes CoffeeScript for being loose with scoping and aliases, you can always show them how to use `do` to emulate `let` and `letrec`.

### un-do

So, should we use `do` to bind variables or should we use "normal" variables? This is a very interesting question. Using `do` has a certain number of technical benefits. Then again, Jeremy Ashkenas, CoffeeScript's creator, only uses `do` when it's necessary, and most CoffeeScript programmers follow his lead. It hasn't done them any harm.

So here's what we suggest:

When writing new software, use Normal variables as much as possible. If and when you find there's a scoping problem, you can refactor to `do`, meaning, you can change a normal variable into a variable bound with `do` to solve the problem.

Programming philosophy is a little outside of the scope of this book, but there is a general principle worth knowing: A good programmer is familiar with many design patterns, idioms, and constructions. However, the good programmer does not attempt to design them into every piece of code from the outset. Instead, the good programmer proceeds along a simple, direct, and clear path until difficulties arise. Then, and only then, does the good programmer refactor to a pattern. In the end, the code is simple where it does not solve a difficult or edge case, and uses a technique or idiom where there is a problem that needed solving.

`do` is a good pattern to know and deeply understand, but it is generally sufficient to write with normal variables. If you see a lot of `do` in this book, that is because we are writing to be excruciatingly clear, not to construct software that is easy to read and maintain in a team setting.