---
---
LEVELS = ['book', 'chapter', 'section', 'sub-section', 'sub-sub-section']

DIV = (level) ->
  return $('<div></div>')
    .data
      level: level
    .addClass LEVELS[level]
    
$ ->
  # the container div that holds everything
  container = $('.container')
  
  # set up a hierarchal book div, initially with everything
  book = DIV(0)
  _.each container.children(), (node) ->
    nodeName = node.nodeName
    if _.isNull(matchData = nodeName.match(/H(\d)/))
      level = 99
    else
      level = matchData[1]
      node = DIV(level)
        .append(node)
        .attr
          id: $(node).attr('id')
    receiver = book
    while(
      (lastChild = receiver
        .children('div')
        .filter(-> $(this).data('level') and $(this).data('level') < level)
          .last())
      .exists()
    )
      receiver = $(lastChild)
    receiver.append(node)
    
  # put the book in the container
  container.append(book)
  
  # extract everything up to the initial "coffeescript-ristretto" element
  # and put it before hte "book" element
  while (
    (firstChild = $(book.children(':first')[0])).attr('id') isnt 'coffeescript-ristretto'
  )
    book.before(firstChild)