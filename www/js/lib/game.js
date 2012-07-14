/** Game loader and metadata. */

define(['assets'], function(assets) {
  // Global game metadata
  function Game() {
    // Directions
    this.dirs = {
      38: 1, // up
      39: 2, // right
      40: 3, // down
      37: 4 // left
    };

    // Block size (in pixels)
    this.blocksize = 13.8;

    // Game width and height (measured in blocks)
    this.height = 32;
    this.width = 32;

    // Background frame
    this.offset = {x: (assets.images['c64'].width - this.blocksize * this.width) / 2,
                   y: assets.images['c64'].offsetY};

    // Paused?
    this.paused = false;

    // Level index
    this.levelidx = 0;
  }

  // Coordinate helpers: Turns game coordinate into canvas coordinate.
  Game.prototype.cx = function(pos) {
    return this.offset.x + pos * this.blocksize;
  };
  Game.prototype.cy = function(pos) {
    return this.offset.y + pos * this.blocksize;
  };


  return new Game();
});
