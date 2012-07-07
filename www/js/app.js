
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define
//
// You don't have to use require.js, and you can delete all of this if
// you aren't (make sure to uncomment the script tags in index.html also)


// Set the path to jQuery, which will fall back to the local version
// if google is down
require.config({
    paths: {'jquery':
            ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
             'lib/jquery']}
});

var global = this;

require(['jquery'], function($) {
  // Setup requestAnimationFrame
  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  // Define grid
  var blocksize = 16;
  var grid = {
    width: 32,
    height: 32
  };

  // Create the canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = grid.width * blocksize;
  canvas.height = grid.height * blocksize;
  document.body.appendChild(canvas);

  // Background image
  var bgReady = false;
  var bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "img/background.png";

  // Directions
  var dirs = {
    38: 1, // up
    39: 2, // right
    40: 3, // down
    37: 4 // left
  };

  // Game objects
  var snake = {
    speed: 1, // movement in blocks per second
    length: 8, // snake length
    dir: 1 // direction
  };

  // Handle keyboard controls
  var keysDown = {};

  addEventListener("keydown", function (e) {
    // Change direction of snake
    if (e.keyCode in dirs) {
      snake.dir = dirs[e.keyCode];
    }
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  // Reset game to original state
  function reset() {
    snake.x = grid.width / 2;
    snake.y = grid.height / 2;
  };

  // Update game objects
  function update(modifier) {

    // Are they touching?
    if (false) {
      reset();
    }
  };

  // Draw everything
  function render() {
    /*
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    */

    // draw snake
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(snake.x * blocksize, snake.y * blocksize, blocksize, blocksize);
    //ctx.drawImage(heroImage, hero.x, hero.y);

    /*if (monsterReady) {
      ctx.drawImage(monsterImage, monster.x, monster.y);
    }*/

    // Score
    /*
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
    */
  };

  // The main game loop
  var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
    requestAnimationFrame(main);
  };

  // Let's play this game!
  reset();
  var then = Date.now();
  // Execute as fast as possible
  main();

});

// END REQUIRE.JS CODE
// Remove all of this if not using require.js
