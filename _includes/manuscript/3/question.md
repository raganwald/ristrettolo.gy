## A Simple Question

Both of the following produce the exact same result:

    do (Pi = 3.14159265) ->
      (diameter) ->
        diameter * Pi

And:

    (diameter) ->
      do (Pi = 3.14159265) ->
        diameter * Pi

Why do we habitually prefer the former?

To understand this, we're going to take a simple step towards more complex, state-full programs by introducing sequences of expressions. If we had no other tools, we could evaluate a series of expressions with some legerdemain like this:

    do (ignore1 = foo(),
        ignore2 = bar(),
        ignore3 = blitz(),
        value = bash()) ->
      bash

Or perhaps like this:

    do (ignore = [foo(),  bar(), blitz()], value = bash()) ->
      bash

Or even this:

    [
      foo()
      bar()
      blitz() ] and bash()

Any of these would evaluate `foo()`, `bar()`, `blitz()`, and then return the value of `bash()` (whatever they might be).

X> Why doesn't `foo() and bar() and blitz() and bash()` work reliably?

But let's learn another handy CoffeeScript feature, again because it helps us focus on what is actually going on. Whenever you want to work with the body of a function, you can always have it evaluate a simple sequence of one or more expressions by indenting them. The value of the body is the value of the final expression.

So in that case, we can write something like:

    do ->
      foo()
      bar()
      blitz()
      bash()

Anywhere a simple expression is allowed, you could use a `do` with a sequence. This doesn't come up as much as you might think, because many of the places you want to do this, CoffeeScript already lets you indent and include more than one expression. For example, in a function body:

    (foo) ->
      bar(foo)
      bash(foo)
      foo('blitz')

So back to our question. Here's a test framework:

    do (circumference = do (Pi = 3.14159265) ->
                          (diameter) ->
                            diameter * Pi) ->
      circumference(1)
      circumference(2)
      circumference(3)
      circumference(4)
      circumference(5)
      circumference(6)
      circumference(7)
      circumference(8)
      circumference(9)
      circumference(10)
        #=> 31.4159265

Let's think about how many functions we are invoking. When this is first invoked, We invoke the outer `do (circumference = (...) ->`. As part of doing that, we invoke `do (Pi = 3.14159265) ->` and bind the result to `circumference`. Then every time we invoke `circumference`, we invoke `(diameter) ->`. All together, twelve.

But with:

    do (circumference = (diameter) ->
                          do (Pi = 3.14159265) ->
                            diameter * Pi) ->
      circumference(1)
      circumference(2)
      circumference(3)
      circumference(4)
      circumference(5)
      circumference(6)
      circumference(7)
      circumference(8)
      circumference(9)
      circumference(10)
        #=> 31.4159265

What happens? There's one outer `do (circumference = (...) ->`, same as before. And then every time we invoke `circumference`, we also invoke `do (Pi = 3.14159265) ->`, so we have a total of twenty-one function invocations. This is nearly twice as expensive.