## Extending Classes {#classextension}

You recall from [Composition and Extension](#extensible) that we extended a Plain Old CoffeeScript Queue to create a Plain Old CoffeeScript Deque. But what if we have decided to use CoffeeScript's prototypes and class statements instead of Plain Old CoffeeScript Objects? How do we extend a queue into a deque?

Here's our `Queue`:

    class Queue
      constructor: ->
        @array = []
        @head  = 0
        @tail  = -1
      pushTail: (value) ->
        @array[@tail += 1] = value
      pullHead: ->
        unless @isEmpty()
          do (value = @array[@head]) =>
            @array[@head] = undefined
            @head += 1
            value
      isEmpty: ->
        @tail < @head

And our `Deque` before we wire things together:

    class Deque
      size: ->
        @tail - @head + 1
      pullTail: ->
        unless @isEmpty()
          do (value = @array[@tail]) =>
            @array[@tail] = undefined
            @tail -= 1
            value
      INCREMENT = 4
      pushHead: (value) ->
        if @head is 0
          for i in [@tail..@head]
            @array[i + INCREMENT] = @array[i]
          @tail += INCREMENT
          @head += INCREMENT
        @array[@head -= 1] = value

So what do we want from dequeues?

1. A `Deque` function that initializes a deque when invoked with `new`
2. `Deque.prototype` must have all the behaviour of a deque and all the behaviour of a queue.

Hmmm. So, should we copy everything from `Queue.prototype` into `Deque.prototype`? No, there's a better idea. Prototypes are objects, right? Why must they be Plain Old CoffeeScript Objects? Can't a prototype be an *instance*?

Yes they can. Imagine that `Deque.prototype` was a proxy for an instance of `Queue`. It would, of course, have all of a queue's behaviour through `Queue.prototype`. We don't want it to be an *actual* instance, mind you. It probably doesn't matter with a queue, but some of the things we might work with might make things awkward if we make random instances. A database connection comes to mind, we may not want to create one just for the convenience of having access to its behaviour.

Here's such a proxy:

    QueueProxy = ->
    
    QueueProxy.prototype = Queue.prototype
    
Our `QueueProxy` isn't actually a `Queue`, but its `prototype` is an alias of `Queue.prototype`. Thus, it can pick up `Queue`'s behaviour. We want to use it for our `Deque`'s prototype. Let's insert that code in our class:

    class Deque
      QueueProxy = ->
      QueueProxy.prototype = Queue.prototype
      Deque.prototype = new QueueProxy()
      size: ->
        @tail - @head + 1
      # ...

Before we rush off to try this, we're missing something. How are we going to initialize our deques? We'd better call `Queue`'s constructor:

    constructor: ->
      Queue.prototype.constructor.call(this)

Here's what we have so far:

    class Deque
      QueueProxy = ->
      QueueProxy.prototype = Queue.prototype
      @prototype = new QueueProxy()
      constructor: ->
        Queue.prototype.constructor.call(this)
      # ...
      
And it seems to work:

    d = new Deque()
    d.pushTail('Hello')
    d.pushTail('CoffeeScript')
    d.pushTail('!')
    d.pullHead()
      #=> 'Hello'
    d.pullTail()
      #=> '!'
    d.pullHead()
      #=> 'CoffeeScript'
      
Wonderful!
      
### getting the constructor element right

How about some of the other things we've come to expect from instances?

    d.constructor is Deque
      #=> false
      
Oops! Messing around with Dequeue's prototype broke this important equivalence. Luckily for us, the `constructor` property is mutable for objects we create. So, let's make a small change to `QueueProxy`:

    class Deque
      QueueProxy = ->
        @constructor = Deque
        this
      QueueProxy.prototype = Queue.prototype
      @prototype = new QueueProxy();
      # ...
      
Now it works:

    d.constructor is Deque
      #=> true

The `QueueProxy` function now sets the `constructor` for every instance of a `QueueProxy` (hopefully just the one we need for the `Deque` class). It returns the object being created (it could also return `undefined` and work. But if it carelessly returned something else, that would be assigned to `Deque`'s prototype, which would break our code).

### extracting the boilerplate

Let's turn our extension modifications into a function:

    xtend = (child, parent) ->
      do (proxy = undefined) ->
        proxy = ->
          @constructor = child
          this
        proxy.prototype = parent.prototype
        child.prototype = new proxy()

And use it in `Deque`:

    class Deque
      xtend(Deque, Queue)
      constructor: ->
        Queue.prototype.constructor.call(this)
      size: ->
        @tail - @head + 1
      pullTail: ->
        unless @isEmpty()
          do (value = @array[@tail]) =>
            @array[@tail] = undefined
            @tail -= 1
            value
      INCREMENT = 4
      pushHead: (value) ->
        if @head is 0
          for i in [@tail..@head]
            @array[i + INCREMENT] = @array[i]
          @tail += INCREMENT
          @head += INCREMENT
        @array[@head -= 1] = value

And you can use `xtend` even if you don't want to use the class statement:

    A = ->
    B = ->
    xtend(B, A)

It's such a nice idea. Wouldn't it be great if CoffeeScript had it built-in? Behold:

    B extends A

Most helpful! In fact, CoffeeScript's keyword is superior to the `xtend` function: It provides support for extending functions that have other properties, not just the prototype.[^xt] 

[^xt]: You should almost always use `extends` rather than rolling your own code to chain functions and instances. And even if you let CoffeeScript do the work, you should always *understand* what CoffeeScript is doing for you.

How about the class statement? CoffeeScript does a lot more work for you if you wish. You can write:

    class Deque
      Deque extends Queue
      constructor: ->
        Queue.prototype.constructor.call(this)
      # ...

But there's more. If you instead write:

    class Deque extends Queue
      # ...

1. CoffeeScript will do even more work for you. If you aren't doing any extra setup, you can leave the constructor out. CoffeeScript will handle calling the extended function's constructor for you.
2. If you do wish to do some extra setup, write your own constructor. Like Ruby, you can call `super` in any method to access the extended version of the same method.
3. CoffeeScript's `class` and `extends` keywords handle a lot of the boilerplate and play nicely together. Use them unless you have specific needs they don't cover.