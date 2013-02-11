TODO: Fluent Interfaces

Here's a pattern you seen in programming languages with weak support for closures:

    class WidgetContainer

      def getWidgetCount
        @widgetCount ||= begin
          # ...
          # Count those widgets!
          # ...
        end
      end
    
      def getWidgetNames
        @widgetNames ||= self.widgets().map(&:name).uniq
      end
    
      # ...
    
    end

The idea is that you need only count the widgets once, and you need only get the unique names of the widgets once. When you do, you store them in some instance variables and thereafter you access them without recalculating again.

This is [memoization](#memoize) all over again. It tangles the code for memoization with the code for the underlying domain logic. It also breaks encapsulation. `@widgetCount` is really private to the `getWidgetCount` method, but most languages don't let you decide how to factor privacy and encapsulation: They've decided in advance whether you get private, protected, public, package, or what-have-you access controls.

If you don't like it, you switch to a language like CoffeeScript that while seemingly lacking these features, actually provides powerful features that can be used to build what you need. For example, CoffeeScript doesn't really have a concept of a "method." It has functions, and we happen to call a-function-that-belongs-to-an-object-created-with-the-new-keyword a "method" for our own convenience.

And since methods are "just" functions, we can use all of our existing functional tools on methods. Like `memoize`:

    class WidgetContainer
      getWidgetCount:
        memoize ->
          # ...
          # Count those widgets!
          # ...
      getWidgetNames:
        memoize ->
          uniq(widget.name for widget in @widgets())
          
CoffeeScript's class statement doesn't require method bodies the way `def` does in other languages, or special conversion routines to turn lambdas into methods. It takes expressions that evaluate to functions, and `memoize -> ...` is one such expression.

When we use a combinator inline on a function as part of a class statement, we call it a *method decorator*, a term borrowed from the Python programming language.