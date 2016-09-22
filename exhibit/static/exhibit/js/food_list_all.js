$(document).ready(function() {
  addFoodAction();
  removeFoodAction();
});

var addFoodAction = function() {
  var addFoodBtns = $('.addFoodBtn');
  addFoodBtns.bind('tap', function() {
    var btn = $(this);
    var tr = $(this).parent().parent();
    var params = {};
    params['fid'] = $(tr.children()[0]).text();
    post('/food?action=add', params, function(msg) {
      btn.addClass('hide');
      btn.siblings('.removeFoodBtn').removeClass('hide');
      alert(msg);
    });
  });
}

var removeFoodAction = function() {
  var removeFoodBtns = $('.removeFoodBtn');
  removeFoodBtns.bind('tap', function() {
    var btn = $(this);
    var tr = $(this).parent().parent();
    var params = {};
    params['fid'] = $(tr.children()[0]).text();
    post('/food?action=remove', params, function(msg) {
      btn.addClass('hide');
      btn.siblings('.addFoodBtn').removeClass('hide');
      alert(msg);
    });
  });
}