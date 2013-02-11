
## Refactoring to Combinators {#combinators}

The word "combinator" has a precise technical meaning in mathematics:

> "A combinator is a higher-order function that uses only function application and earlier defined combinators to define a result from its arguments."--[Wikipedia][combinators]

[combinators]: https://en.wikipedia.org/wiki/Combinatory_logic "Combinatory Logic"

In this book, we will be using a much looser definition of "combinator:" Pure functions that act on other functions to produce functions. Combinators are the adverbs of functional programming.

### memoize

Let's begin with an example of a combinator, `memoize`. Consider that age-old interview quiz, writing a recursive fibonacci function (there are other ways to derive a fibonacci number, of course). Here's simple implementation:

    fibonacci = (n) ->
      if n < 2
        n
      else
        fibonacci(n-2) + fibonacci(n-1)

We'll time it:

    s = (new Date()).getTime()
    new Fibonacci(45).toInt()
    ( (new Date()).getTime() - s ) / 1000
      #=> 28.565
      
Why is it so slow? Well, it has a nasty habit of recalculating the same results over and over and over again. We could rearrange the computation to avoid this, but let's be lazy and trade space for time. What we want to do is use a lookup table. Whenever we want a result, we look it up. If we don't have it, we calculate it and write the result in the table to use in the future. If we do have it, we return the result without recalculating it.

We could write something specific for fibonacci and then generalize it, but let's skip right to a general solution (we'll discuss extracting a combinator below). First, a new feature. Within any function the name `arguments` is always bound to an object that behaves like a collection of all the arguments passed to a function. Using `arguments`, here is a `memoize` implementation that works for many[^json] kinds of functions:

    memoized = (fn) ->
      do (lookupTable = {}, key = undefined, value = undefined) ->
        ->
          key = JSON.stringify(arguments)
          lookupTable[key] or= fn.apply(this, arguments)

We can apply `memoized` to a function and we will get back a new function that memoizes its results.

Let's try it:

    fastFibonacci =
      memoized (n) ->
        if n < 2
          n
        else
          fastFibonacci(n-2) + fastFibonacci(n-1)

    fastFibonacci(45)
      #=> 1134903170

We get the result back instantly. It works!

X> Exercise:
X>
X> Optimistic Ophelia tries the following code:
X>
X> <<(code/ophelia.coffee)
X>
X> Does `quickFibonacci` behave differently than `fastFibonacci`? Why?

By using a combinator instead of tangling lookup code with the actual "domain logic" of fibonacci, our `fastFibonacci` code is easy to read and understand. As a bonus, we DRY up our application, as the same `memoize` combinator can be used in many different places.

[^json]: To be precise, it works for functions that take arguments that can be expressed with JSON. So you can't memoize a function that is applied to functions, but it's fine for strings, numbers, arrays of JSON, POCOs of JSON, and so forth.

### the once and future combinator refactoring

Combinators can often be extracted from your code. The result is cleaner than the kinds of refactorings possible in languages that have less flexible functions. Let's walk through the process of discovering a combinator to get a feel for the refactoring to combinator process.

Some functions should only be evaluated once, but might be invoked more than once. You want to evaluate them the first time they are called, but thereafter ignore the invocation. 

We'd start with a function like this, it assumes there's some "it" that needs to be initialized once, and several pieces of code might call this function before using "it:"

    ensureItIsInitialized = do (itIsInitialized = false) ->
      ->
        unless itIsInitialized
          itIsInitialized = true
          # ...
          # initialization code
          # ...

The typical meta-pattern is when several different functions all share a common precondition such as loading certain constant data from a server or initializing a resource. We can see that we're tangling the concern of initializing once with the concern of how to perform the initialization. Let's [extract a method][em]:

    initializeIt = ->
      # ...
      # initialization code
      # ...
    ensureItIsInitialized = do (itIsInitialized = false) ->
      ->
        unless itIsInitialized
          itIsInitialized = true
          initializeIt()

In many other languages, we'd stop right there. But in CoffeeScript, we can see that `ensureItIsInitialized` is much more generic than its name suggests. Let's convert it to a combinator with a slight variation on the [extracting a parameter][ep]. We'll call the combinator `once`:

    once = (fn) ->
      do (done = false) ->
        ->
          unless done
            done = true
            fn.apply(this, arguments)
            
And now our code is very clean:

    initializeIt = ->
      # ...
      # initialization code
      # ...
    ensureItIsInitialized = once(initializeIt)
    
This is so clean you could get rid of `initializeIt` as a named function:

    ensureItIsInitialized = once ->
      # ...
      # initialization code
      # ...
      
The concept of a combinator is more important than having a specific portfolio of combinators at your fingertips (although that is always nice). The meta-pattern is that when you are working with a function, identify the core "domain logic" the function should express. Try to extract that and turn what is left into one or more combinators that take functions as parameters rather than single-purpose methods.

(The `memoize` and `once` combinators are available in the [underscore.js](http://underscorejs.org) library along with several other handy functions that operate on functions such as `throttle` and `debounce`.)

### Composition and Combinators

Although you can write nearly any function and use it as a combinator, one property that is nearly essential is *composability*. It should be possible to pass the result of one combinator as the argument to another.

Let's consider this combinator as an example:

    requiresValues = (fn) ->
      ->
        throw "Value Required" unless arg? for arg in arguments
        fn.apply(this, arguments)

And this one:

    requiresReturnValue = (fn) ->
      ->
        do (result = fn.apply(this, arguments)) ->
          throw "Value Required" unless result?
          result
                
You can use *both* of these combinators and the `once` combinator on a function to add some runtime validation that both input arguments and the returned value are defined:

    checkedFibonacci = once requiresValues requiresReturnValue (n) ->
      if n < 2
        n
      else
        fibonacci(n-2) + fibonacci(n-1)
        
Combinators should be designed by default to compose. And speaking of composition, it's easy to compose functions in CoffeeScript:

    checkBoth = (fn) ->
        requiresValues requiresReturnValue fn
        
Libraries like [Functional] also provide `compose` and `sequence` functions, so you can write things like:

    checkBoth = Functional.compose(requiresValues, requiresReturnValue)
    
All of this is made possible by the simple property of *composability*, the property of combinators taking a function as an argument and returning a function that operates on the same arguments and returns something meaningful to code expecting to call the original function.

[em]: http://refactoring.com/catalog/extractMethod.html
[ep]: http://www.industriallogic.com/xp/refactoring/extractParamter.html
[Functional]: http://osteele.com/sources/javascript/functional/