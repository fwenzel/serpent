require.config({
    paths: {'jquery': ['lib/jquery']}
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
  function Snake() {
    this.speed = 2.5; // movement in blocks per second
    this.length = 8; // snake length
    this.dir = 2; // direction
    this.path = [{x: grid.width / 2, y: grid.height / 2}]; // Track snake's movement
  }
  Snake.prototype.in_path = function(pos) {
    for (var i in this.path) {
      var p = this.path[i];
      if (pos.x == p.x && pos.y == p.y) return true;
    }
    return false;
  }
  var snake = new Snake();

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
    snake = new Snake();
  };

  // Update game objects
  var since_last_update = 0; // Time since last update
  function update(modifier) {
    since_last_update += modifier;
    if (since_last_update < 1000 / snake.speed) return;  // no update yet

    // Update due
    since_last_update -= 1000 / snake.speed;

    // Calculate new snake position.
    var old_pos = snake.path[snake.path.length - 1];
    var new_pos = {x: old_pos.x, y: old_pos.y};
    switch (snake.dir) {
      case 1: new_pos.y -= 1; break;
      case 2: new_pos.x += 1; break;
      case 3: new_pos.y += 1; break;
      case 4: new_pos.x -= 1; break;
    }

    // Did we run into a wall?
    if (new_pos.x < 0 || new_pos.x >= grid.width ||
        new_pos.y < 0 || new_pos.y >= grid.height ||
        snake.in_path(new_pos)) {
      console.log('zomg');
      reset();
      return;
    }

    // Add new position to path, delete tail if snake length has been reached.
    snake.path.push(new_pos);
    if (snake.path.length > snake.length) {
      snake.path.shift();
    }

  };

  // Draw everything
  function render() {
    // Empty the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "rgb(200,0,0)";
    for (var i in snake.path) {
      ctx.fillRect(snake.path[i].x * blocksize, snake.path[i].y * blocksize,
                   blocksize, blocksize);
    }
  };

  // The main game loop
  var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta);
    render();

    then = now;
    requestAnimationFrame(main);
  };

  // Let's play this game!
  reset();
  var then = Date.now();
  // Execute as fast as possible
  main();


// End require.js
});
