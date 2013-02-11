
## Callbacks and Promises

Like nearly all languages in widespread use, CoffeeScript expresses programs as expressions that are composed together with a combination of operators, function application, and control flow constructs such as sequences of statements.

That's all baked into the underlying language, so it's easy to use it without thinking about it. Much as a fish (perhaps) exists in the ocean without being aware that there is an ocean. In this chapter, we're going to examine how to compose functions together when we have non-traditional forms of control-flow such as asynchronous function invocation.

### composition 

The very simplest example of composing functions is simply "pipelining" the values. CoffeeScript's optional parentheses make this quite readable. Given:

    getIdFromSession = (session) ->
      # ...

    fetchCustomerById = (id) ->
      # ...
      
    currentSession = # ...
    
You can write either:
      
    customerList.add(
      fetchCustomerById(
        getIdFromSession(
          currentSession
         )
      )
    )
    
Or:

    customerList.add fetchCustomerById getIdFromSession currentSession
    
The "flow" of data is from right-to-left. Some people find it more readable to go from left-to-right. The `sequence` function accomplishes this:

    sequence = ->
      do (fns = arguments) ->
        (value) ->
          (value = fn(value)) for fn in fns
          value
   
    sequence(
      fetchCustomerById,
      getIdFromSession,
      customerList.add
    )(currentSession)

### asynchronous code

CoffeeScript executes within an environment where code can be invoked asynchronously. For example, a browser application can asynchronously invoke a request to a remote server and invoke handler code when the request is satisfied or deemed to have failed.

A very simple example is that in a browser application, you can defer invocation of a function after all current processing has been completed:

    defer (fn) ->
      window.setTimeout(fn, 0)

The result is that if you write:

    defer -> console.log('Hello')
    console.log('Asynchronicity')

The console will show:

    Asynchronicity
    Hello
    
The computer has no idea whether the result should be "Asynchronicity Hello" or "Hello Asynchronicity" or sometimes one and sometimes the other. But if we intend that the result be "Asynchronicity Hello," we say that the function `-> console.log('Hello')` *depends upon* the code `console.log('Asynchronicity')`.
    
This might be what you want. If it isn't, you need to have a way to force the order of evaluation when there is supposed to be a dependency between different evaluations. There are a number of different models and abstractions for controlling these dependencies.

We will examine two of them ([callbacks](#callbacks-3) and [promises](#promises-3)) briefly. Not for the purpose of learning the subtleties of using either model, but rather to obtain an understanding of how functions can be used to implement an abstraction over an underlying model.

### callbacks {#callbacks-3}

The underlying premise of the callback model is that every function that invoked code asynchronously is responsible for invoking code that depends on it. The simplest protocol for this is also the most popular: Functions that invoke asynchronous code take an extra parameter called a *callback*. That parameter is a function to be invoked when they have completed.

So our `defer` function looks like this if we want to use callbacks:

    defer (fn, callback) ->
      window.setTimeout (-> callback fn), 0
      
Instead of handing `fn` directly to `window.setTimeout`, we're handing it a function that invokes `fn` and pipelines the result (if any) to `callback`. Now we can ensure that the output is in the correct order:

    defer (-> console.log 'hello'), (-> console.log 'Asynchronicity')

    #=> Hello
    #   Asynchronicity

Likewise, let's say we have a `displayPhoto` function that is synchronous, and not callback-aware:

    displayPhoto = (photoData) ->
      # ... synchronous function ...
      
It can also be converted to take a callback:
      
    displayPhotoWithCallback = (photoData, callback) ->
      callback(displayPhoto(photoData))

There's a combinator we can extract:

    callbackize = (fn) ->
      (arg, callback) ->
        callback(fn(arg))
        
You recall that with ordinary functions, you could chain them with function application. With callbacks, you can also chain them manually. Here's an example inspired by [a blog post][elm], fetching photos from a remote photo sharing site using their asynchronous API:

[elm]: http://elm-lang.org/learn/Escape-from-Callback-Hell.elm

    tag = 'ristretto'

    fotositeGetPhotosByTag tag, (photoList) ->
      fotositeGetOneFromList photos, (photoId) ->
        fotositeGetPhoto photoId, displayPhoto
        
We can also create a callback-aware function that represents the composition of functions:

    displayPhotoForTag = (tag, callback) ->
      fotositeGetPhotosByTag tag, (photoList) ->
        fotositeGetOneFromList photos, (photoId) ->
          fotositeGetPhoto photoId, displayPhoto
    
    
This code is *considerably* less messy in CoffeeScript than other languages that require a lot of additional syntax for functions. As a bonus, although it has some extra scaffolding and indentation, it's already in sequence order from top to bottom and doesn't require re-ordering like normal function application did. That being said, you can avoid the indentation and extra syntax by writing a `sequenceWithCallbacks` function:

    I = (x) -> x

    sequenceWithCallbacks = ->
      do (fns = arguments, 
          lastIndex = arguments.length - 1, 
          helper = undefined) ->
        helper = (arg, index, callback = I) ->
          if index > lastIndex
            callback arg
          else
            fns[index] arg, (result) ->
              helper result, index + 1, callback
       (arg, callback) ->
         helper arg, 0, callback
         
     displayPhotoForTag = sequenceWithCallbacks(
       fotositeGetPhotosByTag,
       fotositeGetOneFromList,
       fotositeGetPhoto,
       displayPhotoWithCallback       
     )
         
`sequenceWithCallbacks` is more complex than `sequence`, but it does help us make callback-aware code "linear" instead of nested/indented.

As we have seen, we can compose linear execution of asynchronous functions, using either the explicit invocation of callbacks or using `sequenceWithCallbacks` to express the execution as a list.

### solving this problem with promises {#promises-3}

Asynchronous control flow can also be expressed using objects and methods. One model is called [promises]. A *promise* is an object that acts as a state machine.[^fsm] Its permissible states are:

* unfulfilled
* fulfilled
* failed

The only permissible transitions are from *unfulfilled* to *fulfilled* and from *unfulfilled* to *failed*. Once in either the fulfilled or failed states, it remains there permanently.

[promises]: http://wiki.commonjs.org/wiki/Promises/A
[^fsm]: A [state machine](https://en.wikipedia.org/wiki/Finite-state_machine) is a mathematical model of computation used to design both computer programs and sequential logic circuits. It is conceived as an abstract machine that can be in one of a finite number of states. The machine is in only one state at a time; the state it is in at any given time is called the current state. It can change from one state to another when initiated by a triggering event or condition, this is called a transition. A particular FSM is defined by a list of its states, and the triggering condition for each transition.

Each promise must at a bare minimum implement a single method, `.then(fulfilledCallback, failedCallback)`.[^interactive] `fulfilledCallback` is a function to be invoked by a fulfilled promise, `failedCallback` by a failed promise. If the promise is already in either state, that function is invoked immediately.

`.then` returns another promise that is fulfilled when the appropriate callback is fulfilled or fails when the appropriate callback fails. This allows chaining of `.then` calls.

[^interactive]: Interactive promises also support `.get` and `.call` methods for interacting with a potentially remote object.

If the promise is unfulfilled, the function(s) provided by the `.then` call are queued up to be invoked if and when the promise transitions to the appropriate state. In addition to this being an object-based protocol, the promise model also differs from the callback model in that `.then` can be invoked on a promise at any time, whereas callbacks must be specified in advance.

Here's how our fotosite API would be used if it implemented promises instead of callbacks (we'll ignore handling failures):

    fotositeGetPhotosByTag(tag)
      .then fotositeGetOneFromList
      .then fotositeGetPhoto
      .then displayPhoto
      
Crisp and clean, no caffeine. The promises model provides linear code "out of the box," and it "scales up" to serve as a complete platform for managing asynchronous code and remote invocation. Be sure to look at libraries supporting promises like [q], and [when].

[when]: https://github.com/cujojs/when
[q]: https://github.com/kriskowal/q