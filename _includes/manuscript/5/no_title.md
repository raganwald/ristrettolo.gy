
## This Section Needs No Title 

CoffeeScript is fundamentally an object-oriented language in the sense that Alan Kay first described object orientation. His vision was of software constructed from entities that communicate with message passing, with the system being extremely dynamic (what he described as "extreme late-binding"). However, words and phrases are only useful when both writer and reader share a common understanding, and for many people the words "object-oriented" carry with them a great deal of baggage related to constructing ontologies of domain entities.

The word "Inheritance" also means many different things to many different people. Some people take it extremely seriously, tugging thoughtfully on their long white beards as they ponder things like Strict Liskov Equivalence. We will avoid this term as well.

What we *will* discuss is extension. In [the next section](#classextension), we're going to show how functions that create instances can extend each other through their prototypes. Since we just finished looking at the class statement, we'll start by chaining two classes together, and then generalize extension so that you can use it with any two functions that create instances.

We'll finish by looking at the excellent support CoffeeScript provides so that you can accomplish all of this with a single keyword.