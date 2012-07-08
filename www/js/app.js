require.config({
    baseUrl: 'js/lib'
});
var global = this;

require(['jquery', 'assets', 'utils'], function($, assets, utils) {
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

  // Directions
  var dirs = {
    38: 1, // up
    39: 2, // right
    40: 3, // down
    37: 4 // left
  };

  // Game objects
  // Player
  function Snake() {
    this.speed = 5; // movement in blocks per second
    this.length = 8; // snake length
    this.dir = 2; // direction
    this.path = [{x: game.width / 2, y: game.height / 2}]; // Track snake's movement

    this.since_last_update = 0; // Time since last update
    this.dirchange = false; // direction change in progress?
  }
  var snake = new Snake();

  // Foodz
  function Food() {
    this.ttl = 60; // Food time to live.
    this.val = 5; // Growth value for snake when eaten.

    do {
      this.x = utils.getRandomInt(0, game.width - 1);
      this.y = utils.getRandomInt(0, game.height - 1);
    } while (is_collision(this));
  }
  Food.prototype.render = function() {
    if (!('loaded' in assets.images['food'])) return;
    ctx.drawImage(assets.images['food'].img, this.x * blocksize, this.y * blocksize);
  }
  var food = []; // List of food items on the screen.


  // Collision detection
  function is_collision(pos) {
    var paths = [snake.path, assets.levels[0].walls];
    for (var p in paths) {
      var path = paths[p];
      for (var i in path) {
        if (pos.x == path[i].x && pos.y == path[i].y) return true;
      }
    }
    return false;
  }


  // Handle keyboard controls
  addEventListener("keydown", function(e) {
    // Pause / unpause?
    if (e.keyCode == 80) { // "p"
      pause();
      return;
    }

    // No other commands while paused or while direction change already in progress.
    if (game.paused || snake.dirchange) return;

    // Handle direction changes.
    if (!(e.keyCode in dirs)) return;
    e.preventDefault();

    // Avoid opposite directions
    var opposites = {1: 3, 2: 4, 3: 1, 4: 2};
    if (dirs[e.keyCode] == opposites[snake.dir]) return;

    // Change direction of snake
    snake.dirchange = true;
    snake.dir = dirs[e.keyCode];
  }, false);


  // Reset game to original state
  function reset() {
    snake = new Snake();
    food = [];
  };


  // Update game objects
  function update(modifier) {
    snake.since_last_update += modifier;
    if (snake.since_last_update < 1000 / snake.speed) return;  // no update due yet

    // Update due
    snake.since_last_update -= 1000 / snake.speed;

    // Age all food items, remove "expired" ones.
    for (var i in food) {
      food[i].ttl -= 1;
    }
    food = food.filter(function(item) { return item.ttl > 0; })

    // Add some food? (nom). But no more than 3.
    if (food.length < 3 && Math.random() < (.08 / (food.length + 1))) {
      food.push(new Food());
    }

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
    if (is_collision(new_pos)) {
      console.log('zomg');
      reset();
      return;
    }

    // Nom nom nom
    for (var i in food) {
      if (food[i].x == new_pos.x && food[i].y == new_pos.y) {
        snake.length += food[i].val;
        food.splice(i, 1); // Remove this.
        break;
      }
    }

    // Add new position to path, crop tail if snake length has been reached.
    snake.path.push(new_pos);
    if (snake.path.length > snake.length) {
      snake.path.shift();
    }

    // Allow next direction change.
    snake.dirchange = false;
  };


  // Draw everything
  function render() {
    // Empty the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if ('loaded' in assets.levels[0]) {
      ctx.fillStyle = "#777";
      for (var i in assets.levels[0].walls) {
        ctx.fillRect(assets.levels[0].walls[i].x * blocksize,
                     assets.levels[0].walls[i].y * blocksize,
                     blocksize, blocksize);
      }
    }

    // Draw food items
    for (var i in food) food[i].render();

    // Draw snake
    ctx.fillStyle = "rgb(200, 0, 0)";
    for (var i in snake.path) {
      ctx.fillRect(snake.path[i].x * blocksize, snake.path[i].y * blocksize,
                   blocksize, blocksize);
    }

    // Pause message?
    if (game.paused) {
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.font = "bold 24px Helvetica";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
    }
  };


  // Pause the game.
  function pause(force) {
    if (animationFrameId || force) { // Pause
      game.paused = true;
      animationFrameId = null;
    } else { // Unpause
      game.paused = false;
      then = Date.now(); // Reset.
      animationFrameId = requestAnimationFrame(main);
    }
  };
  // Pause when leaving the screen.
  window.addEventListener('blur', function() { pause(true); });


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
