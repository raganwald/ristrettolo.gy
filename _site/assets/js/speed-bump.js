(function() {

  $(function() {
    var OSX, book, isObscuredInViewport, scrollHandler, secondHalf;
    book = $('.book');
    (secondHalf = book.children().slice(book.children().size() / -2)).addClass('obscured-by-clouds');
    isObscuredInViewport = (function() {
      var buckWindow, first;
      first = secondHalf.first();
      buckWindow = $(window);
      return function() {
        var docViewBottom, elemTop;
        docViewBottom = buckWindow.scrollTop() + buckWindow.height();
        elemTop = $(first).offset().top;
        return elemTop < docViewBottom;
      };
    })();
    scrollHandler = (function() {
      var shown;
      shown = false;
      return function() {
        if (!shown) {
          if (isObscuredInViewport()) {
            shown = true;
            return OSX.display();
          }
        }
      };
    })();
    $(this).scroll(_.throttle(scrollHandler, 100));
    OSX = {
      container: null,
      display: function() {
        return $("#osx-modal-content").modal({
          overlayId: "osx-overlay",
          containerId: "osx-container",
          closeHTML: null,
          minHeight: 80,
          opacity: 65,
          position: ["0"],
          overlayClose: true,
          onOpen: OSX.open,
          onClose: OSX.close
        });
      },
      open: function(d) {
        var self;
        self = this;
        self.container = d.container[0];
        return d.overlay.fadeIn("slow", function() {
          var title;
          $("#osx-modal-content", self.container).show();
          title = $("#osx-modal-title", self.container);
          title.show();
          return d.container.slideDown("slow", function() {
            return setTimeout((function() {
              var h;
              h = $("#osx-modal-data", self.container).height() + title.height() + 20;
              return d.container.animate({
                height: h
              }, 200, function() {
                $("div.close", self.container).show();
                return $("#osx-modal-data", self.container).show();
              });
            }), 300);
          });
        });
      },
      close: function(d) {
        var self;
        self = this;
        d.container.animate({
          top: "-" + (d.container.height() + 20)
        }, 500, function() {
          return self.close();
        });
        return $('.obscured-by-clouds').removeClass('obscured-by-clouds');
      }
    };
    $('.buy-now').click(function() {
      return $('iframe#coffeescript-ristretto form').submit();
    });
    return typeof console !== "undefined" && console !== null ? console.log('done!') : void 0;
  });

}).call(this);
