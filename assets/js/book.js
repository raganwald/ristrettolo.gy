(function() {
  var DIV, LEVELS;

  LEVELS = ['book', 'chapter', 'section', 'sub-section', 'sub-sub-section'];

  DIV = function(level) {
    return $('<div></div>').data({
      level: level
    }).addClass(LEVELS[level]);
  };

  $(function() {
    var book, container, firstChild, _results;
    container = $('.container');
    book = DIV(0);
    _.each(container.children(), function(node) {
      var lastChild, level, matchData, nodeName, receiver;
      nodeName = node.nodeName;
      if (_.isNull(matchData = nodeName.match(/H(\d)/))) {
        level = 99;
      } else {
        level = matchData[1];
        node = DIV(level).append(node).attr({
          id: $(node).attr('id')
        });
      }
      receiver = book;
      while ((lastChild = receiver.children('div').filter(function() {
          return $(this).data('level') && $(this).data('level') < level;
        }).last()).exists()) {
        receiver = $(lastChild);
      }
      return receiver.append(node);
    });
    container.append(book);
    _results = [];
    while ((firstChild = $(book.children(':first')[0])).attr('id') !== 'coffeescript-ristretto') {
      _results.push(book.before(firstChild));
    }
    return _results;
  });

}).call(this);
