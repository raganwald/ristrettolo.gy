
## Object Methods {#object-methods}

An *instance method* is a function defined in the constructor's prototype. Every instance acquires this behaviour unless otherwise "overridden." Instance methods usually have some interaction with the instance, such as references to `this` or to other methods that interact with the instance. A *constructor method* is a function belonging to the constructor itself.

There is a third kind of method, one that any object (obviously including all instances) can have. An *object method* is a function defined in the object itself. Object methods usually have some interaction with the object, such as references to `this` or to other methods that interact with the object.

Object methods are really easy to create with Plain Old CoffeeScript Objects, because they're the only kind of method you can use. Recall from [This and That](#this):

    QueueMaker = ->
      array: []
      head: 0
      tail: -1
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
        
`pushTail`, `pullHead`, and `isEmpty` are object methods. Also, from [encapsulation](#hiding-state):

    stack = do (obj = undefined) ->
      obj =
        array: []
        index: -1
        push: (value) ->
          obj.array[obj.index += 1] = value
        pop: ->
          do (value = obj.array[obj.index]) ->
            obj.array[obj.index] = undefined
            obj.index -= 1 if obj.index >= 0
            value
        isEmpty: ->

Although they don't refer to the object, `push`, `pop`, and `isEmpty` semantically interact with the opaque data structure represented by the object, so they are object methods too.

### object methods within instances

Instances of constructors can have object methods as well. Typically, object methods are added in the constructor. Here's a gratuitous example, a widget model that has a read-only `id`. We're using the class statement, but it could just as easily be rolled by hand:

    class WidgetModel
      constructor: (id, attrs = {}) ->
        this[key] = value for key, value of own attrs
        @id = ->
          id
        this
      set: (attrs) ->
        # ...
      get: (key) ->
        # ...
      has: (key) ->
        # ...

`set`, `get`, and `has` are instance methods, but `id` is an object method: Each object has its own `id` closure, where `id` is bound to the id of the widget by the argument `id` in the constructor. The advantage of this approach is that instances can have different object methods, or object methods with their own closures as in this case. The disadvantage is that every object has its own methods, which uses up much more memory than instance methods, which are shared amongst all instances.
