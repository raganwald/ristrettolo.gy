
## As Little As Possible About Functions, But No Less

In CoffeeScript, functions are values, but they are also much more than simple numbers, strings, or even complex data structures like trees or maps. Functions represent computations to be performed. Like numbers, strings, and arrays, they have a representation in CoffeeScript. Let's start with the very simplest possible function. In CoffeeScript, it looks like this:[^also]

    ->
    
[^also]: If you have dabbled in CoffeeScript or look at other people's CoffeeScript programs, you may discover that it is also legal to write `->`. Conceptually, `->` is a function with no arguments and no body. `->` is a function with an empty list of arguments and no body. Generally, CoffeeScript programmers prefer `->`, so let's do that.

This is a function that is applied to no values and produces no value. Hah! There's the third thing. How do we represent "no value" in CoffeeScript? We'll find out in a minute. First, let's verify that our function is a value:

    ->
      #=> [Function]
      
What!? Why didn't it type back `->` for us? This *seems* to break our rule that if an expression is also a value, CoffeeScript will give the same value back to us. What's going on? The simplest and easiest answer is that although the CoffeeScript interpreter does indeed return that value, displaying it on the screen is a slightly different matter. `[Function]` is a choice made by the people who wrote Node.js, the JavaScript environment that hosts the CoffeeScript REPL. If you try the same thing in a browser (using "Try CoffeeScript" at [coffeescript.org] for example), you'll get something else entirely that isn't CoffeeScript at all, it's JavaScript.

[coffeescript.org]: http://coffeescript.org

<div class="pagebreak"></div>

A> I'd prefer something else, but I console myself with the thought that what gets typed back to us on the screen is arbitrary, and all that really counts is that it is somewhat useful for a human to read. But we must understand that whether we see `[Function]` or `function () {}` or--in some future version of CoffeeScript--`->`, internally CoffeeScript has a full and proper function.[^circular]

[^circular]: The exact same thing will happen to you once you figure out how to make an array that contains itself. You'll try to print it out and you'll get `[[Circular]]` back. Never mind, internally CoffeeScript has constructed a perfectly fine Ouroborian array even if it won't try to print it out for you.

### functions and identities

You recall that we have two types of values with respect to identity: Value types and reference types. Value types share the same identity if they have the same contents.Reference types do not.

Which kind are functions? Let's try it. For reasons of appeasing the CoffeeScript parser, we'll enclose our functions in parentheses:

    (->) is (->)
      #=> false
      
Like arrays, every time you evaluate an expression to produce a function, you get a new function that is not identical to any other function, even if you use the same expression to generate it. "Function" is a reference type.

### applying functions

Let's put functions to work. The way we use functions is to *apply* them to zero or more values called *arguments*. Just as `2 + 2` produces a value (in this case `4`), applying a function to zero or more arguments produces a value as well. Some folks call the arguments the *inputs* to a function. Whether you use the word "inputs" or "arguments," it's certainly a good thing to think of the function's arrow as pointing from the inputs to the output!

Here's how we apply a function to some values in CoffeeScript: Let's say that *fn_expr* is an expression that when evaluated, produces a function. Let's call the arguments *args*. Here's how to apply a function to some arguments:

  *fn_expr*`(`*args*`)`
    
Right now, we only know about one such expression: `->`, so let's use it. We'll put it in parentheses[^ambiguous] to keep the parser happy, like we did above: `(->)`. Since we aren't giving it any arguments, we'll simply write `()` after the expression. So we write:

    (->)()
      #=> undefined

What is this `undefined`?

[^ambiguous]: If you're used to other programming languages, you've probably internalized the idea that sometimes parentheses are used to group operations in an expression like math, and sometimes to apply a function to arguments. If not... Welcome to the [ALGOL] family of programming languages!

[ALGOL]: https://en.wikipedia.org/wiki/ALGOL

### `undefined`

In CoffeeScript, the absence of a value is written `undefined`, and it means there is no value. It will crop up again. `undefined` is its own type of value, and it acts like a value type:

    undefined
      #=> undefined

Like numbers, booleans and strings, CoffeeScript can print out the value `undefined`.

    undefined is undefined
      # => true
    (->)() is (->)()
      # => true
    (->)() is undefined
      # => true
      
No matter how you evaluate `undefined`, you get an identical value back. `undefined` is a value that means "I don't have a value." But it's still a value :-)

Speaking of `is undefined`, a common pattern in CoffeeScript programming is to test wither something `isnt undefined`:

    undefined isnt undefined
      #=> false
    'undefined' isnt undefined
      #=> true
    false isnt undefined
      #=> true
      
This is so common that a shortcut is provided, the suffix operator `?`:

    undefined?
      #=> false
    'undefined'?
      #=> true
    false?
      #=> true
      
A> You might think that `undefined` in CoffeeScript is equivalent to `NULL` in SQL. No. In SQL, two things that are `NULL` are not equal to nor share the same identity, because two unknowns can't be equal. In CoffeeScript, every `undefined` is identical to every other `undefined`.

### functions with no arguments

Back to our function. We evaluated this:

    (->)()
      #=> undefined

Let's recall that we were applying the function `->` to no arguments (because there was nothing inside of `()`). So how do we know to expect `undefined`? That's easy. When we define a function, we write the arguments it expects to the left of the `->` and an optional expression to the right. This expression is called the function's *body*. Like this:

  `(`*args*`) -> `*body*

There is a funny rule: You can omit the body, and if you do, applying the function always evaluates to `undefined`.[^omit]

[^omit]: Elsewhere, we've pledged to avoid optional bits that don't add a lot to our understanding. This optional bit gives us an excuse to learn about `undefined`, so that's why it's in. Now that we know this, we see that our expression `->` evaluates to a function taking no arguments and having no expression, therefore when you apply it to no arguments with `(->)()`, you get `undefined`.

What about functions that have a body? Let's write a few. Here's the rule: We can use *anything* we've already learned how to use as an expression. Cutting and pasting, that means that the following are all expressions that evaluate to functions:

    -> 2
    -> 2 + 2
    -> "Hello" + " " + "CoffeeScript"
    -> true is not false
    -> false isnt true

And you can evaluate them by typing any of these into CoffeeScript:

    (-> 2)()
      #=> 2
    (-> 2 + 2)()
      #=> 4
    (-> "Hello" + " " + "CoffeeScript")()
      #=> "Hello CoffeeScript"
    (-> true is not false)()
      #=> true
    (-> false isnt true)()
      #=> true

We haven't discussed arguments yet, but let's get clever with what we already have.

### functions that evaluate to functions

If an expression that evaluates to a function is, well, an expression, and if a function expression can have any expression on its right side... *Can we put an expression that evaluates to a function on the right side of a function expression?*

Yes:

    -> ->
    
That's a function! It's a function that when applied, evaluates to a function that when applied, evaluates to `undefined`. Watch and see:

    -> ->
      #=> [Function]

It evaluates to a function...

    (-> ->)()
      #=> [Function]
      
That when applied, evaluates to a function...
    
    (-> ->)()()
      #=> undefined

That when applied, evaluates to `undefined`. Likewise:

    -> -> true
    
That's a function! It's a function that when applied, evaluates to a function, that when applied, evaluates to `true`:

    (-> -> true)()()
      #=> true
      
Well. We've been very clever, but so far this all seems very abstract and computer science-y. Diffraction of a crystal is beautiful and interesting in its own right, but you can't blame us for wanting to be shown a practical use for it, like being able to determine the composition of a star millions of light years away. So... In the next chapter, "[I'd Like to Have an Argument, Please](#fargs)," we'll see how to make functions practical.

### showering felicitous encouragement to incentivise the practice of skewing the distribution of expression length towards the minimal mode

Or, *In praise of keeping it short.*

When describing the behaviour of functions, we often use the expression "that when applied, evaluates to..." For example, "The function `(x, y) -> x + y` is a function, that when applied to two integer arguments, evaluates to the sum of the arguments."[^pedant] This is technically correct. But a mouthful. Another expression you will often hear is "returns," as in "The function `(x, y) -> x + y` is a function that returns the sum of its arguments."

"Returns" is a little less precise, and is context dependant. But it suits our purposes, so we will often use it. But when we use it, we will *always* mean "when applied, evaluates to..."

And with that's let's move on!

[^pedant]: It does something else when the first argument is a string, but let's ignore that bit of pedantry for now.