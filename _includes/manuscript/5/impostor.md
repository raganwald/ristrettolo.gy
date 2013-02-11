### impostors

You may have noticed that we use "weasel words" to describe how everything in CoffeeScript *behaves like* an instance. Everything *behaves as if* it was created by a function with a prototype.

The full explanation is this: As you know, CoffeeScript has "value types" like `String`, `Number`, and `Boolean`. As noted in the first chapter, value types are also called *primitives*, and one consequence of the way CoffeeScript implements primitives is that they aren't objects. Which means they can be identical to other values of the same type with the same contents, but the consequence of certain design decisions is that value types don't actually have methods or constructors. They aren't instances of some constructor.

So. Value types don't have methods or constructors. And yet:

    "Spence Olham".split(' ')
      #=> ["Spence", "Olham"]

Somehow, when we write `"Spence Olham".split(' ')`, the string `"Spence Olham"` isn't an instance, it doesn't have methods, but it does a damn fine job of impersonating an instance of a `String` constructor. How does `"Spence Olham"` impersonate an instance?

CoffeeScript pulls some legerdemain. When you do something that treats a value like an object, CoffeeScript checks to see whether the value actually is an object. If the value is actually a primitive,[^reminder] CoffeeScript temporarily makes an object that is a kinda-sorta copy of the primitive and that kinda-sorta copy has methods and you are temporarily fooled into thinking that `"Spence Olham"` has a `.split` method.

[^reminder]: Recall that Strings, Numbers, Booleans and so forth are value types and primitives. We're calling them primitives here.

These kinda-sorta copies are called String *instances* as opposed to String *primitives*. And the instances have methods, while the primitives do not. How does CoffeeScript make an instance out of a primitive? With `new`, of course. Let's try it:

    new String("Spence Olham")
      #=> "Spence Olham"
      
The string instance looks just like our string primitive. But does it behave like a  string primitive? Not entirely:

    new String("Spence Olham") is "Spence Olham"
      #=> false
      
Aha! It's an object with its own identity, unlike string primitives that behave as if they have a canonical representation. If we didn't care about their identity, that wouldn't be a problem. But if we carelessly used a string instance where we thought we had a string primitive, we could run into a subtle bug:

    if userName is "Spence Olham"
      getMarried()
      goCamping()
      
That code is not going to work as we expect should we accidentally bind `new String("Spence Olham")` to `userName` instead of the primitive `"Spence Olham"`.

This basic issue that instances have unique identities but primitives withthe same contents have the same identities--is true of all primitive types, including numbers and booleans: If you create an instance of anything with `new`, it gets its own identity.

There are more pitfalls to beware. Consider the truthiness of string, number and boolean primitives:

    if '' then 'truthy' else 'falsy'
      #=> 'falsy'
    if 0 then 'truthy' else 'falsy'
      #=> 'falsy'
    if false then 'truthy' else 'falsy'
      #=> 'falsy'
      
Compare this to their corresponding instances:

    if new String('') then 'truthy' else 'falsy'
      #=> 'truthy'
    if new Number(0) then 'truthy' else 'falsy'
      #=> 'truthy'
    if new Boolean(false) then 'truthy' else 'falsy'
      #=> 'truthy'
      
Our notion of "truthiness" and "falsiness" is that all instances are truthy, even string, number, and boolean instances corresponding to primitives that are falsy.

There is one sure cure for "CoffeeScript Impostor Syndrome." Just as `new PrimitiveType(...)` creates an instance that is an impostor of a primitive, `PrimitiveType(...)` creates an original, canonicalized primitive from a primitive or an instance of a primitive object.

For example:

    String(new String("Spence Olham")) is "Spence Olham"
      #=> true
      
Getting clever, we can write this:

    original = (unknown) ->
        unknown.constructor(unknown)
        
    original(true) is true
      #=> true
    original(new Boolean(true) is true
      #=> true
      
Of course, `original` will not work for your own creations unless you take great care to emulate the same behaviour. But it does work for strings, numbers, and booleans.