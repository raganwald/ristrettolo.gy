
## Making Things Easy

In *CoffeeScript Ristretto*, we are focusing on CoffeeScript's *semantics*, the meaning of CoffeeScript programs. As we go along, we're learning just enough CoffeeScript to understand the next concept simply and directly.

CoffeeScript actually supports a number of syntactic conveniences for making programs extremely readable, by which we mean, making them communicate their intent without asking the programmer to struggle in a [Turing Tarpit], no matter how elegant.

[Turing Tarpit]: https://en.wikipedia.org/wiki/Turing_tarpit

### if i were a rich man
    
For example, it is possible to implement boolean logic using functions, by carefully combining the Identity (`(x) -> x`), Kestrel (`(x) -> (y) -> x`), and Vireo (`(x) -> (y) -> (z) -> z(x(y))`) functions using a clever trick. It look something like this:

    do (I = ((x) -> x),
        K = ((x) -> (y) -> x),
        V = ((x) -> (y) -> (z) -> z(x(y)))
    ) ->
      do (t = K, f = K(I)) ->
        # ...
        # implement logical operators here
        # ...

A> Did you notice that I slipped a new language feature in, one that allegedly allows a programmer to communicate their intent? Comments in CoffeeScript are signalled by a `#` and continue to the end of the line, much like `//` in C++ or JavaScript, and exactly like `#` in Ruby. If you have ever used `C` to make a comment line in FORTRAN, you are a [real programmer] and ought not to be fooling around with a quiche-eater's language.

[real programmer]: http://www.pbm.com/~lindahl/real.programmers.html "Real Programmers Don't Use Pascal"

This is extraordinarily fascinating computer science stuff, but you can read about that [elsewhere][mock]. CoffeeScript supplies `true`, `false`, `and`, `or`, and `not` so you don't need to roll your own out of functions. But while we're talking about logic, CoffeeScript also supplies conditional branches of execution, and we'll use those in examples to come.

[mock]: http://www.amzn.com/0192801422?tag=raganwald001-20 "To Mock a Mockingbird"

The syntax is remarkably simple. Here's a [conditional expression]:

[conditional expression]: http://coffeescript.org/#conditionals

    if d < 32 then 'freezing' else 'warm'

Since it's an expression, you can put it in parentheses and stick it anywhere you like, including inside another conditional:

    (d) ->
      if d < 32 then 'solid' else if d < 212 then 'liquid' else 'gas'

Like function bodies, there is an indented form that can be more readable:

    (d) ->
      if d < 32
        'solid'
      else
        if d < 212
          'liquid'
        else
          'gas'

And the indented lines can have multiple expressions should you so desire:

    if frobbish?
      alert("Frobbish value: #{frobbish}")
      snarglivate(frobbish)
      frobbish