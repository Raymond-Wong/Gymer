$(document).ready(function() {
  doLoginAction();
});

var doLoginAction = function() {
  $('button[type="submit"]').tap(function() {
    var params = {};
    params['account'] = $('input[name="account"]').val();
    params['password'] = $('input[name="password"]').val();
    post('/user?action=login', params, function(msg) {
      alert(msg);
    });
  });
}