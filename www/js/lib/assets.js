define(function() {
  // Asset types
  var levels = [
    {src: 'img/level1.png'},
    {src: 'img/level2.png',
     start: {x: 4, y: 15},
     dir: 3},
    {src: 'img/level3.png'}
  ];
  var images = {
    food: {src: 'img/apple.png'}
  };


  // Load levels
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext("2d");
  for (var i in levels) {
    var img = new Image();
    img.onload = function(img, level) {
      return function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

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
      }
    }(img, levels[i]);

    img.src = levels[i].src;
  }


  // Load other images
  for (var i in images) {
    var img = new Image();
    img.onload = function(thisimg) {
      return function() {
        thisimg.loaded = true;
      }
    }(images[i]);
    img.src = images[i].src;
    images[i].img = img;
  }


  return {
    levels: levels,
    images: images
  };
});