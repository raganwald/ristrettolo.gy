# References, Identity, Arrays, and Objects {#poco}

### a simple question

Consider this code:

    do (x = 'June 14, 1962') ->
      do (y = x) ->
        x is y
      #=> true

This makes obvious sense, because we know that strings are a value type, so no matter what expression you use to derive the value 'June 14, 1962', you are going to get a string with the exact same identity.

But what about this code?

    do (x = [2012, 6, 14]) ->
        do (y = x) ->
          x is y
        #=> true

Also true, even though we know that every time we evaluate an expression such as `[2012, 6, 14]`, we get a new array with a new identity. So what is happening in our environments?

### arguments and references

In our discussion of [closures](#closures), we said that environments bind values (like `[2012, 6, 14]`) to names (like `x` and `y`), and that when we use these names as expressions, the name evaluates as the value.

What this means is that when we write something like `do (y = x) ->`, the name `x` is looked up in the current environment, and its value is a specific array that was created when the expression `[2012, 6, 14]` was first evaluated. We then bind *that exact same value* to the name `y` in a new environment, and thus `x` and `y` are both bound to the exact same value, which is identical to itself.

The same thing happens with binding a variable through a more conventional means of applying a function to arguments:

    do (x = [2012, 6, 14]) ->
      ((y) ->
        x is y)(x)
        #=> true

`x` and `y` both end up bound to the exact same array, not two different arrays that look the same to our eyes.

{pagebreak}

## arguments and arrays

CoffeeScript provides two different kinds of containers for values. We've met one already, the array. Let's see how it treats values and identities. For starters, we'll learn how to extract a value from an array. We'll start with a function that makes a new value with a unique identity every time we call it. We already know that every function we create is unique, so that's what we'll use:

    do (unique = (-> ->)) ->
    
      unique()
        # => [Function]
      unique() is unique()
        # false

Let's verify that what we said about references applies to functions as well as arrays:

      do (x = unique()) ->
        do (y = x) ->
          x is y
        #=> true

Ok. So what about things *inside* arrays? We know how to create an array with something inside it:

      [ unique() ]
        #=> [ [Function] ]

That's an array with one of our unique functions in it. How do we get something *out* of it?

      do (a = [ 'hello' ]) ->
        a[0]
        #=> 'hello'

Cool, arrays work a lot like arrays in other languages and are zero-based. The trouble with this example is that strings are value types in CoffeeScript, so we have no idea whether `a[0]` always gives us the same value back like looking up a name in an environment, or whether it does some magic that tries to give us a new value.

We need to put a reference type into an array. If we get the same thing back, we know that the array stores a reference to whatever you put into it. If you get something different back, you know that arrays store copies of things.[^hunh]

[^hunh]: Arrays in all contemporary languages store references and not copies, so we can be forgiven for expecting them to work the same way in CoffeeScript. Nevertheless, it's a useful exercise to test things for ourself.

Let's test it:

    do (unique = (-> ->)) ->
      do (x = unique()) ->
        do (a = [ x ]) ->
          a[0] is x
      #=> true

If we get a value out of an array using the `[]` suffix, it's the exact same value with the same identity. Question: Does that apply to other locations in the array? Yes:

    do (unique = (-> ->)) ->
      do (x = unique(), y = unique(), z = unique()) ->
        do (a = [ x, y, z ]) ->
          a[0] is x and a[1] is y and a[2] is z
      #=> true

{pagebreak}

## references and objects

CoffeeScript also provides objects. The word "object" is loaded in programming circles, due to the widespread use of the term "object-oriented programming" that was coined by Alan Kay but has since come to mean many, many things to many different people.

In CoffeeScript, Objects[^poco] are values that can store other values by name (including functions). The most common syntax for creating an object is simple:

    { year: 2012, month: 6, day: 14 }
    
Two objects created this way have differing identities, just like arrays:

    { year: 2012, month: 6, day: 14 } is { year: 2012, month: 6, day: 14 }
      #=> false
      
Objects use `[]` to access the values by name, using a string:

    { year: 2012, month: 6, day: 14 }['day']
      #=> 14

Values contained within an object work just like values contained within an array:

    do (unique = (-> ->)) ->
      do (x = unique(), y = unique(), z = unique()) ->
        do (o = { a: x, b: y, c: z }) ->
          o['a'] is x and o['b'] is y and o['c'] is z
      #=> true
      
Names needn't be alphanumeric strings. For anything else, enclose the label in quotes:

    { 'first name': 'reginald', 'last name': 'lewis' }['first name']
      #=> 'reginald'
      
If the name is an alphanumeric string conforming to the same rules as names of variables, there's a simplified syntax for accessing the values:

    { year: 2012, month: 6, day: 14 }['day'] is
        { year: 2012, month: 6, day: 14 }.day
      #=> true
      
All containers can contain any value, including functions or other containers:

    do ( Mathematics = { abs: (a) -> if a < 0 then -a else a }) ->
      Mathematics.abs(-5)
      #=> 5
      
Funny we should mention `Mathematics`. If you recall, CoffeeScript provides a global environment that contains some existing object that have handy functions you can use. One of them is called `Math`, and it contains functions for `abs`, `max`, `min`, and many others. Since it is always available, you can use it in any environment provided you don't shadow `Math`.

    Math.abs(-5)
      #=> 5
      
[^poco]: Tradition would have us call objects that don't contain any functions "POCOs," meaning Plain Old CoffeeScript Objects. Given that *poco a poco* means "little by little" in musical notation, I'm tempted to go along with that.