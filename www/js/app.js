require.config({
    paths: {'jquery': ['lib/jquery']}
});
var global = this;

require(['jquery'], function($) {
  // Setup requestAnimationFrame
  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  var animationFrameId;

  // Global game metadata
  var blocksize = 16;
  var game = {
    // Block width and height
    width: 32,
    height: 32,
    // Paused?
    paused: false
  };

  // Create the canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = game.width * blocksize;
  canvas.height = game.height * blocksize;
  document.getElementById('game').appendChild(canvas);

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
    this.speed = 3; // movement in blocks per second
    this.length = 8; // snake length
    this.dir = 2; // direction
    this.path = [{x: game.width / 2, y: game.height / 2}]; // Track snake's movement

    this.since_last_update = 0; // Time since last update
  }
  Snake.prototype.in_path = function(pos) {
    // Is this position somewhere in our path already?
    for (var i in this.path) {
      var p = this.path[i];
      if (pos.x == p.x && pos.y == p.y) return true;
    }
    return false;
  }
  var snake = new Snake();


  // Handle keyboard controls
  addEventListener("keydown", function(e) {
    // Pause / unpause?
    if (e.keyCode == 80) { // "p"
      pause();
      return;
    }

    // No other commands while paused.
    if (game.paused) return;

    // Handle direction changes.
    if (!(e.keyCode in dirs)) return;
    e.preventDefault();

    // Avoid opposite directions
    var opposites = {1: 3, 2: 4, 3: 1, 4: 2};
    if (dirs[e.keyCode] == opposites[snake.dir]) return;

    // Change direction of snake
    snake.dir = dirs[e.keyCode];
  }, false);


  // Reset game to original state
  function reset() {
    snake = new Snake();
  };


  // Update game objects
  function update(modifier) {
    snake.since_last_update += modifier;
    if (snake.since_last_update < 1000 / snake.speed) return;  // no update due yet

    // Update due
    snake.since_last_update -= 1000 / snake.speed;

    // Calculate new snake position.
    var old_pos = snake.path[snake.path.length - 1];
    var new_pos = {x: old_pos.x, y: old_pos.y};
    switch (snake.dir) {
      case 1: new_pos.y -= 1; break;
      case 2: new_pos.x += 1; break;
      case 3: new_pos.y += 1; break;
      case 4: new_pos.x -= 1; break;
    }

    // Did we run into a wall or ourselves?
    if (new_pos.x < 0 || new_pos.x >= game.width ||
        new_pos.y < 0 || new_pos.y >= game.height ||
        snake.in_path(new_pos)) {
      console.log('zomg');
      reset();
      return;
    }

    // Add new position to path, crop tail if snake length has been reached.
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


  // Pause the game.
  function pause(force) {
    if (animationFrameId || force) { // Pause
      game.paused = true;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else { // Unpause
      game.paused = false;
      then = Date.now(); // Reset.
      animationFrameId = requestAnimationFrame(main);
    }
  };
  // Pause when leaving the screen.
  window.addEventListener('blur', function() {pause(true)});


  // The main game loop
  function main() {
    var now = Date.now();
    var delta = now - then;

    update(delta);
    render();

    then = now;
    if (!game.paused) {
      animationFrameId = requestAnimationFrame(main);
    }
  };

  // Let's play this game!
  reset();
  var then = Date.now();
  // Execute as soon as possible
  main();

// End require.js
});
