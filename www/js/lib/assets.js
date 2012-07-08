define(function() {
  // Load levels
  var levels = [
    {src: 'img/level1.png'}
  ];

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext("2d");
  for (var i in levels) {
    var level = levels[i];

    var img = new Image();
    img.onload = function() {
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(this, 0, 0);

      // Derive walls from image (black pixels are walls).
      var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var walls = [];
      for (var i = 0; i < pixels.length / 4; i++) {
        var black = (pixels[i * 4] === 0 &&
                     pixels[i * 4 + 1] === 0 &&
                     pixels[i * 4 + 2] === 0);
        if (black) {
          var x = i % canvas.width;
          var y = Math.floor(i / canvas.width);
          walls.push({x: x, y: y});
        }
        level.walls = walls;
      }
      level.loaded = true;
    };

    img.src = levels[i].src;
    levels.img = img;
  }

  return {
    levels: levels
  };
});