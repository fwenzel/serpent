define(['zepto'], function($) {
  var minspeed = 1;
  var maxspeed = 10;
  var speed = parseInt(localStorage['speed']);

  if (!(speed >= minspeed && speed <= maxspeed))
    speed = 5;

  function changeSpeed(delta) {
    speed = Math.max(minspeed, Math.min(maxspeed, speed + delta));
    localStorage['speed'] = speed;
    $('#speed').text(speed);
  }
  changeSpeed(0); // initialize

  $('.changespeed').click(function(e) {
    e.preventDefault();
    changeSpeed(parseInt($(this).data('delta')));
  });

  return {
    getSpeed: function() { return speed; }
  };
});
