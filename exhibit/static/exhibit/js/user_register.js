$(document).ready(function() {
  doRegistAction();
  doLoginAction();
});

var doLoginAction = function() {
  $('button[type="signIn"]').tap(function() {
    window.location.href = '/user?action=login';
  });
}

var doRegistAction = function() {
  $('button[type="signUp"]').tap(function() {
    var params = {};
    params['account'] = $('input[name="account"]').val();
    params['nickname'] = $('input[name="nickname"]').val();
    params['password'] = $('input[name="password"]').val();
    post('/user?action=register', params, function(msg) {
      window.location.href = '/food?action=list&type=all';
    });
  });
}