$(document).ready(function() {
  randomAddMealAction();
});

var randomAddMealAction = function() {
  var year = $('h1').attr('year');
  var month = $('h1').attr('month');
  var day = $('h1').attr('day');
  $('h1').removeAttr('year');
  $('h1').removeAttr('month');
  $('h1').removeAttr('day');
  $('.randomAddBtn').bind('tap', function() {
    var params = {};
    params['year'] = year;
    params['month'] = month;
    params['day'] = day;
    params['food_types'] = JSON.stringify($('input[name="food_types"]').val().split(','));
    params['name'] = $('input[name="name"]').val();
    post('/meal?action=add&type=random', params, function(msg) {
      alert(msg);
    });
  });
}