## This and That {#this}

Let's take another look at [extensible objects](#extensible). Here's a Queue:

    QueueMaker = ->
      do (queue = undefined) ->
        queue = 
          array: []
          head: 0
          tail: -1
          pushTail: (value) ->
            queue.array[queue.tail += 1] = value
          pullHead: do (value = undefined) ->
                      ->
                        unless queue.isEmpty()
                          value = queue.array[queue.head]
                          queue.array[queue.head] = undefined
                          queue.head += 1
                          value
          isEmpty: ->
            queue.tail < queue.head

    queue = QueueMaker()
    queue.pushTail('Hello')
    queue.pushTail('CoffeeScript')

Let's make a copy of our queue using a handy `extend` function and a comprehension to make sure we copy the array properly:

    extend = (object, extensions) ->
      object[key] = value for key, value of extensions
      object

    copyOfQueue = extend({}, queue)
    copyOfQueue.array = (element for element in queue.array)
    
    queue isnt copyOfQueue
      #=> true

And start playing with our copies:

    copyOfQueue.pullHead()
      #=> 'Hello'
      
    queue.pullHead()
      #=> 'CoffeeScript'
      
What!? Even though we carefully made a copy of the array to prevent aliasing, it seems that our two queues behave like aliases of each other. The problem is that while we've carefully copied our array and other elements over, the closures all share the same environment, and therefore the functions in `copyOfQueue` all operate on the first queue.

A> This is a general issue with closures. Closures couple functions to environments, and that makes them very elegant in the small, and very handy for making opaque data structures. Alas, their strength in the small is their weakness in the large. When you're trying to make reusable components, this coupling is sometimes a hindrance.

Let's take an impossibly optimistic flight of fancy:

    AmnesiacQueueMaker = ->
      array: []
      head: 0
      tail: -1
      pushTail: (myself, value) ->
        myself.array[myself.tail += 1] = value
      pullHead: do (value = undefined) ->
                  (myself) ->
                    unless myself.isEmpty(myself)
                      value = myself.array[myself.head]
                      myself.array[myself.head] = undefined
                      myself.head += 1
                      value
      isEmpty: (myself) ->
        myself.tail < myself.head

    queueWithAmnesia = AmnesiacQueueMaker()
    queueWithAmnesia.pushTail(queueWithAmnesia, 'Hello')
    queueWithAmnesia.pushTail(queueWithAmnesia, 'CoffeeScript')
    
The `AmnesiacQueueMaker` makes queues with amnesia: They don't know who they are, so every time we invoke one of their functions, we have to tell them who they are. You can work out the implications for copying queues as a thought experiment: We don't have to worry about environments, because every function operates on the queue you pass in.

The killer drawback, of course, is making sure we are always passing the correct queue in every time we invoke a function. What to do?

### what's all `this`?

Any time we must do the same repetitive thing over and over and over again, we industrial humans try to build a machine to do it for us. CoffeeScript is one such machine:

    BanksQueueMaker = ->
      array: []
      head: 0
      tail: -1
      pushTail: (value) ->
        this.array[this.tail += 1] = value
      pullHead: do (value = undefined) ->
                  ->
                    unless this.isEmpty()
                      value = this.array[this.head]
                      this.array[this.head] = undefined
                      this.head += 1
                      value
      isEmpty: ->
        this.tail < this.head

    banksQueue = BanksQueueMaker()
    banksQueue.pushTail('Hello')
    banksQueue.pushTail('CoffeeScript') 

Every time you invoke a function that is a member of an object, CoffeeScript binds that object to the name `this` in the environment of the function just as if it was an argument.[^this] Now we can easily make copies:

    copyOfQueue = extend({}, banksQueue)
    copyOfQueue.array = (element for element in banksQueue.array)

    copyOfQueue.pullHead()
      #=> 'Hello'
      
    banksQueue.pullHead()
      #=> 'Hello'

Presto, we now have a way to copy arrays. By getting rid of the closure and taking advantage of `this`, we have functions that are more easily portable between objects, and the code is simpler as well.

T> Closures tightly couple functions to the environments where they are created limiting their flexibility. Using `this` alleviates the coupling. Copying objects is but one example of where that flexibility is needed.

### fat arrows are the cure for obese idioms

Wait a second! Let's flip back [a few pages](#extensible "extension") and look at the code for a Queue:

    QueueMaker = ->
      do (queue = undefined) ->
        queue = 
          array: []
          head: 0
          tail: -1
          pushTail: (value) ->
            queue.array[queue.tail += 1] = value
          pullHead: ->
            unless queue.isEmpty()
              do (value = queue.array[queue.head]) ->
                queue.array[queue.head] = undefined
                queue.head += 1
                value
          isEmpty: ->
            queue.tail < queue.head

Spot the difference? Here's the `pullHead` function we're using now:

    pullHead: do (value = undefined) ->
                ->
                  unless this.isEmpty()
                    value = this.array[this.head]
                    this.array[this.head] = undefined
                    this.head += 1
                    value

Sneaky: The version of the `pullHead` function moves the `do` outside the function. Why? Let's rewrite it to look like the old version:

    pullHead: ->
      unless this.isEmpty()
        do (value = this.array[this.head]) ->
          this.array[this.head] = undefined
          this.head += 1
          value

Notice that we have a function. We invoke it, and `this` is set to our object. Then, thanks to the `do`, we invoke another function inside that. The function invoked by the `do` keyword does not belong to our object, so `this` is not set to our object. Oops!

A> Interestingly, this showcases one of CoffeeScript's greatest strengths and weaknesses. Since everything's a function, we have a set of tools that interoperate on everything the exact same way. However, there are some ways that functions don't appear to do exactly what we think they'll do.
A>
A> For example, if you put a `return 'foo'` inside a `do`, you don't return from the function enclosing the do, you return from the `do` itself. And as we see, `this` gets set "incorrectly." The Ruby programming language tries to solve this problem by having something--blocks--that look a lot like functions, but act more like syntax. The cost of that decision, of course, is that you have two different kinds of things that look similar but behave differently. (Make that five: Ruby has unbound methods, bound methods, procs, lambdas, and blocks.)

There are two solutions. The error-prone workaround is to write:

    pullHead: ->
      unless this.isEmpty()
        do (value = this.array[this.head], that = this) ->
          that.array[that.head] = undefined
          that.head += 1
          value

Besides its lack of pulchritude, there are many opportunities to mistakingly write `this` when you meant to write `that`. Or `that` for `this`. Or something, especially when refactoring some code.

The better way is to force the function to have the `this` you want. CoffeeScript gives you the "fat arrow" or `=>` for this purpose. Here it is:

    pullHead: ->
      unless this.isEmpty()
        do (value = this.array[this.head]) =>
          this.array[this.head] = undefined
          this.head += 1
          value

The fat arrow says, "Treat this function as if we did the `this` and `that` idiom, so that whenever I refer to `this`, I get the outer one." Which is exactly what we want if we don't care to rearrange our code.

[^this]: CoffeeScript also does other things with `this` as well, but this is all we care about right now.