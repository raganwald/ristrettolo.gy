### more identity

Back to identity. Two expressions that seem to generate the same value don't always generate the same value. Two values might look the same to us but be different to the CoffeeScript interpreter, much as identical twins may look the same to other people but are actually different individuals.

So what kinds of values might appear to be the same thing but actually be different things? Let's meet a data structure that is very common in contemporary programming languages, the Array (other languages sometimes call it a List or a Vector).

Here are some expressions for arrays you can try typing for yourself:

    [1, 2, 3]
    [1,2,2]
    [1..3]

These are expressions, and you can combine `[]` with other expressions. Go wild with things like:

    [2-1, 2, 2+1]
    [1, 1+1, 1+1+1]
    
We aren't going to spend a lot of time talking about it, but if you enable multiline mode (with ctrl-v), you can also type things like:

    [
      1
      2
      3
      ]

Notice that you are always generating what *appears* to be the same array. But are they identical the same way that every value of `42` is identical to every other value of `42`? Try these for yourself:

    [1..3] is [1,2,3]
    [1,2,3] is [1, 2, 3]
    [1, 2, 3] is [1, 2, 3]
  
How about that! When you type `[1, 2, 3]` or any of its variations, you are typing an expression that generates its own *unique* array that is not identical to any other array, even if that other array also looks like `[1, 2, 3]`!

### why do we talk about "identity" and "sameness," but not "equality?"

Fundamentally, the "equality" that you and I may think we intuitively understand is domain-specific. A trivial case like `[1, 2, 3]` seems very straightforward. But as programs get more complicated, and the data structures they use get more complicated, the rules for when two things are or aren't "equal" for the purposes of the program become more and more specific to each program.[^edge]

[^edge]: Furthermore, what seem like simple algorithms for determining equality have horrible edge cases. We haven't discussed it here, but arrays can contain other arrays, and they can be nested almost indefinitely. Worse, arrays can contain themselves. Or you could have two arrays, with the first containing the second and the second containing the first. A naïve tree traversal to determine equality is not going to work. 

This is why many programming languages for the most part punt on the question of "equality" for complex values and provide tools like equality for numbers and strings to programmers for us to use at our discretion. Our takeaway is that in CoffeeScript, numbers and strings are "canonicalized" such that what we perceive to be equal are also identical, but arrays are not.

In this book, we'll concentrate on "identity," and point out when things that might appear to look the same have different identities, and when two things that may not obviously be identical are actually the same thing.

Every time you evaluate an expression (including typing something in) to create an array, you're creating a new, distinct value even if it *appears* to be the same as some other array value. As we'll see, this is true of many other kinds of values, including *functions*, which are next.