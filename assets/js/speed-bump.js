$(function () {
  var nodeList = $('.container').children(),
	    initialNode = $('<div class="book"></div>').data({level: 0}),
	    finalStack = _.reduce(nodeList, function (acc, node) {
				var nodeName = node.nodeName,
				    top = acc[acc.length-1],
				    topLevel = top.data('level'),
				    matchData = nodeName.match(/H(\d)/),
				    level = (matchData ? matchData[1] : void 0),
				    newContainer,
				    oldTop;
		
				node = $(node);
		
				if (level === void 0) {
					top.append(node)
				}
				else {
					newContainer = $('<div></div>')
					               .attr({ id: node.attr('id') })
					               .data({ level: level })
					               .append(node);
					node.attr({ id: null });
			
					while (level <= topLevel) {
						oldTop = acc.pop();
				    top = acc[acc.length-1].append(oldTop);
				    topLevel = top.data('level');
					}
					acc.push(newContainer);
				}
				return acc;
			}, [initialNode]),
			topLevel = finalStack[finalStack.length-1].data('level'),
			oldTop,
			top;
	
	while (topLevel > 0) {
		oldTop = finalStack.pop();
    top = finalStack[finalStack.length-1].append(oldTop);
    topLevel = top.data('level');
	}

	$('.container')
	.empty()
	.append(finalStack[0]);
  
});