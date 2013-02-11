## Composition and Extension {#composition}

### composition

A deeply fundamental practice is to build components out of smaller components. The choice of how to divide a component into smaller components is called *factoring*, after the operation in number theory [^refactoring]. 

[^refactoring]: And when you take an already factored component and rearrange things so that it is factored into a different set of subcomponents without altering its behaviour, you are *refactoring*.

The simplest and easiest way to build components out of smaller components in CoffeeScript is also the most obvious: Each component is a value, and the components can be put together into a single object or encapsulated with a closure.

Here's an abstract "model" that supports undo and redo composed from a pair of stacks (see [Encapsulating State](#encapsulation)) and a Plain Old CoffeeScript Object:

    # helper function
    shallowCopy = (source) ->
      do (dest = {}, key = undefined, value = undefined) ->
        dest[key] = value for own key, value of source
        dest

    # our model maker
    ModelMaker = (initialAttributes = {}) ->
      do (attributes = shallowCopy(initialAttributes), 
          undoStack = StackMaker(), 
          redoStack = StackMaker(),
          obj = undefined) ->
        obj = {
          set: (attrsToSet = {}) ->
            undoStack.push(shallowCopy(attributes))
            redoStack = StackMaker() unless redoStack.isEmpty()
            attributes[key] = value for own key, value of attrsToSet
            obj
          undo: ->
            unless undoStack.isEmpty()
              redoStack.push(shallowCopy(attributes))
              attributes = undoStack.pop()
            obj
          redo: ->
            unless redoStack.isEmpty()
              undoStack.push(shallowCopy(attributes))
              attributes = redoStack.pop()
            obj
          get: (key) ->
            attributes(key)
          has: (key) ->
            attributes.hasOwnProperty(key)
          attributes: ->
            shallowCopy(attributes)
        }
        obj

The techniques used for encapsulation work well with composition. In this case, we have a "model" that hides its attribute store as well as its implementation that is composed of of an undo stack and redo stack.

### extension {#extensible}

Another practice that many people consider fundamental is to *extend* an implementation. Meaning, they wish to define a new data structure in terms of adding new operations and semantics to an existing data structure.

Consider a [queue]:

    QueueMaker = ->
      do (array = [], head = 0, tail = -1) ->
        pushTail: (value) ->
          array[tail += 1] = value
        pullHead: ->
          if tail >= head
            do (value = array[head]) ->
              array[head] = undefined
              head += 1
              value
        isEmpty: ->
          tail < head

Now we wish to create a [deque] by adding `pullTail` and `pushHead` operations to our queue.[^wasa] Unfortunately, encapsulation prevents us from adding operations that interact with the hidden data structures.

[queue]: http://duckduckgo.com/Queue_(data_structure)
[deque]: https://en.wikipedia.org/wiki/Double-ended_queue "Double-ended queue"
[^wasa]: Before you start wondering whether a deque is-a queue, we said nothing about types and classes. This relationship is called was-a, or "implemented in terms of a."

This isn't really surprising: The entire point of encapsulation is to create an opaque data structure that can only be manipulated through its public interface. The design goals of encapsulation and extension are always going to exist in tension.

Let's "de-encapsulate" our queue:

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

Now we can extend a queue into a deque, with a little help from a helper function `extend`:

    # helper function
    extend = (object, extensions) ->
      object[key] = value for key, value of extensions
      object
    
    # a deque maker
    DequeMaker = ->
      do (deque = QueueMaker()) ->
        extend(deque,
          size: ->
            deque.tail - deque.head + 1
          pullTail: ->
            unless deque.isEmpty()
              do (value = deque.array[deque.tail]) ->
                deque.array[deque.tail] = undefined
                deque.tail -= 1
                value
          pushHead: do (INCREMENT = 4) ->
            (value) ->
              if deque.head is 0
                for i in [deque.tail..deque.head]
                  deque.array[i + INCREMENT] = deque.array[i]
                deque.tail += INCREMENT
                deque.head += INCREMENT
              deque.array[deque.head -= 1] = value
        )

Presto, we have reuse through extension, at the cost of encapsulation.

T> Encapsulation and Extension exist in a natural state of tension. A program with elaborate encapsulation resists breakage but can also be difficult to refactor in other ways. Be mindful of when it's best to Compose and when it's best to Extend.