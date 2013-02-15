
# Obscure the second half of `elements`, e.g. obscure $('.book h2') or obscure $('div#leanpub-main p')
window.obscure = (elements, {clazz, speedBump}) ->
  
  clazz = 'obscured-by-clouds' if _.isUndefined(clazz)
  speedBump = true if _.isUndefined(speedBump)
  
  console?.log "#{elements.size()} elements"
  
  # pick out the second half of the elements and obscure them
  secondHalf = elements.slice(elements.size() / -2)
  secondHalf.addClass(clazz) if (clazz and clazz isnt '')

  if speedBump
    
    # test if the user can see obscured text 
    isObscuredInViewport = do ->
      first = secondHalf.first()
      buckWindow = $(window)
      ->
        docViewBottom = buckWindow.scrollTop() + buckWindow.height()
        elemTop = $(first).offset().top
        elemTop < docViewBottom
    
    
    # test and display dialog
    scrollHandler = do ->
      shown = false
      ->
        unless shown
          if isObscuredInViewport()
            shown = true
            OSX.display()
  
    # listen for scrolling
    $(this).scroll _.throttle(scrollHandler, 100)
      
    # the modal dialog in OS X style    
    OSX =
    
      container: null
    
      display: ->
        $("#osx-modal-content").modal
          overlayId: "osx-overlay"
          containerId: "osx-container"
          closeHTML: null
          minHeight: 80
          opacity: 65
          position: ["0"]
          overlayClose: true
          onOpen: OSX.open
          onClose: OSX.close

      open: (d) ->
        self = this
        self.container = d.container[0]
        d.overlay.fadeIn "slow", ->
          $("#osx-modal-content", self.container).show()
          title = $("#osx-modal-title", self.container)
          title.show()
          d.container.slideDown "slow", ->
            setTimeout (->
              h = $("#osx-modal-data", self.container).height() + title.height() + 20 # padding
              d.container.animate
                height: h
              , 200, ->
                $("div.close", self.container).show()
                $("#osx-modal-data", self.container).show()

            ), 300

      close: (d) ->
        self = this # this = SimpleModal object
        d.container.animate
          top: "-" + (d.container.height() + 20)
        , 500, ->
          self.close() # or $.modal.close();
        $(".#{clazz}").removeClass(clazz) if (clazz and clazz isnt '')
        
  # wire up buy now links
  $('.buy-now').click ->
    $('iframe#coffeescript-ristretto form').submit()
    
  # debug
  console?.log 'done! done!'