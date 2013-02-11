
## Reassignment and Mutation

Like most imperative programming languages, CoffeeScript allows you to re-assign the value of variables. The syntax is familiar to users of most popular languages:

    do (age = 49) ->
      age = 50
      age
      #=> 50

A> In CoffeeScript, nearly everything is an expression, including statements that assign a value to a variable, so we could just as easily write `do (age = 49) -> age = 50`.

We took the time to carefully examine what happens with bindings in environments. Let's take the time to fully explore what happens with reassigning values to variables. The key is to understand that we are rebinding a different value to the same name in the same environment.

So let's consider what happens with a shadowed variable:

    do (age = 49) ->
      do (age = 50) ->
        # yadda yadda
      age
      #=> 49

Binding `50` to age in the inner environment does not change `age` in the outer environment because the binding of `age` in the inner environment shadows the binding of `age` in the outer environment. We go from:

    {age: 49, '..': global-environment}
    
To:

    {age: 50, '..': {age: 49, '..': global-environment}}
    
Then back to:

    {age: 49, '..': global-environment}
    
However, if we don't shadow `age`, reassigning it in a nested environment changes the original:

    do (age = 49) ->
      do (height = 1.85) ->
        age = 50
      age
      #=> 50

Like evaluating variable labels, when a binding is rebound, CoffeeScript searches for the binding in the current environment and then each ancestor in turn until it finds one. It then rebinds the name in that environment.

### mutation and aliases

Now that we can reassign things, there's another important factor to consider: Some values can *mutate*. Their identities stay the same, but not their structure. Specifically, arrays and objects can mutate. Recall that you can access a value from within an array or an object using `[]`. You can reassign a value using `[]` as well:

    do (oneTwoThree = [1, 2, 3]) ->
      oneTwoThree[0] = 'one'
      oneTwoThree
      #=> [ 'one', 2, 3 ]

You can even add a value:

    do (oneTwoThree = [1, 2, 3]) ->
      oneTwoThree[3] = 'four'
      oneTwoThree
      #=> [ 1, 2, 3, 'four' ]

You can do the same thing with both syntaxes for accessing objects:

    do (name = {firstName: 'Leonard', lastName: 'Braithwaite'}) ->
      name.middleName = 'Austin'
      name
      #=> { firstName: 'Leonard',
      #     lastName: 'Braithwaite',
      #     middleName: 'Austin' }

We have established that CoffeeScript's semantics allow for two different bindings to refer to the same value. For example:

    do (allHallowsEve = [2012, 10, 31]) ->
      halloween = allHallowsEve  
      
Both `halloween` and `allHallowsEve` are bound to the same array value within the local environment. And also:

    do (allHallowsEve = [2012, 10, 31]) ->
      do (allHallowsEve) ->
        # ...

Hello, what's this? What does `do (allHallowsEve) ->` mean? Well, when you put a name in the argument list for `do ->` but you don't supply a value, CoffeeScript assumes you are deliberately trying to shadow a variable. It acts as if you'd written:

    ((allHallowsEve) ->
      # ...
    )(allHallowsEve)

There are two nested environments, and each one binds the name `allHallowsEve` to the exact same array value. In each of these examples, we have created two *aliases* for the same value. Before we could reassign things, the most important point about this is that the identities were the same, because they were the same value.

This is vital. Consider what we already know about shadowing:

    do (allHallowsEve = [2012, 10, 31]) ->
      do (allHallowsEve) ->
        allHallowsEve = [2013, 10, 31]
      allHallowsEve
      #=> [ 2012, 10, 31 ]
      
The outer value of `allHallowsEve` was not changed because all we did was rebind the name `allHallowsEve` within the inner environment. However, what happens if we *mutate* the value in the inner environment?

    do (allHallowsEve = [2012, 10, 31]) ->
      do (allHallowsEve) ->
        allHallowsEve[0] = 2013
      allHallowsEve
      #=> [ 2013, 10, 31 ]
      
This is different. We haven't rebound the inner name to a different variable, we've mutated the value that both bindings share.

The same thing is true whenever you have multiple aliases to the same value:

    do (greatUncle = undefined, grandMother = undefined) ->
      greatUncle = {firstName: 'Leonard', lastName: 'Braithwaite'}
      grandMother = greatUncle
      grandMother['firstName'] = 'Lois'
      grandMother['lastName'] = 'Barzey'
      greatUncle
      #=> { firstName: 'Lois', lastName: 'Barzey' }

This example uses the [`letrec`](#letrec) pattern for declaring bindings. Now that we've finished with mutation and aliases, let's have a look at it.

### letrec {#letrec}

One way to exploit reassignment is to "declare" your bindings with `do` and bind them to something temporarily, and then rebind them inline, like so:

    do (identity = undefined, kestrel = undefined) ->
      identity = (x) -> x
      kestrel = (x) -> (y) -> x

This pattern is called `letrec` after the Lisp special form. Recall that [`let`](#let) looks like this in CoffeeScript:

    do (identity = ((x) -> x), kestrel = (x) -> (y) -> x) ->

To see how `letrec` differs from `let`, consider writing a recursive function[^y] like `pow`. `pow` takes two arguments, `n` and `p`, and returns `n` raised to the `p`^th^ power. For simplicity, we'll assume that `p` is an integer.

    do (pow = undefined) ->
      pow = (n, p) ->
        if p < 0
          1/pow(n, -p)
        else if p is 0
          1
        else if p is 1
          n
        else
          do (half = pow(n, Math.floor(p/2)), remainder = pow(n, p % 2)) ->
            half * half * remainder

[^y]: You may also find [fixed point combinators](https://en.wikipedia.org/wiki/Fixed-point_combinator) interesting.

In order for `pow` to call itself, `pow` must be bound in the environment in which `pow` is defined. This wouldn't work if we tried to bind `pow` in the `do` itself. Here's a misguided attempt to create a recursive function using `let`:

    do (odd = (n) -> if n is 0 then false else not odd(n-1)) ->
      odd(5)

To see why this doesn't work, recall that this is equivalent to writing:

    ((odd) ->
      odd(5)
    )( (n) -> if n is 0 then false else not odd(n-1) )

The expression `(n) -> if n is 0 then false else not odd(n-1)` is evaluated in the parent environment, where `odd` hasn't been bound yet. Whereas, if we wrote `odd` with `letrec`, it would look like this:

    do (odd = undefined) ->
      odd = (n) -> if n is 0 then false else not odd(n-1)
      odd(5)

Which is equivalent to:  
  
    ((odd) ->  
      odd = (n) -> if n is 0 then false else not odd(n-1)
      odd(5)
    )( undefined )

Now the `odd` function is bound in an environment that has a binding for the name `odd`. `letrec` also allows you to make expressions that depend upon each other, recursively or otherwise, such as:

    do (I = undefined, K = undefined, T = undefined, F = undefined) ->
      I = (x) -> x
      K = (x) -> (y) -> x
      T = K
      F = K(I)

### takeaway
      
T> CoffeeScript permits the reassignment of new values to existing bindings, as well as the reassignment and assignment of new values to elements of containers such as arrays and objects. Mutating existing objects has special implications when two bindings are aliases of the same value.
T>
T> The `letrec` pattern allows us to bind interdependent and recursive expressions.