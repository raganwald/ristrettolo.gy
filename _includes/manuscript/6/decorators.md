## Method Decorators

Now that we've seen how function combinators can make our code cleaner and DRYer, it isn't a great leap to ask if we can use combinators with methods. After all, methods are functions. That's one of the great strengths of CoffeeScript, since methods are "just" functions, we don't need to have one kind of tool for functions and another for methods, or a messy way of turning methods into functions and functions into methods.

And the answer is, "Yes we can." With some caveats. Let's get our terminology  synchronized. A combinator is a function that modifies another function. A *method decorator* is a combinator that modifies a method expression used inline. So, all method decorators are combinators, but not all combinators are method decorators.[^py]

[^py]: The term "method decorator" is borrowed from the Python programming language

### decorating object methods

As you recall, an [object method](#object-methods) is a method belonging directly to a Plain Old CoffeeScript object or an instance. All combinators work as decorators for object methods. For example:

    class LazyInitializedMechanism
      constructor: ->
        @initialize = once ->
          # ...
          # complicated stuff
          # ...
      someInstanceMethod: ->
        @initialize()
        # ...
      anotherInstanceMethod: (foo) ->
        @initialize()
        # ...

### decorating constructor methods

Decorating constructor methods works just as well as decorating instance methods, for example:

    class LazyClazz
      @setUpLazyClazz: once ->
        # ...
        # complicated stuff
        # ...
      constructor: ->
        this.constructor.setUpLazyClazz()
        # ...
        
For this class, there's some setup to be done, but it's deferred until the first instance is created.

### decorating instance methods

Decorating instance methods can be tricky if they rely on closures to encapsulate state of any kind. For example, this will not work:

    class BrokenMechanism
      initialize: once ->
        # ...
        # complicated stuff
        # ...
      someInstanceMethod: ->
        @initialize()
        # ...
      anotherInstanceMethod: (foo) ->
        @initialize()
        # ...

If you have more than one `BrokenMechanism`, only one will ever be initialized. There is one `initialize` method, and it belongs to `BrokenMechanism.prototype`, so once it is called for the first `BrokenMechanism` instance, all others calling it for the same or different instances will not execute.

The `initialize` method could be converted from an instance method to an object method as above. An alternate approach is to surrender the perfect encapsulation of `once`, and write a decorator designed for use on instance methods:

    once = (name, method) ->
      ->
        unless @[name]
          @[name] = true
          method.apply(this, arguments)

Now the flag for being done has been changed to an element of the instance, and we use it like this:

    class WorkingMechanism
      initialize: once 'doneInitializing', ->
        # ...
        # complicated stuff
        # ...
      someInstanceMethod: ->
        @initialize()
        # ...
      anotherInstanceMethod: (foo) ->
        @initialize()
        # ...

Since the flag is stored in the instance, the one function works with all instances. (You do need to make sure that each method using the decorator has its own unique name.)

### a decorator for fluent interfaces

[Fluent interfaces][fluent] are a style of API often used for configuration. The principle is to return an instance that has meaningful methods for the next thing you want to do. The simplest (but not only) type of fluent interface is a cascade of methods configuring the same object, such as:

    car = new Automobile()
      .withBucketSeats(2)
      .withStandardTransmission(5)
      .withDoors(4)
      
To implement an interface with this simple API, methods need to return `this`. It's one line and easy to do, but you look at the top of the method to see its name and the bottom of the method to see what it returns. If there are multiple return paths, you must take care that they all return `this`.

It's easy to write a fluent decorator:

    fluent = (method) ->
      ->
        method.apply(this, arguments)
        this
        
And it's easy to use:

    class Automobile
        withBucketSeats: fluent (num) ->
          # ...
        withStandardTransmission: fluent (gears) ->
          # ...
        withDoors: fluent (num) ->
          # ...
          
[fluent]: https://en.wikipedia.org/wiki/Fluent_interface

### combinators for making decorators

Quite a few of the examples involve initializing something before doing some work. This is a very common pattern: Do something *before* invoking a method. Can we extract that into a combinator? Certainly. Here's a combinator that takes a method and returns a decorator:

    before =
      (decoration) ->
        (base) ->
          ->
            decoration.apply(this, arguments)
            base.apply(this, arguments)
            
You would use it like this:

    forcesInitialize = before -> @initialize()

    class WorkingMechanism
      initialize: once 'doneInitializing', ->
        # ...
        # complicated stuff
        # ...
      someInstanceMethod: forcesInitialize ->
        # ...
      anotherInstanceMethod: forcesInitialize (foo) ->
        # ...
        
Of course, you could put anything in there, including the initialization code if you wanted to:

    class WorkingMechanism
      forcesInitialize = before ->
        # ...
        # complicated stuff
        # ...
      someInstanceMethod: forcesInitialize ->
        # ...
      anotherInstanceMethod: forcesInitialize (foo) ->
        # ...

When writing decorators, the same few patterns tend to crop up regularly:

1. You want to do something *before* the method's base logic is executed.
2. You want to do something *after* the method's base logic is executed.
3. You want to wrap some logic *around* the method's base logic.
4. You only want to execute the method's base logic *provided* some condition is truthy.

We saw `before` above. Here are three more combinators that are very useful for writing method decorators:

    after =
      (decoration) ->
        (base) ->
          ->
            decoration.call(this, __value__ = base.apply(this, arguments))
            __value__

    around =
      (decoration) ->
        (base) ->
          (argv...) ->
            __value__ = undefined
            callback = =>
              __value__ = base.apply(this, argv)
            decoration.apply(this, [callback].concat(argv))
            __value__

    provided =
      (condition) ->
        (base) ->
          ->
            if condition.apply(this, arguments)
              base.apply(this, arguments)

All four of these, and many more can be found in the [method combinators][mc] module. They can be used with all CoffeeScript and JavaScript projects.

[mc]: https://github.com/raganwald/method-combinators