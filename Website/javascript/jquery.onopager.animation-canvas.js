/**
 * @fileOverview Extra animation objects pack. They all make use of canvas.
 */



/*
IDEAS
- Arc animation
*/




/**
 * @namespace Animation object. Incoming and outgoing slides will always appear
 *    next to each other. Even if they are not next to each other in the list,
 *    like the first and last item in the list.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.color Fill color. Default is '#EB7D2C'.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_square1 = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.canvas2d_square1
   */
  var square1Instance = new onoPager.animation._standard(newConfig,
                                                         extraConfig);
  if (!square1Instance._config.extraConfig.color) {
    square1Instance._config.extraConfig.color = '#EB7D2C';
  }
  var tools = onoPager.tools;
  var drawInterval = null;
  var theCanvas;
  var interval = 10;
  var frames = square1Instance._config.animationSpeed / interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.canvas2d_square1
   * @this
   */
  square1Instance.init = function() {
    this._config.listItems.css(
      {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      }
    );
    jQuery(this._config.listItems[this._config.activeIndex]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.canvas2d_square1
   * @this
   */
  square1Instance.page = function(oldIndex, newIndex, direction) {
    var counter = 0;
    var context;
    var canvasWidth;
    var canvasHeight;

    this._config.listItems.hide();
    jQuery(this._config.listItems[oldIndex]).show();

    init();

    function init() {
      if (typeof(theCanvas) == 'undefined') {
        square1Instance._config.listContainer.append(
          onoPager.tools.createCanvas(square1Instance._config.listContainer
                                                             .outerWidth(),
                                      square1Instance._config.listContainer
                                                             .outerHeight()
          )
        );
      }
      theCanvas = square1Instance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext('2d');
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      if (drawInterval != null) {
        resetStage();
      }
      drawInterval = setInterval(draw, interval);
    }

    function resetStage() {
      clearInterval(drawInterval);
      counter = (frames - 1);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function draw() {
      if (counter <= frames) {
        context.fillStyle = square1Instance._config.extraConfig.color;
        var width = parseInt((canvasWidth / frames) * counter);
        var height = parseInt((canvasHeight / frames) * counter);
        context.fillRect(
          parseInt(canvasWidth / 2) - parseInt(width / 2),
          parseInt(canvasHeight / 2) - parseInt(height / 2),
          width,
          height
        );
        counter++;
      } else {
        clearInterval(drawInterval);
        counter = 0;
        jQuery(square1Instance._config.listItems[oldIndex]).hide();
        jQuery(square1Instance._config.listItems[newIndex]).show();
        drawInterval = setInterval(clearDraw, interval);
      }
    }

    function clearDraw() {
      if (counter <= frames) {
        var width = parseInt((canvasWidth / frames) * counter);
        var height = parseInt((canvasHeight / frames) * counter);
        context.clearRect(
          parseInt(canvasWidth / 2) - parseInt(width / 2),
          parseInt(canvasHeight / 2) - parseInt(height / 2),
          width,
          height
        );
        counter++;
      } else {
        clearInterval(drawInterval);
        drawInterval = null;
      }
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.canvas2d_square1
   * @this
   */
  square1Instance.pagerHover = function(move) {
    // Not implemented
  }

  return square1Instance;
};






/**
 * @namespace Animation object. A solid color, swiping clockwise, will obscure
 *    the viewport. After it recedes, the new slide appears.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.color Fill color. Default is '#EB7D2C'.
 * @param {Number} extraConfig.interval The time in milliseconds between screen
 *    drawings.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_clock = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.canvas2d_clock
   */
  var clockInstance = new onoPager.animation._standard(newConfig, extraConfig);
  clockInstance._config.extraConfig = jQuery.extend(
    {
      color:'#EB7D2C',
      interval: 10
    },
    clockInstance._config.extraConfig
  );
  var tools = onoPager.tools;
  var drawClockInterval = null;
  var theCanvas;
  var interval = clockInstance._config.extraConfig.interval;
  var frames = (clockInstance._config.animationSpeed / 2) / interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.canvas2d_clock
   * @this
   */
  clockInstance.init = function() {
    this._config.listItems.css(
      {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      }
    );
    jQuery(this._config.listItems[this._config.activeIndex]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.canvas2d_clock
   * @this
   */
  clockInstance.page = function(oldIndex, newIndex, direction) {
    var counter = 0;
    var context;
    var canvasWidth;
    var canvasHeight;
    var degrees;

    this._config.listItems.hide();
    jQuery(this._config.listItems[oldIndex]).show();

    init();

    function init() {
      if (typeof(theCanvas) == 'undefined') {
        clockInstance._config.listContainer.append(
          onoPager.tools.createCanvas(clockInstance._config.listContainer
                                                           .outerWidth(),
                                      clockInstance._config.listContainer
                                                           .outerHeight()
          )
        );
      }
      theCanvas = clockInstance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext('2d');
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      if (drawClockInterval != null) {
        resetStage();
      }

      degrees = -90;
      drawClockInterval = setInterval(function() { draw(false) }, interval);
      jQuery(clockInstance._config.listItems.filter(':visible')).hide();
      jQuery(clockInstance._config.listItems[oldIndex]).show();
    }

    function resetStage() {
      clearInterval(drawClockInterval);
      counter = (frames - 1);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function draw(oppositeDirection) {
      degrees += 360 / ((clockInstance._config.animationSpeed / 2) / interval);

      if (degrees >= 269) {
        clearInterval(drawClockInterval);
        if (oppositeDirection == false) {
          degrees = -90;
          drawClockInterval = setInterval(function() { draw(true) }, interval);
          jQuery(clockInstance._config.listItems[oldIndex]).hide();
          jQuery(clockInstance._config.listItems[newIndex]).show();
        } else {
          resetStage();
        }
        return;
      }

      var centerX = Math.floor(canvasWidth / 2);
      var centerY = Math.floor(canvasHeight / 2);
      var radius = Math.floor(canvasWidth);
      var radian = (Math.PI / 180) * degrees;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX,
                  centerY,
                  radius,
                  (Math.PI / 180) * -90,
                  radian,
                  oppositeDirection);
      context.lineTo(centerX, centerY);
      context.closePath();

      context.fillStyle = clockInstance._config.extraConfig.color;
      context.fill();
    }

    function clearDraw() {
      if (counter <= frames) {
        var width = parseInt((canvasWidth / frames) * counter);
        var height = parseInt((canvasHeight / frames) * counter);
        context.clearRect(
          parseInt(canvasWidth / 2) - parseInt(width / 2),
          parseInt(canvasHeight / 2) - parseInt(height / 2),
          width,
          height
        );
        counter++;
      } else {
        clearInterval(drawClockInterval);
        drawClockInterval = null;
      }
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.canvas2d_clock
   * @this
   */
  clockInstance.pagerHover = function(move) {
    // Not implemented
  }

  return clockInstance;
};






/**
 * @namespace Animation object. A solid color, appearing from the borders, will
 *    obscure the viewport. After it recedes, the new slide appears.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.color Fill color. Default is '#EB7D2C'.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_frost = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.canvas2d_frost
   */
  var frostInstance = new onoPager.animation._standard(newConfig, extraConfig);
  frostInstance._config.extraConfig = jQuery.extend(
    {
      color:'235,125,44',
      interval: 10
    },
    frostInstance._config.extraConfig
  );
  var tools = onoPager.tools;
  var drawInterval = null;
  var theCanvas;
  var interval = frostInstance._config.extraConfig.interval;
  var color = frostInstance._config.extraConfig.color;
  var frames = (frostInstance._config.animationSpeed / 2) / interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.canvas2d_frost
   * @this
   */
  frostInstance.init = function() {
    this._config.listItems.css(
      {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      }
    );
    jQuery(this._config.listItems[this._config.activeIndex]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.canvas2d_frost
   * @this
   */
  frostInstance.page = function(oldIndex, newIndex, direction) {
    var counter = 0;
    var context;
    var canvasWidth;
    var canvasHeight;
    var diagonalLength;

    this._config.listItems.hide();
    jQuery(this._config.listItems[oldIndex]).show();

    init();

    function init() {
      if (typeof(theCanvas) == 'undefined') {
        frostInstance._config.listContainer.append(
          onoPager.tools.createCanvas(frostInstance._config.listContainer
                                                           .outerWidth(),
                                      frostInstance._config.listContainer
                                                           .outerHeight()
          )
        );
      }
      theCanvas = frostInstance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext('2d');
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      if (drawInterval != null) {
        resetStage();
      }
      
      drawInterval = setInterval(
        function() {
          draw(false)
        },
        interval
      );
      jQuery(frostInstance._config.listItems.filter(':visible')).hide();
      jQuery(frostInstance._config.listItems[oldIndex]).show();
    }

    function resetStage() {
      clearInterval(drawInterval);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function draw(oppositeDirection) {
      if (counter <= frames && counter >= 0) {
        if (oppositeDirection == true) {
          counter--;
        } else {
          counter++;
        }
        var centerX = Math.floor(canvasWidth / 2);
        var centerY = Math.floor(canvasHeight / 2);
        diagonalLength = Math.sqrt(centerX*centerX + centerY*centerY);
        var percentage = (counter / frames) * 100;
        if (percentage > 100) {
          percentage = 100;
        }
        if (percentage < 0) {
          percentage = 0;
        }
        var stopPosition = 1-(percentage/100);
        if (stopPosition == 0) {
          stopPosition = 0.001;
        }
        
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        var gr = context.createRadialGradient(centerX,centerY,25,centerX,centerY,diagonalLength);
        opacityEased = (((percentage/100) / 100) * percentage);
        gr.addColorStop(0, 'rgba(' + color + ', ' + opacityEased + ')');
        gr.addColorStop(stopPosition, 'rgba(' + color + ', ' + (percentage/100) + ')');
        gr.addColorStop(1, 'rgba(' + color + ', 1)');
  
        context.fillStyle = gr;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      } else {
        clearInterval(drawInterval);
        if (oppositeDirection == false) {
          jQuery(frostInstance._config.listItems[oldIndex]).hide();
          jQuery(frostInstance._config.listItems[newIndex]).show();
          counter = frames;
          drawInterval = setInterval(
            function() {
              draw(true)
            },
            interval
          );
        } else {
          context.clearRect(0, 0, canvasWidth, canvasHeight);
        }
      }
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.canvas2d_frost
   * @this
   */
  frostInstance.pagerHover = function(move) {
    // Not implemented
  }

  return frostInstance;
};






/**
 * @namespace Animation object. 
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.image
 * @param {Object} extraConfig.square
 * @param {Number} extraConfig.square.x
 * @param {Number} extraConfig.square.y
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_imageGrid = function(newConfig, arg_extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.canvas2d_imageGrid
   */
  var imageGridInstance = new onoPager.animation._standard(newConfig, arg_extraConfig);
  var extraConfig = jQuery.extend(
    {
      color:'235,125,44',
      interval: 10,
      freezeUntilImagesPreloaded: false,
      bgColor: '#ffffff'
    },
    imageGridInstance._config.extraConfig
  );
  var timeouts = new Array();
  var config = imageGridInstance._config;
  var tools = onoPager.tools;
  var drawInterval = null;
  var theCanvas;
  var images = new Array();
  var frames = (config.animationSpeed / 2) / extraConfig.interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.canvas2d_imageGrid
   * @this
   */
  imageGridInstance.init = function() {
    if (typeof(theCanvas) == 'undefined') {
      config.listContainer.append(
        onoPager.tools.createCanvas(config.listContainer.outerWidth(),
                                    config.listContainer.outerHeight()
        )
      );
    }
    theCanvas = config.listContainer.find('canvas')[0];
    theCanvas.style.position = 'static';
    context = theCanvas.getContext('2d');
    canvasWidth = context.canvas.width;
    canvasHeight = context.canvas.height;

    this._config.listItems.css(
      {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      }
    );
    jQuery(this._config.listItems[this._config.activeIndex]).show();
    
    preloadImages();
    
    // Preload all images that are needed for the transistions
    function preloadImages() {
      var imageTotal = 0;
      var imageCount = 0;
      
      if (extraConfig.freezeUntilImagesPreloaded == true) {
        config.listContainer.parent().addClass('onoPager_disabled');
      }
      imageTotal = config.listItems.filter('[data-onopagerbackgroundimage]').size();
      config.listItems.each(function() {
        if (jQuery(this).attr('data-onopagerbackgroundimage') == "") {
          images.push(null);
        } else {
          var img = new Image();
          if (extraConfig.freezeUntilImagesPreloaded == true) {
            img.addEventListener('load', imgCounter , false);
          }
          img.src = jQuery(this).attr('data-onopagerbackgroundimage');
          images.push(img);
        }
      });
      
      // Unlock pager if all images are either loaded or failed loading
      function imgCounter(e) {
        imageCount++;
        if (imageCount == imageTotal) {
          config.listContainer.parent().removeClass('onoPager_disabled');
          
          context.drawImage(images[config.activeIndex], 0, 0);
        }
      }
    }
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.canvas2d_imageGrid
   * @this
   */
  imageGridInstance.page = function(oldIndex, newIndex, direction) {
    init();

    // Runs animation
    function init() {
      if (drawInterval != null) {
        resetStage();
      }
      var contentFadeSpeed = config.animationSpeed/6
      var contentAniSpeedStart;
      var canvasAniSpeed = config.animationSpeed - (contentFadeSpeed * 2);

      config.listItems.stop(true, true)
                      .hide();
      if (timeouts.length == 0) {
        // There's no transition still in progress
        jQuery(config.listItems[oldIndex]).show()
                                          .fadeOut(contentFadeSpeed);
        contentAniSpeedStart = contentFadeSpeed;
      } else {
        contentAniSpeedStart = 0;
      }
      
      // Set variables
      var maxTransitionDimensions = getMaxTransitionDimensions();
      clearTimeouts(timeouts);
      timeouts = new Array();
      var min = Math.min(maxTransitionDimensions.width,
                         maxTransitionDimensions.height)
      min = Math.ceil(min / extraConfig.gridSize);
      var max = Math.max(maxTransitionDimensions.width,
                         maxTransitionDimensions.height)
      max = Math.ceil(max / extraConfig.gridSize);
      var loopTotal = (min + ((max - min) / 2)) * 2;
      console.log(min, max, loopTotal)
      var interval = canvasAniSpeed / loopTotal;
      
      // draws the image of the current list item
      context.drawImage(images[oldIndex], 0, 0);
      
      // Animates the image of the new list item
      timeouts.push(setTimeout(
        function() {
          for (var i = 0; i < loopTotal; i++) {
            // Draws the diagonal top-left / bottom right
            (function(i) {
              timeouts.push(setTimeout(
                function() {
                  context.drawImage(
                    images[newIndex],
                    i * extraConfig.gridSize,
                    i * extraConfig.gridSize,
                    extraConfig.gridSize,
                    extraConfig.gridSize,
                    i * extraConfig.gridSize,
                    i * extraConfig.gridSize,
                    extraConfig.gridSize,
                    extraConfig.gridSize
                  );
                },
                (i * interval)
              ));
    
              var total = i
              for (var ii = 0; ii <= total; ii++) {
                // After each block has been drawn of the diagonal
                // top-left / bottom right, a complete diagonal is drawn from
                // bottom-left to top-right.
                (function(ii) {
                  timeouts.push(setTimeout(
                    function() {
                      var x = (total - ii) * extraConfig.gridSize;
                      var y = ii * extraConfig.gridSize;
                      context.drawImage(
                        images[newIndex],
                        x,
                        y,
                        extraConfig.gridSize,
                        extraConfig.gridSize,
                        x,
                        y,
                        extraConfig.gridSize,
                        extraConfig.gridSize
                      );
                    },
                    ((i * interval) / 2)
                  ));
                })(ii);
              }
            })(i);
          }
        },
        contentAniSpeedStart
      ));
      
      timeouts.push(setTimeout(
        function() {
          jQuery(config.listItems[newIndex]).fadeIn(contentFadeSpeed);
          timeouts = new Array();
        },
        canvasAniSpeed
      ));

      function clearTimeouts(timeouts) {
        for (var i = 0; i < timeouts.length; i++){
          clearTimeout(timeouts[i]);
        };
      }
      
      function getMaxTransitionDimensions() {
        var dimensions = {};
        var oldListItem = jQuery(config.listItems[oldIndex]);
        var newListItem = jQuery(config.listItems[newIndex]);
        dimensions.width = Math.max(newListItem.outerWidth(true),
                                    config.listContainer.outerWidth(true));
        dimensions.height = Math.max(newListItem.outerHeight(true),
                                     config.listContainer.outerHeight(true));
        console.log(dimensions)
        return dimensions;
      }
    }

    function resetStage() {
      clearInterval(drawInterval);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.canvas2d_imageGrid
   * @this
   */
  imageGridInstance.pagerHover = function(move) {
    // Not implemented
  }

  return imageGridInstance;
};
