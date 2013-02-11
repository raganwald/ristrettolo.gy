
## Canonicalization

Early in this book, we discussed how objects, arrays, and functions are *reference types*. When we create a new object, even if it has the same contents as some other object, it is a different value, as we can tell when we test its identity with `is`:

    { foo: 'bar' } is { foo: 'bar' }
      #=> false

Sometimes, this is not what you want. A non-trivial example is the [HashLife] algorithm for computing the future of Conway's Game of Life. HashLife aggressively caches both patterns on the board and their futures, so that instead of iteratively simulating the cellular automaton a generation at a time, it executes in logarithmic time.

[HashLife]: https://en.wikipedia.org/wiki/Hashlife

In order to take advantage of cached results, HashLife must *canonicalize* square patterns. Meaning, it must guarantee that if two square patterns have the same contents, they must be the same object and share the same identity. This ensures that updates are shared everywhere.

One way to make this work is to eschew having all the code create new objects with a constructor. Instead, the construction of new objects is delegated to a cache. When a function needs a new object, it asks the cache for it. If a matching object already exists, it is returned. If not, a new one is created and placed in the cache.

This is the algorithm used by [recursiveuniver.se], an experimental implementation of HashLife in CoffeeScript. The fully annotated source code for canonicalization is [online], and it contains this method for the `Square.cache` object:

[recursiveuniver.se]: http://recursiveuniver.se
[online]: http://recursiveuniver.se/docs/canonicalization.html

    for: (quadrants, creator) ->
      found = Square.cache.find(quadrants)
      if found
        found
      else
        {nw, ne, se, sw} = quadrants
        Square.cache.add _for(quadrants, creator)
        
Instead of enjoying a stimulating digression explaining how that works, let's make our own. We're going to build a class for cards in a traditional deck. Without canonicalization, it looks like this:

    class Card
      ranks = [2..10].concat ['J', 'Q', 'K', 'A']
      suits = ['C', 'D', 'H', 'S']
      constructor: ({@rank, @suit}) ->
        throw "#{@rank} is a bad rank" unless @rank in ranks
        throw "#{@suit} is a bad suit" unless @suit in suits
      toString: ->
        '' + @rank + @suit
        
The instances are not canonicalized:
        
     new Card({rank: 4, suit: 'S'}) is new Card({rank: 4, suit: 'S'})
       #=> false
       
T> If a constructor function explicitly returns a value, that's what is returned. Otherwise, the newly constructed object is returned. Unlike other functions and methods, the last evaluated value is not returned by default.

We can take advantage of that to canonicalize cards:

    class Card
      ranks = [2..10].concat ['J', 'Q', 'K', 'A']
      suits = ['C', 'D', 'H', 'S']
      cache = {}
      constructor: ({@rank, @suit}) ->
        throw "#{@rank} is a bad rank" unless @rank in ranks
        throw "#{@suit} is a bad suit" unless @suit in suits
        return cache[@toString()] or= this
      toString: ->
        '' + @rank + @suit
        
Now the instances are canonicalized:
        
     new Card({rank: 4, suit: 'S'}) is new Card({rank: 4, suit: 'S'})
       #=> true
       
Wonderful!

### caveats

Using techniques like this to canonicalize instances of a class has many drawbacks and takes careful consideration before use. First, while this code illustrates the possibilities inherent in having a constructor return a different object, it is wasteful in that it creates an object only to throw it away if it is already in the cache.

If there are a tractable number of possible instances of a class (such as cards in a deck), it may be more practical to enumerate them all in advance rather than lazily create them, and/or to use a factory method to retried them rather than changing the behaviour of the constructor.

More serious is that the engine that executes CoffeeScript programs does not support weak references.[^wr] As a result, if you wish to perform cache eviction for memory management purposes, you will have to implement your own reference management scheme. This may be non-trivial.

If you have many, many possible instances, your cache can end up holding onto what some programmers call *zombie objects*: Objects that are not in use anywhere in your program except the cache. If they are never accessed again, the memory they take up will never be released for reuse. An early version of the HashLife implementation did not clear objects from the cache. Some computations would consume as much as 700MB of data for the cache before the virtual machine was unable to continue. Most of that memory was consumed by zombie objects.

All that being said, canonicalization is sometimes the appropriate path forward, and even if it isn't, it serves to illustrate the possibilities latent in writing constructors that return objects explicitly.

[^wr]: A [weak reference](https://en.wikipedia.org/wiki/Weak_reference) is a reference that does not protect the referenced object from collection by a garbage collector; unlike a strong reference. An object referenced only by weak references is considered unreachable (or weakly reachable) and so may be collected at any time.