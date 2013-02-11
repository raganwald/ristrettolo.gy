## Summary

T> ### Instances and Classes
T>
T> * The `new` keyword turns any function into a *constructor* for creating *instances*.
T> * All functions have a `prototype` element.
T> * Instances behave as if the elements of their constructor's prototype are their elements.
T> * Instances can override their constructor's prototype without altering it.
T> * The relationship between instances and their constructor's prototype is dynamic.
T> * `this` works seamlessly with methods defined in prototypes.
T> * Everything behaves like an object.
T> * CoffeeScript can convert primitives into instances and back into primitives.
T> * The `class` keyword and `constructor` method are syntactic sugar for creating functions and populating prototypes.
T> * `@` is a convenient shorthand for `this.`.
T> * Object methods are typically created in the constructor and are private to each object.
T> * Canoncialization is tricky but possible in CoffeeScript.
T> * Prototypes can be chained to allow extension of instances.
T> * CoffeeScript's `extends` keyword is syntactic sugar for extending prototypes.
T> * `extends` plays well with `class`.