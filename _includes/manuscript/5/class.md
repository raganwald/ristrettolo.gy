
## A Touch of Class

CoffeeScript has "classes," for some definition of "class." You've met them already, they're constructors that are designed to work with the `new` keyword and have behaviour in their `.prototype` element. You can create one any time you like by:

1. Writing the constructor so that it performs any initialization on `this`, and:
2. Putting all of the method definitions in its prototype.

This is simple enough, but there are some advantages to making it even simpler, so CoffeeScript does. Here's our queue again:

    class Queue
      constructor: ->
        extend(this,
          array: []
          head: 0
          tail: -1
        )
      pushTail: (value) ->
        this.array[this.tail += 1] = value
      pullHead: ->
        unless this.isEmpty()
          do (value = this.array[this.head]) =>
            this.array[this.head] = undefined
            this.head += 1
            value
      isEmpty: ->
        this.tail < this.head
        
    q = new Queue()
    q.pushTail('hello')
    q.pushTail('CoffeeScript')

Behind the scenes, CoffeeScript acts as if you'd written things out by hand, with several small but relevant details.

### the constructor method

As you've probably noticed, CoffeeScript turns what may look like a `constructor` method into the body of the `Queue` function. You recall that every object in CoffeeScript has a `constructor` element initialized to the function that created it. So it's natural that in the class statement, you use `constructor` to define the body of the function.

### scope

CoffeeScript wraps the entire class statement in a `do ->` so that you can work with some normal variables if you need them.

Here's a gratuitous example:

    class Queue
      empty = 'UNUSED'
      constructor: ->
        extend(this,
          array: []
          head: 0
          tail: -1
        )
      pushTail: (value) ->
        this.array[this.tail += 1] = value
      pullHead: ->
        unless this.isEmpty()
          do (value = this.array[this.head]) =>
            this.array[this.head] = empty
            this.head += 1
            value
      isEmpty: ->
        this.tail < this.head

The value `'UNUSED'` is bound to the name `empty` within the class "statement" but not outside it (unless you are aliasing an `empty` variable). CoffeeScript allows this kind of thing but will get hissy if you try to get fancy and write something like:

    class Queue
      do (empty = 'UNUSED') ->
        constructor: ->
          extend(this,
            array: []
            head: 0
            tail: -1
          )
        # ...

That won't work, you can't wrap a `do` around the instance methods of the class.

### at-at walkers

CoffeeScript, in what may be an homage to Ruby, provides an abbreviation for `this.`, you can preface any label with an `@` as a shortcut. This small detail could easily be ignored, except for the fact that there's one place where it's mandatory. With that teaser in place, let's discuss a use case.

Let's modify our Queue to count how many queues have been created:

    class Queue
      constructor: ->
        Queue.queues += 1
        extend(this,
          array: []
          head: 0
          tail: -1
        )
      # ...

    Queue.queues = 0

To make this work properly, CoffeeScript has to wrap our code in a `do` so that the code in the constructor *always* refers to the correct function, even if we subsequently change the binding for `Queue` in the outer environment. CoffeeScript does this.

Assigning values to elements of the function outside of the `class` statement is awkward, so CoffeeScript lets us put `Queue.queues = 0` inside, anywhere we'd like. The top is fine. But interestingly, CoffeeScript also sets the context of the body of the `class` statement to be the class itself. So we can write:

    class Queue
      this.queues = 0
      constructor: ->
        Queue.queues += 1
        extend(this,
          array: []
          head: 0
          tail: -1
        )
      # ...

And back to our shortcut. We can also write:

    class Queue
      @queues = 0
      constructor: ->
        Queue.queues += 1
        extend(this,
          array: []
          head: 0
          tail: -1
        )
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

Everything up to now has been a matter of taste. But should you wish, you can write:

    class Queue
      @queues: 0
      # ...

Putting the `@` prefix (and not `this.`) on a label as part of the structure inside the class statement indicates that the element belongs to the constructor (or "class") and not the prototype. Obviously, if you put functions in the constructor, you get constructor methods and not instance methods. For example:

    class Queue
      @queues: 0
      @resetQueues: ->
        @queues = 0
      # ...
      
We've added a constructor method to reset the count.

![It seems there is Strong Typing in Coffeeland](images/types.jpg)

T> **Classes**
T>
T> CoffeeScript's `class` statement is a nice syntactic convenience over manually wiring everything up, and it may help avoid errors. Since most CoffeeScript programmers will use "classes," it's wise to use the class statement when the underlying semantics are what you want. That way your code will communicate its intent clearly and be a little more resistant to small errors.