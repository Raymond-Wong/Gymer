$(document).ready(function() {
  doRegistAction();
});

var doRegistAction = function() {
  $('button[type="submit"]').tap(function() {
    var params = {};
    params['account'] = $('input[name="account"]').val();
    params['nickname'] = $('input[name="nickname"]').val();
    params['password'] = $('input[name="password"]').val();
    post('/user?action=register', params, function(msg) {
      alert(msg);
    });
  });
}