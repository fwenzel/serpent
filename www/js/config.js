define(['zepto'], function($) {
  var speed = 5;
  var minspeed = 1;
  var maxspeed = 10;

  function changeSpeed(delta) {
    speed = Math.max(minspeed, Math.min(maxspeed, speed + delta));
    $('#speed').text(speed);
  }

  $('.changespeed').click(function(e) {
    e.preventDefault();
    changeSpeed(parseInt($(this).data('delta')));
  });

  return {
    getSpeed: function() { return speed; }
  };
});
