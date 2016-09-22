$(document).ready(function() {
  removeFoodAction();
});

var removeFoodAction = function() {
  var removeFoodBtns = $('.removeFoodBtn');
  removeFoodBtns.bind('tap', function() {
    var tr = $(this).parent().parent();
    var params = {};
    params['fid'] = $(tr.children()[0]).text();
    post('/food?action=remove', params, function(msg) {
      tr.remove();
      alert(msg);
    });
  });
}