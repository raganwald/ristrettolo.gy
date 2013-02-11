
## Comprehensions {#comprehensions}

![Cupping Grinds](assets/images/cupping.jpg)

If you're the type of person who can "Write Lisp in any language," you could set about writing entire CoffeeScript programs using `let` and `letrec` patterns such that you don't have *any* normal variables. But being a CoffeeScript programmer, you will no doubt embrace normal variables. As you dive into CoffeeScript, you'll discover many helpful features that aren't "Lisp-y." Eschewing them is to cut against CoffeeScript's grain. One of those features is the [comprehension], a mechanism for working with collections that was popularized by Python.

[comprehension]: http://coffeescript.org/#loops

Here's a sample comprehension:

		names = ['algernon', 'sabine', 'rupert', 'theodora']

    "Hello #{yourName}" for yourName in names
      #=> [ 'Hello algernon',
      #     'Hello sabine',
      #     'Hello rupert',
      #     'Hello theodora' ]

An alternate syntax for the same thing that supports multiple expressions is:

    for yourName in names
      "Hello #{yourName}"
      #=> [ 'Hello algernon',
      #     'Hello sabine',
      #     'Hello rupert',
      #     'Hello theodora' ]
      
Here's a question: There's a variable reference `yourName` in this code. Is it somehow bound to a new environment in the comprehension? Or is it a "normal variable" that is either bound in the current function's environment or in a parent function's environment?

Let's try it and see:

    yourName = 'clyde'
    "Hello #{yourName}" for yourName in names
    yourName
      #=> 'theodora'

It's a normal variable. If it was somehow 'local' to the comprehension, `yourName` would still be `clyde` as the comprehension's binding would shadow the current environment's binding. This is usually fine, as creating a new environment for every comprehension could have performance implications.

However, there are two times you don't want that to happen. First, you might want `yourName` to shadow the existing `yourName` binding. You can use `do` to fix that:

    yourName = 'clyde'
    do (yourName) ->
      "Hello #{yourName}" for yourName in names
    yourName
      #=> `clyde`

Recall that when you put a name in the argument list for `do ->` but you don't supply a value, CoffeeScript assumes you are deliberately trying to shadow a variable. It acts as if you'd written:

    yourName = 'clyde'
    ((yourName) ->
      "Hello #{yourName}" for yourName in names
    )(yourName)
    yourName
      #=> `clyde`

So technically, the inner `yourName` will be bound to the same value as the outer `yourName` initially, but as the comprehension is evaluated, that value will be overwritten in the inner environment but not the outer environment.

### preventing a subtle comprehensions bug

Consider this variation of the above comprehension:

    for myName in names
      (yourName) -> "Hello #{yourName}, my name is #{myName}"

Now what we want is four functions, each of which can generate a sentence like "Hello reader, my name is rupert". We can test that with a comprehension:

    fn('reader') for fn in for myName in names
      (yourName) -> "Hello #{yourName}, my name is #{myName}"
	      #=> [ 'Hello reader, my name is theodora',
	      #     'Hello reader, my name is theodora',
	      #     'Hello reader, my name is theodora',
	      #     'Hello reader, my name is theodora' ]
            
WTF!?

If we consider our model for binding, we'll quickly discover the problem. Each of the functions we generate has a closure that consists of a function and a local environment. `yourName` is bound in its local environment, but `myName` is bound in the comprehension's environment. At the time each closure was created, `myName` was bound to one of the four names, but at the time the closures are evaluated, `myName` is bound to the last of the four names.

Each of the four closures has its own local environment, but they *share* a parent environment, which means they share the exact same binding for `myName`. We can fix it using the "shadow" syntax for `do`:

    fn('reader') for fn in for myName in names
      do (myName) ->
        (yourName) -> "Hello #{yourName}, my name is #{myName}"
      #=> [ 'Hello reader, my name is algernon',
      #     'Hello reader, my name is sabine',
      #     'Hello reader, my name is rupert',
      #     'Hello reader, my name is theodora' ]

Now, each time we create a function we're first creating its own environment and binding `myName` there, shadowing the comprehension's binding of `myName`. Thus, the comprehension's changes to `myName` don't change each closure's binding.

### takeaway

T> [Comprehensions](http://coffeescript.org/#loops) are extraordinarily useful for working with collections, but their loop variables are normal variables and may require special care to obtain the desired results. Also worth noting: Comprehensions may be the *only* place where `let` or `do` is *necessary* in CoffeeScript. Every other case can probably be handled with appropriate use of normal variables.