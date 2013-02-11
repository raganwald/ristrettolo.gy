### not entirely logical

A small digression:

Having seen keywords like `is`, and `isnt`, you won't be surprised to learn that `and` and `or` are operators in CoffeeScript. They seem to work in a straightforward fashion with `true` and `false`. One way in which they differ from strictly logical operators is that they work with "truthiness," not booleans, and they have "short-cut" semantics.[^kramer]

    true or "CoffeeScript"
      #=> true
    "CoffeeScript" or true
      #=> "CoffeeScript"
    true and "CoffeeScript"
      #=> "CoffeeScript"
    "CoffeeScript" and true
      #=> true
      
Both `or` and `and` evaluate the expression on the left-hand side first. The logic is:

### `or`

If the value on the left-hand side of the expression is truthy, `or` returns that without evaluating the expression on the right-hand side. If the value on the left-hand side is falsy, `or` evaluates the expression on the right-hand side and returns that no matter what it is. 

### `and`

If the value on the left-hand side of the expression is falsy, `and` returns that without evaluating the expression on the right-hand side. If the value on the left-hand side is truthy, `and` evaluates the expression on the right-hand side and returns that no matter what it is. 

[^kramer]: There is no truth to the rumour that this is called "Kramer Logic" after the scene in Seinfeld where Cosmo Kramer is offered free coffee for life and accepts it before he can hear that the company also wanted to pay him a substantial sum in cash.