fibonacci = (n) ->
  if n < 2
    n
  else
    fibonacci(n-2) + fibonacci(n-1)

quickFibonacci = memoize(fibonacci)