## How to run the examples {#online}

If you follow the instructions at [coffeescript.org][install] to install NodeJS and CoffeeScript,[^whoa] you can run an interactive CoffeeScript [REPL][repl] on your command line simply by typing `coffee`. This is how the examples in this book were tested, and what many programmers will do. When running CoffeeScript on the command line, ctrl-V switches between single-line and multi-line input mode. If you need to enter more than one line of code, be sure to enter multi-line mode.

Some websites function as online [REPLs][repl], allowing you to type CoffeeScript programs right within a web page and see the results (as well as a translation from CoffeeScript to JavaScript). The examples in this book have all been tested on [coffeescript.org]. You simply type a CoffeeScript expression into the blank window and you will see its JavaScript translation live. Clicking "Run" evaluates the expression in the browser.

[repl]: https://en.wikipedia.org/wiki/REPL "Read–eval–print loop"

To actually see the result of your expressions, you'll need to either include a call to `console.log` (and be using a browser that supports console logging) or you could go old-school and use `alert`, e.g. `alert 2+2` will cause the alert box to be displayed with the message `4`.

[install]: http://coffeescript.org/#installation "Install CoffeeScript"
[coffeescript.org]: http://coffeescript.org/#try:

[^whoa]: Instructions for installing NodeJS and modules like CoffeeScript onto a desktop computer is beyond the scope of this book, especially given the speed with which things advance. Fortunately, there are always up-to-date instructions on the web.