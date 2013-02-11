
## Let Me Show You What To Do

### let {#let}

Up to now, all we've really seen are *anonymous functions*, functions that don't have a name. This feels very different from programming in most other languages, where  the focus is on naming functions, methods, and procedures. Naming things is a critical part of programming, but all we've seen so far is how to name arguments.

There are other ways to name things in CoffeeScript, but before we learn some of those, let's see how to use what we already have to name things. Let's revisit a very simple example:

    (diameter) ->
      diameter * 3.14159265
    
What is this "3.14159265" number? [Pi], obviously. We'd like to name it so that we can write something like:

    (diameter) ->
      diameter * Pi
    
In order to bind `3.14159265` to the name `Pi`, we'll need a function with a parameter of `Pi` and an argument of `3.14159265`:

    ((Pi) ->
      ???
    )(3.14159265)
    
What do we put inside our new function that binds `3.14159265` to the name `Pi` when evaluated? Our circumference function, of course:

[Pi]: https://en.wikipedia.org/wiki/Pi

    ((Pi) ->
      (diameter) ->
        diameter * Pi
    )(3.14159265)
    
This expression, when evaluated, returns a function that calculates circumferences. It differs from our original in that it names the constant Pi. Let's test it:

    ((Pi) ->
      (diameter) ->
        diameter * Pi
    )(3.14159265)(2)
      #=> 6.2831853
      
That works! We can bind anything we want and use it in a function by wrapping the function in another function that is immediately invoked with the value we want to bind. This "functional programming pattern" was popularized in the Lisp programming language more than 50 years ago, where it is called [`let`][let].[^let] Although CoffeeScript doesn't have a `let` keyword, when we discuss this programming pattern we will call it `let`.

[^let]: `let` has made its way into other languages like JavaScript.
[let]: http://jtra.cz/stuff/lisp/sclr/let.html

`let` works,[^letrec] but only a masochist would write programs this way in CoffeeScript. Besides all the extra characters, it suffers from a fundamental semantic problem: there is a big visual distance between the name `Pi` and the value `3.14159265` we bind to it. They should be closer. Is there another way?

[^letrec]: `let` is limited in some ways. For example, you can't define a recursive function without some fixed point combinator backflips. This will be discussed later when we look at the related pattern [`letrec`](#letrec).

Yes.

### do

CoffeeScript programmers often wish to create a new environment and bind some values to names within it as `let` does. To make this easier to read and write, CoffeeScript provides some *syntactic sugar* called `do`.[^ssugar]

[^ssugar]: "Syntactic sugar causes cancer of the semicolon"--[Alan Perlis][perlisisms]
[perlisisms]: http://www.cs.yale.edu/quotes.html "Epigrams in Programming"

![Italians seem to prefer espresso with plenty of sugar, while North Americans often drink it without](images/sugarservice.jpg)

This is what our example looks like using `do`:

    do (Pi = 3.14159265) ->
      (diameter) ->
        diameter * Pi

Much, MUCH cleaner.

If you need to create more than one binding, you separate them with commas:

    do (republican = 'Romney', democrat = 'Obama') ->
      democrat

X> The value on the right side can be any expression. Try this for yourself:
X>
X> <<(code/do1.coffee)

Did you try the example above? Did you notice what we slipped in? Yes, obviously, the value of a binding can be any expression. But notice also that we can invoke a function on any expression evaluating to a function, including a variable that looks up a binding in the environment.

A> Dozens of pages into the book, we're finally calling a function the way you'll see functions being called in most production code. Sheesh.