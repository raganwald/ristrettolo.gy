## Prototypes are Simple, it's the Explanations that are Hard To Understand

As you recall from our code for making objects [extensible](#extensible), we wrote a function that returned a Plain Old CoffeeScript Object. The colloquial term for this kind of function is a "Factory Function."

Let's strip a function down to the very bare essentials:

    Ur = ->

This doesn't look like a factory function: It doesn't have an expression that yields a Plain Old CoffeeScript Object when the function is applied. Yet, there is a way to make an object out of it. Behold the power of the `new` keyword:

    new Ur()
      #=> {}
      
We got an object back! What can we find out about this object?

    new Ur() is new Ur()
      #=> false

Every time we call `new` with a function and get an object back, we get a unique object. We could call these "Objects created with the `new` keyword," but this would be cumbersome. So we're going to call them *instances*. Instances of what? Instances of the function that creates them. So given `i = new Ur()`, we say that `i` is an instance of `Ur`.

For reasons that will be explained after we've discussed prototypes, we also say that `Ur` is the *constructor* of `i`, and that `Ur` is a *constructor function*. Therefore, an instance is an object created by using the `new` keyword on a constructor function, and that function is the instance's constructor.

A> We are going to look at CoffeeScript's `class` keyword later, but it's worth noting that what CoffeeScript calls a constructor function does almost everything that people think of when they use the word "class." It constructs instances, it defines their common behaviour, and it can be tested.

### prototypes

There's more. Here's something you may not know about functions:

    Ur.prototype
      #=> {}
    
What's this prototype? Let's run our standard test:

    (->).prototype is (->).prototype
      #=> false

Every function is initialized with its own unique `prototype`. What does it do? Let's try something:

    Ur.prototype.language = 'CoffeeScript'
    
    continent = new Ur()
      #=> {}
    continent.language
      #=> 'CoffeeScript'

That's very interesting! Instances seem to behave as if they had the same elements as their constructor's prototype. Let's try a few things:

    continent.language = 'JavaScript'
    continent
      #=> {language: 'JavaScript'}
    continent.language
      #=> 'JavaScript'
    Ur.prototype.language
      'CoffeeScript'

You can set elements of an instance, and they "override" the constructor's prototype, but they don't actually change the constructor's prototype. Let's make another instance and try something else.

    another = new Ur()
      #=> {}
    another.language
      #=> 'CoffeeScript'
      
New instances don't acquire any changes made to other instances. Makes sense. And:

    Ur.prototype.language = 'Sumerian'
    another.language
      #=> 'Sumerian'

Even more interesting: Changing the constructor's prototype changes the behaviour of all of its instances. This strongly implies that there is a dynamic relationship between instances and their constructors, rather than some kind of mechanism that makes objects by copying.[^dynamic]

[^dynamic]: For many programmers, the distinction between a dynamic relationship and a copying mechanism too fine to worry about. However, it makes many dynamic program modifications possible.

Speaking of prototypes, here's something else that's very interesting:

    continent.constructor
      #=> [Function]
      
    continent.constructor is Ur
      #=> true

Every instance acquires a `constructor` element that is initialized to their constructor. This is true even for objects we don't create with `new` in our own code:

    {}.constructor
      #=> [Function: Object]
      
If that's true, what about prototypes? Do they have constructors?

    Ur.prototype.constructor
      #=> [Function]
    Ur.prototype.constructor is Ur
      #=> true

Very interesting! We will take another look at the `constructor` element when we discuss [class extension](#classextension).

### revisiting `this` idea of queues

Let's rewrite our Queue to use `new` and `.prototype`, using `this` and `=>`:

    extend = (object, extensions) ->
      object[key] = value for key, value of extensions
      object

    Queue = ->
      extend(this, {
        array: []
        head: 0
        tail: -1
      })
      
    extend(Queue.prototype,
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
    )

You recall that when we first looked at `this`, we only covered the case where a function that belongs to an object is invoked. Now we see another case: When a function is invoked by the `new` operator, `this` is set to the new object being created. Thus, our code for `Queue` initializes the queue.

You can see why `this` is so handy in CoffeeScript: We wouldn't be able to define functions in the prototype that worked on the instance if CoffeeScript didn't give us an easy way to refer to the instance itself.

### objects everywhere?

Now that you know about prototypes, it's time to acknowledge something that even small children know: Everything in CoffeeScript behaves like an object, everything in CoffeeScript behaves like an instance of a function, and therefore everything in CoffeeScript behaves as if it inherits some methods from its constructor's prototype and/or has some elements of its own.

For example:

    3.14159265.toPrecision(5)
      #=> '3.1415'
      
    'FORTRAN, SNOBOL, LISP, BASIC'.split(', ')
      #=> [ 'FORTRAN',
      #     'SNOBOL',
      #     'LISP',
      #     'BASIC' ]
      
    [ 'FORTRAN',
      'SNOBOL',
      'LISP',
      'BASIC' ].length
    #=> 5
    
Functions themselves are instances, and they have methods. For example, we know that CoffeeScript treats the fat arrow as if you were using the `this` and `that` idiom. But if you didn't have a fat arrow and you didn't want to take a chance on getting the idiom wrong, you could take advantage of the fact that every function has a method `call`.

Call's first argument is a *context*: When you invoke `.call` on a function, it invoked the function, setting `this` to the context. It passes the remainder of the arguments to the function.

So, if we have:

      pullHead: ->
        unless this.isEmpty()
          do (value = this.array[this.head]) =>
            this.array[this.head] = undefined
            this.head += 1
            value

We could also write it like this:

      pullHead: ->
        unless this.isEmpty()
          ((value) ->
            this.array[this.head] = undefined
            this.head += 1
            value
          ).call(this, this.array[this.head])

It seems like are objects everywhere in CoffeeScript!